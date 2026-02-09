const express = require('express');
const multer = require('multer');
const router = express.Router();

// Import des services
const portfolioService = require('../services/portfolioService');
const pdfService = require('../services/pdfService');
const portfolioTemplate = require('../templates/portfolioTemplate');

// Configuration multer pour upload fichiers (50MB max pour vidéos)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/webm'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non supporté. Utilisez JPG, PNG, GIF, WEBP, MP4 ou WEBM.'));
    }
  }
});

// ==========================================
// ROUTES PORTFOLIOS
// ==========================================

/**
 * Créer un nouveau portfolio
 * POST /api/portfolio
 */
router.post('/', async (req, res) => {
  try {
    const { userId, title, description, template } = req.body;

    if (!userId || !title) {
      return res.status(400).json({
        success: false,
        error: 'userId et title sont obligatoires'
      });
    }

    const portfolio = await portfolioService.createPortfolio(userId, {
      title,
      description,
      template
    });

    res.json({
      success: true,
      data: portfolio
    });

  } catch (error) {
    console.error('❌ [API Portfolio] Erreur création:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Récupérer tous les portfolios d'un utilisateur
 * GET /api/portfolio/user/:userId
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const portfolios = await portfolioService.getUserPortfolios(userId);

    res.json({
      success: true,
      data: portfolios
    });

  } catch (error) {
    console.error('❌ [API Portfolio] Erreur récupération:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==========================================
// ROUTES PROTECTION PAR MOT DE PASSE
// ==========================================

/**
 * Définir ou modifier le mot de passe d'un portfolio
 * PUT /api/portfolio/:portfolioId/password
 */
router.put('/:portfolioId/password', async (req, res) => {
  try {
    const { portfolioId } = req.params;
    const { userId, password } = req.body;

    if (!userId || !password) {
      return res.status(400).json({
        success: false,
        error: 'userId et password sont obligatoires'
      });
    }

    if (password.length < 4) {
      return res.status(400).json({
        success: false,
        error: 'Le mot de passe doit contenir au moins 4 caractères'
      });
    }

    const result = await portfolioService.setPortfolioPassword(portfolioId, userId, password);

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('❌ [API Portfolio] Erreur définition mot de passe:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Supprimer la protection par mot de passe
 * DELETE /api/portfolio/:portfolioId/password
 */
router.delete('/:portfolioId/password', async (req, res) => {
  try {
    const { portfolioId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId requis'
      });
    }

    const result = await portfolioService.removePortfolioPassword(portfolioId, userId);

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('❌ [API Portfolio] Erreur suppression mot de passe:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Vérifier le mot de passe d'un portfolio public
 * POST /api/portfolio/public/:slug/verify-password
 */
router.post('/public/:slug/verify-password', async (req, res) => {
  try {
    const { slug } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        error: 'Le mot de passe est requis'
      });
    }

    const portfolio = await portfolioService.verifyPortfolioPassword(slug, password);

    res.json({
      success: true,
      data: portfolio
    });

  } catch (error) {
    console.error('❌ [API Portfolio] Erreur vérification mot de passe:', error.message);
    const status = error.message === 'Mot de passe incorrect' ? 401 : 500;
    res.status(status).json({
      success: false,
      error: error.message
    });
  }
});

// ==========================================
// ROUTES EXPORT PDF
// ==========================================

/**
 * Exporter un portfolio en PDF (pour le proprietaire)
 * GET /api/portfolio/:portfolioId/export-pdf?userId=xxx
 */
router.get('/:portfolioId/export-pdf', async (req, res) => {
  try {
    const { portfolioId } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId requis'
      });
    }

    console.log('📄 [API Portfolio] Export PDF pour:', portfolioId);

    const portfolio = await portfolioService.getFullPortfolio(portfolioId, userId);
    const html = portfolioTemplate.generateHTML(portfolio);
    const pdfBuffer = await pdfService.generatePDF(html);
    const pdfBase64 = pdfBuffer.toString('base64');

    const slug = portfolio.slug || 'portfolio';
    res.json({
      success: true,
      data: {
        pdf: pdfBase64,
        filename: `Portfolio_${slug}`
      }
    });

  } catch (error) {
    console.error('❌ [API Portfolio] Erreur export PDF:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Exporter un portfolio public en PDF (par slug)
 * GET /api/portfolio/public/:slug/export-pdf
 */
router.get('/public/:slug/export-pdf', async (req, res) => {
  try {
    const { slug } = req.params;

    console.log('📄 [API Portfolio] Export PDF public pour:', slug);

    const portfolio = await portfolioService.getFullPortfolioBySlug(slug);

    if (portfolio.is_protected) {
      return res.status(403).json({
        success: false,
        error: 'Ce portfolio est protege par un mot de passe'
      });
    }

    const html = portfolioTemplate.generateHTML(portfolio);
    const pdfBuffer = await pdfService.generatePDF(html);
    const pdfBase64 = pdfBuffer.toString('base64');

    res.json({
      success: true,
      data: {
        pdf: pdfBase64,
        filename: `Portfolio_${slug}`
      }
    });

  } catch (error) {
    console.error('❌ [API Portfolio] Erreur export PDF public:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==========================================
// ROUTES PORTFOLIOS (suite)
// ==========================================

/**
 * Récupérer un portfolio par ID (pour l'éditeur)
 * GET /api/portfolio/:portfolioId
 */
router.get('/:portfolioId', async (req, res) => {
  try {
    const { portfolioId } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId requis'
      });
    }

    const portfolio = await portfolioService.getFullPortfolio(portfolioId, userId);

    res.json({
      success: true,
      data: portfolio
    });

  } catch (error) {
    console.error('❌ [API Portfolio] Erreur:', error.message);
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Récupérer un portfolio public par slug
 * GET /api/portfolio/public/:slug
 */
router.get('/public/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const portfolio = await portfolioService.getFullPortfolioBySlug(slug);

    res.json({
      success: true,
      data: portfolio
    });

  } catch (error) {
    console.error('❌ [API Portfolio] Portfolio public non trouvé:', error.message);
    res.status(404).json({
      success: false,
      error: 'Portfolio non trouvé'
    });
  }
});

/**
 * Mettre à jour un portfolio
 * PUT /api/portfolio/:portfolioId
 */
router.put('/:portfolioId', async (req, res) => {
  try {
    const { portfolioId } = req.params;
    const { userId, ...updateData } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId requis'
      });
    }

    const portfolio = await portfolioService.updatePortfolio(portfolioId, userId, updateData);

    res.json({
      success: true,
      data: portfolio
    });

  } catch (error) {
    console.error('❌ [API Portfolio] Erreur mise à jour:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Supprimer un portfolio
 * DELETE /api/portfolio/:portfolioId
 */
router.delete('/:portfolioId', async (req, res) => {
  try {
    const { portfolioId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId requis'
      });
    }

    await portfolioService.deletePortfolio(portfolioId, userId);

    res.json({
      success: true,
      message: 'Portfolio supprimé'
    });

  } catch (error) {
    console.error('❌ [API Portfolio] Erreur suppression:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==========================================
// ROUTES BLOCS
// ==========================================

/**
 * Ajouter un bloc à un portfolio
 * POST /api/portfolio/:portfolioId/blocks
 */
router.post('/:portfolioId/blocks', async (req, res) => {
  try {
    const { portfolioId } = req.params;
    const { userId, type, content, order } = req.body;

    if (!userId || !type) {
      return res.status(400).json({
        success: false,
        error: 'userId et type sont obligatoires'
      });
    }

    const block = await portfolioService.addBlock(portfolioId, userId, {
      type,
      content,
      order
    });

    res.json({
      success: true,
      data: block
    });

  } catch (error) {
    console.error('❌ [API Portfolio] Erreur ajout bloc:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Mettre à jour un bloc
 * PUT /api/portfolio/blocks/:blockId
 */
router.put('/blocks/:blockId', async (req, res) => {
  try {
    const { blockId } = req.params;
    const { userId, ...updateData } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId requis'
      });
    }

    const block = await portfolioService.updateBlock(blockId, userId, updateData);

    res.json({
      success: true,
      data: block
    });

  } catch (error) {
    console.error('❌ [API Portfolio] Erreur mise à jour bloc:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Supprimer un bloc
 * DELETE /api/portfolio/blocks/:blockId
 */
router.delete('/blocks/:blockId', async (req, res) => {
  try {
    const { blockId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId requis'
      });
    }

    await portfolioService.deleteBlock(blockId, userId);

    res.json({
      success: true,
      message: 'Bloc supprimé'
    });

  } catch (error) {
    console.error('❌ [API Portfolio] Erreur suppression bloc:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Réorganiser les blocs (drag & drop)
 * PUT /api/portfolio/:portfolioId/blocks/reorder
 */
router.put('/:portfolioId/blocks/reorder', async (req, res) => {
  try {
    const { portfolioId } = req.params;
    const { userId, blocksOrder } = req.body;

    if (!userId || !blocksOrder) {
      return res.status(400).json({
        success: false,
        error: 'userId et blocksOrder sont obligatoires'
      });
    }

    await portfolioService.reorderBlocks(portfolioId, userId, blocksOrder);

    res.json({
      success: true,
      message: 'Blocs réorganisés'
    });

  } catch (error) {
    console.error('❌ [API Portfolio] Erreur réorganisation:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==========================================
// ROUTES MÉDIAS
// ==========================================

/**
 * Upload un média (image ou vidéo)
 * POST /api/portfolio/:portfolioId/media
 */
router.post('/:portfolioId/media', upload.single('file'), async (req, res) => {
  try {
    const { portfolioId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId requis'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Aucun fichier fourni'
      });
    }

    const media = await portfolioService.uploadMedia(userId, portfolioId, req.file);

    res.json({
      success: true,
      data: media
    });

  } catch (error) {
    console.error('❌ [API Portfolio] Erreur upload:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Récupérer les médias d'un portfolio
 * GET /api/portfolio/:portfolioId/media
 */
router.get('/:portfolioId/media', async (req, res) => {
  try {
    const { portfolioId } = req.params;

    const media = await portfolioService.getPortfolioMedia(portfolioId);

    res.json({
      success: true,
      data: media
    });

  } catch (error) {
    console.error('❌ [API Portfolio] Erreur récupération médias:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Supprimer un média
 * DELETE /api/portfolio/media/:mediaId
 */
router.delete('/media/:mediaId', async (req, res) => {
  try {
    const { mediaId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId requis'
      });
    }

    await portfolioService.deleteMedia(mediaId, userId);

    res.json({
      success: true,
      message: 'Média supprimé'
    });

  } catch (error) {
    console.error('❌ [API Portfolio] Erreur suppression média:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;