const express = require('express');
const router = express.Router();
const veilleService = require('../services/veilleService');

/**
 * Niveau 1 : Identifier les sources media d'un secteur
 * POST /api/marketing/veille/sources
 */
router.post('/sources', async (req, res) => {
  try {
    const { sector, country, keywords } = req.body;

    if (!sector || !country) {
      return res.status(400).json({
        success: false,
        error: 'Les champs "sector" et "country" sont requis'
      });
    }

    console.log(`📡 [Veille] Identification sources : ${sector} / ${country}`);

    const result = await veilleService.identifySources(sector, country, keywords);

    res.json({ success: true, data: result });

  } catch (error) {
    console.error('❌ [Veille] Erreur sources:', error.message);

    if (error.status === 429) {
      return res.status(503).json({
        success: false,
        error: 'Service IA temporairement surcharge. Reessayez dans quelques instants.'
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors de l\'identification des sources',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

/**
 * Niveau 2 : Analyser les sources en profondeur (scraping + tendances)
 * POST /api/marketing/veille/analyser
 */
router.post('/analyser', async (req, res) => {
  try {
    const { sector, sources } = req.body;

    if (!sector || !sources || !Array.isArray(sources) || sources.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Les champs "sector" et "sources" (tableau) sont requis'
      });
    }

    console.log(`🔍 [Veille] Analyse approfondie de ${sources.length} sources`);

    const result = await veilleService.deepAnalyze(sector, sources);

    res.json({ success: true, data: result });

  } catch (error) {
    console.error('❌ [Veille] Erreur analyse:', error.message);

    if (error.status === 429) {
      return res.status(503).json({
        success: false,
        error: 'Service IA temporairement surcharge. Reessayez dans quelques instants.'
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors de l\'analyse approfondie',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

module.exports = router;
