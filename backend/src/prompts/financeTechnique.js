/**
 * Prompt pour l'analyse technique d'un actif financier
 */

function buildTechniquePrompt(data, indicators, priceData) {
  const { actif, type_actif, periode } = data;

  return `Tu es un analyste technique professionnel avec 15 ans d'experience sur les marches financiers. Tu maitrises tous les indicateurs techniques et patterns chartistes.

ACTIF ANALYSE :
- Ticker : ${actif}
- Type : ${type_actif}
- Periode d'analyse : ${periode || '6m'}

DONNEES DE PRIX (OHLCV) :
${priceData ? `Dernieres cotations :\n${priceData}` : 'Non disponibles'}

INDICATEURS CALCULES :
${indicators ? JSON.stringify(indicators, null, 2) : 'Non disponibles'}

MISSION : Realise une analyse technique COMPLETE.

1. INDICATEURS TECHNIQUES :
   - Moyennes mobiles : SMA 20, 50, 200 + EMA 12, 26
     * Croisements (golden cross, death cross)
     * Position du prix vs les moyennes
   - RSI (14 periodes) :
     * Zone de surachat (>70) ou survente (<30)
     * Divergences avec le prix
   - MACD :
     * Signal (croisement MACD/Signal)
     * Histogramme (momentum)
   - Bandes de Bollinger :
     * Position du prix dans les bandes
     * Squeeze (contraction = volatilite a venir)
   - Volumes :
     * Tendance des volumes
     * Confirmation ou divergence avec le prix

2. NIVEAUX CLES :
   - Supports majeurs (2-3 niveaux)
   - Resistances majeures (2-3 niveaux)
   - Retracements de Fibonacci (0.236, 0.382, 0.5, 0.618)
   - Pivot points

3. PATTERNS DETECTES :
   - Patterns de continuation (drapeaux, triangles, canaux)
   - Patterns de retournement (tete-epaules, double top/bottom, W/M)
   - Patterns de chandeliers (doji, hammer, engulfing, etc.)

4. ANALYSE EN 3 HORIZONS :

   A) COURT TERME (1-2 semaines) :
   - Tendance immediate
   - Signal : achat / vente / attente
   - Objectif de prix
   - Arguments techniques

   B) MOYEN TERME (1-3 mois) :
   - Tendance de fond
   - Signal
   - Objectif de prix
   - Arguments techniques

   C) LONG TERME (6-12 mois) :
   - Tendance majeure
   - Signal
   - Objectif de prix
   - Arguments techniques

5. SCORE TECHNIQUE GLOBAL (/100) :
   - Ponderation des signaux
   - Fiabilite des patterns

IMPORTANT : Ajoute un disclaimer que l'analyse technique n'est pas une science exacte et ne constitue pas un conseil en investissement au sens AMF.`;
}

module.exports = { buildTechniquePrompt };
