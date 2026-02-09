/**
 * Factory de templates HTML pour les CV
 * Centralise la génération de HTML selon le template choisi
 */
class TemplateFactory {
  /**
   * Obtenir le HTML d'un template
   */
getTemplate(template, cvData) {
    console.log(`📄 [TemplateFactory] Génération template: ${template}`);

    switch (template) {
      case 'moderne':
        return this.generateModerne(cvData);
      case 'classique':
        return this.generateClassique(cvData);
      case 'creatif':
        return this.generateCreatif(cvData);
      case 'tech':
        return this.generateTech(cvData);
      case 'executive':
        return this.generateExecutive(cvData);
      case 'minimal':
        return this.generateMinimal(cvData);
      default:
        return this.generateModerne(cvData);
    }
  }

/**
   * Obtenir la couleur du template
   */
  getTemplateColor(template) {
    const colors = {
      'moderne': '667eea',
      'classique': '2c3e50',
      'creatif': 'f5576c',
      'tech': '10b981',
      'executive': '1c1c1c',
      'minimal': '000000'
    };
    return colors[template] || '2c3e50';
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
   * Template Moderne 2026 - Clean & Épuré (Inspiration: Notion, Linear)
   * ATS Optimized, design minimaliste avec accent bleu ciel
   */
  generateModerne(cvData) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
            font-size: 10pt;
            line-height: 1.5;
            color: #111827;
            background: white;
            -webkit-font-smoothing: antialiased;
          }
          .container {
            max-width: 210mm;
            margin: 0 auto;
            padding: 20mm 22mm;
          }

          /* Header - Style carte d'identité moderne */
          .header {
            margin-bottom: 16pt;
            padding: 14pt 16pt;
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            border-radius: 8pt;
            border-left: 4pt solid #0ea5e9;
          }
          .name {
            font-size: 24pt;
            font-weight: 700;
            color: #0c4a6e;
            margin-bottom: 4pt;
            letter-spacing: -0.5pt;
          }
          .title {
            font-size: 13pt;
            color: #0369a1;
            margin-bottom: 8pt;
            font-weight: 500;
          }
          .contact {
            font-size: 9pt;
            color: #475569;
            line-height: 1.6;
          }
          .contact span {
            margin-right: 12pt;
            white-space: nowrap;
          }

          /* Sections - Titres avec accent subtle */
          h2 {
            font-size: 12pt;
            color: #0c4a6e;
            font-weight: 600;
            margin-top: 14pt;
            margin-bottom: 8pt;
            padding-bottom: 4pt;
            border-bottom: 2pt solid #e0f2fe;
          }

          /* Resume - Encadré léger */
          .resume {
            font-size: 10pt;
            line-height: 1.6;
            color: #374151;
            margin-bottom: 10pt;
            padding: 10pt;
            background: #fafafa;
            border-radius: 4pt;
            border-left: 3pt solid #0ea5e9;
          }

          /* Experience - Cards légères */
          .experience-item {
            margin-bottom: 12pt;
            padding: 8pt 0;
            page-break-inside: avoid;
          }
          .experience-header {
            margin-bottom: 4pt;
          }
          .job-title {
            font-size: 11pt;
            font-weight: 600;
            color: #0c4a6e;
            margin-bottom: 2pt;
          }
          .company-line {
            font-size: 10pt;
            color: #64748b;
            margin-bottom: 2pt;
          }
          .company {
            font-weight: 500;
            color: #475569;
          }
          .period {
            font-size: 9pt;
            color: #94a3b8;
            font-weight: 400;
          }
          .description {
            font-size: 9.5pt;
            line-height: 1.5;
            color: #475569;
            margin-top: 4pt;
            white-space: pre-line;
          }

          /* Formation - Épurée */
          .formation-item {
            margin-bottom: 8pt;
            padding: 6pt 0;
            page-break-inside: avoid;
          }
          .diploma {
            font-size: 10.5pt;
            font-weight: 600;
            color: #0c4a6e;
            margin-bottom: 2pt;
          }
          .school-line {
            font-size: 9.5pt;
            color: #64748b;
          }

          /* Skills - Style badges */
          .skills {
            font-size: 10pt;
            line-height: 1.7;
            color: #374151;
          }
          .skill-category {
            margin-bottom: 6pt;
            padding: 6pt 10pt;
            background: #f8fafc;
            border-radius: 4pt;
          }
          .skill-label {
            font-weight: 600;
            color: #0369a1;
          }

          @page {
            size: A4;
            margin: 0;
          }
          @media print {
            body { background: white; }
          }
        </style>
      </head>
      <body>
        <div class="container">

          <!-- HEADER -->
          <div class="header">
            <div class="name">${cvData.prenom} ${cvData.nom}</div>
            <div class="title">${cvData.titre_poste || ''}</div>
            <div class="contact">
              ${cvData.email ? `<span>${cvData.email}</span>` : ''}
              ${cvData.telephone ? `<span>${cvData.telephone}</span>` : ''}
              ${cvData.adresse ? `<span>${cvData.adresse}</span>` : ''}
              ${cvData.linkedin ? `<span>${cvData.linkedin}</span>` : ''}
            </div>
          </div>

          <!-- RESUME -->
          ${cvData.resume ? `
            <h2>À propos</h2>
            <div class="resume">${cvData.resume}</div>
          ` : ''}

          <!-- EXPERIENCE -->
          ${cvData.experiences && cvData.experiences.length > 0 ? `
            <h2>Expérience professionnelle</h2>
            ${cvData.experiences.map(exp => `
              <div class="experience-item">
                <div class="experience-header">
                  <div class="job-title">${exp.poste}</div>
                  <div class="company-line">
                    <span class="company">${exp.entreprise}</span>${exp.localisation ? ` • ${exp.localisation}` : ''}
                    ${exp.date_debut || exp.date_fin ? ` • <span class="period">${exp.date_debut || ''}${exp.date_fin ? ` - ${exp.date_fin}` : ''}</span>` : ''}
                  </div>
                </div>
                ${exp.description ? `<div class="description">${exp.description}</div>` : ''}
              </div>
            `).join('')}
          ` : ''}

          <!-- FORMATION -->
          ${cvData.formations && cvData.formations.length > 0 ? `
            <h2>Formation</h2>
            ${cvData.formations.map(form => `
              <div class="formation-item">
                <div class="diploma">${form.diplome}</div>
                <div class="school-line">
                  ${form.etablissement || form.ecole || ''}${form.localisation ? ` • ${form.localisation}` : ''}
                  ${form.date_fin || form.annee ? ` • ${form.date_fin || form.annee}` : ''}
                </div>
              </div>
            `).join('')}
          ` : ''}

          <!-- COMPETENCES -->
          ${cvData.competences_techniques || cvData.competences_soft || cvData.langues ? `
            <h2>Compétences</h2>
            <div class="skills">
              ${cvData.competences_techniques ? `
                <div class="skill-category">
                  <span class="skill-label">Compétences techniques</span> · ${cvData.competences_techniques}
                </div>
              ` : ''}
              ${cvData.competences_soft ? `
                <div class="skill-category">
                  <span class="skill-label">Compétences relationnelles</span> · ${cvData.competences_soft}
                </div>
              ` : ''}
              ${cvData.langues ? `
                <div class="skill-category">
                  <span class="skill-label">Langues</span> · ${cvData.langues}
                </div>
              ` : ''}
            </div>
          ` : ''}

        </div>
      </body>
      </html>
    `;
  }

 /**
   * Template Classique 2026 - Professionnel Sobre (Inspiration: Swiss Design)
   * ATS Optimized, élégance intemporelle avec sérif moderne
   */
  generateClassique(cvData) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Georgia', 'Crimson Text', serif;
            font-size: 10.5pt;
            line-height: 1.5;
            color: #1a1a1a;
            background: white;
            -webkit-font-smoothing: antialiased;
          }
          .container {
            max-width: 210mm;
            margin: 0 auto;
            padding: 22mm 24mm;
          }

          /* Header - Centré et élégant */
          .header {
            text-align: center;
            margin-bottom: 18pt;
            padding-bottom: 10pt;
            border-bottom: 1pt solid #2c2c2c;
          }
          .name {
            font-size: 26pt;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 6pt;
            letter-spacing: 2pt;
          }
          .title {
            font-size: 13pt;
            color: #4a4a4a;
            margin-bottom: 8pt;
            font-style: italic;
            font-weight: 400;
          }
          .contact {
            font-size: 9.5pt;
            color: #666;
            line-height: 1.6;
            font-family: -apple-system, sans-serif;
          }
          .contact span {
            margin: 0 10pt;
          }

          /* Sections - Titres élégants */
          h2 {
            font-size: 12pt;
            color: #1a1a1a;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 2pt;
            margin-top: 16pt;
            margin-bottom: 10pt;
            padding-bottom: 4pt;
            border-bottom: 0.5pt solid #2c2c2c;
          }

          /* Resume */
          .resume {
            font-size: 10.5pt;
            line-height: 1.7;
            color: #2c2c2c;
            margin-bottom: 12pt;
            text-align: justify;
          }

          /* Experience */
          .experience-item {
            margin-bottom: 12pt;
            padding-bottom: 8pt;
            border-bottom: 0.5pt solid #e5e5e5;
            page-break-inside: avoid;
          }
          .experience-item:last-child {
            border-bottom: none;
          }
          .job-title {
            font-size: 11.5pt;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 3pt;
          }
          .company-line {
            font-size: 10pt;
            color: #666;
            margin-bottom: 4pt;
            font-family: -apple-system, sans-serif;
          }
          .company {
            font-weight: 500;
            color: #4a4a4a;
          }
          .period {
            color: #888;
            font-style: italic;
          }
          .description {
            font-size: 10pt;
            line-height: 1.6;
            color: #3a3a3a;
            margin-top: 4pt;
            white-space: pre-line;
          }

          /* Formation */
          .formation-item {
            margin-bottom: 10pt;
            page-break-inside: avoid;
          }
          .diploma {
            font-size: 11pt;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 2pt;
          }
          .school-line {
            font-size: 10pt;
            color: #666;
            font-family: -apple-system, sans-serif;
          }

          /* Skills */
          .skills {
            font-size: 10pt;
            line-height: 1.7;
            color: #2c2c2c;
            font-family: -apple-system, sans-serif;
          }
          .skill-category {
            margin-bottom: 6pt;
          }
          .skill-label {
            font-weight: 600;
            color: #1a1a1a;
          }

          @page {
            size: A4;
            margin: 0;
          }
          @media print {
            body { background: white; }
          }
        </style>
      </head>
      <body>
        <div class="container">

          <!-- HEADER -->
          <div class="header">
            <div class="name">${cvData.prenom} ${cvData.nom}</div>
            <div class="title">${cvData.titre_poste || ''}</div>
            <div class="contact">
              ${cvData.email ? `<span>${cvData.email}</span>` : ''}
              ${cvData.telephone ? `<span>•</span><span>${cvData.telephone}</span>` : ''}
              ${cvData.adresse ? `<span>•</span><span>${cvData.adresse}</span>` : ''}
              ${cvData.linkedin ? `<span>•</span><span>${cvData.linkedin}</span>` : ''}
            </div>
          </div>

          <!-- RESUME -->
          ${cvData.resume ? `
            <h2>Profil</h2>
            <div class="resume">${cvData.resume}</div>
          ` : ''}

          <!-- EXPERIENCE -->
          ${cvData.experiences && cvData.experiences.length > 0 ? `
            <h2>Expérience</h2>
            ${cvData.experiences.map(exp => `
              <div class="experience-item">
                <div class="job-title">${exp.poste}</div>
                <div class="company-line">
                  <span class="company">${exp.entreprise}</span>${exp.localisation ? ` · ${exp.localisation}` : ''}
                  ${exp.date_debut || exp.date_fin ? ` · <span class="period">${exp.date_debut || ''}${exp.date_fin ? ` – ${exp.date_fin}` : ''}</span>` : ''}
                </div>
                ${exp.description ? `<div class="description">${exp.description}</div>` : ''}
              </div>
            `).join('')}
          ` : ''}

          <!-- FORMATION -->
          ${cvData.formations && cvData.formations.length > 0 ? `
            <h2>Formation</h2>
            ${cvData.formations.map(form => `
              <div class="formation-item">
                <div class="diploma">${form.diplome}</div>
                <div class="school-line">
                  ${form.etablissement || form.ecole || ''}${form.localisation ? ` · ${form.localisation}` : ''}
                  ${form.date_fin || form.annee ? ` · ${form.date_fin || form.annee}` : ''}
                </div>
              </div>
            `).join('')}
          ` : ''}

          <!-- COMPETENCES -->
          ${cvData.competences_techniques || cvData.competences_soft || cvData.langues ? `
            <h2>Compétences</h2>
            <div class="skills">
              ${cvData.competences_techniques ? `
                <div class="skill-category">
                  <span class="skill-label">Techniques</span> · ${cvData.competences_techniques}
                </div>
              ` : ''}
              ${cvData.competences_soft ? `
                <div class="skill-category">
                  <span class="skill-label">Relationnelles</span> · ${cvData.competences_soft}
                </div>
              ` : ''}
              ${cvData.langues ? `
                <div class="skill-category">
                  <span class="skill-label">Langues</span> · ${cvData.langues}
                </div>
              ` : ''}
            </div>
          ` : ''}

        </div>
      </body>
      </html>
    `;
  }

 /**
   * Template Créatif 2026 - Coloré & Dynamique (Inspiration: Dribbble, Behance)
   * ATS Optimized, design vibrant avec accents corail et violet
   */
  generateCreatif(cvData) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 10pt;
            line-height: 1.5;
            color: #1e1e2e;
            background: white;
            -webkit-font-smoothing: antialiased;
          }
          .container {
            max-width: 210mm;
            margin: 0 auto;
            padding: 18mm 20mm;
          }

          /* Header - Gradient moderne et vibrant */
          .header {
            margin-bottom: 14pt;
            padding: 16pt 18pt;
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 25%, #c44569 75%, #a855f7 100%);
            border-radius: 12pt;
            box-shadow: 0 4pt 12pt rgba(168, 85, 247, 0.15);
          }
          .name {
            font-size: 22pt;
            font-weight: 700;
            color: white;
            margin-bottom: 4pt;
            letter-spacing: -0.3pt;
          }
          .title {
            font-size: 12.5pt;
            color: rgba(255, 255, 255, 0.95);
            margin-bottom: 6pt;
            font-weight: 500;
          }
          .contact {
            font-size: 9pt;
            color: rgba(255, 255, 255, 0.9);
            line-height: 1.6;
          }
          .contact span {
            margin-right: 12pt;
          }

          /* Sections - Titres colorés */
          h2 {
            font-size: 11.5pt;
            color: #a855f7;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1pt;
            margin-top: 14pt;
            margin-bottom: 8pt;
            padding-bottom: 4pt;
            border-bottom: 2.5pt solid #fae8ff;
          }

          /* Resume - Encadré gradient subtle */
          .resume {
            font-size: 10pt;
            line-height: 1.6;
            color: #374151;
            margin-bottom: 10pt;
            padding: 12pt;
            background: linear-gradient(135deg, #fef3f2 0%, #fae8ff 100%);
            border-radius: 8pt;
            border-left: 4pt solid #ff6b6b;
          }

          /* Experience - Style moderne */
          .experience-item {
            margin-bottom: 12pt;
            padding: 10pt;
            background: #fafafa;
            border-radius: 6pt;
            border-left: 3pt solid #a855f7;
            page-break-inside: avoid;
          }
          .job-title {
            font-size: 11pt;
            font-weight: 600;
            color: #c026d3;
            margin-bottom: 3pt;
          }
          .company-line {
            font-size: 9.5pt;
            color: #64748b;
            margin-bottom: 4pt;
          }
          .company {
            font-weight: 500;
            color: #475569;
          }
          .period {
            font-size: 9pt;
            color: #94a3b8;
            font-weight: 400;
          }
          .description {
            font-size: 9.5pt;
            line-height: 1.5;
            color: #475569;
            margin-top: 4pt;
            white-space: pre-line;
          }

          /* Formation - Cards subtiles */
          .formation-item {
            margin-bottom: 8pt;
            padding: 8pt 10pt;
            background: #fafafa;
            border-radius: 6pt;
            border-left: 3pt solid #ff6b6b;
            page-break-inside: avoid;
          }
          .diploma {
            font-size: 10.5pt;
            font-weight: 600;
            color: #dc2626;
            margin-bottom: 2pt;
          }
          .school-line {
            font-size: 9.5pt;
            color: #64748b;
          }

          /* Skills - Style badges colorés */
          .skills {
            font-size: 10pt;
            line-height: 1.7;
            color: #374151;
          }
          .skill-category {
            margin-bottom: 6pt;
            padding: 8pt 12pt;
            background: linear-gradient(135deg, #fef3f2 0%, #fae8ff 100%);
            border-radius: 6pt;
            border-left: 3pt solid #a855f7;
          }
          .skill-label {
            font-weight: 600;
            color: #a855f7;
          }

          @page {
            size: A4;
            margin: 0;
          }
          @media print {
            body { background: white; }
            .header { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="container">

          <!-- HEADER -->
          <div class="header">
            <div class="name">${cvData.prenom} ${cvData.nom}</div>
            <div class="title">${cvData.titre_poste || ''}</div>
            <div class="contact">
              ${cvData.email ? `<span>${cvData.email}</span>` : ''}
              ${cvData.telephone ? `<span>${cvData.telephone}</span>` : ''}
              ${cvData.adresse ? `<span>${cvData.adresse}</span>` : ''}
              ${cvData.linkedin ? `<span>${cvData.linkedin}</span>` : ''}
            </div>
          </div>

          <!-- RESUME -->
          ${cvData.resume ? `
            <h2>À propos</h2>
            <div class="resume">${cvData.resume}</div>
          ` : ''}

          <!-- EXPERIENCE -->
          ${cvData.experiences && cvData.experiences.length > 0 ? `
            <h2>Expérience</h2>
            ${cvData.experiences.map(exp => `
              <div class="experience-item">
                <div class="job-title">${exp.poste}</div>
                <div class="company-line">
                  <span class="company">${exp.entreprise}</span>${exp.localisation ? ` · ${exp.localisation}` : ''}
                  ${exp.date_debut || exp.date_fin ? ` · <span class="period">${exp.date_debut || ''}${exp.date_fin ? ` – ${exp.date_fin}` : ''}</span>` : ''}
                </div>
                ${exp.description ? `<div class="description">${exp.description}</div>` : ''}
              </div>
            `).join('')}
          ` : ''}

          <!-- FORMATION -->
          ${cvData.formations && cvData.formations.length > 0 ? `
            <h2>Formation</h2>
            ${cvData.formations.map(form => `
              <div class="formation-item">
                <div class="diploma">${form.diplome}</div>
                <div class="school-line">
                  ${form.etablissement || form.ecole || ''}${form.localisation ? ` · ${form.localisation}` : ''}
                  ${form.date_fin || form.annee ? ` · ${form.date_fin || form.annee}` : ''}
                </div>
              </div>
            `).join('')}
          ` : ''}

          <!-- COMPETENCES -->
          ${cvData.competences_techniques || cvData.competences_soft || cvData.langues ? `
            <h2>Compétences</h2>
            <div class="skills">
              ${cvData.competences_techniques ? `
                <div class="skill-category">
                  <span class="skill-label">Techniques</span> · ${cvData.competences_techniques}
                </div>
              ` : ''}
              ${cvData.competences_soft ? `
                <div class="skill-category">
                  <span class="skill-label">Relationnelles</span> · ${cvData.competences_soft}
                </div>
              ` : ''}
              ${cvData.langues ? `
                <div class="skill-category">
                  <span class="skill-label">Langues</span> · ${cvData.langues}
                </div>
              ` : ''}
            </div>
          ` : ''}

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


/**
   * Template Tech 2026 - Développeur Moderne (Inspiration: GitHub, VS Code)
   * ATS Optimized, style épuré avec accents verts
   */
  generateTech(cvData) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
            font-size: 10pt;
            line-height: 1.5;
            color: #0d1117;
            background: white;
            -webkit-font-smoothing: antialiased;
          }
          .container {
            max-width: 210mm;
            margin: 0 auto;
            padding: 18mm 20mm;
          }

          /* Header - Style GitHub moderne */
          .header {
            margin-bottom: 16pt;
            padding: 14pt 16pt;
            background: #f6f8fa;
            border: 1pt solid #d0d7de;
            border-radius: 6pt;
            border-left: 4pt solid #2da44e;
          }
          .name {
            font-size: 20pt;
            font-weight: 600;
            color: #24292f;
            margin-bottom: 4pt;
            letter-spacing: -0.3pt;
          }
          .title {
            font-size: 12pt;
            color: #57606a;
            margin-bottom: 6pt;
            font-weight: 400;
            font-family: -apple-system, sans-serif;
          }
          .contact {
            font-size: 9pt;
            color: #656d76;
            line-height: 1.6;
            font-family: -apple-system, sans-serif;
          }
          .contact span {
            margin-right: 12pt;
          }

          /* Sections - Style code comments */
          h2 {
            font-size: 11pt;
            color: #2da44e;
            font-weight: 600;
            margin-top: 14pt;
            margin-bottom: 8pt;
            padding: 6pt 10pt;
            background: #f6f8fa;
            border-left: 3pt solid #2da44e;
            border-radius: 4pt;
          }
          h2::before {
            content: '// ';
            color: #656d76;
          }

          /* Resume */
          .resume {
            font-size: 10pt;
            line-height: 1.6;
            color: #3a3a3a;
            margin-bottom: 10pt;
            padding: 10pt 12pt;
            background: #ffffff;
            border: 1pt solid #d0d7de;
            border-radius: 6pt;
            font-family: -apple-system, sans-serif;
          }

          /* Experience - Style commits */
          .experience-item {
            margin-bottom: 12pt;
            padding: 10pt 12pt;
            background: #f6f8fa;
            border-radius: 6pt;
            border-left: 3pt solid #0969da;
            page-break-inside: avoid;
          }
          .job-title {
            font-size: 11pt;
            font-weight: 600;
            color: #0969da;
            margin-bottom: 3pt;
          }
          .company-line {
            font-size: 9.5pt;
            color: #656d76;
            margin-bottom: 4pt;
            font-family: -apple-system, sans-serif;
          }
          .company {
            font-weight: 500;
            color: #57606a;
          }
          .period {
            font-size: 9pt;
            color: #8b949e;
            font-weight: 400;
          }
          .description {
            font-size: 9.5pt;
            line-height: 1.5;
            color: #3a3a3a;
            margin-top: 4pt;
            white-space: pre-line;
            font-family: -apple-system, sans-serif;
          }

          /* Formation */
          .formation-item {
            margin-bottom: 8pt;
            padding: 8pt 10pt;
            background: #ffffff;
            border: 1pt solid #d0d7de;
            border-radius: 6pt;
            page-break-inside: avoid;
          }
          .diploma {
            font-size: 10.5pt;
            font-weight: 600;
            color: #24292f;
            margin-bottom: 2pt;
          }
          .school-line {
            font-size: 9.5pt;
            color: #656d76;
            font-family: -apple-system, sans-serif;
          }

          /* Skills - Style badges GitHub */
          .skills {
            font-size: 10pt;
            line-height: 1.7;
            color: #3a3a3a;
            font-family: -apple-system, sans-serif;
          }
          .skill-category {
            margin-bottom: 6pt;
            padding: 8pt 10pt;
            background: #dafbe1;
            border-radius: 6pt;
            border: 1pt solid #2da44e;
          }
          .skill-label {
            font-weight: 600;
            color: #1a7f37;
          }

          @page {
            size: A4;
            margin: 0;
          }
          @media print {
            body { background: white; }
          }
        </style>
      </head>
      <body>
        <div class="container">

          <!-- HEADER -->
          <div class="header">
            <div class="name">${cvData.prenom} ${cvData.nom}</div>
            <div class="title">${cvData.titre_poste || ''}</div>
            <div class="contact">
              ${cvData.email ? `<span>${cvData.email}</span>` : ''}
              ${cvData.telephone ? `<span>${cvData.telephone}</span>` : ''}
              ${cvData.adresse ? `<span>${cvData.adresse}</span>` : ''}
              ${cvData.linkedin ? `<span>${cvData.linkedin}</span>` : ''}
            </div>
          </div>

          <!-- RESUME -->
          ${cvData.resume ? `
            <h2>About</h2>
            <div class="resume">${cvData.resume}</div>
          ` : ''}

          <!-- EXPERIENCE -->
          ${cvData.experiences && cvData.experiences.length > 0 ? `
            <h2>Experience</h2>
            ${cvData.experiences.map(exp => `
              <div class="experience-item">
                <div class="job-title">${exp.poste}</div>
                <div class="company-line">
                  <span class="company">${exp.entreprise}</span>${exp.localisation ? ` · ${exp.localisation}` : ''}
                  ${exp.date_debut || exp.date_fin ? ` · <span class="period">${exp.date_debut || ''}${exp.date_fin ? ` – ${exp.date_fin}` : ''}</span>` : ''}
                </div>
                ${exp.description ? `<div class="description">${exp.description}</div>` : ''}
              </div>
            `).join('')}
          ` : ''}

          <!-- FORMATION -->
          ${cvData.formations && cvData.formations.length > 0 ? `
            <h2>Education</h2>
            ${cvData.formations.map(form => `
              <div class="formation-item">
                <div class="diploma">${form.diplome}</div>
                <div class="school-line">
                  ${form.etablissement || form.ecole || ''}${form.localisation ? ` · ${form.localisation}` : ''}
                  ${form.date_fin || form.annee ? ` · ${form.date_fin || form.annee}` : ''}
                </div>
              </div>
            `).join('')}
          ` : ''}

          <!-- COMPETENCES -->
          ${cvData.competences_techniques || cvData.competences_soft || cvData.langues ? `
            <h2>Skills</h2>
            <div class="skills">
              ${cvData.competences_techniques ? `
                <div class="skill-category">
                  <span class="skill-label">Technical Skills</span> · ${cvData.competences_techniques}
                </div>
              ` : ''}
              ${cvData.competences_soft ? `
                <div class="skill-category">
                  <span class="skill-label">Soft Skills</span> · ${cvData.competences_soft}
                </div>
              ` : ''}
              ${cvData.langues ? `
                <div class="skill-category">
                  <span class="skill-label">Languages</span> · ${cvData.langues}
                </div>
              ` : ''}
            </div>
          ` : ''}

        </div>
      </body>
      </html>
    `;
  }

/**
   * Template Executive 2026 - Luxury & Premium (Inspiration: Swiss Design, Luxury Brands)
   * ATS Optimized, élégance raffinée pour cadres et C-level
   */
  generateExecutive(cvData) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Playfair Display', 'Georgia', serif;
            font-size: 10.5pt;
            line-height: 1.5;
            color: #1a1a1a;
            background: white;
            -webkit-font-smoothing: antialiased;
          }
          .container {
            max-width: 210mm;
            margin: 0 auto;
            padding: 24mm 26mm;
          }

          /* Header - Élégance premium */
          .header {
            margin-bottom: 20pt;
            padding-bottom: 12pt;
            border-bottom: 2pt solid #1a1a1a;
            border-top: 0.5pt solid #1a1a1a;
            padding-top: 12pt;
          }
          .name {
            font-size: 28pt;
            font-weight: 700;
            color: #0a0a0a;
            margin-bottom: 6pt;
            letter-spacing: 3pt;
            text-align: center;
          }
          .title {
            font-size: 14pt;
            color: #3a3a3a;
            margin-bottom: 10pt;
            font-style: italic;
            font-weight: 400;
            text-align: center;
          }
          .contact {
            font-size: 9.5pt;
            color: #666;
            line-height: 1.7;
            text-align: center;
            font-family: -apple-system, sans-serif;
          }
          .contact span {
            margin: 0 12pt;
          }

          /* Sections - Titres raffinés */
          h2 {
            font-size: 13pt;
            color: #0a0a0a;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 3pt;
            margin-top: 18pt;
            margin-bottom: 10pt;
            padding-bottom: 4pt;
            border-bottom: 1.5pt solid #1a1a1a;
            text-align: left;
          }

          /* Resume - Style quote */
          .resume {
            font-size: 11pt;
            line-height: 1.7;
            color: #2c2c2c;
            margin-bottom: 14pt;
            padding: 12pt 16pt;
            border-left: 3pt solid #0a0a0a;
            font-style: italic;
          }

          /* Experience - Épuré et structuré */
          .experience-item {
            margin-bottom: 14pt;
            padding-bottom: 10pt;
            border-bottom: 0.5pt solid #d0d0d0;
            page-break-inside: avoid;
          }
          .experience-item:last-child {
            border-bottom: none;
          }
          .job-title {
            font-size: 12pt;
            font-weight: 700;
            color: #0a0a0a;
            margin-bottom: 4pt;
          }
          .company-line {
            font-size: 10.5pt;
            color: #555;
            margin-bottom: 6pt;
            font-family: -apple-system, sans-serif;
          }
          .company {
            font-weight: 600;
            color: #3a3a3a;
            font-style: italic;
          }
          .period {
            font-size: 10pt;
            color: #888;
            font-weight: 400;
          }
          .description {
            font-size: 10pt;
            line-height: 1.6;
            color: #3a3a3a;
            margin-top: 6pt;
            white-space: pre-line;
            font-family: -apple-system, sans-serif;
            text-align: justify;
          }

          /* Formation */
          .formation-item {
            margin-bottom: 10pt;
            page-break-inside: avoid;
          }
          .diploma {
            font-size: 11pt;
            font-weight: 700;
            color: #0a0a0a;
            margin-bottom: 3pt;
          }
          .school-line {
            font-size: 10pt;
            color: #555;
            font-family: -apple-system, sans-serif;
            font-style: italic;
          }

          /* Skills */
          .skills {
            font-size: 10.5pt;
            line-height: 1.8;
            color: #2c2c2c;
            font-family: -apple-system, sans-serif;
          }
          .skill-category {
            margin-bottom: 6pt;
            padding-left: 8pt;
          }
          .skill-label {
            font-weight: 700;
            color: #0a0a0a;
            text-transform: uppercase;
            font-size: 9.5pt;
            letter-spacing: 1pt;
          }
          .skill-label::after {
            content: ' —';
            color: #888;
          }

          @page {
            size: A4;
            margin: 0;
          }
          @media print {
            body { background: white; }
          }
        </style>
      </head>
      <body>
        <div class="container">

          <!-- HEADER -->
          <div class="header">
            <div class="name">${cvData.prenom} ${cvData.nom}</div>
            <div class="title">${cvData.titre_poste || ''}</div>
            <div class="contact">
              ${cvData.email ? `<span>${cvData.email}</span>` : ''}
              ${cvData.telephone ? `<span>${cvData.telephone}</span>` : ''}
              ${cvData.adresse ? `<span>${cvData.adresse}</span>` : ''}
              ${cvData.linkedin ? `<span>${cvData.linkedin}</span>` : ''}
            </div>
          </div>

          <!-- RESUME -->
          ${cvData.resume ? `
            <h2>Executive Summary</h2>
            <div class="resume">${cvData.resume}</div>
          ` : ''}

          <!-- EXPERIENCE -->
          ${cvData.experiences && cvData.experiences.length > 0 ? `
            <h2>Professional Experience</h2>
            ${cvData.experiences.map(exp => `
              <div class="experience-item">
                <div class="job-title">${exp.poste}</div>
                <div class="company-line">
                  <span class="company">${exp.entreprise}</span>${exp.localisation ? ` · ${exp.localisation}` : ''}
                  ${exp.date_debut || exp.date_fin ? ` · <span class="period">${exp.date_debut || ''}${exp.date_fin ? ` – ${exp.date_fin}` : ''}</span>` : ''}
                </div>
                ${exp.description ? `<div class="description">${exp.description}</div>` : ''}
              </div>
            `).join('')}
          ` : ''}

          <!-- FORMATION -->
          ${cvData.formations && cvData.formations.length > 0 ? `
            <h2>Education</h2>
            ${cvData.formations.map(form => `
              <div class="formation-item">
                <div class="diploma">${form.diplome}</div>
                <div class="school-line">
                  ${form.etablissement || form.ecole || ''}${form.localisation ? ` · ${form.localisation}` : ''}
                  ${form.date_fin || form.annee ? ` · ${form.date_fin || form.annee}` : ''}
                </div>
              </div>
            `).join('')}
          ` : ''}

          <!-- COMPETENCES -->
          ${cvData.competences_techniques || cvData.competences_soft || cvData.langues ? `
            <h2>Core Competencies</h2>
            <div class="skills">
              ${cvData.competences_techniques ? `
                <div class="skill-category">
                  <span class="skill-label">Technical Expertise</span> ${cvData.competences_techniques}
                </div>
              ` : ''}
              ${cvData.competences_soft ? `
                <div class="skill-category">
                  <span class="skill-label">Leadership</span> ${cvData.competences_soft}
                </div>
              ` : ''}
              ${cvData.langues ? `
                <div class="skill-category">
                  <span class="skill-label">Languages</span> ${cvData.langues}
                </div>
              ` : ''}
            </div>
          ` : ''}

        </div>
      </body>
      </html>
    `;
  }

/**
   * Template Minimal 2026 - Ultra Épuré (Inspiration: Apple, Stripe, Airbnb)
   * ATS Optimized, design minimaliste absolu pour UX/UI, architecture
   */
  generateMinimal(cvData) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
            font-size: 10pt;
            line-height: 1.6;
            color: #0a0a0a;
            background: white;
            -webkit-font-smoothing: antialiased;
            font-weight: 400;
          }
          .container {
            max-width: 210mm;
            margin: 0 auto;
            padding: 25mm 28mm;
          }

          /* Header - Ultra clean */
          .header {
            margin-bottom: 20pt;
          }
          .name {
            font-size: 32pt;
            font-weight: 300;
            color: #000;
            margin-bottom: 6pt;
            letter-spacing: -1pt;
          }
          .title {
            font-size: 13pt;
            color: #666;
            margin-bottom: 10pt;
            font-weight: 400;
          }
          .contact {
            font-size: 9pt;
            color: #999;
            line-height: 1.8;
            margin-top: 8pt;
          }
          .contact span {
            margin-right: 14pt;
          }

          /* Sections - Minimaliste absolu */
          h2 {
            font-size: 10pt;
            color: #0a0a0a;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 2pt;
            margin-top: 16pt;
            margin-bottom: 10pt;
          }

          /* Resume - Simple */
          .resume {
            font-size: 10pt;
            line-height: 1.7;
            color: #3a3a3a;
            margin-bottom: 12pt;
          }

          /* Experience - Spacing parfait */
          .experience-item {
            margin-bottom: 14pt;
            page-break-inside: avoid;
          }
          .job-title {
            font-size: 11pt;
            font-weight: 500;
            color: #0a0a0a;
            margin-bottom: 3pt;
          }
          .company-line {
            font-size: 10pt;
            color: #666;
            margin-bottom: 4pt;
          }
          .company {
            font-weight: 400;
          }
          .period {
            font-size: 9.5pt;
            color: #999;
            font-weight: 400;
          }
          .description {
            font-size: 9.5pt;
            line-height: 1.6;
            color: #4a4a4a;
            margin-top: 4pt;
            white-space: pre-line;
          }

          /* Formation */
          .formation-item {
            margin-bottom: 10pt;
            page-break-inside: avoid;
          }
          .diploma {
            font-size: 10.5pt;
            font-weight: 500;
            color: #0a0a0a;
            margin-bottom: 2pt;
          }
          .school-line {
            font-size: 10pt;
            color: #666;
          }

          /* Skills */
          .skills {
            font-size: 10pt;
            line-height: 1.8;
            color: #3a3a3a;
          }
          .skill-category {
            margin-bottom: 6pt;
          }
          .skill-label {
            font-weight: 500;
            color: #0a0a0a;
          }

          @page {
            size: A4;
            margin: 0;
          }
          @media print {
            body { background: white; }
          }
        </style>
      </head>
      <body>
        <div class="container">

          <!-- HEADER -->
          <div class="header">
            <div class="name">${cvData.prenom} ${cvData.nom}</div>
            <div class="title">${cvData.titre_poste || ''}</div>
            <div class="contact">
              ${cvData.email ? `<span>${cvData.email}</span>` : ''}
              ${cvData.telephone ? `<span>${cvData.telephone}</span>` : ''}
              ${cvData.adresse ? `<span>${cvData.adresse}</span>` : ''}
              ${cvData.linkedin ? `<span>${cvData.linkedin}</span>` : ''}
            </div>
          </div>

          <!-- RESUME -->
          ${cvData.resume ? `
            <h2>About</h2>
            <div class="resume">${cvData.resume}</div>
          ` : ''}

          <!-- EXPERIENCE -->
          ${cvData.experiences && cvData.experiences.length > 0 ? `
            <h2>Experience</h2>
            ${cvData.experiences.map(exp => `
              <div class="experience-item">
                <div class="job-title">${exp.poste}</div>
                <div class="company-line">
                  <span class="company">${exp.entreprise}</span>${exp.localisation ? ` · ${exp.localisation}` : ''}
                  ${exp.date_debut || exp.date_fin ? ` · <span class="period">${exp.date_debut || ''}${exp.date_fin ? ` – ${exp.date_fin}` : ''}</span>` : ''}
                </div>
                ${exp.description ? `<div class="description">${exp.description}</div>` : ''}
              </div>
            `).join('')}
          ` : ''}

          <!-- FORMATION -->
          ${cvData.formations && cvData.formations.length > 0 ? `
            <h2>Education</h2>
            ${cvData.formations.map(form => `
              <div class="formation-item">
                <div class="diploma">${form.diplome}</div>
                <div class="school-line">
                  ${form.etablissement || form.ecole || ''}${form.localisation ? ` · ${form.localisation}` : ''}
                  ${form.date_fin || form.annee ? ` · ${form.date_fin || form.annee}` : ''}
                </div>
              </div>
            `).join('')}
          ` : ''}

          <!-- COMPETENCES -->
          ${cvData.competences_techniques || cvData.competences_soft || cvData.langues ? `
            <h2>Skills</h2>
            <div class="skills">
              ${cvData.competences_techniques ? `
                <div class="skill-category">
                  <span class="skill-label">Technical</span> · ${cvData.competences_techniques}
                </div>
              ` : ''}
              ${cvData.competences_soft ? `
                <div class="skill-category">
                  <span class="skill-label">Interpersonal</span> · ${cvData.competences_soft}
                </div>
              ` : ''}
              ${cvData.langues ? `
                <div class="skill-category">
                  <span class="skill-label">Languages</span> · ${cvData.langues}
                </div>
              ` : ''}
            </div>
          ` : ''}

        </div>
      </body>
      </html>
    `;
  }
}
module.exports = new TemplateFactory();
