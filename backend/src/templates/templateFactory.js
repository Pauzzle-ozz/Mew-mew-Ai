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
   * Template Moderne - ATS Optimized
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
            font-family: 'Calibri', 'Arial', sans-serif; 
            font-size: 10pt;
            line-height: 1.3;
            color: #1a1a1a;
            background: white;
          }
          .container { 
            max-width: 210mm;
            margin: 0 auto;
            padding: 15mm 20mm;
          }
          
          /* Header */
          .header { 
            margin-bottom: 8pt;
            border-bottom: 2pt solid #2563eb;
            padding-bottom: 6pt;
          }
          .name { 
            font-size: 18pt;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 2pt;
            text-transform: uppercase;
            letter-spacing: 0.5pt;
          }
          .title { 
            font-size: 12pt;
            color: #374151;
            margin-bottom: 4pt;
            font-weight: 600;
          }
          .contact { 
            font-size: 9pt;
            color: #4b5563;
            line-height: 1.4;
          }
          .contact span { 
            margin-right: 10pt;
            white-space: nowrap;
          }
          
          /* Sections */
          h2 { 
            font-size: 11pt;
            color: #1e40af;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5pt;
            margin-top: 10pt;
            margin-bottom: 4pt;
            padding-bottom: 2pt;
            border-bottom: 1pt solid #dbeafe;
          }
          
          /* Resume */
          .resume { 
            font-size: 10pt;
            line-height: 1.4;
            color: #374151;
            margin-bottom: 8pt;
            text-align: justify;
          }
          
          /* Experience */
          .experience-item { 
            margin-bottom: 8pt;
            page-break-inside: avoid;
          }
          .experience-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 2pt;
          }
          .job-title { 
            font-size: 10.5pt;
            font-weight: bold;
            color: #1f2937;
          }
          .company { 
            font-size: 9.5pt;
            color: #6b7280;
            font-weight: 600;
          }
          .period {
            font-size: 9pt;
            color: #9ca3af;
            font-style: italic;
            white-space: nowrap;
          }
          .description { 
            font-size: 9.5pt;
            line-height: 1.3;
            color: #4b5563;
            margin-top: 2pt;
            white-space: pre-line;
          }
          
          /* Formation */
          .formation-item { 
            margin-bottom: 6pt;
            page-break-inside: avoid;
          }
          .formation-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
          }
          .diploma { 
            font-size: 10pt;
            font-weight: bold;
            color: #1f2937;
          }
          .school { 
            font-size: 9.5pt;
            color: #6b7280;
            font-weight: 600;
          }
          .year {
            font-size: 9pt;
            color: #9ca3af;
            font-style: italic;
          }
          
          /* Skills */
          .skills { 
            font-size: 9.5pt;
            line-height: 1.5;
            color: #374151;
          }
          .skill-category {
            margin-bottom: 3pt;
          }
          .skill-label {
            font-weight: 600;
            color: #1f2937;
          }
          
          /* Compact spacing for 1 page */
          @page { 
            size: A4;
            margin: 0;
          }
          @media print {
            body { background: white; }
            .container { padding: 15mm 20mm; }
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
              ${cvData.email ? `<span>📧 ${cvData.email}</span>` : ''}
              ${cvData.telephone ? `<span>📱 ${cvData.telephone}</span>` : ''}
              ${cvData.adresse ? `<span>📍 ${cvData.adresse}</span>` : ''}
              ${cvData.linkedin ? `<span>🔗 ${cvData.linkedin}</span>` : ''}
            </div>
          </div>

          <!-- RESUME -->
          ${cvData.resume ? `
            <h2>Profil Professionnel</h2>
            <div class="resume">${cvData.resume}</div>
          ` : ''}

          <!-- EXPERIENCE -->
          ${cvData.experiences && cvData.experiences.length > 0 ? `
            <h2>Expérience Professionnelle</h2>
            ${cvData.experiences.map(exp => `
              <div class="experience-item">
                <div class="experience-header">
                  <div>
                    <div class="job-title">${exp.poste}</div>
                    <div class="company">${exp.entreprise}${exp.localisation ? ` • ${exp.localisation}` : ''}</div>
                  </div>
                  <div class="period">${exp.date_debut || ''}${exp.date_fin ? ` - ${exp.date_fin}` : ''}</div>
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
                <div class="formation-header">
                  <div>
                    <div class="diploma">${form.diplome}</div>
                    <div class="school">${form.etablissement || form.ecole || ''}${form.localisation ? ` • ${form.localisation}` : ''}</div>
                  </div>
                  <div class="year">${form.date_fin || form.annee || ''}</div>
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
                  <span class="skill-label">Techniques :</span> ${cvData.competences_techniques}
                </div>
              ` : ''}
              ${cvData.competences_soft ? `
                <div class="skill-category">
                  <span class="skill-label">Personnelles :</span> ${cvData.competences_soft}
                </div>
              ` : ''}
              ${cvData.langues ? `
                <div class="skill-category">
                  <span class="skill-label">Langues :</span> ${cvData.langues}
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
   * Template Classique - ATS Optimized
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
            font-family: 'Times New Roman', 'Georgia', serif; 
            font-size: 10pt;
            line-height: 1.3;
            color: #000;
            background: white;
          }
          .container { 
            max-width: 210mm;
            margin: 0 auto;
            padding: 15mm 20mm;
          }
          
          /* Header */
          .header { 
            text-align: center;
            margin-bottom: 10pt;
            padding-bottom: 6pt;
            border-bottom: 2pt solid #000;
          }
          .name { 
            font-size: 20pt;
            font-weight: bold;
            color: #000;
            margin-bottom: 3pt;
            text-transform: uppercase;
            letter-spacing: 1pt;
          }
          .title { 
            font-size: 12pt;
            color: #333;
            margin-bottom: 5pt;
            font-style: italic;
          }
          .contact { 
            font-size: 9pt;
            color: #444;
            line-height: 1.4;
          }
          .contact span { 
            margin: 0 8pt;
          }
          
          /* Sections */
          h2 { 
            font-size: 11pt;
            color: #000;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1pt;
            margin-top: 10pt;
            margin-bottom: 4pt;
            padding-bottom: 2pt;
            border-bottom: 1pt solid #000;
          }
          
          /* Resume */
          .resume { 
            font-size: 10pt;
            line-height: 1.4;
            color: #222;
            margin-bottom: 8pt;
            text-align: justify;
          }
          
          /* Experience */
          .experience-item { 
            margin-bottom: 8pt;
            page-break-inside: avoid;
          }
          .experience-header {
            margin-bottom: 2pt;
          }
          .job-title { 
            font-size: 10.5pt;
            font-weight: bold;
            color: #000;
          }
          .company-line {
            font-size: 9.5pt;
            color: #333;
            margin-top: 1pt;
          }
          .company { 
            font-weight: 600;
          }
          .period {
            font-style: italic;
          }
          .description { 
            font-size: 9.5pt;
            line-height: 1.3;
            color: #222;
            margin-top: 2pt;
            white-space: pre-line;
          }
          
          /* Formation */
          .formation-item { 
            margin-bottom: 6pt;
            page-break-inside: avoid;
          }
          .diploma { 
            font-size: 10pt;
            font-weight: bold;
            color: #000;
          }
          .school-line { 
            font-size: 9.5pt;
            color: #333;
            margin-top: 1pt;
          }
          
          /* Skills */
          .skills { 
            font-size: 9.5pt;
            line-height: 1.5;
            color: #222;
          }
          .skill-category {
            margin-bottom: 3pt;
          }
          .skill-label {
            font-weight: bold;
            color: #000;
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
            <h2>Expérience Professionnelle</h2>
            ${cvData.experiences.map(exp => `
              <div class="experience-item">
                <div class="experience-header">
                  <div class="job-title">${exp.poste}</div>
                  <div class="company-line">
                    <span class="company">${exp.entreprise}</span>${exp.localisation ? ` • ${exp.localisation}` : ''}
                    ${exp.date_debut || exp.date_fin ? ` <span class="period">• ${exp.date_debut || ''}${exp.date_fin ? ` - ${exp.date_fin}` : ''}</span>` : ''}
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
                  <span class="skill-label">Compétences Techniques:</span> ${cvData.competences_techniques}
                </div>
              ` : ''}
              ${cvData.competences_soft ? `
                <div class="skill-category">
                  <span class="skill-label">Compétences Personnelles:</span> ${cvData.competences_soft}
                </div>
              ` : ''}
              ${cvData.langues ? `
                <div class="skill-category">
                  <span class="skill-label">Langues:</span> ${cvData.langues}
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
   * Template Créatif - ATS Optimized (Single Column)
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
            font-family: 'Helvetica', 'Arial', sans-serif; 
            font-size: 10pt;
            line-height: 1.3;
            color: #1a1a1a;
            background: white;
          }
          .container { 
            max-width: 210mm;
            margin: 0 auto;
            padding: 15mm 20mm;
          }
          
          /* Header - Accent coloré */
          .header { 
            margin-bottom: 8pt;
            padding: 8pt 12pt;
            background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
            border-radius: 4pt;
          }
          .name { 
            font-size: 18pt;
            font-weight: bold;
            color: white;
            margin-bottom: 2pt;
          }
          .title { 
            font-size: 12pt;
            color: #fce7f3;
            margin-bottom: 4pt;
            font-weight: 600;
          }
          .contact { 
            font-size: 9pt;
            color: #fce7f3;
            line-height: 1.4;
          }
          .contact span { 
            margin-right: 10pt;
          }
          
          /* Sections */
          h2 { 
            font-size: 11pt;
            color: #be185d;
            font-weight: bold;
            text-transform: uppercase;
            margin-top: 10pt;
            margin-bottom: 4pt;
            padding-bottom: 2pt;
            border-bottom: 2pt solid #fce7f3;
          }
          
          /* Resume */
          .resume { 
            font-size: 10pt;
            line-height: 1.4;
            color: #374151;
            margin-bottom: 8pt;
            padding: 6pt 8pt;
            background: #fdf4ff;
            border-left: 3pt solid #ec4899;
          }
          
          /* Experience */
          .experience-item { 
            margin-bottom: 8pt;
            page-break-inside: avoid;
          }
          .experience-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 2pt;
          }
          .job-title { 
            font-size: 10.5pt;
            font-weight: bold;
            color: #be185d;
          }
          .company { 
            font-size: 9.5pt;
            color: #6b7280;
            font-weight: 600;
          }
          .period {
            font-size: 9pt;
            color: #9ca3af;
            font-style: italic;
            white-space: nowrap;
          }
          .description { 
            font-size: 9.5pt;
            line-height: 1.3;
            color: #4b5563;
            margin-top: 2pt;
            white-space: pre-line;
          }
          
          /* Formation */
          .formation-item { 
            margin-bottom: 6pt;
            page-break-inside: avoid;
          }
          .formation-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
          }
          .diploma { 
            font-size: 10pt;
            font-weight: bold;
            color: #be185d;
          }
          .school { 
            font-size: 9.5pt;
            color: #6b7280;
            font-weight: 600;
          }
          .year {
            font-size: 9pt;
            color: #9ca3af;
            font-style: italic;
          }
          
          /* Skills - Accent boxes */
          .skills { 
            font-size: 9.5pt;
            line-height: 1.5;
            color: #374151;
          }
          .skill-category {
            margin-bottom: 4pt;
            padding: 4pt 8pt;
            background: #fdf4ff;
            border-left: 2pt solid #ec4899;
          }
          .skill-label {
            font-weight: 600;
            color: #be185d;
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
              ${cvData.email ? `<span>📧 ${cvData.email}</span>` : ''}
              ${cvData.telephone ? `<span>📱 ${cvData.telephone}</span>` : ''}
              ${cvData.adresse ? `<span>📍 ${cvData.adresse}</span>` : ''}
              ${cvData.linkedin ? `<span>🔗 ${cvData.linkedin}</span>` : ''}
            </div>
          </div>

          <!-- RESUME -->
          ${cvData.resume ? `
            <h2>À Propos</h2>
            <div class="resume">${cvData.resume}</div>
          ` : ''}

          <!-- EXPERIENCE -->
          ${cvData.experiences && cvData.experiences.length > 0 ? `
            <h2>Expérience</h2>
            ${cvData.experiences.map(exp => `
              <div class="experience-item">
                <div class="experience-header">
                  <div>
                    <div class="job-title">${exp.poste}</div>
                    <div class="company">${exp.entreprise}${exp.localisation ? ` • ${exp.localisation}` : ''}</div>
                  </div>
                  <div class="period">${exp.date_debut || ''}${exp.date_fin ? ` - ${exp.date_fin}` : ''}</div>
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
                <div class="formation-header">
                  <div>
                    <div class="diploma">${form.diplome}</div>
                    <div class="school">${form.etablissement || form.ecole || ''}${form.localisation ? ` • ${form.localisation}` : ''}</div>
                  </div>
                  <div class="year">${form.date_fin || form.annee || ''}</div>
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
                  <span class="skill-label">Techniques:</span> ${cvData.competences_techniques}
                </div>
              ` : ''}
              ${cvData.competences_soft ? `
                <div class="skill-category">
                  <span class="skill-label">Personnelles:</span> ${cvData.competences_soft}
                </div>
              ` : ''}
              ${cvData.langues ? `
                <div class="skill-category">
                  <span class="skill-label">Langues:</span> ${cvData.langues}
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
   * Template Tech - Pour développeurs et professionnels IT
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
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace; 
            font-size: 9.5pt;
            line-height: 1.3;
            color: #0f172a;
            background: white;
          }
          .container { 
            max-width: 210mm;
            margin: 0 auto;
            padding: 15mm 20mm;
          }
          
          /* Header - Style code/terminal */
          .header { 
            margin-bottom: 8pt;
            padding: 8pt;
            background: #0f172a;
            border-left: 4pt solid #10b981;
            font-family: 'Consolas', monospace;
          }
          .name { 
            font-size: 16pt;
            font-weight: bold;
            color: #10b981;
            margin-bottom: 2pt;
            letter-spacing: 0.5pt;
          }
          .name::before { content: '> '; color: #10b981; }
          .title { 
            font-size: 11pt;
            color: #94a3b8;
            margin-bottom: 4pt;
            padding-left: 12pt;
          }
          .contact { 
            font-size: 8.5pt;
            color: #64748b;
            line-height: 1.4;
            padding-left: 12pt;
          }
          .contact span { 
            margin-right: 12pt;
          }
          
          /* Sections */
          h2 { 
            font-size: 10pt;
            color: #10b981;
            font-weight: bold;
            margin-top: 10pt;
            margin-bottom: 4pt;
            padding: 3pt 6pt;
            background: #f1f5f9;
            border-left: 3pt solid #10b981;
            font-family: 'Consolas', monospace;
          }
          h2::before { content: '# '; }
          
          /* Resume */
          .resume { 
            font-size: 9.5pt;
            line-height: 1.4;
            color: #334155;
            margin-bottom: 8pt;
            font-family: 'Arial', sans-serif;
          }
          
          /* Experience */
          .experience-item { 
            margin-bottom: 8pt;
            page-break-inside: avoid;
          }
          .experience-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 2pt;
          }
          .job-title { 
            font-size: 10pt;
            font-weight: bold;
            color: #0f172a;
            font-family: 'Consolas', monospace;
          }
          .job-title::before { content: '⚡ '; color: #10b981; }
          .company { 
            font-size: 9pt;
            color: #64748b;
            font-weight: 600;
          }
          .period {
            font-size: 8.5pt;
            color: #94a3b8;
            font-family: 'Consolas', monospace;
            white-space: nowrap;
          }
          .description { 
            font-size: 9pt;
            line-height: 1.3;
            color: #475569;
            margin-top: 2pt;
            white-space: pre-line;
            font-family: 'Arial', sans-serif;
          }
          
          /* Formation */
          .formation-item { 
            margin-bottom: 6pt;
            page-break-inside: avoid;
          }
          .formation-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
          }
          .diploma { 
            font-size: 9.5pt;
            font-weight: bold;
            color: #0f172a;
            font-family: 'Consolas', monospace;
          }
          .diploma::before { content: '📚 '; }
          .school { 
            font-size: 9pt;
            color: #64748b;
            font-weight: 600;
          }
          .year {
            font-size: 8.5pt;
            color: #94a3b8;
            font-family: 'Consolas', monospace;
          }
          
          /* Skills - Style tags/badges */
          .skills { 
            font-size: 9pt;
            line-height: 1.6;
            color: #334155;
          }
          .skill-category {
            margin-bottom: 4pt;
          }
          .skill-label {
            font-weight: bold;
            color: #10b981;
            font-family: 'Consolas', monospace;
          }
          .skill-label::after { content: ' →'; }
          
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
                <div class="experience-header">
                  <div>
                    <div class="job-title">${exp.poste}</div>
                    <div class="company">${exp.entreprise}${exp.localisation ? ` • ${exp.localisation}` : ''}</div>
                  </div>
                  <div class="period">${exp.date_debut || ''}${exp.date_fin ? ` - ${exp.date_fin}` : ''}</div>
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
                <div class="formation-header">
                  <div>
                    <div class="diploma">${form.diplome}</div>
                    <div class="school">${form.etablissement || form.ecole || ''}${form.localisation ? ` • ${form.localisation}` : ''}</div>
                  </div>
                  <div class="year">${form.date_fin || form.annee || ''}</div>
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
                  <span class="skill-label">Technical</span> ${cvData.competences_techniques}
                </div>
              ` : ''}
              ${cvData.competences_soft ? `
                <div class="skill-category">
                  <span class="skill-label">Soft Skills</span> ${cvData.competences_soft}
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
   * Template Executive - Pour managers et cadres
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
            font-family: 'Georgia', 'Times New Roman', serif; 
            font-size: 10pt;
            line-height: 1.35;
            color: #1c1c1c;
            background: white;
          }
          .container { 
            max-width: 210mm;
            margin: 0 auto;
            padding: 18mm 22mm;
          }
          
          /* Header - Élégant et sobre */
          .header { 
            margin-bottom: 12pt;
            padding-bottom: 8pt;
            border-bottom: 3pt double #1c1c1c;
          }
          .name { 
            font-size: 22pt;
            font-weight: bold;
            color: #1c1c1c;
            margin-bottom: 3pt;
            letter-spacing: 2pt;
            text-transform: uppercase;
          }
          .title { 
            font-size: 13pt;
            color: #4a4a4a;
            margin-bottom: 6pt;
            font-style: italic;
            font-weight: 500;
          }
          .contact { 
            font-size: 9pt;
            color: #666;
            line-height: 1.5;
          }
          .contact span { 
            margin-right: 15pt;
          }
          .contact span::after {
            content: ' | ';
            color: #ccc;
            margin-left: 15pt;
          }
          .contact span:last-child::after {
            content: '';
          }
          
          /* Sections */
          h2 { 
            font-size: 11.5pt;
            color: #1c1c1c;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1.5pt;
            margin-top: 12pt;
            margin-bottom: 6pt;
            padding-bottom: 3pt;
            border-bottom: 1.5pt solid #1c1c1c;
          }
          
          /* Resume */
          .resume { 
            font-size: 10pt;
            line-height: 1.5;
            color: #2c2c2c;
            margin-bottom: 10pt;
            text-align: justify;
            font-style: italic;
          }
          
          /* Experience */
          .experience-item { 
            margin-bottom: 10pt;
            page-break-inside: avoid;
          }
          .experience-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 3pt;
          }
          .job-title { 
            font-size: 11pt;
            font-weight: bold;
            color: #1c1c1c;
          }
          .company { 
            font-size: 10pt;
            color: #4a4a4a;
            font-weight: 600;
            font-style: italic;
          }
          .period {
            font-size: 9pt;
            color: #666;
            white-space: nowrap;
          }
          .description { 
            font-size: 9.5pt;
            line-height: 1.4;
            color: #3a3a3a;
            margin-top: 3pt;
            white-space: pre-line;
          }
          
          /* Formation */
          .formation-item { 
            margin-bottom: 7pt;
            page-break-inside: avoid;
          }
          .formation-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
          }
          .diploma { 
            font-size: 10pt;
            font-weight: bold;
            color: #1c1c1c;
          }
          .school { 
            font-size: 9.5pt;
            color: #4a4a4a;
            font-style: italic;
          }
          .year {
            font-size: 9pt;
            color: #666;
          }
          
          /* Skills */
          .skills { 
            font-size: 9.5pt;
            line-height: 1.6;
            color: #2c2c2c;
          }
          .skill-category {
            margin-bottom: 4pt;
          }
          .skill-label {
            font-weight: bold;
            color: #1c1c1c;
            text-transform: uppercase;
            font-size: 9pt;
            letter-spacing: 0.5pt;
          }
          .skill-label::after { content: ' —'; }
          
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
                <div class="experience-header">
                  <div>
                    <div class="job-title">${exp.poste}</div>
                    <div class="company">${exp.entreprise}${exp.localisation ? ` • ${exp.localisation}` : ''}</div>
                  </div>
                  <div class="period">${exp.date_debut || ''}${exp.date_fin ? ` - ${exp.date_fin}` : ''}</div>
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
                <div class="formation-header">
                  <div>
                    <div class="diploma">${form.diplome}</div>
                    <div class="school">${form.etablissement || form.ecole || ''}${form.localisation ? ` • ${form.localisation}` : ''}</div>
                  </div>
                  <div class="year">${form.date_fin || form.annee || ''}</div>
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
                  <span class="skill-label">Technical</span> ${cvData.competences_techniques}
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
   * Template Minimal - Ultra épuré et moderne
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
            font-family: 'Helvetica Neue', 'Arial', sans-serif; 
            font-size: 9.5pt;
            line-height: 1.4;
            color: #111;
            background: white;
          }
          .container { 
            max-width: 210mm;
            margin: 0 auto;
            padding: 20mm 25mm;
          }
          
          /* Header - Ultra minimal */
          .header { 
            margin-bottom: 15pt;
          }
          .name { 
            font-size: 24pt;
            font-weight: 300;
            color: #000;
            margin-bottom: 4pt;
            letter-spacing: -0.5pt;
          }
          .title { 
            font-size: 11pt;
            color: #666;
            margin-bottom: 8pt;
            font-weight: 400;
          }
          .contact { 
            font-size: 8.5pt;
            color: #888;
            line-height: 1.6;
          }
          .contact span { 
            margin-right: 12pt;
          }
          
          /* Sections - Très épurées */
          h2 { 
            font-size: 9pt;
            color: #000;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1.5pt;
            margin-top: 12pt;
            margin-bottom: 6pt;
          }
          
          /* Resume */
          .resume { 
            font-size: 9.5pt;
            line-height: 1.5;
            color: #333;
            margin-bottom: 10pt;
          }
          
          /* Experience - Minimal */
          .experience-item { 
            margin-bottom: 10pt;
            page-break-inside: avoid;
          }
          .experience-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 2pt;
          }
          .job-title { 
            font-size: 10pt;
            font-weight: 500;
            color: #000;
          }
          .company { 
            font-size: 9pt;
            color: #666;
            font-weight: 400;
          }
          .period {
            font-size: 8.5pt;
            color: #999;
            white-space: nowrap;
          }
          .description { 
            font-size: 9pt;
            line-height: 1.4;
            color: #444;
            margin-top: 2pt;
            white-space: pre-line;
          }
          
          /* Formation - Minimal */
          .formation-item { 
            margin-bottom: 6pt;
            page-break-inside: avoid;
          }
          .formation-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
          }
          .diploma { 
            font-size: 9.5pt;
            font-weight: 500;
            color: #000;
          }
          .school { 
            font-size: 9pt;
            color: #666;
          }
          .year {
            font-size: 8.5pt;
            color: #999;
          }
          
          /* Skills - Liste simple */
          .skills { 
            font-size: 9pt;
            line-height: 1.6;
            color: #333;
          }
          .skill-category {
            margin-bottom: 3pt;
          }
          .skill-label {
            font-weight: 500;
            color: #000;
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
            <h2>Profile</h2>
            <div class="resume">${cvData.resume}</div>
          ` : ''}

          <!-- EXPERIENCE -->
          ${cvData.experiences && cvData.experiences.length > 0 ? `
            <h2>Experience</h2>
            ${cvData.experiences.map(exp => `
              <div class="experience-item">
                <div class="experience-header">
                  <div>
                    <div class="job-title">${exp.poste}</div>
                    <div class="company">${exp.entreprise}${exp.localisation ? ` · ${exp.localisation}` : ''}</div>
                  </div>
                  <div class="period">${exp.date_debut || ''}${exp.date_fin ? ` – ${exp.date_fin}` : ''}</div>
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
                <div class="formation-header">
                  <div>
                    <div class="diploma">${form.diplome}</div>
                    <div class="school">${form.etablissement || form.ecole || ''}${form.localisation ? ` · ${form.localisation}` : ''}</div>
                  </div>
                  <div class="year">${form.date_fin || form.annee || ''}</div>
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
                  <span class="skill-label">Technical:</span> ${cvData.competences_techniques}
                </div>
              ` : ''}
              ${cvData.competences_soft ? `
                <div class="skill-category">
                  <span class="skill-label">Personal:</span> ${cvData.competences_soft}
                </div>
              ` : ''}
              ${cvData.langues ? `
                <div class="skill-category">
                  <span class="skill-label">Languages:</span> ${cvData.langues}
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
