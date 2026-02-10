const axios = require('axios');
const puppeteer = require('puppeteer');

const AXIOS_TIMEOUT = 10000;    // 10s pour la requête HTTP simple
const PUPPETEER_TIMEOUT = 15000; // 15s pour le rendu JS
const MIN_TEXT_LENGTH = 200;    // Seuil minimum pour considérer l'extraction réussie

// Sites qui nécessitent une authentification → scraping direct voué à l'échec
const RESTRICTED_SITES = [
  'linkedin.com/jobs',
  'linkedin.com/in/',
  'glassdoor.fr',
  'glassdoor.com',
];

// User-Agent qui ressemble à un navigateur Chrome récent
const BROWSER_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

class ScraperService {

  // ─────────────────────────────────────────────────────────
  // VALIDATION
  // ─────────────────────────────────────────────────────────

  validateUrl(url) {
    if (!url || typeof url !== 'string') {
      throw new Error('URL manquante');
    }
    try {
      const parsed = new URL(url);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        throw new Error('L\'URL doit commencer par http:// ou https://');
      }
    } catch (e) {
      if (e.message.includes('http')) throw e;
      throw new Error(`URL invalide : ${url}`);
    }
  }

  isRestrictedSite(url) {
    return RESTRICTED_SITES.some(site => url.includes(site));
  }

  // ─────────────────────────────────────────────────────────
  // EXTRACTION DE TEXTE DEPUIS HTML
  // ─────────────────────────────────────────────────────────

  extractTextFromHtml(html) {
    let text = html;

    // Supprimer les blocs script et style entiers
    text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ');
    text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ');

    // Supprimer les commentaires HTML
    text = text.replace(/<!--[\s\S]*?-->/g, ' ');

    // Remplacer les balises de mise en page par des sauts de ligne
    text = text.replace(/<(br|p|div|li|h[1-6]|tr|td|th)[^>]*>/gi, '\n');

    // Supprimer toutes les balises HTML restantes
    text = text.replace(/<[^>]+>/g, ' ');

    // Décoder les entités HTML courantes
    const entities = {
      '&amp;': '&', '&lt;': '<', '&gt;': '>',
      '&quot;': '"', '&#39;': "'", '&apos;': "'",
      '&nbsp;': ' ', '&eacute;': 'é', '&egrave;': 'è',
      '&ecirc;': 'ê', '&euml;': 'ë', '&agrave;': 'à',
      '&acirc;': 'â', '&auml;': 'ä', '&icirc;': 'î',
      '&iuml;': 'ï', '&ocirc;': 'ô', '&ouml;': 'ö',
      '&ucirc;': 'û', '&uuml;': 'ü', '&ccedil;': 'ç',
      '&OElig;': 'Œ', '&oelig;': 'œ', '&laquo;': '«',
      '&raquo;': '»', '&mdash;': '—', '&ndash;': '–',
      '&hellip;': '…', '&euro;': '€',
    };
    for (const [entity, char] of Object.entries(entities)) {
      text = text.replace(new RegExp(entity, 'gi'), char);
    }
    text = text.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)));
    text = text.replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));

    // Normaliser les espaces et sauts de ligne
    text = text.replace(/[ \t]+/g, ' ');
    text = text.replace(/\n{3,}/g, '\n\n');
    return text.trim();
  }

  // ─────────────────────────────────────────────────────────
  // MÉTHODE 1 : AXIOS (rapide, sans rendu JS)
  // ─────────────────────────────────────────────────────────

  async scrapeWithAxios(url) {
    try {
      const response = await axios.get(url, {
        timeout: AXIOS_TIMEOUT,
        headers: {
          'User-Agent': BROWSER_USER_AGENT,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
          'Accept-Encoding': 'gzip, deflate, br',
          'Cache-Control': 'no-cache',
        },
        maxRedirects: 5,
        responseType: 'text',
      });

      return this.extractTextFromHtml(response.data);
    } catch (error) {
      console.log(`🔶 [ScraperService] Axios échoué : ${error.message}`);
      return null;
    }
  }

  // ─────────────────────────────────────────────────────────
  // MÉTHODE 2 : PUPPETEER (lent, gère le rendu JS)
  // ─────────────────────────────────────────────────────────

  async scrapeWithPuppeteer(url) {
    let browser = null;
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
        ],
      });

      const page = await browser.newPage();

      await page.setUserAgent(BROWSER_USER_AGENT);
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'fr-FR,fr;q=0.9',
      });

      // Bloquer les ressources inutiles pour aller plus vite
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        const type = req.resourceType();
        if (['image', 'stylesheet', 'font', 'media', 'websocket'].includes(type)) {
          req.abort();
        } else {
          req.continue();
        }
      });

      await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: PUPPETEER_TIMEOUT,
      });

      // Laisser 2s au JS pour finir son rendu
      await new Promise(resolve => setTimeout(resolve, 2000));

      const text = await page.evaluate(() => {
        const selectors = [
          'script', 'style', 'nav', 'header', 'footer', 'noscript',
          '[class*="cookie"]', '[id*="cookie"]',
          '[class*="gdpr"]', '[class*="consent"]',
          '[class*="modal"]', '[class*="popup"]',
          '[class*="banner"]', '[aria-hidden="true"]',
        ];
        selectors.forEach(sel => {
          document.querySelectorAll(sel).forEach(el => el.remove());
        });

        return document.body.innerText || document.body.textContent || '';
      });

      return text.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();

    } catch (error) {
      console.log(`🔶 [ScraperService] Puppeteer échoué : ${error.message}`);
      return null;
    } finally {
      if (browser) {
        await browser.close().catch(() => {});
      }
    }
  }

  // ─────────────────────────────────────────────────────────
  // PARSING LOCAL BASIQUE (pour pré-remplissage du formulaire)
  // ─────────────────────────────────────────────────────────

  /**
   * Extraction basique des champs d'offre depuis le texte brut
   * Utilisé uniquement pour le pré-remplissage approximatif du formulaire.
   * L'extraction réelle et précise est faite par les workflows n8n.
   */
  basicParse(rawText) {
    const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);

    // Titre : souvent dans les premières lignes, contient des mots-clés métier
    let title = null;
    const titleKeywords = /développeur|developer|ingénieur|chef de projet|manager|consultant|designer|analyste|commercial|technicien|responsable|directeur|data|fullstack|full.?stack|frontend|backend|devops|product|marketing|rh|comptable/i;
    for (const line of lines.slice(0, 20)) {
      if (titleKeywords.test(line) && line.length < 100) {
        title = line;
        break;
      }
    }

    // Type de contrat
    let contract_type = null;
    const contractMatch = rawText.match(/\b(CDI|CDD|Freelance|Stage|Alternance|Intérim)\b/i);
    if (contractMatch) {
      contract_type = contractMatch[1].toUpperCase() === 'FREELANCE' ? 'Freelance' :
                      contractMatch[1].toUpperCase() === 'STAGE' ? 'Stage' :
                      contractMatch[1].toUpperCase() === 'ALTERNANCE' ? 'Alternance' :
                      contractMatch[1].toUpperCase();
    }

    // Salaire
    let salary = null;
    const salaryMatch = rawText.match(/(\d{2,3}\s*[-–à]\s*\d{2,3}\s*[kK]€?|\d{2,3}\s*[kK]€?\s*(brut|net|annuel)?)/);
    if (salaryMatch) {
      salary = salaryMatch[0].trim();
    }

    // Localisation (ville française courante)
    let location = null;
    const locationMatch = rawText.match(/\b(Paris|Lyon|Marseille|Toulouse|Nice|Nantes|Strasbourg|Montpellier|Bordeaux|Lille|Rennes|Reims|Toulon|Grenoble|Dijon|Angers|Le Mans|Aix-en-Provence|Brest|Limoges|Tours|Amiens|Metz|Rouen|Remote|Télétravail|Full remote)\b/i);
    if (locationMatch) {
      location = locationMatch[0];
    }

    // Description : les 500 premiers caractères du texte principal
    const description = rawText.substring(0, 500).trim();

    return {
      title,
      company: null, // Trop difficile à extraire par regex
      location,
      contract_type,
      salary,
      description,
    };
  }

  // ─────────────────────────────────────────────────────────
  // MÉTHODE PRINCIPALE
  // ─────────────────────────────────────────────────────────

  /**
   * Scrape une URL et retourne le texte brut + un parsing basique
   *
   * Stratégie :
   *   1. Valider l'URL + rejeter les sites avec authentification
   *   2. Essayer Axios (rapide, ~1-2s)
   *   3. Si résultat insuffisant → Puppeteer (~5-10s)
   *   4. Parsing basique local (pour pré-remplissage)
   *   5. Retourner rawText (pour les workflows n8n) + basicOffer (pour le formulaire)
   *
   * @param {string} url
   * @returns {{ rawText, url, basicOffer, _meta }}
   */
  async scrapeOffer(url) {
    // 1. Validation
    this.validateUrl(url);

    // 2. Sites avec auth obligatoire
    if (this.isRestrictedSite(url)) {
      const err = new Error('Ce site nécessite une connexion. Copiez-collez le texte de l\'offre manuellement.');
      err.code = 'AUTH_REQUIRED';
      throw err;
    }

    let rawText = null;
    let method = 'axios';

    // 3. Tentative Axios (rapide)
    console.log(`🔍 [ScraperService] Scraping Axios → ${url}`);
    rawText = await this.scrapeWithAxios(url);

    // 4. Fallback Puppeteer si le texte est insuffisant
    if (!rawText || rawText.length < MIN_TEXT_LENGTH) {
      console.log(`🔄 [ScraperService] Texte insuffisant (${rawText?.length ?? 0} chars) → Puppeteer...`);
      rawText = await this.scrapeWithPuppeteer(url);
      method = 'puppeteer';
    }

    // 5. Échec total
    if (!rawText || rawText.length < MIN_TEXT_LENGTH) {
      const err = new Error('Impossible de lire cette page. Utilisez la saisie manuelle.');
      err.code = 'SCRAPING_FAILED';
      throw err;
    }

    console.log(`✅ [ScraperService] ${rawText.length} chars extraits via ${method}`);

    // 6. Parsing basique local (approximatif, pour pré-remplissage)
    const basicOffer = this.basicParse(rawText);

    return {
      rawText,
      url,
      basicOffer,
      _meta: { method, textLength: rawText.length },
    };
  }
}

module.exports = new ScraperService();
