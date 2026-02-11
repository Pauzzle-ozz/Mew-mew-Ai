---
name: ergonomie web
description: Amélioration de la lisibilité et de la simplicité d'usage.
---

# Skill : Ergonomie Web

## Description

L'ergonomie web est la **facilité d'utilisation concrète** d'une interface. C'est la science qui répond à : "L'utilisateur peut-il accomplir sa tâche facilement, rapidement et sans frustration ?". Sur Mew-mew-Ai, l'ergonomie concerne :
- **La navigation** : Trouve-t-on facilement ce qu'on cherche ?
- **La saisie** : Les formulaires sont-ils simples et rapides ?
- **La lecture** : Le contenu est-il clair et scannable ?
- **L'interaction** : Les boutons, liens et actions sont-ils évidents ?

## Analogie

L'ergonomie web, c'est comme **l'ergonomie d'une cuisine** :
- Les **ustensiles fréquents** sont à portée de main (navigation principale visible)
- Les **plaques** sont à hauteur confortable (pas besoin de se baisser = scroll minimal)
- Les **étiquettes** sont claires (pas de jargon = labels explicites)
- Les **tiroirs** s'ouvrent facilement (pas de friction = clics intuitifs)

Une mauvaise ergonomie → fatigue, erreurs, abandon.
Une bonne ergonomie → fluidité, rapidité, satisfaction.

## Principes théoriques

### 1. Règle des 3 clics (Three-Click Rule)

> "L'utilisateur doit pouvoir atteindre n'importe quelle information en maximum 3 clics."

**Exemple Mew-mew-Ai** :
```
Dashboard (1 clic) → Solutions (1 clic) → Analyse CV (1 clic) = 3 clics max
```

### 2. Zone de Gutenberg (lecture en F/Z)

Les utilisateurs scannent les pages web en **forme de F** :
```
[═══════════════════]  ← Haut gauche (très lu)
[════════            ]  ← Milieu gauche (moyennement lu)
[═══                 ]  ← Bas gauche (peu lu)
         [═══]         ← Bas droite (très peu lu)
```

**Application** :
- Logo et navigation en haut à gauche
- CTA principal en haut (hero section)
- Infos critiques à gauche (formulaires, titres)

### 3. Loi de Fitts (taille et distance des cibles)

> "Le temps pour atteindre une cible dépend de sa distance et de sa taille."

**Règles** :
- Boutons principaux : min 44x44px (norme tactile)
- Espacement entre cliquables : min 8px
- Actions fréquentes : grosses et proches (ex: "Valider" en bas de formulaire)

### 4. Principe de Pareto (80/20)

> "80% des utilisateurs utilisent 20% des fonctionnalités."

**Application Mew-mew-Ai** :
- Les 3 solutions principales (Analyse CV, Optimiseur, Portfolio) bien visibles
- Fonctions avancées (export Word, paramètres avancés) cachées par défaut

### 5. Charge cognitive (Cognitive Load Theory)

L'utilisateur a une mémoire de travail limitée (7 ± 2 éléments). Réduire la charge :
- **Chunking** : Grouper les infos (formulaire en sections)
- **Recognition vs Recall** : Montrer les options vs forcer à se souvenir
- **Consistency** : Même pattern partout (moins d'apprentissage)

## Principes d'ergonomie pour Mew-mew-Ai

### 1. Navigation claire et prévisible

**Checklist** :
- [ ] Logo cliquable (retour accueil)
- [ ] Navigation principale toujours visible (sticky header)
- [ ] Max 7 items de navigation (Miller's Law)
- [ ] État actif visible (couleur, soulignement)
- [ ] Fil d'Ariane sur pages profondes

**Exemple** :
```jsx
// components/shared/Navigation.jsx (simplifié)
<nav className="sticky top-0 bg-white border-b border-gray-200 z-50">
  <div className="flex items-center justify-between px-6 h-16">
    {/* Logo (retour accueil) */}
    <Link href="/" className="font-bold text-xl">
      Mew
    </Link>

    {/* Navigation principale (max 5 items) */}
    <div className="flex gap-6">
      <NavLink href="/solutions/analyse-cv" active={pathname === '/solutions/analyse-cv'}>
        Analyse CV
      </NavLink>
      <NavLink href="/solutions/optimiseur-cv">
        Optimiseur
      </NavLink>
      <NavLink href="/solutions/portfolio">
        Portfolio
      </NavLink>
    </div>

    {/* Actions utilisateur */}
    <div>
      <Link href="/dashboard">
        <Button variant="primary">Dashboard</Button>
      </Link>
    </div>
  </div>
</nav>

// NavLink avec état actif
function NavLink({ href, active, children }) {
  return (
    <Link
      href={href}
      className={`
        font-medium transition-colors
        ${active
          ? 'text-primary border-b-2 border-primary'
          : 'text-gray-600 hover:text-gray-900'}
      `}
    >
      {children}
    </Link>
  );
}
```

### 2. Formulaires ergonomiques

**Principes** :
- Un seul champ par ligne (sauf nom/prénom côte à côte)
- Labels au-dessus des champs (pas à gauche)
- Placeholder = exemple, pas label
- Validation en temps réel
- Erreurs sous le champ concerné
- Bouton de soumission en bas à droite

**Exemple** :
```jsx
// Formulaire ergonomique
<form className="max-w-2xl mx-auto space-y-6">
  {/* Un champ par ligne */}
  <div>
    <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
      Email *
    </label>
    <input
      type="email"
      id="email"
      name="email"
      placeholder="jean@example.com"
      className={`
        w-full px-4 py-3 border rounded-lg
        ${errors.email ? 'border-error' : 'border-gray-300'}
        focus:outline-none focus:ring-2 focus:ring-primary/50
      `}
      value={formData.email}
      onChange={handleChange}
      onBlur={validateField}
    />
    {errors.email && (
      <p className="text-error text-sm mt-2">
        {errors.email}
      </p>
    )}
  </div>

  {/* Deux champs côte à côte (exception) */}
  <div className="grid md:grid-cols-2 gap-4">
    <div>
      <label htmlFor="prenom" className="block text-sm font-medium text-gray-900 mb-2">
        Prénom *
      </label>
      <input
        type="text"
        id="prenom"
        name="prenom"
        placeholder="Jean"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg"
        value={formData.prenom}
        onChange={handleChange}
      />
    </div>
    <div>
      <label htmlFor="nom" className="block text-sm font-medium text-gray-900 mb-2">
        Nom *
      </label>
      <input
        type="text"
        id="nom"
        name="nom"
        placeholder="Dupont"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg"
        value={formData.nom}
        onChange={handleChange}
      />
    </div>
  </div>

  {/* Bouton de soumission (bas droite, gros) */}
  <div className="flex justify-end pt-4">
    <Button
      type="submit"
      variant="primary"
      size="lg"
      disabled={!isFormValid}
    >
      Analyser mon CV
    </Button>
  </div>
</form>
```

### 3. Lisibilité et scannabilité

**Principes** :
- Longueur de ligne max : 75 caractères (`max-w-3xl`)
- Hiérarchie claire (titres > sous-titres > corps)
- Listes à puces (vs pavés de texte)
- Espacement généreux (line-height 1.6)
- Mots clés en gras (scan rapide)

**Exemple** :
```jsx
// Article lisible
<article className="max-w-3xl mx-auto px-6 py-12">
  {/* Titre principal */}
  <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
    Comment optimiser votre CV avec l'IA
  </h1>

  {/* Sous-titre */}
  <p className="text-xl text-gray-600 mb-8 leading-relaxed">
    Découvrez les 5 étapes pour transformer votre CV en aimant à recruteurs.
  </p>

  {/* Corps de texte */}
  <div className="prose prose-lg text-gray-700 space-y-6">
    <p>
      <strong>L'optimisation de CV</strong> n'est pas qu'une question de
      mots-clés. C'est une science qui combine :
    </p>

    <ul className="list-disc pl-6 space-y-2">
      <li>Analyse sémantique de vos compétences</li>
      <li>Correspondance avec les offres d'emploi</li>
      <li>Structuration pour les ATS (systèmes de recrutement)</li>
      <li>Mise en valeur de vos points forts</li>
    </ul>

    <p>
      Notre IA traite ces 4 aspects en <strong>moins de 30 secondes</strong>,
      là où un consultant prendrait plusieurs heures.
    </p>
  </div>
</article>
```

### 4. Taille des zones cliquables (tactile-friendly)

**Règle** : Minimum 44x44px (norme Apple/Google).

**Exemples** :
```jsx
// ❌ MAUVAIS : Lien trop petit (mobile)
<a href="/login" className="text-sm">
  Connexion
</a>

// ✅ BON : Zone cliquable minimum 44px
<a
  href="/login"
  className="inline-flex items-center justify-center min-h-[44px] px-6 text-sm font-medium"
>
  Connexion
</a>

// Bouton (déjà ergonomique avec padding)
<Button variant="primary" size="md" className="px-6 py-3">
  {/* py-3 = 12px x 2 + texte ~20px = 44px min */}
  Valider
</Button>
```

### 5. Feedback visuel immédiat

**Principe** : Chaque action doit avoir une réaction visuelle instantanée.

**Exemples** :
```jsx
// Hover states
<button className="
  bg-primary hover:bg-primary-hover
  transform hover:scale-105
  transition-all duration-200
">
  Cliquez-moi
</button>

// Active state (clic)
<button className="
  bg-primary active:scale-95
  transition-transform
">
  Cliquez-moi
</button>

// Focus state (clavier)
<input className="
  border border-gray-300
  focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
" />

// Disabled state
<button
  disabled
  className="
    bg-gray-300 text-gray-500
    cursor-not-allowed
    opacity-50
  "
>
  Action indisponible
</button>
```

### 6. Gestion des erreurs constructive

**Principes** :
- Message clair (pas de code d'erreur)
- Localisation précise (sous le champ concerné)
- Solution proposée (pas juste "erreur")
- Ton humain (pas robotique)

**Exemple** :
```jsx
// ❌ MAUVAIS : Message technique inutile
<ErrorMessage>
  Error 422: Validation failed at field "email"
</ErrorMessage>

// ✅ BON : Message humain + solution
<div className="bg-error/10 border border-error rounded-lg p-4 mb-4">
  <div className="flex items-start gap-3">
    <svg className="w-5 h-5 text-error mt-0.5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
    </svg>
    <div>
      <p className="font-medium text-error mb-1">
        L'adresse email n'est pas valide
      </p>
      <p className="text-sm text-gray-700">
        Vérifiez qu'elle contient bien un @ et un nom de domaine (ex: nom@example.com)
      </p>
    </div>
  </div>
</div>
```

### 7. Search et filtres (si applicable)

**Principes** :
- Champ de recherche visible (pas caché dans menu)
- Autocomplete si >50 items
- Filtres clairs et visibles
- Nombre de résultats affiché
- Possibilité de réinitialiser

**Exemple (liste de portfolios)** :
```jsx
<div className="mb-6">
  {/* Barre de recherche */}
  <div className="relative mb-4">
    <input
      type="text"
      placeholder="Rechercher un portfolio..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50"
    />
    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  </div>

  {/* Filtres */}
  <div className="flex flex-wrap gap-3">
    <button
      onClick={() => setFilter('all')}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        filter === 'all'
          ? 'bg-primary text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      Tous ({portfolios.length})
    </button>
    <button
      onClick={() => setFilter('published')}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        filter === 'published'
          ? 'bg-primary text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      Publiés ({portfolios.filter(p => p.published).length})
    </button>
    <button
      onClick={() => setFilter('draft')}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        filter === 'draft'
          ? 'bg-primary text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      Brouillons ({portfolios.filter(p => !p.published).length})
    </button>
  </div>

  {/* Nombre de résultats */}
  <p className="text-sm text-gray-600 mt-4">
    {filteredPortfolios.length} portfolio(s) trouvé(s)
  </p>
</div>
```

## Diagramme : Zones ergonomiques d'une page

```
┌────────────────────────────────────────────────┐
│  HEADER (sticky, toujours visible)             │
│  [Logo]  Nav1  Nav2  Nav3      [CTA Primaire] │ ← Zone critique
└────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│  HERO SECTION                                  │
│  [H1 Titre principal]                          │ ← Above the fold
│  [Sous-titre explicatif]                       │    (très visible)
│  [CTA Gros bouton]                             │
└────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│  CONTENU PRINCIPAL                             │
│  Largeur max 75 caractères (lisibilité)        │
│  Espacement généreux (line-height 1.6)         │ ← Zone de lecture
│  Listes à puces (scannabilité)                 │    (moyennement visible)
│  Mots clés en gras                             │
└────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│  FOOTER                                        │
│  [Liens secondaires]  [Réseaux sociaux]        │ ← Below the fold
│  [Mentions légales]   [Contact]                │    (peu visible)
└────────────────────────────────────────────────┘

ZONES TACTILES (mobile) :
- Pouce droit : Bas droite (CTA principaux)
- Pouce gauche : Bas gauche (navigation secondaire)
- Difficile : Haut de l'écran (pas de CTA critiques)
```

## Checklist pratique

### ✅ Navigation

- [ ] Logo cliquable (retour accueil)
- [ ] Navigation principale visible (max 7 items)
- [ ] État actif visible (page actuelle)
- [ ] Fil d'Ariane sur pages profondes (>2 niveaux)
- [ ] Sticky header (reste visible au scroll)
- [ ] Menu burger responsive (mobile)

### ✅ Formulaires

- [ ] Labels au-dessus des champs
- [ ] Un champ par ligne (sauf exceptions)
- [ ] Champs requis indiqués (`*`)
- [ ] Validation en temps réel
- [ ] Erreurs sous les champs concernés
- [ ] Bouton de soumission en bas à droite
- [ ] Taille min 44x44px (tactile)
- [ ] Autocomplete activé (email, nom, etc.)

### ✅ Lisibilité

- [ ] Longueur de ligne max 75 caractères
- [ ] Line-height 1.5-1.7 (corps de texte)
- [ ] Hiérarchie claire (H1 > H2 > body)
- [ ] Listes à puces (vs pavés)
- [ ] Mots clés en gras
- [ ] Espacement généreux (margin, padding)

### ✅ Zones cliquables

- [ ] Taille min 44x44px (mobile)
- [ ] Espacement min 8px entre cliquables
- [ ] Hover state visible (desktop)
- [ ] Active state visible (clic)
- [ ] Focus state visible (clavier)
- [ ] Curseur pointer sur cliquables

### ✅ Feedback

- [ ] Loading states (spinner + texte)
- [ ] Success messages (checkmark + message)
- [ ] Error messages (croix + solution)
- [ ] Confirmation avant suppression
- [ ] Tooltip sur icônes

### ✅ Performance perçue

- [ ] Feedback instantané (hover, focus)
- [ ] Skeleton screens (vs spinner seul)
- [ ] Optimistic UI (si applicable)
- [ ] Lazy loading images

### ✅ Mobile

- [ ] Menu burger
- [ ] Boutons pleine largeur (`w-full`)
- [ ] Padding réduit (`px-4` vs `px-6`)
- [ ] Police min 16px (évite zoom auto iOS)
- [ ] Zones tactiles min 44x44px

## Erreurs à éviter

### ❌ Navigation cachée ou confuse

```jsx
// ❌ MAUVAIS : Menu hamburger sur desktop (cache la navigation)
<nav>
  <button onClick={toggleMenu}>☰</button>
  {menuOpen && <div>{/* Navigation */}</div>}
</nav>

// ✅ BON : Navigation visible sur desktop, burger mobile seulement
<nav>
  <div className="hidden md:flex gap-6">
    {/* Navigation desktop */}
  </div>
  <button className="md:hidden" onClick={toggleMenu}>
    ☰
  </button>
</nav>
```

### ❌ Labels à gauche des champs (alignement difficile)

```jsx
// ❌ MAUVAIS : Labels à gauche (mobile illisible)
<div className="flex items-center gap-4">
  <label className="w-32">Email :</label>
  <input className="flex-1" />
</div>

// ✅ BON : Labels au-dessus (mobile-friendly)
<div>
  <label className="block mb-2">Email</label>
  <input className="w-full" />
</div>
```

### ❌ Placeholder = Label (disparaît à la saisie)

```jsx
// ❌ MAUVAIS : Pas de label, juste placeholder
<input placeholder="Entrez votre email" />

// ✅ BON : Label + placeholder (exemple)
<label>Email</label>
<input placeholder="jean@example.com" />
```

### ❌ Liens/boutons trop petits (mobile)

```jsx
// ❌ MAUVAIS : Lien 12px sans padding (impossible à cliquer)
<a href="/login" className="text-xs">
  Connexion
</a>

// ✅ BON : Zone cliquable 44x44px min
<a
  href="/login"
  className="inline-flex items-center justify-center min-h-[44px] px-4 text-sm"
>
  Connexion
</a>
```

### ❌ Erreurs en haut de page (scroll requis)

```jsx
// ❌ MAUVAIS : Erreur loin du champ concerné
<form>
  {errors.global && <ErrorMessage>{errors.global}</ErrorMessage>}
  {/* 20 champs */}
  <input name="email" /> {/* Erreur ici mais message tout en haut */}
</form>

// ✅ BON : Erreur sous le champ concerné
<div>
  <input name="email" className={errors.email && 'border-error'} />
  {errors.email && <p className="text-error text-sm mt-1">{errors.email}</p>}
</div>
```

### ❌ Pas de feedback sur actions longues

```jsx
// ❌ MAUVAIS : Bouton bloqué sans indication
async function handleSubmit() {
  setDisabled(true);
  await uploadCV(file); // Peut prendre 10s
  setDisabled(false);
}

<button disabled={disabled}>
  Analyser
</button>

// ✅ BON : Feedback visuel
const [loading, setLoading] = useState(false);

async function handleSubmit() {
  setLoading(true);
  try {
    await uploadCV(file);
  } finally {
    setLoading(false);
  }
}

<button disabled={loading}>
  {loading ? (
    <>
      <Spinner className="mr-2" />
      Analyse en cours...
    </>
  ) : (
    'Analyser'
  )}
</button>
```

## Ressources & Outils

### Références ergonomie
- [Nielsen Norman Group](https://www.nngroup.com/) - Recherches UX/ergonomie
- [UX Design Institute](https://www.uxdesigninstitute.com/) - Cours ergonomie
- [Baymard Institute](https://baymard.com/) - Études e-commerce UX

### Outils de test
- [Hotjar](https://www.hotjar.com/) - Heatmaps, enregistrements sessions
- [Crazy Egg](https://www.crazyegg.com/) - Click tracking
- [Lookback](https://lookback.io/) - Tests utilisateurs à distance

### Checklist accessibilité (lié ergonomie)
- [WAVE](https://wave.webaim.org/) - Test accessibilité web
- [axe DevTools](https://www.deque.com/axe/devtools/) - Extension Chrome
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Audit Chrome

### Guidelines officielles
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) - iOS/macOS
- [Material Design](https://material.io/design) - Android/Web
- [Microsoft Fluent Design](https://www.microsoft.com/design/fluent/) - Windows

---

**Prochaines étapes** : Documenter les parcours utilisateurs pour optimiser les conversions.
