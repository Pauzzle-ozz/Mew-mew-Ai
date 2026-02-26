const supabase = require('../lib/supabaseClient');
const aiService = require('./aiService');

/**
 * Service de base de connaissances fiscales (RAG)
 * Recherche semantique dans les references fiscales via pgvector
 */
class FiscalKnowledgeService {

  /**
   * Rechercher les documents pertinents pour une question
   * @param {string} query - La question de l'utilisateur
   * @param {number} limit - Nombre max de resultats (defaut: 5)
   * @param {number} threshold - Seuil de similarite minimum (defaut: 0.7)
   * @returns {Array} Documents pertinents avec score de similarite
   */
  async searchRelevant(query, limit = 5, threshold = 0.7) {
    try {
      // 1. Generer l'embedding de la question
      const queryEmbedding = await aiService.generateEmbedding(query);

      // 2. Appeler la fonction SQL de recherche
      const { data, error } = await supabase.rpc('search_fiscal_knowledge', {
        query_embedding: queryEmbedding,
        match_threshold: threshold,
        match_count: limit
      });

      if (error) {
        console.error('⚠️ [FiscalKnowledge] Erreur recherche:', error.message);
        return [];
      }

      if (data && data.length > 0) {
        console.log(`📚 [FiscalKnowledge] ${data.length} reference(s) trouvee(s) (similarite: ${data.map(d => d.similarity.toFixed(2)).join(', ')})`);
      }

      return data || [];
    } catch (err) {
      console.error('⚠️ [FiscalKnowledge] Erreur recherche RAG:', err.message);
      return [];
    }
  }

  /**
   * Formater les resultats de recherche pour injection dans le prompt
   * @param {Array} results - Resultats de searchRelevant()
   * @returns {string} Texte formate pour le contexte IA
   */
  formatForContext(results) {
    if (!results || results.length === 0) return '';

    const formatted = results.map(r =>
      `### ${r.title} [${r.category}]\n${r.content}`
    ).join('\n\n---\n\n');

    return `[REFERENCES FISCALES VERIFIEES - Donnees a jour]\n\n${formatted}`;
  }

  /**
   * Ajouter une entree dans la base de connaissances
   * @param {string} category - Categorie (bareme_ir, taux_is, tva, etc.)
   * @param {string} title - Titre du document
   * @param {string} content - Contenu textuel
   * @param {Object} metadata - Metadonnees optionnelles
   */
  async addEntry(category, title, content, metadata = {}) {
    const embedding = await aiService.generateEmbedding(`${title} ${content}`);

    const { data, error } = await supabase
      .from('fiscal_knowledge')
      .insert({
        category,
        title,
        content,
        metadata,
        embedding
      })
      .select('id')
      .single();

    if (error) throw new Error(`Erreur insertion knowledge: ${error.message}`);
    return data;
  }

  /**
   * Peupler la base en batch
   * @param {Array} entries - [{category, title, content, metadata?}]
   * @param {Function} onProgress - Callback de progression
   */
  async seedKnowledge(entries, onProgress = null) {
    let success = 0;
    let errors = 0;

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      try {
        await this.addEntry(
          entry.category,
          entry.title,
          entry.content,
          entry.metadata || {}
        );
        success++;
        if (onProgress) onProgress(i + 1, entries.length, entry.title, true);
      } catch (err) {
        errors++;
        console.error(`❌ Erreur pour "${entry.title}":`, err.message);
        if (onProgress) onProgress(i + 1, entries.length, entry.title, false);
      }

      // Pause entre les appels pour eviter le rate limit embeddings
      if (i < entries.length - 1) {
        await new Promise(r => setTimeout(r, 200));
      }
    }

    return { success, errors, total: entries.length };
  }
}

module.exports = new FiscalKnowledgeService();
