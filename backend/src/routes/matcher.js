const express = require('express');
const multer = require('multer');
const pdf = require('pdf-parse');
const router = express.Router();

// Import des services
const matcherService = require('../services/matcherService');
const scraperService = require('../services/scraperService');
const jobDiscoveryService = require('../services/jobDiscoveryService');

// Multer pour l'upload du CV PDF (mode rapide)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Seuls les fichiers PDF sont acceptés'));
  }
});

/**
 * ========================================
 * ROUTES MATCHER D'OFFRES
 * ========================================
 */

/**
 * Analyser une offre et générer les documents sélectionnés
 * POST /api/matcher/analyser
 *
 * Body: {
 *   offer: { title, company, location, contract_type, salary, description },
 *   candidate: { prenom, nom, titre_poste, experiences, formations, competences_techniques, competences_soft, langues },
 *   options: { generatePersonalizedCV, generateIdealCV, generateCoverLetter } (optionnel)
 * }
 */
router.post('/analyser', async (req, res) => {
  try {
    const { offer, candidate, options } = req.body;

    console.log('🎯 [MATCHER] Début analyse offre + génération documents...');
    console.log('📋 Offre:', offer.title, 'chez', offer.company);
    console.log('👤 Candidat:', candidate.prenom, candidate.nom);
    console.log('⚙️ Options:', options || { generatePersonalizedCV: true, generateIdealCV: true, generateCoverLetter: true });

    // Validation des données
    if (!offer || !candidate) {
      return res.status(400).json({
        success: false,
        error: 'Données de l\'offre et du candidat requises'
      });
    }

    // Validation de l'offre
    if (!offer.title || !offer.company || !offer.description) {
      return res.status(400).json({
        success: false,
        error: 'Titre du poste, entreprise et description de l\'offre sont obligatoires'
      });
    }

    // Validation du candidat
    if (!candidate.prenom || !candidate.nom || !candidate.titre_poste) {
      return res.status(400).json({
        success: false,
        error: 'Prénom, nom et titre du poste du candidat sont obligatoires'
      });
    }

    const { buildConfig } = req.body;

    // Appel au service pour analyser + générer les documents (avec options)
    const result = await matcherService.analyzeAndGenerate(offer, candidate, options, buildConfig || {});

    console.log('✅ [MATCHER] Analyse et génération terminées avec succès');

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('❌ [MATCHER] Erreur:', error.message);

    if (error.status === 429) {
      return res.status(503).json({
        success: false,
        error: 'Service IA temporairement surchargé. Réessayez dans quelques instants.'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Impossible d\'analyser l\'offre et de générer les documents',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

/**
 * Scraper une URL d'offre d'emploi (étape 1 : extraction du texte brut)
 * POST /api/matcher/scraper-url
 *
 * Body: { url: "https://..." }
 * Response: { rawText, basicOffer: { title, company, ... } }
 */
router.post('/scraper-url', async (req, res) => {
  try {
    const { url } = req.body;

    console.log('🔗 [MATCHER] Scraping URL:', url);

    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL manquante'
      });
    }

    const result = await scraperService.scrapeOffer(url);

    console.log('✅ [MATCHER] Scraping terminé,', result._meta.textLength, 'chars via', result._meta.method);

    res.json({
      success: true,
      data: {
        rawText: result.rawText,
        url: result.url,
        basicOffer: result.basicOffer,
      },
    });

  } catch (error) {
    console.error('❌ [MATCHER] Erreur scraping:', error.message);

    if (error.code === 'AUTH_REQUIRED') {
      return res.status(422).json({
        success: false,
        error: error.message,
        code: 'AUTH_REQUIRED'
      });
    }

    if (error.code === 'SCRAPING_FAILED') {
      return res.status(422).json({
        success: false,
        error: error.message,
        code: 'SCRAPING_FAILED'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Impossible d\'analyser cette URL',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

/**
 * Générer les documents à partir du texte brut scrapé (mode URL)
 * POST /api/matcher/analyser-scraper
 *
 * Body: {
 *   rawText: "texte brut de la page...",
 *   url: "https://...",
 *   candidate: { prenom, nom, titre_poste, ... },
 *   options: { generatePersonalizedCV, generateIdealCV, generateCoverLetter }
 * }
 */
router.post('/analyser-scraper', async (req, res) => {
  try {
    const { rawText, url, candidate, options, buildConfig } = req.body;

    console.log('🔗 [MATCHER] Mode scraper - Génération documents...');
    console.log('👤 Candidat:', candidate?.prenom, candidate?.nom);
    console.log('📄 Texte brut:', rawText?.length, 'chars');
    console.log('⚙️ Options:', options);

    // Validation
    if (!rawText) {
      return res.status(400).json({
        success: false,
        error: 'Texte brut de l\'offre manquant'
      });
    }

    if (!candidate) {
      return res.status(400).json({
        success: false,
        error: 'Données du candidat requises'
      });
    }

    if (!candidate.prenom || !candidate.nom || !candidate.titre_poste) {
      return res.status(400).json({
        success: false,
        error: 'Prénom, nom et titre du poste du candidat sont obligatoires'
      });
    }

    const result = await matcherService.scrapeAndGenerate(rawText, url, candidate, options, buildConfig || {});

    console.log('✅ [MATCHER] Documents générés (mode scraper)');

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('❌ [MATCHER] Erreur scraper:', error.message);

    if (error.status === 429) {
      return res.status(503).json({
        success: false,
        error: 'Service IA temporairement surchargé. Réessayez dans quelques instants.'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Impossible de générer les documents depuis l\'URL scrapée',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

/**
 * Mode Rapide : CV PDF + URL de l'offre → génère tous les documents automatiquement
 * POST /api/matcher/generer-complet
 *
 * Body (multipart/form-data):
 *   cv       : fichier PDF du candidat (max 2 Mo)
 *   offerUrl : URL de l'offre d'emploi
 *   options  : JSON stringifié { generatePersonalizedCV, generateIdealCV, generateCoverLetter }
 */
router.post('/generer-complet', upload.single('cv'), async (req, res) => {
  try {
    const { offerUrl, options: optionsRaw, buildConfig: buildConfigRaw } = req.body;
    const cvFile = req.file;

    console.log('🚀 [MATCHER] Mode Rapide - Démarrage...');

    if (!cvFile) {
      return res.status(400).json({ success: false, error: 'Fichier CV (PDF) manquant' });
    }

    if (!offerUrl) {
      return res.status(400).json({ success: false, error: 'URL de l\'offre manquante' });
    }

    let options = { generatePersonalizedCV: true, generateIdealCV: true, generateCoverLetter: true };
    if (optionsRaw) {
      try { options = JSON.parse(optionsRaw); } catch (_) {}
    }

    let buildConfig = {};
    if (buildConfigRaw) {
      try { buildConfig = JSON.parse(buildConfigRaw); } catch (_) {}
    }

    // Étape 1 : extraction du texte du CV PDF
    console.log('📄 [MATCHER] Extraction du texte du CV...');
    const pdfData = await pdf(cvFile.buffer);
    const cvText = pdfData.text;

    if (!cvText || cvText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        error: 'Impossible de lire le texte du CV. Vérifiez que le PDF n\'est pas une image scannée.'
      });
    }

    // Étape 2 : extraction du profil candidat via IA
    console.log('🤖 [MATCHER] Extraction du profil candidat via IA...');
    const candidate = await matcherService.extractCandidateFromPDF(cvText);

    // Étape 3 : scraping de l'offre
    console.log('🔗 [MATCHER] Scraping de l\'offre:', offerUrl);
    const scraped = await scraperService.scrapeOffer(offerUrl);

    // Étape 4 : génération des documents
    console.log('📝 [MATCHER] Génération des documents...');
    const result = await matcherService.scrapeAndGenerate(scraped.rawText, offerUrl, candidate, options, buildConfig);

    console.log('✅ [MATCHER] Mode Rapide terminé avec succès');

    res.json({ success: true, data: result });

  } catch (error) {
    console.error('❌ [MATCHER] Erreur mode rapide:', error.message);

    if (error.code === 'AUTH_REQUIRED') {
      return res.status(422).json({ success: false, error: error.message, code: 'AUTH_REQUIRED' });
    }
    if (error.code === 'SCRAPING_FAILED') {
      return res.status(422).json({ success: false, error: error.message, code: 'SCRAPING_FAILED' });
    }
    if (error.status === 429) {
      return res.status(503).json({ success: false, error: 'Service IA temporairement surchargé. Réessayez dans quelques instants.' });
    }

    res.status(500).json({
      success: false,
      error: 'Impossible de générer les documents',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

/**
 * Adaptation rapide depuis le mode Découverte
 * CV PDF + données structurées de l'offre → CV adapté (sans re-scraper l'URL)
 * POST /api/matcher/adapter-rapide
 *
 * Body (multipart/form-data):
 *   cv          : fichier PDF du candidat (max 2 Mo)
 *   offer       : JSON stringifié { title, company, location, contract_type, description }
 *   buildConfig : JSON stringifié (optionnel) { shape, style, blockStyles }
 */
router.post('/adapter-rapide', upload.single('cv'), async (req, res) => {
  try {
    const { offer: offerRaw, buildConfig: buildConfigRaw } = req.body;
    const cvFile = req.file;

    console.log('⚡ [MATCHER] Adaptation rapide - Démarrage...');

    if (!cvFile) {
      return res.status(400).json({ success: false, error: 'Fichier CV (PDF) manquant' });
    }

    if (!offerRaw) {
      return res.status(400).json({ success: false, error: 'Données de l\'offre manquantes' });
    }

    let offer;
    try { offer = JSON.parse(offerRaw); } catch (_) {
      return res.status(400).json({ success: false, error: 'Format des données de l\'offre invalide' });
    }

    if (!offer.title && !offer.description) {
      return res.status(400).json({ success: false, error: 'Titre ou description de l\'offre obligatoire' });
    }

    let buildConfig = { shape: 'minimal_pro', style: 'ardoise', blockStyles: {} };
    if (buildConfigRaw) {
      try { buildConfig = { ...buildConfig, ...JSON.parse(buildConfigRaw) }; } catch (_) {}
    }

    // Étape 1 : extraction du texte du CV PDF
    console.log('📄 [MATCHER] Extraction du texte du CV...');
    const pdfData = await pdf(cvFile.buffer);
    const cvText = pdfData.text;

    if (!cvText || cvText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        error: 'Impossible de lire le texte du CV. Vérifiez que le PDF n\'est pas une image scannée.'
      });
    }

    // Étape 2 : extraction du profil candidat via IA
    console.log('🤖 [MATCHER] Extraction du profil candidat via IA...');
    const candidate = await matcherService.extractCandidateFromPDF(cvText);

    // Étape 3 : génération du CV adapté (uniquement CV personnalisé, pas de CV idéal ni lettre)
    console.log('📝 [MATCHER] Génération du CV adapté pour:', offer.title, 'chez', offer.company);
    const options = { generatePersonalizedCV: true, generateIdealCV: false, generateCoverLetter: false };
    const result = await matcherService.analyzeAndGenerate(offer, candidate, options, buildConfig);

    console.log('✅ [MATCHER] Adaptation rapide terminée');

    res.json({ success: true, data: result });

  } catch (error) {
    console.error('❌ [MATCHER] Erreur adaptation rapide:', error.message);

    if (error.status === 429) {
      return res.status(503).json({ success: false, error: 'Service IA temporairement surchargé. Réessayez dans quelques instants.' });
    }

    res.status(500).json({
      success: false,
      error: 'Impossible d\'adapter le CV',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

/**
 * Mode Découverte : analyser un CV et trouver des offres correspondantes
 * POST /api/matcher/decouvrir-offres
 *
 * Body (multipart/form-data):
 *   cv : fichier PDF du candidat (max 2 Mo)
 */
router.post('/decouvrir-offres', upload.single('cv'), async (req, res) => {
  try {
    const cvFile = req.file;

    console.log('🔍 [MATCHER] Mode Découverte - Démarrage...');

    if (!cvFile) {
      return res.status(400).json({ success: false, error: 'Fichier CV (PDF) manquant' });
    }

    // Extraction du texte du CV
    const pdfData = await pdf(cvFile.buffer);
    const cvText = pdfData.text;

    if (!cvText || cvText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        error: 'Impossible de lire le texte du CV. Vérifiez que le PDF n\'est pas une image scannée.'
      });
    }

    // Sources sélectionnées par l'utilisateur (ou défaut WTTJ + France Travail)
    let sources = ['wttj', 'france_travail'];
    if (req.body.sources) {
      try {
        sources = JSON.parse(req.body.sources);
      } catch (_) {}
    }

    // Filtres optionnels (localisation, type de contrat)
    const filters = {};
    if (req.body.localisation) filters.localisation = req.body.localisation;
    if (req.body.typeContrat) filters.typeContrat = req.body.typeContrat;

    const result = await jobDiscoveryService.discoverJobs(cvText, sources, filters);

    console.log('✅ [MATCHER] Découverte terminée:', result.metiers?.length, 'métiers,', result.offres?.length, 'offres');

    res.json({ success: true, data: result });

  } catch (error) {
    console.error('❌ [MATCHER] Erreur découverte:', error.message);

    if (error.status === 429) {
      return res.status(503).json({ success: false, error: 'Service IA temporairement surchargé. Réessayez dans quelques instants.' });
    }

    res.status(500).json({
      success: false,
      error: 'Impossible de rechercher des offres',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

/**
 * Extraire le profil candidat depuis un CV PDF
 * POST /api/matcher/extraire-candidat-pdf
 *
 * Body (multipart/form-data):
 *   cv : fichier PDF du candidat (max 2 Mo)
 * Response: { success: true, data: { prenom, nom, titre_poste, ... } }
 */
router.post('/extraire-candidat-pdf', upload.single('cv'), async (req, res) => {
  try {
    const cvFile = req.file;

    if (!cvFile) {
      return res.status(400).json({ success: false, error: 'Fichier CV (PDF) manquant' });
    }

    const pdfData = await pdf(cvFile.buffer);
    const cvText = pdfData.text;

    if (!cvText || cvText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        error: 'Impossible de lire le texte du CV. Vérifiez que le PDF n\'est pas une image scannée.'
      });
    }

    console.log('🤖 [MATCHER] Extraction profil candidat depuis PDF...');
    const candidate = await matcherService.extractCandidateFromPDF(cvText);

    console.log('✅ [MATCHER] Profil extrait:', candidate.prenom, candidate.nom);

    res.json({ success: true, data: candidate });

  } catch (error) {
    console.error('❌ [MATCHER] Erreur extraction PDF:', error.message);

    if (error.status === 429) {
      return res.status(503).json({ success: false, error: 'Service IA temporairement surchargé. Réessayez dans quelques instants.' });
    }

    res.status(500).json({
      success: false,
      error: 'Impossible d\'extraire les données du CV',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

/**
 * Route de test (santé du service)
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'matcher',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
