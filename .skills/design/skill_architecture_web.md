---
name: architecture web
description: Organisation de l'information, navigation et structure du site Mew-mew-Ai.
---

# Skill : Architecture Web pour Mew-mew-Ai

## Contexte du projet

Mew-mew-Ai est une plateforme SaaS multi-solutions qui nécessite :
- **Navigation intuitive** : Accès rapide aux solutions (CV, portfolio)
- **Sitemap clair** : Structure logique des pages
- **Organisation des contenus** : Hiérarchie d'information cohérente
- **Parcours utilisateurs** : Flows optimisés (inscription → solution → résultat)
- **Évolutivité** : Nouvelles solutions futures (fiscalité, marketing, etc.)

## 1. Sitemap (architecture des pages)

### Structure actuelle

```
Mew-mew-Ai (/)
|
|-- Landing Page (/)
|   |-- Hero
|   |-- Solutions (aperçu)
|   |-- Témoignages
|   |-- Pricing
|   |-- FAQ
|   |-- Footer
|
|-- Authentification
|   |-- Connexion (/login)
|   |-- Inscription (/signup)
|   |-- Mot de passe oublié (/forgot-password)
|
|-- Dashboard (/dashboard)
|   |-- Vue d'ensemble (mes solutions)
|   |-- Mes portfolios
|   |-- Paramètres
|
|-- Solutions
|   |-- Analyser mon CV (/solutions/analyse-cv)
|   |   |-- Formulaire
|   |   |-- Upload PDF
|   |   |-- Résultats
|   |
|   |-- Optimiser mon CV (/solutions/optimiseur-cv)
|   |   |-- Formulaire
|   |   |-- Upload PDF
|   |   |-- Suggestions
|   |   |-- Génération PDF
|   |
|   |-- Portfolio Pro
|       |-- Liste des portfolios (/solutions/portfolio)
|       |-- Créer un portfolio (/solutions/portfolio/new)
|       |-- Éditer un portfolio (/solutions/portfolio/[id]/edit)
|       |-- Page publique (/p/[slug])
|
|-- Pages légales
|   |-- Conditions d'utilisation (/terms)
|   |-- Politique de confidentialité (/privacy)
|   |-- Mentions légales (/legal)
|
|-- Support
    |-- Centre d'aide (/help)
    |-- Contact (/contact)
```

### Structure future (évolutivité)

```
Mew-mew-Ai (/)
|
|-- Solutions (domaines)
    |-- Emploi-Carrière (/solutions/emploi)
    |   |-- Analyser CV
    |   |-- Optimiser CV
    |   |-- Portfolio Pro
    |   |-- Lettre de motivation IA (futur)
    |   |-- Préparation entretien (futur)
    |
    |-- Fiscalité (/solutions/fiscalite)
    |   |-- Déclaration auto-entrepreneur (futur)
    |   |-- Optimisation fiscale (futur)
    |
    |-- Marketing (/solutions/marketing)
    |   |-- Générateur de posts LinkedIn (futur)
    |   |-- Analyse de marché IA (futur)
    |
    |-- Dev Tools (/solutions/dev)
        |-- Générateur de code (futur)
        |-- Revue de code IA (futur)
```

## 2. Navigation principale

### Header (navigation globale)

**Structure recommandée** :

```
+------------------------------------------------------------------+
| [Logo] Mew-mew-Ai    Solutions▾  Pricing  Blog    [Login] [CTA] |
+------------------------------------------------------------------+
                          |
                          v
                   +-----------------+
                   | Emploi-Carrière |
                   | - Analyser CV   |
                   | - Optimiser CV  |
                   | - Portfolio Pro |
                   +-----------------+
```

**Code example** :

```jsx
export default function Header() {
  const [solutionsOpen, setSolutionsOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="Mew-mew-Ai" className="h-8 w-8" />
            <span className="text-xl font-bold text-gray-900">Mew-mew-Ai</span>
          </a>

          {/* Navigation principale */}
          <nav className="hidden md:flex items-center gap-8">
            {/* Dropdown Solutions */}
            <div
              className="relative"
              onMouseEnter={() => setSolutionsOpen(true)}
              onMouseLeave={() => setSolutionsOpen(false)}
            >
              <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                Solutions
                <ChevronDownIcon className="w-4 h-4" />
              </button>

              {solutionsOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl p-4 space-y-2">
                  <a
                    href="/solutions/analyse-cv"
                    className="block px-4 py-2 rounded-md hover:bg-gray-100"
                  >
                    <h4 className="font-medium text-gray-900">Analyser mon CV</h4>
                    <p className="text-sm text-gray-600">Identifiez les métiers correspondants</p>
                  </a>
                  <a
                    href="/solutions/optimiseur-cv"
                    className="block px-4 py-2 rounded-md hover:bg-gray-100"
                  >
                    <h4 className="font-medium text-gray-900">Optimiser mon CV</h4>
                    <p className="text-sm text-gray-600">Améliorez votre CV pour les ATS</p>
                  </a>
                  <a
                    href="/solutions/portfolio"
                    className="block px-4 py-2 rounded-md hover:bg-gray-100"
                  >
                    <h4 className="font-medium text-gray-900">Portfolio Pro</h4>
                    <p className="text-sm text-gray-600">Créez votre portfolio en ligne</p>
                  </a>
                </div>
              )}
            </div>

            {/* Liens directs */}
            <a href="/pricing" className="text-gray-600 hover:text-gray-900">
              Pricing
            </a>
            <a href="/blog" className="text-gray-600 hover:text-gray-900">
              Blog
            </a>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            <a href="/login" className="text-gray-600 hover:text-gray-900">
              Connexion
            </a>
            <a
              href="/signup"
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
            >
              S'inscrire
            </a>
          </div>

          {/* Menu hamburger mobile */}
          <button className="md:hidden p-2">
            <Bars3Icon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
```

### Breadcrumbs (fil d'Ariane)

**Principe** : Indiquer la position actuelle dans la hiérarchie

```jsx
// Breadcrumbs pour édition de portfolio
<nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-600 mb-6">
  <a href="/dashboard" className="hover:text-gray-900">
    Dashboard
  </a>
  <ChevronRightIcon className="w-4 h-4" />
  <a href="/solutions/portfolio" className="hover:text-gray-900">
    Portfolios
  </a>
  <ChevronRightIcon className="w-4 h-4" />
  <span className="text-gray-900 font-medium">
    Éditer "Mon Portfolio Pro"
  </span>
</nav>
```

### Footer (navigation secondaire)

**Structure** :

```jsx
<footer className="bg-gray-900 text-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Colonne 1 : À propos */}
      <div>
        <h3 className="font-semibold text-lg mb-4">Mew-mew-Ai</h3>
        <p className="text-gray-400 text-sm">
          L'IA qui propulse votre carrière. Analysez, optimisez et générez votre CV en quelques clics.
        </p>
      </div>

      {/* Colonne 2 : Solutions */}
      <div>
        <h4 className="font-semibold mb-4">Solutions</h4>
        <ul className="space-y-2 text-sm">
          <li><a href="/solutions/analyse-cv" className="text-gray-400 hover:text-white">Analyser mon CV</a></li>
          <li><a href="/solutions/optimiseur-cv" className="text-gray-400 hover:text-white">Optimiser mon CV</a></li>
          <li><a href="/solutions/portfolio" className="text-gray-400 hover:text-white">Portfolio Pro</a></li>
        </ul>
      </div>

      {/* Colonne 3 : Ressources */}
      <div>
        <h4 className="font-semibold mb-4">Ressources</h4>
        <ul className="space-y-2 text-sm">
          <li><a href="/blog" className="text-gray-400 hover:text-white">Blog</a></li>
          <li><a href="/help" className="text-gray-400 hover:text-white">Centre d'aide</a></li>
          <li><a href="/contact" className="text-gray-400 hover:text-white">Contact</a></li>
        </ul>
      </div>

      {/* Colonne 4 : Légal */}
      <div>
        <h4 className="font-semibold mb-4">Légal</h4>
        <ul className="space-y-2 text-sm">
          <li><a href="/terms" className="text-gray-400 hover:text-white">Conditions d'utilisation</a></li>
          <li><a href="/privacy" className="text-gray-400 hover:text-white">Confidentialité</a></li>
          <li><a href="/legal" className="text-gray-400 hover:text-white">Mentions légales</a></li>
        </ul>
      </div>
    </div>

    {/* Copyright */}
    <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
      © 2026 Mew-mew-Ai. Tous droits réservés.
    </div>
  </div>
</footer>
```

## 3. Organisation des contenus

### Hiérarchie d'information (pyramide inversée)

**Principe** : Information la plus importante en premier

```
Landing Page :
1. Hero (proposition de valeur) ← Plus important
2. Solutions (3 principales)
3. Témoignages (social proof)
4. Pricing (plans)
5. FAQ
6. Footer ← Moins important
```

### Page de solution (exemple : Analyser CV)

**Structure recommandée** :

```
+----------------------------------------------------------+
| [Header avec navigation]                                 |
+----------------------------------------------------------+
| HERO                                                     |
| "Découvrez les métiers qui vous correspondent"          |
| [CTA : Analyser mon CV]                                  |
+----------------------------------------------------------+
| COMMENT ÇA MARCHE                                        |
| 1. Téléchargez votre CV ou remplissez le formulaire     |
| 2. L'IA analyse vos compétences                          |
| 3. Recevez les métiers recommandés                       |
+----------------------------------------------------------+
| FORMULAIRE / UPLOAD PDF                                  |
| [Tabs : Formulaire | Upload PDF]                         |
| [Champs ou zone de drop]                                 |
+----------------------------------------------------------+
| TÉMOIGNAGES                                              |
| "Grâce à Mew-mew-Ai, j'ai découvert..."                 |
+----------------------------------------------------------+
| FAQ                                                      |
| Questions fréquentes sur l'analyseur                     |
+----------------------------------------------------------+
| [Footer]                                                 |
+----------------------------------------------------------+
```

### Dashboard (vue d'ensemble)

**Hiérarchie** :

```jsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
  {/* Niveau 1 : Bienvenue (personnalisé) */}
  <div>
    <h1 className="text-3xl font-bold text-gray-900">
      Bonjour, {user.firstName} 👋
    </h1>
    <p className="text-gray-600 mt-2">
      Bienvenue sur votre tableau de bord
    </p>
  </div>

  {/* Niveau 2 : Actions rapides (CTA) */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <QuickActionCard
      title="Analyser mon CV"
      description="Identifiez les métiers correspondants"
      href="/solutions/analyse-cv"
      icon={<DocumentTextIcon />}
    />
    <QuickActionCard
      title="Optimiser mon CV"
      description="Améliorez votre CV pour les ATS"
      href="/solutions/optimiseur-cv"
      icon={<SparklesIcon />}
    />
    <QuickActionCard
      title="Portfolio Pro"
      description="Créez votre portfolio en ligne"
      href="/solutions/portfolio"
      icon={<BriefcaseIcon />}
    />
  </div>

  {/* Niveau 3 : Mes portfolios */}
  <div>
    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
      Mes portfolios ({portfolios.length})
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {portfolios.map(portfolio => (
        <PortfolioCard key={portfolio.id} portfolio={portfolio} />
      ))}
    </div>
  </div>

  {/* Niveau 4 : Activité récente */}
  <div>
    <h2 className="text-xl font-semibold text-gray-900 mb-4">
      Activité récente
    </h2>
    <ul className="space-y-2">
      {recentActivity.map(activity => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}
    </ul>
  </div>
</div>
```

## 4. Parcours utilisateurs (user flows)

### Flow : Nouvelle inscription → Première analyse CV

**Étapes** :

```
1. Landing page (/)
   ↓ Clic "S'inscrire"
2. Inscription (/signup)
   ↓ Formulaire (email + mdp)
3. Vérification email (optionnel)
   ↓ Clic lien de confirmation
4. Dashboard (/dashboard)
   ↓ Affiche "Bienvenue ! Commencez par analyser votre CV"
5. Analyser CV (/solutions/analyse-cv)
   ↓ Choix : Formulaire ou PDF
6. Résultats
   ↓ CTA "Optimiser mon CV" ou "Créer un portfolio"
```

**Points de friction à éviter** :
- ❌ Forcer la vérification email avant d'accéder aux solutions
- ❌ Ne pas proposer d'action claire après inscription
- ❌ Dashboard vide sans guidance

**Optimisations** :
- ✅ Tooltip contextuel : "Analysez votre CV pour commencer"
- ✅ CTA visible : "Analyser mon CV" en premier
- ✅ Progress bar : "Étape 1/3 : Analysez votre CV"

### Flow : Création de portfolio

**Étapes** :

```
1. Dashboard → Clic "Créer un portfolio"
   ↓
2. Modal création (/solutions/portfolio/new)
   ↓ Formulaire : Titre + Template
3. Éditeur vide (/solutions/portfolio/[id]/edit)
   ↓ Tutoriel : "Ajoutez d'abord un bloc Hero"
4. Ajout de blocs (hero, texte, image, projets, etc.)
   ↓ Prévisualisation en temps réel
5. Personnalisation (couleur primaire, dark mode)
   ↓
6. Publication (published = true)
   ↓ Génère le slug `/p/mon-portfolio`
7. Page de succès
   ↓ QR code + lien à copier + stats
```

**Guidance contextuelle** :

```jsx
// Tutoriel interactif pour nouvel utilisateur
{blocks.length === 0 && (
  <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 text-center">
    <h3 className="text-lg font-semibold text-primary-900">
      Commencez par ajouter un bloc Hero
    </h3>
    <p className="text-primary-700 mt-2">
      Le bloc Hero est idéal pour présenter votre profil et votre photo.
    </p>
    <button
      onClick={() => addBlock('hero')}
      className="mt-4 bg-primary-600 text-white px-6 py-2.5 rounded-md"
    >
      Ajouter un bloc Hero
    </button>
  </div>
)}
```

## 5. Navigation contextuelle

### Sidebar (dashboard)

**Principe** : Navigation persistante sur les pages internes

```jsx
<div className="flex min-h-screen">
  {/* Sidebar */}
  <aside className="hidden lg:block w-64 bg-white border-r border-gray-200">
    <div className="p-6">
      {/* Logo */}
      <a href="/" className="flex items-center gap-2 mb-8">
        <img src="/logo.svg" alt="Mew-mew-Ai" className="h-8 w-8" />
        <span className="text-xl font-bold">Mew-mew-Ai</span>
      </a>

      {/* Navigation */}
      <nav className="space-y-2">
        <a
          href="/dashboard"
          className="flex items-center gap-3 px-4 py-2 rounded-md bg-primary-50 text-primary-600 font-medium"
        >
          <HomeIcon className="w-5 h-5" />
          Dashboard
        </a>
        <a
          href="/solutions"
          className="flex items-center gap-3 px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100"
        >
          <SparklesIcon className="w-5 h-5" />
          Solutions
        </a>
        <a
          href="/solutions/portfolio"
          className="flex items-center gap-3 px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100"
        >
          <BriefcaseIcon className="w-5 h-5" />
          Mes portfolios
        </a>
        <a
          href="/settings"
          className="flex items-center gap-3 px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100"
        >
          <CogIcon className="w-5 h-5" />
          Paramètres
        </a>
      </nav>

      {/* User menu (en bas) */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
          <div className="flex-1">
            <p className="font-medium text-gray-900 text-sm">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </aside>

  {/* Contenu principal */}
  <main className="flex-1 bg-gray-50">
    {children}
  </main>
</div>
```

### Tabs (navigation intra-page)

```jsx
// Tabs pour solutions (Analyser vs Optimiser)
<div className="border-b border-gray-200 mb-8">
  <nav className="flex gap-8">
    <button
      onClick={() => setActiveTab('analyse')}
      className={`
        pb-4 border-b-2 font-medium transition-colors
        ${activeTab === 'analyse'
          ? 'border-primary-600 text-primary-600'
          : 'border-transparent text-gray-500 hover:text-gray-700'
        }
      `}
    >
      Analyser
    </button>
    <button
      onClick={() => setActiveTab('optimise')}
      className={`
        pb-4 border-b-2 font-medium transition-colors
        ${activeTab === 'optimise'
          ? 'border-primary-600 text-primary-600'
          : 'border-transparent text-gray-500 hover:text-gray-700'
        }
      `}
    >
      Optimiser
    </button>
  </nav>
</div>
```

## 6. Search (recherche)

### Barre de recherche globale

```jsx
<div className="relative">
  <input
    type="search"
    placeholder="Rechercher une solution..."
    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
  />
  <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
</div>
```

### Résultats de recherche

```jsx
{searchResults.length > 0 && (
  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-96 overflow-y-auto">
    {searchResults.map(result => (
      <a
        key={result.id}
        href={result.url}
        className="block px-4 py-3 hover:bg-gray-50"
      >
        <h4 className="font-medium text-gray-900">{result.title}</h4>
        <p className="text-sm text-gray-600 mt-1">{result.description}</p>
      </a>
    ))}
  </div>
)}
```

## Checklist Architecture Web

Avant de valider la navigation :

- [ ] **Sitemap clair** : Hiérarchie logique des pages
- [ ] **Navigation intuitive** : Header avec dropdown Solutions
- [ ] **Breadcrumbs** : Présents sur pages profondes (édition portfolio)
- [ ] **Footer complet** : Liens vers toutes les pages importantes
- [ ] **Search** : Barre de recherche globale (si > 10 pages)
- [ ] **Sidebar** : Navigation persistante sur dashboard
- [ ] **Tabs** : Navigation intra-page (formulaire vs PDF)
- [ ] **User flows** : Parcours testés (inscription → première analyse)
- [ ] **Mobile-friendly** : Menu hamburger, navigation adaptée
- [ ] **Accessibilité** : Navigation au clavier, ARIA labels

---

**Utilisation** : Référence pour structurer et organiser l'information sur Mew-mew-Ai
**Dernière mise à jour** : Février 2026
