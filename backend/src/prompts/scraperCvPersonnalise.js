const { formatCandidateText } = require('./helpers');

/**
 * Prompt scraper CV personnalise
 * Extrait du workflow n8n "Scraper - CV Personnalisé"
 */
function buildPrompt(rawText, url, candidate) {
  const candidateText = formatCandidateText(candidate);

  return `Tu es un expert RH spécialisé dans l'optimisation de CV pour des offres d'emploi spécifiques.

Tu vas recevoir le TEXTE BRUT d'une page web contenant une offre d'emploi, ainsi que le profil d'un candidat.

Ta mission en 2 étapes :

## Étape 1 : Extraire l'offre d'emploi
Depuis le texte brut ci-dessous, identifie et extrais :
- Le titre du poste
- L'entreprise
- La localisation
- Le type de contrat (CDI, CDD, Freelance, Stage, Alternance)
- Le salaire (si mentionné)
- La description complète (missions, profil recherché, compétences requises)

Ignore tout le contenu parasite (navigation, publicités, mentions légales, cookies, etc.).

## Étape 2 : Générer un CV personnalisé
En utilisant l'offre extraite et le profil candidat :
- Réorganise les expériences pour mettre en avant celles qui correspondent le mieux à l'offre
- Reformule le résumé professionnel pour coller à l'offre
- Met en avant les compétences clés mentionnées dans l'offre
- Adapte les descriptions d'expériences pour utiliser le vocabulaire de l'offre
- Garde les données exactes du candidat (prenom, nom, email, téléphone, etc.)

---

**TEXTE BRUT DE LA PAGE WEB (URL : ${url}) :**

${rawText}

---

${candidateText}

---

Génère le CV personnalisé de manière détaillée et professionnelle, en gardant toutes les informations de contact du candidat.`;
}

module.exports = { buildPrompt };
