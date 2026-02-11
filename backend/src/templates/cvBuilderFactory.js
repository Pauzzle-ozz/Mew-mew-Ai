/**
 * CV Builder Factory — Nouveau système de templates
 * 6 formes × 8 styles = combinaisons infinies
 * Support : photo (base64), borderRadius, borderStyle, bgColor par bloc
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
    const { shape = 'classique', style = 'ocean', blockStyles = {} } = buildConfig;
    const s = STYLES[style] || STYLES.ocean;

    console.log(`📐 [CVBuilderFactory] shape=${shape} style=${style}`);

    switch (shape) {
      case 'deux_colonnes':  return this.deuxColonnes(cvData, s, blockStyles);
      case 'header_bande':   return this.headerBande(cvData, s, blockStyles);
      case 'timeline':       return this.timeline(cvData, s, blockStyles);
      case 'encadre':        return this.encadre(cvData, s, blockStyles);
      case 'compact':        return this.compact(cvData, s, blockStyles);
      case 'minimal_pro':    return this.minimalPro(cvData, s, blockStyles);
      case 'dark_premium':   return this.darkPremium(cvData, s, blockStyles);
      default:               return this.classique(cvData, s, blockStyles);
    }
  }

  /* =============================
     Helpers communs
  ============================= */
  _blockBg(blockStyles, key, fallback = 'transparent') {
    return (blockStyles[key] && blockStyles[key].bgColor) ? blockStyles[key].bgColor : fallback;
  }

  _blockRadius(blockStyles, key) {
    const r = blockStyles[key] && blockStyles[key].borderRadius;
    return { none: '0', small: '4pt', medium: '8pt', large: '16pt' }[r] || '0';
  }

  _blockBorder(blockStyles, key, s) {
    const b = blockStyles[key] && blockStyles[key].borderStyle;
    if (b === 'left_accent') return `border-left:4pt solid ${s.accent};`;
    if (b === 'full_border') return `border:1.5pt solid ${s.lineColor};`;
    if (b === 'shadow') return 'box-shadow:0 2pt 8pt rgba(0,0,0,0.10);';
    return '';
  }

  _blockContainerStyle(blockStyles, key, s, defaultBg = 'transparent') {
    const bg = this._blockBg(blockStyles, key, defaultBg);
    const r = this._blockRadius(blockStyles, key);
    const bdr = this._blockBorder(blockStyles, key, s);
    const hasDeco = bg !== 'transparent' || bdr;
    return `background:${bg}; border-radius:${r}; ${bdr} ${hasDeco ? 'padding:8pt 10pt;' : ''}`;
  }

  /**
   * Retourne uniquement les propriétés CSS explicitement définies par l'utilisateur.
   * À placer EN FIN de style="" pour surcharger les styles du template.
   */
  _bso(blockStyles, key, s) {
    if (!blockStyles || !blockStyles[key]) return '';
    const bs = blockStyles[key];
    let css = '';
    if (bs.bgColor && bs.bgColor !== 'transparent') {
      css += `background:${bs.bgColor};padding:8pt 10pt;`;
    }
    const radMap = { small: '4pt', medium: '8pt', large: '16pt' };
    if (bs.borderRadius && radMap[bs.borderRadius]) css += `border-radius:${radMap[bs.borderRadius]};`;
    if (bs.borderStyle && bs.borderStyle !== 'none') {
      if (bs.borderStyle === 'left_accent') css += `border-left:4pt solid ${s.accent};`;
      if (bs.borderStyle === 'full_border') css += `border:1.5pt solid ${s.lineColor};`;
      if (bs.borderStyle === 'shadow') css += 'box-shadow:0 2pt 8pt rgba(0,0,0,0.10);';
    }
    return css;
  }

  _photoHTML(cvData, size = '70pt', extraStyle = 'border-radius:50%;') {
    if (cvData.photo) {
      return `<img src="${cvData.photo}" alt="photo" style="width:${size};height:${size};object-fit:cover;${extraStyle};display:block;" />`;
    }
    return `<div style="width:${size};height:${size};border-radius:50%;background:rgba(128,128,128,0.15);display:flex;align-items:center;justify-content:center;font-size:22pt;opacity:0.3;">👤</div>`;
  }

  _expItems(experiences, s, blockStyles) {
    if (!experiences || experiences.length === 0) return '';
    return experiences.map((exp, i) => {
      const bsoStr = this._bso(blockStyles, `exp_${i}`, s);
      return `
        <div style="margin-bottom:10pt; padding-bottom:8pt; border-bottom:0.5pt solid ${s.lineColor}; page-break-inside:avoid; ${bsoStr}">
          <div style="font-weight:700; font-size:11pt; color:${s.text}; margin-bottom:2pt;">${exp.poste || ''}</div>
          <div style="font-size:9.5pt; color:${s.subtext}; margin-bottom:3pt;">
            ${exp.entreprise ? `<strong style="color:${s.accent}">${exp.entreprise}</strong>` : ''}
            ${exp.localisation ? ` &bull; ${exp.localisation}` : ''}
            ${(exp.date_debut || exp.date_fin) ? ` &bull; <em>${exp.date_debut || ''}${exp.date_fin ? ' – ' + exp.date_fin : ''}</em>` : ''}
          </div>
          ${exp.description ? `<div style="font-size:9.5pt; line-height:1.5; color:${s.subtext}; white-space:pre-line;">${exp.description}</div>` : ''}
        </div>`;
    }).join('');
  }

  _formItems(formations, s) {
    if (!formations || formations.length === 0) return '';
    return formations.map(f => `
      <div style="margin-bottom:8pt; page-break-inside:avoid;">
        <div style="font-weight:600; font-size:10.5pt; color:${s.text};">${f.diplome || ''}</div>
        <div style="font-size:9.5pt; color:${s.subtext};">
          ${f.etablissement || ''}${f.localisation ? ' &bull; ' + f.localisation : ''}${(f.date_fin || f.annee) ? ' &bull; ' + (f.date_fin || f.annee) : ''}
        </div>
        ${f.description ? `<div style="font-size:9pt; color:${s.subtext}; margin-top:2pt;">${f.description}</div>` : ''}
      </div>`).join('');
  }

  _bulletList(str, s) {
    if (!str) return '';
    const items = str.split(',').map(t => t.trim()).filter(Boolean);
    if (!items.length) return `<span style="font-size:9.5pt; color:${s.subtext};">${str}</span>`;
    return `<ul style="padding-left:14pt; margin:0;">${items.map(item => `<li style="font-size:9.5pt; color:${s.subtext}; margin-bottom:2pt; line-height:1.4;">${item}</li>`).join('')}</ul>`;
  }

  _sectionTitle(label, s, extraCSS = '') {
    return `<h2 style="font-size:10.5pt; font-weight:700; color:${s.accent}; text-transform:uppercase; letter-spacing:1.5pt; margin:14pt 0 7pt 0; padding-bottom:3pt; border-bottom:2pt solid ${s.accentLight}; ${extraCSS}">${label}</h2>`;
  }

  _contactInfo(cvData, s, separator = ' &nbsp;|&nbsp; ') {
    const parts = [];
    if (cvData.email) parts.push(cvData.email);
    if (cvData.telephone) parts.push(cvData.telephone);
    if (cvData.adresse) parts.push(cvData.adresse);
    if (cvData.linkedin) parts.push(cvData.linkedin);
    return parts.join(separator);
  }

  _html(title, styles, body, font) {
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${title}</title>
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family:${font}; font-size:10pt; line-height:1.5; color:#1a1a1a; background:white; -webkit-font-smoothing:antialiased; }
@page { size:A4; margin:0; }
@media print { body { background:white; } }
${styles}
</style></head><body>${body}</body></html>`;
  }

  /* =============================
     FORME 1 : CLASSIQUE (1 colonne)
  ============================= */
  classique(cvData, s, blockStyles) {
    const body = `
<div style="max-width:210mm; margin:0 auto; padding:16mm 20mm 14mm 20mm;">

  <!-- HEADER -->
  <div style="text-align:center; padding-bottom:10pt; margin-bottom:14pt; border-bottom:2pt solid ${s.accent}; ${this._bso(blockStyles,'identity',s)}">
    ${cvData.photo ? `<div style="margin-bottom:7pt; display:flex; justify-content:center;">${this._photoHTML(cvData, '58pt')}</div>` : ''}
    <div style="font-size:24pt; font-weight:700; color:${s.text}; letter-spacing:1pt; margin-bottom:3pt;">${cvData.prenom || ''} ${cvData.nom || ''}</div>
    <div style="font-size:12pt; color:${s.accent}; margin-bottom:5pt; font-style:italic;">${cvData.titre_poste || ''}</div>
    <div style="font-size:9pt; color:${s.subtext};">${this._contactInfo(cvData, s)}</div>
  </div>

  ${cvData.resume ? `${this._sectionTitle('Profil', s)}<div style="font-size:10pt; line-height:1.7; color:${s.subtext}; text-align:justify; padding-left:6pt; border-left:3pt solid ${s.accentLight}; ${this._bso(blockStyles,'resume',s)}">${cvData.resume}</div>` : ''}

  ${cvData.experiences && cvData.experiences.length ? `${this._sectionTitle('Expérience professionnelle', s)}${this._expItems(cvData.experiences, s, blockStyles)}` : ''}

  ${cvData.formations && cvData.formations.length ? `${this._sectionTitle('Formation', s)}${this._formItems(cvData.formations, s)}` : ''}

  ${(cvData.competences_techniques || cvData.competences_soft || cvData.langues) ? `
  ${this._sectionTitle('Compétences', s)}
  <div style="display:flex; flex-wrap:wrap; gap:8pt;">
    ${cvData.competences_techniques ? `<div style="background:${s.accentLight}; padding:7pt 10pt; border-radius:4pt; flex:1; min-width:40%;"><div style="font-weight:700; color:${s.accent}; font-size:9pt; margin-bottom:4pt;">Techniques</div>${this._bulletList(cvData.competences_techniques, s)}</div>` : ''}
    ${cvData.competences_soft ? `<div style="background:${s.accentLight}; padding:7pt 10pt; border-radius:4pt; flex:1; min-width:40%;"><div style="font-weight:700; color:${s.accent}; font-size:9pt; margin-bottom:4pt;">Soft skills</div>${this._bulletList(cvData.competences_soft, s)}</div>` : ''}
    ${cvData.langues ? `<div style="background:${s.accentLight}; padding:7pt 10pt; border-radius:4pt; flex:1; min-width:40%;"><div style="font-weight:700; color:${s.accent}; font-size:9pt; margin-bottom:4pt;">Langues</div>${this._bulletList(cvData.langues, s)}</div>` : ''}
  </div>
  ` : ''}

  ${cvData.interets ? `${this._sectionTitle('Centres d\'intérêt', s)}<div style="font-size:9.5pt; color:${s.subtext};">${cvData.interets}</div>` : ''}
</div>`;
    return this._html(`CV - ${cvData.prenom} ${cvData.nom}`, '', body, s.font);
  }

  /* =============================
     FORME 2 : DEUX COLONNES (sidebar gauche)
  ============================= */
  deuxColonnes(cvData, s, blockStyles) {
    const sidebarBg = this._blockBg(blockStyles, 'sidebar', s.sidebarBg);
    const sidebarColor = s.sidebarText;

    const sidebar = `
<div style="width:34%; background:${sidebarBg}; color:${sidebarColor}; padding:20mm 12mm; display:flex; flex-direction:column; gap:0;">

  <!-- Photo -->
  <div style="display:flex; justify-content:center; margin-bottom:14pt;">
    ${this._photoHTML(cvData, '76pt', 'border-radius:50%; border:3pt solid rgba(255,255,255,0.4);')}
  </div>

  <!-- Nom + titre -->
  <div style="text-align:center; margin-bottom:16pt; padding-bottom:12pt; border-bottom:1pt solid rgba(255,255,255,0.2);">
    <div style="font-size:14pt; font-weight:700; color:${sidebarColor}; line-height:1.3;">${cvData.prenom || ''}<br>${cvData.nom || ''}</div>
    <div style="font-size:9pt; margin-top:4pt; opacity:0.85;">${cvData.titre_poste || ''}</div>
  </div>

  <!-- Contact -->
  <div style="margin-bottom:14pt;">
    <div style="font-size:8pt; font-weight:700; text-transform:uppercase; letter-spacing:1.5pt; margin-bottom:6pt; opacity:0.7;">Contact</div>
    ${cvData.email ? `<div style="font-size:8.5pt; margin-bottom:3pt; word-break:break-all;">${cvData.email}</div>` : ''}
    ${cvData.telephone ? `<div style="font-size:8.5pt; margin-bottom:3pt;">${cvData.telephone}</div>` : ''}
    ${cvData.adresse ? `<div style="font-size:8.5pt; margin-bottom:3pt;">${cvData.adresse}</div>` : ''}
    ${cvData.linkedin ? `<div style="font-size:8.5pt; word-break:break-all;">${cvData.linkedin}</div>` : ''}
  </div>

  ${cvData.competences_techniques ? `
  <div style="margin-bottom:14pt;">
    <div style="font-size:8pt; font-weight:700; text-transform:uppercase; letter-spacing:1.5pt; margin-bottom:6pt; opacity:0.7;">Compétences</div>
    <ul style="padding-left:12pt; margin:0;">${cvData.competences_techniques.split(',').map(t=>t.trim()).filter(Boolean).map(t=>`<li style="font-size:8.5pt; margin-bottom:2pt; opacity:0.95;">${t}</li>`).join('')}</ul>
  </div>` : ''}

  ${cvData.competences_soft ? `
  <div style="margin-bottom:14pt;">
    <div style="font-size:8pt; font-weight:700; text-transform:uppercase; letter-spacing:1.5pt; margin-bottom:6pt; opacity:0.7;">Soft Skills</div>
    <ul style="padding-left:12pt; margin:0;">${cvData.competences_soft.split(',').map(t=>t.trim()).filter(Boolean).map(t=>`<li style="font-size:8.5pt; margin-bottom:2pt; opacity:0.95;">${t}</li>`).join('')}</ul>
  </div>` : ''}

  ${cvData.langues ? `
  <div style="margin-bottom:14pt;">
    <div style="font-size:8pt; font-weight:700; text-transform:uppercase; letter-spacing:1.5pt; margin-bottom:6pt; opacity:0.7;">Langues</div>
    <ul style="padding-left:12pt; margin:0;">${cvData.langues.split(',').map(t=>t.trim()).filter(Boolean).map(t=>`<li style="font-size:8.5pt; margin-bottom:2pt; opacity:0.95;">${t}</li>`).join('')}</ul>
  </div>` : ''}

  ${cvData.interets ? `
  <div>
    <div style="font-size:8pt; font-weight:700; text-transform:uppercase; letter-spacing:1.5pt; margin-bottom:6pt; opacity:0.7;">Intérêts</div>
    <div style="font-size:8.5pt; line-height:1.7; opacity:0.95;">${cvData.interets}</div>
  </div>` : ''}
</div>`;

    const main = `
<div style="width:66%; padding:20mm 18mm 20mm 16mm;">
  ${cvData.resume ? `
    ${this._sectionTitle('Profil', s)}
    <div style="font-size:10pt; line-height:1.7; color:${s.subtext}; margin-bottom:4pt;">${cvData.resume}</div>` : ''}

  ${cvData.experiences && cvData.experiences.length ? `
    ${this._sectionTitle('Expérience', s)}
    ${this._expItems(cvData.experiences, s, blockStyles)}` : ''}

  ${cvData.formations && cvData.formations.length ? `
    ${this._sectionTitle('Formation', s)}
    ${this._formItems(cvData.formations, s)}` : ''}
</div>`;

    const body = `<div style="display:flex; min-height:297mm; max-width:210mm; margin:0 auto;">${sidebar}${main}</div>`;
    return this._html(`CV - ${cvData.prenom} ${cvData.nom}`, '', body, s.font);
  }

  /* =============================
     FORME 3 : HEADER BANDE (bandeau plein)
  ============================= */
  headerBande(cvData, s, blockStyles) {
    const headerBg = this._blockBg(blockStyles, 'identity', s.accent);
    const body = `
<div style="max-width:210mm; margin:0 auto;">

  <!-- HEADER BANDE -->
  <div style="background:${headerBg}; color:white; padding:18mm 22mm 14mm 22mm;">
    <div style="display:flex; justify-content:space-between; align-items:flex-end; gap:12pt;">
      <div style="display:flex; align-items:flex-end; gap:12pt;">
        ${cvData.photo ? `<div style="flex-shrink:0;">${this._photoHTML(cvData, '60pt', 'border-radius:8pt; border:2pt solid rgba(255,255,255,0.4);')}</div>` : ''}
        <div>
          <div style="font-size:28pt; font-weight:300; letter-spacing:-0.5pt; margin-bottom:4pt;">${cvData.prenom || ''} <strong>${cvData.nom || ''}</strong></div>
          <div style="font-size:13pt; opacity:0.9; font-style:italic;">${cvData.titre_poste || ''}</div>
        </div>
      </div>
      <div style="text-align:right; font-size:8.5pt; opacity:0.85; line-height:1.8; flex-shrink:0;">
        ${cvData.email ? `<div>${cvData.email}</div>` : ''}
        ${cvData.telephone ? `<div>${cvData.telephone}</div>` : ''}
        ${cvData.adresse ? `<div>${cvData.adresse}</div>` : ''}
        ${cvData.linkedin ? `<div>${cvData.linkedin}</div>` : ''}
      </div>
    </div>
    ${cvData.resume ? `<div style="margin-top:12pt; font-size:9.5pt; opacity:0.9; line-height:1.6; border-top:1pt solid rgba(255,255,255,0.3); padding-top:10pt;">${cvData.resume}</div>` : ''}
  </div>

  <!-- CORPS -->
  <div style="padding:16mm 22mm;">
    ${cvData.experiences && cvData.experiences.length ? `${this._sectionTitle('Expérience professionnelle', s)}${this._expItems(cvData.experiences, s, blockStyles)}` : ''}
    ${cvData.formations && cvData.formations.length ? `${this._sectionTitle('Formation', s)}${this._formItems(cvData.formations, s)}` : ''}
    ${(cvData.competences_techniques || cvData.competences_soft || cvData.langues) ? `
    ${this._sectionTitle('Compétences', s)}
    <div style="display:flex; flex-wrap:wrap; gap:6pt;">
      ${cvData.competences_techniques ? `<div style="background:${s.accentLight}; border-left:3pt solid ${s.accent}; padding:7pt 10pt; flex:1; min-width:45%;"><div style="font-weight:700; color:${s.accent}; font-size:8.5pt; margin-bottom:4pt;">Techniques</div>${this._bulletList(cvData.competences_techniques, s)}</div>` : ''}
      ${cvData.competences_soft ? `<div style="background:${s.accentLight}; border-left:3pt solid ${s.accent}; padding:7pt 10pt; flex:1; min-width:45%;"><div style="font-weight:700; color:${s.accent}; font-size:8.5pt; margin-bottom:4pt;">Soft Skills</div>${this._bulletList(cvData.competences_soft, s)}</div>` : ''}
      ${cvData.langues ? `<div style="background:${s.accentLight}; border-left:3pt solid ${s.accent}; padding:7pt 10pt; flex:1; min-width:45%;"><div style="font-weight:700; color:${s.accent}; font-size:8.5pt; margin-bottom:4pt;">Langues</div>${this._bulletList(cvData.langues, s)}</div>` : ''}
    </div>` : ''}
    ${cvData.interets ? `${this._sectionTitle('Centres d\'intérêt', s)}<div style="font-size:9.5pt; color:${s.subtext};">${cvData.interets}</div>` : ''}
  </div>
</div>`;
    return this._html(`CV - ${cvData.prenom} ${cvData.nom}`, '', body, s.font);
  }

  /* =============================
     FORME 4 : TIMELINE
  ============================= */
  timeline(cvData, s, blockStyles) {
    const expTimeline = (cvData.experiences || []).map((exp, i) => {
      const cs = this._blockContainerStyle(blockStyles, `exp_${i}`, s);
      return `
<div style="display:flex; margin-bottom:14pt; page-break-inside:avoid;">
  <div style="width:16pt; flex-shrink:0; display:flex; flex-direction:column; align-items:center;">
    <div style="width:10pt; height:10pt; border-radius:50%; background:${s.accent}; flex-shrink:0; margin-top:3pt;"></div>
    <div style="width:1.5pt; flex:1; background:${s.lineColor}; margin-top:3pt;"></div>
  </div>
  <div style="padding-left:10pt; flex:1; ${cs}">
    <div style="font-weight:700; font-size:11pt; color:${s.text};">${exp.poste || ''}</div>
    <div style="font-size:9.5pt; color:${s.accent}; margin-bottom:3pt;">
      ${exp.entreprise || ''}${exp.localisation ? ' · ' + exp.localisation : ''}
      ${(exp.date_debut || exp.date_fin) ? ` · <em style="color:${s.subtext}">${exp.date_debut || ''}${exp.date_fin ? ' – ' + exp.date_fin : ''}</em>` : ''}
    </div>
    ${exp.description ? `<div style="font-size:9.5pt; line-height:1.5; color:${s.subtext}; white-space:pre-line;">${exp.description}</div>` : ''}
  </div>
</div>`;
    }).join('');

    const formTimeline = (cvData.formations || []).map(f => `
<div style="display:flex; margin-bottom:10pt; page-break-inside:avoid;">
  <div style="width:16pt; flex-shrink:0; display:flex; flex-direction:column; align-items:center;">
    <div style="width:8pt; height:8pt; border-radius:50%; background:${s.accentMid}; flex-shrink:0; margin-top:3pt;"></div>
    <div style="width:1.5pt; flex:1; background:${s.lineColor}; margin-top:3pt;"></div>
  </div>
  <div style="padding-left:10pt; flex:1;">
    <div style="font-weight:600; font-size:10.5pt; color:${s.text};">${f.diplome || ''}</div>
    <div style="font-size:9.5pt; color:${s.subtext};">
      ${f.etablissement || ''}${f.localisation ? ' · ' + f.localisation : ''}${(f.date_fin || f.annee) ? ' · ' + (f.date_fin || f.annee) : ''}
    </div>
  </div>
</div>`).join('');

    const body = `
<div style="max-width:210mm; margin:0 auto; padding:20mm 22mm;">

  <!-- HEADER -->
  <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:18pt; padding-bottom:12pt; border-bottom:2pt solid ${s.accent};">
    <div style="display:flex; align-items:flex-end; gap:12pt;">
      ${cvData.photo ? `<div style="flex-shrink:0;">${this._photoHTML(cvData, '55pt')}</div>` : ''}
      <div>
        <div style="font-size:24pt; font-weight:700; color:${s.text}; margin-bottom:3pt;">${cvData.prenom || ''} ${cvData.nom || ''}</div>
        <div style="font-size:12pt; color:${s.accent}; font-style:italic;">${cvData.titre_poste || ''}</div>
      </div>
    </div>
    <div style="text-align:right; font-size:9pt; color:${s.subtext}; line-height:1.8;">
      ${cvData.email ? `<div>${cvData.email}</div>` : ''}
      ${cvData.telephone ? `<div>${cvData.telephone}</div>` : ''}
      ${cvData.adresse ? `<div>${cvData.adresse}</div>` : ''}
    </div>
  </div>

  ${cvData.resume ? `
  <div style="background:${s.accentLight}; border-left:4pt solid ${s.accent}; padding:10pt 14pt; font-size:10pt; line-height:1.7; color:${s.subtext}; margin-bottom:16pt;">${cvData.resume}</div>` : ''}

  ${cvData.experiences && cvData.experiences.length ? `${this._sectionTitle('Expérience', s)}${expTimeline}` : ''}
  ${cvData.formations && cvData.formations.length ? `${this._sectionTitle('Formation', s)}${formTimeline}` : ''}

  ${(cvData.competences_techniques || cvData.competences_soft || cvData.langues) ? `
  ${this._sectionTitle('Compétences', s)}
  <div style="display:flex; flex-wrap:wrap; gap:8pt;">
    ${cvData.competences_techniques ? `<div style="flex:2; min-width:180pt;"><div style="font-weight:700; color:${s.accent}; font-size:9pt; margin-bottom:4pt;">Techniques</div>${this._bulletList(cvData.competences_techniques, s)}</div>` : ''}
    ${cvData.competences_soft ? `<div style="flex:1; min-width:130pt;"><div style="font-weight:700; color:${s.accent}; font-size:9pt; margin-bottom:4pt;">Soft Skills</div>${this._bulletList(cvData.competences_soft, s)}</div>` : ''}
    ${cvData.langues ? `<div style="flex:1; min-width:100pt;"><div style="font-weight:700; color:${s.accent}; font-size:9pt; margin-bottom:4pt;">Langues</div>${this._bulletList(cvData.langues, s)}</div>` : ''}
  </div>` : ''}

  ${cvData.interets ? `${this._sectionTitle('Intérêts', s)}<div style="font-size:9.5pt; color:${s.subtext};">${cvData.interets}</div>` : ''}
</div>`;
    return this._html(`CV - ${cvData.prenom} ${cvData.nom}`, '', body, s.font);
  }

  /* =============================
     FORME 5 : ENCADRÉ (sections en cartes)
  ============================= */
  encadre(cvData, s, blockStyles) {
    const card = (title, content, accentLeft = true) => `
<div style="border:1.5pt solid ${s.lineColor}; border-radius:6pt; ${accentLeft ? `border-left:4pt solid ${s.accent};` : ''} padding:12pt 14pt; margin-bottom:12pt; background:white; page-break-inside:avoid;">
  <div style="font-size:9.5pt; font-weight:700; color:${s.accent}; text-transform:uppercase; letter-spacing:1.5pt; margin-bottom:8pt;">${title}</div>
  ${content}
</div>`;

    const expCards = (cvData.experiences || []).map((exp, i) => {
      const cs = this._blockContainerStyle(blockStyles, `exp_${i}`, s);
      return `
<div style="border:1.5pt solid ${s.lineColor}; border-radius:6pt; border-left:4pt solid ${s.accentMid}; padding:10pt 12pt; margin-bottom:8pt; page-break-inside:avoid; ${cs}">
  <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:3pt;">
    <div style="font-weight:700; font-size:11pt; color:${s.text};">${exp.poste || ''}</div>
    ${(exp.date_debut || exp.date_fin) ? `<div style="font-size:8.5pt; color:${s.subtext}; font-style:italic; flex-shrink:0; margin-left:8pt;">${exp.date_debut || ''}${exp.date_fin ? ' – ' + exp.date_fin : ''}</div>` : ''}
  </div>
  <div style="font-size:9.5pt; color:${s.accent}; margin-bottom:4pt;">${exp.entreprise || ''}${exp.localisation ? ' · ' + exp.localisation : ''}</div>
  ${exp.description ? `<div style="font-size:9.5pt; line-height:1.5; color:${s.subtext}; white-space:pre-line;">${exp.description}</div>` : ''}
</div>`;
    }).join('');

    const body = `
<div style="max-width:210mm; margin:0 auto; padding:16mm 18mm;">

  <!-- HEADER CARD -->
  <div style="background:${s.accent}; color:white; border-radius:8pt; padding:16pt 18pt; margin-bottom:14pt;">
    <div style="display:flex; justify-content:space-between; align-items:flex-end;">
      <div style="display:flex; align-items:flex-end; gap:12pt;">
        ${cvData.photo ? `<div style="flex-shrink:0;">${this._photoHTML(cvData, '55pt', 'border-radius:6pt; border:2pt solid rgba(255,255,255,0.4);')}</div>` : ''}
        <div>
          <div style="font-size:24pt; font-weight:700; margin-bottom:4pt;">${cvData.prenom || ''} ${cvData.nom || ''}</div>
          <div style="font-size:12pt; opacity:0.9; font-style:italic;">${cvData.titre_poste || ''}</div>
        </div>
      </div>
      <div style="text-align:right; font-size:8.5pt; opacity:0.85; line-height:1.8;">
        ${cvData.email ? `<div>${cvData.email}</div>` : ''}
        ${cvData.telephone ? `<div>${cvData.telephone}</div>` : ''}
        ${cvData.adresse ? `<div>${cvData.adresse}</div>` : ''}
        ${cvData.linkedin ? `<div>${cvData.linkedin}</div>` : ''}
      </div>
    </div>
  </div>

  ${cvData.resume ? card('Profil professionnel', `<div style="font-size:10pt; line-height:1.7; color:${s.subtext};">${cvData.resume}</div>`) : ''}

  ${cvData.experiences && cvData.experiences.length ? `
  <div style="font-size:9.5pt; font-weight:700; color:${s.accent}; text-transform:uppercase; letter-spacing:1.5pt; margin-bottom:8pt;">Expérience</div>
  ${expCards}` : ''}

  ${cvData.formations && cvData.formations.length ? card('Formation', `<div style="font-size:9.5pt; line-height:1.7; color:${s.subtext};">${this._formItems(cvData.formations, s)}</div>`) : ''}

  ${(cvData.competences_techniques || cvData.competences_soft || cvData.langues) ? card('Compétences', `
    <div style="display:flex; flex-wrap:wrap; gap:8pt;">
      ${cvData.competences_techniques ? `<div style="flex:2; min-width:150pt;"><div style="font-weight:700; color:${s.accent}; font-size:9pt; margin-bottom:4pt;">Techniques</div>${this._bulletList(cvData.competences_techniques, s)}</div>` : ''}
      ${cvData.competences_soft ? `<div style="flex:1; min-width:120pt;"><div style="font-weight:700; color:${s.accent}; font-size:9pt; margin-bottom:4pt;">Soft Skills</div>${this._bulletList(cvData.competences_soft, s)}</div>` : ''}
      ${cvData.langues ? `<div style="flex:1; min-width:100pt;"><div style="font-weight:700; color:${s.accent}; font-size:9pt; margin-bottom:4pt;">Langues</div>${this._bulletList(cvData.langues, s)}</div>` : ''}
    </div>`) : ''}

  ${cvData.interets ? card('Centres d\'intérêt', `<div style="font-size:9.5pt; color:${s.subtext};">${cvData.interets}</div>`) : ''}
</div>`;
    return this._html(`CV - ${cvData.prenom} ${cvData.nom}`, '', body, s.font);
  }

  /* =============================
     FORME 6 : COMPACT (2 colonnes denses)
  ============================= */
  compact(cvData, s, blockStyles) {
    const expCompact = (cvData.experiences || []).map((exp, i) => `
<div style="margin-bottom:9pt; padding-bottom:7pt; border-bottom:0.5pt solid ${s.lineColor}; page-break-inside:avoid;">
  <div style="display:flex; justify-content:space-between;">
    <div style="font-weight:700; font-size:10.5pt; color:${s.text};">${exp.poste || ''}</div>
    <div style="font-size:8.5pt; color:${s.subtext}; font-style:italic; flex-shrink:0;">${(exp.date_debut || '') + (exp.date_fin ? ' – ' + exp.date_fin : '')}</div>
  </div>
  <div style="font-size:9pt; color:${s.accent}; margin-bottom:2pt;">${exp.entreprise || ''}${exp.localisation ? ' · ' + exp.localisation : ''}</div>
  ${exp.description ? `<div style="font-size:9pt; line-height:1.4; color:${s.subtext}; white-space:pre-line;">${exp.description}</div>` : ''}
</div>`).join('');

    const body = `
<div style="max-width:210mm; margin:0 auto; padding:16mm 18mm;">

  <!-- HEADER COMPACT -->
  <div style="display:flex; justify-content:space-between; align-items:flex-end; padding-bottom:8pt; margin-bottom:14pt; border-bottom:2.5pt solid ${s.accent};">
    <div style="display:flex; align-items:flex-end; gap:10pt;">
      ${cvData.photo ? `<div style="flex-shrink:0;">${this._photoHTML(cvData, '48pt')}</div>` : ''}
      <div>
        <div style="font-size:22pt; font-weight:700; color:${s.text}; letter-spacing:-0.3pt;">${cvData.prenom || ''} ${cvData.nom || ''}</div>
        <div style="font-size:11pt; color:${s.accent};">${cvData.titre_poste || ''}</div>
      </div>
    </div>
    <div style="font-size:8.5pt; color:${s.subtext}; text-align:right; line-height:1.7;">
      ${[cvData.email, cvData.telephone, cvData.adresse].filter(Boolean).join(' | ')}
    </div>
  </div>

  <!-- DEUX COLONNES -->
  <div style="display:flex; gap:16pt;">

    <!-- Colonne gauche (60%) -->
    <div style="flex:6;">
      ${cvData.resume ? `
      <div style="font-size:8.5pt; font-weight:700; color:${s.accent}; text-transform:uppercase; letter-spacing:1.5pt; margin-bottom:5pt; padding-bottom:3pt; border-bottom:1.5pt solid ${s.accentLight};">Profil</div>
      <div style="font-size:9.5pt; line-height:1.6; color:${s.subtext}; margin-bottom:12pt;">${cvData.resume}</div>` : ''}

      <div style="font-size:8.5pt; font-weight:700; color:${s.accent}; text-transform:uppercase; letter-spacing:1.5pt; margin-bottom:5pt; padding-bottom:3pt; border-bottom:1.5pt solid ${s.accentLight};">Expérience</div>
      ${expCompact}
    </div>

    <!-- Colonne droite (40%) -->
    <div style="flex:4; padding-left:12pt; border-left:1.5pt solid ${s.lineColor};">

      ${cvData.formations && cvData.formations.length ? `
      <div style="font-size:8.5pt; font-weight:700; color:${s.accent}; text-transform:uppercase; letter-spacing:1.5pt; margin-bottom:5pt; padding-bottom:3pt; border-bottom:1.5pt solid ${s.accentLight};">Formation</div>
      ${this._formItems(cvData.formations, s)}` : ''}

      ${cvData.competences_techniques ? `
      <div style="margin-top:12pt;">
        <div style="font-size:8.5pt; font-weight:700; color:${s.accent}; text-transform:uppercase; letter-spacing:1.5pt; margin-bottom:5pt; padding-bottom:3pt; border-bottom:1.5pt solid ${s.accentLight};">Compétences techniques</div>
        ${this._bulletList(cvData.competences_techniques, s)}
      </div>` : ''}

      ${cvData.competences_soft ? `
      <div style="margin-top:12pt;">
        <div style="font-size:8.5pt; font-weight:700; color:${s.accent}; text-transform:uppercase; letter-spacing:1.5pt; margin-bottom:5pt; padding-bottom:3pt; border-bottom:1.5pt solid ${s.accentLight};">Soft Skills</div>
        ${this._bulletList(cvData.competences_soft, s)}
      </div>` : ''}

      ${cvData.langues ? `
      <div style="margin-top:12pt;">
        <div style="font-size:8.5pt; font-weight:700; color:${s.accent}; text-transform:uppercase; letter-spacing:1.5pt; margin-bottom:5pt; padding-bottom:3pt; border-bottom:1.5pt solid ${s.accentLight};">Langues</div>
        ${this._bulletList(cvData.langues, s)}
      </div>` : ''}

      ${cvData.interets ? `
      <div style="margin-top:12pt;">
        <div style="font-size:8.5pt; font-weight:700; color:${s.accent}; text-transform:uppercase; letter-spacing:1.5pt; margin-bottom:5pt; padding-bottom:3pt; border-bottom:1.5pt solid ${s.accentLight};">Intérêts</div>
        <div style="font-size:9pt; color:${s.subtext}; line-height:1.6;">${cvData.interets}</div>
      </div>` : ''}
    </div>
  </div>
</div>`;
    return this._html(`CV - ${cvData.prenom} ${cvData.nom}`, '', body, s.font);
  }
  /* ── Minimaliste Pro ── */
  minimalPro(cvData, s, blockStyles) {
    const gold = s.accent;
    const identCS = this._blockContainerStyle(blockStyles, 'identity', s, 'white');
    const resumeCS = this._blockContainerStyle(blockStyles, 'resume', s);
    const expItems = (cvData.experiences || []).map((exp, i) => {
      const cs = this._blockContainerStyle(blockStyles, `exp_${i}`, s);
      return `<div style="${cs} display:flex;gap:16pt;margin-bottom:12pt;padding-bottom:10pt;border-bottom:0.5pt solid #f1f5f9;page-break-inside:avoid;">
        <div style="width:72pt;flex-shrink:0;font-size:8pt;color:#94a3b8;padding-top:2pt;text-align:right;"><em>${exp.date_debut||''}${exp.date_fin?' – '+exp.date_fin:''}</em></div>
        <div style="flex:1;">
          <div style="font-weight:700;font-size:10.5pt;color:#0f172a;margin-bottom:1pt;">${exp.poste||''}</div>
          <div style="font-size:9pt;color:${gold};margin-bottom:4pt;">${exp.entreprise||''}${exp.localisation?' · '+exp.localisation:''}</div>
          ${exp.description?`<div style="font-size:9pt;line-height:1.6;color:#475569;white-space:pre-line;">${exp.description}</div>`:''}
        </div>
      </div>`;
    }).join('');
    const formItems = (cvData.formations || []).map(f => `<div style="display:flex;gap:16pt;margin-bottom:8pt;">
      <div style="width:72pt;flex-shrink:0;font-size:8pt;color:#94a3b8;text-align:right;"><em>${f.date_fin||f.annee||''}</em></div>
      <div><div style="font-weight:600;font-size:10pt;color:#0f172a;">${f.diplome||''}</div><div style="font-size:9pt;color:#64748b;">${f.etablissement||''}${f.localisation?' · '+f.localisation:''}</div></div>
    </div>`).join('');
    const body = `<div style="max-width:210mm;margin:0 auto;padding:22mm 26mm 20mm 26mm;background:white;">
  <div style="${identCS} padding-bottom:14pt;margin-bottom:16pt;border-bottom:1.5pt solid ${gold};">
    ${cvData.photo?`<div style="margin-bottom:8pt;">${this._photoHTML(cvData,'55pt','border-radius:4pt')}</div>`:''}
    <div style="font-size:26pt;font-weight:300;color:#0f172a;letter-spacing:2pt;margin-bottom:3pt;">${cvData.prenom||''} <span style="font-weight:700;">${cvData.nom||''}</span></div>
    <div style="font-size:11pt;color:${gold};letter-spacing:1.5pt;text-transform:uppercase;margin-bottom:7pt;">${cvData.titre_poste||''}</div>
    <div style="font-size:8.5pt;color:#64748b;letter-spacing:0.5pt;">${[cvData.email,cvData.telephone,cvData.adresse,cvData.linkedin].filter(Boolean).join('  ·  ')}</div>
  </div>
  ${cvData.resume?`<div style="${resumeCS} font-size:10pt;line-height:1.8;color:#334155;margin-bottom:18pt;padding-left:10pt;border-left:2pt solid ${gold};">${cvData.resume}</div>`:''}
  ${(cvData.experiences||[]).length?`<div style="margin-bottom:16pt;"><div style="font-size:8pt;font-weight:700;color:${gold};text-transform:uppercase;letter-spacing:2.5pt;margin-bottom:10pt;">Expérience</div>${expItems}</div>`:''}
  ${(cvData.formations||[]).length?`<div style="margin-bottom:16pt;"><div style="font-size:8pt;font-weight:700;color:${gold};text-transform:uppercase;letter-spacing:2.5pt;margin-bottom:10pt;">Formation</div>${formItems}</div>`:''}
  ${(cvData.competences_techniques||cvData.competences_soft||cvData.langues)?`<div>
    <div style="font-size:8pt;font-weight:700;color:${gold};text-transform:uppercase;letter-spacing:2.5pt;margin-bottom:10pt;">Compétences</div>
    <div style="display:flex;gap:14pt;flex-wrap:wrap;">
      ${cvData.competences_techniques?`<div style="flex:2;min-width:130pt;"><div style="font-size:8pt;color:#94a3b8;margin-bottom:4pt;">Techniques</div>${this._bulletList(cvData.competences_techniques,s)}</div>`:''}
      ${cvData.competences_soft?`<div style="flex:1;min-width:100pt;"><div style="font-size:8pt;color:#94a3b8;margin-bottom:4pt;">Soft Skills</div>${this._bulletList(cvData.competences_soft,s)}</div>`:''}
      ${cvData.langues?`<div style="flex:1;min-width:80pt;"><div style="font-size:8pt;color:#94a3b8;margin-bottom:4pt;">Langues</div>${this._bulletList(cvData.langues,s)}</div>`:''}
    </div>
  </div>`:''}
</div>`;
    return this._html(`CV - ${cvData.prenom} ${cvData.nom}`, '', body, "'Helvetica Neue',Helvetica,Arial,sans-serif");
  }

  /* ── Dark Premium ── */
  darkPremium(cvData, s, blockStyles) {
    const gold = '#d4af37';
    const goldMid = '#c9a227';
    const bg = '#0f0f1a';
    const bgCard = '#16162a';
    const textPrimary = '#f0f0f5';
    const textSub = '#9090a8';
    const borderColor = '#2a2a40';
    const expCards = (cvData.experiences || []).map((exp, i) => {
      const cs = this._blockContainerStyle(blockStyles, `exp_${i}`, { ...s, accent: gold, lineColor: borderColor });
      return `<div style="${cs} background:${bgCard};border:1pt solid ${borderColor};border-left:3pt solid ${gold};border-radius:4pt;padding:10pt 14pt;margin-bottom:8pt;page-break-inside:avoid;">
        <div style="display:flex;justify-content:space-between;margin-bottom:2pt;">
          <div style="font-weight:700;font-size:11pt;color:${textPrimary};">${exp.poste||''}</div>
          <div style="font-size:8.5pt;color:${gold};font-style:italic;">${exp.date_debut||''}${exp.date_fin?' – '+exp.date_fin:''}</div>
        </div>
        <div style="font-size:9.5pt;color:${gold};opacity:0.8;margin-bottom:4pt;">${exp.entreprise||''}${exp.localisation?' · '+exp.localisation:''}</div>
        ${exp.description?`<div style="font-size:9pt;line-height:1.5;color:${textSub};white-space:pre-line;">${exp.description}</div>`:''}
      </div>`;
    }).join('');
    const sTitle = (t) => `<div style="font-size:8pt;font-weight:700;color:${gold};text-transform:uppercase;letter-spacing:2pt;margin-bottom:10pt;padding-bottom:4pt;border-bottom:0.5pt solid ${borderColor};">${t}</div>`;
    const body = `<div style="max-width:210mm;margin:0 auto;background:${bg};min-height:297mm;padding:20mm 22mm;">
  <div style="padding-bottom:14pt;margin-bottom:16pt;border-bottom:1pt solid ${gold};">
    <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:12pt;">
      <div style="display:flex;align-items:flex-end;gap:12pt;">
        ${cvData.photo?`<div style="flex-shrink:0;">${this._photoHTML(cvData,'65pt','border-radius:4pt;border:1.5pt solid '+gold)}</div>`:''}
        <div>
          <div style="font-size:24pt;font-weight:700;color:${textPrimary};letter-spacing:1.5pt;margin-bottom:3pt;">${cvData.prenom||''} ${cvData.nom||''}</div>
          <div style="font-size:11pt;color:${gold};letter-spacing:2pt;text-transform:uppercase;">${cvData.titre_poste||''}</div>
        </div>
      </div>
      <div style="text-align:right;font-size:8.5pt;color:${textSub};line-height:1.8;">
        ${[cvData.email,cvData.telephone,cvData.adresse].filter(Boolean).map(t=>`<div>${t}</div>`).join('')}
      </div>
    </div>
    ${cvData.resume?`<div style="margin-top:10pt;font-size:9.5pt;color:${textSub};line-height:1.7;border-left:3pt solid ${gold};padding-left:10pt;">${cvData.resume}</div>`:''}
  </div>
  ${(cvData.experiences||[]).length?`<div style="margin-bottom:16pt;">${sTitle('Expérience')}${expCards}</div>`:''}
  ${(cvData.formations||[]).length?`<div style="margin-bottom:16pt;">${sTitle('Formation')}<div style="background:${bgCard};border:1pt solid ${borderColor};border-radius:4pt;padding:10pt 14pt;">${this._formItems(cvData.formations,{...s,text:textPrimary,subtext:textSub,accent:gold})}</div></div>`:''}
  ${(cvData.competences_techniques||cvData.competences_soft||cvData.langues)?`<div>${sTitle('Compétences')}<div style="display:flex;flex-wrap:wrap;gap:8pt;">
    ${cvData.competences_techniques?`<div style="background:${bgCard};border:1pt solid ${borderColor};border-left:3pt solid ${gold};padding:8pt 12pt;border-radius:3pt;flex:2;min-width:130pt;"><div style="font-size:8pt;color:${gold};margin-bottom:4pt;">Techniques</div>${this._bulletList(cvData.competences_techniques,{...s,subtext:textSub})}</div>`:''}
    ${cvData.competences_soft?`<div style="background:${bgCard};border:1pt solid ${borderColor};border-left:3pt solid ${goldMid};padding:8pt 12pt;border-radius:3pt;flex:1;min-width:100pt;"><div style="font-size:8pt;color:${gold};margin-bottom:4pt;">Soft Skills</div>${this._bulletList(cvData.competences_soft,{...s,subtext:textSub})}</div>`:''}
    ${cvData.langues?`<div style="background:${bgCard};border:1pt solid ${borderColor};border-left:3pt solid ${goldMid};padding:8pt 12pt;border-radius:3pt;flex:1;min-width:80pt;"><div style="font-size:8pt;color:${gold};margin-bottom:4pt;">Langues</div>${this._bulletList(cvData.langues,{...s,subtext:textSub})}</div>`:''}
  </div></div>`:''}
</div>`;
    return this._html(`CV - ${cvData.prenom} ${cvData.nom}`, '', body, "'Helvetica Neue',Helvetica,Arial,sans-serif");
  }
}

module.exports = new CVBuilderFactory();
