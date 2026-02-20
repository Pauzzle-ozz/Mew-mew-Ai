const express = require('express');
const router = express.Router();
const multer = require('multer');
const fiscaliteSimulateurService = require('../services/fiscaliteSimulateurService');

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
 * Simulation de strategie juridique et fiscale
 * POST /api/fiscalite/simulateur
 */
router.post('/', upload.single('document'), async (req, res) => {
  try {
    let data = req.body;
    if (typeof data.data === 'string') {
      data = JSON.parse(data.data);
    }

    // Valider situation_actuelle
    if (typeof data.situation_actuelle === 'string') {
      data.situation_actuelle = JSON.parse(data.situation_actuelle);
    }
    if (typeof data.objectifs === 'string') {
      data.objectifs = JSON.parse(data.objectifs);
    }
    if (typeof data.projections === 'string') {
      data.projections = JSON.parse(data.projections);
    }

    if (!data.situation_actuelle?.statut) {
      return res.status(400).json({
        success: false,
        error: 'Le statut juridique actuel est requis'
      });
    }

    if (!data.situation_actuelle?.ca) {
      return res.status(400).json({
        success: false,
        error: 'Le chiffre d\'affaires annuel est requis'
      });
    }

    console.log(`🧮 [FiscaliteSimulateur] Requete simulation : ${data.situation_actuelle.statut} - CA: ${data.situation_actuelle.ca} EUR`);

    const result = await fiscaliteSimulateurService.simuler(data, req.file);

    res.json({ success: true, data: result });

  } catch (error) {
    console.error('❌ [FiscaliteSimulateur] Erreur:', error.message);

    if (error.status === 429) {
      return res.status(503).json({
        success: false,
        error: 'Service IA temporairement surcharge. Reessayez dans quelques instants.'
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors de la simulation',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

module.exports = router;
