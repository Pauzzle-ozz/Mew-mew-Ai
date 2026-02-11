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

## Étape 1 : Évaluation du matching

Avant de générer le CV, évalue le niveau de correspondance entre le profil et l'offre :
- Donne un SCORE_MATCHING entre 0 et 100 (ex: SCORE_MATCHING: 72)
- Liste les MODIFICATIONS apportées au CV, une par ligne (ex: MODIFICATION: Titre reformulé de "Développeur" vers "Lead Developer Full-Stack")

## Étape 2 : CV Personnalisé

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

Commence ta réponse par :
SCORE_MATCHING: [nombre 0-100]
MODIFICATIONS:
- [modification 1]
- [modification 2]
...

Puis génère le CV personnalisé de manière détaillée et professionnelle.`;
}

module.exports = { buildPrompt };
