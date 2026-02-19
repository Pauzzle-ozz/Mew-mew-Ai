const aiService = require('./aiService');
const scraperService = require('./scraperService');
const { buildPrompt: buildAnalysePrompt } = require('../prompts/concurrenceAnalyse');
const { buildPrompt: buildBenchmarkPrompt } = require('../prompts/concurrenceBenchmark');

/**
 * Service d'Analyse de Concurrence
 * Analyse un ou plusieurs concurrents et genere un benchmark
 */
class ConcurrenceService {

  /**
   * Analyser un seul concurrent
   * Si URL fournie : scrape puis analyse
   * Sinon : analyse basee sur les connaissances IA
   */
  async analyzeCompetitor(competitor, sector) {
    console.log(`🔎 [ConcurrenceService] Analyse de ${competitor.name}...`);

    if (!competitor || !competitor.name) {
      throw new Error('Le nom du concurrent est requis');
    }
    if (!sector) {
      throw new Error('Le secteur est requis');
    }

    let scrapedText = null;

    if (competitor.url) {
      try {
        scraperService.validateUrl(competitor.url);
        console.log(`🔗 [ConcurrenceService] Scraping ${competitor.url}...`);

        // Essayer Axios puis Puppeteer
        scrapedText = await scraperService.scrapeWithAxios(competitor.url);
        if (!scrapedText || scrapedText.length < 200) {
          scrapedText = await scraperService.scrapeWithPuppeteer(competitor.url);
        }

        if (scrapedText) {
          console.log(`✅ [ConcurrenceService] ${scrapedText.length} chars scrapes pour ${competitor.name}`);
        }
      } catch (err) {
        console.log(`⚠️ [ConcurrenceService] Echec scraping ${competitor.name}: ${err.message}`);
        scrapedText = null;
      }
    }

    const prompt = buildAnalysePrompt(competitor, sector, scrapedText);
    const analysis = await aiService.generateJSON(prompt, {
      model: 'gpt-4.1-mini',
      maxTokens: 3000
    });

    console.log(`✅ [ConcurrenceService] Analyse terminee pour ${competitor.name} (score: ${analysis.overallScore}/10)`);
    return analysis;
  }

  /**
   * Analyser plusieurs concurrents en parallele
   */
  async analyzeMultiple(competitors, sector) {
    console.log(`🔎 [ConcurrenceService] Analyse de ${competitors.length} concurrents...`);

    if (!competitors || competitors.length === 0) {
      throw new Error('Au moins un concurrent est requis');
    }
    if (competitors.length > 5) {
      throw new Error('Maximum 5 concurrents a la fois');
    }

    // Analyser en parallele (2 concurrentes max pour eviter rate limit)
    const results = [];
    const batchSize = 2;

    for (let i = 0; i < competitors.length; i += batchSize) {
      const batch = competitors.slice(i, i + batchSize);
      const batchResults = await Promise.allSettled(
        batch.map(c => this.analyzeCompetitor(c, sector))
      );

      for (const r of batchResults) {
        if (r.status === 'fulfilled') {
          results.push(r.value);
        } else {
          console.error(`❌ [ConcurrenceService] Echec analyse:`, r.reason?.message);
        }
      }
    }

    if (results.length === 0) {
      throw new Error('Aucun concurrent n\'a pu etre analyse');
    }

    return results;
  }

  /**
   * Generer un benchmark comparatif a partir d'analyses deja faites
   */
  async generateBenchmark(analyses, sector) {
    console.log(`📊 [ConcurrenceService] Generation benchmark pour ${analyses.length} concurrents...`);

    if (!analyses || analyses.length < 2) {
      throw new Error('Au moins 2 analyses sont requises pour un benchmark');
    }

    const prompt = buildBenchmarkPrompt(analyses, sector);
    const benchmark = await aiService.generateJSON(prompt, {
      model: 'gpt-4.1-mini',
      maxTokens: 4000
    });

    console.log(`✅ [ConcurrenceService] Benchmark genere`);
    return benchmark;
  }
}

module.exports = new ConcurrenceService();
