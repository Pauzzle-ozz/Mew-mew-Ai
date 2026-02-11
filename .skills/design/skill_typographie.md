---
name: typographie
description: Choix et hiérarchisation typographique pour améliorer la lecture et l'impact visuel dans Mew-mew-Ai.
---

# Skill : Typographie pour Mew-mew-Ai

## Contexte du projet

Mew-mew-Ai utilise :
- **Polices principales** : Geist Sans (texte) + Geist Mono (code)
- **Stack** : Next.js 16 avec `next/font/local`
- **CSS** : Tailwind CSS 4 (classes utilitaires)
- **Templates CV** : 6 polices différentes selon le style

## 1. Polices de la plateforme

### Geist Sans (texte principal)

**Caractéristiques** :
- **Type** : Sans-serif moderne
- **Usage** : Titres, texte, UI
- **Weights** : 100 à 900 (9 variantes)
- **Variable CSS** : `--font-geist-sans`
- **Avantages** : Lisible, moderne, optimisée pour le web

```jsx
// Déclaration dans layout.js
import localFont from "next/font/local";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

// Application globale
<body className={`${geistSans.variable} font-sans`}>
  {children}
</body>
```

**Configuration Tailwind** :
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
      }
    }
  }
}
```

### Geist Mono (code et technique)

**Caractéristiques** :
- **Type** : Monospace (chasse fixe)
- **Usage** : Code, données techniques, template Tech
- **Weights** : 100 à 900
- **Variable CSS** : `--font-geist-mono`
- **Avantages** : Alignement parfait, lisibilité du code

```jsx
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Application globale
<body className={`${geistSans.variable} ${geistMono.variable}`}>
  {children}
</body>
```

**Utilisation** :
```jsx
// Code snippets
<code className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">
  npm install
</code>

// Template CV Tech
<div className="font-mono text-green-400 bg-black">
  console.log('Hello, World!');
</div>
```

## 2. Hiérarchie typographique

### Échelle de tailles (Tailwind)

**Principe** : Utiliser l'échelle Tailwind pour la cohérence

| Classe | Taille | Line-height | Usage |
|--------|--------|-------------|-------|
| `text-xs` | 12px | 16px (1.33) | Captions, métadonnées |
| `text-sm` | 14px | 20px (1.43) | Texte secondaire, labels |
| `text-base` | 16px | 24px (1.5) | Texte principal (body) |
| `text-lg` | 18px | 28px (1.56) | Texte accentué |
| `text-xl` | 20px | 28px (1.4) | Sous-titres (h4) |
| `text-2xl` | 24px | 32px (1.33) | Titres de section (h3) |
| `text-3xl` | 30px | 36px (1.2) | Titres de page (h2) |
| `text-4xl` | 36px | 40px (1.11) | Titres principaux (h1) |
| `text-5xl` | 48px | 1 | Hero titles |
| `text-6xl` | 60px | 1 | Landing page |

### Hiérarchie recommandée pour Mew-mew-Ai

```jsx
// H1 : Titre principal de page
<h1 className="text-4xl font-bold text-gray-900">
  Analyser mon CV
</h1>

// H2 : Titre de section
<h2 className="text-3xl font-semibold text-gray-900">
  Informations personnelles
</h2>

// H3 : Sous-section
<h3 className="text-2xl font-semibold text-gray-900">
  Expériences professionnelles
</h3>

// H4 : Sous-titre
<h4 className="text-xl font-medium text-gray-800">
  Développeur Full-Stack
</h4>

// Body : Texte principal
<p className="text-base text-gray-600 leading-relaxed">
  Voici le texte principal de la page.
</p>

// Small : Texte secondaire
<p className="text-sm text-gray-500">
  Informations complémentaires.
</p>

// Caption : Métadonnées
<span className="text-xs text-gray-400">
  Dernière mise à jour : 9 février 2026
</span>
```

### Font weights (épaisseurs)

| Classe | Valeur | Usage |
|--------|--------|-------|
| `font-thin` | 100 | Rarement utilisé |
| `font-extralight` | 200 | Texte très léger |
| `font-light` | 300 | Texte léger |
| `font-normal` | 400 | Texte principal (défaut) |
| `font-medium` | 500 | Accentuation légère |
| `font-semibold` | 600 | Sous-titres, titres (h2, h3) |
| `font-bold` | 700 | Titres principaux (h1) |
| `font-extrabold` | 800 | Très rarement utilisé |
| `font-black` | 900 | Impact maximal |

**Utilisation recommandée** :
```jsx
// H1 : Extra gras pour l'impact
<h1 className="text-4xl font-bold">Titre principal</h1>

// H2, H3 : Semi-bold pour la hiérarchie
<h2 className="text-3xl font-semibold">Titre de section</h2>

// Boutons : Medium pour la lisibilité
<button className="font-medium">Valider</button>

// Body : Normal (défaut)
<p className="font-normal">Texte principal</p>

// Accentuation : Medium dans le texte
<p>Voici un mot <span className="font-medium">important</span>.</p>
```

## 3. Line-height (hauteur de ligne)

### Valeurs Tailwind

| Classe | Valeur | Usage |
|--------|--------|-------|
| `leading-none` | 1 | Très serré (jamais pour du texte) |
| `leading-tight` | 1.25 | Titres courts (h1, h2) |
| `leading-snug` | 1.375 | Sous-titres (h3, h4) |
| `leading-normal` | 1.5 | Texte principal (défaut) |
| `leading-relaxed` | 1.625 | Texte long, confortable |
| `leading-loose` | 2 | Très espacé (rarement utilisé) |

### Règles d'utilisation

**Titres** : Plus le texte est gros, plus le line-height est serré
```jsx
<h1 className="text-4xl font-bold leading-tight">
  Titre très court
</h1>
```

**Texte principal** : Toujours `leading-normal` ou `leading-relaxed`
```jsx
<p className="text-base leading-relaxed">
  Voici un texte assez long qui bénéficie d'un interligne confortable
  pour améliorer la lisibilité et réduire la fatigue visuelle.
</p>
```

**Boutons** : Line-height serré pour un meilleur alignement vertical
```jsx
<button className="px-6 py-2.5 leading-tight">
  Valider
</button>
```

## 4. Letter-spacing (espacement des lettres)

### Valeurs Tailwind

| Classe | Valeur | Usage |
|--------|--------|-------|
| `tracking-tighter` | -0.05em | Très serré |
| `tracking-tight` | -0.025em | Titres (h1) |
| `tracking-normal` | 0 | Texte principal (défaut) |
| `tracking-wide` | 0.025em | Texte en caps |
| `tracking-wider` | 0.05em | Sous-titres en caps |
| `tracking-widest` | 0.1em | Très espacé (labels) |

### Règles d'utilisation

**Titres** : Légèrement serré pour compacité
```jsx
<h1 className="text-4xl font-bold tracking-tight">
  Titre principal
</h1>
```

**Texte en majuscules** : Toujours espacer avec `tracking-wide` ou `tracking-wider`
```jsx
// ❌ Mauvais : texte en caps sans espacement
<span className="uppercase">Nouveau</span>

// ✅ Bon : texte en caps avec espacement
<span className="uppercase tracking-wider text-sm font-medium">
  Nouveau
</span>
```

**Labels, badges** :
```jsx
<span className="inline-block px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium uppercase tracking-widest rounded">
  Premium
</span>
```

## 5. Longueur de ligne optimale

### Règle des 45-75 caractères

**Principe** : Une ligne de texte ne devrait jamais dépasser 75 caractères pour une lecture confortable.

```jsx
// ❌ Mauvais : ligne trop longue (pleine largeur sur grand écran)
<p className="text-base">
  Ce texte s'étend sur toute la largeur de l'écran, ce qui rend la lecture difficile sur les grands écrans car l'œil doit parcourir une distance trop importante.
</p>

// ✅ Bon : largeur maximale limitée
<div className="max-w-2xl mx-auto">
  <p className="text-base leading-relaxed">
    Ce texte est limité à 672px de largeur (max-w-2xl), ce qui correspond
    à environ 60-70 caractères par ligne pour une lecture confortable.
  </p>
</div>
```

### Largeurs recommandées (Tailwind)

| Classe | Largeur | Usage |
|--------|---------|-------|
| `max-w-md` | 448px | Formulaires étroits |
| `max-w-lg` | 512px | Formulaires standards |
| `max-w-xl` | 576px | Texte court |
| `max-w-2xl` | 672px | Texte principal (optimal) |
| `max-w-3xl` | 768px | Texte long |
| `max-w-4xl` | 896px | Contenu large |
| `max-w-7xl` | 1280px | Conteneur de page |

**Application dans Mew-mew-Ai** :
```jsx
// Page de contenu (article, blog)
<div className="max-w-2xl mx-auto px-4 py-8">
  <h1 className="text-4xl font-bold">Titre</h1>
  <p className="text-base leading-relaxed mt-4">
    Texte principal...
  </p>
</div>

// Formulaire
<div className="max-w-lg mx-auto px-4 py-8">
  <form className="space-y-6">
    {/* Champs de formulaire */}
  </form>
</div>

// Dashboard (large)
<div className="max-w-7xl mx-auto px-4 py-8">
  <div className="grid grid-cols-3 gap-6">
    {/* Cards */}
  </div>
</div>
```

## 6. Templates CV (polices par style)

### Template Moderne (Calibri)

```css
font-family: 'Calibri', 'Helvetica Neue', Arial, sans-serif;
font-size: 11pt;
line-height: 1.5;
```

**Caractéristiques** :
- Police moderne et professionnelle
- Bonne lisibilité sur écran et papier
- Optimisée pour les ATS (systèmes de recrutement)

### Template Classique (Times New Roman)

```css
font-family: 'Times New Roman', Georgia, serif;
font-size: 11pt;
line-height: 1.6;
```

**Caractéristiques** :
- Traditionnel, sérieux
- Empattements (serif) pour un rendu formel
- Légèrement plus d'espace entre les lignes (1.6)

### Template Créatif (Helvetica)

```css
font-family: 'Helvetica', Arial, sans-serif;
font-size: 11pt;
line-height: 1.5;
font-weight: 300 (léger), 700 (titres)
```

**Caractéristiques** :
- Sans-serif épuré
- Contrastes de poids (light vs bold)
- Moderne et minimaliste

### Template Tech (Consolas)

```css
font-family: 'Consolas', 'Courier New', monospace;
font-size: 10pt;
line-height: 1.4;
color: #00ff00;
background: #000000;
```

**Caractéristiques** :
- Monospace (chasse fixe)
- Style terminal/code
- Vert sur noir (référence console)

### Template Executive (Georgia)

```css
font-family: 'Georgia', 'Times New Roman', serif;
font-size: 11pt;
line-height: 1.6;
font-weight: 400 (normal), 700 (titres)
```

**Caractéristiques** :
- Serif élégant et premium
- Empattements marqués
- Lisibilité optimale

### Template Minimal (Helvetica Neue)

```css
font-family: 'Helvetica Neue', Arial, sans-serif;
font-size: 11pt;
line-height: 1.8;
font-weight: 300 (ultra léger)
```

**Caractéristiques** :
- Sans-serif ultra épuré
- Beaucoup de whitespace (line-height 1.8)
- Poids léger (300)

## 7. Accessibility (a11y)

### Taille minimale

**WCAG 2.1 AAA** : Texte de 14px minimum (ou 12px si bold)

```jsx
// ❌ Éviter : trop petit
<p className="text-xs">Texte trop petit (12px)</p>

// ✅ Bon : taille minimale
<p className="text-sm">Texte lisible (14px)</p>

// ✅ Bon : petit mais bold
<span className="text-xs font-bold">12px en gras (OK)</span>
```

### Contraste et typographie

- **Texte léger (< 400)** : Nécessite un contraste plus élevé
- **Texte gras (≥ 700)** : Peut tolérer un contraste légèrement inférieur

```jsx
// ❌ Mauvais : texte léger avec contraste faible
<p className="font-light text-gray-400">Difficile à lire</p>

// ✅ Bon : texte léger avec contraste fort
<p className="font-light text-gray-800">Lisible</p>

// ✅ Bon : texte gras avec contraste modéré
<p className="font-bold text-gray-600">Lisible</p>
```

### Responsive (mobile)

**Principe** : Augmenter légèrement les tailles sur mobile pour compenser la distance de lecture

```jsx
// Titre responsive
<h1 className="text-3xl md:text-4xl font-bold">
  Titre qui s'adapte
</h1>

// Texte responsive
<p className="text-base md:text-lg leading-relaxed">
  Texte principal qui grandit sur desktop
</p>
```

## 8. Cas d'usage spécifiques Mew-mew-Ai

### Landing page (hero section)

```jsx
<div className="text-center max-w-4xl mx-auto px-4 py-16">
  {/* Titre hero : Très grand, gras, serré */}
  <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
    L'IA qui propulse votre carrière
  </h1>

  {/* Sous-titre : Plus petit, poids moyen, espacé */}
  <p className="text-xl md:text-2xl text-gray-600 mt-6 leading-relaxed">
    Analysez, optimisez et générez votre CV en quelques clics
  </p>

  {/* CTA : Medium, espacement confortable */}
  <button className="mt-8 px-8 py-3 bg-primary-600 text-white text-lg font-medium rounded-md">
    Commencer gratuitement
  </button>
</div>
```

### Dashboard (cards)

```jsx
<div className="bg-white border border-gray-200 rounded-lg p-6 space-y-3">
  {/* Titre card : Bold, taille moyenne */}
  <h3 className="text-xl font-semibold text-gray-900">
    Analyser mon CV
  </h3>

  {/* Description : Normal, espacement confortable */}
  <p className="text-gray-600 leading-relaxed">
    Identifiez les métiers qui correspondent à votre profil en quelques minutes.
  </p>

  {/* Métadonnées : Petit, léger */}
  <div className="flex items-center gap-2 text-sm text-gray-500">
    <span>⏱ 5 minutes</span>
    <span>•</span>
    <span>Gratuit</span>
  </div>

  {/* CTA : Medium */}
  <button className="text-primary-600 hover:text-primary-700 font-medium">
    Commencer →
  </button>
</div>
```

### Formulaire

```jsx
<div className="space-y-2">
  {/* Label : Petit, medium, espacement */}
  <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
    Prénom *
  </label>

  {/* Input : Taille standard */}
  <input
    id="firstname"
    className="w-full px-4 py-2.5 text-base border border-gray-300 rounded-md"
  />

  {/* Helper text : Très petit, léger */}
  <p className="text-xs text-gray-500">
    Entrez votre prénom tel qu'il apparaît sur vos documents officiels.
  </p>
</div>
```

### Code snippet

```jsx
<div className="bg-gray-900 rounded-lg p-4">
  {/* Code : Monospace, petit */}
  <code className="font-mono text-sm text-green-400">
    npm install mew-mew-ai
  </code>
</div>
```

## Checklist Typographie

Avant de valider un texte :

- [ ] **Hiérarchie claire** : h1 > h2 > h3 > body (tailles et poids décroissants)
- [ ] **Line-height adapté** : Tight pour titres, relaxed pour texte long
- [ ] **Longueur de ligne** : Max 75 caractères (max-w-2xl pour texte principal)
- [ ] **Contraste suffisant** : WCAG AA minimum (4.5:1)
- [ ] **Taille minimale** : 14px (text-sm) pour le texte principal
- [ ] **Espacement caps** : tracking-wider pour texte en majuscules
- [ ] **Responsive** : Ajuster les tailles sur mobile (text-3xl md:text-4xl)
- [ ] **Polices cohérentes** : Geist Sans (UI), Geist Mono (code), pas de polices custom
- [ ] **Accessibilité** : Pas de texte en italique pour les longs paragraphes
- [ ] **Lisibilité** : Éviter font-light sur texte < 18px

---

**Utilisation** : Référence pour structurer la typographie de Mew-mew-Ai
**Dernière mise à jour** : Février 2026
