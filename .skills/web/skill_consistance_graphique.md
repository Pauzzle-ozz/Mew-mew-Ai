---
name: consistance graphique
description: Maintien d'une cohérence visuelle globale.
---

# Skill : Consistance Graphique

## Description

La consistance graphique est la **cohérence visuelle** de tous les éléments d'interface sur Mew-mew-Ai. Un design consistant signifie :
- **Même style partout** (boutons, formulaires, cards identiques)
- **Prédictibilité** (l'utilisateur sait à quoi s'attendre)
- **Professionnalisme** (crédibilité, confiance)
- **Facilité de maintenance** (un seul design system)

## Analogie

La consistance graphique, c'est comme **l'uniforme d'une marque** :
- **Apple Store** : Même design blanc/minimaliste partout dans le monde
- **McDonald's** : Même rouge/jaune, même menu, même expérience
- **IKEA** : Même bleu/jaune, même typographie, même ambiance

Si chaque magasin avait son propre style → confusion, perte d'identité.

## Principes de consistance

### 1. Consistance interne (au sein de Mew-mew-Ai)

**Règle** : Même élément = même apparence partout.

**Exemples** :
- Tous les boutons primaires sont bleus avec hover identique
- Tous les formulaires ont les labels au-dessus des champs
- Toutes les cards ont la même bordure, padding et hover effect
- Tous les messages d'erreur ont le même style (rouge, icône, position)

### 2. Consistance externe (avec les conventions web)

**Règle** : Respecter les patterns familiers aux utilisateurs.

**Exemples** :
- Logo en haut à gauche (retour accueil)
- Navigation horizontale en header
- Liens bleus et soulignés
- Boutons avec effet hover/focus
- Icônes standard (❌ = fermer, ✓ = succès, ⚙️ = paramètres)

### 3. Consistance fonctionnelle

**Règle** : Même action = même interaction partout.

**Exemples** :
- Cliquer sur une card ouvre toujours la page de détail
- Escape ferme toujours les modales
- Enter valide toujours les formulaires
- Double-clic édite toujours (si applicable)

## Design System de Mew-mew-Ai

### 1. Couleurs (système centralisé)

**Fichier** : `frontend-v2/app/globals.css`

```css
@theme {
  /* Couleurs primaires */
  --color-primary: oklch(0.6 0.2 250);        /* Bleu */
  --color-primary-hover: oklch(0.5 0.22 250);
  --color-secondary: oklch(0.65 0.18 300);    /* Violet */

  /* Sémantiques */
  --color-success: oklch(0.65 0.15 145);      /* Vert */
  --color-error: oklch(0.55 0.22 25);         /* Rouge */
  --color-warning: oklch(0.75 0.15 85);       /* Jaune */
  --color-info: oklch(0.6 0.15 230);          /* Bleu clair */

  /* Neutres */
  --color-gray-50: oklch(0.98 0 0);
  --color-gray-900: oklch(0.1 0 0);
}
```

**Utilisation consistante** :
```jsx
// ✅ TOUJOURS utiliser les variables
<button className="bg-primary hover:bg-primary-hover">
  Cliquez-moi
</button>

// ❌ JAMAIS hardcoder les couleurs
<button className="bg-[#3B82F6] hover:bg-[#2563EB]">
  Cliquez-moi
</button>
```

### 2. Typographie (hiérarchie standardisée)

**Fichier** : `lib/styles/typography.js` (à créer si besoin)

```javascript
export const typography = {
  // Titres
  h1: 'font-sans text-5xl md:text-6xl font-bold leading-tight',
  h2: 'font-sans text-4xl md:text-5xl font-bold leading-snug',
  h3: 'font-sans text-3xl md:text-4xl font-semibold leading-snug',
  h4: 'font-sans text-2xl md:text-3xl font-semibold',

  // Corps
  body: 'font-sans text-base leading-relaxed text-gray-700',
  bodyLarge: 'font-sans text-lg leading-relaxed text-gray-700',
  bodySmall: 'font-sans text-sm leading-normal text-gray-600',

  // UI
  label: 'font-sans text-sm font-medium text-gray-900',
  caption: 'font-sans text-xs text-gray-500',
  button: 'font-sans text-base font-semibold',
};
```

**Utilisation** :
```jsx
import { typography } from '@/lib/styles/typography';

<h1 className={typography.h1}>Titre principal</h1>
<p className={typography.body}>Corps de texte</p>
```

### 3. Composants standardisés

**Structure** : `components/shared/`

#### Bouton (toutes les variantes)

```jsx
// components/shared/Button.jsx
export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  ...props
}) {
  const variants = {
    primary: 'bg-primary hover:bg-primary-hover text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    ghost: 'text-gray-700 hover:bg-gray-100',
    danger: 'bg-error hover:bg-error/90 text-white',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={`
        ${variants[variant]}
        ${sizes[size]}
        rounded-lg font-semibold
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
```

**Résultat** : Tous les boutons de l'app ont le même style.

#### Card (layout standardisé)

```jsx
// components/shared/Card.jsx
export default function Card({ title, subtitle, children, footer }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-1">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-gray-500 mb-3">
            {subtitle}
          </p>
        )}
        {children}
      </div>
      {footer && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
}
```

#### FormField (input + label + erreur)

```jsx
// components/shared/FormField.jsx
export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required,
  ...props
}) {
  return (
    <div className="mb-6">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-900 mb-2"
      >
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`
          w-full px-4 py-3 border rounded-lg
          transition-colors
          focus:outline-none focus:ring-2 focus:ring-primary/50
          ${error
            ? 'border-error focus:ring-error/50'
            : 'border-gray-300 focus:border-primary'}
        `}
        {...props}
      />
      {error && (
        <p className="text-error text-sm mt-2">{error}</p>
      )}
    </div>
  );
}
```

### 4. Espacements (système 8px)

**Règle** : Utiliser des multiples de 4px (idéalement 8px).

```jsx
// ✅ BON : Multiples de 4/8
gap-4   // 16px
gap-8   // 32px
p-6     // 24px
py-12   // 48px (vertical)
mb-4    // 16px

// ❌ ÉVITER : Valeurs arbitraires
gap-3   // 12px (pas multiple de 8)
p-5     // 20px (pas multiple de 8)
```

**Grid layout standardisé** :
```jsx
// Même grid partout : mobile 1 col, tablet 2 cols, desktop 3 cols
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

### 5. États interactifs (standard)

**Tous les éléments cliquables** doivent avoir ces 4 états :

```jsx
<button className="
  bg-primary                          // Default
  hover:bg-primary-hover              // Hover
  focus:ring-2 focus:ring-primary/50  // Focus (accessibilité)
  active:scale-95                     // Active (clic)
  disabled:opacity-50                 // Disabled
  transition-all duration-200         // Transition fluide
">
  Cliquez-moi
</button>
```

### 6. Iconographie (même source)

**Choix** : [Heroicons](https://heroicons.com/) (officiels Tailwind)

```jsx
// ✅ Toujours même bibliothèque
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

<CheckCircleIcon className="w-6 h-6 text-success" />
<XCircleIcon className="w-6 h-6 text-error" />

// ❌ Éviter de mixer plusieurs bibliothèques
// (FontAwesome + Heroicons + Material Icons = incohérent)
```

## Checklist de consistance

### ✅ Couleurs

- [ ] Toutes les couleurs définies dans `@theme` (globals.css)
- [ ] Pas de couleurs hardcodées (`bg-[#3B82F6]`)
- [ ] Même palette partout (primaire, secondaire, succès, erreur)
- [ ] Mode sombre cohérent (si applicable)

### ✅ Typographie

- [ ] 2 polices max (Sans-serif + Mono)
- [ ] Hiérarchie respectée partout (H1 > H2 > H3 > body)
- [ ] Même line-height pour le corps de texte (1.5-1.7)
- [ ] Classes typography centralisées

### ✅ Composants

- [ ] Boutons : même style pour même variant (`primary`, `secondary`, etc.)
- [ ] Cards : même padding, bordure, hover effect
- [ ] Formulaires : labels toujours au-dessus, erreurs toujours en dessous
- [ ] Modales : même backdrop, même header, même footer

### ✅ Espacements

- [ ] Système 8px respecté (gap-4, gap-8, p-6, etc.)
- [ ] Même grid partout (`md:grid-cols-2 lg:grid-cols-3`)
- [ ] Padding containers cohérent (`px-6 lg:px-8`)

### ✅ États interactifs

- [ ] Hover : toujours défini sur cliquables
- [ ] Focus : toujours visible (ring-2)
- [ ] Active : feedback visuel (scale, opacity)
- [ ] Disabled : grisé + curseur `not-allowed`

### ✅ Iconographie

- [ ] Même bibliothèque partout (Heroicons)
- [ ] Même taille par contexte (w-5 h-5 pour UI, w-6 h-6 pour features)
- [ ] Même couleur par sémantique (success = vert, error = rouge)

### ✅ Messages utilisateur

- [ ] Success : fond vert clair, bordure verte, icône checkmark
- [ ] Error : fond rouge clair, bordure rouge, icône X
- [ ] Warning : fond jaune clair, bordure jaune, icône ⚠
- [ ] Info : fond bleu clair, bordure bleue, icône ℹ

### ✅ Navigation

- [ ] Header sticky sur toutes les pages
- [ ] Logo toujours en haut à gauche
- [ ] Navigation principale toujours même position
- [ ] État actif toujours visible (même style)

## Erreurs à éviter (inconsistances courantes)

### ❌ Boutons différents selon les pages

```jsx
// ❌ Page 1 : Bouton bleu arrondi
<button className="bg-blue-500 text-white px-6 py-3 rounded-lg">
  Valider
</button>

// ❌ Page 2 : Bouton vert carré
<button className="bg-green-600 text-white px-4 py-2 rounded-none">
  Valider
</button>

// ✅ Partout : Composant Button standardisé
<Button variant="primary">Valider</Button>
```

### ❌ Espacements arbitraires

```jsx
// ❌ Espacements incohérents
<div className="gap-3">...</div>  // 12px
<div className="gap-5">...</div>  // 20px
<div className="gap-7">...</div>  // 28px

// ✅ Système 8px
<div className="gap-4">...</div>  // 16px
<div className="gap-8">...</div>  // 32px
<div className="gap-12">...</div> // 48px
```

### ❌ Polices multiples

```jsx
// ❌ 5 polices différentes
<h1 style={{ fontFamily: 'Roboto' }}>Titre</h1>
<p style={{ fontFamily: 'Open Sans' }}>Texte</p>
<button style={{ fontFamily: 'Montserrat' }}>Bouton</button>

// ✅ 1 police (2 max : sans-serif + mono)
<h1 className="font-sans">Titre</h1>
<p className="font-sans">Texte</p>
<code className="font-mono">Code</code>
```

### ❌ Messages d'erreur inconsistants

```jsx
// ❌ Styles différents selon les pages
// Page 1
<p className="text-red-500">Erreur !</p>

// Page 2
<div className="bg-red-100 p-4 text-red-700">Erreur détectée</div>

// ✅ Composant ErrorMessage standardisé
<ErrorMessage>
  L'email est invalide
</ErrorMessage>
```

## Documentation du Design System

**Créer un guide de style** (optionnel mais recommandé) :

```markdown
# Design System Mew-mew-Ai

## Couleurs
- Primaire : #3B82F6 (bleu)
- Secondaire : #A855F7 (violet)
- Succès : #10B981 (vert)
- Erreur : #EF4444 (rouge)

## Typographie
- Police principale : Geist Sans
- Police code : Geist Mono
- H1 : 60px bold
- H2 : 48px bold
- Body : 16px regular

## Composants
- Button : 3 variantes (primary, secondary, outline)
- Card : Border gris, padding 24px, hover shadow
- FormField : Label au-dessus, erreur en dessous

## Espacements
- Système 8px : gap-4, gap-8, p-6, py-12
- Grid : md:grid-cols-2 lg:grid-cols-3

## Exemples
[Screenshots des composants]
```

## Outils pour maintenir la consistance

### Storybook (documentation composants)

```bash
npm install --save-dev @storybook/nextjs
npx storybook@latest init
```

**Exemple de story** :
```jsx
// components/shared/Button.stories.jsx
export default {
  title: 'Components/Button',
  component: Button,
};

export const Primary = () => <Button variant="primary">Primaire</Button>;
export const Secondary = () => <Button variant="secondary">Secondaire</Button>;
export const Outline = () => <Button variant="outline">Outline</Button>;
```

### Linting CSS (consistance Tailwind)

```bash
npm install --save-dev stylelint stylelint-config-tailwindcss
```

**Configuration** :
```json
// .stylelintrc.json
{
  "extends": ["stylelint-config-tailwindcss"],
  "rules": {
    "no-descending-specificity": null
  }
}
```

## Ressources & Outils

### Design systems de référence
- [Tailwind UI](https://tailwindui.com/) - Composants officiels Tailwind
- [shadcn/ui](https://ui.shadcn.com/) - Design system React + Tailwind
- [Material Design](https://m3.material.io/) - Google
- [Ant Design](https://ant.design/) - Alibaba

### Documentation
- [Storybook](https://storybook.js.org/) - Documentation composants interactive
- [Zeroheight](https://zeroheight.com/) - Documentation design system

### Outils de consistance
- [Design Lint](https://www.figma.com/community/plugin/801195587640428208) - Plugin Figma
- [Stylelint](https://stylelint.io/) - Linting CSS
- [Chromatic](https://www.chromatic.com/) - Visual testing

---

**Prochaines étapes** : Documenter le design responsive pour garantir une expérience cohérente sur tous les écrans.
