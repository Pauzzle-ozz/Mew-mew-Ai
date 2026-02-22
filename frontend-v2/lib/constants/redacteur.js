/**
 * Constantes pour le Redacteur Multi-Format
 */

export const TONE_OPTIONS = [
  'Professionnel',
  'Decontracte',
  'Inspirant',
  'Humoristique',
  'Educatif',
  'Provocateur',
  'Empathique',
  'Autoritaire',
  'Storytelling',
  'Luxe',
  'Technique',
  'Conversationnel',
  'Urgence'
]

export const OBJECTIVE_SUGGESTIONS = [
  'Generer des leads',
  'Augmenter la notoriete',
  'Fideliser ma communaute',
  'Lancer un produit',
  'Recruter des talents',
  'Eduquer mon audience'
]

export const BRIEF_TEMPLATES = [
  {
    id: 'lancement',
    label: 'Lancement produit',
    emoji: '🚀',
    subject: 'Lancement de notre nouveau produit',
    tone: 'Inspirant',
    targetAudience: 'Clients existants et prospects interesses par notre secteur',
    objective: 'Generer du buzz et des pre-commandes',
    keywords: '',
    context: 'Nous lancons un nouveau produit innovant sur le marche francais. Date de lancement prevue dans 2 semaines.'
  },
  {
    id: 'evenement',
    label: 'Evenement',
    emoji: '🎪',
    subject: 'Promotion de notre evenement',
    tone: 'Decontracte',
    targetAudience: 'Professionnels du secteur et communaute locale',
    objective: 'Remplir les inscriptions et creer de l\'anticipation',
    keywords: '',
    context: 'Nous organisons un evenement (conference, atelier, meetup) ouvert a tous.'
  },
  {
    id: 'promo',
    label: 'Promotion / Soldes',
    emoji: '🏷️',
    subject: 'Offre speciale limitee',
    tone: 'Urgence',
    targetAudience: 'Clients existants et visiteurs du site',
    objective: 'Booster les ventes pendant la periode promotionnelle',
    keywords: '',
    context: 'Promotion exceptionnelle de -30% sur une selection de produits/services, duree limitee.'
  },
  {
    id: 'recrutement',
    label: 'Recrutement',
    emoji: '👥',
    subject: 'Nous recrutons !',
    tone: 'Professionnel',
    targetAudience: 'Candidats qualifies et passionnes par notre secteur',
    objective: 'Attirer des candidatures qualifiees',
    keywords: '',
    context: 'Nous cherchons a agrandir notre equipe avec des profils motives et talentueux.'
  },
  {
    id: 'behind',
    label: 'Behind the scenes',
    emoji: '🎬',
    subject: 'Les coulisses de notre entreprise',
    tone: 'Decontracte',
    targetAudience: 'Notre communaute et followers fideles',
    objective: 'Humaniser la marque et renforcer le lien avec la communaute',
    keywords: '',
    context: 'Montrer le quotidien de notre equipe, nos valeurs et notre facon de travailler.'
  },
  {
    id: 'temoignage',
    label: 'Temoignage client',
    emoji: '⭐',
    subject: 'Retour d\'experience de notre client',
    tone: 'Empathique',
    targetAudience: 'Prospects en phase de decision et clients hesitants',
    objective: 'Rassurer les prospects avec une preuve sociale',
    keywords: '',
    context: 'Un de nos clients partage son experience positive avec notre produit/service.'
  }
]

export const PLATFORM_LIMITS = {
  linkedin: { max: 1300, unit: 'caracteres' },
  instagram: { max: 2200, unit: 'caracteres' },
  twitter: { max: 280, unit: 'caracteres' },
  blog: { max: 1200, unit: 'mots' },
  video_script: { max: 60, unit: 'secondes' },
  newsletter: { max: 700, unit: 'mots' }
}

export const PLATFORM_TIPS = {
  linkedin: {
    subject: 'LinkedIn privilegie le storytelling professionnel, les retours d\'experience et les conseils actionnables.',
    tone: 'Un ton professionnel mais authentique fonctionne mieux. Evitez le trop corporate.',
    audience: 'Preciser le secteur et le niveau hierarchique aide l\'IA a adapter le registre.',
    objective: 'Les posts LinkedIn performent bien pour le thought leadership et la generation de leads B2B.'
  },
  instagram: {
    subject: 'Instagram privilegie l\'emotion, le visuel et les histoires personnelles. Pensez a decrire l\'univers visuel.',
    tone: 'Un ton casual et authentique performe mieux. Les emojis sont les bienvenus.',
    audience: 'L\'age et les centres d\'interet sont cles sur Instagram.',
    objective: 'Instagram excelle pour la notoriete de marque et l\'engagement communautaire.'
  },
  twitter: {
    subject: 'Twitter/X favorise les prises de position tranchees, les threads educatifs et l\'actualite.',
    tone: 'Soyez direct et percutant. Chaque mot compte dans 280 caracteres.',
    audience: 'Twitter touche des early adopters, journalistes et professionnels tech.',
    objective: 'Twitter est ideal pour le buzz, le thought leadership rapide et les debats.'
  },
  blog: {
    subject: 'Un article de blog SEO doit cibler un mot-cle precis. Pensez a la requete que taperait votre audience.',
    tone: 'Le blog permet un ton plus approfondi et educatif. Structurez bien avec des sous-titres.',
    audience: 'Pensez a l\'intention de recherche : informationnelle, transactionnelle, navigationnelle ?',
    objective: 'Le blog genere du trafic organique durable et positionne votre expertise.'
  },
  video_script: {
    subject: 'Le script video doit accrocher en 3 secondes. Pensez "scroll stopper".',
    tone: 'Langage oral et dynamique. Comme si vous parliez a un ami.',
    audience: 'Les Reels/TikTok touchent surtout les 18-35 ans. Adaptez le langage.',
    objective: 'La video courte est parfaite pour la viralite et la decouverte de marque.'
  },
  newsletter: {
    subject: 'L\'objet de l\'email est crucial : il determine le taux d\'ouverture. Soyez intrigant en 50 caracteres.',
    tone: 'La newsletter doit etre personnelle et directe, comme un email a un ami.',
    audience: 'Vos abonnes vous connaissent deja. Adaptez le niveau de familiarite.',
    objective: 'La newsletter fidélise et convertit. Chaque email doit apporter de la valeur.'
  }
}
