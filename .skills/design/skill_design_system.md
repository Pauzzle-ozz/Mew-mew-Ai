---
name: design systeme
description: Création de systèmes de design cohérents et réutilisables pour Mew-mew-Ai.
---

# Skill : Design System pour Mew-mew-Ai

## Contexte du projet

Mew-mew-Ai est une plateforme SaaS multi-solutions avec :
- **Stack** : Next.js 16, React 19, Tailwind CSS 4
- **Composants** : Frontend dans `frontend-v2/components/`
- **Polices** : Geist Sans (texte) + Geist Mono (code)
- **Features** : CV (6 templates), Portfolio Pro, Analyseur IA

## Objectifs du design system

Créer une cohérence visuelle sur toute la plateforme via :
1. **Design tokens** (couleurs, espacements, typographie, ombres, bordures)
2. **Composants réutilisables** (buttons, inputs, cards, modals, alerts)
3. **Guidelines d'utilisation** (quand utiliser quoi)
4. **États des composants** (default, hover, focus, disabled, loading, error, success)

## 1. Design Tokens (Tailwind CSS 4)

### Couleurs

**Palette primaire** :
```css
/* Bleu principal (CTA, liens, accents) */
primary-50: #eff6ff
primary-100: #dbeafe
primary-500: #3b82f6  /* Couleur de base */
primary-600: #2563eb  /* Hover, focus */
primary-700: #1d4ed8  /* Active */
primary-900: #1e3a8a  /* Texte sombre */
```

**Palette secondaire (gris)** :
```css
gray-50: #f9fafb   /* Background très clair */
gray-100: #f3f4f6  /* Background clair */
gray-200: #e5e7eb  /* Bordures */
gray-400: #9ca3af  /* Texte désactivé */
gray-600: #4b5563  /* Texte secondaire */
gray-800: #1f2937  /* Texte principal */
gray-900: #111827  /* Titres, texte foncé */
```

**Couleurs sémantiques** :
```css
success: green-600 (#16a34a)
error: red-600 (#dc2626)
warning: yellow-600 (#ca8a04)
info: blue-600 (#2563eb)
```

**Dark mode** :
```css
dark:bg-gray-900
dark:text-gray-100
dark:border-gray-700
```

### Espacements

**Échelle Tailwind cohérente** :
```
space-y-2  (8px)   → Éléments très liés (label + input)
space-y-4  (16px)  → Éléments d'un groupe (form fields)
space-y-6  (24px)  → Sections d'une page
space-y-8  (32px)  → Grandes sections
space-y-12 (48px)  → Séparations majeures
space-y-16 (64px)  → Sections distinctes
```

**Padding de conteneurs** :
```
Mobile  : p-4 (16px)
Tablette: p-6 (24px)
Desktop : p-8 (32px)
```

### Typographie

**Hiérarchie (Geist Sans)** :
```
h1: text-4xl font-bold (36px, 900)
h2: text-3xl font-semibold (30px, 600)
h3: text-2xl font-semibold (24px, 600)
h4: text-xl font-medium (20px, 500)
body: text-base (16px, 400)
small: text-sm (14px, 400)
caption: text-xs (12px, 400)
```

**Line-height** :
```
Titres : leading-tight (1.25)
Body   : leading-normal (1.5)
Long text: leading-relaxed (1.625)
```

### Ombres

```
sm:   shadow-sm     → Légère (cards au repos)
md:   shadow-md     → Normale (cards hover)
lg:   shadow-lg     → Prononcée (modals, dropdowns)
xl:   shadow-xl     → Forte (éléments flottants)
```

### Bordures

```
border          (1px, gray-200)
border-2        (2px, pour focus states)
rounded-md      (6px, défaut)
rounded-lg      (8px, cards)
rounded-full    (pill buttons, avatars)
```

### Breakpoints (responsive)

```
sm:  640px   → Mobile large
md:  768px   → Tablette
lg:  1024px  → Desktop
xl:  1280px  → Desktop large
2xl: 1536px  → Très large
```

## 2. Composants réutilisables

### Button (composant de base)

**Variants** :
```jsx
// Primary (CTA principal)
<button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
  Action principale
</button>

// Secondary (action secondaire)
<button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2.5 rounded-md font-medium transition-colors">
  Action secondaire
</button>

// Outline (action tertiaire)
<button className="border-2 border-primary-600 text-primary-600 hover:bg-primary-50 px-6 py-2.5 rounded-md font-medium transition-colors">
  Action tertiaire
</button>

// Ghost (action discrète)
<button className="text-gray-600 hover:bg-gray-100 px-6 py-2.5 rounded-md font-medium transition-colors">
  Action discrète
</button>

// Danger (action destructive)
<button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-md font-medium transition-colors">
  Supprimer
</button>
```

**États** :
```jsx
// Disabled
<button disabled className="bg-gray-300 text-gray-500 cursor-not-allowed px-6 py-2.5 rounded-md">
  Désactivé
</button>

// Loading
<button disabled className="bg-primary-600 text-white px-6 py-2.5 rounded-md flex items-center gap-2">
  <svg className="animate-spin h-5 w-5" />
  Chargement...
</button>
```

**Tailles** :
```
sm : px-3 py-1.5 text-sm
md : px-6 py-2.5 text-base (défaut)
lg : px-8 py-3 text-lg
```

### Input (champ de formulaire)

**Structure** :
```jsx
<div className="space-y-2">
  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
    Email
  </label>
  <input
    type="email"
    id="email"
    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
    placeholder="vous@exemple.com"
  />
  <p className="text-sm text-gray-500">Nous ne partagerons jamais votre email.</p>
</div>
```

**États** :
```jsx
// Error state
<input className="border-red-500 focus:ring-red-500" />
<p className="text-sm text-red-600">Email invalide</p>

// Success state
<input className="border-green-500 focus:ring-green-500" />
<p className="text-sm text-green-600">Email valide</p>

// Disabled
<input disabled className="bg-gray-100 cursor-not-allowed" />
```

### Card (conteneur)

```jsx
<div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 space-y-4">
  <h3 className="text-xl font-semibold text-gray-900">Titre de la carte</h3>
  <p className="text-gray-600">Description de la carte.</p>
  <button className="text-primary-600 hover:text-primary-700 font-medium">
    En savoir plus →
  </button>
</div>
```

### Alert (message de feedback)

```jsx
// Success
<div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-start gap-3">
  <svg className="w-5 h-5 text-green-600 flex-shrink-0" />
  <div className="flex-1">
    <h4 className="text-sm font-medium text-green-800">Succès</h4>
    <p className="text-sm text-green-700">Votre CV a été généré avec succès.</p>
  </div>
</div>

// Error
<div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start gap-3">
  <svg className="w-5 h-5 text-red-600 flex-shrink-0" />
  <div className="flex-1">
    <h4 className="text-sm font-medium text-red-800">Erreur</h4>
    <p className="text-sm text-red-700">Le fichier doit être un PDF de moins de 2 Mo.</p>
  </div>
</div>

// Info
<div className="bg-blue-50 border border-blue-200 rounded-md p-4">
  <p className="text-sm text-blue-700">Cette fonctionnalité nécessite une connexion.</p>
</div>
```

### Modal (dialogue)

```jsx
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
  <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
    <h2 className="text-2xl font-semibold text-gray-900">Confirmer la suppression</h2>
    <p className="text-gray-600">Êtes-vous sûr de vouloir supprimer ce portfolio ?</p>
    <div className="flex gap-3 justify-end">
      <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md">
        Annuler
      </button>
      <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md">
        Supprimer
      </button>
    </div>
  </div>
</div>
```

## 3. Guidelines d'utilisation

### Quand utiliser quoi

| Composant | Utilisation |
|-----------|-------------|
| **Button Primary** | CTA principal (1 par page max) : "Générer mon CV", "Créer un portfolio" |
| **Button Secondary** | Actions importantes mais secondaires : "Annuler", "Retour" |
| **Button Outline** | Actions tertiaires, filtres, toggles |
| **Button Ghost** | Actions discrètes, liens dans texte, menus |
| **Button Danger** | Actions destructives : "Supprimer", "Désactiver" |

### Hiérarchie des couleurs

- **Primary (bleu)** : Actions principales, liens, éléments interactifs
- **Gray** : Texte, bordures, backgrounds neutres
- **Green** : Succès, validation, état actif
- **Red** : Erreurs, suppression, avertissements critiques
- **Yellow** : Avertissements non-critiques, infos importantes

### Espacement cohérent

**Règle des multiples de 4px** (échelle Tailwind) :
```
4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px
```

**Groupes visuels** :
- Éléments d'un même groupe : `gap-2` ou `gap-4`
- Sections distinctes : `gap-8` ou `gap-12`

## 4. Accessibilité (WCAG AA)

### Contrastes

**Vérifier avec WebAIM Contrast Checker** :
- Texte normal : ratio 4.5:1 minimum
- Texte large (18px+) : ratio 3:1 minimum
- Éléments interactifs : ratio 3:1 minimum

**Combinaisons sûres** :
```
✅ text-gray-900 on bg-white (ratio 21:1)
✅ text-white on bg-primary-600 (ratio 4.6:1)
✅ text-primary-600 on bg-white (ratio 4.6:1)
❌ text-gray-400 on bg-white (ratio 2.5:1 - insuffisant)
```

### Focus states

**Toujours visible** :
```
focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
```

### Navigation clavier

- Tous les boutons/liens doivent être accessibles au clavier
- Ordre de tabulation logique (suivre le flux visuel)
- Skip links pour navigation rapide

## 5. Implémentation dans Mew-mew-Ai

### Créer un composant réutilisable

**Fichier** : `frontend-v2/components/shared/Button.jsx`

```jsx
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  ...props
}) {
  const baseStyles = "font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800",
    outline: "border-2 border-primary-600 text-primary-600 hover:bg-primary-50",
    ghost: "text-gray-600 hover:bg-gray-100",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3 text-lg"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5" />
          Chargement...
        </span>
      ) : children}
    </button>
  );
}
```

### Utilisation

```jsx
import Button from '@/components/shared/Button';

<Button variant="primary" size="md" onClick={handleSubmit}>
  Générer mon CV
</Button>

<Button variant="danger" size="sm" onClick={handleDelete}>
  Supprimer
</Button>

<Button variant="outline" loading={isLoading}>
  Analyser
</Button>
```

## 6. Checklist d'utilisation

Avant de créer un nouveau composant, vérifie :

- [ ] **Cohérence** : Utilise les tokens définis (couleurs, espacements, typographie)
- [ ] **Accessibilité** : Contrastes WCAG AA, focus visible, keyboard nav
- [ ] **Responsive** : Mobile-first (`sm:`, `md:`, `lg:`)
- [ ] **États** : Hover, focus, disabled, loading, error, success
- [ ] **Réutilisabilité** : Si utilisé 2+ fois, créer un composant dans `components/shared/`
- [ ] **Dark mode** : Prévoir les classes `dark:` si applicable (portfolio)
- [ ] **Performance** : Éviter le CSS inline, utiliser Tailwind

## 7. Évolution du design system

Au fur et à mesure, documenter dans ce fichier :
- Nouveaux composants créés
- Tokens ajoutés (nouvelles couleurs, espacements)
- Patterns UI récurrents (steppers, notifications, tooltips)
- Exemples concrets d'utilisation dans Mew-mew-Ai

---

**Utilisation** : Référence pour créer une cohérence visuelle sur toute la plateforme Mew-mew-Ai
**Dernière mise à jour** : Février 2026
