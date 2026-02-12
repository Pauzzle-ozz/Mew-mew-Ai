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
- Donne un SCORE_MATCHING entre 0 et 100 (ex: SCORE_MATCHING: 85)
- Liste les MODIFICATIONS apportées au CV, une par ligne (ex: MODIFICATION: Titre reformulé de "Développeur" vers "Lead Developer Full-Stack")

## Étape 2 : CV Personnalisé

**OBJECTIF : le CV optimisé doit atteindre un score de concordance MINIMUM de 80/100.**

Pour atteindre ce score, tu DOIS :
- Reformuler agressivement le titre du poste pour correspondre exactement à l'intitulé de l'offre
- Réécrire le résumé professionnel en intégrant les mots-clés exacts de l'offre
- Réorganiser les expériences pour mettre en avant celles qui correspondent le mieux
- Adapter les descriptions d'expériences pour utiliser le vocabulaire et les compétences mentionnées dans l'offre
- Met en avant toutes les compétences clés mentionnées dans l'offre (même si elles sont implicites dans le profil)
- Garde les données exactes du candidat (prenom, nom, email, téléphone, etc.) — ne les invente pas
- Si le profil est éloigné de l'offre, mets en avant les compétences transversales et reformule pour maximiser la pertinence

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
