const aiService = require('./aiService');
const scraperService = require('./scraperService');
const { buildPrompt: buildSourcesPrompt } = require('../prompts/veilleSources');
const { buildPrompt: buildSummaryPrompt } = require('../prompts/veilleSummary');

/**
 * Service de Veille Sectorielle
 * Niveau 1 : identification des sources via IA
 * Niveau 2 : scraping des sources + analyse tendances
 */
class VeilleService {

  /**
   * Niveau 1 : identifier les sources media d'un secteur
   */
  async identifySources(sector, country, keywords) {
    console.log(`📡 [VeilleService] Identification sources : ${sector} / ${country}`);

    if (!sector || !country) {
      throw new Error('Le secteur et le pays sont requis');
    }

    const prompt = buildSourcesPrompt(sector, country, keywords);
    const result = await aiService.generateJSON(prompt, { model: 'gpt-4.1-mini' });

    console.log(`✅ [VeilleService] ${result.totalSources || result.sources?.length || 0} sources identifiees`);
    return result;
  }

  /**
   * Niveau 2 : scraper les sources et analyser les tendances
   * Prend les sources du niveau 1, scrape chacune, puis analyse via IA
   */
  async deepAnalyze(sector, sources) {
    console.log(`🔍 [VeilleService] Analyse approfondie de ${sources.length} sources...`);

    if (!sources || sources.length === 0) {
      throw new Error('Aucune source a analyser');
    }

    // Limiter a 8 sources max pour eviter les timeouts et couts
    const sourcesToScrape = sources.slice(0, 8);

    // Scraper en parallele (max 4 concurrentes)
    const scrapedSources = [];
    const batchSize = 4;

    for (let i = 0; i < sourcesToScrape.length; i += batchSize) {
      const batch = sourcesToScrape.slice(i, i + batchSize);
      const batchResults = await Promise.allSettled(
        batch.map(async (source) => {
          if (!source.url) return { ...source, scrapedText: null, error: 'Pas d\'URL' };

          try {
            const text = await this._scrapeSource(source.url);
            return { ...source, scrapedText: text };
          } catch (err) {
            console.log(`⚠️ [VeilleService] Echec scraping ${source.name}: ${err.message}`);
            return { ...source, scrapedText: null, error: err.message };
          }
        })
      );

      for (const r of batchResults) {
        scrapedSources.push(r.status === 'fulfilled' ? r.value : { ...batch[0], scrapedText: null, error: 'Erreur inconnue' });
      }
    }

    const successCount = scrapedSources.filter(s => s.scrapedText).length;
    console.log(`📊 [VeilleService] ${successCount}/${scrapedSources.length} sources scrapees avec succes`);

    if (successCount === 0) {
      throw new Error('Aucune source n\'a pu etre scrapee. Les sites sont peut-etre proteges.');
    }

    // Analyser via IA
    const prompt = buildSummaryPrompt(sector, scrapedSources.filter(s => s.scrapedText));
    const analysis = await aiService.generateJSON(prompt, {
      model: 'gpt-4.1-mini',
      maxTokens: 4000
    });

    // Ajouter les meta-infos de scraping
    analysis.scrapingMeta = {
      totalSources: scrapedSources.length,
      successfulScrapes: successCount,
      failedSources: scrapedSources.filter(s => !s.scrapedText).map(s => ({ name: s.name, error: s.error }))
    };

    console.log(`✅ [VeilleService] Analyse terminee : ${analysis.trends?.length || 0} tendances, ${analysis.contentIdeas?.length || 0} idees`);
    return analysis;
  }

  /**
   * Scrape une source unique via le scraperService
   * Utilise Axios puis Puppeteer en fallback
   */
  async _scrapeSource(url) {
    try {
      scraperService.validateUrl(url);
    } catch {
      return null;
    }

    // Essayer Axios d'abord
    let text = await scraperService.scrapeWithAxios(url);

    // Fallback Puppeteer si texte insuffisant
    if (!text || text.length < 200) {
      text = await scraperService.scrapeWithPuppeteer(url);
    }

    if (!text || text.length < 100) {
      throw new Error('Contenu insuffisant');
    }

    return text;
  }
}

module.exports = new VeilleService();
