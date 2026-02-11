/**
 * API centralisée pour les appels backend
 * Toutes les requêtes HTTP passent par ici
 */

const API_BASE_URL = 'http://localhost:5000/api/solutions';

export const cvApi = {
  /**
   * Analyser un CV avec formulaire structuré
   */
  async analyzeCV(cvData) {
    const response = await fetch(`${API_BASE_URL}/analyse-cv`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cvData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de l\'analyse');
    }

    return response.json();
  },

  /**
   * Analyser un CV PDF complet
   */
  async analyzePDF(file, userId) {
    const formData = new FormData();
    formData.append('cv', file);
    formData.append('userId', userId);

    const response = await fetch(`${API_BASE_URL}/analyse-cv-pdf-complete`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'analyse du PDF');
    }

    return response.json();
  },

  /**
   * Extraire un CV PDF (sans analyse)
   */
  async extractCV(file) {
    const formData = new FormData();
    formData.append('cv', file);

    const response = await fetch(`${API_BASE_URL}/extraire-cv`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'extraction du PDF');
    }

    return response.json();
  },

  /**
   * Optimiser un CV avec l'IA
   */
  async optimizeCV(cvData) {
    const response = await fetch(`${API_BASE_URL}/optimiser-cv`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cvData })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de l\'optimisation');
    }

    return response.json();
  },

/**
   * Générer un CV (PDF uniquement)
   */
  async generateCV(cvData, templateOrConfig) {
    const body = typeof templateOrConfig === 'string'
      ? { cvData, template: templateOrConfig }
      : { cvData, buildConfig: templateOrConfig };
    const response = await fetch(`${API_BASE_URL}/generer-cv`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la génération du CV');
    }

    return response.json();
  },

  /**
   * Optimiser un CV via formulaire structuré
   */
  async optimizeCVForm(cvData, userId, posteCible) {
    const response = await fetch(`${API_BASE_URL}/optimiser-cv-formulaire`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cvData, userId, posteCible: posteCible || undefined })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de l\'optimisation');
    }

    return response.json();
  },

  /**
   * Optimiser un CV via upload PDF
   */
  async optimizeCVPDF(file, userId, posteCible) {
    const formData = new FormData();
    formData.append('cv', file);
    formData.append('userId', userId);
    if (posteCible) formData.append('posteCible', posteCible);

    const response = await fetch(`${API_BASE_URL}/optimiser-cv-pdf`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'optimisation du PDF');
    }

    return response.json();
  }
};