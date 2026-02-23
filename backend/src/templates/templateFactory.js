/**
 * Factory de templates HTML pour les CV (ancien système)
 * Redirige vers cvBuilderFactory pour le design unifié
 */
const cvBuilderFactory = require('./cvBuilderFactory');

class TemplateFactory {
  /**
   * Obtenir le HTML d'un template
   * Tous les anciens templates redirigent vers le nouveau design classique ATS
   */
  getTemplate(template, cvData) {
    console.log(`📄 [TemplateFactory] Génération template: ${template} (redirigé vers classique ATS)`);
    return cvBuilderFactory.generate(cvData, { shape: 'classique', style: 'ardoise', blockStyles: {} });
  }

  getTemplateColor(template) {
    return '1a1a1a';
  }
}

module.exports = new TemplateFactory();
