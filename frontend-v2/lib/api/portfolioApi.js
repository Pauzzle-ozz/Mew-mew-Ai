/**
 * API centralisée pour les Portfolios
 * Toutes les requêtes HTTP pour les portfolios passent par ici
 */

const API_BASE_URL = 'http://localhost:5001/api/portfolio';

export const portfolioApi = {
  
  // ==========================================
  // PORTFOLIOS
  // ==========================================

  /**
   * Créer un nouveau portfolio
   */
  async createPortfolio(userId, title, description = '', template = 'moderne') {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, title, description, template })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la création');
    }

    return response.json();
  },

  /**
   * Récupérer tous les portfolios d'un utilisateur
   */
  async getUserPortfolios(userId) {
    const response = await fetch(`${API_BASE_URL}/user/${userId}`);

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des portfolios');
    }

    return response.json();
  },

  /**
   * Récupérer un portfolio par ID (pour l'éditeur)
   */
  async getPortfolio(portfolioId, userId) {
    const response = await fetch(`${API_BASE_URL}/${portfolioId}?userId=${userId}`);

    if (!response.ok) {
      throw new Error('Portfolio non trouvé');
    }

    return response.json();
  },

  /**
   * Récupérer un portfolio public par slug
   */
  async getPublicPortfolio(slug) {
    const response = await fetch(`${API_BASE_URL}/public/${slug}`);

    if (!response.ok) {
      throw new Error('Portfolio non trouvé');
    }

    return response.json();
  },

  /**
   * Mettre à jour un portfolio
   */
  async updatePortfolio(portfolioId, userId, data) {
    const response = await fetch(`${API_BASE_URL}/${portfolioId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...data })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la mise à jour');
    }

    return response.json();
  },

  /**
   * Supprimer un portfolio
   */
  async deletePortfolio(portfolioId, userId) {
    const response = await fetch(`${API_BASE_URL}/${portfolioId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la suppression');
    }

    return response.json();
  },

  /**
   * Publier / Dépublier un portfolio
   */
  async togglePublish(portfolioId, userId, published) {
    return this.updatePortfolio(portfolioId, userId, { published });
  },

  // ==========================================
  // PROTECTION PAR MOT DE PASSE
  // ==========================================

  /**
   * Définir ou modifier le mot de passe d'un portfolio
   */
  async setPassword(portfolioId, userId, password) {
    const response = await fetch(`${API_BASE_URL}/${portfolioId}/password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la définition du mot de passe');
    }

    return response.json();
  },

  /**
   * Supprimer la protection par mot de passe
   */
  async removePassword(portfolioId, userId) {
    const response = await fetch(`${API_BASE_URL}/${portfolioId}/password`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la suppression du mot de passe');
    }

    return response.json();
  },

  /**
   * Vérifier le mot de passe d'un portfolio public
   */
  async verifyPassword(slug, password) {
    const response = await fetch(`${API_BASE_URL}/public/${slug}/verify-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Mot de passe incorrect');
    }

    return response.json();
  },

  // ==========================================
  // EXPORT PDF
  // ==========================================

  /**
   * Exporter un portfolio en PDF (proprietaire)
   */
  async exportPDF(portfolioId, userId) {
    const response = await fetch(`${API_BASE_URL}/${portfolioId}/export-pdf?userId=${userId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de l\'export PDF');
    }

    return response.json();
  },

  /**
   * Exporter un portfolio public en PDF (par slug)
   */
  async exportPublicPDF(slug) {
    const response = await fetch(`${API_BASE_URL}/public/${slug}/export-pdf`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de l\'export PDF');
    }

    return response.json();
  },

  // ==========================================
  // BLOCS
  // ==========================================

  /**
   * Ajouter un bloc
   */
  async addBlock(portfolioId, userId, type, content = {}) {
    const response = await fetch(`${API_BASE_URL}/${portfolioId}/blocks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, type, content })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de l\'ajout du bloc');
    }

    return response.json();
  },

  /**
   * Mettre à jour un bloc
   */
  async updateBlock(blockId, userId, data) {
    const response = await fetch(`${API_BASE_URL}/blocks/${blockId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...data })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la mise à jour du bloc');
    }

    return response.json();
  },

  /**
   * Supprimer un bloc
   */
  async deleteBlock(blockId, userId) {
    const response = await fetch(`${API_BASE_URL}/blocks/${blockId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la suppression du bloc');
    }

    return response.json();
  },

  /**
   * Réorganiser les blocs
   */
  async reorderBlocks(portfolioId, userId, blocksOrder) {
    const response = await fetch(`${API_BASE_URL}/${portfolioId}/blocks/reorder`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, blocksOrder })
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la réorganisation');
    }

    return response.json();
  },

  // ==========================================
  // MÉDIAS
  // ==========================================

  /**
   * Upload un média (image ou vidéo)
   */
  async uploadMedia(portfolioId, userId, file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);

    const response = await fetch(`${API_BASE_URL}/${portfolioId}/media`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de l\'upload');
    }

    return response.json();
  },

  /**
   * Récupérer les médias d'un portfolio
   */
  async getMedia(portfolioId) {
    const response = await fetch(`${API_BASE_URL}/${portfolioId}/media`);

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des médias');
    }

    return response.json();
  },

  /**
   * Supprimer un média
   */
  async deleteMedia(mediaId, userId) {
    const response = await fetch(`${API_BASE_URL}/media/${mediaId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la suppression du média');
    }

    return response.json();
  }
};