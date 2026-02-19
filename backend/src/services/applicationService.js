const supabase = require('../lib/supabaseClient');

/**
 * Service de gestion des candidatures
 * CRUD pour la table job_applications
 */
class ApplicationService {
  /**
   * Créer une nouvelle candidature
   */
  async create(userId, data) {
    const { data: application, error } = await supabase
      .from('job_applications')
      .insert({
        user_id: userId,
        offer_title: data.offer_title,
        company: data.company || '',
        offer_url: data.offer_url || '',
        location: data.location || '',
        contract_type: data.contract_type || '',
        status: data.status || 'a_postuler',
        notes: data.notes || '',
        recipient_email: data.recipient_email || '',
        follow_up_date: data.follow_up_date || null,
        follow_up_sent: data.follow_up_sent ?? false,
        candidature_type: data.candidature_type || 'offre',
        contact_name: data.contact_name || ''
      })
      .select()
      .single();

    if (error) throw new Error(`Erreur création candidature: ${error.message}`);
    return application;
  }

  /**
   * Lister toutes les candidatures d'un utilisateur
   */
  async getByUser(userId) {
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Erreur récupération candidatures: ${error.message}`);
    return data || [];
  }

  /**
   * Mettre à jour une candidature (statut, notes, date de candidature)
   */
  async update(id, userId, data) {
    const updateData = { updated_at: new Date().toISOString() };

    if (data.status !== undefined) updateData.status = data.status;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.offer_title !== undefined) updateData.offer_title = data.offer_title;
    if (data.company !== undefined) updateData.company = data.company;
    if (data.offer_url !== undefined) updateData.offer_url = data.offer_url;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.contract_type !== undefined) updateData.contract_type = data.contract_type;
    if (data.recipient_email !== undefined) updateData.recipient_email = data.recipient_email;
    if (data.follow_up_date !== undefined) updateData.follow_up_date = data.follow_up_date;
    if (data.follow_up_sent !== undefined) updateData.follow_up_sent = data.follow_up_sent;
    if (data.candidature_type !== undefined) updateData.candidature_type = data.candidature_type;
    if (data.contact_name !== undefined) updateData.contact_name = data.contact_name;

    // Si on change le statut à 'postule' et qu'il n'y a pas encore de date
    if (data.status === 'postule' && data.applied_at !== null) {
      updateData.applied_at = data.applied_at || new Date().toISOString();
    }

    const { data: updated, error } = await supabase
      .from('job_applications')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw new Error(`Erreur mise à jour candidature: ${error.message}`);
    return updated;
  }

  /**
   * Supprimer une candidature
   */
  async delete(id, userId) {
    const { error } = await supabase
      .from('job_applications')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw new Error(`Erreur suppression candidature: ${error.message}`);
  }
}

module.exports = new ApplicationService();
