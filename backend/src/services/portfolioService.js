const { createClient } = require('@supabase/supabase-js');

/**
 * Service de gestion des Portfolios
 * Centralise toute la logique métier liée aux portfolios
 */
class PortfolioService {
  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );
  }

  // ==========================================
  // PORTFOLIOS
  // ==========================================

  /**
   * Créer un nouveau portfolio
   */
  async createPortfolio(userId, data) {
    console.log('📁 [PortfolioService] Création portfolio pour:', userId);

    // Générer un slug unique
    const slug = await this.generateUniqueSlug(data.title);

    const { data: portfolio, error } = await this.supabase
      .from('portfolios')
      .insert({
        user_id: userId,
        slug: slug,
        title: data.title,
        description: data.description || '',
        template: data.template || 'moderne',
        published: false,
        settings: data.settings || {}
      })
      .select()
      .single();

    if (error) {
      console.error('❌ [PortfolioService] Erreur création:', error);
      throw new Error('Impossible de créer le portfolio');
    }

    console.log('✅ [PortfolioService] Portfolio créé:', portfolio.id);
    return portfolio;
  }

  /**
   * Récupérer tous les portfolios d'un utilisateur
   */
  async getUserPortfolios(userId) {
    console.log('📂 [PortfolioService] Récupération portfolios pour:', userId);

    const { data: portfolios, error } = await this.supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ [PortfolioService] Erreur récupération:', error);
      throw new Error('Impossible de récupérer les portfolios');
    }

    return portfolios;
  }

  /**
   * Récupérer un portfolio par ID (pour l'éditeur)
   */
  async getPortfolioById(portfolioId, userId) {
    console.log('📄 [PortfolioService] Récupération portfolio:', portfolioId);

    const { data: portfolio, error } = await this.supabase
      .from('portfolios')
      .select('*')
      .eq('id', portfolioId)
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('❌ [PortfolioService] Erreur:', error);
      throw new Error('Portfolio non trouvé');
    }

    return portfolio;
  }

  /**
   * Récupérer un portfolio par slug (pour la page publique)
   */
  async getPortfolioBySlug(slug) {
    console.log('🌐 [PortfolioService] Récupération portfolio public:', slug);

    const { data: portfolio, error } = await this.supabase
      .from('portfolios')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error) {
      console.error('❌ [PortfolioService] Portfolio non trouvé ou non publié');
      throw new Error('Portfolio non trouvé');
    }

    return portfolio;
  }

  /**
   * Mettre à jour un portfolio
   */
  async updatePortfolio(portfolioId, userId, data) {
    console.log('✏️ [PortfolioService] Mise à jour portfolio:', portfolioId);

    const updateData = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.template !== undefined) updateData.template = data.template;
    if (data.published !== undefined) updateData.published = data.published;
    if (data.settings !== undefined) updateData.settings = data.settings;

    const { data: portfolio, error } = await this.supabase
      .from('portfolios')
      .update(updateData)
      .eq('id', portfolioId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('❌ [PortfolioService] Erreur mise à jour:', error);
      throw new Error('Impossible de mettre à jour le portfolio');
    }

    console.log('✅ [PortfolioService] Portfolio mis à jour');
    return portfolio;
  }

  /**
   * Supprimer un portfolio
   */
  async deletePortfolio(portfolioId, userId) {
    console.log('🗑️ [PortfolioService] Suppression portfolio:', portfolioId);

    const { error } = await this.supabase
      .from('portfolios')
      .delete()
      .eq('id', portfolioId)
      .eq('user_id', userId);

    if (error) {
      console.error('❌ [PortfolioService] Erreur suppression:', error);
      throw new Error('Impossible de supprimer le portfolio');
    }

    console.log('✅ [PortfolioService] Portfolio supprimé');
    return true;
  }

  // ==========================================
  // BLOCS
  // ==========================================

  /**
   * Récupérer tous les blocs d'un portfolio
   */
  async getPortfolioBlocks(portfolioId) {
    console.log('🧱 [PortfolioService] Récupération blocs pour:', portfolioId);

    const { data: blocks, error } = await this.supabase
      .from('portfolio_blocks')
      .select('*')
      .eq('portfolio_id', portfolioId)
      .order('order', { ascending: true });

    if (error) {
      console.error('❌ [PortfolioService] Erreur récupération blocs:', error);
      throw new Error('Impossible de récupérer les blocs');
    }

    return blocks;
  }

  /**
   * Ajouter un bloc
   */
  async addBlock(portfolioId, userId, blockData) {
    console.log('➕ [PortfolioService] Ajout bloc:', blockData.type);

    // Vérifier que l'utilisateur possède le portfolio
    await this.getPortfolioById(portfolioId, userId);

    // Récupérer l'ordre max actuel
    const { data: maxOrderResult } = await this.supabase
      .from('portfolio_blocks')
      .select('order')
      .eq('portfolio_id', portfolioId)
      .order('order', { ascending: false })
      .limit(1);

    const newOrder = maxOrderResult && maxOrderResult.length > 0 
      ? maxOrderResult[0].order + 1 
      : 0;

    const { data: block, error } = await this.supabase
      .from('portfolio_blocks')
      .insert({
        portfolio_id: portfolioId,
        type: blockData.type,
        content: blockData.content || {},
        order: blockData.order !== undefined ? blockData.order : newOrder
      })
      .select()
      .single();

    if (error) {
      console.error('❌ [PortfolioService] Erreur ajout bloc:', error);
      throw new Error('Impossible d\'ajouter le bloc');
    }

    console.log('✅ [PortfolioService] Bloc ajouté:', block.id);
    return block;
  }

  /**
   * Mettre à jour un bloc
   */
  async updateBlock(blockId, userId, blockData) {
    console.log('✏️ [PortfolioService] Mise à jour bloc:', blockId);

    // Vérifier la propriété via une jointure
    const { data: block, error: fetchError } = await this.supabase
      .from('portfolio_blocks')
      .select('*, portfolios!inner(user_id)')
      .eq('id', blockId)
      .single();

    if (fetchError || !block || block.portfolios.user_id !== userId) {
      throw new Error('Bloc non trouvé ou accès refusé');
    }

    const updateData = {};
    if (blockData.content !== undefined) updateData.content = blockData.content;
    if (blockData.order !== undefined) updateData.order = blockData.order;
    if (blockData.type !== undefined) updateData.type = blockData.type;

    const { data: updatedBlock, error } = await this.supabase
      .from('portfolio_blocks')
      .update(updateData)
      .eq('id', blockId)
      .select()
      .single();

    if (error) {
      console.error('❌ [PortfolioService] Erreur mise à jour bloc:', error);
      throw new Error('Impossible de mettre à jour le bloc');
    }

    console.log('✅ [PortfolioService] Bloc mis à jour');
    return updatedBlock;
  }

  /**
   * Supprimer un bloc
   */
  async deleteBlock(blockId, userId) {
    console.log('🗑️ [PortfolioService] Suppression bloc:', blockId);

    // Vérifier la propriété
    const { data: block, error: fetchError } = await this.supabase
      .from('portfolio_blocks')
      .select('*, portfolios!inner(user_id)')
      .eq('id', blockId)
      .single();

    if (fetchError || !block || block.portfolios.user_id !== userId) {
      throw new Error('Bloc non trouvé ou accès refusé');
    }

    const { error } = await this.supabase
      .from('portfolio_blocks')
      .delete()
      .eq('id', blockId);

    if (error) {
      console.error('❌ [PortfolioService] Erreur suppression bloc:', error);
      throw new Error('Impossible de supprimer le bloc');
    }

    console.log('✅ [PortfolioService] Bloc supprimé');
    return true;
  }

  /**
   * Réorganiser les blocs (drag & drop)
   */
  async reorderBlocks(portfolioId, userId, blocksOrder) {
    console.log('🔄 [PortfolioService] Réorganisation blocs');

    // Vérifier que l'utilisateur possède le portfolio
    await this.getPortfolioById(portfolioId, userId);

    // Mettre à jour l'ordre de chaque bloc
    const updates = blocksOrder.map((blockId, index) => 
      this.supabase
        .from('portfolio_blocks')
        .update({ order: index })
        .eq('id', blockId)
        .eq('portfolio_id', portfolioId)
    );

    await Promise.all(updates);

    console.log('✅ [PortfolioService] Blocs réorganisés');
    return true;
  }

  // ==========================================
  // MÉDIAS (Images & Vidéos)
  // ==========================================

  /**
   * Upload un média (image ou vidéo)
   */
  async uploadMedia(userId, portfolioId, file) {
    console.log('📤 [PortfolioService] Upload média:', file.originalname);

    // Déterminer le type
    const isVideo = file.mimetype.startsWith('video/');
    const isImage = file.mimetype.startsWith('image/');

    if (!isVideo && !isImage) {
      throw new Error('Type de fichier non supporté');
    }

    // Générer un nom unique
    const timestamp = Date.now();
    const extension = file.originalname.split('.').pop();
    const filename = `${userId}/${portfolioId}/${timestamp}.${extension}`;

    // Upload vers Supabase Storage
    const { data: uploadData, error: uploadError } = await this.supabase
      .storage
      .from('portfolio-media')
      .upload(filename, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600'
      });

    if (uploadError) {
      console.error('❌ [PortfolioService] Erreur upload:', uploadError);
      throw new Error('Impossible d\'uploader le fichier');
    }

    // Obtenir l'URL publique
    const { data: { publicUrl } } = this.supabase
      .storage
      .from('portfolio-media')
      .getPublicUrl(filename);

    // Enregistrer en base de données
    const { data: media, error: dbError } = await this.supabase
      .from('portfolio_media')
      .insert({
        portfolio_id: portfolioId,
        user_id: userId,
        type: isVideo ? 'video' : 'image',
        url: publicUrl,
        filename: file.originalname,
        size: file.size,
        mime_type: file.mimetype
      })
      .select()
      .single();

    if (dbError) {
      console.error('❌ [PortfolioService] Erreur DB média:', dbError);
      throw new Error('Impossible d\'enregistrer le média');
    }

    console.log('✅ [PortfolioService] Média uploadé:', media.id);
    return media;
  }

  /**
   * Récupérer les médias d'un portfolio
   */
  async getPortfolioMedia(portfolioId) {
    console.log('🖼️ [PortfolioService] Récupération médias pour:', portfolioId);

    const { data: media, error } = await this.supabase
      .from('portfolio_media')
      .select('*')
      .eq('portfolio_id', portfolioId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ [PortfolioService] Erreur récupération médias:', error);
      throw new Error('Impossible de récupérer les médias');
    }

    return media;
  }

  /**
   * Supprimer un média
   */
  async deleteMedia(mediaId, userId) {
    console.log('🗑️ [PortfolioService] Suppression média:', mediaId);

    // Récupérer le média pour avoir le chemin
    const { data: media, error: fetchError } = await this.supabase
      .from('portfolio_media')
      .select('*')
      .eq('id', mediaId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !media) {
      throw new Error('Média non trouvé');
    }

    // Extraire le chemin du fichier depuis l'URL
    const urlParts = media.url.split('/portfolio-media/');
    if (urlParts.length > 1) {
      const filePath = urlParts[1];
      
      // Supprimer du Storage
      await this.supabase
        .storage
        .from('portfolio-media')
        .remove([filePath]);
    }

    // Supprimer de la base de données
    const { error } = await this.supabase
      .from('portfolio_media')
      .delete()
      .eq('id', mediaId);

    if (error) {
      console.error('❌ [PortfolioService] Erreur suppression média:', error);
      throw new Error('Impossible de supprimer le média');
    }

    console.log('✅ [PortfolioService] Média supprimé');
    return true;
  }

  // ==========================================
  // UTILITAIRES
  // ==========================================

  /**
   * Générer un slug unique à partir du titre
   */
  async generateUniqueSlug(title) {
    // Convertir en slug basique
    let slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Supprimer accents
      .replace(/[^a-z0-9]+/g, '-')     // Remplacer caractères spéciaux par -
      .replace(/^-+|-+$/g, '')          // Supprimer - au début/fin
      .substring(0, 50);                 // Limiter la longueur

    // Vérifier si le slug existe déjà
    const { data: existing } = await this.supabase
      .from('portfolios')
      .select('slug')
      .like('slug', `${slug}%`);

    if (existing && existing.length > 0) {
      // Ajouter un numéro
      slug = `${slug}-${existing.length + 1}`;
    }

    return slug;
  }

  /**
   * Récupérer un portfolio complet (avec blocs et médias)
   */
  async getFullPortfolio(portfolioId, userId = null) {
    console.log('📦 [PortfolioService] Récupération portfolio complet:', portfolioId);

    let query = this.supabase
      .from('portfolios')
      .select('*')
      .eq('id', portfolioId);

    // Si userId fourni, vérifier la propriété
    if (userId) {
      query = query.eq('user_id', userId);
    } else {
      // Sinon, seulement les portfolios publiés
      query = query.eq('published', true);
    }

    const { data: portfolio, error } = await query.single();

    if (error) {
      throw new Error('Portfolio non trouvé');
    }

    // Récupérer les blocs
    const blocks = await this.getPortfolioBlocks(portfolioId);

    // Récupérer les médias
    const media = await this.getPortfolioMedia(portfolioId);

    return {
      ...portfolio,
      blocks,
      media
    };
  }

  /**
   * Récupérer un portfolio public complet par slug
   */
  async getFullPortfolioBySlug(slug) {
    console.log('🌐 [PortfolioService] Récupération portfolio public complet:', slug);

    const portfolio = await this.getPortfolioBySlug(slug);
    const blocks = await this.getPortfolioBlocks(portfolio.id);
    const media = await this.getPortfolioMedia(portfolio.id);

    return {
      ...portfolio,
      blocks,
      media
    };
  }
}

module.exports = new PortfolioService();