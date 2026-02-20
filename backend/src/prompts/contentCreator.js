const { formatBriefText } = require('./marketingHelpers');

/**
 * Regles algorithmiques detaillees pour 9 plateformes
 */
const PLATFORM_ALGO_RULES = {
  linkedin: {
    name: 'LinkedIn',
    maxLength: '3000 caracteres (1300 recommandes pour visibilite maximale)',
    tone: 'professionnel mais engageant, expert',
    rules: `- La premiere ligne est le HOOK (visible avant "voir plus") — elle doit etre percutante
- Sauts de ligne entre chaque idee pour aerer
- 3-5 hashtags en fin de post uniquement
- PAS de liens externes dans le post (les mettre en commentaire)
- L'algorithme favorise : temps de lecture, commentaires > likes, contenu natif
- Meilleurs horaires : Mar-Jeu 7-9h et 12-14h
- Les carrousels obtiennent 3x plus de portee`
  },
  instagram: {
    name: 'Instagram',
    maxLength: '2200 caracteres pour la caption',
    tone: 'casual, visuel, emotionnel, authentique',
    rules: `- Premiere ligne critique (coupee a ~125 caracteres)
- 3-5 emojis pertinents pour structurer
- 20-30 hashtags (mix populaire + niche), separes du texte par 5 points
- L'algorithme favorise : sauvegardes et partages > likes
- Reels optimal : 15-30s
- Carousel : 3-10 slides (engagement tres eleve)
- Meilleurs horaires : Lun/Mer/Ven 11-13h et 19-21h`
  },
  twitter: {
    name: 'Twitter/X',
    maxLength: '280 caracteres par tweet, thread de 3-7 tweets',
    tone: 'direct, percutant, conversationnel',
    rules: `- Premier tweet = accroche auto-suffisante
- Chaque tweet doit avoir du sens seul
- Chiffres et faits augmentent l'engagement
- 1-2 hashtags max
- Les posts avec media obtiennent 2x l'engagement
- L'algorithme favorise : reponses et retweets
- Meilleurs horaires : Lun-Ven 8-10h et 17-19h`
  },
  tiktok: {
    name: 'TikTok',
    maxLength: '2200 caracteres pour la caption',
    tone: 'authentique, fun, direct, tendance',
    rules: `- Hook en 1 SECONDE — le taux de completion est ROI de l'algo
- Duree optimale pour viralite : 21-34 secondes
- Sons tendance augmentent massivement la portee
- 3-5 hashtags (mix trending + niche + #fyp #pourtoi)
- Text overlay pour l'accessibilite
- Format Duet/Stitch friendly
- Langage oral, pas ecrit
- Meilleurs horaires : 7-9h, 12-15h, 19-23h`
  },
  youtube: {
    name: 'YouTube',
    maxLength: 'Titre 60 caracteres, description 5000 caracteres',
    tone: 'informatif, captivant, optimise SEO',
    rules: `- Titre : 60 car. max, mot-cle principal en debut
- Description : les 2 premieres lignes visibles (CTA + lien)
- 5-8 tags pertinents
- Structure script : Hook (0-30s), Intro (30s-1m), Contenu principal, CTA, Outro
- Timestamps dans la description
- Suggestion de texte pour miniature (thumbnail)
- Long format optimal : 8-12 min
- Shorts : 30-60s
- L'algorithme favorise : temps de visionnage, CTR miniature`
  },
  facebook: {
    name: 'Facebook',
    maxLength: '63206 caracteres max mais 40-80 caracteres = meilleur engagement',
    tone: 'conversationnel, communautaire, personnel',
    rules: `- Les posts longs sont coupes a 477 caracteres ("Voir plus")
- L'algorithme favorise : interactions significatives (commentaires, partages)
- Groupes > Pages pour la portee
- Video native > liens externes
- 1-2 hashtags maximum
- Stories disponibles
- Meilleurs horaires : Mer 11h, Ven 10-11h`
  },
  blog: {
    name: 'Article de Blog SEO',
    maxLength: '800-1500 mots',
    tone: 'informatif, structure, optimise SEO',
    rules: `- Titre H1 avec mot-cle principal
- Meta description 155 caracteres
- Structure H2/H3 hierarchique
- Paragraphes courts (3-4 phrases max)
- Densite mot-cle 1-2%
- Maillage interne, alt text pour images
- Introduction engageante, conclusion avec CTA`
  },
  newsletter: {
    name: 'Newsletter Email',
    maxLength: 'Objet 50 caracteres, corps 500-700 mots',
    tone: 'personnel, direct, a haute valeur ajoutee',
    rules: `- Objet email : 50 car. max, accrocheur
- Preheader : 90 car. max
- Un seul CTA principal clair
- Tokens de personnalisation
- Design mobile-first
- Mention desinscription`
  },
  video_script: {
    name: 'Script Video Generique (Reels/Stories)',
    maxLength: '15-60 secondes',
    tone: 'dynamique, accrocheur, oral naturel',
    rules: `- Hook dans les 3 premieres secondes
- Structure probleme-solution
- Langage oral naturel (pas ecrit)
- Indications visuelles entre [crochets]
- Call-to-action final
- Sous-titres recommandes`
  }
};

/**
 * Instructions specifiques par type de contenu
 */
const CONTENT_TYPE_INSTRUCTIONS = {
  publicitaire: `Type : PUBLICITAIRE (vente directe)
- Mets en avant les benefices, pas les fonctionnalites
- Utilise la preuve sociale (chiffres, temoignages)
- Call-to-action clair et urgent
- Cree un sentiment d'urgence ou d'exclusivite
- Adresse directement le probleme du client`,

  entrepreneurial: `Type : ENTREPRENEURIAL (marque/parcours)
- Raconte l'histoire de la marque ou du fondateur
- Behind the scenes, processus de creation
- Montre les valeurs et la mission
- Humanise la marque
- Partage les echecs et les apprentissages`,

  educatif: `Type : EDUCATIF (tutoriel/conseil)
- Structure claire : probleme → solution → resultat
- Etapes numerotees ou bullet points
- Exemples concrets et actionables
- Montre ton expertise sans jargon inaccessible
- Termine par un takeaway clair`,

  viral: `Type : VIRAL / CHOC
- Hook extremement percutant (question provocante, stat choquante)
- Joue sur les emotions fortes (surprise, indignation, fascination)
- Contenu polarisant qui pousse au debat
- Format listicle ou revelations
- Encourage les partages et les saves`,

  storytelling: `Type : STORYTELLING (recit narratif)
- Structure narrative : situation initiale → conflit → resolution
- Utilise des details sensoriels et emotionnels
- Le lecteur doit s'identifier au personnage
- Tension narrative progressive
- Morale ou lecon a la fin`,

  inspirant: `Type : INSPIRANT (motivation)
- Commence par une situation difficile ou un defi
- Montre la transformation ou la reussite
- Citations percutantes
- Ton upliftant et positif
- Encourage l'action et le depassement`,

  engagement: `Type : ENGAGEMENT (interaction)
- Pose des questions ouvertes
- Propose des sondages ou des choix
- Lance des debats constructifs
- Appel a l'action communautaire
- Encourage le partage d'experience`,

  actualite: `Type : ACTUALITE / NEWSJACKING
- Reagis rapidement a une tendance ou un evenement
- Apporte un angle unique ou une expertise
- Contexte + analyse + opinion
- Lie l'actualite a ton domaine
- Source et credibilite`
};

/**
 * Construit le prompt principal de generation de contenu
 * @param {Object} brief - { subject, tone, targetAudience, objective, keywords, context }
 * @param {string[]} platforms - plateformes selectionnees
 * @param {string} contentType - type de contenu
 * @param {string|null} sourceContent - contenu source si recreation depuis URL
 * @returns {string} prompt pour GPT-4o
 */
function buildContentCreatorPrompt(brief, platforms, contentType, sourceContent = null) {
  const briefText = formatBriefText(brief);
  const typeInstructions = CONTENT_TYPE_INSTRUCTIONS[contentType] || '';

  const platformSections = platforms
    .map(p => {
      const rules = PLATFORM_ALGO_RULES[p];
      if (!rules) return null;
      return `### ${rules.name}
- Longueur max : ${rules.maxLength}
- Ton : ${rules.tone}
- Regles algorithmiques :
${rules.rules}`;
    })
    .filter(Boolean)
    .join('\n\n');

  const sourceSection = sourceContent
    ? `\n---\n\n**CONTENU SOURCE A ADAPTER** (recree a partir de ce materiel) :\n\n${sourceContent.substring(0, 5000)}\n\nAdapte ce contenu en gardant l'essence du message mais en le transformant completement pour chaque plateforme. Ne copie pas le contenu tel quel.`
    : '';

  return `Tu es un expert mondial en marketing digital, creation de contenu et growth hacking. Tu connais parfaitement les algorithmes de chaque plateforme sociale et sais creer du contenu qui maximise la portee organique.

${briefText}

${typeInstructions}
${sourceSection}

---

Tu dois generer du contenu PRET A PUBLIER pour les plateformes suivantes. Pour CHAQUE plateforme, respecte SCRUPULEUSEMENT les regles algorithmiques specifiques :

${platformSections}

---

REGLES CRITIQUES :
1. Chaque contenu doit etre 100% PRET A PUBLIER, pas un brouillon
2. Adapte COMPLETEMENT le ton, le format et le style a chaque plateforme — ZERO copier-coller entre plateformes
3. Tout le contenu doit etre en francais
4. Sois creatif, authentique et engageant — pas de contenu generique
5. Chaque contenu doit servir l'objectif du brief : ${brief.objective}
6. Respecte les limites de caracteres de chaque plateforme
7. Inclus les hashtags adaptes a chaque plateforme
8. Indique le meilleur horaire de publication pour chaque plateforme

Pour chaque plateforme, genere le contenu complet en le separant clairement avec le nom de la plateforme en titre.`;
}

/**
 * Construit le prompt pour la generation d'image DALL-E
 * @param {Object} brief - { subject, tone, targetAudience, objective }
 * @param {string} platform - plateforme cible
 * @param {string} contentType - type de contenu
 * @returns {string} prompt pour DALL-E 3
 */
function buildImagePrompt(brief, platform, contentType) {
  const platformFormats = {
    instagram: 'post carre Instagram (1:1)',
    facebook: 'post Facebook (1.91:1 paysage)',
    linkedin: 'post LinkedIn professionnel (1.91:1)',
    twitter: 'image pour tweet (16:9)',
    tiktok: 'couverture TikTok verticale (9:16)',
    youtube: 'miniature YouTube accrocheuse (16:9)',
    blog: 'image de couverture d\'article de blog (16:9)',
    newsletter: 'banniere email (600x200px, sobre)',
    video_script: 'couverture video (16:9)'
  };

  const format = platformFormats[platform] || 'image marketing (16:9)';

  const toneMap = {
    publicitaire: 'professionnel et vendeur, couleurs vives',
    entrepreneurial: 'authentique, behind the scenes',
    educatif: 'clair, informatif, avec icones ou schemas',
    viral: 'percutant, emouvant, contrastes forts',
    storytelling: 'cinematographique, emotionnel',
    inspirant: 'lumineux, positif, espace aerien',
    engagement: 'interactif, coloré, dynamique',
    actualite: 'editorial, sobre, actualite'
  };

  const style = toneMap[contentType] || 'moderne et professionnel';

  return `Cree une image pour un ${format}.

Sujet : ${brief.subject}
Audience : ${brief.targetAudience || 'professionnels'}
Style visuel : ${style}
Ton general : ${brief.tone || 'Professionnel'}

L'image ne doit PAS contenir de texte. Elle doit etre visuellement impactante et adaptee a la plateforme ${platform}. Style moderne, haute qualite, photorealiste ou illustration professionnelle selon le contexte.`;
}

module.exports = { buildContentCreatorPrompt, buildImagePrompt, PLATFORM_ALGO_RULES, CONTENT_TYPE_INSTRUCTIONS };
