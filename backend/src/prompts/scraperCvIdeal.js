/**
 * Prompt scraper CV ideal
 * Extrait du workflow n8n "Scraper - CV Idéal"
 */
function buildPrompt(rawText, url) {
  return `Tu es un expert RH spécialisé dans l'analyse d'offres d'emploi.

Tu vas recevoir le TEXTE BRUT d'une page web contenant une offre d'emploi.

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

## Étape 2 : Créer un CV idéal
En utilisant l'offre extraite, crée un CV fictif du candidat parfait pour ce poste :
- Titre de poste correspondant exactement à l'offre
- Résumé professionnel décrivant le profil idéal
- Expériences types attendues (liste d'expériences professionnelles cohérentes)
- Formations recommandées (diplômes et certifications attendus)
- Compétences requises et souhaitées (techniques et soft skills)
- Langues nécessaires

Utilise des données réalistes et professionnelles.

---

**TEXTE BRUT DE LA PAGE WEB (URL : ${url}) :**

${rawText}

---

Génère le CV idéal de manière détaillée et professionnelle.`;
}

module.exports = { buildPrompt };
