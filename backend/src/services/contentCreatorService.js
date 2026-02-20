const aiService = require('./aiService');
const scraperService = require('./scraperService');
const supabase = require('../lib/supabaseClient');
const { buildContentCreatorPrompt, buildImagePrompt } = require('../prompts/contentCreator');
const { contentCreatorToJSON } = require('../prompts/marketingJsonSchemas');

const VALID_PLATFORMS = ['linkedin', 'instagram', 'twitter', 'tiktok', 'youtube', 'facebook', 'blog', 'video_script', 'newsletter'];
const VALID_CONTENT_TYPES = ['publicitaire', 'entrepreneurial', 'educatif', 'viral', 'storytelling', 'inspirant', 'engagement', 'actualite'];

/**
 * Taille DALL-E selon la plateforme
 */
const PLATFORM_IMAGE_SIZES = {
  instagram: '1024x1024',
  facebook: '1792x1024',
  linkedin: '1792x1024',
  twitter: '1792x1024',
  tiktok: '1024x1792',
  youtube: '1792x1024',
  blog: '1792x1024',
  newsletter: '1792x1024',
  video_script: '1792x1024'
};

class ContentCreatorService {

  // ── VALIDATION ──

  validatePlatforms(platforms) {
    if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
      throw new Error('Selectionnez au moins une plateforme');
    }
    const invalid = platforms.filter(p => !VALID_PLATFORMS.includes(p));
    if (invalid.length > 0) {
      throw new Error(`Plateformes invalides : ${invalid.join(', ')}`);
    }
    return true;
  }

  validateContentType(contentType) {
    if (!contentType || !VALID_CONTENT_TYPES.includes(contentType)) {
      throw new Error(`Type de contenu invalide. Types valides : ${VALID_CONTENT_TYPES.join(', ')}`);
    }
    return true;
  }

  validateBrief(brief) {
    if (!brief || !brief.subject || !brief.tone || !brief.targetAudience || !brief.objective) {
      throw new Error('Le brief doit contenir : subject, tone, targetAudience, objective');
    }
    return true;
  }

  // ── GENERATION DE CONTENU ──

  /**
   * Generer du contenu depuis un brief
   * Pipeline : GPT-4o creatif → GPT-4.1-mini JSON
   */
  async generateContent(brief, platforms, contentType) {
    console.log(`🎨 [ContentCreator] Generation pour ${platforms.length} plateformes (type: ${contentType})...`);

    this.validateBrief(brief);
    this.validatePlatforms(platforms);
    this.validateContentType(contentType);

    const genPrompt = buildContentCreatorPrompt(brief, platforms, contentType);
    const jsonPrompt = contentCreatorToJSON('{{GENERATED_TEXT}}');

    const result = await aiService.generateThenConvert(
      genPrompt,
      jsonPrompt,
      { model: 'gpt-4o', temperature: 0.7, maxTokens: 6000 },
      { model: 'gpt-4.1-mini', maxTokens: 8000 }
    );

    // Injecter le contentType si manquant
    if (!result.contentType) result.contentType = contentType;

    console.log(`✅ [ContentCreator] Contenu genere pour : ${Object.keys(result.platforms || {}).join(', ')}`);
    return result;
  }

  /**
   * Recreer du contenu depuis une URL existante
   * Scrape → inject dans le prompt → pipeline
   */
  async recreateFromUrl(url, platforms, contentType, brief) {
    console.log(`🔄 [ContentCreator] Recreation depuis URL: ${url}`);

    this.validatePlatforms(platforms);
    this.validateContentType(contentType);
    this.validateBrief(brief);

    // Scrape le contenu source
    scraperService.validateUrl(url);

    let sourceContent = await scraperService.scrapeWithAxios(url);
    if (!sourceContent || sourceContent.length < 100) {
      console.log('🔶 [ContentCreator] Axios insuffisant, tentative Puppeteer...');
      sourceContent = await scraperService.scrapeWithPuppeteer(url);
    }

    if (!sourceContent || sourceContent.length < 50) {
      throw new Error('Impossible d\'extraire le contenu de cette URL. Essayez de coller le texte dans le brief.');
    }

    const genPrompt = buildContentCreatorPrompt(brief, platforms, contentType, sourceContent);
    const jsonPrompt = contentCreatorToJSON('{{GENERATED_TEXT}}');

    const result = await aiService.generateThenConvert(
      genPrompt,
      jsonPrompt,
      { model: 'gpt-4o', temperature: 0.7, maxTokens: 6000 },
      { model: 'gpt-4.1-mini', maxTokens: 8000 }
    );

    if (!result.contentType) result.contentType = contentType;
    result.sourceUrl = url;

    console.log(`✅ [ContentCreator] Contenu recree depuis URL pour : ${Object.keys(result.platforms || {}).join(', ')}`);
    return result;
  }

  /**
   * Generer une image via DALL-E 3
   */
  async generateImage(brief, platform, contentType) {
    console.log(`🖼️ [ContentCreator] Generation image DALL-E pour ${platform}...`);

    const prompt = buildImagePrompt(brief, platform, contentType);
    const size = PLATFORM_IMAGE_SIZES[platform] || '1024x1024';

    const result = await aiService.generateImage(prompt, { size, quality: 'standard' });

    console.log(`✅ [ContentCreator] Image generee pour ${platform}`);
    return result;
  }

  // ── CRUD SUPABASE ──

  /**
   * Sauvegarder une creation
   */
  async saveCreation(userId, data) {
    console.log(`💾 [ContentCreator] Sauvegarde creation pour user ${userId}`);

    const { data: creation, error } = await supabase
      .from('content_creations')
      .insert({
        user_id: userId,
        title: data.title || 'Creation sans titre',
        content_type: data.contentType,
        platforms: data.platforms,
        brief: data.brief,
        source_url: data.sourceUrl || null,
        generated_content: data.generatedContent,
        generated_images: data.generatedImages || [],
        status: data.status || 'draft'
      })
      .select()
      .single();

    if (error) throw new Error(`Erreur sauvegarde : ${error.message}`);
    return creation;
  }

  /**
   * Lister les creations d'un utilisateur
   */
  async getUserCreations(userId, filters = {}) {
    let query = supabase
      .from('content_creations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (filters.contentType) {
      query = query.eq('content_type', filters.contentType);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1);
    }

    const { data: creations, error } = await query;
    if (error) throw new Error(`Erreur recuperation : ${error.message}`);
    return creations;
  }

  /**
   * Recuperer une creation par ID
   */
  async getCreation(creationId, userId) {
    const { data: creation, error } = await supabase
      .from('content_creations')
      .select('*')
      .eq('id', creationId)
      .eq('user_id', userId)
      .single();

    if (error) throw new Error(`Creation introuvable : ${error.message}`);
    return creation;
  }

  /**
   * Mettre a jour une creation
   */
  async updateCreation(creationId, userId, updates) {
    const allowed = {};
    if (updates.title !== undefined) allowed.title = updates.title;
    if (updates.status !== undefined) allowed.status = updates.status;
    if (updates.generatedImages !== undefined) allowed.generated_images = updates.generatedImages;
    allowed.updated_at = new Date().toISOString();

    const { data: creation, error } = await supabase
      .from('content_creations')
      .update(allowed)
      .eq('id', creationId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw new Error(`Erreur mise a jour : ${error.message}`);
    return creation;
  }

  /**
   * Supprimer une creation
   */
  async deleteCreation(creationId, userId) {
    const { error } = await supabase
      .from('content_creations')
      .delete()
      .eq('id', creationId)
      .eq('user_id', userId);

    if (error) throw new Error(`Erreur suppression : ${error.message}`);
    return true;
  }
}

module.exports = new ContentCreatorService();
