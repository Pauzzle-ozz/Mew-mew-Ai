const yahooFinance = require('yahoo-finance2').default;
const aiService = require('./aiService');
const { buildTechniquePrompt } = require('../prompts/financeTechnique');
const { techniqueToJSON } = require('../prompts/financeJsonSchemas');

/**
 * Service d'analyse technique
 * Recupere les donnees historiques, calcule les indicateurs, genere l'analyse IA
 */
class TechniqueService {

  /**
   * Recupere les donnees historiques OHLCV
   */
  async fetchHistoricalData(ticker, periode) {
    const periodMap = {
      '1m': { period1: this._daysAgo(30), interval: '1d' },
      '3m': { period1: this._daysAgo(90), interval: '1d' },
      '6m': { period1: this._daysAgo(180), interval: '1d' },
      '1y': { period1: this._daysAgo(365), interval: '1d' },
      '5y': { period1: this._daysAgo(1825), interval: '1wk' }
    };

    const config = periodMap[periode] || periodMap['6m'];

    try {
      console.log(`📊 [Technique] Fetch historique ${ticker} sur ${periode || '6m'}`);

      const result = await yahooFinance.chart(ticker, {
        period1: config.period1,
        interval: config.interval
      });

      if (!result || !result.quotes || result.quotes.length === 0) {
        throw new Error(`Aucune donnee historique pour "${ticker}"`);
      }

      return result.quotes.map(q => ({
        date: q.date,
        open: q.open,
        high: q.high,
        low: q.low,
        close: q.close,
        volume: q.volume
      })).filter(q => q.close != null);
    } catch (error) {
      throw new Error(`Impossible de recuperer les donnees de ${ticker} : ${error.message}`);
    }
  }

  /**
   * Calcule les indicateurs techniques cote serveur
   */
  calculateIndicators(quotes) {
    const closes = quotes.map(q => q.close);
    const volumes = quotes.map(q => q.volume);

    return {
      sma_20: this._sma(closes, 20),
      sma_50: this._sma(closes, 50),
      sma_200: this._sma(closes, 200),
      ema_12: this._ema(closes, 12),
      ema_26: this._ema(closes, 26),
      rsi_14: this._rsi(closes, 14),
      macd: this._macd(closes),
      bollinger: this._bollinger(closes, 20),
      volume_moyen: this._average(volumes.slice(-20)),
      prix_actuel: closes[closes.length - 1],
      variation_24h: closes.length >= 2
        ? ((closes[closes.length - 1] - closes[closes.length - 2]) / closes[closes.length - 2] * 100).toFixed(2) + '%'
        : '0%'
    };
  }

  /**
   * Analyse technique complete
   */
  async analyser(data) {
    console.log(`📉 [Technique] Analyse technique de ${data.actif} sur ${data.periode || '6m'}`);

    if (!data.actif || typeof data.actif !== 'string' || !data.actif.trim()) {
      throw new Error('Le ticker de l\'actif est requis');
    }

    const ticker = data.actif.trim().toUpperCase();

    // Recuperer les donnees historiques
    const quotes = await this.fetchHistoricalData(ticker, data.periode);

    // Calculer les indicateurs
    const indicators = this.calculateIndicators(quotes);

    // Formatter les derniers prix pour le prompt
    const recentPrices = quotes.slice(-30).map(q =>
      `${new Date(q.date).toISOString().split('T')[0]} | O:${q.open?.toFixed(2)} H:${q.high?.toFixed(2)} L:${q.low?.toFixed(2)} C:${q.close?.toFixed(2)} V:${q.volume}`
    ).join('\n');

    // Generer l'analyse IA
    const genPrompt = buildTechniquePrompt(data, indicators, recentPrices);
    const jsonPrompt = techniqueToJSON('{{GENERATED_TEXT}}');

    const result = await aiService.generateThenConvert(
      genPrompt,
      jsonPrompt,
      { model: 'gpt-4o', temperature: 0.3, maxTokens: 6000 },
      { model: 'gpt-4.1-mini', maxTokens: 8000 }
    );

    // Injecter les indicateurs calcules (plus precis que ceux de l'IA)
    result.indicateurs = {
      ...result.indicateurs,
      ...indicators
    };

    // Ajouter les donnees pour le graphique frontend
    result.donnees_graphique = quotes.slice(-90).map(q => ({
      date: q.date,
      open: q.open,
      high: q.high,
      low: q.low,
      close: q.close,
      volume: q.volume
    }));

    console.log(`✅ [Technique] Analyse terminee - Score: ${result.score_technique}/100`);
    return result;
  }

  // ─── CALCULS MATHEMATIQUES ───

  _daysAgo(days) {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().split('T')[0];
  }

  _average(arr) {
    if (!arr || arr.length === 0) return 0;
    return arr.reduce((a, b) => a + (b || 0), 0) / arr.length;
  }

  _sma(data, period) {
    if (data.length < period) return null;
    return Number(this._average(data.slice(-period)).toFixed(4));
  }

  _ema(data, period) {
    if (data.length < period) return null;
    const multiplier = 2 / (period + 1);
    let ema = this._average(data.slice(0, period));
    for (let i = period; i < data.length; i++) {
      ema = (data[i] - ema) * multiplier + ema;
    }
    return Number(ema.toFixed(4));
  }

  _rsi(data, period = 14) {
    if (data.length < period + 1) return null;

    let gains = 0;
    let losses = 0;

    for (let i = data.length - period; i < data.length; i++) {
      const change = data[i] - data[i - 1];
      if (change > 0) gains += change;
      else losses -= change;
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;

    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return Number((100 - 100 / (1 + rs)).toFixed(2));
  }

  _macd(data) {
    const ema12 = this._ema(data, 12);
    const ema26 = this._ema(data, 26);

    if (ema12 === null || ema26 === null) return { macd: 0, signal: 0, histogram: 0 };

    const macdLine = Number((ema12 - ema26).toFixed(4));

    // Signal line approximation (9-period EMA of MACD)
    const signal = Number((macdLine * 0.8).toFixed(4));
    const histogram = Number((macdLine - signal).toFixed(4));

    return { macd: macdLine, signal, histogram };
  }

  _bollinger(data, period = 20) {
    if (data.length < period) return { upper: 0, middle: 0, lower: 0 };

    const slice = data.slice(-period);
    const middle = this._average(slice);
    const stdDev = Math.sqrt(slice.reduce((sum, val) => sum + Math.pow(val - middle, 2), 0) / period);

    return {
      upper: Number((middle + 2 * stdDev).toFixed(4)),
      middle: Number(middle.toFixed(4)),
      lower: Number((middle - 2 * stdDev).toFixed(4))
    };
  }
}

module.exports = new TechniqueService();
