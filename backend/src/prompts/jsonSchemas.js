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
- des métiers proposés
- une classification des postes
- des compétences
- des mots-clés
- une évaluation marché avec une note sur 100 par métier

Ta mission est de transformer ce contenu en **JSON STRICT**, exploitable par un workflow automatisé.

Règles obligatoires (à respecter strictement) :
- Réponds UNIQUEMENT avec du JSON valide
- Aucun texte explicatif
- Aucun Markdown
- Aucun commentaire
- Toutes les clés doivent être présentes même si certaines valeurs sont vides
- Les notes doivent être des nombres entre 0 et 100

Structure JSON attendue :

{
  "metiers": [
    {
      "intitule": "",
      "categorie": "Ce que je veux | Correspond à mes compétences | Je pourrais tenter",
      "priorite": 1,
      "note_marche": 0,
      "justification_note": "",
      "mots_cles": []
    }
  ],
  "competences_cles": [],
  "mots_cles_recherche": []
}

Consignes spécifiques :
- Chaque métier identifié dans l'analyse doit apparaître dans le tableau "metiers"
- "priorite" doit être un entier (1 = priorité la plus élevée)
- "note_marche" doit refléter principalement l'équilibre offre / demande du marché
- "justification_note" doit être une phrase courte expliquant la note
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
      "date_fin": "",
      "description": ""
    }
  ],
  "competences_techniques": "",
  "competences_soft": "",
  "langues": "",
  "interets": ""
}

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
