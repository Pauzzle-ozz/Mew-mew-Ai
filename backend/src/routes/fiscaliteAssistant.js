const express = require('express');
const router = express.Router();
const multer = require('multer');
const fiscaliteAssistantService = require('../services/fiscaliteAssistantService');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Format non supporte. Formats acceptes : PDF, Excel (.xlsx/.xls), CSV'));
    }
  }
});

/**
 * Preparer une declaration fiscale
 * POST /api/fiscalite/assistant/declarations
 */
router.post('/declarations', upload.single('document'), async (req, res) => {
  try {
    let data = req.body;
    if (typeof data.data === 'string') {
      data = JSON.parse(data.data);
    }

    if (!data.type_declaration) {
      return res.status(400).json({
        success: false,
        error: 'Le type de declaration est requis'
      });
    }

    console.log(`📋 [FiscaliteAssistant] Requete declaration : ${data.type_declaration}`);

    const result = await fiscaliteAssistantService.preparerDeclaration(data, req.file);

    res.json({ success: true, data: result });

  } catch (error) {
    console.error('❌ [FiscaliteAssistant] Erreur declarations:', error.message);

    if (error.status === 429) {
      return res.status(503).json({
        success: false,
        error: 'Service IA temporairement surcharge. Reessayez dans quelques instants.'
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors de la preparation de la declaration',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

/**
 * Generer un calendrier fiscal personnalise
 * POST /api/fiscalite/assistant/calendrier
 */
router.post('/calendrier', async (req, res) => {
  try {
    const data = req.body;

    if (!data.statut_juridique) {
      return res.status(400).json({
        success: false,
        error: 'Le statut juridique est requis'
      });
    }

    console.log(`📅 [FiscaliteAssistant] Requete calendrier : ${data.statut_juridique}`);

    const result = await fiscaliteAssistantService.genererCalendrier(data);

    res.json({ success: true, data: result });

  } catch (error) {
    console.error('❌ [FiscaliteAssistant] Erreur calendrier:', error.message);

    if (error.status === 429) {
      return res.status(503).json({
        success: false,
        error: 'Service IA temporairement surcharge. Reessayez dans quelques instants.'
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors de la generation du calendrier',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

/**
 * Preparer un controle fiscal
 * POST /api/fiscalite/assistant/controle
 */
router.post('/controle', upload.single('document'), async (req, res) => {
  try {
    let data = req.body;
    if (typeof data.data === 'string') {
      data = JSON.parse(data.data);
    }

    console.log(`🛡️ [FiscaliteAssistant] Requete preparation controle`);

    const result = await fiscaliteAssistantService.preparerControle(data, req.file);

    res.json({ success: true, data: result });

  } catch (error) {
    console.error('❌ [FiscaliteAssistant] Erreur controle:', error.message);

    if (error.status === 429) {
      return res.status(503).json({
        success: false,
        error: 'Service IA temporairement surcharge. Reessayez dans quelques instants.'
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors de la preparation du controle',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

/**
 * Question fiscale libre
 * POST /api/fiscalite/assistant/question
 */
router.post('/question', async (req, res) => {
  try {
    const { question, contexte } = req.body;

    if (!question || typeof question !== 'string' || !question.trim()) {
      return res.status(400).json({
        success: false,
        error: 'La question est requise'
      });
    }

    console.log(`❓ [FiscaliteAssistant] Question : ${question.substring(0, 80)}...`);

    const result = await fiscaliteAssistantService.repondreQuestion(question, contexte);

    res.json({ success: true, data: result });

  } catch (error) {
    console.error('❌ [FiscaliteAssistant] Erreur question:', error.message);

    if (error.status === 429) {
      return res.status(503).json({
        success: false,
        error: 'Service IA temporairement surcharge. Reessayez dans quelques instants.'
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors du traitement de la question',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

module.exports = router;
