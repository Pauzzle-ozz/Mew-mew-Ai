const express = require('express');
const router = express.Router();
const seoService = require('../services/seoService');

/**
 * Audit SEO complet d'un site web
 * POST /api/marketing/seo/audit
 */
router.post('/audit', async (req, res) => {
  try {
    const { url, maxPages } = req.body;

    if (!url || typeof url !== 'string' || !url.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Le champ "url" est requis'
      });
    }

    // Valider l'URL
    try {
      const parsed = new URL(url.trim());
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        throw new Error();
      }
    } catch {
      return res.status(400).json({
        success: false,
        error: 'URL invalide. Format attendu : https://example.com'
      });
    }

    const pages = Math.min(Math.max(parseInt(maxPages) || 10, 1), 10);

    console.log(`🔍 [SEO] Lancement audit SEO de ${url} (max ${pages} pages)`);

    const result = await seoService.auditSeo(url.trim(), pages);

    res.json({ success: true, data: result });

  } catch (error) {
    console.error('❌ [SEO] Erreur audit:', error.message);

    if (error.status === 429) {
      return res.status(503).json({
        success: false,
        error: 'Service IA temporairement surcharge. Reessayez dans quelques instants.'
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors de l\'audit SEO',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

module.exports = router;
