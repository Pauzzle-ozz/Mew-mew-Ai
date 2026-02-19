const express = require('express');
const router = express.Router();
const concurrenceService = require('../services/concurrenceService');

/**
 * Analyser un ou plusieurs concurrents
 * POST /api/marketing/concurrence/analyser
 */
router.post('/analyser', async (req, res) => {
  try {
    const { competitors, sector } = req.body;

    if (!sector) {
      return res.status(400).json({
        success: false,
        error: 'Le champ "sector" est requis'
      });
    }

    if (!competitors || !Array.isArray(competitors) || competitors.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Le champ "competitors" (tableau) est requis avec au moins un concurrent'
      });
    }

    console.log(`🔎 [Concurrence] Analyse de ${competitors.length} concurrent(s) dans ${sector}`);

    const analyses = await concurrenceService.analyzeMultiple(competitors, sector);

    res.json({ success: true, data: { analyses } });

  } catch (error) {
    console.error('❌ [Concurrence] Erreur analyse:', error.message);

    if (error.status === 429) {
      return res.status(503).json({
        success: false,
        error: 'Service IA temporairement surcharge. Reessayez dans quelques instants.'
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors de l\'analyse concurrentielle',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

/**
 * Generer un benchmark comparatif
 * POST /api/marketing/concurrence/benchmark
 */
router.post('/benchmark', async (req, res) => {
  try {
    const { analyses, sector } = req.body;

    if (!analyses || !Array.isArray(analyses) || analyses.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Au moins 2 analyses sont requises pour un benchmark'
      });
    }

    if (!sector) {
      return res.status(400).json({
        success: false,
        error: 'Le champ "sector" est requis'
      });
    }

    console.log(`📊 [Concurrence] Benchmark pour ${analyses.length} concurrents`);

    const benchmark = await concurrenceService.generateBenchmark(analyses, sector);

    res.json({ success: true, data: benchmark });

  } catch (error) {
    console.error('❌ [Concurrence] Erreur benchmark:', error.message);

    if (error.status === 429) {
      return res.status(503).json({
        success: false,
        error: 'Service IA temporairement surcharge. Reessayez dans quelques instants.'
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors de la generation du benchmark',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

module.exports = router;
