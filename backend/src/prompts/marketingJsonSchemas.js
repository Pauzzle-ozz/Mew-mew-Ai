/**
 * Prompts de conversion JSON pour les outils Marketing
 * Chaque fonction prend le texte genere et retourne un prompt pour la conversion JSON
 */

/**
 * Conversion strategie de contenu → JSON structure
 * Utilise par strategieContenu
 */
function contentStrategyToJSON(generatedText) {
  return `Tu vas recevoir un calendrier editorial sur 30 jours avec des publications planifiees par canal, PLUS un planning de production avec des sessions groupees.

Ta mission est de transformer ce contenu en JSON STRICT.

Regles obligatoires :
- Reponds UNIQUEMENT avec du JSON valide
- Aucun texte explicatif, aucun Markdown
- Toutes les cles doivent etre presentes

Structure JSON attendue :

{
  "strategy": {
    "summary": "",
    "totalPosts": 0,
    "channelsUsed": [],
    "totalEstimatedCost": ""
  },
  "calendar": [
    {
      "day": 1,
      "date": "2026-02-23",
      "theme": "",
      "posts": [
        {
          "channel": "",
          "type": "",
          "description": "",
          "hashtags": [],
          "bestTime": "",
          "estimatedCost": "",
          "productionSessionId": null
        }
      ]
    }
  ],
  "productionSessions": [
    {
      "id": 1,
      "date": "2026-02-22",
      "day": 1,
      "type": "tournage_video",
      "title": "",
      "items": [
        {
          "title": "",
          "channel": "",
          "forDay": "Lun 24 Fev"
        }
      ],
      "resources": [],
      "duration": "",
      "estimatedCost": "",
      "notes": ""
    }
  ],
  "tips": []
}

Consignes specifiques :
- Le tableau "calendar" doit contenir exactement 30 entrees
- Chaque jour DOIT avoir sa "date" au format YYYY-MM-DD (vraie date, pas "Jour 1")
- Chaque jour peut avoir 0 ou plusieurs posts (certains jours n'ont pas de publication)
- "channel" doit etre l'un de : "linkedin", "instagram", "tiktok", "youtube", "facebook", "twitter", "pinterest", "threads", "snapchat", "blog", "newsletter", "podcast", "whatsapp", "video"
- "type" doit etre l'un de : "educatif", "inspirant", "promotionnel", "behind-the-scenes", "engagement", "storytelling", "actualite", "divertissement", "teaser", "tutoriel"
- "bestTime" au format "HH:MM"
- "estimatedCost" est le cout estime pour produire ce contenu (ex: "Gratuit", "~50 euros", "~200 euros")
- "productionSessionId" est l'id de la session de production associee (null si pas de session dediee)
- "productionSessions" est le tableau des sessions de production groupees en amont
- "type" de session doit etre l'un de : "tournage_video", "shoot_photo", "redaction", "enregistrement_audio", "design", "montage"
- "items" de chaque session : liste des contenus a produire avec titre, canal et date de publication prevue
- "resources" : liste des ressources humaines et materielles (ex: "Cadreur", "Micro-cravate", "Eclairage", "Photographe", "Monteur video", "Graphiste")
- "duration" : duree estimee (ex: "2h", "Demi-journee", "1 journee")
- "estimatedCost" de session : cout total de la session
- "summary" est un resume de la strategie en 2-3 phrases
- "totalEstimatedCost" est le cout total estime sur les 30 jours
- "tips" est un tableau de 3-5 conseils generaux pour reussir la strategie
- "totalPosts" est le nombre total de publications sur les 30 jours
- Les sessions de production doivent etre planifiees AVANT les dates de publication correspondantes

Voici le contenu a transformer :

${generatedText}`;
}

module.exports = { contentStrategyToJSON };
