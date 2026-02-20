const supabase = require('../lib/supabaseClient');

/**
 * Service d'historique d'utilisation des outils
 * Stocke un résumé de chaque utilisation (analyse CV, optimisation, matcher)
 */
class HistoryService {

  async saveEntry(userId, toolType, title, inputSummary, resultSummary, status = 'completed') {
    const { data, error } = await supabase
      .from('tool_usage_history')
      .insert({
        user_id: userId,
        tool_type: toolType,
        title,
        input_summary: inputSummary || {},
        result_summary: resultSummary || {},
        status
      })
      .select()
      .single();

    if (error) throw new Error(`Erreur sauvegarde historique : ${error.message}`);
    return data;
  }

  async getUserHistory(userId, filters = {}) {
    let query = supabase
      .from('tool_usage_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (filters.toolType) query = query.eq('tool_type', filters.toolType);
    if (filters.limit) query = query.limit(filters.limit);

    const { data, error } = await query;
    if (error) throw new Error(`Erreur historique : ${error.message}`);
    return data || [];
  }

  async deleteEntry(entryId, userId) {
    const { error } = await supabase
      .from('tool_usage_history')
      .delete()
      .eq('id', entryId)
      .eq('user_id', userId);

    if (error) throw new Error(`Erreur suppression : ${error.message}`);
    return true;
  }
}

module.exports = new HistoryService();
