const { formatOfferText } = require('./helpers');

/**
 * Prompt matcher CV ideal
 * Extrait du workflow n8n "Matcher - CV Idéal"
 */
function buildPrompt(offer) {
  const offerText = formatOfferText(offer);

  return `Tu es un expert RH spécialisé dans l'analyse d'offres d'emploi.

Tu vas analyser une offre d'emploi et créer un **CV idéal** décrivant le profil parfait recherché par l'employeur.

## CV Idéal

Crée un CV fictif du candidat parfait pour ce poste :
- Titre de poste correspondant exactement à l'offre
- Résumé professionnel décrivant le profil idéal
- Expériences types attendues (liste d'expériences professionnelles cohérentes)
- Formations recommandées (diplômes et certifications attendus)
- Compétences requises et souhaitées (techniques et soft skills)
- Langues nécessaires

Utilise des données réalistes et professionnelles.

---

${offerText}

---

Génère le CV idéal de manière détaillée et professionnelle.`;
}

module.exports = { buildPrompt };
