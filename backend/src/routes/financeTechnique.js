const express = require('express');
const router = express.Router();
const techniqueService = require('../services/techniqueService');

/**
 * Analyse technique d'un actif
 * POST /api/finance/technique
 */
router.post('/', async (req, res) => {
  try {
    const { actif, type_actif, periode } = req.body;

    if (!actif || typeof actif !== 'string' || !actif.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Le ticker de l\'actif est requis (ex: AAPL, BTC-USD, MSFT)'
      });
    }

    const validPeriodes = ['1m', '3m', '6m', '1y', '5y'];
    if (periode && !validPeriodes.includes(periode)) {
      return res.status(400).json({
        success: false,
        error: `Periode invalide. Valeurs acceptees : ${validPeriodes.join(', ')}`
      });
    }

    console.log(`📉 [Finance] Requete analyse technique : ${actif} sur ${periode || '6m'}`);

    const result = await techniqueService.analyser({ actif, type_actif, periode });

    res.json({ success: true, data: result });

  } catch (error) {
    console.error('❌ [Finance] Erreur technique:', error.message);

    if (error.status === 429) {
      return res.status(503).json({
        success: false,
        error: 'Service IA temporairement surcharge. Reessayez dans quelques instants.'
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors de l\'analyse technique',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

module.exports = router;
