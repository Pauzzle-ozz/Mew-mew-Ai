/**
 * Constantes des templates de CV
 * Définition centralisée des templates disponibles
 */

export const templates = [
  {
    id: 'moderne',
    nom: 'Moderne',
    description: 'Design épuré et contemporain',
    couleur: 'from-blue-500 to-blue-600',
    icone: '🚀',
    secteurs: 'Tech, Startup, Digital'
  },
  {
    id: 'classique',
    nom: 'Classique',
    description: 'Professionnel et intemporel',
    couleur: 'from-gray-700 to-gray-900',
    icone: '💼',
    secteurs: 'Corporate, Banque, Juridique'
  },
  {
    id: 'creatif',
    nom: 'Créatif',
    description: 'Original et coloré',
    couleur: 'from-purple-500 to-pink-500',
    icone: '🎨',
    secteurs: 'Design, Marketing, Com'
  }
];

/**
 * Obtenir un template par son ID
 */
export function getTemplateById(id) {
  return templates.find(t => t.id === id);
}