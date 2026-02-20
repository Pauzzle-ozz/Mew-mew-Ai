const express = require('express');
const router = express.Router();
const contentCreatorService = require('../services/contentCreatorService');

/**
 * Generer du contenu depuis un brief
 * POST /api/marketing/createur/generer
 */
router.post('/generer', async (req, res) => {
  try {
    const { brief, platforms, contentType } = req.body;

    if (!brief || !platforms || !contentType) {
      return res.status(400).json({
        success: false,
        error: 'Les champs "brief", "platforms" et "contentType" sont requis'
      });
    }

    console.log(`🎨 [Createur] Generation ${contentType} pour : ${platforms.join(', ')}`);

    const result = await contentCreatorService.generateContent(brief, platforms, contentType);

    res.json({ success: true, data: result });

  } catch (error) {
    console.error('❌ [Createur] Erreur generation:', error.message);

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
 * Recreer du contenu depuis une URL
 * POST /api/marketing/createur/recreer
 */
router.post('/recreer', async (req, res) => {
  try {
    const { url, platforms, contentType, brief } = req.body;

    if (!url || !platforms || !contentType || !brief) {
      return res.status(400).json({
        success: false,
        error: 'Les champs "url", "platforms", "contentType" et "brief" sont requis'
      });
    }

    console.log(`🔄 [Createur] Recreation depuis ${url} pour : ${platforms.join(', ')}`);

    const result = await contentCreatorService.recreateFromUrl(url, platforms, contentType, brief);

    res.json({ success: true, data: result });

  } catch (error) {
    console.error('❌ [Createur] Erreur recreation:', error.message);

    if (error.status === 429) {
      return res.status(503).json({
        success: false,
        error: 'Service IA temporairement surcharge. Reessayez dans quelques instants.'
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors de la recreation du contenu',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

/**
 * Generer une image via DALL-E
 * POST /api/marketing/createur/image
 */
router.post('/image', async (req, res) => {
  try {
    const { brief, platform, contentType } = req.body;

    if (!brief || !platform || !contentType) {
      return res.status(400).json({
        success: false,
        error: 'Les champs "brief", "platform" et "contentType" sont requis'
      });
    }

    console.log(`🖼️ [Createur] Generation image pour ${platform}`);

    const result = await contentCreatorService.generateImage(brief, platform, contentType);

    res.json({ success: true, data: result });

  } catch (error) {
    console.error('❌ [Createur] Erreur image:', error.message);

    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors de la generation de l\'image',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

/**
 * Sauvegarder une creation
 * POST /api/marketing/createur/sauvegarder
 */
router.post('/sauvegarder', async (req, res) => {
  try {
    const { userId, title, contentType, platforms, brief, sourceUrl, generatedContent, generatedImages, status } = req.body;

    if (!userId || !generatedContent) {
      return res.status(400).json({
        success: false,
        error: 'Les champs "userId" et "generatedContent" sont requis'
      });
    }

    const result = await contentCreatorService.saveCreation(userId, {
      title, contentType, platforms, brief, sourceUrl, generatedContent, generatedImages, status
    });

    res.json({ success: true, data: result });

  } catch (error) {
    console.error('❌ [Createur] Erreur sauvegarde:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors de la sauvegarde'
    });
  }
});

/**
 * Lister les creations d'un utilisateur
 * GET /api/marketing/createur/historique/:userId
 */
router.get('/historique/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { contentType, status, limit, offset } = req.query;

    const creations = await contentCreatorService.getUserCreations(userId, {
      contentType,
      status,
      limit: limit ? parseInt(limit) : 20,
      offset: offset ? parseInt(offset) : 0
    });

    res.json({ success: true, data: creations });

  } catch (error) {
    console.error('❌ [Createur] Erreur historique:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors de la recuperation de l\'historique'
    });
  }
});

/**
 * Recuperer une creation par ID
 * GET /api/marketing/createur/:creationId
 */
router.get('/:creationId', async (req, res) => {
  try {
    const { creationId } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'Le parametre "userId" est requis'
      });
    }

    const creation = await contentCreatorService.getCreation(creationId, userId);

    res.json({ success: true, data: creation });

  } catch (error) {
    console.error('❌ [Createur] Erreur recuperation:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors de la recuperation'
    });
  }
});

/**
 * Mettre a jour une creation
 * PUT /api/marketing/createur/:creationId
 */
router.put('/:creationId', async (req, res) => {
  try {
    const { creationId } = req.params;
    const { userId, title, status, generatedImages } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'Le champ "userId" est requis'
      });
    }

    const result = await contentCreatorService.updateCreation(creationId, userId, {
      title, status, generatedImages
    });

    res.json({ success: true, data: result });

  } catch (error) {
    console.error('❌ [Createur] Erreur mise a jour:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors de la mise a jour'
    });
  }
});

/**
 * Supprimer une creation
 * DELETE /api/marketing/createur/:creationId
 */
router.delete('/:creationId', async (req, res) => {
  try {
    const { creationId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'Le champ "userId" est requis'
      });
    }

    await contentCreatorService.deleteCreation(creationId, userId);

    res.json({ success: true, message: 'Creation supprimee' });

  } catch (error) {
    console.error('❌ [Createur] Erreur suppression:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors de la suppression'
    });
  }
});

module.exports = router;
