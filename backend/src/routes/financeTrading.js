const express = require('express');
const router = express.Router();
const tradingService = require('../services/tradingService');

/**
 * Analyse complete d'un actif (fondamentale + technique + trading)
 * POST /api/finance/trading/analyser
 */
router.post('/analyser', async (req, res) => {
  try {
    const { actif, type_actif, capital_disponible, tolerance_risque, horizon } = req.body;

    if (!actif || typeof actif !== 'string' || !actif.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Le ticker de l\'actif est requis'
      });
    }

    const validTolerances = ['conservateur', 'modere', 'agressif'];
    if (tolerance_risque && !validTolerances.includes(tolerance_risque)) {
      return res.status(400).json({
        success: false,
        error: `Tolerance invalide. Valeurs acceptees : ${validTolerances.join(', ')}`
      });
    }

    console.log(`🤖 [Trading] Requete analyse trading : ${actif} (${tolerance_risque || 'modere'})`);

    const result = await tradingService.analyserActif({
      actif, type_actif, capital_disponible, tolerance_risque, horizon
    });

    res.json({ success: true, data: result });

  } catch (error) {
    console.error('❌ [Trading] Erreur analyse:', error.message);

    if (error.status === 429) {
      return res.status(503).json({
        success: false,
        error: 'Service IA temporairement surcharge. Reessayez dans quelques instants.'
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors de l\'analyse trading',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

/**
 * Analyse d'un portefeuille complet
 * POST /api/finance/trading/portefeuille
 */
router.post('/portefeuille', async (req, res) => {
  try {
    const { positions, capital_total, objectif } = req.body;

    if (!positions || !Array.isArray(positions) || positions.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Au moins une position est requise. Format : [{ actif, type, quantite, prix_achat }]'
      });
    }

    console.log(`📊 [Trading] Requete analyse portefeuille : ${positions.length} positions`);

    const result = await tradingService.analyserPortefeuille({
      positions, capital_total, objectif
    });

    res.json({ success: true, data: result });

  } catch (error) {
    console.error('❌ [Trading] Erreur portefeuille:', error.message);

    if (error.status === 429) {
      return res.status(503).json({
        success: false,
        error: 'Service IA temporairement surcharge. Reessayez dans quelques instants.'
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors de l\'analyse du portefeuille',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

module.exports = router;
