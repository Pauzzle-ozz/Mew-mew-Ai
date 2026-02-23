const express = require('express');
const router = express.Router();
const marketingService = require('../services/marketingService');

/**
 * Generer une strategie de contenu / calendrier editorial 30 jours
 * POST /api/marketing/strategie/generer
 */
router.post('/generer', async (req, res) => {
  try {
    const { sector, targetAudience, objectives, channels, brandVoice, budget, startDate } = req.body;

    if (!sector || !targetAudience || !objectives || !channels) {
      return res.status(400).json({
        success: false,
        error: 'Les champs "sector", "targetAudience", "objectives" et "channels" sont requis'
      });
    }

    console.log(`📅 [Strategie] Generation calendrier 30j pour ${channels.length} canaux (debut: ${startDate || 'auto'})`);

    const result = await marketingService.generateContentStrategy({
      sector,
      targetAudience,
      objectives,
      channels,
      brandVoice,
      budget,
      startDate: startDate || new Date().toISOString().split('T')[0]
    });

    res.json({ success: true, data: result });

  } catch (error) {
    console.error('❌ [Strategie] Erreur:', error.message);

    if (error.status === 429) {
      return res.status(503).json({
        success: false,
        error: 'Service IA temporairement surcharge. Reessayez dans quelques instants.'
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors de la generation de la strategie',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

module.exports = router;
