---
name: design responsive
description: Adaptation du design à tous les formats d'écran.
---

# Skill : Design Responsive

## Description

Le design responsive est la capacité d'une interface web à **s'adapter automatiquement** à tous les formats d'écran (mobile, tablet, desktop, TV). Sur Mew-mew-Ai, cela signifie :
- **Lisibilité** : Texte lisible sur mobile (min 16px)
- **Accessibilité** : Boutons cliquables au pouce (min 44x44px)
- **Hiérarchie** : Layout qui s'adapte (1 col mobile → 3 cols desktop)
- **Performance** : Images optimisées par taille d'écran

## Analogie

Le design responsive, c'est comme **l'eau** :
- Versée dans un verre → prend la forme du verre (mobile)
- Versée dans une bouteille → prend la forme de la bouteille (tablet)
- Versée dans une bassine → prend la forme de la bassine (desktop)

Le contenu (eau) reste le même, mais la **forme s'adapte au contenant**.

## Breakpoints Tailwind CSS 4

**Configuration par défaut** (Mew-mew-Ai utilise celles-ci) :

```
sm   640px   @media (min-width: 640px)   { ... }
md   768px   @media (min-width: 768px)   { ... }
lg   1024px  @media (min-width: 1024px)  { ... }
xl   1280px  @media (min-width: 1280px)  { ... }
2xl  1536px  @media (min-width: 1536px)  { ... }
```

**Stratégie Mew-mew-Ai** : Mobile-first (par défaut mobile, puis ajouter `md:` et `lg:` pour desktop).

## Principes du responsive

### 1. Mobile-first (approche recommandée)

**Principe** : Concevoir d'abord pour mobile, puis enrichir pour desktop.

```jsx
// ✅ Mobile-first (Tailwind par défaut)
<div className="
  text-4xl              // Mobile : 36px
  md:text-5xl           // Tablet (768px+) : 48px
  lg:text-6xl           // Desktop (1024px+) : 60px
">
  Titre responsive
</div>

// ❌ Desktop-first (moins maintenable)
<div className="
  lg:text-6xl
  md:text-5xl
  text-4xl
">
  Titre responsive
</div>
```

### 2. Grid fluide (colonnes adaptatives)

**Règle** : 1 colonne mobile → 2 colonnes tablet → 3 colonnes desktop.

```jsx
<div className="
  grid                    // Active le grid
  grid-cols-1             // Mobile : 1 colonne
  md:grid-cols-2          // Tablet (768px+) : 2 colonnes
  lg:grid-cols-3          // Desktop (1024px+) : 3 colonnes
  gap-6                   // Espacement 24px
">
  {portfolios.map(portfolio => (
    <Card key={portfolio.id} {...portfolio} />
  ))}
</div>
```

### 3. Images responsives (next/image)

**Next.js optimise automatiquement** les images selon l'écran.

```jsx
import Image from 'next/image';

<Image
  src="/hero-image.jpg"
  alt="Description"
  width={1200}
  height={600}
  className="w-full h-auto"
  priority // Si above the fold
  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>
```

**Résultat** :
- Mobile : charge image 640px
- Tablet : charge image 1024px
- Desktop : charge image 1920px
- Format WebP automatique (si supporté)

### 4. Typographie responsive

**Principe** : Taille de police adaptée à la largeur d'écran.

```jsx
// Titres
<h1 className="
  text-4xl sm:text-5xl md:text-6xl lg:text-7xl
  font-bold leading-tight
">
  Mew - L'IA qui vous propulse
</h1>

// Corps de texte
<p className="
  text-base sm:text-lg md:text-xl
  leading-relaxed
">
  Votre carrière mérite une intelligence artificielle dédiée.
</p>
```

### 5. Espacements adaptatifs

**Principe** : Padding/margin réduits sur mobile, généreux sur desktop.

```jsx
<section className="
  px-4 py-8        // Mobile : padding 16px horizontal, 32px vertical
  md:px-6 md:py-12 // Tablet : padding 24px horizontal, 48px vertical
  lg:px-8 lg:py-16 // Desktop : padding 32px horizontal, 64px vertical
">
  Contenu
</section>
```

## Patterns responsive pour Mew-mew-Ai

### 1. Navigation responsive (header)

```jsx
// components/shared/Navigation.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="
        container mx-auto
        px-4 md:px-6 lg:px-8     // Padding adaptatif
      ">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="font-bold text-xl">
            Mew
          </Link>

          {/* Navigation desktop (cachée sur mobile) */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/solutions/analyse-cv" className="text-gray-600 hover:text-gray-900">
              Analyse CV
            </Link>
            <Link href="/solutions/optimiseur-cv" className="text-gray-600 hover:text-gray-900">
              Optimiseur
            </Link>
            <Link href="/solutions/portfolio" className="text-gray-600 hover:text-gray-900">
              Portfolio
            </Link>
          </div>

          {/* Bouton CTA desktop */}
          <div className="hidden md:block">
            <Button variant="primary">Dashboard</Button>
          </div>

          {/* Bouton menu mobile (visible seulement sur mobile) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Menu mobile (visible seulement si ouvert) */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-4">
              <Link
                href="/solutions/analyse-cv"
                className="text-gray-600 hover:text-gray-900 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Analyse CV
              </Link>
              <Link
                href="/solutions/optimiseur-cv"
                className="text-gray-600 hover:text-gray-900 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Optimiseur CV
              </Link>
              <Link
                href="/solutions/portfolio"
                className="text-gray-600 hover:text-gray-900 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Portfolio
              </Link>
              <Button variant="primary" className="w-full mt-2">
                Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
```

### 2. Formulaires responsive

```jsx
// app/solutions/analyse-cv/page.js (extrait)
export default function AnalyzeCVForm() {
  return (
    <form className="
      max-w-3xl mx-auto
      px-4 md:px-6        // Padding adaptatif
      py-8 md:py-12
    ">
      {/* Champs pleine largeur sur mobile */}
      <div className="space-y-6">
        <FormField
          label="Email"
          name="email"
          type="email"
          required
        />

        {/* Deux champs côte à côte sur desktop uniquement */}
        <div className="
          grid
          grid-cols-1        // Mobile : 1 colonne
          md:grid-cols-2     // Desktop : 2 colonnes
          gap-4
        ">
          <FormField label="Prénom" name="prenom" required />
          <FormField label="Nom" name="nom" required />
        </div>

        {/* Bouton pleine largeur sur mobile */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full md:w-auto md:ml-auto md:block"
        >
          Analyser mon CV
        </Button>
      </div>
    </form>
  );
}
```

### 3. Cards responsive (grid adaptatif)

```jsx
// app/solutions/portfolio/page.js (extrait)
export default function PortfolioListPage() {
  return (
    <div className="
      container mx-auto
      px-4 md:px-6 lg:px-8
      py-8 md:py-12 lg:py-16
    ">
      <h1 className="
        text-3xl md:text-4xl lg:text-5xl
        font-bold mb-8
      ">
        Mes portfolios
      </h1>

      {/* Grid adaptatif */}
      <div className="
        grid
        grid-cols-1              // Mobile : 1 colonne
        sm:grid-cols-2           // Tablet small : 2 colonnes
        lg:grid-cols-3           // Desktop : 3 colonnes
        gap-6 lg:gap-8           // Espacement adaptatif
      ">
        {portfolios.map(portfolio => (
          <Card
            key={portfolio.id}
            title={portfolio.title}
            subtitle={`${portfolio.views_count} vues`}
            image={portfolio.cover_image}
          />
        ))}
      </div>
    </div>
  );
}
```

### 4. Hero section responsive

```jsx
// app/page.js (landing page)
export default function HomePage() {
  return (
    <section className="
      bg-gradient-to-br from-primary via-secondary to-primary/80
      text-white
      py-16 md:py-24 lg:py-32     // Padding vertical adaptatif
      px-6 md:px-8
    ">
      <div className="container mx-auto max-w-6xl">
        <div className="
          grid
          grid-cols-1              // Mobile : 1 colonne (texte au-dessus)
          lg:grid-cols-2           // Desktop : 2 colonnes (texte + image)
          gap-12
          items-center
        ">
          {/* Texte */}
          <div>
            <h1 className="
              text-4xl sm:text-5xl md:text-6xl lg:text-7xl
              font-bold leading-tight mb-6
            ">
              Mew - L'IA qui vous propulse
            </h1>
            <p className="
              text-lg sm:text-xl md:text-2xl
              opacity-90 mb-8
            ">
              Votre carrière mérite une intelligence artificielle dédiée
            </p>
            <Button
              variant="primary"
              size="lg"
              className="
                w-full sm:w-auto     // Pleine largeur mobile, auto desktop
              "
            >
              Commencer gratuitement
            </Button>
          </div>

          {/* Image (cachée sur mobile si trop petite) */}
          <div className="hidden lg:block">
            <Image
              src="/hero-illustration.png"
              alt="Illustration"
              width={600}
              height={500}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
```

### 5. Tableau responsive (scroll horizontal)

```jsx
// Dashboard : statistiques
export default function StatsTable() {
  return (
    <div className="
      overflow-x-auto        // Scroll horizontal si tableau trop large
      -mx-4 md:mx-0          // Déborde du padding sur mobile
    ">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Portfolio
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Vues
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Statut
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {portfolios.map(portfolio => (
            <tr key={portfolio.id} className="border-t border-gray-200">
              <td className="px-4 py-3">{portfolio.title}</td>
              <td className="px-4 py-3">{portfolio.views_count}</td>
              <td className="px-4 py-3">
                <Badge variant={portfolio.published ? 'success' : 'warning'}>
                  {portfolio.published ? 'Publié' : 'Brouillon'}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <Button variant="ghost" size="sm">
                  Éditer
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

## Diagramme : Layouts responsive

```
┌─────────────────────────────────────────────────────────┐
│                  MOBILE (< 768px)                       │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Header (burger menu)                             │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Hero (texte centré)                              │  │
│  │ Image cachée                                     │  │
│  │ CTA pleine largeur                               │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Card 1                                           │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Card 2                                           │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Footer (colonnes empilées)                       │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│               TABLET (768px - 1024px)                   │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Header (navigation visible)                      │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Hero (texte + image côte à côte)                 │  │
│  │ [Texte]          [Image]                         │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌───────────────────────┬──────────────────────────┐  │
│  │ Card 1                │ Card 2                   │  │
│  └───────────────────────┴──────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Footer (2 colonnes)                              │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              DESKTOP (> 1024px)                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Header (navigation + CTA)                        │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Hero (texte + image, grande image)               │  │
│  │ [Texte large]    [Grande image]                  │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌─────────────┬─────────────┬─────────────────────┐  │
│  │ Card 1      │ Card 2      │ Card 3              │  │
│  └─────────────┴─────────────┴─────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Footer (4 colonnes)                              │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Checklist pratique

### ✅ Stratégie mobile-first

- [ ] CSS par défaut pour mobile (sans préfixe `md:` ou `lg:`)
- [ ] Ajout progressif de styles desktop (`md:`, `lg:`)
- [ ] Test sur mobile d'abord, puis desktop

### ✅ Typographie

- [ ] Titres adaptatifs (`text-4xl md:text-5xl lg:text-6xl`)
- [ ] Corps de texte min 16px sur mobile (évite zoom auto iOS)
- [ ] Line-height cohérent (1.5-1.7)

### ✅ Layout

- [ ] Grid adaptatif (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)
- [ ] Padding adaptatif (`px-4 md:px-6 lg:px-8`)
- [ ] Max-width containers (`max-w-7xl mx-auto`)

### ✅ Navigation

- [ ] Menu burger sur mobile (`md:hidden`)
- [ ] Navigation horizontale sur desktop (`hidden md:flex`)
- [ ] Logo toujours visible

### ✅ Boutons

- [ ] Pleine largeur sur mobile (`w-full md:w-auto`)
- [ ] Taille min 44x44px (tactile)
- [ ] Espacement suffisant entre boutons

### ✅ Images

- [ ] `next/image` avec `sizes` attribute
- [ ] Images cachées sur mobile si non critiques (`hidden lg:block`)
- [ ] Aspect-ratio préservé (`w-full h-auto`)

### ✅ Formulaires

- [ ] Un champ par ligne sur mobile
- [ ] Deux champs côte à côte sur desktop (`md:grid-cols-2`)
- [ ] Labels au-dessus des champs (pas à gauche)

### ✅ Tableaux

- [ ] Scroll horizontal sur mobile (`overflow-x-auto`)
- [ ] OU transformation en cards sur mobile
- [ ] Min-width défini (`min-w-[600px]`)

### ✅ Tests

- [ ] Test Chrome DevTools (responsive mode)
- [ ] Test iOS Safari (iPhone)
- [ ] Test Android Chrome
- [ ] Test tablet (iPad)
- [ ] Test desktop (1920px)

## Erreurs à éviter

### ❌ Desktop-first (difficile à maintenir)

```jsx
// ❌ MAUVAIS : Commence par desktop, soustrait pour mobile
<div className="
  text-6xl lg:text-6xl md:text-5xl text-4xl
">
  Titre
</div>

// ✅ BON : Commence par mobile, ajoute pour desktop
<div className="
  text-4xl md:text-5xl lg:text-6xl
">
  Titre
</div>
```

### ❌ Breakpoints arbitraires

```jsx
// ❌ MAUVAIS : Valeurs custom non standardisées
<div className="
  text-base
  [900px]:text-lg
  [1100px]:text-xl
">
  Texte
</div>

// ✅ BON : Utiliser les breakpoints Tailwind standard
<div className="
  text-base md:text-lg lg:text-xl
">
  Texte
</div>
```

### ❌ Polices < 16px sur mobile (zoom auto iOS)

```jsx
// ❌ MAUVAIS : iOS zoom automatiquement si < 16px
<input className="text-sm" /> // 14px → zoom automatique

// ✅ BON : Min 16px sur mobile
<input className="text-base md:text-sm" /> // 16px mobile, 14px desktop
```

### ❌ Boutons trop petits (mobile)

```jsx
// ❌ MAUVAIS : Impossible à cliquer au pouce
<button className="px-2 py-1 text-xs">
  Cliquez-moi
</button>

// ✅ BON : Taille min 44x44px
<button className="px-6 py-3 text-base">
  Cliquez-moi
</button>
```

### ❌ Images non optimisées

```jsx
// ❌ MAUVAIS : Charge image 3000px sur mobile
<img src="/hero-3000px.jpg" alt="Hero" />

// ✅ BON : next/image optimise automatiquement
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

## Outils de test

### Chrome DevTools (Responsive Mode)

```
F12 → Toggle device toolbar (Ctrl+Shift+M)
Presets : iPhone 12 Pro, iPad, Galaxy S20, etc.
```

### BrowserStack (tests cross-device)

Tester sur vrais devices iOS/Android : https://www.browserstack.com/

### Responsive Viewer (Extension Chrome)

Affiche plusieurs tailles d'écran simultanément.

### Lighthouse (audit mobile)

```
F12 → Lighthouse → Mobile → Generate report
```

**Métriques clés** :
- Performance mobile > 90
- Accessibility > 95
- Best Practices > 90

## Ressources

### Documentation
- [Tailwind Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [MDN Media Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)

### Outils
- [Responsively](https://responsively.app/) - Browser pour responsive design
- [Sizzy](https://sizzy.co/) - Tester toutes les tailles d'écran
- [Am I Responsive](https://ui.dev/amiresponsive) - Preview multi-devices

---

**Prochaines étapes** : Documenter les micro-interactions pour enrichir l'expérience utilisateur.
