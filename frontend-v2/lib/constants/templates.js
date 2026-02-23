/**
 * Configuration des templates CV (ancien système, conservé pour compatibilité)
 */

export const CV_TEMPLATES = [
  {
    id: 'classique',
    nom: 'Classique ATS',
    description: 'Design professionnel optimisé pour les systèmes de recrutement (ATS)',
    couleur: '#1a1a1a',
    icone: '📄',
    secteurs: ['Tous secteurs']
  },
];

export function getTemplateById(id) {
  return CV_TEMPLATES[0];
}
