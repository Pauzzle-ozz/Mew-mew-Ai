const express = require('express');
const multer = require('multer');
const router = express.Router();

const candidatureSpontaneeService = require('../services/candidatureSpontaneeService');
const applicationService = require('../services/applicationService');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Seuls les fichiers PDF sont acceptes'));
  }
});

/**
 * Envoyer une candidature spontanee
 * POST /api/candidature-spontanee/envoyer
 */
router.post('/envoyer', upload.single('cv'), async (req, res) => {
  try {
    const { recipientEmail, targetPosition, company, contactName, userId } = req.body;
    const cvFile = req.file;

    if (!cvFile) {
      return res.status(400).json({ success: false, error: 'Fichier CV (PDF) manquant' });
    }
    if (!recipientEmail) {
      return res.status(400).json({ success: false, error: 'Email du recruteur requis' });
    }
    if (!targetPosition) {
      return res.status(400).json({ success: false, error: 'Poste vise requis' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      return res.status(400).json({ success: false, error: 'Format email invalide' });
    }

    const result = await candidatureSpontaneeService.sendSpontaneousApplication(
      cvFile.buffer,
      recipientEmail,
      targetPosition,
      company || '',
      contactName || '',
      userId || null
    );

    res.json({ success: true, data: result });

  } catch (error) {
    console.error('[Route CandidatureSpontanee] Erreur:', error.message);

    if (error.status === 429) {
      return res.status(503).json({
        success: false,
        error: 'Service IA temporairement surcharge. Reessayez dans quelques instants.'
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || "Impossible d'envoyer la candidature"
    });
  }
});

/**
 * Generer un email de relance (sans l'envoyer)
 * POST /api/candidature-spontanee/generer-relance
 */
router.post('/generer-relance', async (req, res) => {
  try {
    const { applicationId, userId } = req.body;

    if (!applicationId || !userId) {
      return res.status(400).json({ success: false, error: 'applicationId et userId requis' });
    }

    const supabase = require('../lib/supabaseClient');
    const { data: app, error } = await supabase
      .from('job_applications')
      .select('*')
      .eq('id', applicationId)
      .eq('user_id', userId)
      .single();

    if (error || !app) {
      return res.status(404).json({ success: false, error: 'Candidature introuvable' });
    }

    if (app.candidature_type !== 'spontanee') {
      return res.status(400).json({ success: false, error: "Cette candidature n'est pas une candidature spontanee" });
    }

    const appliedAt = new Date(app.applied_at || app.created_at);
    const daysSince = Math.floor((Date.now() - appliedAt.getTime()) / (1000 * 60 * 60 * 24));

    const candidateName = app.notes?.match(/Objet: .+ - (.+)/)?.[1] || 'Candidat';

    const result = await candidatureSpontaneeService.generateFollowUp({
      originalSubject: app.notes?.match(/Objet: (.+)/)?.[1] || `Candidature - ${app.offer_title}`,
      targetPosition: app.offer_title,
      company: app.company || '',
      candidateName,
      daysSince
    });

    res.json({ success: true, data: result });

  } catch (error) {
    console.error('[Route Relance] Erreur:', error.message);

    if (error.status === 429) {
      return res.status(503).json({
        success: false,
        error: 'Service IA temporairement surcharge. Reessayez dans quelques instants.'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Impossible de generer la relance'
    });
  }
});

/**
 * Marquer la relance comme envoyee
 * PUT /api/candidature-spontanee/:applicationId/relance-envoyee
 */
router.put('/:applicationId/relance-envoyee', async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { userId } = req.body;

    if (!userId) return res.status(400).json({ success: false, error: 'userId requis' });

    const updated = await applicationService.update(applicationId, userId, {
      follow_up_sent: true
    });

    res.json({ success: true, data: updated });

  } catch (error) {
    console.error('[Route Relance] Erreur marquage:', error.message);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

module.exports = router;
