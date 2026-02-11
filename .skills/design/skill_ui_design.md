---
name: UI design
description: Conception d'interfaces claires, cohérentes et fonctionnelles pour Mew-mew-Ai.
---

# Skill : UI Design pour Mew-mew-Ai

## Contexte du projet

Mew-mew-Ai nécessite des interfaces claires pour :
- **Dashboard utilisateur** : Vue d'ensemble des solutions (CV, portfolio)
- **Formulaires complexes** : Analyseur CV, optimiseur (multi-étapes)
- **Éditeur de portfolio** : Gestion de blocs (drag & drop, WYSIWYG)
- **Pages publiques** : Landing page, portfolios publics `/p/[slug]`
- **Templates CV** : 6 styles différents (moderne, classique, créatif, tech, executive, minimal)

## Principes UI pour Mew-mew-Ai

### 1. Hiérarchie visuelle (CRAP)

**C**ontrast (contraste) :
- Titres vs texte : `text-3xl font-bold` vs `text-base`
- CTA vs background : `bg-primary-600` vs `bg-white`
- Sections : bordures `border-gray-200`, espacement `space-y-8`

**R**epetition (répétition) :
- Même style de boutons partout (primary, secondary, outline)
- Cards identiques (shadow-sm, rounded-lg, border)
- Espacements cohérents (gap-4, p-6)

**A**lignment (alignement) :
- Grille Tailwind 12 colonnes : `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Alignement texte/images : `flex items-center gap-4`
- Conteneurs centrés : `max-w-7xl mx-auto px-4`

**P**roximity (proximité) :
- Grouper éléments liés : label + input dans un `<div className="space-y-2">`
- Séparer sections : `space-y-8` entre sections distinctes

### 2. Grilles et layouts

#### Layout principal (dashboard)

```jsx
// Conteneur global centré
<div className="min-h-screen bg-gray-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {/* Contenu */}
  </div>
</div>
```

#### Grille de cards (solutions)

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {solutions.map(solution => (
    <div key={solution.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <h3 className="text-xl font-semibold text-gray-900">{solution.title}</h3>
      <p className="text-gray-600 mt-2">{solution.description}</p>
      <button className="mt-4 text-primary-600 hover:text-primary-700 font-medium">
        Accéder →
      </button>
    </div>
  ))}
</div>
```

#### Layout formulaire (analyse CV)

```jsx
<div className="max-w-2xl mx-auto">
  <form className="bg-white border border-gray-200 rounded-lg p-8 space-y-6">
    {/* Titre section */}
    <div>
      <h2 className="text-2xl font-semibold text-gray-900">Informations personnelles</h2>
      <p className="text-sm text-gray-500 mt-1">Remplissez vos coordonnées</p>
    </div>

    {/* Champs en grille 2 colonnes */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Prénom</label>
        <input className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500" />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Nom</label>
        <input className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500" />
      </div>
    </div>

    {/* Actions */}
    <div className="flex gap-3 justify-end border-t border-gray-200 pt-6">
      <button type="button" className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-md">
        Annuler
      </button>
      <button type="submit" className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-md">
        Analyser mon CV
      </button>
    </div>
  </form>
</div>
```

### 3. Composants UI (états)

#### Bouton avec tous les états

```jsx
// Default
<button className="bg-primary-600 text-white px-6 py-2.5 rounded-md font-medium transition-all">
  Cliquer
</button>

// Hover (survol)
<button className="bg-primary-600 hover:bg-primary-700 hover:shadow-md text-white px-6 py-2.5 rounded-md font-medium transition-all">
  Cliquer
</button>

// Focus (clavier)
<button className="bg-primary-600 text-white px-6 py-2.5 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
  Cliquer
</button>

// Active (clic en cours)
<button className="bg-primary-600 active:bg-primary-800 text-white px-6 py-2.5 rounded-md font-medium">
  Cliquer
</button>

// Disabled
<button disabled className="bg-gray-300 text-gray-500 px-6 py-2.5 rounded-md font-medium cursor-not-allowed">
  Désactivé
</button>

// Loading
<button disabled className="bg-primary-600 text-white px-6 py-2.5 rounded-md font-medium flex items-center gap-2">
  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
  Chargement...
</button>
```

#### Input avec états de validation

```jsx
// Default
<input className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent" />

// Error state
<div>
  <input className="w-full px-4 py-2.5 border-2 border-red-500 rounded-md focus:ring-2 focus:ring-red-500" />
  <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
    <svg className="w-4 h-4" />
    Le prénom est obligatoire
  </p>
</div>

// Success state
<div>
  <input className="w-full px-4 py-2.5 border-2 border-green-500 rounded-md focus:ring-2 focus:ring-green-500" />
  <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
    <svg className="w-4 h-4" />
    Email valide
  </p>
</div>

// Disabled
<input disabled className="w-full px-4 py-2.5 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed text-gray-500" />
```

#### Card interactive

```jsx
// Default
<div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-4">
  <h3 className="text-xl font-semibold">Template Moderne</h3>
  <p className="text-gray-600">Parfait pour les profils tech et startups.</p>
</div>

// Hover (survol)
<div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-primary-300 p-6 space-y-4 transition-all cursor-pointer">
  <h3 className="text-xl font-semibold">Template Moderne</h3>
  <p className="text-gray-600">Parfait pour les profils tech et startups.</p>
</div>

// Selected (sélectionné)
<div className="bg-primary-50 border-2 border-primary-600 rounded-lg shadow-md p-6 space-y-4">
  <div className="flex justify-between items-start">
    <h3 className="text-xl font-semibold text-primary-900">Template Moderne</h3>
    <svg className="w-6 h-6 text-primary-600" /> {/* Checkmark */}
  </div>
  <p className="text-gray-700">Parfait pour les profils tech et startups.</p>
</div>
```

### 4. Navigation

#### Header principal

```jsx
<header className="bg-white border-b border-gray-200 sticky top-0 z-10">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src="/logo.svg" alt="Mew-mew-Ai" className="h-8 w-8" />
        <span className="text-xl font-bold text-gray-900">Mew-mew-Ai</span>
      </div>

      {/* Navigation desktop */}
      <nav className="hidden md:flex gap-6">
        <a href="/solutions/analyse-cv" className="text-gray-600 hover:text-primary-600 font-medium">
          Analyser mon CV
        </a>
        <a href="/solutions/portfolio" className="text-gray-600 hover:text-primary-600 font-medium">
          Portfolio Pro
        </a>
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button className="text-gray-600 hover:text-gray-900">Connexion</button>
        <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md">
          S'inscrire
        </button>
      </div>
    </div>
  </div>
</header>
```

#### Tabs (onglets)

```jsx
<div className="border-b border-gray-200">
  <nav className="flex gap-8">
    <button className="border-b-2 border-primary-600 text-primary-600 font-medium pb-4">
      Analyse
    </button>
    <button className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium pb-4">
      Optimisation
    </button>
    <button className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium pb-4">
      Génération
    </button>
  </nav>
</div>
```

### 5. Feedback utilisateur

#### Progress bar (étapes formulaire)

```jsx
<div className="space-y-2">
  {/* Étapes visuelles */}
  <div className="flex items-center justify-between">
    {['Identité', 'Expérience', 'Formation', 'Compétences'].map((step, index) => (
      <div key={step} className="flex items-center">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
          index <= currentStep
            ? 'bg-primary-600 text-white'
            : 'bg-gray-200 text-gray-500'
        }`}>
          {index < currentStep ? '✓' : index + 1}
        </div>
        <span className={`ml-2 text-sm font-medium ${
          index <= currentStep ? 'text-gray-900' : 'text-gray-500'
        }`}>
          {step}
        </span>
        {index < 3 && <div className="w-12 h-0.5 bg-gray-200 mx-2" />}
      </div>
    ))}
  </div>

  {/* Barre de progression */}
  <div className="w-full bg-gray-200 rounded-full h-2">
    <div
      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
      style={{ width: `${(currentStep + 1) * 25}%` }}
    />
  </div>
  <p className="text-sm text-gray-600 text-center">
    Étape {currentStep + 1} sur 4
  </p>
</div>
```

#### Toast notification

```jsx
// Success toast
<div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 flex items-start gap-3 max-w-sm">
  <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
    <svg className="w-6 h-6 text-green-600" />
  </div>
  <div className="flex-1">
    <h4 className="font-medium text-gray-900">CV généré avec succès</h4>
    <p className="text-sm text-gray-600 mt-1">Votre CV est prêt à être téléchargé.</p>
  </div>
  <button className="text-gray-400 hover:text-gray-600">
    <svg className="w-5 h-5" /> {/* Close icon */}
  </button>
</div>

// Error toast
<div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 flex items-start gap-3 max-w-sm">
  <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
    <svg className="w-6 h-6 text-red-600" />
  </div>
  <div className="flex-1">
    <h4 className="font-medium text-gray-900">Erreur de génération</h4>
    <p className="text-sm text-gray-600 mt-1">Le fichier doit être un PDF de moins de 2 Mo.</p>
  </div>
</div>
```

#### Loading skeleton

```jsx
<div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4 animate-pulse">
  <div className="h-6 bg-gray-200 rounded w-3/4" />
  <div className="h-4 bg-gray-200 rounded w-full" />
  <div className="h-4 bg-gray-200 rounded w-5/6" />
  <div className="h-10 bg-gray-200 rounded w-32" />
</div>
```

### 6. Responsive design (mobile-first)

#### Grille responsive

```jsx
// Mobile : 1 colonne
// Tablette (md) : 2 colonnes
// Desktop (lg) : 3 colonnes
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
  {items.map(item => (
    <div key={item.id} className="bg-white p-4 md:p-6 rounded-lg">
      {/* Contenu */}
    </div>
  ))}
</div>
```

#### Stack mobile, row desktop

```jsx
// Mobile : empilé verticalement
// Desktop : aligné horizontalement
<div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
  <div className="flex-1">Colonne 1</div>
  <div className="flex-1">Colonne 2</div>
</div>
```

#### Hide/show selon breakpoint

```jsx
// Visible uniquement sur mobile
<div className="block lg:hidden">Menu mobile</div>

// Visible uniquement sur desktop
<div className="hidden lg:block">Menu desktop</div>
```

### 7. Cas d'usage spécifiques Mew-mew-Ai

#### Sélecteur de template CV

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {templates.map(template => (
    <div
      key={template.id}
      onClick={() => setSelectedTemplate(template.id)}
      className={`
        border-2 rounded-lg p-4 cursor-pointer transition-all
        ${selectedTemplate === template.id
          ? 'border-primary-600 bg-primary-50 shadow-md'
          : 'border-gray-200 hover:border-primary-300 hover:shadow-sm'
        }
      `}
    >
      {/* Aperçu miniature */}
      <div className="aspect-[1/1.4] bg-gray-100 rounded mb-4 overflow-hidden">
        <img src={template.preview} alt={template.name} className="w-full h-full object-cover" />
      </div>

      {/* Infos */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-900">{template.name}</h3>
          {selectedTemplate === template.id && (
            <svg className="w-5 h-5 text-primary-600" /> {/* Checkmark */}
          )}
        </div>
        <p className="text-sm text-gray-600">{template.description}</p>
        <div className="flex gap-2">
          {template.tags.map(tag => (
            <span key={tag} className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  ))}
</div>
```

#### Éditeur de blocs portfolio

```jsx
<div className="space-y-4">
  {blocks.map((block, index) => (
    <div key={block.id} className="bg-white border-2 border-gray-200 rounded-lg p-4 group hover:border-primary-300">
      {/* Header du bloc */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <button className="cursor-move text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" /> {/* Drag handle */}
          </button>
          <span className="font-medium text-gray-900">{block.type}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-2 text-gray-400 hover:text-primary-600">
            <svg className="w-5 h-5" /> {/* Edit */}
          </button>
          <button className="p-2 text-gray-400 hover:text-red-600">
            <svg className="w-5 h-5" /> {/* Delete */}
          </button>
        </div>
      </div>

      {/* Aperçu du contenu */}
      <div className="text-sm text-gray-600">
        {block.content}
      </div>
    </div>
  ))}

  {/* Bouton ajouter un bloc */}
  <button className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-gray-500 hover:border-primary-600 hover:text-primary-600 transition-all">
    + Ajouter un bloc
  </button>
</div>
```

## Checklist UI Design

Avant de créer une nouvelle interface :

- [ ] **Hiérarchie claire** : Titres > sous-titres > texte > actions
- [ ] **Contrastes suffisants** : WCAG AA minimum (4.5:1)
- [ ] **États visibles** : Hover, focus, disabled, loading, error, success
- [ ] **Responsive** : Mobile-first (sm, md, lg, xl)
- [ ] **Feedback utilisateur** : Confirmations, erreurs, loading states
- [ ] **Navigation claire** : Header, breadcrumbs, tabs
- [ ] **Espacements cohérents** : Multiples de 4px (Tailwind scale)
- [ ] **Composants réutilisables** : Créer dans `components/shared/` si utilisé 2+ fois
- [ ] **Accessibilité** : Labels, alt texts, keyboard nav, ARIA si nécessaire
- [ ] **Performance** : Lazy loading images, skeleton loaders

---

**Utilisation** : Référence pour concevoir les interfaces de Mew-mew-Ai
**Dernière mise à jour** : Février 2026
