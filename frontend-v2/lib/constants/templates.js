/**
 * Configuration des templates CV
 * Définit les templates disponibles avec leurs métadonnées
 */

export const CV_TEMPLATES = [
  {
    id: 'moderne',
    nom: 'Moderne',
    description: 'Design épuré et coloré, idéal pour les startups et métiers créatifs',
    couleur: '#667eea',
    icone: '🎨',
    secteurs: ['Tech', 'Marketing', 'Design', 'Startup']
  },
  {
    id: 'classique',
    nom: 'Classique',
    description: 'Format traditionnel et sobre, parfait pour les secteurs corporate',
    couleur: '#2c3e50',
    icone: '📄',
    secteurs: ['Finance', 'Juridique', 'Consulting', 'Corporate']
  },
  {
    id: 'creatif',
    nom: 'Créatif',
    description: 'Template audacieux avec touches de couleur, pour se démarquer',
    couleur: '#ec4899',
    icone: '✨',
    secteurs: ['Communication', 'Publicité', 'Art', 'Média']
  },
  {
    id: 'tech',
    nom: 'Tech',
    description: 'Style code/terminal pour développeurs et professionnels IT',
    couleur: '#10b981',
    icone: '💻',
    secteurs: ['Développement', 'DevOps', 'Data', 'Cybersécurité']
  },
  {
    id: 'executive',
    nom: 'Executive',
    description: 'Design élégant et professionnel pour managers et cadres supérieurs',
    couleur: '#1c1c1c',
    icone: '👔',
    secteurs: ['Management', 'Direction', 'C-Level', 'Conseil']
  },
  {
    id: 'minimal',
    nom: 'Minimal',
    description: 'Ultra épuré et moderne, focus sur le contenu sans distraction',
    couleur: '#64748b',
    icone: '⚡',
    secteurs: ['Architecture', 'Design', 'UX/UI', 'Product']
  }
];

/**
 * Récupérer un template par son ID
 */
export function getTemplateById(id) {
  return CV_TEMPLATES.find(template => template.id === id);
}