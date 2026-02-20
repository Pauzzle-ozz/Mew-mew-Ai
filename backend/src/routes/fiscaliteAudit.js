const express = require('express');
const router = express.Router();
const multer = require('multer');
const fiscaliteAuditService = require('../services/fiscaliteAuditService');

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
 * Audit fiscal complet
 * POST /api/fiscalite/audit
 */
router.post('/', upload.single('document'), async (req, res) => {
  try {
    let data = req.body;

    // Si les donnees sont envoyees en multipart, parser le JSON
    if (typeof data.data === 'string') {
      data = JSON.parse(data.data);
    }

    if (!data.type || !['entreprise', 'independant', 'particulier'].includes(data.type)) {
      return res.status(400).json({
        success: false,
        error: 'Le type de profil est requis (entreprise, independant, particulier)'
      });
    }

    console.log(`🔍 [FiscaliteAudit] Requete audit fiscal : ${data.type}/${data.statut || 'non precise'}`);

    const result = await fiscaliteAuditService.auditFiscal(data, req.file);

    res.json({ success: true, data: result });

  } catch (error) {
    console.error('❌ [FiscaliteAudit] Erreur:', error.message);

    if (error.status === 429) {
      return res.status(503).json({
        success: false,
        error: 'Service IA temporairement surcharge. Reessayez dans quelques instants.'
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors de l\'audit fiscal',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

module.exports = router;
