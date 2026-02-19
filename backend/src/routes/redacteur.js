const express = require('express');
const router = express.Router();
const marketingService = require('../services/marketingService');

/**
 * Generer du contenu multi-format
 * POST /api/marketing/redacteur/generer
 */
router.post('/generer', async (req, res) => {
  try {
    const { brief, platforms } = req.body;

    if (!brief || !platforms) {
      return res.status(400).json({
        success: false,
        error: 'Les champs "brief" et "platforms" sont requis'
      });
    }

    console.log(`📢 [Redacteur] Generation pour plateformes : ${platforms.join(', ')}`);

    const result = await marketingService.generateMultiFormatContent(brief, platforms);

    res.json({ success: true, data: result });

  } catch (error) {
    console.error('❌ [Redacteur] Erreur:', error.message);

    if (error.status === 429) {
      return res.status(503).json({
        success: false,
        error: 'Service IA temporairement surcharge. Reessayez dans quelques instants.'
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors de la generation du contenu',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

module.exports = router;
