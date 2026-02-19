/**
 * Prompt pour analyser le contenu scrape des sources et en extraire tendances + idees
 * Utilise avec aiService.generateJSON()
 */
function buildPrompt(sector, scrapedSources) {
  const sourcesText = scrapedSources
    .map((s, i) => {
      return `--- SOURCE ${i + 1}: ${s.name} (${s.url}) ---
${s.scrapedText ? s.scrapedText.substring(0, 3000) : '[Contenu non disponible]'}`;
    })
    .join('\n\n');

  return `Tu es un analyste de veille sectorielle expert. Tu sais extraire les signaux faibles, identifier les tendances emergentes et proposer des idees de contenu basees sur l'actualite.

SECTEUR : ${sector}

Voici le contenu scrape de ${scrapedSources.length} sources media de ce secteur :

${sourcesText}

---

MISSION : Analyse ces contenus et fournis :

1. **Resume de chaque source** : un resume de 3-5 phrases des sujets principaux couverts
2. **Tendances detectees** : les themes recurrents et tendances emergentes du secteur
3. **Signaux faibles** : les sujets qui commencent a emerger mais ne sont pas encore mainstream
4. **Idees de contenu** : des suggestions concretes d'articles/posts bases sur les tendances detectees

REGLES :
1. Base-toi UNIQUEMENT sur le contenu fourni, pas sur tes connaissances generales
2. Si une source n'a pas de contenu disponible, ignore-la
3. Les idees de contenu doivent etre specifiques et actionnables
4. Identifie les angles originaux qui ne sont pas encore couverts
5. Classe les tendances par niveau d'importance

Reponds en JSON avec cette structure :

{
  "sourceSummaries": [
    {
      "name": "",
      "url": "",
      "summary": "",
      "keyTopics": [],
      "sentiment": "positif" | "neutre" | "negatif" | "mixte"
    }
  ],
  "trends": [
    {
      "title": "",
      "description": "",
      "importance": "haute" | "moyenne" | "emergente",
      "mentionedIn": [],
      "keywords": []
    }
  ],
  "weakSignals": [
    {
      "title": "",
      "description": "",
      "potentialImpact": ""
    }
  ],
  "contentIdeas": [
    {
      "title": "",
      "angle": "",
      "format": "article" | "post_social" | "infographie" | "video" | "newsletter",
      "targetAudience": "",
      "basedOnTrend": ""
    }
  ],
  "globalSummary": ""
}

"globalSummary" est une synthese de 3-4 phrases de l'etat actuel du secteur base sur les sources analysees.`;
}

module.exports = { buildPrompt };
