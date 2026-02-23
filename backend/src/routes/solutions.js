const express = require('express');
const multer = require('multer');
const pdf = require('pdf-parse');
const router = express.Router();

// Import des services
const cvService = require('../services/cvService');
const pdfService = require('../services/pdfService');
const templateFactory = require('../templates/templateFactory');
const cvBuilderFactory = require('../templates/cvBuilderFactory');

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
 * Analyser un CV PDF complet (extraction + analyse IA)
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
 * Optimiser un CV via formulaire structuré
 */
router.post('/optimiser-cv-formulaire', async (req, res) => {
  try {
    const { cvData, userId, posteCible } = req.body;

    console.log('🤖 [OPTIMISEUR-FORM] Début optimisation formulaire...');

    // Validation
    cvService.validateCVData(cvData);

    // Appel au service
    const result = await cvService.optimizeCVForm(cvData, userId, posteCible);

    console.log('✅ [OPTIMISEUR-FORM] CV optimisé avec succès');

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('❌ [OPTIMISEUR-FORM] Erreur:', error.message);

    if (error.status === 429) {
      return res.status(503).json({
        success: false,
        error: 'Service IA temporairement surchargé. Réessayez dans quelques instants.'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Impossible d\'optimiser le CV',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

/**
 * Optimiser un CV via upload PDF
 */
router.post('/optimiser-cv-pdf', upload.single('cv'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'Aucun fichier PDF fourni'
      });
    }

    const { userId, posteCible } = req.body;

    console.log('📄 [OPTIMISEUR-PDF] Début optimisation PDF...');

    // Extraction du texte du PDF
    const pdfData = await pdf(req.file.buffer);

    console.log('📝 [OPTIMISEUR-PDF] Texte extrait, longueur:', pdfData.text.length);

    // Appel au service
    const result = await cvService.optimizeCVPdf(pdfData.text, pdfData.numpages, userId, posteCible);

    console.log('✅ [OPTIMISEUR-PDF] CV optimisé avec succès');

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('❌ [OPTIMISEUR-PDF] Erreur:', error.message);

    if (error.status === 429) {
      return res.status(503).json({
        success: false,
        error: 'Service IA temporairement surchargé. Réessayez dans quelques instants.'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Impossible d\'optimiser le CV PDF',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

/**
 * Générer un CV (PDF uniquement)
 */
router.post('/generer-cv', async (req, res) => {
  try {
    const { cvData, template, buildConfig } = req.body;

    // Validation
    cvService.validateCVData(cvData);

    console.log('🚀 [GENERATION] Début génération CV (PDF uniquement)...');

    let html;
    if (buildConfig) {
      // Nouveau système : type + forme + style + blocs
      html = cvBuilderFactory.generate(cvData, buildConfig);
    } else {
      // Ancien système (compatibilité)
      if (!template) {
        return res.status(400).json({ error: 'Template ou buildConfig requis' });
      }
      html = templateFactory.getTemplate(template, cvData);
    }

    // Génération PDF uniquement
    const pdfBuffer = await pdfService.generatePDF(html);
    const pdfBase64 = pdfBuffer.toString('base64');

    console.log('✅ [GENERATION] CV généré avec succès (PDF)');

    res.json({
      success: true,
      data: {
        pdf: pdfBase64,
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

/**
 * Filtrer un CV enrichi (condensation IA)
 */
router.post('/filtrer-cv', async (req, res) => {
  try {
    const { cvData, sections } = req.body;

    if (!cvData || !cvData.prenom || !cvData.nom) {
      return res.status(400).json({
        error: 'Données CV manquantes'
      });
    }

    console.log('🔄 [FILTRAGE] Début filtrage CV...', sections?.length ? `sections: ${sections.join(', ')}` : 'tout');

    const result = await cvService.filterCV(cvData, sections);

    console.log('✅ [FILTRAGE] CV filtré avec succès');

    res.json({
      success: true,
      data: result.cvData_filtre
    });

  } catch (error) {
    console.error('❌ [FILTRAGE] Erreur:', error.message);

    if (error.status === 429) {
      return res.status(503).json({
        success: false,
        error: 'Service IA temporairement surchargé. Réessayez dans quelques instants.'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Impossible de filtrer le CV'
    });
  }
});

module.exports = router;
