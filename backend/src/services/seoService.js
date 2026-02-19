const puppeteer = require('puppeteer');
const aiService = require('./aiService');
const { buildPrompt } = require('../prompts/seoAudit');

class SeoService {

  /**
   * Valide une URL
   */
  validateUrl(url) {
    try {
      const parsed = new URL(url);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        throw new Error('URL invalide : protocole HTTP ou HTTPS requis');
      }
      return parsed;
    } catch {
      throw new Error('URL invalide. Verifiez le format (ex: https://example.com)');
    }
  }

  /**
   * Extrait les donnees SEO d'une page Puppeteer ouverte
   */
  async extractPageSeo(page, pageUrl) {
    const seoData = await page.evaluate(() => {
      // Title
      const titleEl = document.querySelector('title');
      const title = titleEl ? titleEl.textContent.trim() : '';

      // Meta description
      const metaDesc = document.querySelector('meta[name="description"]');
      const description = metaDesc ? metaDesc.getAttribute('content') || '' : '';

      // Meta robots
      const metaRobots = document.querySelector('meta[name="robots"]');
      const robots = metaRobots ? metaRobots.getAttribute('content') || '' : '';

      // Canonical
      const canonicalEl = document.querySelector('link[rel="canonical"]');
      const canonical = canonicalEl ? canonicalEl.getAttribute('href') || '' : '';

      // Open Graph
      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogDesc = document.querySelector('meta[property="og:description"]');
      const ogImage = document.querySelector('meta[property="og:image"]');

      // Headings
      const h1s = Array.from(document.querySelectorAll('h1')).map(h => h.textContent.trim()).filter(Boolean);
      const h2s = Array.from(document.querySelectorAll('h2')).map(h => h.textContent.trim()).filter(Boolean);
      const h3s = Array.from(document.querySelectorAll('h3')).map(h => h.textContent.trim()).filter(Boolean);

      // Images
      const images = document.querySelectorAll('img');
      const totalImages = images.length;
      const imagesWithoutAlt = Array.from(images).filter(img => !img.getAttribute('alt') || img.getAttribute('alt').trim() === '').length;

      // Links
      const allLinks = document.querySelectorAll('a[href]');
      let internalLinks = 0;
      let externalLinks = 0;
      const hostname = window.location.hostname;

      allLinks.forEach(link => {
        try {
          const href = link.getAttribute('href');
          if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return;
          const linkUrl = new URL(href, window.location.origin);
          if (linkUrl.hostname === hostname) {
            internalLinks++;
          } else {
            externalLinks++;
          }
        } catch {
          // Ignorer les URLs invalides
        }
      });

      // Content length
      const bodyText = document.body ? document.body.innerText : '';
      const wordCount = bodyText.split(/\s+/).filter(w => w.length > 0).length;

      // Viewport meta
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      const hasViewport = !!viewportMeta;

      // Lang attribute
      const htmlLang = document.documentElement.getAttribute('lang') || '';

      // Structured data (JSON-LD)
      const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
      const hasStructuredData = jsonLdScripts.length > 0;

      return {
        title,
        titleLength: title.length,
        description,
        descriptionLength: description.length,
        robots,
        canonical,
        openGraph: {
          hasTitle: !!ogTitle,
          hasDescription: !!ogDesc,
          hasImage: !!ogImage
        },
        headings: {
          h1: h1s,
          h1Count: h1s.length,
          h2: h2s.slice(0, 10),
          h2Count: h2s.length,
          h3: h3s.slice(0, 10),
          h3Count: h3s.length
        },
        images: {
          total: totalImages,
          withoutAlt: imagesWithoutAlt
        },
        links: {
          internal: internalLinks,
          external: externalLinks
        },
        wordCount,
        hasViewport,
        htmlLang,
        hasStructuredData
      };
    });

    return {
      url: pageUrl,
      isHttps: pageUrl.startsWith('https'),
      hasCleanUrl: !pageUrl.includes('?') || pageUrl.split('?')[1]?.length < 50,
      ...seoData
    };
  }

  /**
   * Decouvre les liens internes d'une page
   */
  async discoverInternalLinks(page, baseUrl) {
    const parsed = new URL(baseUrl);
    const hostname = parsed.hostname;

    const links = await page.evaluate((hostname) => {
      const anchors = document.querySelectorAll('a[href]');
      const urls = new Set();

      anchors.forEach(a => {
        try {
          const href = a.getAttribute('href');
          if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return;
          const linkUrl = new URL(href, window.location.origin);
          if (linkUrl.hostname === hostname && linkUrl.protocol.startsWith('http')) {
            // Normaliser : retirer le hash, garder le pathname
            linkUrl.hash = '';
            urls.add(linkUrl.href);
          }
        } catch {
          // Ignorer
        }
      });

      return Array.from(urls);
    }, hostname);

    return links;
  }

  /**
   * Crawle un site et extrait les donnees SEO de chaque page
   */
  async crawlSite(url, maxPages = 10) {
    this.validateUrl(url);

    console.log(`🔍 [SEO] Demarrage du crawl de ${url} (max ${maxPages} pages)`);

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const pagesData = [];
    const visited = new Set();
    const toVisit = [url];

    try {
      const page = await browser.newPage();

      // Block heavy resources for speed
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        const type = req.resourceType();
        if (['image', 'font', 'media', 'websocket'].includes(type)) {
          req.abort();
        } else {
          req.continue();
        }
      });

      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      page.setDefaultNavigationTimeout(15000);

      while (toVisit.length > 0 && pagesData.length < maxPages) {
        const currentUrl = toVisit.shift();

        // Normaliser l'URL
        let normalizedUrl;
        try {
          const parsed = new URL(currentUrl);
          parsed.hash = '';
          normalizedUrl = parsed.href;
        } catch {
          continue;
        }

        if (visited.has(normalizedUrl)) continue;
        visited.add(normalizedUrl);

        try {
          console.log(`  📄 [SEO] Crawl page ${pagesData.length + 1}/${maxPages}: ${normalizedUrl}`);

          await page.goto(normalizedUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
          // Petit delai pour le JS
          await new Promise(r => setTimeout(r, 1000));

          // Extraire les donnees SEO
          const seoData = await this.extractPageSeo(page, normalizedUrl);
          pagesData.push(seoData);

          // Decouvrir les liens internes (seulement si on n'a pas assez de pages)
          if (pagesData.length < maxPages) {
            const internalLinks = await this.discoverInternalLinks(page, url);
            for (const link of internalLinks) {
              const parsed = new URL(link);
              parsed.hash = '';
              if (!visited.has(parsed.href) && !toVisit.includes(parsed.href)) {
                toVisit.push(parsed.href);
              }
            }
          }
        } catch (err) {
          console.warn(`  ⚠️ [SEO] Erreur sur ${normalizedUrl}: ${err.message}`);
          // Continuer avec les autres pages
        }
      }

      await page.close();
    } finally {
      await browser.close();
    }

    if (pagesData.length === 0) {
      throw new Error('Impossible de crawler le site. Verifiez que l\'URL est accessible.');
    }

    console.log(`✅ [SEO] Crawl termine: ${pagesData.length} pages analysees`);
    return pagesData;
  }

  /**
   * Audit SEO complet : crawl + analyse IA
   */
  async auditSeo(url, maxPages = 10) {
    console.log(`🔍 [SeoService] Audit SEO de ${url}...`);

    // 1. Crawl du site
    const pagesData = await this.crawlSite(url, maxPages);

    // 2. Analyse IA
    const prompt = buildPrompt(pagesData, url);
    const result = await aiService.generateJSON(prompt, {
      model: 'gpt-4.1-mini',
      maxTokens: 8000
    });

    console.log(`✅ [SeoService] Audit termine (score: ${result.globalScore?.value || '?'}/100, ${pagesData.length} pages)`);

    return {
      ...result,
      crawledPages: pagesData.length,
      siteUrl: url
    };
  }
}

module.exports = new SeoService();
