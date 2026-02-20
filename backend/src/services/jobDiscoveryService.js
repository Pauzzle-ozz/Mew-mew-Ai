const puppeteer = require('puppeteer');
const axios = require('axios');
const aiService = require('./aiService');
const { buildPrompt: buildAnalyseProfilePrompt } = require('../prompts/analyseProfileForJobs');

const BROWSER_ARGS = ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'];
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

/**
 * Service de découverte d'offres d'emploi
 * - Analyse le CV avec IA pour identifier les métiers correspondants
 * - Scrape plusieurs job boards (WTTJ, Indeed, HelloWork, APEC)
 * - Interroge l'API France Travail si les clés sont configurées
 */
class JobDiscoveryService {
  /**
   * Analyser un CV et trouver des offres correspondantes
   * @param {string} cvText - Texte extrait du CV PDF
   * @param {string[]} sources - Sources à utiliser (ex: ['wttj', 'france_travail', 'indeed'])
   * @param {Object} filters - Filtres optionnels { localisation, typeContrat }
   * @returns {{ metiers, offres }}
   */
  async discoverJobs(cvText, sources = ['wttj', 'france_travail'], filters = {}) {
    console.log('🔍 [JobDiscovery] Analyse du profil...');
    console.log('📡 [JobDiscovery] Sources sélectionnées:', sources);
    if (filters.localisation) console.log('📍 [JobDiscovery] Localisation:', filters.localisation);
    if (filters.typeContrat) console.log('📋 [JobDiscovery] Type contrat:', filters.typeContrat);

    // Étape 1 : Identifier les métiers via IA
    const profileAnalysis = await this._analyzeProfile(cvText);
    console.log('✅ [JobDiscovery] Métiers identifiés:', profileAnalysis.metiers?.map(m => m.titre));

    // Étape 2 : Scraper les offres en parallèle pour chaque métier (max 3 métiers pour performance)
    const metiersToSearch = profileAnalysis.metiers?.slice(0, 3) || [];
    const offresParMetier = await Promise.allSettled(
      metiersToSearch.map(metier => this._searchOffresForMetier(metier, sources, filters))
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
   * Rechercher des offres pour un métier donné sur les sources sélectionnées
   */
  async _searchOffresForMetier(metier, sources, filters = {}) {
    const searches = [];

    if (sources.includes('wttj')) searches.push(this._scrapeWTTJ(metier.titre, metier.mots_cles, filters));
    if (sources.includes('france_travail')) searches.push(this._searchFranceTravail(metier.titre, metier.mots_cles, filters));
    if (sources.includes('indeed')) searches.push(this._scrapeIndeed(metier.titre, filters));
    if (sources.includes('hellowork')) searches.push(this._scrapeHelloWork(metier.titre, filters));
    if (sources.includes('apec')) searches.push(this._scrapeAPEC(metier.titre, filters));

    const results = await Promise.allSettled(searches);
    const offres = [];
    results.forEach(r => {
      if (r.status === 'fulfilled') offres.push(...r.value);
    });

    // Taguer chaque offre avec le métier correspondant
    return offres.map(o => ({ ...o, metier_correspondant: metier.titre }));
  }

  /**
   * Lancer un navigateur Puppeteer avec les options standard
   */
  async _launchBrowser() {
    return puppeteer.launch({
      headless: 'new',
      args: BROWSER_ARGS,
      timeout: 20000
    });
  }

  /**
   * Scraper Welcome to the Jungle avec Puppeteer
   */
  async _scrapeWTTJ(titrePoste, motsCles = [], filters = {}) {
    console.log(`🌍 [JobDiscovery] Scraping WTTJ pour: ${titrePoste}`);

    const query = encodeURIComponent(titrePoste);
    let url = `https://www.welcometothejungle.com/fr/jobs?query=${query}&page=1`;
    if (filters.localisation) url += `&aroundQuery=${encodeURIComponent(filters.localisation)}`;
    if (filters.typeContrat) {
      const wttjContracts = { 'CDI': 'permanent', 'CDD': 'fixed_term', 'Stage': 'internship', 'Alternance': 'apprenticeship', 'Freelance': 'freelance' };
      if (wttjContracts[filters.typeContrat]) url += `&contractType=${wttjContracts[filters.typeContrat]}`;
    }

    let browser;
    try {
      browser = await this._launchBrowser();

      const page = await browser.newPage();
      await page.setUserAgent(USER_AGENT);
      await page.setViewport({ width: 1280, height: 800 });

      await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });

      // Attendre que les offres chargent - essayer plusieurs sélecteurs
      try {
        await page.waitForSelector('a[href*="/fr/companies/"][href*="/jobs/"], [data-testid="job-card"], [role="list"]', { timeout: 10000 });
      } catch (_) {
        await new Promise(r => setTimeout(r, 3000));
      }

      const offres = await page.evaluate(() => {
        const results = [];
        const seenUrls = new Set();

        // Stratégie 1 : Liens vers des offres WTTJ (pattern /fr/companies/xxx/jobs/xxx)
        const jobLinks = document.querySelectorAll('a[href*="/companies/"][href*="/jobs/"]');

        jobLinks.forEach(link => {
          if (results.length >= 10) return;
          const href = link.href;
          if (!href || seenUrls.has(href)) return;
          // Ignorer les liens de navigation/filtres
          if (href.includes('?') && !href.includes('/jobs/')) return;
          seenUrls.add(href);

          const card = link.closest('[data-testid="job-card"]') || link.closest('li') || link.closest('article') || link.closest('div[role="listitem"]') || link.parentElement?.parentElement;
          if (!card) return;

          const titre = card.querySelector('h3, h4, [role="heading"]')?.textContent?.trim() || link.querySelector('h3, h4, span')?.textContent?.trim();
          if (!titre || titre.length < 3) return;

          const entreprise = card.querySelector('[class*="company"], [class*="Company"], img[alt]')?.getAttribute('alt') || card.querySelector('[class*="employer"]')?.textContent?.trim() || '';
          const lieu = card.querySelector('[class*="location"], [class*="Location"], [class*="city"]')?.textContent?.trim() || '';
          const contrat = card.querySelector('[class*="contract"], [class*="Contract"]')?.textContent?.trim() || '';
          const description = card.querySelector('p, [class*="description"]')?.textContent?.trim()?.slice(0, 200) || '';

          results.push({ titre: titre.slice(0, 150), entreprise, lieu, contrat, url: href, description, source: 'WTTJ' });
        });

        // Stratégie 2 (fallback) : data-testid ou structure liste
        if (results.length === 0) {
          const cards = document.querySelectorAll('[data-testid="job-card"], [role="listitem"], li[class]');
          cards.forEach(card => {
            if (results.length >= 10) return;
            const a = card.querySelector('a[href]');
            const h = card.querySelector('h3, h4, h2');
            if (!a || !h) return;
            const href = a.href;
            if (!href || seenUrls.has(href)) return;
            seenUrls.add(href);
            results.push({ titre: h.textContent?.trim()?.slice(0, 150) || '', entreprise: '', lieu: '', contrat: '', url: href, description: '', source: 'WTTJ' });
          });
        }

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
  async _searchFranceTravail(titrePoste, motsCles = [], filters = {}) {
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
            sort: 1,
            ...(filters.localisation && { commune: filters.localisation }),
            ...(filters.typeContrat && {
              typeContrat: { 'CDI': 'CDI', 'CDD': 'CDD', 'Stage': 'MIS', 'Alternance': 'SAI', 'Freelance': 'LIB' }[filters.typeContrat] || filters.typeContrat
            })
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
   * Scraper Indeed France avec Puppeteer
   */
  async _scrapeIndeed(titrePoste, filters = {}) {
    console.log(`🔵 [JobDiscovery] Scraping Indeed pour: ${titrePoste}`);

    const query = encodeURIComponent(titrePoste);
    const location = filters.localisation ? encodeURIComponent(filters.localisation) : 'France';
    let url = `https://fr.indeed.com/jobs?q=${query}&l=${location}&sort=date`;
    if (filters.typeContrat) {
      const indeedContracts = { 'CDI': 'permanent', 'CDD': 'contract', 'Stage': 'internship', 'Alternance': 'apprenticeship', 'Freelance': 'subcontract' };
      if (indeedContracts[filters.typeContrat]) url += `&jt=${indeedContracts[filters.typeContrat]}`;
    }

    let browser;
    try {
      browser = await this._launchBrowser();
      const page = await browser.newPage();
      await page.setUserAgent(USER_AGENT);
      await page.setViewport({ width: 1280, height: 800 });

      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });

      try {
        await page.waitForSelector('.job_seen_beacon, .jobsearch-ResultsList li, .resultContent', { timeout: 8000 });
      } catch (_) {}

      const offres = await page.evaluate(() => {
        const results = [];
        const cards = document.querySelectorAll('.job_seen_beacon, .jobsearch-ResultsList > li, .resultContent');

        cards.forEach((card, idx) => {
          if (idx >= 10) return;
          const titre = card.querySelector('h2 a span, .jobTitle span, h2 span')?.textContent?.trim();
          const entreprise = card.querySelector('[data-testid="company-name"], .companyName, .company_location .companyName')?.textContent?.trim();
          const lieu = card.querySelector('[data-testid="text-location"], .companyLocation, .company_location .companyLocation')?.textContent?.trim();
          const lien = card.querySelector('h2 a, a[data-jk]')?.href;
          const description = card.querySelector('.job-snippet, .summary, [class*="snippet"]')?.textContent?.trim()?.slice(0, 200);

          if (titre && lien) {
            results.push({ titre, entreprise: entreprise || '', lieu: lieu || '', contrat: '', url: lien, description: description || '', source: 'Indeed' });
          }
        });
        return results;
      });

      console.log(`✅ [Indeed] ${offres.length} offres trouvées pour "${titrePoste}"`);
      return offres;

    } catch (error) {
      console.error(`❌ [Indeed] Erreur scraping pour "${titrePoste}":`, error.message);
      return [];
    } finally {
      if (browser) await browser.close();
    }
  }

  /**
   * Scraper HelloWork avec Puppeteer
   */
  async _scrapeHelloWork(titrePoste, filters = {}) {
    console.log(`👋 [JobDiscovery] Scraping HelloWork pour: ${titrePoste}`);

    const query = encodeURIComponent(titrePoste);
    let url = `https://www.hellowork.com/fr-fr/emploi/recherche.html?k=${query}`;
    if (filters.localisation) url += `&l=${encodeURIComponent(filters.localisation)}`;
    if (filters.typeContrat) {
      const hwContracts = { 'CDI': 'CDI', 'CDD': 'CDD', 'Stage': 'Stage', 'Alternance': 'Alternance', 'Freelance': 'Freelance' };
      if (hwContracts[filters.typeContrat]) url += `&c=${encodeURIComponent(hwContracts[filters.typeContrat])}`;
    }

    let browser;
    try {
      browser = await this._launchBrowser();
      const page = await browser.newPage();
      await page.setUserAgent(USER_AGENT);
      await page.setViewport({ width: 1280, height: 800 });

      await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });

      // Attendre que la page charge - essayer plusieurs sélecteurs
      try {
        await page.waitForSelector('ul li a[href*="/fr-fr/emplois/"], ul li a[href*="/emploi/"], h3, [data-cy]', { timeout: 10000 });
      } catch (_) {
        // Attente supplémentaire pour le rendu JS
        await new Promise(r => setTimeout(r, 3000));
      }

      const offres = await page.evaluate(() => {
        const results = [];

        // Stratégie 1 : Chercher les liens qui pointent vers des offres HelloWork
        const allLinks = document.querySelectorAll('a[href*="/fr-fr/emplois/"], a[href*="/emploi/"]');
        const seenUrls = new Set();

        allLinks.forEach(link => {
          if (results.length >= 10) return;
          const href = link.href;
          if (!href || seenUrls.has(href) || href.includes('recherche.html')) return;
          seenUrls.add(href);

          // Remonter au conteneur parent (li, article, div) pour extraire les infos
          const card = link.closest('li') || link.closest('article') || link.closest('div[class]') || link.parentElement;
          if (!card) return;

          const titre = card.querySelector('h3, h2')?.textContent?.trim() || link.textContent?.trim();
          if (!titre || titre.length < 3) return;

          // Extraire les autres infos depuis le conteneur
          const allText = card.textContent || '';
          const entreprise = card.querySelector('[class*="company"], [class*="Company"], [class*="recruiter"], [class*="corporate"]')?.textContent?.trim() || '';
          const lieu = card.querySelector('[class*="location"], [class*="Location"], [class*="city"], [class*="place"]')?.textContent?.trim() || '';
          const contrat = card.querySelector('[class*="contract"], [class*="Contract"], [class*="tag"], [class*="badge"]')?.textContent?.trim() || '';

          results.push({
            titre: titre.slice(0, 150),
            entreprise,
            lieu,
            contrat,
            url: href,
            description: '',
            source: 'HelloWork'
          });
        });

        // Stratégie 2 (fallback) : Si rien trouvé, chercher les h3 dans des listes
        if (results.length === 0) {
          const listItems = document.querySelectorAll('li, article, [role="listitem"]');
          listItems.forEach(item => {
            if (results.length >= 10) return;
            const h = item.querySelector('h3, h2');
            const a = item.querySelector('a[href]');
            if (!h || !a) return;
            const href = a.href;
            if (!href || seenUrls.has(href)) return;
            seenUrls.add(href);

            results.push({
              titre: h.textContent?.trim()?.slice(0, 150) || '',
              entreprise: '',
              lieu: '',
              contrat: '',
              url: href,
              description: '',
              source: 'HelloWork'
            });
          });
        }

        return results;
      });

      console.log(`✅ [HelloWork] ${offres.length} offres trouvées pour "${titrePoste}"`);
      return offres;

    } catch (error) {
      console.error(`❌ [HelloWork] Erreur scraping pour "${titrePoste}":`, error.message);
      return [];
    } finally {
      if (browser) await browser.close();
    }
  }

  /**
   * Scraper APEC (offres cadres) avec Puppeteer
   */
  async _scrapeAPEC(titrePoste, filters = {}) {
    console.log(`🎩 [JobDiscovery] Scraping APEC pour: ${titrePoste}`);

    const query = encodeURIComponent(titrePoste);
    let url = `https://www.apec.fr/candidat/recherche-emploi.html/emploi?motsCles=${query}`;
    if (filters.localisation) url += `&lieux=${encodeURIComponent(filters.localisation)}`;

    let browser;
    try {
      browser = await this._launchBrowser();
      const page = await browser.newPage();
      await page.setUserAgent(USER_AGENT);
      await page.setViewport({ width: 1280, height: 800 });

      await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });

      // Attendre le chargement des offres APEC
      try {
        await page.waitForSelector('a[href*="/candidat/recherche-emploi.html/offres/"], a[href*="/offres/"], [class*="card-offer"], [class*="CardOffer"]', { timeout: 10000 });
      } catch (_) {
        await new Promise(r => setTimeout(r, 3000));
      }

      const offres = await page.evaluate(() => {
        const results = [];
        const seenUrls = new Set();

        // Stratégie 1 : Liens vers des offres APEC (pattern /offres/XXXXX)
        const jobLinks = document.querySelectorAll('a[href*="/offres/"]');

        jobLinks.forEach(link => {
          if (results.length >= 10) return;
          const href = link.href;
          if (!href || seenUrls.has(href)) return;
          // Filtrer les liens de navigation (pas d'ID numérique)
          if (!href.match(/\/offres\/\d+/) && !href.match(/\/offres\/[a-f0-9-]+/)) return;
          seenUrls.add(href);

          const card = link.closest('[class*="card"]') || link.closest('li') || link.closest('article') || link.closest('div[class]') || link.parentElement?.parentElement;
          if (!card) return;

          const titre = card.querySelector('h2, h3, h4, [class*="title"], [class*="Title"]')?.textContent?.trim() || link.textContent?.trim();
          if (!titre || titre.length < 3) return;

          const entreprise = card.querySelector('[class*="company"], [class*="Company"], [class*="employer"], [class*="entreprise"]')?.textContent?.trim() || '';
          const lieu = card.querySelector('[class*="location"], [class*="Location"], [class*="lieu"], [class*="city"]')?.textContent?.trim() || '';
          const contrat = card.querySelector('[class*="contract"], [class*="Contract"], [class*="contrat"]')?.textContent?.trim() || '';
          const description = card.querySelector('[class*="description"], p')?.textContent?.trim()?.slice(0, 200) || '';

          results.push({ titre: titre.slice(0, 150), entreprise, lieu, contrat, url: href, description, source: 'APEC' });
        });

        // Stratégie 2 (fallback) : Cartes avec heading + lien
        if (results.length === 0) {
          const cards = document.querySelectorAll('[class*="card"], article, li[class]');
          cards.forEach(card => {
            if (results.length >= 10) return;
            const a = card.querySelector('a[href]');
            const h = card.querySelector('h2, h3, h4');
            if (!a || !h) return;
            const href = a.href;
            if (!href || seenUrls.has(href) || href === window.location.href) return;
            seenUrls.add(href);
            results.push({ titre: h.textContent?.trim()?.slice(0, 150) || '', entreprise: '', lieu: '', contrat: '', url: href, description: '', source: 'APEC' });
          });
        }

        return results;
      });

      console.log(`✅ [APEC] ${offres.length} offres trouvées pour "${titrePoste}"`);
      return offres;

    } catch (error) {
      console.error(`❌ [APEC] Erreur scraping pour "${titrePoste}":`, error.message);
      return [];
    } finally {
      if (browser) await browser.close();
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
