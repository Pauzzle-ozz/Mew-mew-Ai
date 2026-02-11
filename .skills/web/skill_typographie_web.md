---
name: typographie web
description: Choix typographiques optimisés pour écrans.
---

# Skill : Typographie Web

## Description

La typographie web est le **squelette de lisibilité** de Mew-mew-Ai. Sur une plateforme qui génère des CV, des portfolios et affiche du contenu dense (analyses IA), la typographie doit :
- **Garantir la lisibilité** sur tous les écrans (mobile → desktop)
- **Renforcer la hiérarchie** (H1 > H2 > body > caption)
- **Refléter l'identité** (professionnelle pour CV, moderne pour portfolios)
- **Optimiser la performance** (web fonts chargées efficacement)

## Analogie

La typographie web, c'est comme **l'architecture d'un journal** :
- Les **titres** (H1/H2) sont tes **gros titres** en Une
- Le **corps de texte** (body) est tes **articles**
- Les **captions** (petits textes) sont tes **légendes de photos**
- L'**interlignage** (line-height) est l'**espacement entre les lignes** qui rend le journal agréable à lire
- Les **polices** (font-family) sont ton **style éditorial** (Times = classique, Helvetica = moderne)

## Principes théoriques

### 1. Hiérarchie typographique

Une bonne hiérarchie guide l'œil de l'utilisateur :

```
H1 (Hero title)        : 48-64px, bold, line-height 1.1
H2 (Section title)     : 36-48px, bold, line-height 1.2
H3 (Subsection)        : 24-32px, semibold, line-height 1.3
H4 (Card title)        : 18-24px, semibold, line-height 1.4
Body (paragraphe)      : 16-18px, regular, line-height 1.6
Small (caption)        : 14px, regular, line-height 1.5
Tiny (metadata)        : 12px, medium, line-height 1.4
```

**Ratio de progression** : Utiliser une échelle modulaire (1.25 ou 1.333) pour la cohérence.

### 2. Lisibilité (readability)

**Facteurs clés** :
- **Taille de police** : 16px minimum pour le corps de texte (mobile), 18px idéal (desktop)
- **Interlignage** (line-height) : 1.5-1.7 pour le corps de texte, 1.1-1.3 pour les titres
- **Longueur de ligne** : 50-75 caractères par ligne (optimal : 66)
- **Contraste** : Texte gris foncé (#1F2937) sur blanc, pas noir pur (fatigue visuelle)

### 3. Web fonts vs System fonts

| Type | Avantages | Inconvénients | Usage Mew-mew-Ai |
|------|-----------|---------------|-------------------|
| **Web fonts** | Identité unique, contrôle total | Temps de chargement, FOUT/FOIT | Geist Sans/Mono (Next.js optimisé) |
| **System fonts** | Performance, pas de chargement | Rendu variable selon OS | Fallbacks uniquement |

**FOUT** : Flash of Unstyled Text (police système → web font)
**FOIT** : Flash of Invisible Text (texte invisible → web font)

**Solution Mew-mew-Ai** : `next/font` précharge les polices automatiquement (pas de FOUT/FOIT).

## Architecture typographique de Mew-mew-Ai

### 1. Polices utilisées

**Frontend (Next.js)** :
- **Geist Sans** : Police sans-serif moderne (texte général)
- **Geist Mono** : Police monospace (code, données techniques)

**Configuration** :
```javascript
// app/layout.js
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
}
```

**CSS custom properties générées** :
```css
:root {
  --font-geist-sans: 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-geist-mono: 'Geist Mono', 'Consolas', 'Monaco', monospace;
}
```

**Templates CV (backend)** :
Chaque template utilise des polices spécifiques (inline CSS pour Puppeteer) :

| Template | Police primaire | Police secondaire | Contexte |
|----------|----------------|-------------------|----------|
| **moderne** | Calibri | Arial | Professionnelle, épurée |
| **classique** | Times New Roman | Georgia | Formelle, traditionnelle |
| **créatif** | Helvetica | Arial | Moderne, design |
| **tech** | Consolas (mono) | Courier New | Développeurs, IT |
| **executive** | Georgia | Times New Roman | Cadres, management |
| **minimal** | Helvetica Neue | Arial | Architecture, UX/UI |

### 2. Échelle typographique Tailwind CSS 4

**Configuration dans `globals.css`** :

```css
/* frontend-v2/app/globals.css */
@import "tailwindcss";

@theme {
  /* Échelle de tailles */
  --font-size-xs: 0.75rem;      /* 12px */
  --font-size-sm: 0.875rem;     /* 14px */
  --font-size-base: 1rem;       /* 16px */
  --font-size-lg: 1.125rem;     /* 18px */
  --font-size-xl: 1.25rem;      /* 20px */
  --font-size-2xl: 1.5rem;      /* 24px */
  --font-size-3xl: 1.875rem;    /* 30px */
  --font-size-4xl: 2.25rem;     /* 36px */
  --font-size-5xl: 3rem;        /* 48px */
  --font-size-6xl: 3.75rem;     /* 60px */

  /* Poids de police */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Interlignage */
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;

  /* Espacement lettres (tracking) */
  --letter-spacing-tight: -0.025em;
  --letter-spacing-normal: 0;
  --letter-spacing-wide: 0.025em;
}
```

## Exemples de code concrets (JSX + Tailwind)

### 1. Hiérarchie de titres (landing page)

```jsx
// app/page.js
export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero title (H1) */}
      <h1 className="
        font-sans font-bold
        text-5xl md:text-6xl lg:text-7xl
        leading-tight
        tracking-tight
        text-gray-900
        mb-6
      ">
        Mew - L'IA qui vous propulse
      </h1>

      {/* Subtitle (H2) */}
      <h2 className="
        font-sans font-medium
        text-xl md:text-2xl
        leading-normal
        text-gray-600
        mb-8
      ">
        Votre carrière mérite une intelligence artificielle dédiée
      </h2>

      {/* Section title (H3) */}
      <section className="mt-16">
        <h3 className="
          font-sans font-semibold
          text-3xl md:text-4xl
          leading-snug
          text-gray-900
          mb-4
        ">
          Nos solutions IA
        </h3>
        <p className="
          font-sans font-normal
          text-lg
          leading-relaxed
          text-gray-600
          max-w-2xl
        ">
          Découvrez comment notre IA transforme votre recherche d'emploi
          en expérience personnalisée et efficace.
        </p>
      </section>
    </div>
  );
}
```

### 2. Corps de texte optimisé (lisibilité)

```jsx
// components/shared/Article.jsx
export default function Article({ title, children }) {
  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
      {/* Titre article */}
      <h1 className="
        font-sans font-bold
        text-4xl md:text-5xl
        leading-tight
        text-gray-900
        mb-6
      ">
        {title}
      </h1>

      {/* Corps de texte */}
      <div className="
        font-sans
        text-lg leading-relaxed
        text-gray-700
        space-y-4
      ">
        {children}
      </div>
    </article>
  );
}

// Utilisation
<Article title="Comment optimiser votre CV avec l'IA">
  <p>
    L'optimisation de CV par IA analyse vos compétences, vos expériences
    et votre parcours pour identifier les axes d'amélioration.
  </p>
  <p>
    Notre algorithme compare votre profil à des milliers d'offres d'emploi
    et vous propose des recommandations personnalisées.
  </p>
</Article>
```

### 3. Typographie responsive (mobile → desktop)

```jsx
// components/shared/ResponsiveHeading.jsx
export default function ResponsiveHeading({ level = 1, children }) {
  const Tag = `h${level}`;

  const styles = {
    1: 'text-4xl sm:text-5xl md:text-6xl font-bold leading-tight',
    2: 'text-3xl sm:text-4xl md:text-5xl font-bold leading-snug',
    3: 'text-2xl sm:text-3xl md:text-4xl font-semibold leading-snug',
    4: 'text-xl sm:text-2xl md:text-3xl font-semibold leading-normal',
  };

  return (
    <Tag className={`font-sans ${styles[level]} text-gray-900`}>
      {children}
    </Tag>
  );
}

// Utilisation
<ResponsiveHeading level={1}>
  Bienvenue sur Mew-mew-Ai
</ResponsiveHeading>
<ResponsiveHeading level={2}>
  Solutions IA pour votre carrière
</ResponsiveHeading>
```

### 4. Police monospace (code, données)

```jsx
// components/shared/CodeBlock.jsx
export default function CodeBlock({ children, language = 'javascript' }) {
  return (
    <pre className="
      font-mono
      text-sm leading-relaxed
      bg-gray-900 text-green-400
      p-6 rounded-lg
      overflow-x-auto
    ">
      <code>{children}</code>
    </pre>
  );
}

// Exemple d'utilisation (dashboard)
export default function CVDataDisplay({ cvData }) {
  return (
    <div>
      <h3 className="font-sans text-lg font-semibold mb-2">
        Données extraites
      </h3>
      <CodeBlock>
        {JSON.stringify(cvData, null, 2)}
      </CodeBlock>
    </div>
  );
}
```

### 5. Template CV avec typographie inline (backend)

```javascript
// backend/src/templates/templateFactory.js (extrait)
static getTemplate(template, cvData) {
  const fonts = {
    moderne: {
      primary: 'Calibri, sans-serif',
      headingSize: '28px',
      bodySize: '14px',
      lineHeight: '1.6'
    },
    classique: {
      primary: '"Times New Roman", serif',
      headingSize: '24px',
      bodySize: '12px',
      lineHeight: '1.5'
    },
    tech: {
      primary: 'Consolas, "Courier New", monospace',
      headingSize: '22px',
      bodySize: '13px',
      lineHeight: '1.7'
    }
  };

  const config = fonts[template] || fonts.moderne;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: ${config.primary};
            font-size: ${config.bodySize};
            line-height: ${config.lineHeight};
            color: #1F2937;
          }
          h1 {
            font-size: ${config.headingSize};
            font-weight: 700;
            line-height: 1.2;
            margin-bottom: 8px;
          }
          h2 {
            font-size: calc(${config.headingSize} * 0.75);
            font-weight: 600;
            line-height: 1.3;
            margin-top: 16px;
            margin-bottom: 8px;
          }
          p {
            margin-bottom: 12px;
          }
        </style>
      </head>
      <body>
        <h1>${cvData.prenom} ${cvData.nom}</h1>
        <p style="font-size: 16px; color: #6B7280;">
          ${cvData.titre_poste}
        </p>
        <!-- Reste du template -->
      </body>
    </html>
  `;
}
```

### 6. Système de classes utilitaires (design system)

```jsx
// lib/styles/typography.js (à créer si besoin)
export const typography = {
  // Titres
  h1: 'font-sans text-5xl md:text-6xl font-bold leading-tight tracking-tight',
  h2: 'font-sans text-4xl md:text-5xl font-bold leading-snug',
  h3: 'font-sans text-3xl md:text-4xl font-semibold leading-snug',
  h4: 'font-sans text-2xl md:text-3xl font-semibold leading-normal',
  h5: 'font-sans text-xl md:text-2xl font-medium leading-normal',

  // Corps de texte
  body: 'font-sans text-base leading-relaxed text-gray-700',
  bodyLarge: 'font-sans text-lg leading-relaxed text-gray-700',
  bodySmall: 'font-sans text-sm leading-normal text-gray-600',

  // Labels et UI
  label: 'font-sans text-sm font-medium text-gray-900',
  caption: 'font-sans text-xs text-gray-500',
  button: 'font-sans text-base font-semibold',

  // Code
  code: 'font-mono text-sm bg-gray-100 text-gray-900 px-1.5 py-0.5 rounded',
  codeBlock: 'font-mono text-sm leading-relaxed',
};

// Utilisation
import { typography } from '@/lib/styles/typography';

export default function MyComponent() {
  return (
    <div>
      <h1 className={typography.h1}>Titre principal</h1>
      <p className={typography.body}>Corps de texte lisible.</p>
      <code className={typography.code}>const x = 42;</code>
    </div>
  );
}
```

## Diagramme : Hiérarchie typographique

```
┌─────────────────────────────────────────────────────────┐
│         HIÉRARCHIE TYPOGRAPHIQUE MEW-MEW-AI             │
└─────────────────────────────────────────────────────────┘

H1 (Hero)               64px  ████████████████
                              Bold, Tight

H2 (Section)            48px  ████████████
                              Bold, Snug

H3 (Subsection)         36px  █████████
                              Semibold, Snug

H4 (Card title)         24px  ██████
                              Semibold, Normal

Body Large              18px  ████
                              Regular, Relaxed

Body (default)          16px  ███
                              Regular, Relaxed

Small                   14px  ██
                              Regular, Normal

Caption                 12px  █
                              Medium, Normal

                        Taille (px) relative
```

## Checklist pratique

### ✅ Configuration des polices

- [ ] Polices web chargées via `next/font` (pas de CDN externe)
- [ ] CSS custom properties définies (`--font-geist-sans`, `--font-geist-mono`)
- [ ] Fallbacks system fonts définis (ex: `-apple-system, BlinkMacSystemFont`)
- [ ] Polices préchargées (Next.js le fait automatiquement)
- [ ] Pas de FOUT/FOIT (vérifier dans DevTools > Network)

### ✅ Hiérarchie typographique

- [ ] H1 > H2 > H3 > Body (tailles clairement distinctes)
- [ ] Ratio de progression cohérent (échelle 1.25 ou 1.333)
- [ ] Poids de police adaptés (Bold pour titres, Regular pour body)
- [ ] Interlignage adapté (1.1-1.3 titres, 1.5-1.7 body)
- [ ] Espacement lettres (tracking) ajusté (-0.025em pour gros titres)

### ✅ Lisibilité

- [ ] Corps de texte ≥ 16px (mobile), 18px idéal (desktop)
- [ ] Longueur de ligne ≤ 75 caractères (`max-w-3xl` ou `max-w-prose`)
- [ ] Contraste texte/fond ≥ 4.5:1 (WCAG AA)
- [ ] Pas de texte noir pur sur blanc (#1F2937 > #000000)
- [ ] Espacement entre paragraphes (`space-y-4`)

### ✅ Responsive

- [ ] Tailles de police adaptatives (`text-4xl md:text-5xl lg:text-6xl`)
- [ ] Hiérarchie maintenue sur mobile (H1 reste + gros que H2)
- [ ] Interlignage constant ou ajusté (`leading-tight md:leading-snug`)
- [ ] Pas de texte < 14px sur mobile (lisibilité)

### ✅ Templates CV (backend)

- [ ] Polices inline (Puppeteer ne charge pas les web fonts)
- [ ] Fallbacks system fonts (Times, Arial, Courier)
- [ ] Tailles adaptées à l'impression (12-14px body, 24-28px titres)
- [ ] Line-height optimisé pour PDF (1.4-1.6)
- [ ] Pas de polices exotiques (problèmes de rendu)

### ✅ Performance

- [ ] Polices préchargées (`next/font` optimisé)
- [ ] Subsets limités (latin uniquement si pas de caractères spéciaux)
- [ ] Variable fonts utilisées si disponible (moins de fichiers)
- [ ] Pas de `@import` Google Fonts dans CSS (utiliser `next/font`)

### ✅ Accessibilité

- [ ] Texte redimensionnable (pas de `px` fixes pour body, utiliser `rem`)
- [ ] Pas de texte en image (sauf exceptions justifiées)
- [ ] Contraste suffisant (texte gris #6B7280 minimum sur blanc)
- [ ] Police monospace pour le code (distinction claire)

## Erreurs à éviter

### ❌ Tailles de police fixes (non responsive)

```jsx
// ❌ MAUVAIS : Même taille sur mobile et desktop
<h1 className="text-6xl font-bold">
  Titre trop gros sur mobile
</h1>

// ✅ BON : Adapté à chaque breakpoint
<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
  Titre responsive
</h1>
```

### ❌ Interlignage trop serré (texte illisible)

```jsx
// ❌ MAUVAIS : Lignes trop serrées
<p className="text-base leading-tight">
  Ce paragraphe est difficile à lire car les lignes sont trop proches.
  L'œil a du mal à suivre la ligne suivante.
</p>

// ✅ BON : Interlignage confortable
<p className="text-base leading-relaxed">
  Ce paragraphe est agréable à lire grâce à un interlignage de 1.75.
  L'œil glisse naturellement d'une ligne à l'autre.
</p>
```

### ❌ Longueur de ligne excessive

```jsx
// ❌ MAUVAIS : Ligne trop longue (>100 caractères)
<p className="w-full text-base">
  Ce texte s'étend sur toute la largeur de l'écran, ce qui rend
  la lecture difficile car l'œil doit parcourir une distance trop
  importante horizontalement avant de revenir au début de la ligne suivante.
</p>

// ✅ BON : Longueur limitée (50-75 caractères)
<p className="max-w-3xl text-base">
  Ce texte a une longueur de ligne optimale pour la lecture.
  L'œil ne se fatigue pas et la compréhension est meilleure.
</p>
```

### ❌ Polices web sans fallback

```jsx
// ❌ MAUVAIS : Si Geist Sans ne charge pas, police par défaut (Times)
<p className="font-sans">
  Texte avec police Geist Sans
</p>

// ✅ BON : Fallback défini dans globals.css
/* globals.css */
.font-sans {
  font-family: var(--font-geist-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

### ❌ Hiérarchie inversée

```jsx
// ❌ MAUVAIS : H2 plus gros que H1
<h1 className="text-2xl">Titre principal</h1>
<h2 className="text-4xl">Sous-titre</h2>

// ✅ BON : Hiérarchie respectée
<h1 className="text-4xl">Titre principal</h1>
<h2 className="text-2xl">Sous-titre</h2>
```

### ❌ Texte noir pur sur blanc (fatigue visuelle)

```jsx
// ❌ MAUVAIS : Contraste trop fort (#000 sur #FFF)
<p className="text-black bg-white">
  Texte avec contraste maximum (fatigue visuelle)
</p>

// ✅ BON : Gris foncé sur blanc (contraste confortable)
<p className="text-gray-900 bg-white">
  Texte avec contraste optimal (lisibilité sans fatigue)
</p>
```

## Ressources & Outils

### Échelles typographiques
- [Type Scale](https://typescale.com/) - Générateur d'échelles modulaires
- [Modular Scale](https://www.modularscale.com/) - Ratios harmoniques
- [Utopia](https://utopia.fyi/) - Typographie fluide responsive

### Web fonts
- [Google Fonts](https://fonts.google.com/) - Polices gratuites
- [next/font Documentation](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) - Optimisation Next.js
- [Fontsource](https://fontsource.org/) - Polices self-hosted

### Outils de test
- [Hemingway Editor](https://hemingwayapp.com/) - Lisibilité du texte
- [Readable](https://readable.com/) - Analyse de lisibilité
- Chrome DevTools > Rendering > "Emulate vision deficiencies" (test accessibilité)

### Performance
- [Font Subsetting](https://everythingfonts.com/subsetter) - Réduire la taille des polices
- [Glyphhanger](https://github.com/zachleat/glyphhanger) - Optimiser les web fonts

### Inspiration
- [Typewolf](https://www.typewolf.com/) - Exemples de typographie web
- [Fonts In Use](https://fontsinuse.com/) - Cas d'usage réels
- [Tailwind UI](https://tailwindui.com/) - Composants avec typographie soignée

---

**Prochaines étapes** : Documenter l'UI design (`skill_ui_design_web.md`) pour structurer les composants visuels.