/**
 * cvBuilderPreview.js — Port ES module du cvBuilderFactory backend
 * Génère du HTML identique pour la prévisualisation temps réel côté client
 */

const STYLES = {
  anthracite: { accent: '#1a1a2e', accentMid: '#2d2d4e', accentLight: '#eaeaf0', text: '#1a1a1a', subtext: '#4a4a5a', sidebarBg: '#1a1a2e', sidebarText: '#f0f0f5', lineColor: '#ccccdd', font: "'Helvetica Neue', Arial, sans-serif" },
  ocean:       { accent: '#0369a1', accentMid: '#0284c7', accentLight: '#e0f2fe', text: '#0c4a6e', subtext: '#475569', sidebarBg: '#0c4a6e', sidebarText: '#e0f2fe', lineColor: '#bae6fd', font: 'Arial, sans-serif' },
  foret:       { accent: '#15803d', accentMid: '#16a34a', accentLight: '#dcfce7', text: '#14532d', subtext: '#374151', sidebarBg: '#14532d', sidebarText: '#dcfce7', lineColor: '#bbf7d0', font: 'Arial, sans-serif' },
  corail:      { accent: '#dc2626', accentMid: '#ef4444', accentLight: '#fee2e2', text: '#7f1d1d', subtext: '#374151', sidebarBg: '#7f1d1d', sidebarText: '#fecaca', lineColor: '#fca5a5', font: 'Arial, sans-serif' },
  violet:      { accent: '#7c3aed', accentMid: '#8b5cf6', accentLight: '#ede9fe', text: '#4c1d95', subtext: '#374151', sidebarBg: '#4c1d95', sidebarText: '#ede9fe', lineColor: '#c4b5fd', font: 'Arial, sans-serif' },
  or:          { accent: '#b45309', accentMid: '#d97706', accentLight: '#fef3c7', text: '#78350f', subtext: '#6b7280', sidebarBg: '#78350f', sidebarText: '#fde68a', lineColor: '#fde68a', font: 'Georgia, serif' },
  ardoise:     { accent: '#475569', accentMid: '#64748b', accentLight: '#f1f5f9', text: '#1e293b', subtext: '#64748b', sidebarBg: '#334155', sidebarText: '#f1f5f9', lineColor: '#cbd5e1', font: "'Helvetica Neue', Arial, sans-serif" },
  rose:        { accent: '#db2777', accentMid: '#ec4899', accentLight: '#fce7f3', text: '#831843', subtext: '#374151', sidebarBg: '#831843', sidebarText: '#fce7f3', lineColor: '#f9a8d4', font: 'Arial, sans-serif' },
};

/* ── Block styles helpers ──────────────────────────────────────────────── */

/**
 * Retourne uniquement les propriétés CSS que l'utilisateur a EXPLICITEMENT définies.
 * À placer EN FIN de style="" pour surcharger les styles du template.
 */
function _bso(blockStyles, key, s) {
  if (!blockStyles?.[key]) return '';
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
    if (bs.borderStyle === 'shadow') css += 'box-shadow:0 2pt 8pt rgba(0,0,0,0.1);';
  }
  return css;
}

function _blockBg(blockStyles, key, fallback = 'transparent') {
  return blockStyles?.[key]?.bgColor || fallback;
}

function _bulletList(str, s) {
  if (!str) return ''
  const items = str.split(',').map(t => t.trim()).filter(Boolean)
  if (!items.length) return `<span style="font-size:9pt;color:${s.subtext};">${str}</span>`
  return `<ul style="padding-left:12pt;margin:0;">${items.map(item => `<li style="font-size:9pt;color:${s.subtext};margin-bottom:1.5pt;line-height:1.35;">${item}</li>`).join('')}</ul>`
}

function _sectionTitle(label, s) {
  return `<h2 style="font-size:10pt;font-weight:700;color:${s.accent};text-transform:uppercase;letter-spacing:1.5pt;margin:11pt 0 5pt 0;padding-bottom:2.5pt;border-bottom:1.5pt solid ${s.accentLight};">${label}</h2>`;
}
function _contactInfo(cvData, sep = ' | ') {
  return [cvData.email, cvData.telephone, cvData.adresse, cvData.linkedin].filter(Boolean).join(sep);
}
function _photoHTML(cvData, size = '65pt', style = 'border-radius:50%') {
  if (!cvData.photo) return `<div style="width:${size};height:${size};border-radius:50%;background:rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;font-size:20pt;opacity:0.3;">👤</div>`;
  return `<img src="${cvData.photo}" alt="photo" style="width:${size};height:${size};object-fit:cover;${style};" />`;
}
function _expItems(experiences, s, blockStyles) {
  return (experiences || []).map((exp, i) => {
    const bsoStr = _bso(blockStyles, `exp_${i}`, s);
    return `<div style="margin-bottom:9pt;padding-bottom:7pt;border-bottom:0.5pt solid ${s.lineColor};page-break-inside:avoid; ${bsoStr}">
      <div style="font-weight:700;font-size:10.5pt;color:${s.text};margin-bottom:1.5pt;">${exp.poste || ''}</div>
      <div style="font-size:9pt;color:${s.subtext};margin-bottom:2pt;">
        ${exp.entreprise ? `<strong style="color:${s.accent}">${exp.entreprise}</strong>` : ''}
        ${exp.localisation ? ` &bull; ${exp.localisation}` : ''}
        ${(exp.date_debut || exp.date_fin) ? ` &bull; <em>${exp.date_debut || ''}${exp.date_fin ? ' – ' + exp.date_fin : ''}</em>` : ''}
      </div>
      ${exp.description ? `<div style="font-size:9pt;line-height:1.4;color:${s.subtext};white-space:pre-line;">${exp.description}</div>` : ''}
    </div>`;
  }).join('');
}
function _formItems(formations, s) {
  return (formations || []).map(f => `
    <div style="margin-bottom:6pt;page-break-inside:avoid;">
      <div style="font-weight:600;font-size:10pt;color:${s.text};">${f.diplome || ''}</div>
      <div style="font-size:9pt;color:${s.subtext};">${f.etablissement || ''}${f.localisation ? ' &bull; ' + f.localisation : ''}${(f.date_fin || f.annee) ? ' &bull; ' + (f.date_fin || f.annee) : ''}</div>
    </div>`).join('');
}
function _wrap(font, body) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:${font};font-size:9.5pt;line-height:1.45;color:#1a1a1a;background:white;-webkit-font-smoothing:antialiased;}@page{size:A4;margin:0;}</style></head><body>${body}</body></html>`;
}

/* ── Classique ── */
function classique(cvData, s, blockStyles) {
  const body = `<div style="height:297mm;overflow:hidden;max-width:210mm;margin:0 auto;padding:14mm 18mm 12mm 18mm;">
  <div style="text-align:center;padding-bottom:10pt;margin-bottom:12pt;border-bottom:2pt solid ${s.accent}; ${_bso(blockStyles,'identity',s)}">
    ${cvData.photo ? `<div style="margin-bottom:6pt;">${_photoHTML(cvData, '55pt')}</div>` : ''}
    <div style="font-size:22pt;font-weight:700;color:${s.text};letter-spacing:1pt;margin-bottom:3pt;">${cvData.prenom || ''} ${cvData.nom || ''}</div>
    <div style="font-size:11pt;color:${s.accent};margin-bottom:4pt;font-style:italic;">${cvData.titre_poste || ''}</div>
    <div style="font-size:8.5pt;color:${s.subtext};">${_contactInfo(cvData)}</div>
  </div>
  ${cvData.resume ? `${_sectionTitle('Profil', s)}<div style="font-size:9.5pt;line-height:1.6;color:${s.subtext};text-align:justify;border-left:3pt solid ${s.accentLight};padding:7pt 9pt;margin-bottom:2pt; ${_bso(blockStyles,'resume',s)}">${cvData.resume}</div>` : ''}
  ${(cvData.experiences||[]).length ? `${_sectionTitle('Expérience professionnelle', s)}${_expItems(cvData.experiences, s, blockStyles)}` : ''}
  ${(cvData.formations||[]).length ? `${_sectionTitle('Formation', s)}${_formItems(cvData.formations, s)}` : ''}
  ${(cvData.competences_techniques||cvData.competences_soft||cvData.langues) ? `${_sectionTitle('Compétences', s)}<div style="display:flex;flex-wrap:wrap;gap:6pt; ${_bso(blockStyles,'competences',s)}">
    ${cvData.competences_techniques ? `<div style="background:${s.accentLight};padding:6pt 8pt;border-radius:3pt;font-size:9pt;flex:1;min-width:40%;"><div style="font-weight:700;color:${s.accent};margin-bottom:3pt;">Techniques</div>${_bulletList(cvData.competences_techniques,s)}</div>` : ''}
    ${cvData.competences_soft ? `<div style="background:${s.accentLight};padding:6pt 8pt;border-radius:3pt;font-size:9pt;flex:1;min-width:40%;"><div style="font-weight:700;color:${s.accent};margin-bottom:3pt;">Soft Skills</div>${_bulletList(cvData.competences_soft,s)}</div>` : ''}
    ${cvData.langues ? `<div style="background:${s.accentLight};padding:6pt 8pt;border-radius:3pt;font-size:9pt;flex:1;min-width:40%;"><div style="font-weight:700;color:${s.accent};margin-bottom:3pt;">Langues</div>${_bulletList(cvData.langues,s)}</div>` : ''}
  </div>` : ''}
</div>`;
  return _wrap(s.font, body);
}

/* ── Deux colonnes ── */
function deuxColonnes(cvData, s, blockStyles) {
  const sidebarBg = _blockBg(blockStyles, 'sidebar', s.sidebarBg);
  const sidebarColor = s.sidebarText;
  const sidebar = `<div style="width:34%;background:${sidebarBg};color:${sidebarColor};padding:16mm 10mm;">
    <div style="margin:0 auto 10pt auto;text-align:center;">${_photoHTML(cvData, '68pt')}</div>
    <div style="text-align:center;margin-bottom:12pt;padding-bottom:8pt;border-bottom:1pt solid rgba(255,255,255,0.2);">
      <div style="font-size:12pt;font-weight:700;">${cvData.prenom || ''}<br>${cvData.nom || ''}</div>
      <div style="font-size:8.5pt;margin-top:3pt;opacity:0.85;">${cvData.titre_poste || ''}</div>
    </div>
    ${cvData.email||cvData.telephone||cvData.adresse||cvData.linkedin ? `<div style="margin-bottom:10pt;"><div style="font-size:7.5pt;font-weight:700;text-transform:uppercase;letter-spacing:1.5pt;margin-bottom:4pt;opacity:0.65;">Contact</div>
      ${cvData.email?`<div style="font-size:8pt;margin-bottom:2pt;word-break:break-all;">${cvData.email}</div>`:''}
      ${cvData.telephone?`<div style="font-size:8pt;margin-bottom:2pt;">${cvData.telephone}</div>`:''}
      ${cvData.adresse?`<div style="font-size:8pt;margin-bottom:2pt;">${cvData.adresse}</div>`:''}
      ${cvData.linkedin?`<div style="font-size:8pt;word-break:break-all;">${cvData.linkedin}</div>`:''}</div>` : ''}
    ${cvData.competences_techniques?`<div style="margin-bottom:8pt;"><div style="font-size:7.5pt;font-weight:700;text-transform:uppercase;letter-spacing:1.5pt;margin-bottom:3pt;opacity:0.65;">Compétences</div><ul style="padding-left:10pt;margin:0;">${cvData.competences_techniques.split(',').map(t=>t.trim()).filter(Boolean).map(t=>`<li style="font-size:8pt;margin-bottom:1.5pt;opacity:0.95;">${t}</li>`).join('')}</ul></div>`:''}
    ${cvData.langues?`<div style="margin-bottom:8pt;"><div style="font-size:7.5pt;font-weight:700;text-transform:uppercase;letter-spacing:1.5pt;margin-bottom:3pt;opacity:0.65;">Langues</div><div style="font-size:8pt;opacity:0.95;">${cvData.langues}</div></div>`:''}
  </div>`;
  const main = `<div style="flex:1;padding:16mm 14mm 14mm 12mm;overflow:hidden;">
    ${cvData.resume?`${_sectionTitle('Profil',s)}<div style="font-size:9.5pt;line-height:1.6;color:${s.subtext};margin-bottom:4pt; ${_bso(blockStyles,'resume',s)}">${cvData.resume}</div>`:''}
    ${(cvData.experiences||[]).length?`${_sectionTitle('Expérience',s)}${_expItems(cvData.experiences,s,blockStyles)}`:''}
    ${(cvData.formations||[]).length?`${_sectionTitle('Formation',s)}${_formItems(cvData.formations,s)}`:''}
  </div>`;
  return _wrap(s.font, `<div style="display:flex;height:297mm;overflow:hidden;max-width:210mm;margin:0 auto;">${sidebar}${main}</div>`);
}

/* ── Header Bande ── */
function headerBande(cvData, s, blockStyles) {
  const headerBg = _blockBg(blockStyles, 'identity', s.accent);
  const body = `<div style="height:297mm;overflow:hidden;max-width:210mm;margin:0 auto;">
  <div style="background:${headerBg};color:white;padding:12mm 18mm 10mm 18mm;">
    <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:10pt;">
      <div style="display:flex;align-items:flex-end;gap:10pt;">
        ${cvData.photo ? `<div style="flex-shrink:0;">${_photoHTML(cvData, '55pt', 'border-radius:6pt;border:2pt solid rgba(255,255,255,0.35)')}</div>` : ''}
        <div><div style="font-size:23pt;font-weight:300;margin-bottom:2pt;">${cvData.prenom||''} <strong>${cvData.nom||''}</strong></div>
        <div style="font-size:11pt;opacity:0.9;font-style:italic;">${cvData.titre_poste||''}</div></div>
      </div>
      <div style="text-align:right;font-size:8pt;opacity:0.85;line-height:1.7;flex-shrink:0;">
        ${cvData.email?`<div>${cvData.email}</div>`:''}${cvData.telephone?`<div>${cvData.telephone}</div>`:''}${cvData.adresse?`<div>${cvData.adresse}</div>`:''}
      </div>
    </div>
    ${cvData.resume?`<div style="margin-top:8pt;font-size:9pt;opacity:0.9;line-height:1.55;border-top:1pt solid rgba(255,255,255,0.3);padding-top:7pt;">${cvData.resume}</div>`:''}
  </div>
  <div style="padding:12mm 18mm 10mm 18mm;">
    ${(cvData.experiences||[]).length?`${_sectionTitle('Expérience professionnelle',s)}${_expItems(cvData.experiences,s,blockStyles)}`:''}
    ${(cvData.formations||[]).length?`${_sectionTitle('Formation',s)}${_formItems(cvData.formations,s)}`:''}
    ${(cvData.competences_techniques||cvData.competences_soft||cvData.langues)?`${_sectionTitle('Compétences',s)}<div style="display:flex;flex-wrap:wrap;gap:5pt;">
      ${cvData.competences_techniques?`<div style="background:${s.accentLight};border-left:2.5pt solid ${s.accent};padding:6pt 8pt;font-size:9pt;flex:1;min-width:40%;"><div style="font-weight:700;color:${s.accent};margin-bottom:2pt;">Techniques</div>${_bulletList(cvData.competences_techniques,s)}</div>`:''}
      ${cvData.competences_soft?`<div style="background:${s.accentLight};border-left:2.5pt solid ${s.accent};padding:6pt 8pt;font-size:9pt;flex:1;min-width:40%;"><div style="font-weight:700;color:${s.accent};margin-bottom:2pt;">Soft Skills</div>${_bulletList(cvData.competences_soft,s)}</div>`:''}
      ${cvData.langues?`<div style="background:${s.accentLight};border-left:2.5pt solid ${s.accent};padding:6pt 8pt;font-size:9pt;flex:1;min-width:40%;"><div style="font-weight:700;color:${s.accent};margin-bottom:2pt;">Langues</div>${_bulletList(cvData.langues,s)}</div>`:''}
    </div>`:''}
  </div>
</div>`;
  return _wrap(s.font, body);
}

/* ── Timeline ── */
function timeline(cvData, s, blockStyles) {
  const expTL = (cvData.experiences||[]).map((exp,i) => {
    const bsoStr = _bso(blockStyles, `exp_${i}`, s);
    return `<div style="display:flex;margin-bottom:10pt;page-break-inside:avoid;">
      <div style="width:14pt;flex-shrink:0;display:flex;flex-direction:column;align-items:center;">
        <div style="width:9pt;height:9pt;border-radius:50%;background:${s.accent};flex-shrink:0;margin-top:2pt;"></div>
        <div style="width:1.5pt;flex:1;background:${s.lineColor};margin-top:2pt;"></div>
      </div>
      <div style="padding-left:8pt;flex:1; ${bsoStr}">
        <div style="font-weight:700;font-size:10.5pt;color:${s.text};">${exp.poste||''}</div>
        <div style="font-size:9pt;color:${s.accent};margin-bottom:2pt;">${exp.entreprise||''}${exp.localisation?' · '+exp.localisation:''} ${(exp.date_debut||exp.date_fin)?'· '+(exp.date_debut||'')+(exp.date_fin?' – '+exp.date_fin:''):''}</div>
        ${exp.description?`<div style="font-size:9pt;line-height:1.4;color:${s.subtext};white-space:pre-line;">${exp.description}</div>`:''}
      </div>
    </div>`;
  }).join('');
  const body = `<div style="height:297mm;overflow:hidden;max-width:210mm;margin:0 auto;padding:14mm 18mm 12mm 18mm;">
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12pt;padding-bottom:8pt;border-bottom:2pt solid ${s.accent}; ${_bso(blockStyles,'identity',s)}">
    <div style="display:flex;gap:10pt;align-items:flex-end;">
      ${cvData.photo?`<div style="flex-shrink:0;">${_photoHTML(cvData,'50pt')}</div>`:''}
      <div><div style="font-size:21pt;font-weight:700;color:${s.text};margin-bottom:2pt;">${cvData.prenom||''} ${cvData.nom||''}</div>
      <div style="font-size:11pt;color:${s.accent};font-style:italic;">${cvData.titre_poste||''}</div></div>
    </div>
    <div style="text-align:right;font-size:8.5pt;color:${s.subtext};line-height:1.7;">${[cvData.email,cvData.telephone,cvData.adresse].filter(Boolean).map(t=>`<div>${t}</div>`).join('')}</div>
  </div>
  ${cvData.resume?`<div style="background:${s.accentLight};border-left:3.5pt solid ${s.accent};padding:8pt 10pt;font-size:9.5pt;line-height:1.6;color:${s.subtext};margin-bottom:12pt; ${_bso(blockStyles,'resume',s)}">${cvData.resume}</div>`:''}
  ${(cvData.experiences||[]).length?`${_sectionTitle('Expérience',s)}${expTL}`:''}
  ${(cvData.formations||[]).length?`${_sectionTitle('Formation',s)}${_formItems(cvData.formations,s)}`:''}
  ${(cvData.competences_techniques||cvData.competences_soft||cvData.langues)?`${_sectionTitle('Compétences',s)}<div style="display:flex;flex-wrap:wrap;gap:5pt; ${_bso(blockStyles,'competences',s)}">
    ${cvData.competences_techniques?`<div style="flex:2;min-width:140pt;"><div style="font-size:8pt;font-weight:700;color:${s.accent};margin-bottom:2pt;">Techniques</div>${_bulletList(cvData.competences_techniques,s)}</div>`:''}
    ${cvData.competences_soft?`<div style="flex:1;min-width:110pt;"><div style="font-size:8pt;font-weight:700;color:${s.accent};margin-bottom:2pt;">Soft Skills</div>${_bulletList(cvData.competences_soft,s)}</div>`:''}
    ${cvData.langues?`<div style="flex:1;min-width:90pt;"><div style="font-size:8pt;font-weight:700;color:${s.accent};margin-bottom:2pt;">Langues</div>${_bulletList(cvData.langues,s)}</div>`:''}
  </div>`:''}
</div>`;
  return _wrap(s.font, body);
}

/* ── Encadré ── */
function encadre(cvData, s, blockStyles) {
  const expCards = (cvData.experiences||[]).map((exp,i)=>{
    const bsoStr = _bso(blockStyles, `exp_${i}`, s);
    return `<div style="border:1.5pt solid ${s.lineColor};border-radius:5pt;border-left:3.5pt solid ${s.accentMid};padding:8pt 10pt;margin-bottom:6pt;page-break-inside:avoid; ${bsoStr}">
      <div style="display:flex;justify-content:space-between;margin-bottom:2pt;">
        <div style="font-weight:700;font-size:10.5pt;color:${s.text};">${exp.poste||''}</div>
        ${(exp.date_debut||exp.date_fin)?`<div style="font-size:8pt;color:${s.subtext};font-style:italic;">${exp.date_debut||''}${exp.date_fin?' – '+exp.date_fin:''}</div>`:''}
      </div>
      <div style="font-size:9pt;color:${s.accent};margin-bottom:3pt;">${exp.entreprise||''}${exp.localisation?' · '+exp.localisation:''}</div>
      ${exp.description?`<div style="font-size:9pt;line-height:1.4;color:${s.subtext};white-space:pre-line;">${exp.description}</div>`:''}
    </div>`;
  }).join('');
  const body = `<div style="height:297mm;overflow:hidden;max-width:210mm;margin:0 auto;padding:12mm 16mm 10mm 16mm;">
  <div style="background:${s.accent};color:white;border-radius:6pt;padding:12pt 16pt;margin-bottom:10pt; ${_bso(blockStyles,'identity',s)}">
    <div style="display:flex;justify-content:space-between;align-items:flex-end;">
      <div style="display:flex;gap:10pt;align-items:flex-end;">
        ${cvData.photo?`<div style="flex-shrink:0;">${_photoHTML(cvData,'50pt','border-radius:5pt;border:1.5pt solid rgba(255,255,255,0.4)')}</div>`:''}
        <div><div style="font-size:21pt;font-weight:700;margin-bottom:2pt;">${cvData.prenom||''} ${cvData.nom||''}</div>
        <div style="font-size:10.5pt;opacity:0.9;font-style:italic;">${cvData.titre_poste||''}</div></div>
      </div>
      <div style="text-align:right;font-size:8pt;opacity:0.85;line-height:1.7;">${[cvData.email,cvData.telephone,cvData.adresse].filter(Boolean).map(t=>`<div>${t}</div>`).join('')}</div>
    </div>
  </div>
  ${cvData.resume?`<div style="border:1.5pt solid ${s.lineColor};border-left:3.5pt solid ${s.accent};border-radius:5pt;padding:9pt 12pt;margin-bottom:8pt;font-size:9.5pt;line-height:1.6;color:${s.subtext}; ${_bso(blockStyles,'resume',s)}">${cvData.resume}</div>`:''}
  ${(cvData.experiences||[]).length?`<div style="font-size:9pt;font-weight:700;color:${s.accent};text-transform:uppercase;letter-spacing:1.5pt;margin-bottom:5pt;">Expérience</div>${expCards}`:''}
  ${(cvData.formations||[]).length?`<div style="border:1.5pt solid ${s.lineColor};border-radius:5pt;border-left:3.5pt solid ${s.accent};padding:9pt 12pt;margin-bottom:8pt;"><div style="font-size:9pt;font-weight:700;color:${s.accent};text-transform:uppercase;letter-spacing:1.5pt;margin-bottom:5pt;">Formation</div>${_formItems(cvData.formations,s)}</div>`:''}
</div>`;
  return _wrap(s.font, body);
}

/* ── Compact ── */
function compact(cvData, s, blockStyles) {
  const expC = (cvData.experiences||[]).map((exp,i)=>{
    const bsoStr = _bso(blockStyles, `exp_${i}`, s);
    return `<div style="margin-bottom:7pt;padding-bottom:5pt;border-bottom:0.5pt solid ${s.lineColor};page-break-inside:avoid; ${bsoStr}">
      <div style="display:flex;justify-content:space-between;">
        <div style="font-weight:700;font-size:10pt;color:${s.text};">${exp.poste||''}</div>
        <div style="font-size:8pt;color:${s.subtext};font-style:italic;">${(exp.date_debut||'')+(exp.date_fin?' – '+exp.date_fin:'')}</div>
      </div>
      <div style="font-size:8.5pt;color:${s.accent};margin-bottom:1.5pt;">${exp.entreprise||''}${exp.localisation?' · '+exp.localisation:''}</div>
      ${exp.description?`<div style="font-size:8.5pt;line-height:1.35;color:${s.subtext};white-space:pre-line;">${exp.description}</div>`:''}
    </div>`;
  }).join('');
  const body = `<div style="height:297mm;overflow:hidden;max-width:210mm;margin:0 auto;padding:12mm 16mm 10mm 16mm;">
  <div style="display:flex;justify-content:space-between;align-items:flex-end;padding-bottom:6pt;margin-bottom:11pt;border-bottom:2pt solid ${s.accent}; ${_bso(blockStyles,'identity',s)}">
    <div style="display:flex;gap:9pt;align-items:flex-end;">
      ${cvData.photo?`<div style="flex-shrink:0;">${_photoHTML(cvData,'44pt')}</div>`:''}
      <div><div style="font-size:19pt;font-weight:700;color:${s.text};">${cvData.prenom||''} ${cvData.nom||''}</div>
      <div style="font-size:10.5pt;color:${s.accent};">${cvData.titre_poste||''}</div></div>
    </div>
    <div style="font-size:8pt;color:${s.subtext};text-align:right;line-height:1.6;">${[cvData.email,cvData.telephone].filter(Boolean).join(' | ')}</div>
  </div>
  <div style="display:flex;gap:14pt;">
    <div style="flex:6;">
      ${cvData.resume?`<div style="font-size:8pt;font-weight:700;color:${s.accent};text-transform:uppercase;letter-spacing:1.5pt;margin-bottom:4pt;padding-bottom:2.5pt;border-bottom:1.5pt solid ${s.accentLight};">Profil</div><div style="font-size:9pt;line-height:1.5;color:${s.subtext};margin-bottom:8pt; ${_bso(blockStyles,'resume',s)}">${cvData.resume}</div>`:''}
      <div style="font-size:8pt;font-weight:700;color:${s.accent};text-transform:uppercase;letter-spacing:1.5pt;margin-bottom:4pt;padding-bottom:2.5pt;border-bottom:1.5pt solid ${s.accentLight};">Expérience</div>
      ${expC}
    </div>
    <div style="flex:4;padding-left:10pt;border-left:1.5pt solid ${s.lineColor};">
      ${(cvData.formations||[]).length?`<div style="font-size:8pt;font-weight:700;color:${s.accent};text-transform:uppercase;letter-spacing:1.5pt;margin-bottom:4pt;padding-bottom:2.5pt;border-bottom:1.5pt solid ${s.accentLight};">Formation</div>${_formItems(cvData.formations,s)}`:''}
      ${cvData.competences_techniques?`<div style="margin-top:8pt;"><div style="font-size:8pt;font-weight:700;color:${s.accent};text-transform:uppercase;letter-spacing:1.5pt;margin-bottom:3pt;">Compétences</div>${_bulletList(cvData.competences_techniques,s)}</div>`:''}
      ${cvData.competences_soft?`<div style="margin-top:6pt;"><div style="font-size:8pt;font-weight:700;color:${s.accent};text-transform:uppercase;letter-spacing:1.5pt;margin-bottom:3pt;">Soft Skills</div>${_bulletList(cvData.competences_soft,s)}</div>`:''}
      ${cvData.langues?`<div style="margin-top:6pt;"><div style="font-size:8pt;font-weight:700;color:${s.accent};text-transform:uppercase;letter-spacing:1.5pt;margin-bottom:3pt;">Langues</div>${_bulletList(cvData.langues,s)}</div>`:''}
    </div>
  </div>
</div>`;
  return _wrap(s.font, body);
}

/* ── Minimaliste Pro ── */
function minimalPro(cvData, s, blockStyles) {
  const gold = s.accent;
  const body = `<div style="height:297mm;overflow:hidden;max-width:210mm;margin:0 auto;padding:18mm 22mm 16mm 22mm;background:white;">
  <div style="padding-bottom:12pt;margin-bottom:14pt;border-bottom:1.5pt solid ${gold}; ${_bso(blockStyles,'identity',s)}">
    ${cvData.photo ? `<div style="margin-bottom:7pt;">${_photoHTML(cvData,'50pt','border-radius:3pt')}</div>` : ''}
    <div style="font-size:24pt;font-weight:300;color:#0f172a;letter-spacing:2pt;margin-bottom:2pt;">${cvData.prenom||''} <span style="font-weight:700;">${cvData.nom||''}</span></div>
    <div style="font-size:10.5pt;color:${gold};letter-spacing:1.5pt;text-transform:uppercase;margin-bottom:6pt;">${cvData.titre_poste||''}</div>
    <div style="font-size:8pt;color:#64748b;letter-spacing:0.5pt;">${[cvData.email,cvData.telephone,cvData.adresse,cvData.linkedin].filter(Boolean).join('  ·  ')}</div>
  </div>
  ${cvData.resume ? `<div style="font-size:9.5pt;line-height:1.7;color:#334155;margin-bottom:14pt;padding-left:9pt;border-left:2pt solid ${gold}; ${_bso(blockStyles,'resume',s)}">${cvData.resume}</div>` : ''}
  ${(cvData.experiences||[]).length ? `<div style="margin-bottom:13pt;">
    <div style="font-size:7.5pt;font-weight:700;color:${gold};text-transform:uppercase;letter-spacing:2.5pt;margin-bottom:8pt;">${'Expérience'}</div>
    ${(cvData.experiences||[]).map((exp,i) => {
      const bsoStr = _bso(blockStyles, `exp_${i}`, s);
      return `<div style="display:flex;gap:14pt;margin-bottom:10pt;padding-bottom:8pt;border-bottom:0.5pt solid #f1f5f9;page-break-inside:avoid; ${bsoStr}">
        <div style="width:68pt;flex-shrink:0;font-size:7.5pt;color:#94a3b8;padding-top:2pt;text-align:right;"><em>${exp.date_debut||''}${exp.date_fin?' – '+exp.date_fin:''}</em></div>
        <div style="flex:1;">
          <div style="font-weight:700;font-size:10pt;color:#0f172a;margin-bottom:1pt;">${exp.poste||''}</div>
          <div style="font-size:8.5pt;color:${gold};margin-bottom:3pt;">${exp.entreprise||''}${exp.localisation?' · '+exp.localisation:''}</div>
          ${exp.description?`<div style="font-size:8.5pt;line-height:1.5;color:#475569;white-space:pre-line;">${exp.description}</div>`:''}
        </div>
      </div>`;
    }).join('')}
  </div>` : ''}
  ${(cvData.formations||[]).length ? `<div style="margin-bottom:13pt;">
    <div style="font-size:7.5pt;font-weight:700;color:${gold};text-transform:uppercase;letter-spacing:2.5pt;margin-bottom:8pt;">Formation</div>
    ${(cvData.formations||[]).map(f=>`<div style="display:flex;gap:14pt;margin-bottom:7pt;">
      <div style="width:68pt;flex-shrink:0;font-size:7.5pt;color:#94a3b8;text-align:right;"><em>${f.date_fin||f.annee||''}</em></div>
      <div><div style="font-weight:600;font-size:9.5pt;color:#0f172a;">${f.diplome||''}</div><div style="font-size:8.5pt;color:#64748b;">${f.etablissement||''}${f.localisation?' · '+f.localisation:''}</div></div>
    </div>`).join('')}
  </div>` : ''}
  ${(cvData.competences_techniques||cvData.competences_soft||cvData.langues) ? `<div>
    <div style="font-size:7.5pt;font-weight:700;color:${gold};text-transform:uppercase;letter-spacing:2.5pt;margin-bottom:8pt;">Compétences</div>
    <div style="display:flex;gap:12pt;flex-wrap:wrap; ${_bso(blockStyles,'competences',s)}">
      ${cvData.competences_techniques?`<div style="flex:2;min-width:120pt;"><div style="font-size:7.5pt;color:#94a3b8;margin-bottom:3pt;">Techniques</div>${_bulletList(cvData.competences_techniques,s)}</div>`:''}
      ${cvData.competences_soft?`<div style="flex:1;min-width:95pt;"><div style="font-size:7.5pt;color:#94a3b8;margin-bottom:3pt;">Soft Skills</div>${_bulletList(cvData.competences_soft,s)}</div>`:''}
      ${cvData.langues?`<div style="flex:1;min-width:75pt;"><div style="font-size:7.5pt;color:#94a3b8;margin-bottom:3pt;">Langues</div>${_bulletList(cvData.langues,s)}</div>`:''}
    </div>
  </div>` : ''}
</div>`;
  return _wrap("'Helvetica Neue',Helvetica,Arial,sans-serif", body);
}

/* ── Dark Premium ── */
function darkPremium(cvData, s, blockStyles) {
  const gold = '#d4af37';
  const goldMid = '#c9a227';
  const bg = '#0f0f1a';
  const bgCard = '#16162a';
  const textPrimary = '#f0f0f5';
  const textSub = '#9090a8';
  const borderColor = '#2a2a40';
  const body = `<div style="height:297mm;overflow:hidden;max-width:210mm;margin:0 auto;background:${bg};padding:16mm 18mm 14mm 18mm;">
  <div style="padding-bottom:12pt;margin-bottom:14pt;border-bottom:1pt solid ${gold};">
    <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:10pt;">
      <div style="display:flex;align-items:flex-end;gap:10pt;">
        ${cvData.photo?`<div style="flex-shrink:0;">${_photoHTML(cvData,'60pt','border-radius:4pt;border:1.5pt solid '+gold)}</div>`:''}
        <div>
          <div style="font-size:22pt;font-weight:700;color:${textPrimary};letter-spacing:1.5pt;margin-bottom:2pt;">${cvData.prenom||''} ${cvData.nom||''}</div>
          <div style="font-size:10.5pt;color:${gold};letter-spacing:2pt;text-transform:uppercase;margin-bottom:3pt;">${cvData.titre_poste||''}</div>
        </div>
      </div>
      <div style="text-align:right;font-size:8pt;color:${textSub};line-height:1.7;">
        ${cvData.email?`<div>${cvData.email}</div>`:''}${cvData.telephone?`<div>${cvData.telephone}</div>`:''}${cvData.adresse?`<div>${cvData.adresse}</div>`:''}
      </div>
    </div>
    ${cvData.resume?`<div style="margin-top:9pt;font-size:9pt;color:${textSub};line-height:1.6;border-left:2.5pt solid ${gold};padding-left:9pt;">${cvData.resume}</div>`:''}
  </div>
  ${(cvData.experiences||[]).length ? `<div style="margin-bottom:13pt;">
    <div style="font-size:7.5pt;font-weight:700;color:${gold};text-transform:uppercase;letter-spacing:2pt;margin-bottom:8pt;padding-bottom:3pt;border-bottom:0.5pt solid ${borderColor};">Expérience</div>
    ${(cvData.experiences||[]).map((exp,i) => {
      const bsoStr = _bso(blockStyles, `exp_${i}`, { ...s, accent: gold, lineColor: borderColor });
      return `<div style="background:${bgCard};border:1pt solid ${borderColor};border-left:2.5pt solid ${gold};border-radius:4pt;padding:8pt 12pt;margin-bottom:6pt;page-break-inside:avoid; ${bsoStr}">
        <div style="display:flex;justify-content:space-between;margin-bottom:2pt;">
          <div style="font-weight:700;font-size:10.5pt;color:${textPrimary};">${exp.poste||''}</div>
          <div style="font-size:8pt;color:${gold};font-style:italic;">${exp.date_debut||''}${exp.date_fin?' – '+exp.date_fin:''}</div>
        </div>
        <div style="font-size:9pt;color:${gold};opacity:0.8;margin-bottom:3pt;">${exp.entreprise||''}${exp.localisation?' · '+exp.localisation:''}</div>
        ${exp.description?`<div style="font-size:8.5pt;line-height:1.4;color:${textSub};white-space:pre-line;">${exp.description}</div>`:''}
      </div>`;
    }).join('')}
  </div>` : ''}
  ${(cvData.formations||[]).length ? `<div style="margin-bottom:13pt;">
    <div style="font-size:7.5pt;font-weight:700;color:${gold};text-transform:uppercase;letter-spacing:2pt;margin-bottom:8pt;padding-bottom:3pt;border-bottom:0.5pt solid ${borderColor};">Formation</div>
    <div style="background:${bgCard};border:1pt solid ${borderColor};border-radius:4pt;padding:9pt 12pt;">${_formItems(cvData.formations,{...s,text:textPrimary,subtext:textSub,accent:gold})}</div>
  </div>` : ''}
  ${(cvData.competences_techniques||cvData.competences_soft||cvData.langues)?`<div>
    <div style="font-size:7.5pt;font-weight:700;color:${gold};text-transform:uppercase;letter-spacing:2pt;margin-bottom:8pt;padding-bottom:3pt;border-bottom:0.5pt solid ${borderColor};">Compétences</div>
    <div style="display:flex;flex-wrap:wrap;gap:7pt;">
      ${cvData.competences_techniques?`<div style="background:${bgCard};border:1pt solid ${borderColor};border-left:2.5pt solid ${gold};padding:7pt 10pt;border-radius:3pt;flex:2;min-width:120pt;"><div style="font-size:7.5pt;color:${gold};margin-bottom:3pt;">Techniques</div>${_bulletList(cvData.competences_techniques,{...s,subtext:textSub})}</div>`:''}
      ${cvData.competences_soft?`<div style="background:${bgCard};border:1pt solid ${borderColor};border-left:2.5pt solid ${goldMid};padding:7pt 10pt;border-radius:3pt;flex:1;min-width:95pt;"><div style="font-size:7.5pt;color:${gold};margin-bottom:3pt;">Soft Skills</div>${_bulletList(cvData.competences_soft,{...s,subtext:textSub})}</div>`:''}
      ${cvData.langues?`<div style="background:${bgCard};border:1pt solid ${borderColor};border-left:2.5pt solid ${goldMid};padding:7pt 10pt;border-radius:3pt;flex:1;min-width:75pt;"><div style="font-size:7.5pt;color:${gold};margin-bottom:3pt;">Langues</div>${_bulletList(cvData.langues,{...s,subtext:textSub})}</div>`:''}
    </div>
  </div>`:''}
</div>`;
  return _wrap("'Helvetica Neue',Helvetica,Arial,sans-serif", body);
}

/* ── Export principal ── */
export function generateCVHTML(cvData, buildConfig = {}) {
  const { shape = 'classique', style = 'ocean', blockStyles = {} } = buildConfig;
  const s = STYLES[style] || STYLES.ocean;
  if (!cvData) return '<html><body><div style="padding:20px;color:#999;">Aucune donnée</div></body></html>';
  switch (shape) {
    case 'deux_colonnes':  return deuxColonnes(cvData, s, blockStyles);
    case 'header_bande':   return headerBande(cvData, s, blockStyles);
    case 'timeline':       return timeline(cvData, s, blockStyles);
    case 'encadre':        return encadre(cvData, s, blockStyles);
    case 'compact':        return compact(cvData, s, blockStyles);
    case 'minimal_pro':    return minimalPro(cvData, s, blockStyles);
    case 'dark_premium':   return darkPremium(cvData, s, blockStyles);
    default:               return classique(cvData, s, blockStyles);
  }
}
