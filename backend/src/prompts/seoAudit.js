/**
 * Prompt pour l'audit SEO d'un site web
 * Recoit les donnees extraites de chaque page et demande une analyse complete
 */
function buildPrompt(pagesData, siteUrl) {
  // Formater les donnees de chaque page pour le prompt
  const pagesText = pagesData.map((p, i) => {
    const ogStatus = [
      p.openGraph.hasTitle ? 'og:title OK' : 'og:title MANQUANT',
      p.openGraph.hasDescription ? 'og:description OK' : 'og:description MANQUANT',
      p.openGraph.hasImage ? 'og:image OK' : 'og:image MANQUANT'
    ].join(', ');

    return `--- PAGE ${i + 1} : ${p.url} ---
- HTTPS : ${p.isHttps ? 'Oui' : 'Non'}
- URL propre : ${p.hasCleanUrl ? 'Oui' : 'Non'}
- Title : "${p.title}" (${p.titleLength} caracteres)
- Meta description : "${p.description}" (${p.descriptionLength} caracteres)
- Meta robots : ${p.robots || 'Non defini'}
- Canonical : ${p.canonical || 'Non defini'}
- Open Graph : ${ogStatus}
- Lang : ${p.htmlLang || 'Non defini'}
- Viewport : ${p.hasViewport ? 'Oui' : 'Non'}
- Donnees structurees (JSON-LD) : ${p.hasStructuredData ? 'Oui' : 'Non'}
- H1 (${p.headings.h1Count}) : ${p.headings.h1.join(' | ') || 'Aucun'}
- H2 (${p.headings.h2Count}) : ${p.headings.h2.join(' | ') || 'Aucun'}
- H3 (${p.headings.h3Count}) : ${p.headings.h3.join(' | ') || 'Aucun'}
- Images : ${p.images.total} total, ${p.images.withoutAlt} sans attribut alt
- Liens internes : ${p.links.internal}
- Liens externes : ${p.links.external}
- Nombre de mots : ${p.wordCount}`;
  }).join('\n\n');

  return `Tu es un expert SEO avec 15 ans d'experience en audit technique et optimisation de sites web. Tu maitrises parfaitement les guidelines Google, les Core Web Vitals et les meilleures pratiques SEO on-page.

SITE AUDITE : ${siteUrl}
NOMBRE DE PAGES ANALYSEES : ${pagesData.length}

DONNEES EXTRAITES :

${pagesText}

---

MISSION : Realise un audit SEO complet de ce site a partir des donnees extraites.

CRITERES D'EVALUATION :
- Title : present, unique, 50-60 caracteres ideal, contient des mots-cles pertinents
- Meta description : presente, 150-160 caracteres ideal, incitative
- H1 : un seul par page, pertinent, contient le mot-cle principal
- Structure des headings : hierarchie logique (H1 > H2 > H3)
- Images : toutes doivent avoir un attribut alt descriptif
- Liens internes : maillage suffisant entre les pages
- Liens externes : presence de liens sortants de qualite
- HTTPS : obligatoire
- Canonical : defini correctement
- Open Graph : complet pour le partage sur les reseaux sociaux
- Viewport : present pour le responsive
- Lang : defini pour l'accessibilite et le SEO international
- Donnees structurees : bonus important pour les rich snippets
- Contenu : longueur suffisante (300+ mots pour les pages principales)
- URL : propres, courtes, descriptives

REGLES :
1. Sois precis et factuel, base ton analyse sur les donnees fournies
2. Attribue des scores justes - ne sois ni trop indulgent ni trop severe
3. Les recommandations doivent etre concretes et actionnables
4. Priorise les quick wins (impact eleve, effort faible)
5. Adapte l'analyse au type de site detecte (vitrine, blog, e-commerce, etc.)

Reponds en JSON :

{
  "globalScore": {
    "value": 0,
    "label": "Faible" | "Moyen" | "Bon" | "Excellent",
    "summary": "Resume en 2-3 phrases de l'etat SEO global du site"
  },
  "categoryScores": [
    {
      "name": "Balises & Meta",
      "score": 0,
      "icon": "tag",
      "details": "Explication du score"
    },
    {
      "name": "Contenu",
      "score": 0,
      "icon": "file-text",
      "details": "Explication du score"
    },
    {
      "name": "Structure & Headings",
      "score": 0,
      "icon": "list",
      "details": "Explication du score"
    },
    {
      "name": "Images & Medias",
      "score": 0,
      "icon": "image",
      "details": "Explication du score"
    },
    {
      "name": "Maillage & Liens",
      "score": 0,
      "icon": "link",
      "details": "Explication du score"
    },
    {
      "name": "Technique",
      "score": 0,
      "icon": "settings",
      "details": "Explication du score"
    }
  ],
  "pageAnalyses": [
    {
      "url": "",
      "score": 0,
      "issues": ["Liste des problemes detectes"],
      "positives": ["Liste des points positifs"]
    }
  ],
  "improvements": [
    {
      "title": "Titre court et actionnable",
      "description": "Description detaillee de l'amelioration a apporter",
      "priority": "haute" | "moyenne" | "basse",
      "category": "Nom de la categorie concernee",
      "pages": ["URLs des pages concernees (les plus importantes)"]
    }
  ],
  "quickWins": [
    "Action rapide a mettre en place immediatement (3-5 quick wins)"
  ],
  "summary": "Synthese globale en 3-4 phrases avec les points cles et la direction a prendre"
}

IMPORTANT :
- "pageAnalyses" doit contenir une entree pour CHAQUE page analysee
- "improvements" doit contenir 5-10 recommandations triees par priorite
- "quickWins" doit contenir 3-5 actions a impact immediat
- Les scores vont de 0 a 100
- "globalScore.label" : Faible (0-24), Moyen (25-49), Bon (50-74), Excellent (75-100)`;
}

module.exports = { buildPrompt };
