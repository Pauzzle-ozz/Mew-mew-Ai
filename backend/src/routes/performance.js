const express = require('express');
const router = express.Router();
const marketingService = require('../services/marketingService');

/**
 * Analyser les performances de contenu marketing
 * POST /api/marketing/performance/analyser
 */
router.post('/analyser', async (req, res) => {
  try {
    const { metricsData } = req.body;

    if (!metricsData) {
      return res.status(400).json({
        success: false,
        error: 'Le champ "metricsData" est requis'
      });
    }

    // Au moins les stats brutes ou une metrique structuree
    const hasRawStats = metricsData.rawStats && metricsData.rawStats.trim().length > 0;
    const nonMetricFields = ['platform', 'contentType', 'period', 'sector', 'rawStats'];
    const hasStructured = Object.entries(metricsData).some(
      ([key, val]) => !nonMetricFields.includes(key) && val && String(val).trim().length > 0
    );

    if (!hasRawStats && !hasStructured) {
      return res.status(400).json({
        success: false,
        error: 'Fournissez des metriques (stats brutes ou champs structures)'
      });
    }

    console.log(`📊 [Performance] Analyse des performances (plateforme: ${metricsData.platform || 'non precise'})`);

    const result = await marketingService.analyzePerformance(metricsData);

    res.json({ success: true, data: result });

  } catch (error) {
    console.error('❌ [Performance] Erreur analyse:', error.message);

    if (error.status === 429) {
      return res.status(503).json({
        success: false,
        error: 'Service IA temporairement surcharge. Reessayez dans quelques instants.'
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors de l\'analyse des performances',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

module.exports = router;
