const { formatStrategyInput } = require('./marketingHelpers');

/**
 * Construit le prompt de generation de strategie de contenu / calendrier editorial
 * Appel direct en JSON mode (1 seul appel GPT-4o)
 */
function buildPrompt(input) {
  const strategyText = formatStrategyInput(input);
  const channelList = input.channels.join(', ');
  const startDate = input.startDate || new Date().toISOString().split('T')[0];

  const budgetContext = {
    'zero': 'AUCUN BUDGET : tout doit etre realisable seul avec un smartphone, des outils gratuits (Canva, CapCut, etc.). Pas de prestataire externe.',
    'petit': 'PETIT BUDGET (< 500 euros/mois) : outils payants basiques possibles. Freelance ponctuel pour des taches specifiques.',
    'moyen': 'BUDGET MOYEN (500-2000 euros/mois) : freelances (graphiste, monteur video). Outils pro possibles.',
    'confortable': 'BUDGET CONFORTABLE (2000-5000 euros/mois) : equipe de freelances reguliere, prestataires photo/video, outils premium.',
    'gros': 'GROS BUDGET (> 5000 euros/mois) : equipe dediee, tournages professionnels, photographe, cadreur, preneur de son, studio.'
  };

  const budgetLine = input.budget ? `\nBudget : ${budgetContext[input.budget] || input.budget}` : '';

  return `Tu es un directeur de strategie de contenu avec 15 ans d'experience.

${strategyText}${budgetLine}

Date de debut : ${startDate}

---

Genere un CALENDRIER EDITORIAL sur 30 JOURS + un PLANNING DE PRODUCTION pour : ${channelList}.

CONTRAINTE TEMPORELLE ABSOLUE :
- Aujourd'hui c'est le ${startDate}. AUCUNE date (ni production, ni publication) ne peut etre AVANT le ${startDate}.
- Le planning de production COMMENCE a partir du ${startDate}.
- Les premieres publications simples (post texte, tweet, story) peuvent demarrer des le jour 2-3.
- Les premieres publications lourdes (video, photo pro, podcast) ne peuvent PAS demarrer avant le jour 7-10 car il faut le temps de produire.

DELAIS REALISTES entre session de production et publication :
- Video YouTube : session de tournage minimum 7 jours AVANT publication (booking equipe, tournage, montage, validation)
- Video courte (Reels, TikTok) : session de tournage minimum 4-5 jours AVANT publication (tournage batch, montage)
- Shoot photo pro : minimum 4-5 jours AVANT publication (organisation, shooting, retouche)
- Podcast : enregistrement minimum 5 jours AVANT publication (enregistrement, mixage, upload)
- Article blog : redaction minimum 3 jours AVANT publication (ecriture, relecture, SEO)
- Newsletter : redaction minimum 2 jours AVANT envoi
- Post texte simple (LinkedIn, Twitter, Facebook, Threads) : redaction 1 jour AVANT, voire le jour meme

Donc le planning se construit ainsi :
1. Les sessions de production sont planifiees en PREMIER (a partir d'aujourd'hui)
2. Les publications sont planifiees APRES, en respectant les delais ci-dessus
3. Exemple concret : session tournage Reels le ${startDate} → publication des Reels a partir du jour 5-6

FREQUENCES PAR CANAL :
LinkedIn 3-4/sem | Instagram 4-5/sem | TikTok 5-7/sem | YouTube 1-2/sem | Facebook 3-4/sem | Twitter/X 1-2/jour | Pinterest 3-5/sem | Threads 3-4/sem | Snapchat 3-5/sem | Blog 1-2/sem | Newsletter 1/sem | Podcast 1/sem | WhatsApp 2-3/sem

REGLES :
1. Varie la frequence par canal, pas de publication sur tous les canaux chaque jour
2. Alterne : educatif, inspirant, promotionnel, behind-the-scenes, engagement, storytelling, tutoriel, divertissement
3. Regle 80/20 : 80% valeur, 20% promo
4. Themes specifiques au secteur "${input.sector}" et audience "${input.targetAudience}"
5. Inclus les marronniers pertinents pour la periode
6. Sois concret : pas "contenu inspirant" mais "5 erreurs en [domaine] et solutions"
7. Regroupe les tournages : 1 session de 3h = 4-6 videos courtes
8. Adapte les ressources au budget
9. Indique le cout estime par post et par session
10. Un tournage pro necessite de la preparation (briefing, reperage, logistique) : ne JAMAIS planifier un tournage pour le lendemain

PRODUCTION : regroupe intelligemment (3 Reels + 2 TikTok = 1 session tournage, etc.)
Pour chaque session : date, type, contenus a produire, ressources (humaines + materielles), duree, cout, notes.

Reponds UNIQUEMENT en JSON valide avec cette structure :

{
  "strategy": {
    "summary": "Resume 2-3 phrases",
    "totalPosts": 0,
    "channelsUsed": [],
    "totalEstimatedCost": "ex: ~800 euros"
  },
  "calendar": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "theme": "theme precis",
      "posts": [
        {
          "channel": "linkedin|instagram|tiktok|youtube|facebook|twitter|pinterest|threads|snapchat|blog|newsletter|podcast|whatsapp",
          "type": "educatif|inspirant|promotionnel|behind-the-scenes|engagement|storytelling|actualite|divertissement|teaser|tutoriel",
          "description": "1-2 phrases concretes",
          "hashtags": ["#tag1"],
          "bestTime": "HH:MM",
          "estimatedCost": "Gratuit|~50 euros|etc.",
          "productionSessionId": null
        }
      ]
    }
  ],
  "productionSessions": [
    {
      "id": 1,
      "date": "YYYY-MM-DD",
      "day": 1,
      "type": "tournage_video|shoot_photo|redaction|enregistrement_audio|design|montage",
      "title": "Tournage batch Reels semaine 1",
      "items": [{"title": "Reel erreurs courantes", "channel": "instagram", "forDay": "Lun 24 Fev"}],
      "resources": ["Trepied", "Micro-cravate", "Eclairage"],
      "duration": "2h|Demi-journee|1 journee",
      "estimatedCost": "Gratuit|~100 euros|etc.",
      "notes": "Conseil pratique"
    }
  ],
  "tips": ["conseil 1", "conseil 2", "conseil 3"]
}

Exactement 30 jours dans calendar. Les dates sont reelles a partir du ${startDate}.`;
}

module.exports = { buildPrompt };
