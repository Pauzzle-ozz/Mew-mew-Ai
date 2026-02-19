const { formatStrategyInput } = require('./marketingHelpers');

/**
 * Construit le prompt de generation de strategie de contenu / calendrier editorial
 * Etape 1 du pipeline generateThenConvert (texte creatif via GPT-4o)
 */
function buildPrompt(input) {
  const strategyText = formatStrategyInput(input);

  const channelList = input.channels.join(', ');

  return `Tu es un directeur de strategie de contenu avec 15 ans d'experience. Tu crees des calendriers editoriaux performants pour des marques et des entrepreneurs.

${strategyText}

---

Ta mission : generer un CALENDRIER EDITORIAL sur 30 JOURS pour les canaux suivants : ${channelList}.

Pour chaque jour (Jour 1 a Jour 30), tu dois fournir :
1. Le THEME du jour (un sujet precis, pas vague)
2. Pour CHAQUE canal actif ce jour-la : le type de contenu + une description courte (1-2 phrases) de ce qu'il faut publier
3. Les HASHTAGS recommandes (3-5 par post)
4. L'HORAIRE optimal de publication

REGLES CRITIQUES :
1. Pas de publication tous les jours sur tous les canaux - varie la frequence :
   - LinkedIn : 3-4 posts par semaine
   - Instagram : 4-5 posts par semaine
   - Twitter/X : 1-2 tweets par jour
   - Blog : 1-2 articles par semaine
   - Newsletter : 1 par semaine
   - Video : 2-3 par semaine
2. Alterne les types de contenu : educatif, inspirant, promotionnel, behind-the-scenes, engagement
3. Respecte la regle 80/20 : 80% de valeur, 20% de promotion
4. Les themes doivent etre specifiques au secteur "${input.sector}" et a l'audience "${input.targetAudience}"
5. Inclus des marronniers (evenements saisonniers, journees mondiales) pertinents pour le secteur
6. Sois concret : pas de "publier du contenu inspirant" mais "5 erreurs courantes en [domaine] et comment les eviter"

Structure ta reponse jour par jour, avec pour chaque jour les publications prevues par canal.`;
}

module.exports = { buildPrompt };
