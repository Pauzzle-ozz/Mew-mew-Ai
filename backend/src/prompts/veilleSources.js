/**
 * Prompt pour identifier les sources media d'un secteur
 * Utilise directement avec aiService.generateJSON()
 */
function buildPrompt(sector, country, keywords) {
  const keywordsText = keywords ? `\nMots-cles specifiques : ${keywords}` : '';

  return `Tu es un expert en veille media et intelligence economique. Tu connais parfaitement le paysage mediatique de chaque secteur d'activite.

MISSION : Identifier toutes les sources media pertinentes pour le secteur suivant.

Secteur : ${sector}
Pays : ${country}${keywordsText}

Pour ce secteur et ce pays, identifie :

1. **Magazines specialises** (print et/ou web) — les publications de reference du secteur
2. **Sites web / blogs** — les medias en ligne incontournables
3. **Newsletters** — les newsletters de reference du secteur
4. **Comptes influents** — les personnalites ou comptes media les plus suivis dans ce secteur
5. **Podcasts** — les podcasts populaires du secteur (si applicable)

Pour CHAQUE source, fournis :
- Le nom exact
- L'URL du site web (si disponible)
- Une description courte (1 phrase)
- Le type de contenu (actualites, analyses, tendances, opinions...)
- La frequence de publication estimee
- Le niveau d'autorite (1 a 5, 5 = reference absolue du secteur)

REGLES :
1. Ne liste QUE des sources REELLES qui existent vraiment
2. Priorise les sources en langue du pays demande (francais si France)
3. Inclus aussi 2-3 sources internationales majeures (en anglais)
4. Minimum 10 sources, maximum 25
5. Classe-les par niveau d'autorite decroissant

Reponds en JSON avec cette structure :

{
  "sector": "",
  "country": "",
  "sources": [
    {
      "name": "",
      "url": "",
      "type": "magazine" | "website" | "blog" | "newsletter" | "influencer" | "podcast",
      "description": "",
      "contentType": "",
      "frequency": "",
      "authority": 5,
      "language": "fr" | "en"
    }
  ],
  "totalSources": 0,
  "sectorInsight": ""
}

"sectorInsight" est un paragraphe de 2-3 phrases decrivant l'etat actuel du paysage mediatique de ce secteur.`;
}

module.exports = { buildPrompt };
