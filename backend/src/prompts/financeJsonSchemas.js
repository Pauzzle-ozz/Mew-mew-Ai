/**
 * Prompts de conversion JSON pour les outils Finance
 */

function fondamentaleToJSON(generatedText) {
  return `Tu vas recevoir une analyse fondamentale d'un actif financier.

Ta mission est de transformer cette analyse en JSON STRICT.

Regles obligatoires :
- Reponds UNIQUEMENT avec du JSON valide
- Aucun texte explicatif, aucun Markdown

Structure JSON attendue :

{
  "entreprise": {
    "nom": "",
    "ticker": "",
    "secteur": "",
    "description": "",
    "capitalisation": "",
    "prix_actuel": 0,
    "variation_52sem": { "min": 0, "max": 0 }
  },
  "ratios_financiers": {
    "pe_ratio": 0,
    "pb_ratio": 0,
    "roe": "",
    "marge_nette": "",
    "marge_operationnelle": "",
    "dette_equity": 0,
    "free_cash_flow": "",
    "dividende_yield": "",
    "croissance_ca": ""
  },
  "analyse_swot": {
    "forces": [],
    "faiblesses": [],
    "opportunites": [],
    "menaces": []
  },
  "projet_long_terme": "",
  "actualites_impact": [],
  "sentiment_marche": "positif",
  "score_sante": 0,
  "verdict": {
    "recommandation": "Conserver",
    "conviction": "moyenne",
    "arguments": [],
    "prix_cible": ""
  },
  "disclaimer": "Ceci n'est pas un conseil en investissement. Cette analyse est fournie a titre informatif uniquement. Consultez un conseiller financier agree avant toute decision d'investissement."
}

Consignes :
- score_sante : entier entre 0 et 100
- recommandation : "Acheter", "Conserver" ou "Eviter"
- conviction : "haute", "moyenne" ou "faible"
- sentiment_marche : "positif", "neutre" ou "negatif"
- Les ratios numeriques doivent etre des nombres (pas de strings)
- Les pourcentages au format "X%" (strings)
- Les montants au format "X EUR" ou "X USD" ou "X B" pour milliards

Voici l'analyse a transformer :

${generatedText}`;
}

function techniqueToJSON(generatedText) {
  return `Tu vas recevoir une analyse technique d'un actif financier.

Ta mission est de transformer cette analyse en JSON STRICT.

Regles obligatoires :
- Reponds UNIQUEMENT avec du JSON valide
- Aucun texte explicatif, aucun Markdown

Structure JSON attendue :

{
  "actif": {
    "ticker": "",
    "prix_actuel": 0,
    "variation_24h": ""
  },
  "indicateurs": {
    "sma_20": 0,
    "sma_50": 0,
    "sma_200": 0,
    "ema_12": 0,
    "ema_26": 0,
    "rsi_14": 0,
    "macd": { "macd": 0, "signal": 0, "histogram": 0 },
    "bollinger": { "upper": 0, "middle": 0, "lower": 0 },
    "volume_moyen": 0
  },
  "niveaux_cles": {
    "supports": [],
    "resistances": [],
    "fibonacci": { "0.236": 0, "0.382": 0, "0.5": 0, "0.618": 0 }
  },
  "patterns_detectes": [],
  "analyse": {
    "court_terme": {
      "horizon": "1-2 semaines",
      "tendance": "neutre",
      "signal": "attente",
      "arguments": [],
      "objectif_prix": 0
    },
    "moyen_terme": {
      "horizon": "1-3 mois",
      "tendance": "neutre",
      "signal": "attente",
      "arguments": [],
      "objectif_prix": 0
    },
    "long_terme": {
      "horizon": "6-12 mois",
      "tendance": "neutre",
      "signal": "attente",
      "arguments": [],
      "objectif_prix": 0
    }
  },
  "score_technique": 0,
  "resume": "",
  "disclaimer": "L'analyse technique ne constitue pas un conseil en investissement. Les performances passees ne prejugent pas des performances futures."
}

Consignes :
- Tous les prix et indicateurs sont des nombres (pas de strings)
- tendance : "haussier", "baissier" ou "neutre"
- signal : "achat", "vente" ou "attente"
- score_technique : entier entre 0 et 100
- supports et resistances : tableaux de nombres tries
- patterns_detectes : noms des patterns en francais

Voici l'analyse a transformer :

${generatedText}`;
}

function tradingToJSON(generatedText) {
  return `Tu vas recevoir une analyse de trading combinant fondamentale et technique.

Ta mission est de transformer cette analyse en JSON STRICT.

Regles obligatoires :
- Reponds UNIQUEMENT avec du JSON valide
- Aucun texte explicatif, aucun Markdown

Structure JSON attendue :

{
  "actif": {
    "ticker": "",
    "nom": "",
    "prix_actuel": 0,
    "type": ""
  },
  "analyse_fondamentale_resume": {
    "score": 0,
    "points_cles": [],
    "sentiment": ""
  },
  "analyse_technique_resume": {
    "score": 0,
    "tendance": "",
    "signal": "",
    "indicateurs_cles": []
  },
  "recommandation": {
    "action": "ATTENDRE",
    "conviction": "moyenne",
    "prix_entree_suggere": 0,
    "stop_loss": 0,
    "take_profit": [],
    "taille_position": "",
    "ratio_risque_reward": ""
  },
  "gestion_risque": {
    "perte_max": "",
    "gain_potentiel": "",
    "risque_pourcentage": "",
    "probabilite_succes": ""
  },
  "plan_trading": {
    "scenario_haussier": "",
    "scenario_baissier": "",
    "catalyseurs": [],
    "niveaux_invalidation": []
  },
  "disclaimer": "Ceci n'est pas un conseil en investissement. Ne tradez jamais avec de l'argent que vous ne pouvez pas vous permettre de perdre."
}

Consignes :
- action : "ACHETER", "VENDRE", "CONSERVER" ou "ATTENDRE"
- conviction : "haute", "moyenne" ou "faible"
- Tous les prix sont des nombres
- take_profit : tableau de 1-3 niveaux de prix
- taille_position au format "X% du capital"
- ratio_risque_reward au format "1:X"

Voici l'analyse a transformer :

${generatedText}`;
}

function portefeuilleToJSON(generatedText) {
  return `Tu vas recevoir une analyse de portefeuille d'investissement.

Ta mission est de transformer cette analyse en JSON STRICT.

Regles obligatoires :
- Reponds UNIQUEMENT avec du JSON valide
- Aucun texte explicatif, aucun Markdown

Structure JSON attendue :

{
  "resume_portefeuille": {
    "valeur_totale": "",
    "performance_globale": "",
    "score_diversification": 0,
    "niveau_risque": ""
  },
  "positions_analysees": [
    {
      "actif": "",
      "poids": "",
      "performance": "",
      "recommandation": "",
      "commentaire": ""
    }
  ],
  "allocation_recommandee": {
    "actions": "",
    "obligations": "",
    "crypto": "",
    "liquidites": ""
  },
  "risques_identifies": [],
  "opportunites": [],
  "actions_recommandees": [
    {
      "priorite": "haute",
      "action": "",
      "raison": ""
    }
  ],
  "disclaimer": "Ceci n'est pas un conseil en investissement."
}

Consignes :
- score_diversification : entier 0-100
- niveau_risque : "faible", "modere", "eleve"
- priorite : "haute", "moyenne", "basse"
- recommandation par position : "renforcer", "conserver", "reduire", "vendre"

Voici l'analyse a transformer :

${generatedText}`;
}

module.exports = { fondamentaleToJSON, techniqueToJSON, tradingToJSON, portefeuilleToJSON };
