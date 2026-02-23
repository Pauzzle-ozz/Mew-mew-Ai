/**
 * Constantes du CV Builder — Types, Formes, Styles, Presets
 */

export const CV_TYPES = [
  { id: 'finance',    label: 'Finance & Juridique', emoji: '⚖️', desc: 'Banque, droit, audit, conseil, assurance',  defaultShape: 'classique', defaultStyle: 'ardoise' },
  { id: 'creatif',   label: 'Créatif & Arts',       emoji: '🎨', desc: 'Design, art, publicité, communication',    defaultShape: 'classique', defaultStyle: 'ardoise' },
  { id: 'tech',      label: 'Tech & IT',             emoji: '💻', desc: 'Dev, devops, data, cybersécurité',         defaultShape: 'classique', defaultStyle: 'ardoise' },
  { id: 'marketing', label: 'Marketing & Sales',     emoji: '📈', desc: 'Marketing, growth, commercial, retail',   defaultShape: 'classique', defaultStyle: 'ardoise' },
  { id: 'rh',        label: 'RH & Management',       emoji: '🤝', desc: 'RH, management, formation, recrutement', defaultShape: 'classique', defaultStyle: 'ardoise' },
  { id: 'academique',label: 'Académique & Recherche',emoji: '🎓', desc: 'Recherche, enseignement, sciences',       defaultShape: 'classique', defaultStyle: 'ardoise' },
];

export const CV_SHAPES = [
  {
    id: 'classique',
    label: 'Classique ATS',
    desc: 'Professionnel, 1 colonne, optimisé ATS',
    preview: `<div style="width:100%;height:100%;padding:8px;font-size:5px;background:white;">
      <div style="text-align:center;margin-bottom:4px;">
        <div style="height:8px;background:#1a1a1a;border-radius:1px;width:50%;margin:0 auto 2px;"></div>
        <div style="display:flex;justify-content:center;gap:1px;margin-bottom:2px;">
          <span style="font-size:4px;color:#c0392b;">★</span><span style="font-size:4px;color:#f39c12;">★</span><span style="font-size:4px;color:#27ae60;">★</span><span style="font-size:4px;color:#2980b9;">★</span>
        </div>
        <div style="height:3px;background:#e5e7eb;width:65%;margin:0 auto;border-radius:1px;"></div>
      </div>
      <div style="height:4px;background:#1a1a1a;width:35%;margin-bottom:3px;border-radius:1px;"></div>
      <div style="height:3px;background:#f3f4f6;margin-bottom:1px;"></div>
      <div style="height:3px;background:#f3f4f6;margin-bottom:1px;width:90%;"></div>
      <div style="height:3px;background:#f3f4f6;margin-bottom:4px;width:75%;"></div>
      <div style="height:4px;background:#1a1a1a;width:40%;margin-bottom:3px;border-radius:1px;"></div>
      <div style="display:flex;gap:3px;margin-bottom:4px;">
        <div style="height:3px;background:#f3f4f6;flex:1;border-radius:1px;"></div>
        <div style="height:3px;background:#f3f4f6;flex:1;border-radius:1px;"></div>
        <div style="height:3px;background:#f3f4f6;flex:1;border-radius:1px;"></div>
      </div>
      <div style="height:4px;background:#1a1a1a;width:45%;margin-bottom:3px;border-radius:1px;"></div>
      <div style="height:3px;background:#f3f4f6;margin-bottom:1px;"></div>
      <div style="height:3px;background:#f3f4f6;width:85%;"></div>
    </div>`
  },
];

export const CV_STYLES = [
  { id: 'anthracite', label: 'Anthracite', accent: '#1a1a2e', light: '#eaeaf0', desc: 'Élégant & Sobre' },
  { id: 'ocean',      label: 'Océan',      accent: '#0369a1', light: '#e0f2fe', desc: 'Pro & Confiant' },
  { id: 'foret',      label: 'Forêt',      accent: '#15803d', light: '#dcfce7', desc: 'Frais & Naturel' },
  { id: 'corail',     label: 'Corail',     accent: '#dc2626', light: '#fee2e2', desc: 'Énergique & Bold' },
  { id: 'violet',     label: 'Violet',     accent: '#7c3aed', light: '#ede9fe', desc: 'Créatif & Premium' },
  { id: 'or',         label: 'Or',         accent: '#b45309', light: '#fef3c7', desc: 'Luxe & Prestige' },
  { id: 'ardoise',    label: 'Ardoise',    accent: '#475569', light: '#f1f5f9', desc: 'Neutre & Minimal' },
  { id: 'rose',       label: 'Rose',       accent: '#db2777', light: '#fce7f3', desc: 'Audacieux & Moderne' },
];

/** Presets curatés — vide pour l'instant (1 seul template) */
export const CV_PRESETS = [];
