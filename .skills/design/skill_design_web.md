---
name: design web
description: Design responsive et mobile-first pour Mew-mew-Ai (Next.js + Tailwind CSS 4).
---

# Skill : Design Web pour Mew-mew-Ai

## Contexte du projet

Mew-mew-Ai est une application web (SaaS) qui doit :
- **Fonctionner sur tous les écrans** : Mobile, tablette, desktop
- **Mobile-first** : 60-70% du trafic sur mobile (chercheurs d'emploi)
- **Responsive** : Grilles adaptatives, images optimisées
- **Performance** : Temps de chargement rapide (<3s)
- **Stack** : Next.js 16, React 19, Tailwind CSS 4

## 1. Mobile-first approach

### Principe

**Coder d'abord pour mobile, puis ajouter les breakpoints pour desktop**

```jsx
// ✅ Bon : Mobile-first
<div className="
  p-4              {/* Mobile : padding 16px */}
  md:p-6           {/* Tablette : padding 24px */}
  lg:p-8           {/* Desktop : padding 32px */}
">
  <h1 className="
    text-3xl       {/* Mobile : 30px */}
    md:text-4xl    {/* Tablette : 36px */}
    lg:text-5xl    {/* Desktop : 48px */}
    font-bold
  ">
    Titre responsive
  </h1>
</div>

// ❌ Mauvais : Desktop-first (éviter)
<div className="
  p-8              {/* Desktop par défaut */}
  md:p-6           {/* Confus */}
  sm:p-4
">
  Contenu
</div>
```

### Pourquoi mobile-first ?

1. **Trafic majoritaire** : 60-70% sur mobile
2. **Performance** : Moins de CSS à charger sur mobile
3. **Contraintes** : Forcer à prioriser le contenu essentiel
4. **Progressive enhancement** : Ajouter des fonctionnalités pour desktop

## 2. Breakpoints Tailwind

### Échelle standard

| Breakpoint | Taille | Appareil | Usage |
|------------|--------|----------|-------|
| (défaut) | 0-639px | Mobile portrait | Base |
| `sm:` | 640px+ | Mobile large / portrait | Ajustements mineurs |
| `md:` | 768px+ | Tablette | 2 colonnes, sidebar |
| `lg:` | 1024px+ | Desktop | 3 colonnes, layouts complexes |
| `xl:` | 1280px+ | Desktop large | Conteneurs plus larges |
| `2xl:` | 1536px+ | Très large | Marges accrues |

### Utilisation dans Mew-mew-Ai

```jsx
// Dashboard : 1 colonne mobile, 2 tablette, 3 desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
  <Card title="Analyser CV" />
  <Card title="Optimiser CV" />
  <Card title="Portfolio Pro" />
</div>

// Header : Menu hamburger mobile, inline desktop
<header className="flex justify-between items-center p-4">
  <div className="flex items-center gap-2">
    <Logo />
  </div>

  {/* Menu mobile (hamburger) */}
  <button className="md:hidden" onClick={toggleMenu}>
    <MenuIcon className="w-6 h-6" />
  </button>

  {/* Menu desktop (inline) */}
  <nav className="hidden md:flex gap-6">
    <a href="/solutions/analyse-cv">Analyser</a>
    <a href="/solutions/optimiseur-cv">Optimiser</a>
    <a href="/solutions/portfolio">Portfolio</a>
  </nav>
</header>
```

## 3. Grilles responsive

### Grid Tailwind

**Principe** : Définir le nombre de colonnes par breakpoint

```jsx
// 1 colonne mobile, 2 tablette, 3 desktop, 4 large
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {items.map(item => (
    <div key={item.id} className="bg-white p-6 rounded-lg border">
      {item.content}
    </div>
  ))}
</div>

// Templates CV : 1 colonne mobile, 2 tablette, 3 desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {templates.map(template => (
    <TemplateCard key={template.id} template={template} />
  ))}
</div>
```

### Flexbox responsive

**Principe** : Stack mobile (colonne), row desktop (ligne)

```jsx
// Stack mobile, row desktop
<div className="flex flex-col lg:flex-row gap-8">
  <div className="lg:w-2/3">
    {/* Contenu principal (2/3 sur desktop) */}
  </div>
  <div className="lg:w-1/3">
    {/* Sidebar (1/3 sur desktop) */}
  </div>
</div>

// Formulaire : 1 colonne mobile, 2 desktop
<form className="flex flex-col md:flex-row gap-4">
  <input className="flex-1" placeholder="Prénom" />
  <input className="flex-1" placeholder="Nom" />
</form>
```

### Grille asymétrique

```jsx
// Hero section : image à droite sur desktop uniquement
<div className="flex flex-col lg:flex-row items-center gap-8">
  <div className="lg:w-1/2">
    <h1 className="text-4xl md:text-5xl font-bold">
      L'IA qui propulse votre carrière
    </h1>
    <p className="text-lg text-gray-600 mt-4">
      Analysez, optimisez et générez votre CV en quelques clics.
    </p>
    <button className="mt-6 bg-primary-600 text-white px-8 py-3 rounded-md">
      Commencer gratuitement
    </button>
  </div>
  <div className="lg:w-1/2">
    <img
      src="/images/hero.jpg"
      alt="Illustration"
      className="w-full rounded-lg"
    />
  </div>
</div>
```

## 4. Images et médias responsive

### next/image (optimisation auto)

**Principe** : Next.js optimise automatiquement les images (WebP, lazy loading, responsive)

```jsx
import Image from 'next/image';

// ✅ Bon : image responsive optimisée
<Image
  src="/images/hero.jpg"
  alt="Personne travaillant sur son CV"
  width={1200}
  height={800}
  priority // Si au-dessus de la ligne de flottaison
  className="rounded-lg"
/>

// ✅ Bon : image avec fill (container parent défini)
<div className="relative w-full h-64 md:h-96">
  <Image
    src="/images/hero.jpg"
    alt="Hero"
    fill
    className="object-cover rounded-lg"
  />
</div>

// ❌ Mauvais : <img> natif (pas d'optimisation)
<img src="/images/hero.jpg" alt="Hero" />
```

### Responsive images avec srcset

**Pour images non Next.js** :

```jsx
<img
  src="/images/hero-800.jpg"
  srcSet="
    /images/hero-400.jpg 400w,
    /images/hero-800.jpg 800w,
    /images/hero-1200.jpg 1200w
  "
  sizes="
    (max-width: 640px) 400px,
    (max-width: 1024px) 800px,
    1200px
  "
  alt="Hero"
  className="w-full h-auto rounded-lg"
/>
```

### Vidéos responsive

```jsx
// ✅ Bon : vidéo responsive (ratio 16:9)
<div className="relative w-full pb-[56.25%]"> {/* 9/16 = 56.25% */}
  <iframe
    className="absolute top-0 left-0 w-full h-full rounded-lg"
    src="https://www.youtube.com/embed/..."
    title="Démonstration Mew-mew-Ai"
    allowFullScreen
  />
</div>

// ✅ Bon : vidéo native avec poster
<video
  className="w-full h-auto rounded-lg"
  poster="/images/video-poster.jpg"
  controls
>
  <source src="/videos/demo.mp4" type="video/mp4" />
  <source src="/videos/demo.webm" type="video/webm" />
  Votre navigateur ne supporte pas la vidéo.
</video>
```

## 5. Typographie responsive

### Échelle de tailles

```jsx
// Titre hero : très grand desktop, plus petit mobile
<h1 className="
  text-3xl      {/* Mobile : 30px */}
  sm:text-4xl   {/* Mobile large : 36px */}
  md:text-5xl   {/* Tablette : 48px */}
  lg:text-6xl   {/* Desktop : 60px */}
  font-bold
  leading-tight
">
  L'IA qui propulse votre carrière
</h1>

// Sous-titre : adapté par breakpoint
<p className="
  text-base     {/* Mobile : 16px */}
  md:text-lg    {/* Tablette : 18px */}
  lg:text-xl    {/* Desktop : 20px */}
  text-gray-600
  leading-relaxed
">
  Analysez, optimisez et générez votre CV en quelques clics.
</p>

// Texte principal : taille stable
<p className="text-base leading-relaxed">
  Le texte principal reste à 16px sur tous les écrans.
</p>
```

### Longueur de ligne responsive

```jsx
// Limiter la largeur du texte pour la lisibilité
<div className="
  max-w-full     {/* Mobile : 100% */}
  md:max-w-2xl   {/* Tablette : 672px */}
  lg:max-w-3xl   {/* Desktop : 768px */}
  mx-auto
  px-4
">
  <p className="text-base leading-relaxed">
    Texte long qui reste lisible grâce à la largeur limitée...
  </p>
</div>
```

## 6. Espacements responsive

### Padding et margin

```jsx
// Conteneur principal : padding adaptatif
<div className="
  px-4          {/* Mobile : 16px */}
  sm:px-6       {/* Mobile large : 24px */}
  lg:px-8       {/* Desktop : 32px */}
  py-8          {/* Vertical : 32px partout */}
  md:py-12      {/* Desktop : 48px */}
">
  Contenu
</div>

// Espacement entre sections
<section className="
  space-y-8     {/* Mobile : 32px */}
  md:space-y-12 {/* Desktop : 48px */}
">
  <div>Section 1</div>
  <div>Section 2</div>
</section>
```

### Gap dans les grilles

```jsx
// Gap adaptatif selon l'écran
<div className="
  grid
  grid-cols-1
  md:grid-cols-2
  lg:grid-cols-3
  gap-4         {/* Mobile : 16px */}
  md:gap-6      {/* Tablette : 24px */}
  lg:gap-8      {/* Desktop : 32px */}
">
  <Card />
  <Card />
  <Card />
</div>
```

## 7. Navigation responsive

### Header mobile vs desktop

```jsx
'use client';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="Mew-mew-Ai" className="h-8 w-8" />
            <span className="text-xl font-bold">Mew-mew-Ai</span>
          </div>

          {/* Menu desktop (caché sur mobile) */}
          <nav className="hidden md:flex gap-6">
            <a href="/solutions/analyse-cv" className="text-gray-600 hover:text-primary-600">
              Analyser
            </a>
            <a href="/solutions/optimiseur-cv" className="text-gray-600 hover:text-primary-600">
              Optimiser
            </a>
            <a href="/solutions/portfolio" className="text-gray-600 hover:text-primary-600">
              Portfolio
            </a>
          </nav>

          {/* Actions desktop (cachées sur mobile) */}
          <div className="hidden md:flex items-center gap-3">
            <button className="text-gray-600 hover:text-gray-900">
              Connexion
            </button>
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md">
              S'inscrire
            </button>
          </div>

          {/* Bouton hamburger mobile (caché sur desktop) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Menu mobile (slide-down) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <nav className="px-4 py-4 space-y-2">
            <a
              href="/solutions/analyse-cv"
              className="block px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              Analyser mon CV
            </a>
            <a
              href="/solutions/optimiseur-cv"
              className="block px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              Optimiser mon CV
            </a>
            <a
              href="/solutions/portfolio"
              className="block px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              Portfolio Pro
            </a>
            <hr className="my-2" />
            <a
              href="/login"
              className="block px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              Connexion
            </a>
            <button className="w-full bg-primary-600 text-white px-4 py-2 rounded-md">
              S'inscrire
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
```

### Sidebar responsive

```jsx
// Sidebar : hidden mobile, visible desktop
<div className="flex">
  {/* Sidebar (cachée sur mobile) */}
  <aside className="hidden lg:block lg:w-64 border-r border-gray-200 p-6">
    <nav className="space-y-2">
      <a href="/dashboard" className="block px-4 py-2 rounded-md bg-primary-50 text-primary-600">
        Dashboard
      </a>
      <a href="/solutions" className="block px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100">
        Solutions
      </a>
    </nav>
  </aside>

  {/* Contenu principal */}
  <main className="flex-1 p-4 lg:p-8">
    {/* Contenu */}
  </main>
</div>
```

## 8. Formulaires responsive

### Layout adaptatif

```jsx
// Formulaire : 1 colonne mobile, 2 desktop
<form className="space-y-6">
  {/* Champs en grille 2 colonnes sur desktop */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-2">
      <label className="block text-sm font-medium">Prénom</label>
      <input className="w-full px-4 py-2.5 border rounded-md" />
    </div>
    <div className="space-y-2">
      <label className="block text-sm font-medium">Nom</label>
      <input className="w-full px-4 py-2.5 border rounded-md" />
    </div>
  </div>

  {/* Email pleine largeur */}
  <div className="space-y-2">
    <label className="block text-sm font-medium">Email</label>
    <input type="email" className="w-full px-4 py-2.5 border rounded-md" />
  </div>

  {/* Boutons : stack mobile, inline desktop */}
  <div className="flex flex-col md:flex-row gap-3 justify-end">
    <button type="button" className="px-6 py-2.5 bg-gray-100 rounded-md">
      Annuler
    </button>
    <button type="submit" className="px-6 py-2.5 bg-primary-600 text-white rounded-md">
      Valider
    </button>
  </div>
</form>
```

### Touch targets (mobile)

**Principe** : Boutons de 44x44px minimum sur mobile

```jsx
// ✅ Bon : bouton de taille suffisante
<button className="
  px-6 py-3      {/* Mobile : 48px de hauteur */}
  md:px-6 md:py-2.5  {/* Desktop : peut être plus petit */}
  min-h-[44px]   {/* Minimum 44px sur tous les écrans */}
  bg-primary-600
  text-white
  rounded-md
">
  Valider
</button>

// ❌ Mauvais : bouton trop petit sur mobile
<button className="px-2 py-1 text-xs">
  Valider {/* Trop petit pour toucher facilement */}
</button>
```

## 9. Performance responsive

### Lazy loading images

```jsx
import Image from 'next/image';

// Images below the fold : lazy loading
<Image
  src="/images/feature-1.jpg"
  alt="Fonctionnalité 1"
  width={800}
  height={600}
  loading="lazy" // Chargement différé
  className="rounded-lg"
/>

// Image hero : priority (pas de lazy loading)
<Image
  src="/images/hero.jpg"
  alt="Hero"
  width={1200}
  height={800}
  priority // Chargement prioritaire
/>
```

### Code splitting (routes)

**Next.js fait du code splitting automatique par route**

```
app/
  page.js              → Chunk 1 (landing page)
  login/page.js        → Chunk 2 (login)
  dashboard/page.js    → Chunk 3 (dashboard)
```

### Dynamic imports (composants lourds)

```jsx
import dynamic from 'next/dynamic';

// Composant lourd chargé uniquement quand nécessaire
const PDFViewer = dynamic(() => import('@/components/PDFViewer'), {
  loading: () => <p>Chargement du PDF...</p>,
  ssr: false // Désactiver le SSR pour ce composant
});

export default function CVPreview() {
  return (
    <div>
      <h1>Aperçu de votre CV</h1>
      <PDFViewer file="/cv.pdf" />
    </div>
  );
}
```

## 10. Cas d'usage spécifiques Mew-mew-Ai

### Landing page responsive

```jsx
// Hero section : image à droite sur desktop, en dessous sur mobile
<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
  <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
    <div className="lg:w-1/2 text-center lg:text-left">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
        L'IA qui propulse votre carrière
      </h1>
      <p className="text-lg md:text-xl text-gray-600 mt-4 md:mt-6">
        Analysez, optimisez et générez votre CV en quelques clics.
      </p>
      <button className="mt-6 md:mt-8 bg-primary-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-primary-700">
        Commencer gratuitement
      </button>
    </div>
    <div className="lg:w-1/2">
      <Image
        src="/images/hero.jpg"
        alt="Démonstration de la plateforme"
        width={600}
        height={400}
        priority
        className="rounded-lg shadow-xl"
      />
    </div>
  </div>
</section>
```

### Dashboard responsive

```jsx
// Grille de cards : 1 mobile, 2 tablette, 3 desktop
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
    Bienvenue, Jean 👋
  </h1>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
    <Card
      title="Analyser mon CV"
      description="Identifiez les métiers qui correspondent à votre profil"
      icon={<DocumentTextIcon className="w-8 h-8 text-primary-600" />}
      href="/solutions/analyse-cv"
    />
    <Card
      title="Optimiser mon CV"
      description="Améliorez votre CV pour les ATS"
      icon={<SparklesIcon className="w-8 h-8 text-primary-600" />}
      href="/solutions/optimiseur-cv"
    />
    <Card
      title="Portfolio Pro"
      description="Créez votre portfolio en ligne"
      icon={<BriefcaseIcon className="w-8 h-8 text-primary-600" />}
      href="/solutions/portfolio"
    />
  </div>
</div>
```

## Checklist Design Web Responsive

Avant de valider une page :

- [ ] **Mobile-first** : Code d'abord pour mobile, puis breakpoints
- [ ] **Grilles adaptatives** : grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- [ ] **Images responsive** : next/image avec width/height ou fill
- [ ] **Typographie** : Tailles adaptées (text-3xl md:text-4xl lg:text-5xl)
- [ ] **Espacements** : Padding/margin adaptatifs (px-4 md:px-6 lg:px-8)
- [ ] **Navigation** : Menu hamburger mobile, inline desktop
- [ ] **Touch targets** : Boutons ≥ 44x44px sur mobile
- [ ] **Formulaires** : 1 colonne mobile, 2 desktop
- [ ] **Performance** : Lazy loading, dynamic imports
- [ ] **Tests** : Chrome DevTools (responsive mode), devices réels

---

**Utilisation** : Référence pour créer des interfaces responsive et performantes sur Mew-mew-Ai
**Dernière mise à jour** : Février 2026
