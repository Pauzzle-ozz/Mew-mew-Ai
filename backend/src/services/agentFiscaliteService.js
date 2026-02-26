const supabase = require('../lib/supabaseClient');
const aiService = require('./aiService');
const documentParser = require('./documentParserService');
const fiscalKnowledge = require('./fiscalKnowledgeService');
const { buildSystemPrompt } = require('../prompts/agentFiscalite');

const MAX_HISTORY_MESSAGES = 40;
const MAX_DOC_CHARS = 20000;

/**
 * Service Agent Fiscalite
 * Agent conversationnel expert en fiscalite et comptabilite
 */
class AgentFiscaliteService {

  /**
   * Creer une nouvelle session de conversation
   */
  async createSession(userId) {
    console.log(`🤖 [AgentFiscalite] Creation session pour user ${userId}`);

    const { data, error } = await supabase
      .from('agent_sessions')
      .insert({
        user_id: userId,
        agent_type: 'fiscalite',
        title: 'Nouvelle conversation'
      })
      .select()
      .single();

    if (error) throw new Error(`Erreur creation session : ${error.message}`);

    console.log(`✅ [AgentFiscalite] Session creee : ${data.id}`);
    return data;
  }

  /**
   * Lister les sessions d'un utilisateur
   */
  async getUserSessions(userId, limit = 30) {
    const { data, error } = await supabase
      .from('agent_sessions')
      .select('id, title, agent_type, created_at, updated_at')
      .eq('user_id', userId)
      .eq('agent_type', 'fiscalite')
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (error) throw new Error(`Erreur chargement sessions : ${error.message}`);
    return data || [];
  }

  /**
   * Recuperer les messages d'une session
   */
  async getSessionMessages(sessionId, userId) {
    // Verifier que la session appartient a l'utilisateur
    const { data: session, error: sessionError } = await supabase
      .from('agent_sessions')
      .select('id')
      .eq('id', sessionId)
      .eq('user_id', userId)
      .single();

    if (sessionError || !session) {
      throw new Error('Session introuvable ou acces refuse');
    }

    const { data, error } = await supabase
      .from('agent_messages')
      .select('id, role, content, metadata, created_at')
      .eq('session_id', sessionId)
      .neq('role', 'system')
      .order('created_at', { ascending: true });

    if (error) throw new Error(`Erreur chargement messages : ${error.message}`);
    return data || [];
  }

  /**
   * Envoyer un message et recevoir la reponse de l'agent
   */
  async chat(sessionId, userId, userMessage, file = null) {
    console.log(`🤖 [AgentFiscalite] Chat session=${sessionId} message="${userMessage.substring(0, 60)}..."`);

    // 1. Verifier la propriete de la session
    const { data: session, error: sessionError } = await supabase
      .from('agent_sessions')
      .select('id, title')
      .eq('id', sessionId)
      .eq('user_id', userId)
      .single();

    if (sessionError || !session) {
      throw new Error('Session introuvable ou acces refuse');
    }

    // 2. Traiter le fichier joint si present
    let messageContent = userMessage;
    let metadata = {};

    if (file) {
      console.log(`📄 [AgentFiscalite] Parsing document : ${file.originalname}`);
      const parsed = await documentParser.parseDocument(file);
      const docText = documentParser.formatForAI(parsed);
      const truncated = docText.substring(0, MAX_DOC_CHARS);

      messageContent += `\n\n[DOCUMENT JOINT : ${file.originalname}]\n${truncated}`;
      metadata = {
        filename: file.originalname,
        fileType: file.mimetype,
        filePages: parsed.pages || null
      };
    }

    // 3. Sauvegarder le message utilisateur
    const { error: insertError } = await supabase
      .from('agent_messages')
      .insert({
        session_id: sessionId,
        role: 'user',
        content: messageContent,
        metadata
      });

    if (insertError) throw new Error(`Erreur sauvegarde message : ${insertError.message}`);

    // 4. Charger l'historique de la conversation
    const { data: history, error: historyError } = await supabase
      .from('agent_messages')
      .select('role, content')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (historyError) throw new Error(`Erreur chargement historique : ${historyError.message}`);

    // 5. Recherche RAG dans la base de connaissances fiscales
    let ragContext = '';
    try {
      const ragResults = await fiscalKnowledge.searchRelevant(userMessage, 5, 0.7);
      ragContext = fiscalKnowledge.formatForContext(ragResults);
    } catch (ragErr) {
      console.error('⚠️ [AgentFiscalite] RAG search failed (non-blocking):', ragErr.message);
    }

    // 6. Construire le tableau de messages pour OpenAI
    const systemMessage = { role: 'system', content: buildSystemPrompt() };
    let conversationMessages = history.map(m => ({ role: m.role, content: m.content }));

    // Tronquer si trop de messages (garder les plus recents)
    if (conversationMessages.length > MAX_HISTORY_MESSAGES) {
      conversationMessages = conversationMessages.slice(-MAX_HISTORY_MESSAGES);
    }

    const messages = [systemMessage];

    // Injecter le contexte RAG si des references pertinentes ont ete trouvees
    if (ragContext) {
      messages.push({ role: 'system', content: ragContext });
    }

    messages.push(...conversationMessages);

    // 7. Appeler OpenAI
    console.log(`🧠 [AgentFiscalite] Appel OpenAI avec ${messages.length} messages${ragContext ? ' (+ RAG)' : ''}`);
    const assistantContent = await aiService.chatWithHistory(messages, {
      model: 'gpt-4o',
      temperature: 0.3,
      maxTokens: 4000
    });

    // 8. Sauvegarder la reponse assistant
    const { data: savedMessage, error: saveError } = await supabase
      .from('agent_messages')
      .insert({
        session_id: sessionId,
        role: 'assistant',
        content: assistantContent,
        metadata: {}
      })
      .select('id, created_at')
      .single();

    if (saveError) throw new Error(`Erreur sauvegarde reponse : ${saveError.message}`);

    // 9. Mettre a jour le titre (si c'est le 1er message) et updated_at
    const isFirstMessage = history.length <= 1;
    const updateData = { updated_at: new Date().toISOString() };

    if (isFirstMessage && session.title === 'Nouvelle conversation') {
      updateData.title = userMessage.substring(0, 80).trim();
    }

    await supabase
      .from('agent_sessions')
      .update(updateData)
      .eq('id', sessionId);

    console.log(`✅ [AgentFiscalite] Reponse generee (${assistantContent.length} chars)`);

    return {
      message: assistantContent,
      messageId: savedMessage.id,
      sessionId,
      createdAt: savedMessage.created_at
    };
  }

  /**
   * Supprimer une session et tous ses messages (CASCADE)
   */
  async deleteSession(sessionId, userId) {
    const { error } = await supabase
      .from('agent_sessions')
      .delete()
      .eq('id', sessionId)
      .eq('user_id', userId);

    if (error) throw new Error(`Erreur suppression session : ${error.message}`);
    console.log(`🗑️ [AgentFiscalite] Session ${sessionId} supprimee`);
  }

  /**
   * Renommer une session
   */
  async renameSession(sessionId, userId, newTitle) {
    const { data, error } = await supabase
      .from('agent_sessions')
      .update({ title: newTitle.substring(0, 100) })
      .eq('id', sessionId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw new Error(`Erreur renommage session : ${error.message}`);
    return data;
  }
}

module.exports = new AgentFiscaliteService();
