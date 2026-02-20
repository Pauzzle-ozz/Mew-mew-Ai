const aiService = require('./aiService');
const fondamentaleService = require('./fondamentaleService');
const techniqueService = require('./techniqueService');
const { tradingToJSON, portefeuilleToJSON } = require('../prompts/financeJsonSchemas');

/**
 * Service Bot Trading
 * Combine analyse fondamentale + technique pour des recommandations de trading
 */
class TradingService {

  /**
   * Analyse complete d'un actif (fondamentale + technique + recommandation trading)
   */
  async analyserActif(data) {
    console.log(`🤖 [Trading] Analyse complete de ${data.actif}`);

    if (!data.actif || typeof data.actif !== 'string' || !data.actif.trim()) {
      throw new Error('Le ticker de l\'actif est requis');
    }

    const ticker = data.actif.trim().toUpperCase();

    // Lancer fondamentale + technique en parallele
    const [fondamentale, technique] = await Promise.all([
      fondamentaleService.analyser({ ...data, actif: ticker }).catch(err => ({ erreur: err.message })),
      techniqueService.analyser({ ...data, actif: ticker, periode: '6m' }).catch(err => ({ erreur: err.message }))
    ]);

    // Construire le prompt de trading combine
    const tradingPrompt = this._buildTradingPrompt(data, fondamentale, technique);
    const jsonPrompt = tradingToJSON('{{GENERATED_TEXT}}');

    const result = await aiService.generateThenConvert(
      tradingPrompt,
      jsonPrompt,
      { model: 'gpt-4o', temperature: 0.3, maxTokens: 6000 },
      { model: 'gpt-4.1-mini', maxTokens: 8000 }
    );

    // Enrichir avec les donnees brutes
    result.donnees_graphique = technique.donnees_graphique || [];
    result.indicateurs_bruts = technique.indicateurs || {};

    console.log(`✅ [Trading] Analyse terminee - Recommandation: ${result.recommandation?.action}`);
    return result;
  }

  /**
   * Analyse d'un portefeuille complet
   */
  async analyserPortefeuille(data) {
    console.log(`📊 [Trading] Analyse portefeuille : ${data.positions?.length || 0} positions`);

    if (!data.positions || !Array.isArray(data.positions) || data.positions.length === 0) {
      throw new Error('Au moins une position est requise');
    }

    // Recuperer les prix actuels de toutes les positions
    const positionsWithData = await Promise.all(
      data.positions.map(async (pos) => {
        try {
          const marketData = await fondamentaleService.fetchMarketData(pos.actif.toUpperCase());
          return {
            ...pos,
            prix_actuel: marketData.prix,
            nom: marketData.nom,
            performance: marketData.prix && pos.prix_achat
              ? ((marketData.prix - pos.prix_achat) / pos.prix_achat * 100).toFixed(2) + '%'
              : 'N/A',
            valeur_actuelle: marketData.prix ? (marketData.prix * pos.quantite).toFixed(2) : null
          };
        } catch {
          return { ...pos, erreur: 'Donnees indisponibles' };
        }
      })
    );

    const portefeuillePrompt = this._buildPortefeuillePrompt(data, positionsWithData);
    const jsonPrompt = portefeuilleToJSON('{{GENERATED_TEXT}}');

    const result = await aiService.generateThenConvert(
      portefeuillePrompt,
      jsonPrompt,
      { model: 'gpt-4o', temperature: 0.3, maxTokens: 6000 },
      { model: 'gpt-4.1-mini', maxTokens: 8000 }
    );

    console.log(`✅ [Trading] Analyse portefeuille terminee`);
    return result;
  }

  // ─── PROMPTS INTERNES ───

  _buildTradingPrompt(data, fondamentale, technique) {
    return `Tu es un trader professionnel et gestionnaire de portefeuille avec 15 ans d'experience. Tu combines analyse fondamentale et technique pour prendre des decisions d'investissement.

ACTIF : ${data.actif}
TYPE : ${data.type_actif || 'action'}
CAPITAL DISPONIBLE : ${data.capital_disponible ? data.capital_disponible + ' EUR' : 'Non precise'}
TOLERANCE AU RISQUE : ${data.tolerance_risque || 'modere'}
HORIZON : ${data.horizon || 'moyen terme'}

ANALYSE FONDAMENTALE :
${JSON.stringify(fondamentale, null, 2).substring(0, 4000)}

ANALYSE TECHNIQUE :
${JSON.stringify({
  indicateurs: technique.indicateurs,
  niveaux_cles: technique.niveaux_cles,
  patterns_detectes: technique.patterns_detectes,
  analyse: technique.analyse,
  score_technique: technique.score_technique
}, null, 2).substring(0, 4000)}

MISSION : En combinant les deux analyses, donne une RECOMMANDATION DE TRADING precise.

1. SYNTHESE : Resume les points cles fondamentaux et techniques
2. RECOMMANDATION : ACHETER / VENDRE / CONSERVER / ATTENDRE avec conviction
3. PARAMETRES D'ENTREE :
   - Prix d'entree suggere
   - Stop-loss (niveau de protection)
   - Take-profit (1 a 3 niveaux)
   - Taille de position recommandee (% du capital, regle des 1-2% de risque)
   - Ratio risque/reward

4. GESTION DU RISQUE :
   - Perte maximale en EUR et %
   - Gain potentiel
   - Probabilite estimee de succes

5. PLAN DE TRADING :
   - Scenario haussier
   - Scenario baissier
   - Catalyseurs a surveiller
   - Niveaux d'invalidation

REGLE DE RISK MANAGEMENT :
- Tolerance ${data.tolerance_risque || 'modere'} : max ${data.tolerance_risque === 'conservateur' ? '1%' : data.tolerance_risque === 'agressif' ? '3%' : '2%'} du capital par trade
- Stop-loss OBLIGATOIRE sur chaque recommandation

DISCLAIMER OBLIGATOIRE : Rappelle que ce n'est pas un conseil en investissement au sens AMF.`;
  }

  _buildPortefeuillePrompt(data, positionsWithData) {
    const positionsStr = positionsWithData.map((p, i) =>
      `${i + 1}. ${p.nom || p.actif} (${p.actif}) - ${p.quantite} unites @ ${p.prix_achat} EUR → Actuel: ${p.prix_actuel || 'N/A'} EUR | Perf: ${p.performance}`
    ).join('\n');

    return `Tu es un gestionnaire de portefeuille professionnel.

PORTEFEUILLE DU CLIENT :
Capital total : ${data.capital_total ? data.capital_total + ' EUR' : 'Non precise'}
Objectif : ${data.objectif || 'Non precise'}

POSITIONS :
${positionsStr}

MISSION : Analyse ce portefeuille et recommande des ajustements.

1. PERFORMANCE GLOBALE : rendement, volatilite
2. DIVERSIFICATION : score /100, concentration par secteur/type
3. RISQUES : expositions dangereuses, correlations
4. RECOMMANDATIONS PAR POSITION : renforcer, conserver, reduire, vendre
5. ALLOCATION RECOMMANDEE : repartition optimale
6. ACTIONS PRIORITAIRES : les 3-5 actions les plus importantes

DISCLAIMER : Rappelle que ce n'est pas un conseil en investissement.`;
  }
}

module.exports = new TradingService();
