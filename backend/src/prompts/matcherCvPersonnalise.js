const { formatOfferText, formatCandidateText } = require('./helpers');

/**
 * Prompt matcher CV personnalise
 * Extrait du workflow n8n "Matcher - CV Personnalisé"
 */
function buildPrompt(offer, candidate) {
  const offerText = formatOfferText(offer);
  const candidateText = formatCandidateText(candidate);

  return `Tu es un expert RH spécialisé dans l'optimisation de CV pour des offres d'emploi spécifiques.

Tu vas analyser une offre d'emploi et un profil candidat, puis générer un **CV personnalisé optimisé** pour cette offre.

## CV Personnalisé

Optimise le CV du candidat pour l'offre :
- Réorganise les expériences pour mettre en avant celles qui correspondent le mieux
- Reformule le résumé professionnel pour coller à l'offre
- Met en avant les compétences clés mentionnées dans l'offre
- Adapte les descriptions d'expériences pour utiliser le vocabulaire de l'offre
- Garde les données exactes du candidat (prenom, nom, email, téléphone, etc.)

---

${offerText}

---

${candidateText}

---

Génère le CV personnalisé de manière détaillée et professionnelle, en gardant toutes les informations de contact du candidat.`;
}

module.exports = { buildPrompt };
