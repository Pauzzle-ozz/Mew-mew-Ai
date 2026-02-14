/**
 * Prompts de conversion JSON
 * Extraits des etapes "reponse JSON" / "Convertir en JSON" des workflows n8n
 * Chaque fonction prend le texte genere et retourne un prompt pour la conversion
 */

/**
 * Conversion analyse CV → JSON structure
 * Utilise par analyseCvForm et analyseCvPdf
 */
function analysisToJSON(generatedText) {
  return `Tu vas recevoir une analyse détaillée de profil professionnel incluant :
- des métiers proposés classés en 2 catégories
- un scoring multi-critères (3 notes par métier)
- des compétences et mots-clés
- des conseils par métier

Ta mission est de transformer ce contenu en **JSON STRICT**, exploitable par un workflow automatisé.

Règles obligatoires (à respecter strictement) :
- Réponds UNIQUEMENT avec du JSON valide
- Aucun texte explicatif
- Aucun Markdown
- Aucun commentaire
- Toutes les clés doivent être présentes même si certaines valeurs sont vides
- Les notes doivent être des nombres entiers entre 0 et 100

Structure JSON attendue :

{
  "metiers": [
    {
      "intitule": "",
      "categorie": "Correspond a mes competences",
      "priorite": 1,
      "scores": {
        "adequation_profil": 0,
        "marche_emploi": 0,
        "potentiel_evolution": 0,
        "global": 0
      },
      "justifications": {
        "adequation_profil": "",
        "marche_emploi": "",
        "potentiel_evolution": ""
      },
      "conseils": {
        "points_forts": [],
        "lacunes": [],
        "conseil_actionnable": ""
      },
      "mots_cles": []
    }
  ],
  "competences_cles": [],
  "mots_cles_recherche": []
}

Consignes spécifiques :
- Chaque métier identifié dans l'analyse doit apparaître dans le tableau "metiers"
- "categorie" doit être EXACTEMENT "Correspond a mes competences" ou "Je pourrais tenter" (sans accents, tel quel)
- "priorite" doit être un entier (1 = priorité la plus élevée)
- "scores.adequation_profil" : correspondance compétences/expérience du candidat avec le métier (0-100)
- "scores.marche_emploi" : conditions du marché de l'emploi pour ce métier (0-100)
- "scores.potentiel_evolution" : perspectives d'évolution carrière/salaire (0-100)
- "scores.global" : moyenne pondérée des 3 scores (adequation_profil x 0.4 + marche_emploi x 0.35 + potentiel_evolution x 0.25), arrondie à l'entier
- Chaque justification doit être une phrase courte expliquant la note
- "conseils.points_forts" : tableau de 2-3 compétences que le candidat possède déjà pour ce métier
- "conseils.lacunes" : tableau de 1-3 compétences/certifications/formations manquantes
- "conseils.conseil_actionnable" : une phrase de conseil concret pour le candidat
- Les mots-clés doivent être normalisés (minuscules, sans phrases)
- Ne jamais inventer de catégories hors de celles définies

Voici le contenu à transformer :

${generatedText}`;
}

/**
 * Conversion CV optimise → JSON structure
 * Utilise par optimiseCvForm et optimiseCvPdf
 */
function cvToJSON(generatedText) {
  return `Tu vas recevoir un texte contenant un score ATS, des points forts, des améliorations, et un CV optimisé. Transforme tout cela en JSON STRICT.

RÈGLES :
- JSON valide uniquement
- Aucun texte avant/après
- Pas de \`\`\`json
- Extrais le score ATS (nombre), les points forts (tableau), les améliorations (tableau) en PLUS du CV
- Structure EXACTE :

{
  "score_ats": 85,
  "points_forts": ["point 1", "point 2", "point 3"],
  "ameliorations": ["amélioration 1", "amélioration 2", "amélioration 3"],
  "prenom": "",
  "nom": "",
  "titre_poste": "",
  "email": "",
  "telephone": "",
  "adresse": "",
  "linkedin": "",
  "resume": "",
  "experiences": [
    {
      "poste": "",
      "entreprise": "",
      "localisation": "",
      "date_debut": "",
      "date_fin": "",
      "description": ""
    }
  ],
  "formations": [
    {
      "diplome": "",
      "etablissement": "",
      "localisation": "",
      "date_fin": ""
    }
  ],
  "competences_techniques": "",
  "competences_soft": "",
  "langues": "",
  "interets": ""
}

CONTRAINTES 1 PAGE A4 (TRES IMPORTANT) :
- "resume" : 50 mots MAXIMUM (2-3 phrases courtes)
- "experiences" : MAXIMUM 3 postes
- "description" de chaque expérience : MAXIMUM 3 bullets courts séparés par des retours à la ligne, chaque bullet de 15 mots max
- "formations" : PAS de champ "description", uniquement diplôme + établissement + date
- "competences_techniques" : liste à virgules, pas de phrases (ex: "JavaScript, React, Node.js, Python")
- "competences_soft" : liste à virgules (ex: "Leadership, Communication, Gestion de projet")
- "langues" : format court (ex: "Français (natif), Anglais (B2)")
- Si le texte source contient plus de 3 expériences, garder uniquement les 3 plus récentes/pertinentes

Texte à transformer :
${generatedText}`;
}

/**
 * Conversion CV personnalise → JSON structure
 * Utilise par matcherCvPersonnalise et scraperCvPersonnalise
 * Extrait aussi le score_matching et les modifications_apportees
 */
function personalizedCVToJSON(generatedText) {
  return `Tu vas recevoir un texte qui contient :
1. Un SCORE_MATCHING (nombre 0-100)
2. Une liste de MODIFICATIONS apportées
3. Un CV personnalisé optimisé

Ta mission est de transformer ce contenu en **JSON STRICT**, exploitable par un workflow automatisé.

Règles obligatoires :
- Réponds UNIQUEMENT avec du JSON valide
- Aucun texte explicatif avant ou après
- Aucun Markdown (pas de \`\`\`json)
- Aucun commentaire
- Toutes les clés doivent être présentes
- score_matching doit être un nombre entier (0-100)
- modifications_apportees doit être un tableau de strings

Structure JSON attendue :

{
  "score_matching": 0,
  "modifications_apportees": [],
  "personalizedCV": {
    "prenom": "",
    "nom": "",
    "titre_poste": "",
    "email": "",
    "telephone": "",
    "adresse": "",
    "linkedin": "",
    "resume": "",
    "experiences": [
      {
        "poste": "",
        "entreprise": "",
        "localisation": "",
        "date_debut": "",
        "date_fin": "",
        "description": ""
      }
    ],
    "formations": [
      {
        "diplome": "",
        "etablissement": "",
        "localisation": "",
        "date_fin": ""
      }
    ],
    "competences_techniques": "",
    "competences_soft": "",
    "langues": ""
  }
}

Voici le contenu à transformer :

${generatedText}`;
}

/**
 * Conversion CV ideal → JSON structure
 * Utilise par matcherCvIdeal et scraperCvIdeal
 */
function idealCVToJSON(generatedText) {
  return `Tu vas recevoir un CV idéal décrivant le profil parfait pour une offre d'emploi.

Ta mission est de transformer ce contenu en **JSON STRICT**, exploitable par un workflow automatisé.

Règles obligatoires :
- Réponds UNIQUEMENT avec du JSON valide
- Aucun texte explicatif avant ou après
- Aucun Markdown (pas de \`\`\`json)
- Aucun commentaire
- Toutes les clés doivent être présentes

Structure JSON attendue :

{
  "idealCV": {
    "prenom": "",
    "nom": "",
    "titre_poste": "",
    "email": "",
    "telephone": "",
    "adresse": "",
    "linkedin": "",
    "resume": "",
    "experiences": [
      {
        "poste": "",
        "entreprise": "",
        "localisation": "",
        "date_debut": "",
        "date_fin": "",
        "description": ""
      }
    ],
    "formations": [
      {
        "diplome": "",
        "etablissement": "",
        "localisation": "",
        "date_fin": ""
      }
    ],
    "competences_techniques": "",
    "competences_soft": "",
    "langues": ""
  }
}

Voici le contenu à transformer :

${generatedText}`;
}

/**
 * Conversion lettre de motivation → JSON structure
 * Utilise par matcherLettre et scraperLettre
 */
function coverLetterToJSON(generatedText) {
  return `Tu vas recevoir une lettre de motivation complète.

Ta mission est de transformer ce contenu en **JSON STRICT**, exploitable par un workflow automatisé.

Règles obligatoires :
- Réponds UNIQUEMENT avec du JSON valide
- Aucun texte explicatif avant ou après
- Aucun Markdown (pas de \`\`\`json)
- Aucun commentaire

Structure JSON attendue :

{
  "coverLetter": {
    "greeting": "Madame, Monsieur,",
    "introduction": "",
    "body": "",
    "conclusion": "",
    "closing": "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées."
  }
}

Extrais la lettre en séparant intro, corps (tout le milieu en un seul paragraphe), conclusion.

Voici le contenu à transformer :

${generatedText}`;
}

module.exports = {
  analysisToJSON,
  cvToJSON,
  personalizedCVToJSON,
  idealCVToJSON,
  coverLetterToJSON
};
