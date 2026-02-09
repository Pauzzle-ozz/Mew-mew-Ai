const express = require('express');
const router = express.Router();

// Import des services
const matcherService = require('../services/matcherService');

/**
 * ========================================
 * ROUTES MATCHER D'OFFRES
 * ========================================
 */

/**
 * Analyser une offre et générer les documents sélectionnés
 * POST /api/matcher/analyser
 *
 * Body: {
 *   offer: { title, company, location, contract_type, salary, description },
 *   candidate: { prenom, nom, titre_poste, experiences, formations, competences_techniques, competences_soft, langues },
 *   options: { generatePersonalizedCV, generateIdealCV, generateCoverLetter } (optionnel)
 * }
 */
router.post('/analyser', async (req, res) => {
  try {
    const { offer, candidate, options } = req.body;

    console.log('🎯 [MATCHER] Début analyse offre + génération documents...');
    console.log('📋 Offre:', offer.title, 'chez', offer.company);
    console.log('👤 Candidat:', candidate.prenom, candidate.nom);
    console.log('⚙️ Options:', options || { generatePersonalizedCV: true, generateIdealCV: true, generateCoverLetter: true });

    // Validation des données
    if (!offer || !candidate) {
      return res.status(400).json({
        success: false,
        error: 'Données de l\'offre et du candidat requises'
      });
    }

    // Validation de l'offre
    if (!offer.title || !offer.company || !offer.description) {
      return res.status(400).json({
        success: false,
        error: 'Titre du poste, entreprise et description de l\'offre sont obligatoires'
      });
    }

    // Validation du candidat
    if (!candidate.prenom || !candidate.nom || !candidate.titre_poste) {
      return res.status(400).json({
        success: false,
        error: 'Prénom, nom et titre du poste du candidat sont obligatoires'
      });
    }

    // Appel au service pour analyser + générer les documents (avec options)
    const result = await matcherService.analyzeAndGenerate(offer, candidate, options);

    console.log('✅ [MATCHER] Analyse et génération terminées avec succès');

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('❌ [MATCHER] Erreur:', error.message);

    // Gestion erreur n8n indisponible
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        error: 'Service d\'analyse indisponible (n8n non accessible)'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Impossible d\'analyser l\'offre et de générer les documents',
      details: error.message
    });
  }
});

/**
 * Route de test (santé du service)
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'matcher',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
