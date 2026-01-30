/**
 * Factory de templates HTML pour les CV
 * Centralise la génération de HTML selon le template choisi
 */
class TemplateFactory {
  /**
   * Obtenir le HTML d'un template
   */
  getTemplate(templateId, cvData) {
    switch(templateId) {
      case 'moderne':
        return this.generateModerne(cvData);
      case 'classique':
        return this.generateClassique(cvData);
      case 'creatif':
        return this.generateCreatif(cvData);
      default:
        throw new Error('Template inconnu: ' + templateId);
    }
  }

  /**
   * Styles de base communs
   */
  getBaseStyles() {
    return `
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; font-size: 12px; line-height: 1.6; color: #333; }
        .container { padding: 40px; }
        h1 { font-size: 28px; margin-bottom: 5px; }
        h2 { font-size: 16px; margin-top: 20px; margin-bottom: 10px; border-bottom: 2px solid; padding-bottom: 5px; }
        h3 { font-size: 14px; margin-top: 10px; margin-bottom: 5px; }
        .contact-info { margin-bottom: 20px; font-size: 11px; }
        .contact-info span { margin-right: 15px; }
        .section { margin-bottom: 20px; }
        .experience-item, .formation-item { margin-bottom: 15px; }
        .period { color: #666; font-style: italic; font-size: 11px; }
        .company { font-weight: bold; }
      </style>
    `;
  }

  /**
   * Template Moderne
   */
  generateModerne(cvData) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        ${this.getBaseStyles()}
        <style>
          body { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
          .container { background: white; max-width: 800px; margin: 0 auto; }
          h1 { color: #667eea; }
          h2 { color: #667eea; border-bottom-color: #667eea; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; margin: -40px -40px 30px -40px; }
          .header h1, .header .contact-info { color: white; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${cvData.prenom} ${cvData.nom}</h1>
            <div style="font-size: 16px; margin-bottom: 10px;">${cvData.titre_poste || ''}</div>
            <div class="contact-info">
              ${cvData.email ? `<span>📧 ${cvData.email}</span>` : ''}
              ${cvData.telephone ? `<span>📱 ${cvData.telephone}</span>` : ''}
              ${cvData.adresse ? `<span>📍 ${cvData.adresse}</span>` : ''}
            </div>
          </div>

          ${cvData.resume ? `
            <div class="section">
              <h2>Profil</h2>
              <p>${cvData.resume}</p>
            </div>
          ` : ''}

          ${this.generateExperiences(cvData.experiences)}
          ${this.generateFormations(cvData.formations)}
          ${this.generateCompetences(cvData)}
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Template Classique
   */
  generateClassique(cvData) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        ${this.getBaseStyles()}
        <style>
          h1 { color: #2c3e50; text-transform: uppercase; letter-spacing: 2px; }
          h2 { color: #2c3e50; border-bottom-color: #2c3e50; text-transform: uppercase; font-size: 14px; }
          .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #2c3e50; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${cvData.prenom} ${cvData.nom}</h1>
            <div style="font-size: 14px; margin: 10px 0; color: #555;">${cvData.titre_poste || ''}</div>
            <div class="contact-info">
              ${cvData.email ? `<span>${cvData.email}</span>` : ''}
              ${cvData.telephone ? `<span>${cvData.telephone}</span>` : ''}
              ${cvData.adresse ? `<span>${cvData.adresse}</span>` : ''}
            </div>
          </div>

          ${cvData.resume ? `
            <div class="section">
              <h2>Profil Professionnel</h2>
              <p>${cvData.resume}</p>
            </div>
          ` : ''}

          ${this.generateExperiences(cvData.experiences)}
          ${this.generateFormations(cvData.formations)}
          ${this.generateCompetences(cvData)}
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Template Créatif
   */
  generateCreatif(cvData) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        ${this.getBaseStyles()}
        <style>
          body { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
          .container { background: white; }
          .sidebar { background: linear-gradient(180deg, #f093fb 0%, #f5576c 100%); color: white; padding: 40px 30px; width: 35%; float: left; min-height: 100vh; }
          .main-content { width: 65%; float: right; padding: 40px; }
          .sidebar h1 { color: white; font-size: 24px; }
          .sidebar h2 { color: white; border-bottom-color: white; font-size: 14px; }
          h2 { color: #f5576c; border-bottom-color: #f5576c; }
          .contact-info { color: white; }
        </style>
      </head>
      <body>
        <div class="container" style="overflow: hidden;">
          <div class="sidebar">
            <h1>${cvData.prenom}<br/>${cvData.nom}</h1>
            <div style="font-size: 14px; margin: 15px 0;">${cvData.titre_poste || ''}</div>
            
            <h2 style="margin-top: 30px;">Contact</h2>
            <div class="contact-info" style="font-size: 11px;">
              ${cvData.email ? `<div style="margin-bottom: 8px;">📧 ${cvData.email}</div>` : ''}
              ${cvData.telephone ? `<div style="margin-bottom: 8px;">📱 ${cvData.telephone}</div>` : ''}
              ${cvData.adresse ? `<div style="margin-bottom: 8px;">📍 ${cvData.adresse}</div>` : ''}
            </div>

            ${cvData.competences_techniques ? `
              <h2 style="margin-top: 30px;">Compétences</h2>
              <div style="font-size: 11px;">${cvData.competences_techniques}</div>
            ` : ''}
          </div>

          <div class="main-content">
            ${cvData.resume ? `
              <div class="section">
                <h2>À Propos</h2>
                <p>${cvData.resume}</p>
              </div>
            ` : ''}

            ${this.generateExperiences(cvData.experiences)}
            ${this.generateFormations(cvData.formations)}
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Générer les expériences
   */
  generateExperiences(experiences) {
    if (!experiences || experiences.length === 0) return '';

    return `
      <div class="section">
        <h2>Expérience Professionnelle</h2>
        ${experiences.map(exp => `
          <div class="experience-item">
            <h3>${exp.poste}</h3>
            <div><span class="company">${exp.entreprise}</span> ${exp.periode ? `<span class="period">• ${exp.periode}</span>` : ''}</div>
            ${exp.description ? `<p style="margin-top: 5px;">${exp.description}</p>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  /**
   * Générer les formations
   */
  generateFormations(formations) {
    if (!formations || formations.length === 0) return '';

    return `
      <div class="section">
        <h2>Formation</h2>
        ${formations.map(form => `
          <div class="formation-item">
            <h3>${form.diplome}</h3>
            <div><span class="company">${form.etablissement}</span> ${form.annee ? `<span class="period">• ${form.annee}</span>` : ''}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  /**
   * Générer les compétences
   */
  generateCompetences(cvData) {
    let html = '';

    if (cvData.competences_techniques) {
      html += `
        <div class="section">
          <h2>Compétences Techniques</h2>
          <p>${cvData.competences_techniques}</p>
        </div>
      `;
    }

    if (cvData.competences_soft) {
      html += `
        <div class="section">
          <h2>Compétences Personnelles</h2>
          <p>${cvData.competences_soft}</p>
        </div>
      `;
    }

    if (cvData.langues) {
      html += `
        <div class="section">
          <h2>Langues</h2>
          <p>${cvData.langues}</p>
        </div>
      `;
    }

    return html;
  }
}

module.exports = new TemplateFactory();
