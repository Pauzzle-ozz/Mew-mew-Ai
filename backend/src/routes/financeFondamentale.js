const express = require('express');
const router = express.Router();
const fondamentaleService = require('../services/fondamentaleService');

/**
 * Analyse fondamentale d'un actif
 * POST /api/finance/fondamentale
 */
router.post('/', async (req, res) => {
  try {
    const { actif, type_actif, marche } = req.body;

    if (!actif || typeof actif !== 'string' || !actif.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Le nom ou ticker de l\'actif est requis (ex: AAPL, BTC-USD, Tesla)'
      });
    }

    console.log(`📈 [Finance] Requete analyse fondamentale : ${actif}`);

    const result = await fondamentaleService.analyser({ actif, type_actif, marche });

    res.json({ success: true, data: result });

  } catch (error) {
    console.error('❌ [Finance] Erreur fondamentale:', error.message);

    if (error.status === 429) {
      return res.status(503).json({
        success: false,
        error: 'Service IA temporairement surcharge. Reessayez dans quelques instants.'
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors de l\'analyse fondamentale',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

module.exports = router;
