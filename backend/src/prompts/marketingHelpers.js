/**
 * Fonctions de formatage partagees entre les prompts marketing
 */

/**
 * Formate une configuration de strategie en texte structure
 */
function formatStrategyInput(input) {
  let text = `**CONFIGURATION STRATEGIE**\n\n`;
  text += `Secteur : ${input.sector}\n`;
  text += `Audience cible : ${input.targetAudience}\n`;
  text += `Objectifs : ${input.objectives}\n`;
  text += `Canaux : ${input.channels.join(', ')}\n`;
  if (input.brandVoice) text += `Ton de marque : ${input.brandVoice}\n`;
  if (input.budget) text += `Budget : ${input.budget}\n`;
  if (input.startDate) text += `Date de debut : ${input.startDate}\n`;
  return text;
}

module.exports = { formatStrategyInput };
