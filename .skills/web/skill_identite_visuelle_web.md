---
name: identite visuelle
description: Déclinaison d'une identité graphique sur un site internet.
---

# Skill : Identité Visuelle Web

## Description

L'identité visuelle web est la **personnalité graphique** de Mew-mew-Ai sur le web. C'est ce qui rend la marque **reconnaissable** et **mémorable**. Elle comprend :
- **Logo et variations** (couleur, monochrome, favicon)
- **Palette de couleurs** (primaire, secondaire, neutres)
- **Typographie** (polices de marque)
- **Iconographie** (style d'icônes, illustrations)
- **Ton visuel** (moderne, professionnel, créatif)
- **Patterns et textures** (backgrounds, dégradés)

## Analogie

L'identité visuelle, c'est comme **l'uniforme d'une équipe sportive** :
- **Logo** = Écusson du club (reconnaissable à distance)
- **Couleurs** = Maillot bleu/blanc (toujours les mêmes)
- **Typographie** = Police des numéros de maillot (cohérente)
- **Iconographie** = Mascottes, symboles (renforce l'identité)

Si chaque joueur portait un maillot différent → impossible de reconnaître l'équipe.

## Identité visuelle de Mew-mew-Ai

### 1. Logo

**Versions** :
- **Logo complet** : Symbole + Texte "Mew"
- **Symbole seul** : Carré gradient (bleu → violet)
- **Favicon** : Symbole 32x32px
- **Logo monochrome** : Noir (pour documents imprimés)

**Code** :
```jsx
// components/shared/Logo.jsx
export default function Logo({ variant = 'full', size = 'md' }) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const Symbol = () => (
    <div className={`
      ${sizes[size]}
      bg-gradient-to-br from-primary to-secondary
      rounded-lg
      flex items-center justify-center
    `}>
      <span className="text-white font-bold text-xs">
        M
      </span>
    </div>
  );

  if (variant === 'symbol') {
    return <Symbol />;
  }

  return (
    <Link href="/" className="flex items-center gap-3">
      <Symbol />
      <span className="text-xl font-bold text-gray-900">
        Mew
      </span>
    </Link>
  );
}

// Usage
<Logo variant="full" size="md" />        // Header
<Logo variant="symbol" size="sm" />      // Favicon
```

### 2. Palette de couleurs

**Couleurs de marque** :

| Nom | Hex | Usage |
|-----|-----|-------|
| **Primary** | `#3B82F6` | Boutons, liens, accents |
| **Primary Hover** | `#2563EB` | Hover states |
| **Secondary** | `#A855F7` | Accents créatifs, gradients |
| **Success** | `#10B981` | Messages de succès |
| **Error** | `#EF4444` | Messages d'erreur |
| **Warning** | `#F59E0B` | Alertes |
| **Info** | `#3B82F6` | Informations |

**Neutres** :

| Nom | Hex | Usage |
|-----|-----|-------|
| **Gray 50** | `#F9FAFB` | Backgrounds clairs |
| **Gray 100** | `#F3F4F6` | Hover backgrounds |
| **Gray 200** | `#E5E7EB` | Borders |
| **Gray 300** | `#D1D5DB` | Disabled states |
| **Gray 600** | `#4B5563` | Texte secondaire |
| **Gray 900** | `#111827` | Texte principal |

**Gradients de marque** :
```css
/* Gradient primaire (bleu → violet) */
bg-gradient-to-br from-primary via-secondary to-primary/80

/* Gradient hero */
bg-gradient-to-r from-primary to-secondary

/* Gradient subtle (backgrounds) */
bg-gradient-to-br from-primary/10 via-white to-secondary/10
```

### 3. Typographie

**Polices de marque** :
- **Principale** : Geist Sans (sans-serif moderne)
- **Code/Data** : Geist Mono (monospace)

**Hiérarchie** :
```javascript
// lib/styles/typography.js
export const typography = {
  // Display (landing page heroes)
  display: 'font-sans text-7xl md:text-8xl font-bold leading-tight tracking-tight',

  // Titres
  h1: 'font-sans text-5xl md:text-6xl font-bold leading-tight',
  h2: 'font-sans text-4xl md:text-5xl font-bold leading-snug',
  h3: 'font-sans text-3xl md:text-4xl font-semibold leading-snug',

  // Corps
  body: 'font-sans text-base leading-relaxed text-gray-700',
  bodyLarge: 'font-sans text-lg leading-relaxed text-gray-700',

  // UI
  button: 'font-sans text-base font-semibold',
  label: 'font-sans text-sm font-medium text-gray-900',
  caption: 'font-sans text-xs text-gray-500',
};
```

### 4. Iconographie

**Style** : Heroicons (outline pour UI, solid pour features)

**Exemples** :
```jsx
import {
  CheckCircleIcon,     // Succès
  XCircleIcon,         // Erreur
  DocumentTextIcon,    // CV
  BriefcaseIcon,       // Emploi
  SparklesIcon,        // IA
  UserCircleIcon,      // Portfolio
} from '@heroicons/react/24/outline';

// Usage cohérent
<CheckCircleIcon className="w-6 h-6 text-success" />
<DocumentTextIcon className="w-6 h-6 text-primary" />
```

**Illustrations** (si besoin) :
- Style : Flat design, couleurs de marque (bleu/violet)
- Source : [Undraw](https://undraw.co/) avec couleurs personnalisées

### 5. Ton visuel

**Mew-mew-Ai = Moderne + Professionnel + Accessible**

**Caractéristiques** :
- **Moderne** : Gradients, rounded corners, shadows subtiles
- **Professionnel** : Typographie claire, hiérarchie forte
- **Accessible** : Contraste WCAG AA, focus visible
- **Chaleureux** : Pas trop froid (pas de gris pur, utiliser bleu/violet)

**Exemples visuels** :

```jsx
// Hero section (ton moderne + chaleureux)
<section className="
  bg-gradient-to-br from-primary via-secondary to-primary/80
  text-white py-24
">
  <h1 className="text-6xl font-bold mb-6">
    Mew - L'IA qui vous propulse
  </h1>
  <p className="text-xl opacity-90 mb-8">
    Votre carrière mérite une intelligence artificielle dédiée
  </p>
</section>

// Card (ton professionnel)
<div className="
  bg-white border border-gray-200 rounded-xl
  p-6 hover:shadow-lg transition-all
">
  <h3 className="text-xl font-semibold text-gray-900 mb-2">
    Analyse CV
  </h3>
  <p className="text-gray-600 mb-4">
    Notre IA identifie les métiers qui correspondent à votre profil
  </p>
</div>
```

### 6. Patterns et textures

**Backgrounds** :

```jsx
// Gradient hero (landing page)
<div className="bg-gradient-to-br from-primary/10 via-white to-secondary/10">
  {/* Contenu */}
</div>

// Mesh gradient (moderne, subtle)
<div className="
  bg-[linear-gradient(to_right,#3B82F610_1px,transparent_1px),linear-gradient(to_bottom,#A855F710_1px,transparent_1px)]
  bg-[size:4rem_4rem]
">
  {/* Grille subtle */}
</div>

// Blob shapes (organiques)
<div className="relative">
  <div className="
    absolute top-0 -left-4 w-72 h-72
    bg-primary/20 rounded-full
    blur-3xl
  " />
  <div className="
    absolute bottom-0 -right-4 w-96 h-96
    bg-secondary/20 rounded-full
    blur-3xl
  " />
  {/* Contenu au-dessus */}
</div>
```

### 7. Templates CV (6 identités visuelles)

Chaque template a sa propre identité, mais respecte les principes de marque.

**Exemple : Template "moderne"** :
```javascript
// backend/src/templates/templateFactory.js
const moderneTemplate = {
  colors: {
    primary: '#3B82F6',      // Bleu (marque)
    secondary: '#60A5FA',
    text: '#1F2937',
    background: '#FFFFFF'
  },
  fonts: {
    primary: 'Calibri, sans-serif',
    headingSize: '28px',
    bodySize: '14px'
  },
  layout: {
    headerBg: 'linear-gradient(135deg, #3B82F6, #60A5FA)',
    sectionBorder: '2px solid #3B82F6',
    borderRadius: '8px'
  }
};
```

## Application de l'identité visuelle

### Landing page (vitrine de marque)

```jsx
// app/page.js
export default function HomePage() {
  return (
    <div>
      {/* Hero avec gradient de marque */}
      <section className="
        bg-gradient-to-br from-primary via-secondary to-primary/80
        text-white py-24
      ">
        <div className="container mx-auto px-6">
          <Logo variant="symbol" size="lg" />
          <h1 className="text-7xl font-bold mt-8 mb-6">
            Mew - L'IA qui vous propulse
          </h1>
          <p className="text-2xl opacity-90 mb-8 max-w-2xl">
            Votre carrière mérite une intelligence artificielle dédiée
          </p>
          <Button variant="primary" size="lg" className="bg-white text-primary hover:bg-gray-50">
            Commencer gratuitement
          </Button>
        </div>
      </section>

      {/* Features avec icônes de marque */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="border border-gray-200 rounded-xl p-8 hover:border-primary transition-all">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <DocumentTextIcon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Analyse CV
              </h3>
              <p className="text-gray-600">
                Notre IA analyse votre parcours et identifie vos métiers idéaux
              </p>
            </div>

            {/* Feature 2 */}
            <div className="border border-gray-200 rounded-xl p-8 hover:border-secondary transition-all">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <SparklesIcon className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Optimisation IA
              </h3>
              <p className="text-gray-600">
                Améliorez votre CV pour les ATS et recruteurs
              </p>
            </div>

            {/* Feature 3 */}
            <div className="border border-gray-200 rounded-xl p-8 hover:border-success transition-all">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-4">
                <UserCircleIcon className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Portfolio Pro
              </h3>
              <p className="text-gray-600">
                Créez votre vitrine professionnelle en quelques clics
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA avec gradient */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Prêt à propulser votre carrière ?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Rejoignez les 10 000+ professionnels qui utilisent Mew
          </p>
          <Button variant="primary" size="lg" className="bg-white text-primary hover:bg-gray-50">
            Créer mon compte gratuit
          </Button>
        </div>
      </section>
    </div>
  );
}
```

## Checklist identité visuelle

### ✅ Logo

- [ ] Logo complet (symbole + texte)
- [ ] Symbole seul (favicon, mobile)
- [ ] Version monochrome (noir, blanc)
- [ ] Tailles définies (sm, md, lg)
- [ ] Espaces de sécurité respectés (pas de texte trop proche)

### ✅ Couleurs

- [ ] Palette définie dans `@theme` (globals.css)
- [ ] Couleurs primaire, secondaire, neutres
- [ ] Couleurs sémantiques (success, error, warning, info)
- [ ] Gradients de marque documentés
- [ ] Contraste WCAG AA respecté (4.5:1 min)

### ✅ Typographie

- [ ] 1-2 polices max (sans-serif + mono)
- [ ] Hiérarchie claire (H1 > H2 > H3 > body)
- [ ] Line-height adapté (1.1-1.3 titres, 1.5-1.7 body)
- [ ] Tailles responsives (`text-4xl md:text-5xl lg:text-6xl`)

### ✅ Iconographie

- [ ] Même bibliothèque partout (Heroicons)
- [ ] Tailles cohérentes (w-5 h-5 UI, w-6 h-6 features)
- [ ] Couleurs sémantiques (success = vert, error = rouge)
- [ ] Style cohérent (outline ou solid, pas mixte)

### ✅ Ton visuel

- [ ] Moderne : gradients, rounded corners, shadows
- [ ] Professionnel : typographie claire, hiérarchie forte
- [ ] Accessible : contraste, focus visible, ARIA
- [ ] Cohérent : même style sur toutes les pages

### ✅ Applications

- [ ] Landing page utilise gradient de marque
- [ ] Dashboard utilise couleurs primaires
- [ ] CV templates respectent l'identité (bleu, violet)
- [ ] Portfolios permettent personnalisation (primary_color)
- [ ] Emails transactionnels utilisent couleurs de marque

## Brand guidelines (document de référence)

**À créer** : `BRAND_GUIDELINES.md` (documentation interne)

```markdown
# Mew-mew-Ai - Brand Guidelines

## Logo
- **Version complète** : Symbole carré gradient + texte "Mew"
- **Symbole seul** : Carré 32x32px, gradient bleu → violet
- **Couleur fond** : Bleu (#3B82F6) ou transparent
- **Taille min** : 24px (lisibilité)
- **Espaces** : Min 8px autour du logo

## Couleurs
### Primaires
- **Primary** : #3B82F6 (bleu) → Boutons, liens, accents
- **Secondary** : #A855F7 (violet) → Accents créatifs

### Sémantiques
- **Success** : #10B981 (vert)
- **Error** : #EF4444 (rouge)
- **Warning** : #F59E0B (orange)

### Gradients
- **Hero** : `linear-gradient(135deg, #3B82F6, #A855F7)`
- **Background** : `linear-gradient(135deg, #3B82F610, #A855F710)`

## Typographie
- **Principale** : Geist Sans
- **Code** : Geist Mono
- **Tailles** : H1 60px, H2 48px, H3 36px, Body 16px

## Ton de voix
- **Moderne** : Langage simple, actuel
- **Professionnel** : Pas de familiarité excessive
- **Bienveillant** : "Nous vous aidons" vs "Vous devez"

## Exemples
[Screenshots des pages clés]
```

## Outils pour gérer l'identité

### Figma (Design system)

- Créer une librairie de composants Figma
- Définir les couleurs, typographies, espacements
- Partager avec l'équipe

### Brand.ai (Centralisation)

- Héberger les assets (logos, polices, couleurs)
- Générer un guide de style web

### Storybook (Documentation composants)

- Documenter tous les composants React
- Montrer les variations (couleurs, tailles)
- Faciliter la maintenance

## Ressources

### Inspiration
- [Dribbble Brand Identity](https://dribbble.com/tags/brand_identity)
- [Behance Branding](https://www.behance.net/galleries/graphic-design/branding)
- [Brand New](https://www.underconsideration.com/brandnew/) - Critiques d'identités

### Outils
- [Figma](https://www.figma.com/) - Design UI/UX
- [Coolors](https://coolors.co/) - Palettes de couleurs
- [Google Fonts](https://fonts.google.com/) - Polices web
- [Heroicons](https://heroicons.com/) - Icônes

### Guidelines de référence
- [Atlassian Design System](https://atlassian.design/)
- [Shopify Polaris](https://polaris.shopify.com/)
- [IBM Carbon](https://carbondesignsystem.com/)
- [Mailchimp Pattern Library](https://ux.mailchimp.com/patterns)

---

**Conclusion** : L'identité visuelle de Mew-mew-Ai est maintenant documentée. Tous les développements futurs doivent respecter cette charte pour maintenir la cohérence de marque.
