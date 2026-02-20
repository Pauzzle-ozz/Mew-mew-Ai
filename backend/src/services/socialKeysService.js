const supabase = require('../lib/supabaseClient');

const VALID_PLATFORMS = ['twitter', 'linkedin', 'facebook', 'instagram', 'youtube', 'tiktok'];

const PLATFORM_FIELDS = {
  twitter: ['apiKey', 'apiSecret', 'accessToken', 'accessTokenSecret'],
  linkedin: ['accessToken'],
  facebook: ['pageAccessToken', 'pageId'],
  instagram: ['accessToken', 'igBusinessAccountId'],
  youtube: ['apiKey', 'clientId', 'clientSecret', 'refreshToken'],
  tiktok: ['accessToken']
};

class SocialKeysService {

  validatePlatform(platform) {
    if (!platform || !VALID_PLATFORMS.includes(platform)) {
      throw new Error(`Plateforme invalide. Valides : ${VALID_PLATFORMS.join(', ')}`);
    }
  }

  validateCredentials(platform, credentials) {
    const requiredFields = PLATFORM_FIELDS[platform];
    if (!requiredFields) throw new Error(`Plateforme inconnue : ${platform}`);

    const missing = requiredFields.filter(f => !credentials[f] || !credentials[f].trim());
    if (missing.length > 0) {
      throw new Error(`Champs manquants pour ${platform} : ${missing.join(', ')}`);
    }
  }

  /**
   * Sauvegarder ou mettre a jour les cles d'une plateforme (upsert)
   */
  async saveKeys(userId, platform, credentials) {
    this.validatePlatform(platform);
    this.validateCredentials(platform, credentials);

    // Nettoyer : ne garder que les champs attendus
    const cleanCreds = {};
    for (const field of PLATFORM_FIELDS[platform]) {
      cleanCreds[field] = credentials[field].trim();
    }

    const { data, error } = await supabase
      .from('user_social_keys')
      .upsert({
        user_id: userId,
        platform,
        credentials: cleanCreds,
        is_active: true,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,platform' })
      .select()
      .single();

    if (error) throw new Error(`Erreur sauvegarde cles : ${error.message}`);

    console.log(`🔑 [SocialKeys] Cles sauvegardees pour ${platform} (user: ${userId.substring(0, 8)}...)`);
    return { platform, isActive: true, savedAt: data.updated_at };
  }

  /**
   * Recuperer les cles d'une plateforme (cles completes, usage interne)
   */
  async getKeys(userId, platform) {
    this.validatePlatform(platform);

    const { data, error } = await supabase
      .from('user_social_keys')
      .select('*')
      .eq('user_id', userId)
      .eq('platform', platform)
      .eq('is_active', true)
      .single();

    if (error || !data) return null;
    return data.credentials;
  }

  /**
   * Lister toutes les plateformes connectees (cles masquees)
   */
  async getAllKeys(userId) {
    const { data, error } = await supabase
      .from('user_social_keys')
      .select('platform, is_active, updated_at')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (error) throw new Error(`Erreur recuperation : ${error.message}`);

    return (data || []).map(row => ({
      platform: row.platform,
      isConnected: true,
      lastUpdated: row.updated_at
    }));
  }

  /**
   * Supprimer les cles d'une plateforme
   */
  async deleteKeys(userId, platform) {
    this.validatePlatform(platform);

    const { error } = await supabase
      .from('user_social_keys')
      .delete()
      .eq('user_id', userId)
      .eq('platform', platform);

    if (error) throw new Error(`Erreur suppression : ${error.message}`);

    console.log(`🗑️ [SocialKeys] Cles supprimees pour ${platform} (user: ${userId.substring(0, 8)}...)`);
    return true;
  }
}

module.exports = new SocialKeysService();
