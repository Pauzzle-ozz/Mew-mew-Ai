const axios = require('axios');
const pdfService = require('./pdfService');
const templateFactory = require('../templates/templateFactory');
const letterTemplateFactory = require('../templates/letterTemplateFactory');

/**
 * Service de matching d'offres d'emploi
 * Centralise la logique d'analyse et de génération de documents personnalisés
 */
class MatcherService {
  constructor() {
    // Webhooks séparés (nouveaux)
    this.n8nWebhookCVPersonnalise = process.env.N8N_WEBHOOK_MATCHER_CV_PERSONNALISE;
    this.n8nWebhookCVIdeal = process.env.N8N_WEBHOOK_MATCHER_CV_IDEAL;
    this.n8nWebhookLettre = process.env.N8N_WEBHOOK_MATCHER_LETTRE;

    this.n8nSecret = process.env.N8N_SECRET_KEY;
    this.timeout = 60000; // 60 secondes par webhook
  }

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

      // Appels n8n en parallèle (uniquement ceux demandés)
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
   * Générer le CV personnalisé via n8n
   */
  async generatePersonalizedCVWorkflow(offer, candidate) {
    console.log('📡 [MatcherService] Appel webhook CV personnalisé:', this.n8nWebhookCVPersonnalise);

    const response = await axios.post(
      this.n8nWebhookCVPersonnalise,
      {
        offer: this.formatOfferData(offer),
        candidate: this.formatCandidateData(candidate)
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.n8nSecret}`
        },
        timeout: this.timeout
      }
    );

    if (!response.data || !response.data.personalizedCV) {
      throw new Error('n8n n\'a pas retourné le CV personnalisé');
    }

    // Générer le PDF
    const html = templateFactory.getTemplate('moderne', response.data.personalizedCV);
    const pdfBuffer = await pdfService.generatePDF(html);

    return {
      pdf: pdfBuffer.toString('base64'),
      filename: `CV_${candidate.prenom}_${candidate.nom}_${offer.company}`.replace(/[^a-zA-Z0-9_-]/g, '_')
    };
  }

  /**
   * Générer le CV idéal via n8n
   */
  async generateIdealCVWorkflow(offer) {
    console.log('📡 [MatcherService] Appel webhook CV idéal:', this.n8nWebhookCVIdeal);

    const response = await axios.post(
      this.n8nWebhookCVIdeal,
      {
        offer: this.formatOfferData(offer)
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.n8nSecret}`
        },
        timeout: this.timeout
      }
    );

    if (!response.data || !response.data.idealCV) {
      throw new Error('n8n n\'a pas retourné le CV idéal');
    }

    // Générer le PDF
    const html = templateFactory.getTemplate('moderne', response.data.idealCV);
    const pdfBuffer = await pdfService.generatePDF(html);

    return {
      pdf: pdfBuffer.toString('base64'),
      filename: `CV_Ideal_${offer.company}_${offer.title}`.replace(/[^a-zA-Z0-9_-]/g, '_')
    };
  }

  /**
   * Générer la lettre de motivation via n8n
   */
  async generateCoverLetterWorkflow(offer, candidate) {
    console.log('📡 [MatcherService] Appel webhook lettre:', this.n8nWebhookLettre);

    const response = await axios.post(
      this.n8nWebhookLettre,
      {
        offer: this.formatOfferData(offer),
        candidate: this.formatCandidateData(candidate)
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.n8nSecret}`
        },
        timeout: this.timeout
      }
    );

    if (!response.data || !response.data.coverLetter) {
      throw new Error('n8n n\'a pas retourné la lettre de motivation');
    }

    // Générer le PDF
    const html = letterTemplateFactory.getTemplate(response.data.coverLetter, candidate, offer);
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
