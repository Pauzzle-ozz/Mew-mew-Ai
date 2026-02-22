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

/**
 * Regenerer le contenu pour une seule plateforme
 * POST /api/marketing/redacteur/regenerer-plateforme
 */
router.post('/regenerer-plateforme', async (req, res) => {
  try {
    const { brief, platform } = req.body;

    if (!brief || !platform) {
      return res.status(400).json({
        success: false,
        error: 'Les champs "brief" et "platform" sont requis'
      });
    }

    console.log(`🔄 [Redacteur] Regeneration pour : ${platform}`);

    const result = await marketingService.regenerateSinglePlatform(brief, platform);

    res.json({ success: true, data: result });

  } catch (error) {
    console.error('❌ [Redacteur] Erreur regeneration:', error.message);

    if (error.status === 429) {
      return res.status(503).json({
        success: false,
        error: 'Service IA temporairement surcharge. Reessayez dans quelques instants.'
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors de la regeneration'
    });
  }
});

/**
 * Suggerer des mots-cles IA
 * POST /api/marketing/redacteur/suggerer-mots-cles
 */
router.post('/suggerer-mots-cles', async (req, res) => {
  try {
    const { subject, targetAudience } = req.body;

    if (!subject) {
      return res.status(400).json({
        success: false,
        error: 'Le champ "subject" est requis'
      });
    }

    console.log(`🔑 [Redacteur] Suggestion mots-cles pour : ${subject}`);

    const result = await marketingService.suggestKeywords(subject, targetAudience);

    res.json({ success: true, data: result });

  } catch (error) {
    console.error('❌ [Redacteur] Erreur suggestion mots-cles:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors de la suggestion de mots-cles'
    });
  }
});

module.exports = router;
