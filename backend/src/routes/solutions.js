const express = require('express');
const multer = require('multer');
const pdf = require('pdf-parse');
const router = express.Router();

// Import des services
const cvService = require('../services/cvService');
const pdfService = require('../services/pdfService');
const templateFactory = require('../templates/templateFactory');

// Configuration multer
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers PDF sont acceptés'));
    }
  }
});

// ========================================
// ROUTES ANALYSEUR CV
// ========================================

/**
 * Analyser un CV avec formulaire structuré
 */
router.post('/analyse-cv', async (req, res) => {
  try {
    const cvData = req.body;

    // Validation
    if (!cvData.prenom || !cvData.nom || !cvData.type_poste) {
      return res.status(400).json({
        error: 'Prénom, nom et type de poste sont obligatoires'
      });
    }

    // Appel au service
    const result = await cvService.analyzeCV(cvData);

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('❌ Erreur analyse CV:', error.message);
    res.status(500).json({
      success: false,
      error: 'Une erreur est survenue lors de l\'analyse'
    });
  }
});

/**
 * Extraire les données d'un CV PDF (sans analyse)
 */
router.post('/analyse-cv-pdf', upload.single('cv'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'Aucun fichier PDF fourni'
      });
    }

    const pdfData = await pdf(req.file.buffer);

    res.json({
      success: true,
      data: {
        texte_extrait: pdfData.text,
        nombre_pages: pdfData.numpages
      }
    });

  } catch (error) {
    console.error('❌ Erreur extraction PDF:', error.message);
    res.status(500).json({
      success: false,
      error: 'Impossible de lire le fichier PDF'
    });
  }
});

/**
 * Analyser un CV PDF complet (extraction + analyse n8n)
 */
router.post('/analyse-cv-pdf-complete', upload.single('cv'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'Aucun fichier PDF fourni'
      });
    }

    const { userId } = req.body;
    const pdfData = await pdf(req.file.buffer);

    // Appel au service
    const result = await cvService.analyzePDF(pdfData.text, pdfData.numpages, userId);

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('❌ Erreur analyse PDF complète:', error.message);
    res.status(500).json({
      success: false,
      error: 'Impossible d\'analyser le CV'
    });
  }
});

// ========================================
// ROUTES OPTIMISEUR CV
// ========================================

/**
 * Extraire un CV pour l'optimiseur (sans analyse)
 */
router.post('/extraire-cv', upload.single('cv'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'Aucun fichier PDF fourni'
      });
    }

    console.log('📄 Extraction du CV PDF...');

    const pdfData = await pdf(req.file.buffer);

    console.log('✅ Texte extrait, longueur:', pdfData.text.length);

    res.json({
      success: true,
      data: {
        texte_brut: pdfData.text,
        nombre_pages: pdfData.numpages
      }
    });

  } catch (error) {
    console.error('❌ Erreur extraction CV:', error.message);
    res.status(500).json({
      success: false,
      error: 'Impossible d\'extraire les données du CV'
    });
  }
});

/**
 * Optimiser un CV avec l'IA
 */
router.post('/optimiser-cv', async (req, res) => {
  try {
    const { cvData } = req.body;

    console.log('🤖 [OPTIMISEUR] Début de l\'optimisation...');

    // Appel au service
    const result = await cvService.optimizeCV(cvData);

    console.log('✅ [OPTIMISEUR] CV optimisé avec succès');

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('❌ [OPTIMISEUR] Erreur:', error.message);

    // Gestion des erreurs spécifiques
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        error: 'Service d\'optimisation indisponible (n8n non accessible)'
      });
    }

    if (error.code === 'ETIMEDOUT') {
      return res.status(504).json({
        success: false,
        error: 'L\'optimisation a pris trop de temps (timeout)'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Impossible d\'optimiser le CV',
      details: error.message
    });
  }
});

/**
 * Générer un CV (PDF/DOCX)
 */
router.post('/generer-cv', async (req, res) => {
  try {
    const { cvData, template, formats } = req.body;

    // Validation
    cvService.validateCVData(cvData);

    if (!template) {
      return res.status(400).json({
        error: 'Template requis'
      });
    }

    console.log('🚀 [GENERATION] Début génération CV...');

    // Génération du HTML
    const html = templateFactory.getTemplate(template, cvData);

    // Génération PDF
    const pdfBuffer = await pdfService.generatePDF(html);
    const pdfBase64 = pdfBuffer.toString('base64');

    // Génération DOCX
    const docxBuffer = await pdfService.generateDOCX(cvData, template);
    const docxBase64 = docxBuffer.toString('base64');

    console.log('✅ [GENERATION] CV généré avec succès');

    res.json({
      success: true,
      data: {
        pdf: pdfBase64,
        docx: docxBase64,
        filename: `CV_${cvData.prenom}_${cvData.nom}`
      }
    });

  } catch (error) {
    console.error('❌ [GENERATION] Erreur:', error.message);
    res.status(500).json({
      success: false,
      error: 'Impossible de générer le CV'
    });
  }
});

module.exports = router;
