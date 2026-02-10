const aiService = require('./aiService');
const pdfService = require('./pdfService');
const templateFactory = require('../templates/templateFactory');
const letterTemplateFactory = require('../templates/letterTemplateFactory');

// Prompts matcher (formulaire structure)
const { buildPrompt: buildMatcherCvPersoPrompt } = require('../prompts/matcherCvPersonnalise');
const { buildPrompt: buildMatcherCvIdealPrompt } = require('../prompts/matcherCvIdeal');
const { buildPrompt: buildMatcherLettrePrompt } = require('../prompts/matcherLettre');

// Prompts scraper (texte brut depuis URL)
const { buildPrompt: buildScraperCvPersoPrompt } = require('../prompts/scraperCvPersonnalise');
const { buildPrompt: buildScraperCvIdealPrompt } = require('../prompts/scraperCvIdeal');
const { buildPrompt: buildScraperLettrePrompt } = require('../prompts/scraperLettre');

// Schemas JSON
const { personalizedCVToJSON, idealCVToJSON, coverLetterToJSON } = require('../prompts/jsonSchemas');

/**
 * Service de matching d'offres d'emploi
 * Centralise la logique d'analyse et de génération de documents personnalisés
 */
class MatcherService {
  /**
   * Analyser une offre et générer les documents sélectionnés
   * @param {Object} offer - Données de l'offre d'emploi
   * @param {Object} candidate - Données du candidat
   * @param {Object} options - Options de génération { generatePersonalizedCV, generateIdealCV, generateCoverLetter }
   * @returns {Object} Les PDFs en base64 (uniquement ceux demandés)
   */
  async analyzeAndGenerate(offer, candidate, options = {}) {
    const {
      generatePersonalizedCV = true,
      generateIdealCV = true,
      generateCoverLetter = true
    } = options;

    console.log('🤖 [MatcherService] Options de génération:', {
      personalizedCV: generatePersonalizedCV,
      idealCV: generateIdealCV,
      coverLetter: generateCoverLetter
    });

    try {
      const results = {};
      const promises = [];

      // Appels IA en parallèle (uniquement ceux demandés)
      if (generatePersonalizedCV) {
        console.log('📄 [MatcherService] Génération CV personnalisé...');
        promises.push(
          this.generatePersonalizedCVWorkflow(offer, candidate)
            .then(data => { results.personalizedCV = data; })
        );
      }

      if (generateIdealCV) {
        console.log('📄 [MatcherService] Génération CV idéal...');
        promises.push(
          this.generateIdealCVWorkflow(offer)
            .then(data => { results.idealCV = data; })
        );
      }

      if (generateCoverLetter) {
        console.log('📄 [MatcherService] Génération lettre de motivation...');
        promises.push(
          this.generateCoverLetterWorkflow(offer, candidate)
            .then(data => { results.coverLetter = data; })
        );
      }

      // Attendre tous les workflows en parallèle
      await Promise.all(promises);

      console.log('✅ [MatcherService] Tous les documents générés avec succès');

      return results;

    } catch (error) {
      console.error('❌ [MatcherService] Erreur:', error.message);
      throw error;
    }
  }

  /**
   * Générer les documents à partir du texte brut scrapé (mode URL)
   * @param {string} rawText - Texte brut extrait de la page web
   * @param {string} url - URL source de l'offre
   * @param {Object} candidate - Données du candidat
   * @param {Object} options - Options de génération
   * @returns {Object} Les PDFs en base64 (uniquement ceux demandés)
   */
  async scrapeAndGenerate(rawText, url, candidate, options = {}) {
    const {
      generatePersonalizedCV = true,
      generateIdealCV = true,
      generateCoverLetter = true
    } = options;

    console.log('🔗 [MatcherService] Mode scraper - Options:', {
      personalizedCV: generatePersonalizedCV,
      idealCV: generateIdealCV,
      coverLetter: generateCoverLetter,
      textLength: rawText.length
    });

    try {
      const results = {};
      const promises = [];

      if (generatePersonalizedCV) {
        console.log('📄 [MatcherService] Scraper → CV personnalisé...');
        promises.push(
          this.scraperPersonalizedCVWorkflow(rawText, url, candidate)
            .then(data => { results.personalizedCV = data; })
        );
      }

      if (generateIdealCV) {
        console.log('📄 [MatcherService] Scraper → CV idéal...');
        promises.push(
          this.scraperIdealCVWorkflow(rawText, url)
            .then(data => { results.idealCV = data; })
        );
      }

      if (generateCoverLetter) {
        console.log('📄 [MatcherService] Scraper → Lettre de motivation...');
        promises.push(
          this.scraperCoverLetterWorkflow(rawText, url, candidate)
            .then(data => { results.coverLetter = data; })
        );
      }

      await Promise.all(promises);

      console.log('✅ [MatcherService] Tous les documents générés (mode scraper)');
      return results;

    } catch (error) {
      console.error('❌ [MatcherService] Erreur scraper:', error.message);
      throw error;
    }
  }

  // ========================================
  // WORKFLOWS SCRAPER (texte brut depuis URL)
  // ========================================

  /**
   * Scraper → CV personnalisé via IA
   */
  async scraperPersonalizedCVWorkflow(rawText, url, candidate) {
    console.log('📡 [MatcherService] IA scraper CV personnalisé');

    const formattedCandidate = this.formatCandidateData(candidate);
    const genPrompt = buildScraperCvPersoPrompt(rawText, url, formattedCandidate);
    const jsonPrompt = personalizedCVToJSON('{{GENERATED_TEXT}}');

    const result = await aiService.generateThenConvert(
      genPrompt, jsonPrompt,
      { model: 'gpt-4o', temperature: 0.7, maxTokens: 2000 },
      { model: 'gpt-4.1-mini' }
    );

    if (!result.personalizedCV) {
      throw new Error('L\'IA n\'a pas retourné le CV personnalisé (scraper)');
    }

    const html = templateFactory.getTemplate('moderne', result.personalizedCV);
    const pdfBuffer = await pdfService.generatePDF(html);

    return {
      pdf: pdfBuffer.toString('base64'),
      filename: `CV_${candidate.prenom}_${candidate.nom}_Scraper`.replace(/[^a-zA-Z0-9_-]/g, '_')
    };
  }

  /**
   * Scraper → CV idéal via IA
   */
  async scraperIdealCVWorkflow(rawText, url) {
    console.log('📡 [MatcherService] IA scraper CV idéal');

    const genPrompt = buildScraperCvIdealPrompt(rawText, url);
    const jsonPrompt = idealCVToJSON('{{GENERATED_TEXT}}');

    const result = await aiService.generateThenConvert(
      genPrompt, jsonPrompt,
      { model: 'gpt-4o', temperature: 0.7, maxTokens: 2000 },
      { model: 'gpt-4.1-mini' }
    );

    if (!result.idealCV) {
      throw new Error('L\'IA n\'a pas retourné le CV idéal (scraper)');
    }

    const html = templateFactory.getTemplate('moderne', result.idealCV);
    const pdfBuffer = await pdfService.generatePDF(html);

    return {
      pdf: pdfBuffer.toString('base64'),
      filename: `CV_Ideal_Scraper`.replace(/[^a-zA-Z0-9_-]/g, '_')
    };
  }

  /**
   * Scraper → Lettre de motivation via IA
   */
  async scraperCoverLetterWorkflow(rawText, url, candidate) {
    console.log('📡 [MatcherService] IA scraper lettre');

    const formattedCandidate = this.formatCandidateData(candidate);
    const genPrompt = buildScraperLettrePrompt(rawText, url, formattedCandidate);
    const jsonPrompt = coverLetterToJSON('{{GENERATED_TEXT}}');

    const result = await aiService.generateThenConvert(
      genPrompt, jsonPrompt,
      { model: 'gpt-4o', temperature: 0.7, maxTokens: 1500 },
      { model: 'gpt-4.1-mini' }
    );

    if (!result.coverLetter) {
      throw new Error('L\'IA n\'a pas retourné la lettre de motivation (scraper)');
    }

    const html = letterTemplateFactory.getTemplate(result.coverLetter, candidate, {});
    const pdfBuffer = await pdfService.generatePDF(html);

    return {
      pdf: pdfBuffer.toString('base64'),
      filename: `Lettre_Motivation_${candidate.prenom}_${candidate.nom}_Scraper`.replace(/[^a-zA-Z0-9_-]/g, '_')
    };
  }

  // ========================================
  // WORKFLOWS MATCHER (formulaire structure)
  // ========================================

  /**
   * Générer le CV personnalisé via IA
   */
  async generatePersonalizedCVWorkflow(offer, candidate) {
    console.log('📡 [MatcherService] IA CV personnalisé');

    const formattedOffer = this.formatOfferData(offer);
    const formattedCandidate = this.formatCandidateData(candidate);
    const genPrompt = buildMatcherCvPersoPrompt(formattedOffer, formattedCandidate);
    const jsonPrompt = personalizedCVToJSON('{{GENERATED_TEXT}}');

    const result = await aiService.generateThenConvert(
      genPrompt, jsonPrompt,
      { model: 'gpt-4o', temperature: 0.7, maxTokens: 2000 },
      { model: 'gpt-4.1-mini' }
    );

    if (!result.personalizedCV) {
      throw new Error('L\'IA n\'a pas retourné le CV personnalisé');
    }

    // Générer le PDF
    const html = templateFactory.getTemplate('moderne', result.personalizedCV);
    const pdfBuffer = await pdfService.generatePDF(html);

    return {
      pdf: pdfBuffer.toString('base64'),
      filename: `CV_${candidate.prenom}_${candidate.nom}_${offer.company}`.replace(/[^a-zA-Z0-9_-]/g, '_')
    };
  }

  /**
   * Générer le CV idéal via IA
   */
  async generateIdealCVWorkflow(offer) {
    console.log('📡 [MatcherService] IA CV idéal');

    const formattedOffer = this.formatOfferData(offer);
    const genPrompt = buildMatcherCvIdealPrompt(formattedOffer);
    const jsonPrompt = idealCVToJSON('{{GENERATED_TEXT}}');

    const result = await aiService.generateThenConvert(
      genPrompt, jsonPrompt,
      { model: 'gpt-4o', temperature: 0.7, maxTokens: 2000 },
      { model: 'gpt-4.1-mini' }
    );

    if (!result.idealCV) {
      throw new Error('L\'IA n\'a pas retourné le CV idéal');
    }

    // Générer le PDF
    const html = templateFactory.getTemplate('moderne', result.idealCV);
    const pdfBuffer = await pdfService.generatePDF(html);

    return {
      pdf: pdfBuffer.toString('base64'),
      filename: `CV_Ideal_${offer.company}_${offer.title}`.replace(/[^a-zA-Z0-9_-]/g, '_')
    };
  }

  /**
   * Générer la lettre de motivation via IA
   */
  async generateCoverLetterWorkflow(offer, candidate) {
    console.log('📡 [MatcherService] IA lettre de motivation');

    const formattedOffer = this.formatOfferData(offer);
    const formattedCandidate = this.formatCandidateData(candidate);
    const genPrompt = buildMatcherLettrePrompt(formattedOffer, formattedCandidate);
    const jsonPrompt = coverLetterToJSON('{{GENERATED_TEXT}}');

    const result = await aiService.generateThenConvert(
      genPrompt, jsonPrompt,
      { model: 'gpt-4o', temperature: 0.7, maxTokens: 1500 },
      { model: 'gpt-4.1-mini' }
    );

    if (!result.coverLetter) {
      throw new Error('L\'IA n\'a pas retourné la lettre de motivation');
    }

    // Générer le PDF
    const html = letterTemplateFactory.getTemplate(result.coverLetter, candidate, offer);
    const pdfBuffer = await pdfService.generatePDF(html);

    return {
      pdf: pdfBuffer.toString('base64'),
      filename: `Lettre_Motivation_${candidate.prenom}_${candidate.nom}_${offer.company}`.replace(/[^a-zA-Z0-9_-]/g, '_')
    };
  }

  /**
   * Formater les données de l'offre
   */
  formatOfferData(offer) {
    return {
      title: offer.title,
      company: offer.company,
      location: offer.location || '',
      contract_type: offer.contract_type || '',
      salary: offer.salary || '',
      description: offer.description
    };
  }

  /**
   * Formater les données du candidat
   */
  formatCandidateData(candidate) {
    return {
      prenom: candidate.prenom,
      nom: candidate.nom,
      titre_poste: candidate.titre_poste,
      email: candidate.email || '',
      telephone: candidate.telephone || '',
      adresse: candidate.adresse || '',
      linkedin: candidate.linkedin || '',
      resume: candidate.resume || '',
      experiences: candidate.experiences || [],
      formations: candidate.formations || [],
      competences_techniques: candidate.competences_techniques || '',
      competences_soft: candidate.competences_soft || '',
      langues: candidate.langues || ''
    };
  }

}

module.exports = new MatcherService();
