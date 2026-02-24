const aiService = require('./aiService');

// Prompts matcher (formulaire structure)
const { buildPrompt: buildMatcherCvPersoPrompt } = require('../prompts/matcherCvPersonnalise');
const { buildPrompt: buildMatcherCvIdealPrompt } = require('../prompts/matcherCvIdeal');
const { buildPrompt: buildMatcherLettrePrompt } = require('../prompts/matcherLettre');

// Prompts scraper (texte brut depuis URL)
const { buildPrompt: buildScraperCvPersoPrompt } = require('../prompts/scraperCvPersonnalise');
const { buildPrompt: buildScraperCvIdealPrompt } = require('../prompts/scraperCvIdeal');
const { buildPrompt: buildScraperLettrePrompt } = require('../prompts/scraperLettre');

// Prompt extraction candidat depuis PDF
const { buildPrompt: buildExtractCandidatPrompt } = require('../prompts/extractCandidatFromCV');

// Schemas JSON
const { personalizedCVToJSON, idealCVToJSON, coverLetterToJSON } = require('../prompts/jsonSchemas');

/**
 * Service de matching d'offres d'emploi
 * Retourne du texte structuré (plus de PDF)
 */
class MatcherService {
  /**
   * Analyser une offre et générer les documents sélectionnés
   * @returns {Object} Les données structurées (texte, score, modifications)
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
        promises.push(
          this.scraperPersonalizedCVWorkflow(rawText, url, candidate)
            .then(data => { results.personalizedCV = data; })
        );
      }

      if (generateIdealCV) {
        promises.push(
          this.scraperIdealCVWorkflow(rawText, url)
            .then(data => { results.idealCV = data; })
        );
      }

      if (generateCoverLetter) {
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

    return {
      score_matching: result.score_matching || 0,
      modifications_apportees: result.modifications_apportees || [],
      cvData: result.personalizedCV
    };
  }

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

    return { cvData: result.idealCV };
  }

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

    return { letterData: result.coverLetter };
  }

  // ========================================
  // WORKFLOWS MATCHER (formulaire structure)
  // ========================================

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

    return {
      score_matching: result.score_matching || 0,
      modifications_apportees: result.modifications_apportees || [],
      cvData: result.personalizedCV
    };
  }

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

    return { cvData: result.idealCV };
  }

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

    return { letterData: result.coverLetter };
  }

  /**
   * Extraire le profil candidat depuis le texte brut d'un CV (mode rapide)
   */
  async extractCandidateFromPDF(cvText) {
    console.log('🔍 [MatcherService] Extraction du profil candidat depuis le CV PDF...');

    const prompt = buildExtractCandidatPrompt(cvText);
    const result = await aiService.generateJSON(prompt, { model: 'gpt-4.1-mini' });

    if (!result.prenom && !result.nom) {
      throw new Error('Impossible d\'extraire les informations du candidat depuis le CV');
    }

    console.log('✅ [MatcherService] Profil extrait :', result.prenom, result.nom);
    return this.formatCandidateData(result);
  }

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
