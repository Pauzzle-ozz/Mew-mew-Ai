---
name: couleur web
description: Utilisation des couleurs adaptée aux contraintes du web.
---

# Skill : Couleurs Web

## Description

La couleur est le premier vecteur d'identité et d'émotion sur un site web. Sur Mew-mew-Ai, la gestion des couleurs doit :
- **Renforcer l'identité de la marque** (professionnalisme pour les CV, créativité pour les portfolios)
- **Garantir l'accessibilité** (contraste WCAG AA minimum)
- **S'adapter au contexte** (templates CV, dashboard, landing page)
- **Être cohérente** (design system centralisé)

## Analogie

Pense aux couleurs web comme à une **palette de peinture professionnelle** :
- Les couleurs primaires sont tes **teintes de marque** (bleu, violet)
- Les nuances sont tes **variantes contextuelles** (hover, disabled, focus)
- Le blanc/noir sont tes **neutres** (texte, backgrounds)
- Le contraste est ta **règle de composition** (garantir la lisibilité)

## Principes théoriques

### 1. Espaces colorimétriques web

Le web utilise **sRGB** (RGB standard) :
- **RGB** : Red, Green, Blue (0-255 par canal)
- **Hexadécimal** : `#RRGGBB` (ex: `#3B82F6`)
- **HSL** : Hue (teinte), Saturation, Lightness (plus intuitif pour les variantes)
- **OKLCH** (moderne) : Meilleur pour les dégradés perceptuels

### 2. Contraste et accessibilité (WCAG)

| Niveau | Texte normal | Texte large (>18px bold ou >24px) |
|--------|--------------|-----------------------------------|
| **AA** | 4.5:1 minimum | 3:1 minimum |
| **AAA** | 7:1 minimum | 4.5:1 minimum |

**Outil recommandé** : [Contrast Checker](https://webaim.org/resources/contrastchecker/)

### 3. Psychologie des couleurs (contexte Mew-mew-Ai)

| Couleur | Signification | Usage dans Mew-mew-Ai |
|---------|---------------|------------------------|
| **Bleu** | Confiance, professionnalisme | Templates CV "moderne", "tech" |
| **Violet** | Créativité, innovation | Template CV "créatif", portfolio |
| **Noir/Gris** | Élégance, sobriété | Template CV "classique", "executive" |
| **Vert** | Réussite, validation | Messages de succès, CTA positifs |
| **Rouge** | Urgence, erreur | Messages d'erreur |
| **Jaune** | Attention, avertissement | Alertes, infos importantes |

## Architecture des couleurs dans Mew-mew-Ai

### 1. Tailwind CSS 4 (système de couleurs)

Mew-mew-Ai utilise **Tailwind CSS 4** (via `@tailwindcss/postcss`). Les couleurs sont définies via **CSS custom properties** dans `globals.css`.

**Structure actuelle** :
```
frontend-v2/app/globals.css
```

**Exemple de configuration Tailwind CSS 4** :

```css
/* frontend-v2/app/globals.css */
@import "tailwindcss";

@theme {
  /* Couleurs de marque */
  --color-primary: oklch(0.6 0.2 250);        /* Bleu primaire */
  --color-primary-hover: oklch(0.5 0.22 250); /* Bleu hover */
  --color-secondary: oklch(0.65 0.18 300);    /* Violet */

  /* Couleurs sémantiques */
  --color-success: oklch(0.65 0.15 145);      /* Vert */
  --color-error: oklch(0.55 0.22 25);         /* Rouge */
  --color-warning: oklch(0.75 0.15 85);       /* Jaune */
  --color-info: oklch(0.6 0.15 230);          /* Bleu clair */

  /* Neutres */
  --color-gray-50: oklch(0.98 0 0);
  --color-gray-100: oklch(0.95 0 0);
  --color-gray-200: oklch(0.9 0 0);
  --color-gray-300: oklch(0.8 0 0);
  --color-gray-400: oklch(0.65 0 0);
  --color-gray-500: oklch(0.5 0 0);
  --color-gray-600: oklch(0.4 0 0);
  --color-gray-700: oklch(0.3 0 0);
  --color-gray-800: oklch(0.2 0 0);
  --color-gray-900: oklch(0.1 0 0);

  /* Dark mode */
  --color-dark-bg: oklch(0.15 0.01 250);
  --color-dark-surface: oklch(0.2 0.01 250);
}
```

**Utilisation dans les composants** :

```jsx
// Bouton primaire avec Tailwind CSS 4
<button className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg transition-colors">
  Analyser mon CV
</button>

// Alerte d'erreur
<div className="bg-error/10 border border-error text-error px-4 py-3 rounded">
  Erreur lors de l'analyse
</div>

// Card avec hover
<div className="bg-white hover:bg-gray-50 border border-gray-200 p-6 rounded-xl transition-colors">
  Contenu
</div>
```

### 2. Couleurs dynamiques (portfolio)

Les portfolios permettent une **couleur primaire personnalisée** (`primary_color` en BDD).

**Schéma** :
```
Utilisateur choisit #FF6B9D (rose)
    ↓
Stocké dans portfolios.primary_color
    ↓
Injecté via CSS custom property
    ↓
Utilisé dans les boutons, liens, accents
```

**Exemple d'implémentation** :

```jsx
// app/p/[slug]/page.js (portfolio public)
export default function PortfolioPublicPage({ params }) {
  const [portfolio, setPortfolio] = useState(null);

  useEffect(() => {
    async function loadPortfolio() {
      const data = await portfolioApi.getPublic(params.slug);
      setPortfolio(data);

      // Injecter la couleur primaire dynamique
      if (data.primary_color) {
        document.documentElement.style.setProperty(
          '--portfolio-primary',
          data.primary_color
        );
      }
    }
    loadPortfolio();
  }, [params.slug]);

  return (
    <div className="portfolio-container">
      <style jsx global>{`
        .portfolio-accent {
          color: var(--portfolio-primary, #3B82F6);
        }
        .portfolio-btn {
          background-color: var(--portfolio-primary, #3B82F6);
        }
        .portfolio-btn:hover {
          filter: brightness(0.9);
        }
      `}</style>

      <h1 className="portfolio-accent text-4xl font-bold">
        {portfolio?.title}
      </h1>

      <button className="portfolio-btn text-white px-6 py-3 rounded-lg">
        Me contacter
      </button>
    </div>
  );
}
```

### 3. Templates CV (6 palettes distinctes)

Chaque template CV a sa propre palette (définie dans `backend/src/templates/templateFactory.js`).

**Palettes actuelles** :

```javascript
// backend/src/templates/templateFactory.js (extrait)

const TEMPLATES = {
  moderne: {
    primary: '#3B82F6',      // Bleu
    secondary: '#60A5FA',
    text: '#1F2937',
    background: '#FFFFFF'
  },
  classique: {
    primary: '#000000',      // Noir
    secondary: '#4B5563',
    text: '#1F2937',
    background: '#FFFFFF'
  },
  creatif: {
    primary: '#EC4899',      // Rose
    secondary: '#A855F7',    // Violet
    text: '#1F2937',
    background: '#FFFFFF'
  },
  tech: {
    primary: '#10B981',      // Vert terminal
    secondary: '#059669',
    text: '#FFFFFF',
    background: '#0F172A'    // Dark
  },
  executive: {
    primary: '#1E3A8A',      // Bleu marine
    secondary: '#3B82F6',
    text: '#1F2937',
    background: '#FFFFFF'
  },
  minimal: {
    primary: '#6B7280',      // Gris
    secondary: '#9CA3AF',
    text: '#1F2937',
    background: '#FFFFFF'
  }
};
```

**Génération HTML avec couleurs inline** :

```javascript
// backend/src/templates/templateFactory.js
static getTemplate(template, cvData) {
  const colors = TEMPLATES[template] || TEMPLATES.moderne;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: 'Calibri', sans-serif;
            color: ${colors.text};
            background: ${colors.background};
          }
          .header {
            background: ${colors.primary};
            color: white;
            padding: 40px;
          }
          .section-title {
            color: ${colors.primary};
            border-bottom: 2px solid ${colors.secondary};
          }
          .skill-tag {
            background: ${colors.primary}20;
            color: ${colors.primary};
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${cvData.prenom} ${cvData.nom}</h1>
          <p>${cvData.titre_poste}</p>
        </div>
        <!-- Reste du template -->
      </body>
    </html>
  `;
}
```

## Exemples de code concrets (JSX + Tailwind)

### 1. Système de couleurs sémantiques (messages utilisateur)

```jsx
// components/shared/StatusMessage.jsx
export default function StatusMessage({ type, children }) {
  const styles = {
    success: 'bg-success/10 border-success text-success',
    error: 'bg-error/10 border-error text-error',
    warning: 'bg-warning/10 border-warning text-warning',
    info: 'bg-info/10 border-info text-info'
  };

  return (
    <div className={`${styles[type]} border px-4 py-3 rounded-lg flex items-start gap-3`}>
      <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        {/* Icône selon type */}
      </svg>
      <p className="text-sm">{children}</p>
    </div>
  );
}

// Utilisation
<StatusMessage type="success">CV généré avec succès</StatusMessage>
<StatusMessage type="error">Erreur lors de l'upload</StatusMessage>
```

### 2. Boutons avec variantes de couleur

```jsx
// components/shared/Button.jsx
export default function Button({ variant = 'primary', children, ...props }) {
  const variants = {
    primary: 'bg-primary hover:bg-primary-hover text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    danger: 'bg-error hover:bg-error/90 text-white',
    ghost: 'text-gray-700 hover:bg-gray-100'
  };

  return (
    <button
      className={`
        ${variants[variant]}
        px-6 py-3 rounded-lg font-medium
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-primary/50
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
      {...props}
    >
      {children}
    </button>
  );
}

// Utilisation
<Button variant="primary">Analyser mon CV</Button>
<Button variant="outline">Annuler</Button>
<Button variant="danger">Supprimer</Button>
```

### 3. Dégradés de marque (landing page)

```jsx
// app/page.js (extrait landing page)
export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero avec gradient */}
      <section className="bg-gradient-to-br from-primary via-secondary to-primary/80 text-white py-24">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold mb-6">
            Mew - L'IA qui vous propulse
          </h1>
          <p className="text-xl opacity-90 mb-8">
            Votre carrière mérite une intelligence artificielle dédiée
          </p>
          <button className="bg-white text-primary hover:bg-gray-50 px-8 py-4 rounded-lg font-bold transition-colors">
            Commencer gratuitement
          </button>
        </div>
      </section>

      {/* Section features avec accents colorés */}
      <section className="py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="border border-gray-200 rounded-xl p-8 hover:border-primary transition-colors">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="currentColor">
                {/* Icône */}
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Analyse CV</h3>
            <p className="text-gray-600">
              Notre IA analyse votre parcours et identifie vos métiers idéaux
            </p>
          </div>
          {/* Autres features */}
        </div>
      </section>
    </div>
  );
}
```

### 4. Mode sombre (dark mode)

```jsx
// app/layout.js (avec support dark mode)
export default function RootLayout({ children }) {
  return (
    <html lang="fr" className="dark">
      <body className="bg-white dark:bg-dark-bg text-gray-900 dark:text-gray-100">
        {children}
      </body>
    </html>
  );
}

// Composant avec dark mode
export default function Card({ children }) {
  return (
    <div className="
      bg-white dark:bg-dark-surface
      border border-gray-200 dark:border-gray-700
      text-gray-900 dark:text-gray-100
      p-6 rounded-xl
    ">
      {children}
    </div>
  );
}
```

### 5. Sélecteur de couleur portfolio

```jsx
// app/solutions/portfolio/[id]/edit/page.js (extrait)
const COLOR_PRESETS = [
  { name: 'Bleu', value: '#3B82F6' },
  { name: 'Violet', value: '#A855F7' },
  { name: 'Rose', value: '#EC4899' },
  { name: 'Vert', value: '#10B981' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Rouge', value: '#EF4444' },
];

export default function PortfolioEditor() {
  const [primaryColor, setPrimaryColor] = useState('#3B82F6');

  async function handleColorChange(color) {
    setPrimaryColor(color);
    await portfolioApi.update(portfolioId, { primary_color: color });
  }

  return (
    <div className="color-picker-section">
      <h3 className="text-lg font-semibold mb-3">Couleur primaire</h3>

      {/* Presets */}
      <div className="flex gap-2 mb-4">
        {COLOR_PRESETS.map(preset => (
          <button
            key={preset.value}
            onClick={() => handleColorChange(preset.value)}
            className={`
              w-10 h-10 rounded-lg border-2 transition-all
              ${primaryColor === preset.value
                ? 'border-gray-900 scale-110'
                : 'border-gray-300 hover:scale-105'}
            `}
            style={{ backgroundColor: preset.value }}
            title={preset.name}
          />
        ))}
      </div>

      {/* Color picker natif */}
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={primaryColor}
          onChange={(e) => handleColorChange(e.target.value)}
          className="w-16 h-10 rounded cursor-pointer"
        />
        <input
          type="text"
          value={primaryColor}
          onChange={(e) => handleColorChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
          placeholder="#3B82F6"
        />
      </div>
    </div>
  );
}
```

## Diagramme : Flux des couleurs

```
┌─────────────────────────────────────────────────────────┐
│          SYSTÈME DE COULEURS MEW-MEW-AI                 │
└─────────────────────────────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          │               │               │
          ▼               ▼               ▼
   ┌───────────┐   ┌───────────┐   ┌───────────┐
   │  MARQUE   │   │ TEMPLATES │   │ PORTFOLIO │
   │  GLOBALE  │   │    CV     │   │ DYNAMIQUE │
   └───────────┘   └───────────┘   └───────────┘
          │               │               │
          ▼               ▼               ▼
   globals.css      templateFactory   primary_color
   @theme vars      (inline CSS)      (BDD + CSS var)
          │               │               │
          ▼               ▼               ▼
   Tailwind classes   Puppeteer PDF    style injection
   (bg-primary)       (HTML + CSS)     (runtime)
          │               │               │
          └───────────────┼───────────────┘
                          ▼
                    NAVIGATEUR
              (rendu final utilisateur)
```

## Checklist pratique

### ✅ Avant d'ajouter une couleur

- [ ] La couleur a-t-elle un rôle sémantique clair ? (primaire, erreur, succès, etc.)
- [ ] Le contraste texte/fond respecte-t-il WCAG AA (4.5:1 minimum) ?
- [ ] La couleur est-elle cohérente avec l'identité de marque ?
- [ ] Ai-je défini les variantes (hover, focus, disabled) ?
- [ ] La couleur fonctionne-t-elle en mode sombre (si applicable) ?

### ✅ Implémentation Tailwind CSS 4

- [ ] Les couleurs sont définies dans `@theme` (globals.css)
- [ ] Les noms de variables sont explicites (`--color-primary`, pas `--blue`)
- [ ] Les couleurs sémantiques utilisent OKLCH (meilleure perception)
- [ ] Les classes Tailwind utilisent les noms courts (`bg-primary` vs `bg-[#3B82F6]`)

### ✅ Templates CV

- [ ] Chaque template a une palette distincte et cohérente
- [ ] Les couleurs sont injectées via CSS inline (pour Puppeteer)
- [ ] Le contraste est suffisant pour l'impression (noir sur blanc > 12:1)
- [ ] Les couleurs renforcent la hiérarchie visuelle (titres > sous-titres > texte)

### ✅ Portfolios personnalisés

- [ ] L'utilisateur peut choisir sa couleur primaire (color picker)
- [ ] La couleur est stockée en BDD (`portfolios.primary_color`)
- [ ] La couleur est injectée dynamiquement (CSS custom property)
- [ ] Un contraste minimal est garanti (validation côté serveur)
- [ ] Les presets proposés sont accessibles (contraste testé)

### ✅ Accessibilité

- [ ] Tous les couples texte/fond ont un contraste ≥ 4.5:1 (AA)
- [ ] Les couleurs ne sont jamais la seule indication (ajouter icônes, texte)
- [ ] Les états interactifs (hover, focus) sont visuellement distincts
- [ ] Le focus est visible (ring de 2px avec contraste)
- [ ] Les messages d'erreur ne reposent pas QUE sur le rouge (ajouter icône + texte)

### ✅ Performance

- [ ] Pas de calculs de couleur runtime (utiliser CSS variables)
- [ ] Les dégradés complexes sont optimisés (linear-gradient simple > radial multiple)
- [ ] Les couleurs OKLCH sont compilées en RGB pour compatibilité

## Erreurs à éviter

### ❌ Couleurs hardcodées

```jsx
// ❌ MAUVAIS : Couleur hardcodée, impossible à maintenir
<button className="bg-[#3B82F6] text-white">
  Cliquez-moi
</button>

// ✅ BON : Utilise le système de couleurs
<button className="bg-primary text-white">
  Cliquez-moi
</button>
```

### ❌ Contraste insuffisant

```jsx
// ❌ MAUVAIS : Gris clair sur blanc (contraste < 3:1)
<p className="text-gray-300 bg-white">
  Texte illisible
</p>

// ✅ BON : Gris foncé sur blanc (contraste > 4.5:1)
<p className="text-gray-700 bg-white">
  Texte lisible
</p>
```

### ❌ Trop de couleurs

```jsx
// ❌ MAUVAIS : Arc-en-ciel non cohérent
<div className="bg-blue-500">
  <button className="bg-red-500">Rouge</button>
  <button className="bg-green-500">Vert</button>
  <button className="bg-purple-500">Violet</button>
  <button className="bg-yellow-500">Jaune</button>
</div>

// ✅ BON : Palette limitée et cohérente
<div className="bg-primary">
  <button className="bg-white text-primary">Primaire</button>
  <button className="bg-secondary text-white">Secondaire</button>
</div>
```

### ❌ Couleurs inline sans fallback

```jsx
// ❌ MAUVAIS : Si primary_color est null, pas de couleur
<div style={{ backgroundColor: portfolio.primary_color }}>
  Contenu
</div>

// ✅ BON : Fallback défini
<div style={{
  backgroundColor: portfolio.primary_color || '#3B82F6'
}}>
  Contenu
</div>
```

## Ressources & Outils

### Outils de contraste
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Colorable](https://colorable.jxnblk.com/)
- [Contrast Ratio](https://contrast-ratio.com/)

### Palettes & Inspiration
- [Coolors](https://coolors.co/) - Générateur de palettes
- [Adobe Color](https://color.adobe.com/) - Roue chromatique
- [Tailwind Color Palette](https://tailwindcss.com/docs/customizing-colors)

### Conversion & OKLCH
- [OKLCH Color Picker](https://oklch.com/)
- [Colorjs.io](https://colorjs.io/) - Manipulations colorimétriques avancées

### Tests accessibilité
- Chrome DevTools > Lighthouse (audit accessibilité)
- [axe DevTools](https://www.deque.com/axe/devtools/) - Extension Chrome/Firefox
- [WAVE](https://wave.webaim.org/) - Évaluateur d'accessibilité web

---

**Prochaines étapes** : Documenter la typographie (`skill_typographie_web.md`) pour compléter le système de design.