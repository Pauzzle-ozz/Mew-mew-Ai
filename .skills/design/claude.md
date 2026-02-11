# Skills Design - Référence Technique

## Pourquoi ce dossier existe

Quand tu me demandes de travailler sur l'aspect visuel de Mew-mew-Ai, j'utilise les compétences documentées ici :

- **Créer des templates de CV** (moderne, classique, créatif, tech, executive, minimal)
- **Refondre l'interface** de la plateforme (dashboard, pages, composants)
- **Concevoir des landing pages** qui convertissent
- **Améliorer l'UX** du portfolio, de l'éditeur de blocs
- **Créer une identité visuelle** cohérente (couleurs, typographie, composants)
- **Assurer l'accessibilité** (contrastes, navigation clavier, ARIA)

## Compétences disponibles dans ce dossier

Les fichiers de skills ici couvrent :

- **Branding** : Identité de marque, cohérence visuelle
- **UI Design** : Interfaces, composants, grilles, espacements
- **UX Design** : Parcours utilisateur, wireframes, ergonomie
- **Typographie** : Choix de polices, hiérarchie, lisibilité
- **Couleur** : Palettes, contrastes, accessibilité WCAG
- **Design graphique** : Composition, hiérarchie visuelle
- **Design system** : Tokens, composants réutilisables, guidelines
- **Accessibilité** : WCAG AA/AAA, semantic HTML, ARIA
- **Architecture web** : Navigation, information architecture
- **Design web** : Responsive, mobile-first

## Applications concrètes dans Mew-mew-Ai

### 1. Templates de CV (6 templates)

**Stack actuel** :
- Générés en HTML/CSS via `backend/src/templates/templateFactory.js`
- Convertis en PDF avec Puppeteer
- Templates : moderne, classique, créatif, tech, executive, minimal

**Skills utilisés** :
- `skill_design_cv.md` : Structure, hiérarchie, lisibilité
- `skill_typographie.md` : Choix de polices par template (Calibri, Times, Helvetica, Consolas, Georgia)
- `skill_couleur.md` : Palettes par template (bleu, noir, rose/violet, vert terminal, élégant, minimal)

**Exemples d'utilisation** :
- "Crée un nouveau template de CV scandinave/minimaliste" → J'applique les principes de typographie, couleurs épurées, whitespace
- "Améliore le template tech pour les dev" → J'ajoute des éléments de design type terminal, polices monospace
- "Rends le template classique plus moderne" → J'ajuste espacements, typographie, tout en gardant le sérieux

### 2. Interface de la plateforme (Next.js + Tailwind)

**Stack actuel** :
- Next.js 16 (App Router)
- Tailwind CSS 4 (via PostCSS)
- Composants React dans `frontend-v2/components/`

**Skills utilisés** :
- `skill_ui_design.md` : Composants (boutons, formulaires, cards)
- `skill_design_system.md` : Tokens Tailwind, cohérence visuelle
- `skill_accessibilite.md` : Contrastes WCAG, navigation clavier
- `skill_architecture_web.md` : Navigation, sitemap, flow

**Exemples d'utilisation** :
- "Refais le dashboard utilisateur" → J'applique les principes UI (grilles, cards, hiérarchie)
- "Crée un design system Tailwind" → Je définis les tokens (colors, spacing, typography)
- "Améliore l'accessibilité du formulaire CV" → Je vérifie les contrastes, labels, focus states

### 3. Portfolio Pro (éditeur de blocs)

**Stack actuel** :
- Éditeur de blocs (hero, texte, image, vidéo, galerie, projets, compétences, contact)
- Page publique `/p/[slug]`
- Personnalisation (couleur primaire, mode sombre)

**Skills utilisés** :
- `skill_ux_design.md` : Parcours utilisateur, édition intuitive
- `skill_design_web.md` : Responsive design, mobile-first
- `skill_branding.md` : Cohérence visuelle, personnalisation

**Exemples d'utilisation** :
- "Améliore l'UX de l'éditeur de blocs" → J'analyse le flow, simplifie les étapes, améliore le feedback
- "Crée de nouveaux types de blocs" → J'applique les principes de design (cohérence, réutilisabilité)
- "Optimise l'affichage mobile du portfolio public" → Je teste le responsive, ajuste les breakpoints

### 4. Landing page & Marketing

**Stack actuel** :
- Page d'accueil `app/page.js`
- Pages de solutions (analyse CV, optimiseur, portfolio)

**Skills utilisés** :
- `skill_design_web.md` : Landing page qui convertit
- `skill_couleur.md` : Palette de marque cohérente
- `skill_typographie.md` : Hiérarchie visuelle claire

**Exemples d'utilisation** :
- "Refais la landing page pour mieux convertir" → J'applique les principes de hiérarchie, CTA visibles, social proof
- "Crée la page de pricing" → Je conçois une grille claire, tableaux comparatifs, CTAs

## Principes de design appliqués à Mew-mew-Ai

### Hiérarchie visuelle (CRAP)

- **Contrast** : Titres vs texte, CTAs vs background
- **Repetition** : Même style de boutons, cards, espacements
- **Alignment** : Grille Tailwind (12 colonnes), alignements cohérents
- **Proximity** : Grouper les éléments liés (form groups, sections)

### Couleurs (Tailwind)

**Palette recommandée** :
- **Primaire** : Blue-600 (CTA, liens, accents)
- **Secondaire** : Gray-100 à Gray-900 (textes, backgrounds)
- **Success** : Green-600
- **Error** : Red-600
- **Warning** : Yellow-600

**Contrastes WCAG** :
- Texte normal : 4.5:1 minimum (AA)
- Texte large (18px+) : 3:1 minimum (AA)
- Composants interactifs : 3:1 minimum

### Typographie (Geist)

**Stack actuel** :
- **Geist Sans** : Texte principal (`--font-geist-sans`)
- **Geist Mono** : Code, technique (`--font-geist-mono`)

**Hiérarchie recommandée** :
```
h1: text-4xl font-bold (36px)
h2: text-3xl font-semibold (30px)
h3: text-2xl font-semibold (24px)
h4: text-xl font-medium (20px)
body: text-base (16px)
small: text-sm (14px)
```

### Espacements (Tailwind scale)

**Échelle cohérente** :
- `space-y-2` (8px) : Éléments très liés
- `space-y-4` (16px) : Éléments d'un groupe
- `space-y-6` (24px) : Sections d'une page
- `space-y-8` (32px) : Grandes sections
- `space-y-12` (48px) : Séparations majeures

### Responsive (breakpoints Tailwind)

```
sm: 640px   (mobile large)
md: 768px   (tablette)
lg: 1024px  (desktop)
xl: 1280px  (desktop large)
2xl: 1536px (très large)
```

## Bonnes pratiques pour Mew-mew-Ai

### ✅ À FAIRE

- **Utiliser Tailwind** pour la cohérence (pas de CSS custom sauf exception)
- **Mobile-first** : Coder d'abord pour mobile, puis breakpoints `md:`, `lg:`
- **Contrastes WCAG** : Toujours vérifier avec un outil (WebAIM Contrast Checker)
- **Composants réutilisables** : Créer dans `components/shared/` si utilisé 2+ fois
- **Dark mode** : Prévoir les classes `dark:` pour le portfolio (déjà implémenté)
- **Feedback visuel** : Hover, focus, loading states, success/error messages

### ❌ À ÉVITER

- **CSS inline** dans JSX (sauf cas très spécifiques comme styles dynamiques)
- **Polices custom** non optimisées (utiliser `next/font`)
- **Images non optimisées** (toujours utiliser `next/image`)
- **Couleurs hardcodées** (utiliser les tokens Tailwind)
- **Breakpoints inconsistants** (suivre Tailwind : sm, md, lg, xl, 2xl)
- **Ignorer l'accessibilité** (keyboard nav, alt texts, ARIA si nécessaire)

## Outils de référence

### Design
- **Figma** : Pour les maquettes (si besoin)
- **Coolors** : Générateur de palettes
- **Google Fonts** : Polices web (Geist déjà intégré)

### Accessibilité
- **WebAIM Contrast Checker** : Vérifier les contrastes
- **axe DevTools** : Extension Chrome pour audit
- **WAVE** : Test d'accessibilité

### Inspiration (si refonte)
- **Dribbble** : Inspiration UI/UX
- **Awwwards** : Sites web primés
- **Mobbin** : Patterns mobile

## Templates de CV : Principes par style

| Template | Principes | Typographie | Couleurs |
|----------|-----------|-------------|----------|
| **Moderne** | Épuré, professionnel, tech | Calibri, sans-serif | Bleu (#0066cc), gris |
| **Classique** | Centré, traditionnel, sérieux | Times New Roman, serif | Noir, blanc |
| **Créatif** | Audacieux, gradient, artistique | Helvetica, moderne | Rose (#e91e63), violet (#9c27b0) |
| **Tech** | Terminal, monospace, dev | Consolas, monospace | Vert (#00ff00), noir |
| **Executive** | Premium, double bordure, C-level | Georgia, serif | Noir, or (subtil) |
| **Minimal** | Ultra épuré, whitespace, UX/UI | Helvetica Neue, léger | Gris très foncé, blanc |

## Relation avec les autres domaines

- **Web** : Implémentation du design en code (HTML/CSS/React)
- **Marketing** : Landing pages, conversion, hiérarchie visuelle
- **Communication** : Cohérence visuelle avec le message de marque
- **Emploi-carrière** : Templates CV, portfolios visuels

## Évolution des compétences design

Au fur et à mesure du développement de Mew-mew-Ai, j'enrichis ce dossier avec :
- Nouveaux templates de CV (scandinave, corporatif, startup, etc.)
- Patterns UI réutilisables (modals, notifications, steppers)
- Guidelines du design system (tokens Tailwind documentés)
- Exemples concrets de refonte (avant/après)

---

**Utilisation** : Référence technique pour Claude lors du développement de Mew-mew-Ai
**Dernière mise à jour** : Février 2026
