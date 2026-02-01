const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

// Connexion à Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

/**
 * Incrémenter le compteur de vues d'un portfolio
 * POST /api/portfolio-stats/increment-views
 */
router.post('/increment-views', async (req, res) => {
  try {
    const { portfolioId } = req.body;

    if (!portfolioId) {
      return res.status(400).json({
        success: false,
        error: 'portfolioId requis'
      });
    }

    console.log('📊 Incrémentation des vues pour portfolio:', portfolioId);

    // Appeler la fonction SQL qu'on a créée
    const { error } = await supabase.rpc('increment_portfolio_views', {
      portfolio_id: portfolioId
    });

    if (error) {
      console.error('❌ Erreur Supabase:', error);
      throw error;
    }

    console.log('✅ Vues incrémentées avec succès');

    res.json({ success: true });

  } catch (error) {
    console.error('❌ Erreur incrémentation vues:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
});

module.exports = router;