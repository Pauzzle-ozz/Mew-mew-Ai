const { formatBriefText, getPlatformRules } = require('./marketingHelpers');

/**
 * Construit le prompt de generation de contenu multi-format
 * Etape 1 du pipeline generateThenConvert (texte creatif via GPT-4o)
 */
function buildPrompt(brief, platforms) {
  const briefText = formatBriefText(brief);

  const platformSections = platforms
    .map(p => {
      const rules = getPlatformRules(p);
      if (!rules) return null;
      return `### ${rules.name}
- Longueur max : ${rules.maxLength}
- Ton : ${rules.tone}
- Regles : ${rules.rules}`;
    })
    .filter(Boolean)
    .join('\n\n');

  return `Tu es un expert en marketing digital et creation de contenu. Tu maitrises parfaitement les codes de chaque plateforme sociale et sais adapter un meme message pour maximiser l'impact sur chaque canal.

${briefText}

---

Tu dois generer du contenu adapte pour les plateformes suivantes. Pour CHAQUE plateforme, respecte scrupuleusement les regles specifiques :

${platformSections}

---

REGLES CRITIQUES :
1. Chaque contenu doit etre PRET A PUBLIER, pas un brouillon
2. Adapte le ton et le format a chaque plateforme (pas de copier-coller entre plateformes)
3. Le contenu doit etre en francais
4. Sois creatif et engageant, pas generique
5. Chaque contenu doit servir l'objectif du brief : ${brief.objective}
6. Ecris comme un HUMAIN, pas comme une IA. Ton texte doit sembler ecrit par un vrai community manager ou redacteur.
7. INTERDITS : les phrases bateau type "Saviez-vous que", "Dans un monde ou", "Il est temps de", "N'attendez plus", "Decouvrez comment", "Et si je vous disais". Ces formulations sont instantanement reconnaissables comme generees par IA.
8. Utilise un langage naturel, des expressions courantes, des tournures conversationnelles. Ose l'imparfait, les phrases courtes, les apartés.
9. Varie la longueur et la structure des phrases. Alterne phrases courtes et longues. Evite les enumerations systematiques a puces.
10. Sois specifique et concret plutot que vague et generique. Donne des exemples, des chiffres, des anecdotes quand c'est pertinent.
11. Pour chaque plateforme, evalue la QUALITE du contenu genere sur un score de 0 a 100 selon : potentiel d'engagement (40%), adequation a la plateforme (30%), clarte et lisibilite (30%). Indique ce score clairement apres le contenu.

Pour chaque plateforme, genere le contenu complet en le separant clairement avec le nom de la plateforme en titre.`;
}

module.exports = { buildPrompt };
