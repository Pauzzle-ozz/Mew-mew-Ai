/**
 * Prompt pour analyser les performances de contenu marketing
 * Utilise directement avec aiService.generateJSON()
 * Supporte les metriques specifiques par plateforme
 */

// Labels lisibles pour chaque cle de metrique
const METRIC_LABELS = {
  impressions: 'Impressions',
  clicks: 'Clics',
  likes: 'Likes',
  comments: 'Commentaires',
  shares: 'Partages',
  followers: 'Abonnes gagnes',
  ctr: 'Taux de clic (CTR)',
  cpc: 'Cout par clic (CPC)',
  reach: 'Portee',
  saves: 'Sauvegardes',
  engagementRate: "Taux d'engagement",
  retweets: 'Retweets',
  replies: 'Reponses',
  reactions: 'Reactions',
  views: 'Vues',
  avgWatchTime: 'Duree moyenne de visionnage',
  completionRate: 'Taux de completion',
  thumbnailCtr: 'CTR miniature',
  retentionRate: 'Taux de retention',
  uniqueVisitors: 'Visiteurs uniques',
  pageViews: 'Pages vues',
  avgTimeOnPage: 'Temps moyen sur page',
  bounceRate: 'Taux de rebond',
  rankedKeywords: 'Mots-cles positionnes',
  backlinks: 'Backlinks',
  sent: 'Emails envoyes',
  opened: 'Emails ouverts',
  clicked: 'Emails cliques',
  openRate: "Taux d'ouverture",
  clickRate: 'Taux de clic',
  unsubscribes: 'Desabonnements',
  // Legacy fields
  engagement: 'Engagement (likes, commentaires, partages)',
  conversions: 'Conversions'
};

// Known non-metric fields to exclude when building metrics text
const NON_METRIC_FIELDS = ['platform', 'contentType', 'period', 'sector', 'rawStats'];

function buildPrompt(metricsData) {
  let metricsText;

  if (metricsData.rawStats) {
    metricsText = `Donnees brutes collees par l'utilisateur :\n${metricsData.rawStats}`;
  } else {
    // Dynamically build metrics from all provided fields
    const lines = [];
    for (const [key, value] of Object.entries(metricsData)) {
      if (NON_METRIC_FIELDS.includes(key)) continue;
      if (!value || (typeof value === 'string' && !value.trim())) continue;
      const label = METRIC_LABELS[key] || key;
      lines.push(`- ${label} : ${value}`);
    }

    metricsText = lines.length > 0
      ? `Metriques structurees :\n${lines.join('\n')}`
      : 'Aucune metrique fournie';
  }

  return `Tu es un data analyst specialise en marketing digital avec 10 ans d'experience. Tu excelles a diagnostiquer les performances de contenu et a formuler des recommandations actionnables.

CONTEXTE :
Plateforme : ${metricsData.platform || 'Non precise'}
Type de contenu : ${metricsData.contentType || 'Non precise'}
Periode : ${metricsData.period || 'Non precise'}
Secteur : ${metricsData.sector || 'Non precise'}

${metricsText}

---

MISSION : Analyse ces metriques et fournis un diagnostic complet.

1. **Score de performance** : note globale de 0 a 100 avec justification
2. **Diagnostic** : pourquoi ca a marche ou pas (analyse causale)
3. **Patterns detectes** : tendances dans les donnees
4. **Recommandations** : actions concretes pour ameliorer les performances
5. **Predictions** : estimation de l'impact si les recommandations sont appliquees
6. **Benchmark** : comparaison avec les moyennes du secteur

REGLES :
1. Sois precis et factuel, pas vague
2. Les recommandations doivent etre actionnables immediatement
3. Si des donnees manquent, indique-le et fais des hypotheses raisonnables
4. Utilise des pourcentages et des chiffres quand possible
5. Adapte l'analyse a la plateforme mentionnee et a ses KPIs specifiques

Reponds en JSON :

{
  "score": {
    "value": 0,
    "label": "Faible" | "Moyen" | "Bon" | "Excellent",
    "justification": ""
  },
  "diagnostic": {
    "summary": "",
    "positivePoints": [],
    "negativePoints": [],
    "rootCauses": []
  },
  "patterns": [
    {
      "title": "",
      "description": "",
      "impact": "positif" | "negatif" | "neutre"
    }
  ],
  "recommendations": [
    {
      "title": "",
      "description": "",
      "priority": "haute" | "moyenne" | "basse",
      "estimatedImpact": "",
      "effort": "faible" | "moyen" | "eleve"
    }
  ],
  "predictions": {
    "optimistic": "",
    "realistic": "",
    "pessimistic": ""
  },
  "benchmark": {
    "comparison": "",
    "aboveAverage": [],
    "belowAverage": []
  },
  "nextSteps": []
}

"nextSteps" est une liste ordonnee de 3-5 actions immediates a entreprendre.`;
}

module.exports = { buildPrompt };
