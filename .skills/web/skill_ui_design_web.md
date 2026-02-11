---
name: UI design web
description: Conception des interfaces web et de leurs composants.
---

# Skill : UI Design Web

## Description

L'UI (User Interface) design est la **couche visuelle et interactive** de Mew-mew-Ai. C'est ce que l'utilisateur **voit** et **touche**. Un bon UI design doit :
- **Être intuitif** (l'utilisateur comprend immédiatement comment interagir)
- **Être cohérent** (même style partout : boutons, formulaires, cards)
- **Guider l'attention** (CTA clairs, hiérarchie visuelle forte)
- **Réduire la friction** (minimal clics, feedback immédiat)

## Analogie

L'UI design, c'est comme **l'aménagement d'un magasin** :
- Les **boutons** sont tes **caisses** (clairs, accessibles, visibles)
- Les **formulaires** sont tes **rayons** (organisés, étiquetés, faciles à parcourir)
- La **navigation** est ta **signalétique** (où suis-je, où puis-je aller)
- Les **couleurs** sont ton **ambiance** (professionnelle, créative, chaleureuse)
- Les **espacements** sont tes **allées** (respiration, pas de surcharge)

Si ton magasin est mal organisé → les clients partent.
Si ton UI est confus → les utilisateurs abandonnent.

## Principes théoriques

### 1. Lois de l'UI design

**Loi de Fitts** : Plus une cible est grande et proche, plus elle est facile à atteindre.
→ Les boutons principaux doivent être **gros** et **accessibles**.

**Loi de Hick** : Plus il y a de choix, plus la décision prend du temps.
→ Limiter les options (max 3-5 par écran).

**Loi de Jakob** : Les utilisateurs préfèrent que votre site fonctionne comme tous les autres.
→ Respecter les conventions (logo en haut à gauche, navigation horizontale, etc.).

**Loi de la Gestalt** : Le cerveau groupe les éléments proches visuellement.
→ Espacer les sections distinctes, rapprocher les éléments liés.

**Loi de Miller** : On peut retenir 7 ± 2 éléments simultanément.
→ Limiter les items de navigation (max 7).

### 2. Hiérarchie visuelle

**Principe** : Guider l'œil de l'utilisateur du plus important au moins important.

**Outils** :
- **Taille** : Plus gros = plus important (H1 > H2 > body)
- **Couleur** : Couleurs vives = attention (CTA bleu vs texte gris)
- **Position** : Haut > bas, gauche > droite (lecture en F)
- **Contraste** : Fort contraste = focus (bouton vs background)
- **Espacement** : Plus d'espace = plus d'importance

### 3. Grille et layout

**Grid CSS** : Système de colonnes pour aligner les éléments.

```
12 colonnes (Tailwind CSS)
┌──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┐
│  │  │  │  │  │  │  │  │  │  │  │  │
└──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┘

Mobile (1 col)    :  [────────────────────]
Tablet (2 cols)   :  [─────────] [─────────]
Desktop (3 cols)  :  [─────] [─────] [─────]
```

**Espacements (Tailwind)** :
- `gap-4` (16px) : Entre cards
- `gap-8` (32px) : Entre sections
- `px-6` (24px) : Padding horizontal
- `py-12` (48px) : Padding vertical sections

### 4. États interactifs

Chaque élément interactif doit avoir **5 états** :

1. **Default** : État initial
2. **Hover** : Souris au-dessus (desktop)
3. **Focus** : Sélectionné au clavier (accessibilité)
4. **Active** : Cliqué/pressé
5. **Disabled** : Non interactif (grisé, curseur `not-allowed`)

## Architecture UI de Mew-mew-Ai

### 1. Design system (composants réutilisables)

**Structure actuelle** :
```
frontend-v2/components/
├── shared/
│   ├── Button.jsx           # Boutons (primary, secondary, outline, ghost)
│   ├── Card.jsx             # Cards pour dashboard, portfolios
│   ├── Input.jsx            # Champs de formulaire
│   ├── Select.jsx           # Dropdown
│   ├── Modal.jsx            # Modales
│   ├── ErrorMessage.jsx     # Messages d'erreur
│   ├── ProgressBar.jsx      # Barre de progression
│   └── Badge.jsx            # Tags, labels
├── cv/
│   ├── AnalyzerForm.jsx     # Formulaire d'analyse CV
│   ├── CVFormIdentity.jsx   # Formulaire identité
│   ├── CVTemplateSelector.jsx # Sélecteur de templates
│   └── ResultsDisplay.jsx   # Affichage résultats
└── portfolio/
    ├── BlockEditor.jsx      # Éditeur de blocs
    ├── MediaUploader.jsx    # Upload médias
    └── PublicView.jsx       # Vue publique portfolio
```

### 2. Composants de base (Atomic Design)

**Atomes** (plus petits composants) :
- Button, Input, Badge, Icon

**Molécules** (combinaisons d'atomes) :
- FormField (Label + Input + Error)
- CardHeader (Avatar + Title + Subtitle)

**Organismes** (sections complètes) :
- Navigation, Hero, FeatureGrid, Footer

**Templates** (layouts de page) :
- DashboardLayout, LandingPageLayout, PortfolioLayout

## Exemples de code concrets (JSX + Tailwind)

### 1. Boutons (design system)

```jsx
// components/shared/Button.jsx
export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  disabled = false,
  loading = false,
  icon,
  ...props
}) {
  const variants = {
    primary: 'bg-primary hover:bg-primary-hover text-white shadow-sm',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    ghost: 'text-gray-700 hover:bg-gray-100',
    danger: 'bg-error hover:bg-error/90 text-white shadow-sm',
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
        focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary
        flex items-center justify-center gap-2
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {icon && !loading && icon}
      {children}
    </button>
  );
}

// Utilisation
<Button variant="primary" size="lg">
  Analyser mon CV
</Button>

<Button variant="outline" icon={<DownloadIcon />}>
  Télécharger
</Button>

<Button variant="primary" loading>
  Analyse en cours...
</Button>
```

### 2. Cards (dashboard, portfolios)

```jsx
// components/shared/Card.jsx
export default function Card({
  title,
  subtitle,
  image,
  badge,
  footer,
  hover = true,
  onClick,
  children
}) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white border border-gray-200 rounded-xl overflow-hidden
        ${hover ? 'hover:shadow-lg hover:border-gray-300' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        transition-all duration-200
      `}
    >
      {/* Image header (optionnel) */}
      {image && (
        <div className="aspect-video bg-gray-100 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Header avec badge */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-gray-500">
                {subtitle}
              </p>
            )}
          </div>
          {badge && (
            <span className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full">
              {badge}
            </span>
          )}
        </div>

        {/* Body */}
        {children && (
          <div className="text-gray-600">
            {children}
          </div>
        )}
      </div>

      {/* Footer (optionnel) */}
      {footer && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
}

// Utilisation (liste de portfolios)
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  {portfolios.map(portfolio => (
    <Card
      key={portfolio.id}
      title={portfolio.title}
      subtitle={`${portfolio.views_count} vues`}
      badge={portfolio.published ? 'Publié' : 'Brouillon'}
      image={portfolio.cover_image}
      onClick={() => router.push(`/solutions/portfolio/${portfolio.id}/edit`)}
      footer={
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Modifié il y a 2 jours
          </span>
          <button className="text-primary hover:text-primary-hover">
            Éditer →
          </button>
        </div>
      }
    >
      <p className="text-sm line-clamp-2">
        {portfolio.description}
      </p>
    </Card>
  ))}
</div>
```

### 3. Formulaires (inputs, validation)

```jsx
// components/shared/FormField.jsx
export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  placeholder,
  helpText,
  icon,
  ...props
}) {
  return (
    <div className="mb-6">
      {/* Label */}
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-900 mb-2"
      >
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>

      {/* Input avec icône */}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            w-full px-4 py-3 ${icon ? 'pl-10' : ''}
            border rounded-lg
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-primary/50
            ${error
              ? 'border-error focus:ring-error/50 bg-error/5'
              : 'border-gray-300 focus:border-primary'
            }
          `}
          {...props}
        />
      </div>

      {/* Help text ou erreur */}
      {error ? (
        <p className="mt-2 text-sm text-error flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" />
          </svg>
          {error}
        </p>
      ) : helpText ? (
        <p className="mt-2 text-sm text-gray-500">
          {helpText}
        </p>
      ) : null}
    </div>
  );
}

// Utilisation (formulaire CV)
<form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
  <FormField
    label="Prénom"
    name="prenom"
    value={formData.prenom}
    onChange={handleChange}
    error={errors.prenom}
    required
    placeholder="Jean"
    icon={<UserIcon className="w-5 h-5" />}
  />

  <FormField
    label="Email"
    name="email"
    type="email"
    value={formData.email}
    onChange={handleChange}
    error={errors.email}
    required
    placeholder="jean@example.com"
    helpText="Nous ne partagerons jamais votre email"
    icon={<MailIcon className="w-5 h-5" />}
  />

  <Button type="submit" variant="primary" size="lg" className="w-full">
    Analyser mon CV
  </Button>
</form>
```

### 4. Navigation (header)

```jsx
// components/shared/Navigation.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function Navigation() {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg" />
            <span className="text-xl font-bold text-gray-900">Mew</span>
          </Link>

          {/* Navigation desktop */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/solutions/analyse-cv"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Analyse CV
            </Link>
            <Link
              href="/solutions/optimiseur-cv"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Optimiseur CV
            </Link>
            <Link
              href="/solutions/portfolio"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Portfolio
            </Link>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost">
                    Dashboard
                  </Button>
                </Link>
                <Button variant="outline" onClick={signOut}>
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">
                    Connexion
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="primary">
                    S'inscrire
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
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

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-4">
              <Link
                href="/solutions/analyse-cv"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Analyse CV
              </Link>
              <Link
                href="/solutions/optimiseur-cv"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Optimiseur CV
              </Link>
              <Link
                href="/solutions/portfolio"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Portfolio
              </Link>
              <div className="pt-4 border-t border-gray-200 flex flex-col gap-3">
                {user ? (
                  <>
                    <Button variant="ghost" className="w-full">
                      Dashboard
                    </Button>
                    <Button variant="outline" onClick={signOut} className="w-full">
                      Déconnexion
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" className="w-full">
                      Connexion
                    </Button>
                    <Button variant="primary" className="w-full">
                      S'inscrire
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
```

### 5. Modales (dialogs)

```jsx
// components/shared/Modal.jsx
'use client';

import { useEffect } from 'react';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md'
}) {
  // Bloquer scroll du body quand modale ouverte
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Fermer avec Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    full: 'max-w-7xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm animate-in fade-in"
      />

      {/* Modal */}
      <div
        className={`
          relative bg-white rounded-xl shadow-2xl
          ${sizes[size]} w-full
          max-h-[90vh] overflow-hidden
          animate-in zoom-in-95 slide-in-from-bottom-2
        `}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// Utilisation
const [isModalOpen, setIsModalOpen] = useState(false);

<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Supprimer le portfolio ?"
  footer={
    <>
      <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
        Annuler
      </Button>
      <Button variant="danger" onClick={handleDelete}>
        Supprimer
      </Button>
    </>
  }
>
  <p className="text-gray-600">
    Cette action est irréversible. Le portfolio et tous ses blocs seront supprimés définitivement.
  </p>
</Modal>
```

### 6. Empty states (états vides)

```jsx
// components/shared/EmptyState.jsx
export default function EmptyState({
  icon,
  title,
  description,
  action
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {/* Icône */}
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        {icon || (
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        )}
      </div>

      {/* Texte */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 max-w-md mb-6">
        {description}
      </p>

      {/* Action */}
      {action}
    </div>
  );
}

// Utilisation (liste de portfolios vide)
{portfolios.length === 0 ? (
  <EmptyState
    title="Aucun portfolio"
    description="Créez votre premier portfolio professionnel en quelques clics"
    action={
      <Button variant="primary" onClick={handleCreatePortfolio}>
        Créer mon portfolio
      </Button>
    }
  />
) : (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {/* Liste des portfolios */}
  </div>
)}
```

## Diagramme : Architecture UI

```
┌─────────────────────────────────────────────────────────┐
│               SYSTÈME UI MEW-MEW-AI                     │
└─────────────────────────────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          │               │               │
          ▼               ▼               ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │  ATOMES  │    │MOLÉCULES │    │ORGANISMES│
    │          │    │          │    │          │
    │ Button   │───>│FormField │───>│ Hero     │
    │ Input    │    │CardHeader│    │FeatureGrid
    │ Badge    │    │          │    │ Footer   │
    └──────────┘    └──────────┘    └──────────┘
          │               │               │
          └───────────────┼───────────────┘
                          ▼
                    ┌──────────┐
                    │TEMPLATES │
                    │          │
                    │Dashboard │
                    │Landing   │
                    │Portfolio │
                    └──────────┘
                          │
                          ▼
                      PAGES
              (app/page.js, dashboard/page.js)
```

## Checklist pratique

### ✅ Design system

- [ ] Composants de base créés (Button, Input, Card, Modal)
- [ ] Variantes définies (primary, secondary, outline, ghost, danger)
- [ ] Tailles définies (sm, md, lg)
- [ ] États interactifs (default, hover, focus, active, disabled)
- [ ] Documentation des composants (props, exemples)

### ✅ Hiérarchie visuelle

- [ ] CTA principal clairement identifiable (couleur, taille, position)
- [ ] Titres hiérarchisés (H1 > H2 > H3)
- [ ] Espacement cohérent (gap-4, gap-8, p-6)
- [ ] Contraste suffisant (texte/fond, boutons/background)
- [ ] Éléments groupés visuellement (Gestalt)

### ✅ Formulaires

- [ ] Labels clairs et visibles
- [ ] Champs requis indiqués (`*` rouge)
- [ ] Validation inline (erreurs sous les champs)
- [ ] Feedback immédiat (succès, erreur)
- [ ] Placeholder informatif (exemple de saisie)
- [ ] Focus visible (ring bleu)

### ✅ Navigation

- [ ] Logo cliquable (retour accueil)
- [ ] Items de navigation limités (max 7)
- [ ] État actif visible (couleur, bordure)
- [ ] Responsive (menu burger mobile)
- [ ] Sticky header (reste visible au scroll)

### ✅ Cards

- [ ] Hover effect (shadow, bordure)
- [ ] Contenu structuré (header, body, footer)
- [ ] Image responsive (aspect-ratio)
- [ ] Badge de statut (publié, brouillon)
- [ ] Action claire (bouton, lien)

### ✅ Modales

- [ ] Backdrop semi-transparent (bg-gray-900/50)
- [ ] Fermeture Escape et clic backdrop
- [ ] Header avec titre et bouton fermer
- [ ] Footer avec actions (annuler, confirmer)
- [ ] Scroll du body bloqué quand ouverte
- [ ] Animation d'entrée (fade-in, zoom-in)

### ✅ Empty states

- [ ] Icône illustrative
- [ ] Titre explicite
- [ ] Description courte
- [ ] Action claire (CTA)

### ✅ Responsive

- [ ] Grid adaptatif (1 col mobile, 2 tablet, 3 desktop)
- [ ] Menu burger mobile
- [ ] Boutons pleine largeur mobile (`w-full`)
- [ ] Padding réduit mobile (`px-4` vs `px-6`)

### ✅ Accessibilité

- [ ] Focus visible (ring-2)
- [ ] Labels associés aux inputs (`htmlFor`)
- [ ] Alt text sur images
- [ ] ARIA labels sur icônes cliquables
- [ ] Contraste ≥ 4.5:1

### ✅ Performance

- [ ] Pas de CSS inline (utiliser Tailwind classes)
- [ ] Images optimisées (`next/image`)
- [ ] Lazy loading (images, composants)
- [ ] Pas de re-renders inutiles (React.memo si besoin)

## Erreurs à éviter

### ❌ Trop de variantes de boutons

```jsx
// ❌ MAUVAIS : 10 styles différents de boutons
<button className="bg-blue-500">Primaire</button>
<button className="bg-green-500">Succès</button>
<button className="bg-red-500">Erreur</button>
<button className="bg-yellow-500">Warning</button>
<button className="bg-purple-500">Info</button>
...

// ✅ BON : 3-4 variantes max
<Button variant="primary">Action principale</Button>
<Button variant="secondary">Action secondaire</Button>
<Button variant="outline">Action tertiaire</Button>
```

### ❌ Pas d'états interactifs

```jsx
// ❌ MAUVAIS : Pas de hover, pas de focus
<button className="bg-primary text-white px-6 py-3 rounded">
  Cliquez-moi
</button>

// ✅ BON : Tous les états définis
<button className="
  bg-primary hover:bg-primary-hover
  text-white px-6 py-3 rounded
  focus:outline-none focus:ring-2 focus:ring-primary/50
  active:scale-95
  disabled:opacity-50
  transition-all
">
  Cliquez-moi
</button>
```

### ❌ Hiérarchie visuelle faible

```jsx
// ❌ MAUVAIS : Tout a la même importance visuelle
<div>
  <h1 className="text-2xl">Titre principal</h1>
  <button className="text-2xl">Bouton secondaire</button>
  <p className="text-2xl">Corps de texte</p>
</div>

// ✅ BON : Hiérarchie claire
<div>
  <h1 className="text-5xl font-bold">Titre principal</h1>
  <p className="text-lg text-gray-600 my-4">Corps de texte</p>
  <button className="text-base font-semibold bg-primary text-white px-6 py-3 rounded">
    Action principale
  </button>
</div>
```

### ❌ Formulaires sans validation visuelle

```jsx
// ❌ MAUVAIS : Erreur invisible
<input
  type="email"
  value={email}
  onChange={handleChange}
  className="border border-gray-300"
/>
{error && <p>{error}</p>}

// ✅ BON : Erreur visuellement distincte
<input
  type="email"
  value={email}
  onChange={handleChange}
  className={`
    border ${error ? 'border-error bg-error/5' : 'border-gray-300'}
    focus:ring-2 ${error ? 'focus:ring-error/50' : 'focus:ring-primary/50'}
  `}
/>
{error && (
  <p className="text-error text-sm mt-2 flex items-center gap-1">
    <ErrorIcon />
    {error}
  </p>
)}
```

### ❌ Modal non accessible

```jsx
// ❌ MAUVAIS : Pas de fermeture Escape, scroll du body non bloqué
<div className="fixed inset-0 bg-gray-900/50" onClick={onClose}>
  <div className="bg-white p-6">
    {children}
  </div>
</div>

// ✅ BON : Fermeture Escape, scroll bloqué, animation
// (Voir exemple complet de Modal ci-dessus)
```

## Ressources & Outils

### Design systems de référence
- [Tailwind UI](https://tailwindui.com/) - Composants Tailwind officiels
- [shadcn/ui](https://ui.shadcn.com/) - Composants React + Tailwind
- [Flowbite](https://flowbite.com/) - Bibliothèque de composants
- [Headless UI](https://headlessui.com/) - Composants accessibles unstyled

### Inspiration
- [Dribbble](https://dribbble.com/) - Designs UI
- [Behance](https://www.behance.net/) - Projets complets
- [Awwwards](https://www.awwwards.com/) - Sites web primés
- [UI Garage](https://uigarage.net/) - Patterns UI

### Outils
- [Figma](https://www.figma.com/) - Design UI/UX
- [Coolors](https://coolors.co/) - Palettes de couleurs
- [Hero Icons](https://heroicons.com/) - Icônes SVG
- [Lucide Icons](https://lucide.dev/) - Alternative Hero Icons

### Accessibilité
- [WAVE](https://wave.webaim.org/) - Test accessibilité
- [axe DevTools](https://www.deque.com/axe/devtools/) - Audit Chrome
- [Contrast Checker](https://webaim.org/resources/contrastchecker/) - Contraste

---

**Prochaines étapes** : Documenter l'UX design (`skill_ux_design_web.md`) pour optimiser les parcours utilisateurs.