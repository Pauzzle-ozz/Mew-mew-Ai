/**
 * Fonctions de formatage partagees entre les prompts marketing
 */

/**
 * Formate un brief de contenu en texte structure
 */
function formatBriefText(brief) {
  let text = `**BRIEF DE CONTENU**\n\n`;
  text += `Sujet : ${brief.subject}\n`;
  text += `Ton : ${brief.tone}\n`;
  text += `Audience cible : ${brief.targetAudience}\n`;
  text += `Objectif : ${brief.objective}\n`;
  if (brief.keywords) text += `Mots-cles : ${brief.keywords}\n`;
  if (brief.context) text += `Contexte additionnel : ${brief.context}\n`;
  return text;
}

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
  if (input.competitors) text += `Concurrents : ${input.competitors}\n`;
  if (input.currentFrequency) text += `Frequence actuelle : ${input.currentFrequency}\n`;
  return text;
}

/**
 * Retourne la description d'une plateforme pour les prompts
 */
function getPlatformRules(platform) {
  const rules = {
    linkedin: {
      name: 'LinkedIn',
      maxLength: '1300 caracteres',
      tone: 'professionnel mais engageant',
      rules: 'Structure avec accroche forte en premiere ligne, sauts de ligne pour aerer, call-to-action en fin de post. Pas de hashtags dans le corps, les mettre a la fin (3-5 max).'
    },
    instagram: {
      name: 'Instagram',
      maxLength: '2200 caracteres',
      tone: 'casual, visuel, emotionnel',
      rules: 'Accroche percutante (premieres lignes visibles), emojis pour structurer, call-to-action engageant, 20-30 hashtags pertinents separes du texte par des points.'
    },
    twitter: {
      name: 'Twitter/X',
      maxLength: '280 caracteres par tweet, thread de 3-5 tweets',
      tone: 'direct, percutant, conversationnel',
      rules: 'Premier tweet = accroche qui donne envie de lire la suite. Chaque tweet doit avoir du sens seul. Utiliser des chiffres et des faits. 1-2 hashtags max.'
    },
    blog: {
      name: 'Article de Blog SEO',
      maxLength: '800-1200 mots',
      tone: 'informatif, structure, optimise SEO',
      rules: 'Titre H1 accrocheur avec mot-cle principal, meta description (155 car.), introduction engageante, sous-titres H2/H3, paragraphes courts, conclusion avec CTA. Inclure le mot-cle naturellement.'
    },
    video_script: {
      name: 'Script Video Courte (Reels/TikTok)',
      maxLength: '60 secondes',
      tone: 'dynamique, accrocheur, rapide',
      rules: 'Hook dans les 3 premieres secondes, structure probleme-solution, langage oral naturel, call-to-action final. Indiquer les plans visuels entre crochets [plan].'
    },
    newsletter: {
      name: 'Newsletter Email',
      maxLength: '500-700 mots',
      tone: 'personnel, direct, valuable',
      rules: 'Objet d\'email accrocheur (50 car. max), preheader, salutation personnalisee, contenu structure avec sous-titres, liens vers ressources, CTA principal clair, signature.'
    }
  };
  return rules[platform] || null;
}

module.exports = { formatBriefText, formatStrategyInput, getPlatformRules };
