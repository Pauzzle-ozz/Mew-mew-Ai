/**
 * Constantes du CV Builder — Types, Formes, Styles, Presets
 */

export const CV_TYPES = [
  { id: 'finance',    label: 'Finance & Juridique', emoji: '⚖️', desc: 'Banque, droit, audit, conseil, assurance',  defaultShape: 'classique',     defaultStyle: 'anthracite' },
  { id: 'creatif',   label: 'Créatif & Arts',       emoji: '🎨', desc: 'Design, art, publicité, communication',    defaultShape: 'header_bande',  defaultStyle: 'rose' },
  { id: 'tech',      label: 'Tech & IT',             emoji: '💻', desc: 'Dev, devops, data, cybersécurité',         defaultShape: 'deux_colonnes', defaultStyle: 'ocean' },
  { id: 'marketing', label: 'Marketing & Sales',     emoji: '📈', desc: 'Marketing, growth, commercial, retail',   defaultShape: 'header_bande',  defaultStyle: 'corail' },
  { id: 'rh',        label: 'RH & Management',       emoji: '🤝', desc: 'RH, management, formation, recrutement', defaultShape: 'encadre',       defaultStyle: 'foret' },
  { id: 'academique',label: 'Académique & Recherche',emoji: '🎓', desc: 'Recherche, enseignement, sciences',       defaultShape: 'classique',     defaultStyle: 'ardoise' },
];

export const CV_SHAPES = [
  {
    id: 'classique',
    label: 'Classique',
    desc: '1 colonne, flux standard',
    preview: `<div style="width:100%;height:100%;padding:8px;font-size:5px;background:white;">
      <div style="height:18px;background:#e5e7eb;border-radius:2px;margin-bottom:4px;width:60%;"></div>
      <div style="height:6px;background:#f3f4f6;margin-bottom:3px;"></div>
      <div style="height:6px;background:#f3f4f6;margin-bottom:3px;"></div>
      <div style="height:6px;background:#f3f4f6;width:80%;margin-bottom:6px;"></div>
      <div style="height:8px;background:#dbeafe;margin-bottom:3px;border-radius:2px;"></div>
      <div style="height:5px;background:#f3f4f6;margin-bottom:2px;width:90%;"></div>
      <div style="height:5px;background:#f3f4f6;margin-bottom:2px;width:75%;"></div>
    </div>`
  },
  {
    id: 'deux_colonnes',
    label: '2 Colonnes',
    desc: 'Sidebar gauche + contenu',
    preview: `<div style="width:100%;height:100%;display:flex;background:white;">
      <div style="width:35%;background:#1e3a5f;padding:6px;">
        <div style="width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,0.2);margin:0 auto 4px;"></div>
        <div style="height:4px;background:rgba(255,255,255,0.4);margin-bottom:2px;border-radius:2px;"></div>
        <div style="height:3px;background:rgba(255,255,255,0.2);margin-bottom:2px;border-radius:2px;width:80%;"></div>
        <div style="height:3px;background:rgba(255,255,255,0.2);border-radius:2px;width:60%;"></div>
      </div>
      <div style="flex:1;padding:6px;">
        <div style="height:5px;background:#dbeafe;margin-bottom:3px;border-radius:2px;"></div>
        <div style="height:4px;background:#f3f4f6;margin-bottom:2px;"></div>
        <div style="height:4px;background:#f3f4f6;margin-bottom:2px;width:85%;"></div>
        <div style="height:4px;background:#f3f4f6;width:70%;"></div>
      </div>
    </div>`
  },
  {
    id: 'header_bande',
    label: 'Header Bande',
    desc: 'Bandeau pleine largeur',
    preview: `<div style="width:100%;height:100%;background:white;overflow:hidden;">
      <div style="height:32px;background:#1e3a5f;padding:6px;">
        <div style="height:6px;background:rgba(255,255,255,0.9);border-radius:2px;width:55%;margin-bottom:3px;"></div>
        <div style="height:4px;background:rgba(255,255,255,0.5);border-radius:2px;width:40%;"></div>
      </div>
      <div style="padding:6px;">
        <div style="height:4px;background:#dbeafe;margin-bottom:3px;border-radius:2px;"></div>
        <div style="height:4px;background:#f3f4f6;margin-bottom:2px;"></div>
        <div style="height:4px;background:#f3f4f6;margin-bottom:2px;width:85%;"></div>
        <div style="height:4px;background:#f3f4f6;width:70%;"></div>
      </div>
    </div>`
  },
  {
    id: 'timeline',
    label: 'Timeline',
    desc: 'Chronologie verticale',
    preview: `<div style="width:100%;height:100%;padding:8px;background:white;">
      <div style="height:10px;background:#1e3a5f;border-radius:4px;margin-bottom:6px;"></div>
      <div style="display:flex;gap:4px;margin-bottom:4px;">
        <div style="width:6px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;">
          <div style="width:6px;height:6px;border-radius:50%;background:#3b82f6;"></div>
          <div style="width:1px;height:10px;background:#dbeafe;"></div>
        </div>
        <div style="flex:1;"><div style="height:4px;background:#f3f4f6;margin-bottom:2px;border-radius:2px;"></div><div style="height:3px;background:#f3f4f6;width:75%;border-radius:2px;"></div></div>
      </div>
      <div style="display:flex;gap:4px;">
        <div style="width:6px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;">
          <div style="width:6px;height:6px;border-radius:50%;background:#3b82f6;"></div>
        </div>
        <div style="flex:1;"><div style="height:4px;background:#f3f4f6;margin-bottom:2px;border-radius:2px;"></div><div style="height:3px;background:#f3f4f6;width:60%;border-radius:2px;"></div></div>
      </div>
    </div>`
  },
  {
    id: 'encadre',
    label: 'Encadré',
    desc: 'Sections en cartes',
    preview: `<div style="width:100%;height:100%;padding:6px;background:#f9fafb;">
      <div style="background:#1e3a5f;border-radius:4px;padding:6px;margin-bottom:4px;">
        <div style="height:5px;background:rgba(255,255,255,0.8);border-radius:2px;margin-bottom:2px;width:55%;"></div>
        <div style="height:3px;background:rgba(255,255,255,0.5);border-radius:2px;width:40%;"></div>
      </div>
      <div style="background:white;border:1px solid #e5e7eb;border-left:3px solid #3b82f6;border-radius:3px;padding:4px;margin-bottom:3px;">
        <div style="height:4px;background:#dbeafe;margin-bottom:2px;border-radius:2px;width:60%;"></div>
        <div style="height:3px;background:#f3f4f6;border-radius:2px;"></div>
      </div>
      <div style="background:white;border:1px solid #e5e7eb;border-left:3px solid #3b82f6;border-radius:3px;padding:4px;">
        <div style="height:4px;background:#dbeafe;margin-bottom:2px;border-radius:2px;width:55%;"></div>
        <div style="height:3px;background:#f3f4f6;border-radius:2px;"></div>
      </div>
    </div>`
  },
  {
    id: 'compact',
    label: 'Compact',
    desc: '2 colonnes denses',
    preview: `<div style="width:100%;height:100%;padding:6px;background:white;">
      <div style="height:12px;border-bottom:2px solid #3b82f6;margin-bottom:5px;display:flex;align-items:flex-end;padding-bottom:3px;">
        <div style="height:6px;background:#1e3a5f;border-radius:2px;flex:1;margin-right:4px;"></div>
        <div style="height:4px;background:#dbeafe;border-radius:2px;width:30%;"></div>
      </div>
      <div style="display:flex;gap:4px;">
        <div style="flex:6;"><div style="height:3px;background:#f3f4f6;margin-bottom:2px;border-radius:2px;"></div><div style="height:3px;background:#f3f4f6;margin-bottom:2px;border-radius:2px;width:85%;"></div><div style="height:3px;background:#f3f4f6;border-radius:2px;width:70%;"></div></div>
        <div style="flex:4;padding-left:4px;border-left:1px solid #e5e7eb;"><div style="height:3px;background:#f3f4f6;margin-bottom:2px;border-radius:2px;"></div><div style="height:3px;background:#f3f4f6;border-radius:2px;width:75%;"></div></div>
      </div>
    </div>`
  },
  {
    id: 'minimal_pro',
    label: 'Minimaliste Pro',
    desc: 'Ultra épuré, ligne accent gauche',
    preview: `<div style="width:100%;height:100%;background:white;padding:8px;">
      <div style="border-bottom:1.5px solid #475569;padding-bottom:5px;margin-bottom:6px;">
        <div style="height:7px;background:#1e293b;width:55%;border-radius:1px;margin-bottom:3px;"></div>
        <div style="height:4px;background:#94a3b8;width:38%;border-radius:1px;margin-bottom:2px;"></div>
        <div style="height:3px;background:#cbd5e1;width:70%;border-radius:1px;"></div>
      </div>
      <div style="height:3px;background:#f8fafc;margin-bottom:1px;"></div>
      <div style="height:3px;background:#f8fafc;margin-bottom:1px;width:90%;"></div>
      <div style="height:3px;background:#f8fafc;margin-bottom:5px;width:75%;"></div>
      <div style="height:3px;background:#475569;width:40%;margin-bottom:3px;"></div>
      <div style="height:3px;background:#e2e8f0;margin-bottom:1px;"></div>
      <div style="height:3px;background:#e2e8f0;margin-bottom:1px;width:85%;"></div>
    </div>`
  },
  {
    id: 'dark_premium',
    label: 'Dark Premium',
    desc: 'Fond sombre, accents dorés',
    preview: `<div style="width:100%;height:100%;background:#0f0f1a;padding:8px;">
      <div style="border-bottom:1px solid #d4af37;padding-bottom:5px;margin-bottom:6px;">
        <div style="height:6px;background:#f0f0f0;width:55%;border-radius:1px;margin-bottom:3px;"></div>
        <div style="height:3.5px;background:#d4af37;width:35%;border-radius:1px;margin-bottom:2px;"></div>
        <div style="height:2.5px;background:#4a4a5a;width:70%;border-radius:1px;"></div>
      </div>
      <div style="height:2.5px;background:#1e1e30;margin-bottom:1.5px;"></div>
      <div style="height:2.5px;background:#1e1e30;margin-bottom:1.5px;width:90%;"></div>
      <div style="height:2.5px;background:#1e1e30;margin-bottom:5px;width:75%;"></div>
      <div style="height:2.5px;background:#d4af37;width:38%;margin-bottom:3.5px;"></div>
      <div style="height:2.5px;background:#1e1e30;margin-bottom:1.5px;"></div>
      <div style="height:2.5px;background:#1e1e30;width:60%;"></div>
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

/** Presets curatés — chaque preset est une combinaison forme+style avec aperçu HTML */
export const CV_PRESETS = [
  {
    id: 'minimal_pro',
    label: 'Minimaliste Pro',
    desc: 'Style Apple · épuré & aéré',
    shape: 'minimal_pro',
    style: 'ardoise',
    preview: `<div style="width:100%;height:100%;background:white;padding:8px;font-family:Helvetica,sans-serif;">
      <div style="border-bottom:1.5px solid #475569;padding-bottom:5px;margin-bottom:6px;">
        <div style="height:7px;background:#1e293b;width:55%;border-radius:1px;margin-bottom:3px;"></div>
        <div style="height:4px;background:#94a3b8;width:38%;border-radius:1px;margin-bottom:2px;"></div>
        <div style="height:3px;background:#cbd5e1;width:70%;border-radius:1px;"></div>
      </div>
      <div style="height:3px;background:#f8fafc;margin-bottom:1px;"></div>
      <div style="height:3px;background:#f8fafc;margin-bottom:1px;width:90%;"></div>
      <div style="height:3px;background:#f8fafc;margin-bottom:6px;width:75%;"></div>
      <div style="height:3px;background:#475569;width:40%;margin-bottom:4px;"></div>
      <div style="height:3px;background:#e2e8f0;margin-bottom:1px;"></div>
      <div style="height:3px;background:#e2e8f0;margin-bottom:1px;width:85%;"></div>
      <div style="height:3px;background:#e2e8f0;width:60%;"></div>
    </div>`,
  },
  {
    id: 'sidebar_photo',
    label: 'Sidebar Colorée',
    desc: 'Photo + sidebar · pro & moderne',
    shape: 'deux_colonnes',
    style: 'violet',
    preview: `<div style="width:100%;height:100%;display:flex;background:white;overflow:hidden;">
      <div style="width:36%;background:#4c1d95;padding:7px 5px;">
        <div style="width:26px;height:26px;border-radius:50%;background:rgba(255,255,255,0.25);margin:0 auto 5px;border:2px solid rgba(255,255,255,0.4);"></div>
        <div style="height:4px;background:rgba(255,255,255,0.7);border-radius:2px;margin-bottom:2px;"></div>
        <div style="height:3px;background:rgba(255,255,255,0.4);border-radius:2px;margin-bottom:2px;width:80%;"></div>
        <div style="height:3px;background:rgba(255,255,255,0.3);border-radius:2px;width:60%;margin-bottom:5px;"></div>
        <div style="height:2px;background:rgba(255,255,255,0.2);margin-bottom:3px;"></div>
        <div style="height:2px;background:rgba(255,255,255,0.15);margin-bottom:2px;width:70%;"></div>
      </div>
      <div style="flex:1;padding:7px 6px;">
        <div style="height:3.5px;background:#7c3aed;width:50%;border-radius:1px;margin-bottom:4px;"></div>
        <div style="height:3px;background:#f3f4f6;margin-bottom:1.5px;"></div>
        <div style="height:3px;background:#f3f4f6;margin-bottom:1.5px;width:90%;"></div>
        <div style="height:3px;background:#f3f4f6;margin-bottom:4px;width:70%;"></div>
        <div style="height:3.5px;background:#7c3aed;width:45%;border-radius:1px;margin-bottom:3px;"></div>
        <div style="height:3px;background:#f3f4f6;margin-bottom:1.5px;"></div>
        <div style="height:3px;background:#f3f4f6;width:80%;"></div>
      </div>
    </div>`,
  },
  {
    id: 'header_grand',
    label: 'Header Bandeau',
    desc: 'Grand bandeau · impact visuel fort',
    shape: 'header_bande',
    style: 'ocean',
    preview: `<div style="width:100%;height:100%;background:white;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#0c4a6e,#0369a1);padding:9px 7px 8px;">
        <div style="height:7px;background:rgba(255,255,255,0.95);border-radius:2px;width:60%;margin-bottom:3px;"></div>
        <div style="height:4px;background:rgba(255,255,255,0.6);border-radius:2px;width:42%;margin-bottom:3px;"></div>
        <div style="display:flex;gap:3px;margin-top:1px;">
          <div style="height:2.5px;background:rgba(255,255,255,0.35);border-radius:2px;flex:1;"></div>
          <div style="height:2.5px;background:rgba(255,255,255,0.35);border-radius:2px;flex:1;"></div>
          <div style="height:2.5px;background:rgba(255,255,255,0.35);border-radius:2px;flex:0.8;"></div>
        </div>
      </div>
      <div style="padding:6px 7px;">
        <div style="height:3px;background:#bae6fd;width:45%;border-radius:1px;margin-bottom:4px;"></div>
        <div style="height:3px;background:#f0f9ff;margin-bottom:1.5px;"></div>
        <div style="height:3px;background:#f0f9ff;margin-bottom:1.5px;width:88%;"></div>
        <div style="height:3px;background:#f0f9ff;width:65%;"></div>
      </div>
    </div>`,
  },
  {
    id: 'dark_premium',
    label: 'Dark Premium',
    desc: 'Fond sombre & accents dorés',
    shape: 'dark_premium',
    style: 'anthracite',
    preview: `<div style="width:100%;height:100%;background:#0f0f1a;padding:8px;overflow:hidden;">
      <div style="border-bottom:1px solid #d4af37;padding-bottom:5px;margin-bottom:6px;">
        <div style="height:6px;background:#f0f0f0;width:55%;border-radius:1px;margin-bottom:3px;"></div>
        <div style="height:3.5px;background:#d4af37;width:35%;border-radius:1px;margin-bottom:2px;"></div>
        <div style="height:2.5px;background:#4a4a5a;width:70%;border-radius:1px;"></div>
      </div>
      <div style="height:2.5px;background:#1e1e30;margin-bottom:1.5px;"></div>
      <div style="height:2.5px;background:#1e1e30;margin-bottom:1.5px;width:90%;"></div>
      <div style="height:2.5px;background:#1e1e30;margin-bottom:5px;width:75%;"></div>
      <div style="height:2.5px;background:#d4af37;width:38%;margin-bottom:3.5px;"></div>
      <div style="height:2.5px;background:#1e1e30;margin-bottom:1.5px;"></div>
      <div style="height:2.5px;background:#1e1e30;margin-bottom:1.5px;width:82%;"></div>
      <div style="height:2.5px;background:#1e1e30;width:60%;"></div>
    </div>`,
  },
];
