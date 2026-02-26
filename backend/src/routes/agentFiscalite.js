const express = require('express');
const router = express.Router();
const multer = require('multer');
const agentFiscaliteService = require('../services/agentFiscaliteService');

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
 * Envoyer un message a l'agent
 * POST /api/agents/fiscalite/chat
 */
router.post('/chat', upload.single('document'), async (req, res) => {
  try {
    let { userId, sessionId, message } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId requis' });
    }
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ success: false, error: 'Message requis' });
    }

    // Si pas de session, en creer une
    if (!sessionId) {
      const session = await agentFiscaliteService.createSession(userId);
      sessionId = session.id;
    }

    const result = await agentFiscaliteService.chat(sessionId, userId, message.trim(), req.file || null);

    res.json({ success: true, data: result });

  } catch (error) {
    console.error('❌ [AgentFiscalite] Erreur chat:', error.message);

    if (error.status === 429) {
      return res.status(503).json({
        success: false,
        error: 'Service IA temporairement surcharge. Reessayez dans quelques instants.'
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors du traitement du message',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

/**
 * Creer une nouvelle session
 * POST /api/agents/fiscalite/sessions
 */
router.post('/sessions', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId requis' });
    }

    const session = await agentFiscaliteService.createSession(userId);
    res.json({ success: true, data: session });

  } catch (error) {
    console.error('❌ [AgentFiscalite] Erreur creation session:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors de la creation de la session'
    });
  }
});

/**
 * Lister les sessions d'un utilisateur
 * GET /api/agents/fiscalite/sessions/:userId
 */
router.get('/sessions/:userId', async (req, res) => {
  try {
    const sessions = await agentFiscaliteService.getUserSessions(req.params.userId);
    res.json({ success: true, data: sessions });

  } catch (error) {
    console.error('❌ [AgentFiscalite] Erreur liste sessions:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors du chargement des sessions'
    });
  }
});

/**
 * Recuperer les messages d'une session
 * GET /api/agents/fiscalite/sessions/:sessionId/messages?userId=xxx
 */
router.get('/sessions/:sessionId/messages', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId requis en query param' });
    }

    const messages = await agentFiscaliteService.getSessionMessages(req.params.sessionId, userId);
    res.json({ success: true, data: messages });

  } catch (error) {
    console.error('❌ [AgentFiscalite] Erreur messages:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors du chargement des messages'
    });
  }
});

/**
 * Supprimer une session
 * DELETE /api/agents/fiscalite/sessions/:sessionId
 */
router.delete('/sessions/:sessionId', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId requis' });
    }

    await agentFiscaliteService.deleteSession(req.params.sessionId, userId);
    res.json({ success: true, message: 'Session supprimee' });

  } catch (error) {
    console.error('❌ [AgentFiscalite] Erreur suppression:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors de la suppression'
    });
  }
});

/**
 * Renommer une session
 * PUT /api/agents/fiscalite/sessions/:sessionId
 */
router.put('/sessions/:sessionId', async (req, res) => {
  try {
    const { userId, title } = req.body;
    if (!userId || !title) {
      return res.status(400).json({ success: false, error: 'userId et title requis' });
    }

    const session = await agentFiscaliteService.renameSession(req.params.sessionId, userId, title);
    res.json({ success: true, data: session });

  } catch (error) {
    console.error('❌ [AgentFiscalite] Erreur renommage:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors du renommage'
    });
  }
});

module.exports = router;
