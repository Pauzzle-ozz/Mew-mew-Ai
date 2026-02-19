/**
 * Prompt pour generer un benchmark comparatif de plusieurs concurrents
 * Utilise avec aiService.generateJSON()
 */
function buildPrompt(analyses, sector) {
  const analysesText = analyses
    .map((a, i) => `--- CONCURRENT ${i + 1}: ${a.name} ---\n${JSON.stringify(a, null, 2)}`)
    .join('\n\n');

  return `Tu es un strategiste marketing senior. Tu excelles a comparer les acteurs d'un marche et a identifier les opportunites de differentiation.

SECTEUR : ${sector}

Voici les analyses individuelles de ${analyses.length} concurrents :

${analysesText}

---

MISSION : Genere un tableau de benchmark comparatif et une synthese strategique.

Fournis :

1. **Tableau comparatif** : comparaison structuree de tous les concurrents sur les criteres cles
2. **Synthese** : resume des forces/faiblesses du marche
3. **Recommandations** : comment se positionner pour se demarquer

REGLES :
1. Les criteres de comparaison doivent etre pertinents pour le secteur
2. Les recommandations doivent etre specifiques et actionnables
3. Identifie les "trous" dans le marche (ce que personne ne fait)

Reponds en JSON :

{
  "benchmark": {
    "criteria": [
      {
        "name": "",
        "competitors": {
          "NomConcurrent1": { "score": 0, "comment": "" },
          "NomConcurrent2": { "score": 0, "comment": "" }
        }
      }
    ],
    "rankings": [
      { "name": "", "totalScore": 0, "rank": 1 }
    ]
  },
  "marketSynthesis": {
    "summary": "",
    "commonStrengths": [],
    "commonWeaknesses": [],
    "marketGaps": []
  },
  "recommendations": [
    {
      "title": "",
      "description": "",
      "priority": "haute" | "moyenne" | "basse",
      "basedOn": ""
    }
  ],
  "differentiationAxis": []
}

"differentiationAxis" est un tableau de 3-5 axes de differentiation possibles (phrases courtes).`;
}

module.exports = { buildPrompt };
