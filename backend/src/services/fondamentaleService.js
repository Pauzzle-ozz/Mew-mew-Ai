const yahooFinance = require('yahoo-finance2').default;
const aiService = require('./aiService');
const { buildFondamentalePrompt } = require('../prompts/financeFondamentale');
const { fondamentaleToJSON } = require('../prompts/financeJsonSchemas');

/**
 * Service d'analyse fondamentale
 * Recupere les donnees Yahoo Finance et genere l'analyse IA
 */
class FondamentaleService {

  /**
   * Recupere les donnees de marche depuis Yahoo Finance
   */
  async fetchMarketData(ticker) {
    try {
      console.log(`📊 [Fondamentale] Fetch Yahoo Finance : ${ticker}`);

      const [quote, summary] = await Promise.all([
        yahooFinance.quote(ticker).catch(() => null),
        yahooFinance.quoteSummary(ticker, {
          modules: ['summaryProfile', 'financialData', 'defaultKeyStatistics', 'earnings']
        }).catch(() => null)
      ]);

      if (!quote) {
        throw new Error(`Ticker "${ticker}" introuvable sur Yahoo Finance`);
      }

      const profile = summary?.summaryProfile || {};
      const financial = summary?.financialData || {};
      const stats = summary?.defaultKeyStatistics || {};

      return {
        nom: quote.longName || quote.shortName || ticker,
        ticker: quote.symbol,
        prix: quote.regularMarketPrice,
        variation_jour: quote.regularMarketChangePercent?.toFixed(2) + '%',
        capitalisation: quote.marketCap,
        volume: quote.regularMarketVolume,
        high_52: quote.fiftyTwoWeekHigh,
        low_52: quote.fiftyTwoWeekLow,
        secteur: profile.sector || '',
        industrie: profile.industry || '',
        description: profile.longBusinessSummary?.substring(0, 500) || '',
        pe_ratio: stats.forwardPE || quote.forwardPE,
        pb_ratio: stats.priceToBook,
        roe: financial.returnOnEquity,
        marge_nette: financial.profitMargins,
        dette_equity: financial.debtToEquity,
        free_cash_flow: financial.freeCashflow,
        dividende_yield: stats.dividendYield,
        revenue_growth: financial.revenueGrowth,
        target_price: financial.targetMeanPrice,
        recommendation: financial.recommendationKey
      };
    } catch (error) {
      console.warn(`⚠️ [Fondamentale] Yahoo Finance partiel pour ${ticker}: ${error.message}`);
      return { ticker, nom: ticker, erreur: error.message };
    }
  }

  /**
   * Analyse fondamentale complete
   */
  async analyser(data) {
    console.log(`📈 [Fondamentale] Analyse fondamentale de ${data.actif}`);

    if (!data.actif || typeof data.actif !== 'string' || !data.actif.trim()) {
      throw new Error('Le nom ou ticker de l\'actif est requis');
    }

    // Recuperer les donnees Yahoo Finance
    const marketData = await this.fetchMarketData(data.actif.trim().toUpperCase());

    // Construire les prompts
    const genPrompt = buildFondamentalePrompt(data, marketData);
    const jsonPrompt = fondamentaleToJSON('{{GENERATED_TEXT}}');

    const result = await aiService.generateThenConvert(
      genPrompt,
      jsonPrompt,
      { model: 'gpt-4o', temperature: 0.4, maxTokens: 6000 },
      { model: 'gpt-4.1-mini', maxTokens: 8000 }
    );

    // Enrichir avec les donnees temps reel
    if (marketData.prix) {
      result.entreprise = result.entreprise || {};
      result.entreprise.prix_actuel = marketData.prix;
      result.entreprise.capitalisation = marketData.capitalisation;
      if (marketData.high_52 && marketData.low_52) {
        result.entreprise.variation_52sem = {
          min: marketData.low_52,
          max: marketData.high_52
        };
      }
    }

    console.log(`✅ [Fondamentale] Analyse terminee - Score: ${result.score_sante}/100 - Verdict: ${result.verdict?.recommandation}`);
    return result;
  }
}

module.exports = new FondamentaleService();
