const axios = require('axios');

/**
 * Service de gestion des CV
 * Centralise toute la logique métier liée aux CV
 */
class CVService {
  constructor() {
    this.n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    this.n8nWebhookPdfUrl = process.env.N8N_WEBHOOK_PDF_URL;
    this.n8nWebhookOptiUrl = process.env.N8N_WEBHOOK_OPTIMISER_URL;
    this.n8nSecret = process.env.N8N_SECRET_KEY;
    this.timeout = 60000; // 60 secondes
  }

  /**
   * Valider les données d'un CV
   */
  validateCVData(cvData) {
    if (!cvData) {
      throw new Error('Données du CV requises');
    }

    if (!cvData.prenom || !cvData.nom || !cvData.titre_poste) {
      throw new Error('Prénom, nom et titre du poste sont obligatoires');
    }

    return true;
  }

  /**
   * Analyser un CV avec formulaire structuré
   */
  async analyzeCV(cvData) {
    console.log('🔍 [CVService] Analyse du CV:', cvData.prenom, cvData.nom);

    const response = await axios.post(
      this.n8nWebhookUrl,
      cvData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.n8nSecret}`
        },
        timeout: this.timeout
      }
    );

    return response.data;
  }

  /**
   * Analyser un CV à partir d'un PDF
   */
  async analyzePDF(cvText, numPages, userId) {
    console.log('🔍 [CVService] Analyse PDF, pages:', numPages);

    const response = await axios.post(
      this.n8nWebhookPdfUrl,
      {
        userId,
        cv_texte_complet: cvText,
        nombre_pages: numPages
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.n8nSecret}`
        },
        timeout: this.timeout
      }
    );

    return response.data;
  }

  /**
   * Optimiser un CV avec l'IA
   */
  async optimizeCV(cvData) {
    console.log('🤖 [CVService] Optimisation du CV:', cvData.prenom, cvData.nom);

    this.validateCVData(cvData);

    const response = await axios.post(
      this.n8nWebhookOptiUrl,
      { cvData },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.n8nSecret}`
        },
        timeout: this.timeout
      }
    );

    if (!response.data.success || !response.data.cvData_optimise) {
      throw new Error('n8n n\'a pas retourné de données optimisées valides');
    }

    return response.data;
  }
}

module.exports = new CVService();
