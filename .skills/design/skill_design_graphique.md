---
name: design graphique
description: Création de visuels cohérents et esthétiques pour Mew-mew-Ai (illustrations, icônes, compositions).
---

# Skill : Design Graphique pour Mew-mew-Ai

## Contexte du projet

Mew-mew-Ai nécessite des éléments graphiques pour :
- **Landing page** : Illustrations hero, features, testimonials
- **Dashboard** : Icônes de solutions, empty states
- **Templates CV** : Mise en page visuelle (6 styles différents)
- **Portfolio** : Mise en valeur des projets, médias
- **Marketing** : Bannières, réseaux sociaux, emailings

## 1. Composition et hiérarchie visuelle

### Principes CRAP

**C**ontrast (contraste) :
- Différencier titres vs texte (taille, poids, couleur)
- Séparer sections (backgrounds, bordures)
- Mettre en avant les CTA (couleur primaire)

**R**epetition (répétition) :
- Même style de cards partout
- Même traitement des icônes (taille, couleur)
- Même spacing entre éléments

**A**lignment (alignement) :
- Grille cohérente (12 colonnes Tailwind)
- Éléments alignés verticalement/horizontalement
- Pas d'éléments "flottants" sans raison

**P**roximity (proximité) :
- Grouper visuellement les éléments liés
- Espacer les sections distinctes
- Labels proche de leurs inputs

### Exemple de composition (landing page)

```
+----------------------------------------------------------+
|  Logo                                     [Login] [CTA]  |
+----------------------------------------------------------+
|                                                          |
|  +----------------------+  +-------------------------+   |
|  | HERO IMAGE           |  | L'IA qui propulse       |   |
|  | (illustration)       |  | votre carrière          |   |
|  |                      |  |                         |   |
|  |                      |  | [CTA principal]         |   |
|  +----------------------+  +-------------------------+   |
|                                                          |
+----------------------------------------------------------+
|                                                          |
|  Nos solutions                                           |
|                                                          |
|  +---------------+  +---------------+  +---------------+ |
|  | [Icône]       |  | [Icône]       |  | [Icône]       | |
|  | Analyser CV   |  | Optimiser CV  |  | Portfolio Pro | |
|  | Description   |  | Description   |  | Description   | |
|  +---------------+  +---------------+  +---------------+ |
|                                                          |
+----------------------------------------------------------+
```

### Hiérarchie typographique visuelle

```jsx
// Exemple de hiérarchie claire
<section className="max-w-4xl mx-auto px-4 py-16 space-y-8">
  {/* Niveau 1 : Titre principal (très grand, gras) */}
  <h1 className="text-5xl font-bold text-gray-900 text-center">
    L'IA qui propulse votre carrière
  </h1>

  {/* Niveau 2 : Sous-titre (grand, poids moyen) */}
  <p className="text-2xl text-gray-600 text-center max-w-2xl mx-auto">
    Analysez, optimisez et générez votre CV en quelques clics
  </p>

  {/* Niveau 3 : CTA (contrasté, coloré) */}
  <div className="flex justify-center">
    <button className="bg-primary-600 text-white text-lg px-8 py-3 rounded-md font-medium shadow-lg">
      Commencer gratuitement
    </button>
  </div>

  {/* Niveau 4 : Détails (petit, gris) */}
  <p className="text-sm text-gray-500 text-center">
    Gratuit, sans carte bancaire
  </p>
</section>
```

## 2. Illustrations et icônes

### Style d'illustrations pour Mew-mew-Ai

**Caractéristiques** :
- **Flat design** : Pas de 3D, pas d'ombres complexes
- **Minimaliste** : Formes simples, épurées
- **Couleurs de la palette** : Bleu (#2563eb), gris, vert (#16a34a)
- **Personnages** : Stylisés, inclusifs (diversité)

### Icônes (Heroicons)

**Bibliothèque** : Heroicons (par Tailwind Labs)

```bash
npm install @heroicons/react
```

**Utilisation** :
```jsx
import {
  DocumentTextIcon,
  SparklesIcon,
  BriefcaseIcon,
  ChartBarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

// Icône outline (contour)
<DocumentTextIcon className="w-8 h-8 text-primary-600" />

// Icône solid (pleine)
import { CheckCircleIcon } from '@heroicons/react/24/solid';
<CheckCircleIcon className="w-6 h-6 text-green-600" />
```

**Tailles recommandées** :
- **w-4 h-4** (16px) : Icônes inline dans le texte
- **w-5 h-5** (20px) : Boutons, badges
- **w-6 h-6** (24px) : Icônes standards (défaut)
- **w-8 h-8** (32px) : Icônes de features
- **w-12 h-12** (48px) : Grandes icônes (hero sections)

**Couleurs** :
- **text-primary-600** : Icônes primaires (solutions)
- **text-gray-600** : Icônes secondaires
- **text-green-600** : Succès, validation
- **text-red-600** : Erreur, suppression
- **text-yellow-600** : Avertissement

### Créer des illustrations custom (SVG)

**Outils recommandés** :
- **Figma** : Design d'illustrations vectorielles
- **Illustrator** : Illustrations complexes
- **unDraw** : Illustrations gratuites à personnaliser
- **Storyset** : Illustrations animées gratuites

**Export SVG optimisé** :
```jsx
// SVG inline pour contrôle total
export function IllustrationCV() {
  return (
    <svg
      className="w-full h-auto"
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Document */}
      <rect x="100" y="50" width="200" height="250" rx="8" fill="#f3f4f6" stroke="#2563eb" strokeWidth="2" />

      {/* Lignes de texte */}
      <line x1="120" y1="80" x2="280" y2="80" stroke="#6b7280" strokeWidth="4" strokeLinecap="round" />
      <line x1="120" y1="100" x2="260" y2="100" stroke="#9ca3af" strokeWidth="3" strokeLinecap="round" />
      <line x1="120" y1="120" x2="240" y2="120" stroke="#9ca3af" strokeWidth="3" strokeLinecap="round" />

      {/* Icône check (validation) */}
      <circle cx="340" cy="80" r="20" fill="#16a34a" />
      <path d="M335 80 L338 83 L345 76" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
```

### Empty states (pages vides)

**Principe** : Guider l'utilisateur quand il n'y a pas encore de contenu

```jsx
// Empty state : aucun portfolio créé
<div className="text-center py-16 px-4">
  {/* Illustration */}
  <svg className="w-32 h-32 mx-auto text-gray-300" viewBox="0 0 24 24" fill="none">
    <rect x="4" y="6" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M12 9v6M9 12h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>

  {/* Titre */}
  <h3 className="text-xl font-semibold text-gray-900 mt-6">
    Aucun portfolio pour le moment
  </h3>

  {/* Description */}
  <p className="text-gray-600 mt-2 max-w-sm mx-auto">
    Créez votre premier portfolio en ligne pour mettre en avant vos projets et compétences.
  </p>

  {/* CTA */}
  <button className="mt-6 bg-primary-600 text-white px-6 py-2.5 rounded-md font-medium hover:bg-primary-700">
    Créer mon portfolio
  </button>
</div>
```

## 3. Mise en page des templates CV

### Template Moderne (bleu professionnel)

**Composition** :
```
+-------------------------------------+
| PRÉNOM NOM                          |
| Développeur Full-Stack              |
| email@exemple.com | 06 12 34 56 78  |
+-------------------------------------+
| RÉSUMÉ                              |
| Passionné par le développement...   |
+-------------------------------------+
| EXPÉRIENCES                         |
| 📅 2022-2024 | Entreprise A          |
| Développeur Full-Stack              |
| - Réalisation X                     |
| - Réalisation Y                     |
|                                     |
| 📅 2020-2022 | Entreprise B          |
| ...                                 |
+-------------------------------------+
| FORMATIONS                          |
| 🎓 2020 | Master Informatique        |
| Université de Paris                 |
+-------------------------------------+
| COMPÉTENCES                         |
| React • Node.js • PostgreSQL        |
+-------------------------------------+
```

**Principes** :
- **Hiérarchie claire** : Nom en très grand, sections en bold
- **Icônes** : Émojis ou icônes pour dates, formations
- **Espacements** : Généreux (whitespace)
- **Couleur** : Bleu (#0066cc) pour les titres et accents

### Template Créatif (rose & violet)

**Composition** :
```
+-------------------------------------+
| [Photo]  | PRÉNOM NOM               |
|  ronde   | Créatrice de contenu     |
|          | contact@exemple.com      |
+-------------------------------------+
|        [Gradient rose → violet]     |
+-------------------------------------+
| À PROPOS                            |
| Créative passionnée...              |
+-------------------------------------+
| PROJETS                             |
| [Image 1] Projet A                  |
| [Image 2] Projet B                  |
+-------------------------------------+
```

**Principes** :
- **Gradient** : Rose (#e91e63) → Violet (#9c27b0)
- **Photo** : Circulaire, en haut à gauche
- **Visuels** : Images de projets (pas que du texte)
- **Typographie** : Helvetica, moderne

## 4. Grilles et alignement

### Grille 12 colonnes (Tailwind)

**Principe** : Tout s'aligne sur une grille de 12 colonnes

```jsx
// Layout 2 colonnes : 8 (contenu) + 4 (sidebar)
<div className="grid grid-cols-12 gap-8">
  <main className="col-span-12 lg:col-span-8">
    {/* Contenu principal */}
  </main>
  <aside className="col-span-12 lg:col-span-4">
    {/* Sidebar */}
  </aside>
</div>

// Layout 3 colonnes égales
<div className="grid grid-cols-12 gap-6">
  <div className="col-span-12 md:col-span-4">Colonne 1</div>
  <div className="col-span-12 md:col-span-4">Colonne 2</div>
  <div className="col-span-12 md:col-span-4">Colonne 3</div>
</div>
```

### Alignement vertical (Flexbox)

```jsx
// Centrer verticalement et horizontalement
<div className="flex items-center justify-center min-h-screen">
  <div className="text-center">
    <h1>Contenu centré</h1>
  </div>
</div>

// Aligner en bas (sticky footer)
<div className="min-h-screen flex flex-col">
  <header>Header</header>
  <main className="flex-1">Contenu</main>
  <footer>Footer (toujours en bas)</footer>
</div>
```

## 5. Couleurs et contrastes graphiques

### Palette harmonieuse

**Règle des 60-30-10** :
- **60%** : Couleur dominante (gris-50 backgrounds)
- **30%** : Couleur secondaire (blanc pour cards)
- **10%** : Couleur d'accent (bleu primary pour CTA)

```jsx
// Exemple d'application
<div className="bg-gray-50 min-h-screen p-8"> {/* 60% gris clair */}
  <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto"> {/* 30% blanc */}
    <h1 className="text-gray-900 text-3xl font-bold">Titre</h1>
    <p className="text-gray-600 mt-2">Description...</p>
    <button className="mt-6 bg-primary-600 text-white px-6 py-2.5 rounded-md"> {/* 10% bleu */}
      Action principale
    </button>
  </div>
</div>
```

### Dégradés (gradients)

**Utilisation** : Avec modération (template créatif, hero sections)

```jsx
// Gradient bleu → violet
<div className="bg-gradient-to-r from-primary-600 to-purple-600 p-8 rounded-lg">
  <h2 className="text-white text-2xl font-bold">Titre sur gradient</h2>
</div>

// Gradient subtil (gris)
<div className="bg-gradient-to-b from-white to-gray-50 p-8">
  <p className="text-gray-900">Contenu</p>
</div>

// Overlay gradient sur image
<div className="relative">
  <img src="/hero.jpg" alt="Hero" className="w-full h-96 object-cover" />
  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
    <h1 className="text-white text-4xl font-bold">Titre sur image</h1>
  </div>
</div>
```

## 6. Ombres et profondeur

### Niveaux d'élévation

**Principe** : Créer de la profondeur avec les ombres

```jsx
// Niveau 1 : Au repos (shadow-sm)
<div className="bg-white shadow-sm rounded-lg p-6">
  Card au repos
</div>

// Niveau 2 : Hover (shadow-md)
<div className="bg-white shadow-sm hover:shadow-md transition-shadow rounded-lg p-6 cursor-pointer">
  Card interactive
</div>

// Niveau 3 : Modal, dropdown (shadow-xl)
<div className="bg-white shadow-xl rounded-lg p-6">
  Modal au premier plan
</div>

// Niveau 4 : Très élevé (shadow-2xl)
<div className="bg-white shadow-2xl rounded-lg p-6">
  Élément flottant
</div>
```

### Ombres colorées

```jsx
// Ombre bleue (CTA)
<button className="bg-primary-600 text-white px-8 py-3 rounded-md shadow-lg shadow-primary-600/30 hover:shadow-xl hover:shadow-primary-600/40 transition-shadow">
  CTA avec ombre colorée
</button>

// Ombre subtile (card)
<div className="bg-white rounded-lg shadow-gray-200 shadow-md p-6">
  Card avec ombre douce
</div>
```

## 7. Micro-interactions et animations

### Transitions Tailwind

```jsx
// Hover sur bouton
<button className="
  bg-primary-600
  hover:bg-primary-700
  transform
  hover:scale-105
  transition-all
  duration-200
  ease-in-out
  px-6 py-2.5
  rounded-md
  text-white
">
  Bouton animé
</button>

// Hover sur card
<div className="
  bg-white
  border border-gray-200
  rounded-lg
  p-6
  hover:shadow-lg
  hover:border-primary-300
  transition-all
  duration-300
  cursor-pointer
">
  Card interactive
</div>
```

### Animations personnalisées

```jsx
// Loading spinner
<svg
  className="animate-spin h-8 w-8 text-primary-600"
  viewBox="0 0 24 24"
>
  <circle
    className="opacity-25"
    cx="12"
    cy="12"
    r="10"
    stroke="currentColor"
    strokeWidth="4"
    fill="none"
  />
  <path
    className="opacity-75"
    fill="currentColor"
    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
  />
</svg>

// Pulse (attention)
<span className="relative flex h-3 w-3">
  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
</span>
```

## 8. Cas d'usage spécifiques Mew-mew-Ai

### Card de solution (dashboard)

```jsx
<div className="group bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-primary-600 hover:shadow-lg transition-all cursor-pointer">
  {/* Icône */}
  <div className="flex items-center justify-center w-16 h-16 bg-primary-50 rounded-full group-hover:bg-primary-100 transition-colors">
    <DocumentTextIcon className="w-8 h-8 text-primary-600" />
  </div>

  {/* Contenu */}
  <h3 className="text-xl font-semibold text-gray-900 mt-4">
    Analyser mon CV
  </h3>
  <p className="text-gray-600 mt-2 leading-relaxed">
    Identifiez les métiers qui correspondent à votre profil en quelques minutes.
  </p>

  {/* Badge */}
  <span className="inline-block mt-4 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
    Gratuit
  </span>

  {/* CTA */}
  <div className="mt-4 flex items-center text-primary-600 font-medium group-hover:text-primary-700">
    Commencer
    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  </div>
</div>
```

### Banner hero (landing page)

```jsx
<section className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-purple-50 py-20 md:py-32">
  {/* Décoration background */}
  <div className="absolute inset-0 opacity-10">
    <svg className="absolute top-0 right-0 w-96 h-96" viewBox="0 0 400 400">
      <circle cx="200" cy="200" r="200" fill="currentColor" className="text-primary-600" />
    </svg>
  </div>

  {/* Contenu */}
  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center">
      <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
        L'IA qui propulse
        <span className="block text-primary-600 mt-2">votre carrière</span>
      </h1>
      <p className="text-xl md:text-2xl text-gray-600 mt-6 max-w-3xl mx-auto">
        Analysez, optimisez et générez votre CV en quelques clics grâce à l'intelligence artificielle.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
        <button className="bg-primary-600 text-white text-lg px-8 py-3 rounded-md font-medium shadow-lg hover:bg-primary-700 hover:shadow-xl transition-all">
          Commencer gratuitement
        </button>
        <button className="bg-white text-primary-600 text-lg px-8 py-3 rounded-md font-medium shadow-md hover:shadow-lg transition-all">
          Voir la démo
        </button>
      </div>
    </div>
  </div>
</section>
```

## Checklist Design Graphique

Avant de valider un visuel :

- [ ] **Hiérarchie visuelle** : Titres > sous-titres > texte > détails (taille, poids, couleur)
- [ ] **Contrastes** : WCAG AA minimum (4.5:1 pour texte)
- [ ] **Alignement** : Grille 12 colonnes, éléments alignés
- [ ] **Espacements** : Cohérents (multiples de 8px)
- [ ] **Couleurs** : Palette respectée (primary, gray, sémantiques)
- [ ] **Icônes** : Même style (Heroicons outline), même taille
- [ ] **Illustrations** : Flat design, minimalistes, couleurs de la palette
- [ ] **Ombres** : Niveaux cohérents (sm, md, lg, xl)
- [ ] **Animations** : Subtiles, pertinentes (hover, loading)
- [ ] **Responsive** : Adapté mobile, tablette, desktop

---

**Utilisation** : Référence pour créer des visuels cohérents et esthétiques sur Mew-mew-Ai
**Dernière mise à jour** : Février 2026
