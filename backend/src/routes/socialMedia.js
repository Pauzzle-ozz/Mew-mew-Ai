const express = require('express');
const router = express.Router();
const socialKeysService = require('../services/socialKeysService');
const socialPublishService = require('../services/socialPublishService');

/**
 * Sauvegarder les cles d'une plateforme
 * POST /api/social-media/keys
 */
router.post('/keys', async (req, res) => {
  try {
    const { userId, platform, credentials } = req.body;

    if (!userId || !platform || !credentials) {
      return res.status(400).json({
        success: false,
        error: 'Les champs "userId", "platform" et "credentials" sont requis'
      });
    }

    const result = await socialKeysService.saveKeys(userId, platform, credentials);

    res.json({ success: true, data: result });

  } catch (error) {
    console.error('❌ [SocialMedia] Erreur sauvegarde cles:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors de la sauvegarde des cles'
    });
  }
});

/**
 * Lister les plateformes connectees d'un utilisateur
 * GET /api/social-media/keys/:userId
 */
router.get('/keys/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const keys = await socialKeysService.getAllKeys(userId);

    res.json({ success: true, data: keys });

  } catch (error) {
    console.error('❌ [SocialMedia] Erreur liste cles:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors de la recuperation des cles'
    });
  }
});

/**
 * Supprimer les cles d'une plateforme
 * DELETE /api/social-media/keys/:userId/:platform
 */
router.delete('/keys/:userId/:platform', async (req, res) => {
  try {
    const { userId, platform } = req.params;
    await socialKeysService.deleteKeys(userId, platform);

    res.json({ success: true, message: `Cles ${platform} supprimees` });

  } catch (error) {
    console.error('❌ [SocialMedia] Erreur suppression:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors de la suppression'
    });
  }
});

/**
 * Tester la connexion d'une plateforme
 * POST /api/social-media/test
 */
router.post('/test', async (req, res) => {
  try {
    const { userId, platform } = req.body;

    if (!userId || !platform) {
      return res.status(400).json({
        success: false,
        error: 'Les champs "userId" et "platform" sont requis'
      });
    }

    const result = await socialPublishService.testConnection(userId, platform);

    res.json({ success: true, data: result });

  } catch (error) {
    console.error('❌ [SocialMedia] Erreur test connexion:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Connexion echouee. Verifiez vos cles API.'
    });
  }
});

/**
 * Publier du contenu sur une plateforme
 * POST /api/social-media/publish
 */
router.post('/publish', async (req, res) => {
  try {
    const { userId, platform, content, imageUrl } = req.body;

    if (!userId || !platform || !content) {
      return res.status(400).json({
        success: false,
        error: 'Les champs "userId", "platform" et "content" sont requis'
      });
    }

    console.log(`📤 [SocialMedia] Publication sur ${platform} (user: ${userId.substring(0, 8)}...)`);

    const result = await socialPublishService.publish(userId, platform, content, imageUrl);

    res.json({ success: true, data: result });

  } catch (error) {
    console.error('❌ [SocialMedia] Erreur publication:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors de la publication'
    });
  }
});

module.exports = router;
