/**
 * Prompt pour analyser un concurrent a partir de contenu scrape ou du nom de marque
 * Utilise avec aiService.generateJSON()
 */
function buildPrompt(competitor, sector, scrapedText) {
  const dataSource = scrapedText
    ? `Voici le contenu scrape du site web du concurrent :\n\n${scrapedText.substring(0, 5000)}`
    : `Aucun site web scrape. Base-toi sur tes connaissances de la marque "${competitor.name}" dans le secteur "${sector}".`;

  return `Tu es un analyste en strategie de communication et marketing. Tu excelles a decrypter le positionnement, le ton et la strategie de communication des marques.

CONCURRENT A ANALYSER :
Nom : ${competitor.name}
${competitor.url ? `URL : ${competitor.url}` : ''}
Secteur : ${sector}

${dataSource}

---

MISSION : Analyse en profondeur la strategie de communication de ce concurrent.

Fournis :

1. **Positionnement** : comment la marque se positionne (cible, valeurs, proposition de valeur)
2. **Ton et style** : le ton de communication (formel, decontracte, expert, etc.)
3. **Forces** : ce qu'ils font bien en communication
4. **Faiblesses** : les lacunes ou opportunites qu'ils manquent
5. **Canaux** : quels canaux de communication ils utilisent
6. **Type de contenu** : quels formats de contenu ils privilegient
7. **Opportunites** : ce que TOI tu pourrais faire differemment pour te demarquer

REGLES :
1. Sois objectif et factuel dans ton analyse
2. Les opportunites doivent etre concretes et actionnables
3. Si le contenu scrape est disponible, base-toi principalement dessus
4. Si pas de contenu scrape, indique que l'analyse est basee sur les connaissances generales

Reponds en JSON :

{
  "name": "",
  "url": "",
  "positioning": {
    "target": "",
    "values": [],
    "valueProposition": "",
    "marketSegment": ""
  },
  "communication": {
    "tone": "",
    "style": "",
    "language": "",
    "visualIdentity": ""
  },
  "strengths": [],
  "weaknesses": [],
  "channels": [
    {
      "name": "",
      "estimatedActivity": "tres actif" | "actif" | "peu actif" | "inactif",
      "contentType": ""
    }
  ],
  "contentStrategy": {
    "mainFormats": [],
    "frequency": "",
    "themes": []
  },
  "opportunities": [],
  "overallScore": 0,
  "dataSource": "scraped" | "knowledge"
}

"overallScore" est une note de 1 a 10 de la qualite de leur communication.`;
}

module.exports = { buildPrompt };
