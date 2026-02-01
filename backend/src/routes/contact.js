const express = require('express');
const router = express.Router();
const emailService = require('../services/emailService');

/**
 * Envoyer un email depuis le formulaire de contact
 * POST /api/contact/send
 */
router.post('/send', async (req, res) => {
  try {
    const { name, email, message, portfolioOwnerEmail, portfolioTitle } = req.body;

    console.log('📧 [API Contact] Réception formulaire:', { name, email });

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Nom, email et message sont obligatoires'
      });
    }

    if (!portfolioOwnerEmail) {
      return res.status(400).json({
        success: false,
        error: 'Email du propriétaire requis'
      });
    }

    // Envoyer l'email
    const result = await emailService.sendContactEmail({
      name,
      email,
      message,
      portfolioOwnerEmail,
      portfolioTitle
    });

    res.json({
      success: true,
      message: 'Email envoyé avec succès',
      data: result
    });

  } catch (error) {
    console.error('❌ [API Contact] Erreur:', error.message);
    res.status(500).json({
      success: false,
      error: 'Impossible d\'envoyer l\'email'
    });
  }
});

module.exports = router;