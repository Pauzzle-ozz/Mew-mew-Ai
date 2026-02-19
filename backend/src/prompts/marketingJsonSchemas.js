/**
 * Prompts de conversion JSON pour les outils Marketing
 * Chaque fonction prend le texte genere et retourne un prompt pour la conversion JSON
 */

/**
 * Conversion contenu multi-format → JSON structure
 * Utilise par redacteurMultiFormat
 */
function multiFormatContentToJSON(generatedText) {
  return `Tu vas recevoir du contenu marketing genere pour plusieurs plateformes.

Ta mission est de transformer ce contenu en JSON STRICT.

Regles obligatoires :
- Reponds UNIQUEMENT avec du JSON valide
- Aucun texte explicatif, aucun Markdown
- Toutes les cles doivent etre presentes meme si certaines valeurs sont vides

Structure JSON attendue :

{
  "platforms": {
    "linkedin": {
      "content": "",
      "hashtags": [],
      "characterCount": 0
    },
    "instagram": {
      "content": "",
      "hashtags": [],
      "characterCount": 0
    },
    "twitter": {
      "tweets": [],
      "hashtags": [],
      "totalTweets": 0
    },
    "blog": {
      "title": "",
      "metaDescription": "",
      "content": "",
      "headings": [],
      "wordCount": 0
    },
    "video_script": {
      "hook": "",
      "script": "",
      "duration": "",
      "visualNotes": []
    },
    "newsletter": {
      "subject": "",
      "preheader": "",
      "content": "",
      "cta": ""
    }
  }
}

Consignes specifiques :
- N'inclus QUE les plateformes presentes dans le texte genere (ignore les autres)
- Pour Twitter, separe chaque tweet du thread dans le tableau "tweets"
- Pour le blog, extrait les sous-titres dans "headings"
- Pour le script video, extrait les indications visuelles dans "visualNotes"
- characterCount et wordCount doivent etre des nombres entiers
- Le contenu doit etre conserve tel quel, sans modification ni troncature

Voici le contenu a transformer :

${generatedText}`;
}

/**
 * Conversion strategie de contenu → JSON structure
 * Utilise par strategieContenu
 */
function contentStrategyToJSON(generatedText) {
  return `Tu vas recevoir un calendrier editorial sur 30 jours avec des publications planifiees par canal.

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
    "channelsUsed": []
  },
  "calendar": [
    {
      "day": 1,
      "theme": "",
      "posts": [
        {
          "channel": "",
          "type": "",
          "description": "",
          "hashtags": [],
          "bestTime": ""
        }
      ]
    }
  ],
  "tips": []
}

Consignes specifiques :
- Le tableau "calendar" doit contenir exactement 30 entrees (jour 1 a 30)
- Chaque jour peut avoir 0 ou plusieurs posts (certains jours n'ont pas de publication)
- "channel" doit etre l'un de : "linkedin", "instagram", "twitter", "blog", "newsletter", "video"
- "type" doit etre l'un de : "educatif", "inspirant", "promotionnel", "behind-the-scenes", "engagement", "storytelling", "actualite"
- "bestTime" au format "HH:MM"
- "summary" est un resume de la strategie en 2-3 phrases
- "tips" est un tableau de 3-5 conseils generaux pour reussir la strategie
- "totalPosts" est le nombre total de publications sur les 30 jours

Voici le contenu a transformer :

${generatedText}`;
}

module.exports = { multiFormatContentToJSON, contentStrategyToJSON };
