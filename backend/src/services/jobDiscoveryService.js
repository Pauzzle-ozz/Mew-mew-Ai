const puppeteer = require('puppeteer');
const axios = require('axios');
const aiService = require('./aiService');
const { buildPrompt: buildAnalyseProfilePrompt } = require('../prompts/analyseProfileForJobs');

/**
 * Service de découverte d'offres d'emploi
 * - Analyse le CV avec IA pour identifier les métiers correspondants
 * - Scrape WTTJ avec Puppeteer
 * - Interroge l'API France Travail si les clés sont configurées
 */
class JobDiscoveryService {
  /**
   * Analyser un CV et trouver des offres correspondantes
   * @param {string} cvText - Texte extrait du CV PDF
   * @returns {{ metiers, offres }}
   */
  async discoverJobs(cvText) {
    console.log('🔍 [JobDiscovery] Analyse du profil...');

    // Étape 1 : Identifier les métiers via IA
    const profileAnalysis = await this._analyzeProfile(cvText);
    console.log('✅ [JobDiscovery] Métiers identifiés:', profileAnalysis.metiers?.map(m => m.titre));

    // Étape 2 : Scraper les offres en parallèle pour chaque métier (max 3 métiers pour performance)
    const metiersToSearch = profileAnalysis.metiers?.slice(0, 3) || [];
    const offresParMetier = await Promise.allSettled(
      metiersToSearch.map(metier => this._searchOffresForMetier(metier))
    );

    // Agréger les résultats (ignorer les erreurs)
    const offres = [];
    offresParMetier.forEach((result, idx) => {
      if (result.status === 'fulfilled') {
        offres.push(...result.value);
      } else {
        console.warn(`⚠️ [JobDiscovery] Erreur pour le métier ${metiersToSearch[idx]?.titre}:`, result.reason?.message);
      }
    });

    // Dédupliquer par URL
    const offresUniques = this._deduplicateOffres(offres);

    console.log(`✅ [JobDiscovery] ${offresUniques.length} offres trouvées au total`);

    return {
      metiers: profileAnalysis.metiers || [],
      niveau_experience: profileAnalysis.niveau_experience || 'confirme',
      resume_profil: profileAnalysis.resume_profil || '',
      offres: offresUniques
    };
  }

  /**
   * Analyser le profil CV via IA
   */
  async _analyzeProfile(cvText) {
    const prompt = buildAnalyseProfilePrompt(cvText);
    const result = await aiService.generateJSON(prompt, { model: 'gpt-4.1-mini' });
    return result;
  }

  /**
   * Rechercher des offres pour un métier donné (WTTJ + France Travail)
   */
  async _searchOffresForMetier(metier) {
    const offres = [];

    // Recherche en parallèle sur les deux sources
    const [wttjOffres, ftOffres] = await Promise.allSettled([
      this._scrapeWTTJ(metier.titre, metier.mots_cles),
      this._searchFranceTravail(metier.titre, metier.mots_cles)
    ]);

    if (wttjOffres.status === 'fulfilled') offres.push(...wttjOffres.value);
    if (ftOffres.status === 'fulfilled') offres.push(...ftOffres.value);

    // Taguer chaque offre avec le métier correspondant
    return offres.map(o => ({ ...o, metier_correspondant: metier.titre }));
  }

  /**
   * Scraper Welcome to the Jungle avec Puppeteer
   */
  async _scrapeWTTJ(titrePoste, motsCles = []) {
    console.log(`🌍 [JobDiscovery] Scraping WTTJ pour: ${titrePoste}`);

    const query = encodeURIComponent(titrePoste);
    const url = `https://www.welcometothejungle.com/fr/jobs?query=${query}&page=1`;

    let browser;
    try {
      browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
        timeout: 20000
      });

      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      await page.setViewport({ width: 1280, height: 800 });

      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });

      // Attendre que les offres chargent
      try {
        await page.waitForSelector('[data-testid="job-card"]', { timeout: 8000 });
      } catch (_) {
        // Essai avec un autre sélecteur
        await page.waitForSelector('article', { timeout: 5000 });
      }

      // Extraire les offres
      const offres = await page.evaluate(() => {
        const results = [];

        // Sélecteurs WTTJ (peuvent changer, on essaie plusieurs)
        const cards = document.querySelectorAll('[data-testid="job-card"], article[class*="Job"], li[class*="job"]');

        cards.forEach((card, idx) => {
          if (idx >= 10) return; // Max 10 offres par recherche

          const titre = card.querySelector('h3, h2, [class*="title"], [class*="Title"]')?.textContent?.trim();
          const entreprise = card.querySelector('[class*="company"], [class*="Company"], [class*="employer"]')?.textContent?.trim();
          const lieu = card.querySelector('[class*="location"], [class*="Location"], [class*="city"]')?.textContent?.trim();
          const contrat = card.querySelector('[class*="contract"], [class*="Contract"], [class*="type"]')?.textContent?.trim();
          const lien = card.querySelector('a')?.href;
          const description = card.querySelector('[class*="description"], p')?.textContent?.trim()?.slice(0, 200);

          if (titre && lien) {
            results.push({ titre, entreprise: entreprise || '', lieu: lieu || '', contrat: contrat || '', url: lien, description: description || '', source: 'WTTJ' });
          }
        });

        return results;
      });

      console.log(`✅ [WTTJ] ${offres.length} offres trouvées pour "${titrePoste}"`);
      return offres;

    } catch (error) {
      console.error(`❌ [WTTJ] Erreur scraping pour "${titrePoste}":`, error.message);
      return [];
    } finally {
      if (browser) await browser.close();
    }
  }

  /**
   * Rechercher des offres via l'API France Travail (Pôle Emploi)
   * Nécessite FT_CLIENT_ID et FT_CLIENT_SECRET dans .env
   */
  async _searchFranceTravail(titrePoste, motsCles = []) {
    const clientId = process.env.FT_CLIENT_ID;
    const clientSecret = process.env.FT_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.log('ℹ️ [FranceTravail] Clés API non configurées, skipping...');
      return [];
    }

    console.log(`🇫🇷 [FranceTravail] Recherche pour: ${titrePoste}`);

    try {
      // Obtenir un token OAuth2
      const tokenResponse = await axios.post(
        'https://entreprise.francetravail.fr/connexion/oauth2/access_token?realm=%2Fpartenaire',
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: clientId,
          client_secret: clientSecret,
          scope: 'api_offresdemploiv2 o2dsoffre'
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          timeout: 10000
        }
      );

      const token = tokenResponse.data.access_token;
      if (!token) throw new Error('Token France Travail non reçu');

      // Rechercher les offres
      const searchResponse = await axios.get(
        'https://api.francetravail.io/partenaire/offresdemploi/v2/offres/search',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
          },
          params: {
            motsCles: titrePoste,
            range: '0-9',
            sort: 1
          },
          timeout: 10000
        }
      );

      const rawOffres = searchResponse.data?.resultats || [];

      const offres = rawOffres.map(o => ({
        titre: o.intitule || '',
        entreprise: o.entreprise?.nom || '',
        lieu: o.lieuTravail?.libelle || '',
        contrat: o.typeContratLibelle || '',
        url: o.origineOffre?.urlOrigine || `https://candidat.francetravail.fr/offres/recherche/detail/${o.id}`,
        description: o.description?.slice(0, 200) || '',
        source: 'France Travail',
        date_publication: o.dateCreation || ''
      }));

      console.log(`✅ [FranceTravail] ${offres.length} offres trouvées pour "${titrePoste}"`);
      return offres;

    } catch (error) {
      console.error(`❌ [FranceTravail] Erreur pour "${titrePoste}":`, error.message);
      return [];
    }
  }

  /**
   * Dédupliquer les offres par URL
   */
  _deduplicateOffres(offres) {
    const seen = new Set();
    return offres.filter(o => {
      if (!o.url || seen.has(o.url)) return false;
      seen.add(o.url);
      return true;
    });
  }
}

module.exports = new JobDiscoveryService();
