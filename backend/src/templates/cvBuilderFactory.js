/**
 * CV Builder Factory — Système de templates CV
 * Template unique : Classique ATS (professionnel, noir & blanc, 1 colonne)
 * D'autres templates seront ajoutés ultérieurement.
 */

const STYLES = {
  anthracite: { accent: '#1a1a2e', accentMid: '#2d2d4e', accentLight: '#eaeaf0', text: '#1a1a1a', subtext: '#4a4a5a', sidebarBg: '#1a1a2e', sidebarText: '#f0f0f5', lineColor: '#ccccdd', font: "'Helvetica Neue', Arial, sans-serif" },
  ocean:       { accent: '#0369a1', accentMid: '#0284c7', accentLight: '#e0f2fe', text: '#0c4a6e', subtext: '#475569', sidebarBg: '#0c4a6e', sidebarText: '#e0f2fe', lineColor: '#bae6fd', font: "Arial, sans-serif" },
  foret:       { accent: '#15803d', accentMid: '#16a34a', accentLight: '#dcfce7', text: '#14532d', subtext: '#374151', sidebarBg: '#14532d', sidebarText: '#dcfce7', lineColor: '#bbf7d0', font: "Arial, sans-serif" },
  corail:      { accent: '#dc2626', accentMid: '#ef4444', accentLight: '#fee2e2', text: '#7f1d1d', subtext: '#374151', sidebarBg: '#7f1d1d', sidebarText: '#fecaca', lineColor: '#fca5a5', font: "Arial, sans-serif" },
  violet:      { accent: '#7c3aed', accentMid: '#8b5cf6', accentLight: '#ede9fe', text: '#4c1d95', subtext: '#374151', sidebarBg: '#4c1d95', sidebarText: '#ede9fe', lineColor: '#c4b5fd', font: "Arial, sans-serif" },
  or:          { accent: '#b45309', accentMid: '#d97706', accentLight: '#fef3c7', text: '#78350f', subtext: '#6b7280', sidebarBg: '#78350f', sidebarText: '#fde68a', lineColor: '#fde68a', font: "Georgia, serif" },
  ardoise:     { accent: '#475569', accentMid: '#64748b', accentLight: '#f1f5f9', text: '#1e293b', subtext: '#64748b', sidebarBg: '#334155', sidebarText: '#f1f5f9', lineColor: '#cbd5e1', font: "'Helvetica Neue', Arial, sans-serif" },
  rose:        { accent: '#db2777', accentMid: '#ec4899', accentLight: '#fce7f3', text: '#831843', subtext: '#374151', sidebarBg: '#831843', sidebarText: '#fce7f3', lineColor: '#f9a8d4', font: "Arial, sans-serif" },
};

class CVBuilderFactory {
  generate(cvData, buildConfig = {}) {
    const { shape = 'classique', style = 'ardoise', blockStyles = {} } = buildConfig;
    const s = STYLES[style] || STYLES.ardoise;
    console.log(`📐 [CVBuilderFactory] shape=${shape} style=${style}`);
    return this.classique(cvData, s, blockStyles);
  }

  /* ── Helpers ── */

  _bso(blockStyles, key, s) {
    if (!blockStyles || !blockStyles[key]) return '';
    const bs = blockStyles[key];
    let css = '';
    if (bs.bgColor && bs.bgColor !== 'transparent') css += `background:${bs.bgColor};padding:8pt 10pt;`;
    const radMap = { small: '4pt', medium: '8pt', large: '16pt' };
    if (bs.borderRadius && radMap[bs.borderRadius]) css += `border-radius:${radMap[bs.borderRadius]};`;
    if (bs.borderStyle && bs.borderStyle !== 'none') {
      if (bs.borderStyle === 'left_accent') css += `border-left:4pt solid ${s.accent};`;
      if (bs.borderStyle === 'full_border') css += `border:1.5pt solid ${s.lineColor};`;
      if (bs.borderStyle === 'shadow') css += 'box-shadow:0 2pt 8pt rgba(0,0,0,0.10);';
    }
    return css;
  }

  _contactInfo(cvData) {
    const parts = [];
    if (cvData.adresse) parts.push(cvData.adresse);
    if (cvData.email) parts.push(cvData.email);
    if (cvData.telephone) parts.push(cvData.telephone);
    if (cvData.linkedin) parts.push(cvData.linkedin);
    return parts.join(' &nbsp;&bull;&nbsp; ');
  }

  _sectionTitle(label) {
    return `<div style="font-size:10.5pt; font-weight:700; color:#1a1a1a; text-transform:uppercase; letter-spacing:1.5pt; margin:12pt 0 4pt 0; padding-bottom:2.5pt; border-bottom:0.75pt solid #c0c0c0;">${label}</div>`;
  }

  _skillsGrid(str) {
    if (!str) return '';
    const items = str.split(',').map(t => t.trim()).filter(Boolean);
    if (!items.length) return '';
    let html = '<table style="width:100%; border-collapse:collapse; margin-top:3pt;">';
    for (let i = 0; i < items.length; i += 3) {
      html += '<tr>';
      for (let j = 0; j < 3; j++) {
        const item = items[i + j];
        html += item
          ? `<td style="font-size:9pt; color:#2a2a2a; padding:2pt 4pt; line-height:1.4; width:33.33%;">&bull; ${item}</td>`
          : '<td></td>';
      }
      html += '</tr>';
    }
    html += '</table>';
    return html;
  }

  /** Qualifications clés + langues fusionnées en liste à puces */
  _qualificationsList(competencesSoft, langues) {
    const items = [];
    if (competencesSoft) {
      competencesSoft.split('\n').map(t => t.trim()).filter(Boolean).forEach(item => items.push(item));
    }
    if (langues) {
      langues.split(',').map(t => t.trim()).filter(Boolean).forEach(lang => items.push(lang));
    }
    if (!items.length) return '';
    return `<ul style="padding-left:14pt; margin:3pt 0 0 0;">${items.map(item =>
      `<li style="font-size:9pt; color:#2a2a2a; margin-bottom:2pt; line-height:1.5;">${item}</li>`
    ).join('')}</ul>`;
  }

  _expItems(experiences, blockStyles, s) {
    if (!experiences || !experiences.length) return '';
    return experiences.map((exp, i) => {
      const bsoStr = this._bso(blockStyles, `exp_${i}`, s);
      return `
        <div style="margin-bottom:9pt; page-break-inside:avoid; ${bsoStr}">
          <div style="font-weight:700; font-size:10pt; color:#1a1a1a; font-style:italic;">${exp.poste || ''}</div>
          <div style="font-size:9pt; color:#3a3a3a; margin-bottom:2pt;">
            ${exp.entreprise ? `<strong>${exp.entreprise}</strong>` : ''}${exp.localisation ? `, ${exp.localisation}` : ''}${(exp.date_debut || exp.date_fin) ? ` &bull; ${exp.date_debut || ''}${exp.date_fin ? ' - ' + exp.date_fin : ''}` : ''}
          </div>
          ${exp.description ? `<div style="font-size:9pt; line-height:1.5; color:#2a2a2a; white-space:pre-line;">${exp.description}</div>` : ''}
        </div>`;
    }).join('');
  }

  _formItems(formations) {
    if (!formations || !formations.length) return '';
    return formations.map(f => `
      <div style="margin-bottom:5pt; page-break-inside:avoid;">
        <div style="font-size:9.5pt; color:#1a1a1a;">
          <strong>${f.diplome || ''}</strong>${f.etablissement ? `, ${f.etablissement}` : ''}${f.localisation ? `, ${f.localisation}` : ''}${(f.date_fin || f.annee) ? ` &bull; ${f.date_fin || f.annee}` : ''}
        </div>
        ${f.description ? `<div style="font-size:8.5pt; color:#4a4a4a; margin-top:1pt;">${f.description}</div>` : ''}
      </div>`).join('');
  }

  _html(title, body) {
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${title}</title>
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family: 'Helvetica Neue', Arial, sans-serif; font-size:9.5pt; line-height:1.45; color:#1a1a1a; background:white; -webkit-font-smoothing:antialiased; }
@page { size:A4; margin:0; }
@media print { body { background:white; } }
</style></head><body>${body}</body></html>`;
  }

  /* =============================
     TEMPLATE : CLASSIQUE ATS
     1 colonne, professionnel, épuré
  ============================= */
  classique(cvData, s, blockStyles) {
    const body = `
<div style="max-width:210mm; min-height:297mm; margin:0 auto; padding:12mm 16mm 10mm 16mm;">

  <!-- HEADER -->
  <div style="text-align:center; margin-bottom:8pt; ${this._bso(blockStyles, 'identity', s)}">
    <div style="font-size:22pt; font-weight:700; color:#1a1a1a; text-transform:uppercase; letter-spacing:2.5pt; margin-bottom:3pt;">${cvData.prenom || ''} ${cvData.nom || ''}</div>
    <div style="width:60%; margin:0 auto 5pt; border-bottom:0.75pt solid #c0c0c0;"></div>
    <div style="font-size:8.5pt; color:#4a4a4a; letter-spacing:0.3pt;">${this._contactInfo(cvData)}</div>
  </div>

  ${cvData.resume ? `
  ${this._sectionTitle('Résumé')}
  <div style="font-size:9.5pt; line-height:1.6; color:#2a2a2a; text-align:justify; margin-top:3pt; ${this._bso(blockStyles, 'resume', s)}">${cvData.resume}</div>
  ` : ''}

  ${cvData.competences_techniques ? `
  ${this._sectionTitle('Compétences')}
  ${this._skillsGrid(cvData.competences_techniques)}
  ` : ''}

  ${(cvData.competences_soft || cvData.langues) ? `
  ${this._sectionTitle('Qualifications clés')}
  ${this._qualificationsList(cvData.competences_soft, cvData.langues)}
  ` : ''}

  ${cvData.experiences && cvData.experiences.length ? `
  ${this._sectionTitle('Expérience professionnelle')}
  ${this._expItems(cvData.experiences, blockStyles, s)}
  ` : ''}

  ${cvData.formations && cvData.formations.length ? `
  ${this._sectionTitle('Formation')}
  ${this._formItems(cvData.formations)}
  ` : ''}

  ${cvData.interets ? `
  ${this._sectionTitle("Centres d'intérêt")}
  <div style="font-size:9pt; color:#3a3a3a;">${cvData.interets}</div>
  ` : ''}

</div>`;
    return this._html(`CV - ${cvData.prenom} ${cvData.nom}`, body);
  }
}

module.exports = new CVBuilderFactory();
