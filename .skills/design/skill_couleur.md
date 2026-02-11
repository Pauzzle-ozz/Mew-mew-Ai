---
name: couleur
description: Utilisation stratégique des couleurs pour créer harmonie, contraste et lisibilité dans Mew-mew-Ai.
---

# Skill : Couleur pour Mew-mew-Ai

## Contexte du projet

Mew-mew-Ai est une plateforme SaaS multi-solutions qui nécessite :
- **Palette cohérente** : Couleurs primaires, secondaires, sémantiques
- **Accessibilité WCAG** : Contrastes suffisants (AA minimum)
- **Dark mode** : Support du mode sombre (portfolio)
- **Templates CV** : 6 palettes différentes (moderne, classique, créatif, tech, executive, minimal)
- **Personnalisation** : Couleur primaire modifiable par l'utilisateur (portfolio)

## 1. Palette de couleurs (Tailwind CSS 4)

### Couleur primaire (Bleu)

**Rôle** : CTA, liens, éléments interactifs, accents

```css
primary-50:  #eff6ff   /* Backgrounds très clairs */
primary-100: #dbeafe   /* Backgrounds clairs */
primary-200: #bfdbfe   /* Hover sur backgrounds */
primary-300: #93c5fd   /* Bordures hover */
primary-400: #60a5fa   /* Disabled states */
primary-500: #3b82f6   /* Couleur de base */
primary-600: #2563eb   /* Hover, focus (défaut CTA) */
primary-700: #1d4ed8   /* Active, pressed */
primary-800: #1e40af   /* Texte foncé sur clair */
primary-900: #1e3a8a   /* Titres, texte très foncé */
```

**Utilisation** :
- Boutons principaux : `bg-primary-600 hover:bg-primary-700`
- Liens : `text-primary-600 hover:text-primary-700`
- Bordures focus : `focus:ring-primary-500`
- Backgrounds clairs : `bg-primary-50`

### Couleurs neutres (Gris)

**Rôle** : Texte, bordures, backgrounds

```css
gray-50:  #f9fafb   /* Background très clair (body) */
gray-100: #f3f4f6   /* Background clair (cards hover) */
gray-200: #e5e7eb   /* Bordures (inputs, cards) */
gray-300: #d1d5db   /* Bordures hover */
gray-400: #9ca3af   /* Texte désactivé, placeholders */
gray-500: #6b7280   /* Texte secondaire */
gray-600: #4b5563   /* Texte normal */
gray-700: #374151   /* Texte accentué */
gray-800: #1f2937   /* Texte principal */
gray-900: #111827   /* Titres, texte très foncé */
```

**Utilisation** :
- Texte principal : `text-gray-800`
- Titres : `text-gray-900`
- Texte secondaire : `text-gray-600`
- Bordures : `border-gray-200`
- Backgrounds : `bg-gray-50`
- Disabled : `text-gray-400`

### Couleurs sémantiques

#### Success (Vert)

```css
green-50:  #f0fdf4
green-100: #dcfce7
green-500: #22c55e   /* Icônes success */
green-600: #16a34a   /* Couleur principale success */
green-700: #15803d   /* Hover */
green-800: #166534   /* Texte foncé */
```

**Utilisation** :
- Messages de succès : `bg-green-50 border-green-200 text-green-800`
- Boutons de validation : `bg-green-600 hover:bg-green-700 text-white`
- Icônes : `text-green-600`

#### Error (Rouge)

```css
red-50:  #fef2f2
red-100: #fee2e2
red-500: #ef4444   /* Icônes error */
red-600: #dc2626   /* Couleur principale error */
red-700: #b91c1c   /* Hover */
red-800: #991b1b   /* Texte foncé */
```

**Utilisation** :
- Messages d'erreur : `bg-red-50 border-red-200 text-red-800`
- Bordures erreur : `border-red-500`
- Boutons dangereux : `bg-red-600 hover:bg-red-700 text-white`

#### Warning (Jaune/Orange)

```css
yellow-50:  #fefce8
yellow-100: #fef9c3
yellow-500: #eab308   /* Icônes warning */
yellow-600: #ca8a04   /* Couleur principale warning */
yellow-700: #a16207   /* Hover */
yellow-800: #854d0e   /* Texte foncé */
```

**Utilisation** :
- Alertes d'avertissement : `bg-yellow-50 border-yellow-200 text-yellow-800`
- Icônes : `text-yellow-600`

#### Info (Bleu clair)

```css
blue-50:  #eff6ff
blue-100: #dbeafe
blue-500: #3b82f6   /* Icônes info */
blue-600: #2563eb   /* Couleur principale info */
blue-700: #1d4ed8   /* Hover */
blue-800: #1e40af   /* Texte foncé */
```

**Utilisation** :
- Messages informatifs : `bg-blue-50 border-blue-200 text-blue-800`

## 2. Accessibilité (WCAG AA/AAA)

### Ratios de contraste

**WCAG AA (minimum requis)** :
- Texte normal (< 18px) : **4.5:1**
- Texte large (≥ 18px ou 14px bold) : **3:1**
- Composants interactifs (boutons, inputs) : **3:1**

**WCAG AAA (optimal)** :
- Texte normal : **7:1**
- Texte large : **4.5:1**

### Combinaisons sûres (WCAG AA)

#### Texte sur fond blanc

| Couleur | Ratio | WCAG AA | Usage |
|---------|-------|---------|-------|
| `text-gray-900` (#111827) | 21:1 | ✅ AAA | Titres |
| `text-gray-800` (#1f2937) | 16.5:1 | ✅ AAA | Texte principal |
| `text-gray-700` (#374151) | 12:6:1 | ✅ AAA | Texte accentué |
| `text-gray-600` (#4b5563) | 8.6:1 | ✅ AAA | Texte secondaire |
| `text-gray-500` (#6b7280) | 5.7:1 | ✅ AA | Texte tertiaire |
| `text-gray-400` (#9ca3af) | 2.8:1 | ❌ Fail | Placeholders uniquement |
| `text-primary-600` (#2563eb) | 4.6:1 | ✅ AA | Liens, CTA |
| `text-primary-500` (#3b82f6) | 3.4:1 | ❌ Fail (normal), ✅ AA (large) | Texte large uniquement |

#### Texte blanc sur fond coloré

| Background | Ratio | WCAG AA | Usage |
|------------|-------|---------|-------|
| `bg-primary-600` (#2563eb) | 4.6:1 | ✅ AA | Boutons primaires |
| `bg-primary-700` (#1d4ed8) | 6.2:1 | ✅ AA | Boutons hover |
| `bg-green-600` (#16a34a) | 4.1:1 | ✅ AA (large) | Boutons success |
| `bg-red-600` (#dc2626) | 5.1:1 | ✅ AA | Boutons danger |
| `bg-gray-600` (#4b5563) | 8.6:1 | ✅ AAA | Boutons neutres |

### Vérification des contrastes

**Outils recommandés** :
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Coolors Contrast Checker](https://coolors.co/contrast-checker)
- Extension Chrome : **axe DevTools**

**Exemple d'utilisation** :
```
Couleur de premier plan : #2563eb (primary-600)
Couleur d'arrière-plan : #ffffff (white)
Ratio : 4.6:1
WCAG AA (normal text) : ✅ Pass
WCAG AAA (normal text) : ❌ Fail (7:1 requis)
```

### Couleurs à éviter

#### ❌ Texte gris clair sur fond blanc

```jsx
// ❌ Mauvais : ratio 2.8:1 (insuffisant)
<p className="text-gray-400">Texte peu lisible</p>

// ✅ Bon : ratio 5.7:1 (AA)
<p className="text-gray-500">Texte lisible</p>
```

#### ❌ Texte bleu clair sur fond blanc

```jsx
// ❌ Mauvais : ratio 3.4:1 (insuffisant pour texte normal)
<p className="text-primary-500">Texte peu lisible</p>

// ✅ Bon : ratio 4.6:1 (AA)
<p className="text-primary-600">Texte lisible</p>
```

#### ❌ Couleurs seules pour transmettre l'info

```jsx
// ❌ Mauvais : seule la couleur indique l'erreur
<input className="border-red-500" />

// ✅ Bon : couleur + icône + texte
<div>
  <input className="border-red-500" aria-invalid="true" />
  <p className="text-red-600 flex items-center gap-1">
    <svg className="w-4 h-4" />
    Email invalide
  </p>
</div>
```

## 3. Dark mode (portfolio)

### Palette pour dark mode

```css
/* Dark backgrounds */
dark:bg-gray-900   (#111827)
dark:bg-gray-800   (#1f2937)
dark:bg-gray-700   (#374151)

/* Dark text (inversé) */
dark:text-gray-100 (#f3f4f6)
dark:text-gray-200 (#e5e7eb)
dark:text-gray-300 (#d1d5db)
dark:text-gray-400 (#9ca3af)

/* Dark borders */
dark:border-gray-700 (#374151)
dark:border-gray-600 (#4b5563)

/* Dark primary (rester visible) */
dark:bg-primary-500  (#3b82f6)  /* Plus clair que primary-600 */
dark:text-primary-400 (#60a5fa) /* Plus clair pour le texte */
```

### Exemple de composant avec dark mode

```jsx
<div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
  <h3 className="text-gray-900 dark:text-gray-100 font-semibold">
    Titre
  </h3>
  <p className="text-gray-600 dark:text-gray-300 mt-2">
    Description
  </p>
  <button className="mt-4 bg-primary-600 dark:bg-primary-500 text-white hover:bg-primary-700 dark:hover:bg-primary-600 px-4 py-2 rounded-md">
    Action
  </button>
</div>
```

### Toggle dark mode

```jsx
// Hook pour gérer le dark mode
const [darkMode, setDarkMode] = useState(false);

useEffect(() => {
  if (darkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}, [darkMode]);

// Bouton toggle
<button
  onClick={() => setDarkMode(!darkMode)}
  className="p-2 rounded-md bg-gray-100 dark:bg-gray-800"
>
  {darkMode ? '🌙' : '☀️'}
</button>
```

## 4. Templates CV (6 palettes)

### Template Moderne (Bleu professionnel)

```css
Primaire : #0066cc (bleu professionnel)
Secondaire : #333333 (gris foncé)
Accent : #f5f5f5 (gris très clair)
Texte : #1a1a1a
Background : #ffffff
```

**Utilisation** : Tech, startups, profils modernes

### Template Classique (Noir & blanc)

```css
Primaire : #000000 (noir)
Secondaire : #ffffff (blanc)
Accent : #f0f0f0 (gris très clair)
Texte : #000000
Background : #ffffff
```

**Utilisation** : Finance, juridique, traditionnel

### Template Créatif (Rose & violet)

```css
Primaire : #e91e63 (rose)
Secondaire : #9c27b0 (violet)
Accent : #fce4ec (rose très clair)
Texte : #212121
Background : #ffffff
Gradient : linear-gradient(135deg, #e91e63, #9c27b0)
```

**Utilisation** : Communication, design, artistique

### Template Tech (Vert terminal)

```css
Primaire : #00ff00 (vert terminal)
Secondaire : #000000 (noir)
Accent : #001a00 (vert très foncé)
Texte : #00ff00 (vert)
Background : #000000 (noir)
Police : Consolas, monospace
```

**Utilisation** : Développeurs, IT, tech

### Template Executive (Premium)

```css
Primaire : #1a1a1a (noir profond)
Secondaire : #d4af37 (or subtil)
Accent : #f5f5f5 (gris très clair)
Texte : #1a1a1a
Background : #ffffff
Bordure : double, #1a1a1a
```

**Utilisation** : Managers, C-level, premium

### Template Minimal (Ultra épuré)

```css
Primaire : #2c3e50 (gris foncé)
Secondaire : #ecf0f1 (gris très clair)
Accent : #ffffff (blanc)
Texte : #2c3e50
Background : #ffffff
```

**Utilisation** : Architecture, UX/UI, minimalisme

## 5. Personnalisation (portfolio)

### Couleur primaire dynamique

```jsx
// L'utilisateur choisit sa couleur primaire
const [primaryColor, setPrimaryColor] = useState('#2563eb');

// Appliquer la couleur dynamiquement
<div
  style={{
    '--primary': primaryColor,
    '--primary-hover': adjustBrightness(primaryColor, -10),
    '--primary-light': adjustBrightness(primaryColor, 90)
  }}
>
  <button
    style={{
      backgroundColor: 'var(--primary)',
      color: 'white'
    }}
    onMouseEnter={(e) => {
      e.target.style.backgroundColor = 'var(--primary-hover)';
    }}
    onMouseLeave={(e) => {
      e.target.style.backgroundColor = 'var(--primary)';
    }}
  >
    Mon CTA personnalisé
  </button>
</div>

// Helper pour ajuster la luminosité
function adjustBrightness(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return `#${(0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255))
    .toString(16).slice(1).toUpperCase()}`;
}
```

### Picker de couleur

```jsx
<div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">
    Couleur primaire de votre portfolio
  </label>
  <div className="flex gap-4 items-center">
    <input
      type="color"
      value={primaryColor}
      onChange={(e) => setPrimaryColor(e.target.value)}
      className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
    />
    <input
      type="text"
      value={primaryColor}
      onChange={(e) => setPrimaryColor(e.target.value)}
      className="px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
      placeholder="#2563eb"
    />
  </div>
  <p className="text-sm text-gray-500">
    Cette couleur sera utilisée pour les CTA, liens et accents.
  </p>
</div>
```

### Palette prédéfinie (suggestions)

```jsx
const presetColors = [
  { name: 'Bleu', value: '#2563eb' },
  { name: 'Violet', value: '#9333ea' },
  { name: 'Rose', value: '#e91e63' },
  { name: 'Vert', value: '#16a34a' },
  { name: 'Orange', value: '#ea580c' },
  { name: 'Indigo', value: '#4f46e5' }
];

<div className="space-y-2">
  <p className="text-sm font-medium text-gray-700">Ou choisissez une couleur prédéfinie :</p>
  <div className="flex gap-2">
    {presetColors.map(color => (
      <button
        key={color.value}
        onClick={() => setPrimaryColor(color.value)}
        className="w-10 h-10 rounded-md border-2 hover:scale-110 transition-transform"
        style={{
          backgroundColor: color.value,
          borderColor: primaryColor === color.value ? '#000' : 'transparent'
        }}
        title={color.name}
      />
    ))}
  </div>
</div>
```

## 6. Principes de couleur

### Hiérarchie par la couleur

**Ordre de priorité** :
1. **Primary (bleu)** : CTA principal (1 par page max)
2. **Success (vert)** : Actions de validation
3. **Secondary (gris)** : Actions secondaires
4. **Danger (rouge)** : Actions destructives
5. **Ghost (transparent)** : Actions tertiaires

```jsx
// Exemple de hiérarchie sur une page
<div className="flex gap-3">
  <button className="bg-primary-600 text-white">
    Générer mon CV {/* Action principale */}
  </button>
  <button className="bg-gray-100 text-gray-800">
    Aperçu {/* Action secondaire */}
  </button>
  <button className="text-gray-600 hover:bg-gray-100">
    Annuler {/* Action tertiaire */}
  </button>
</div>
```

### Harmonie des couleurs

**Règle des 60-30-10** :
- **60%** : Couleur dominante (gris-50 pour le background)
- **30%** : Couleur secondaire (blanc pour les cards)
- **10%** : Couleur d'accent (primary-600 pour les CTA)

```jsx
// Exemple d'application de la règle
<div className="bg-gray-50 min-h-screen p-8"> {/* 60% gris clair */}
  <div className="bg-white rounded-lg shadow p-6"> {/* 30% blanc */}
    <h1 className="text-gray-900">Titre</h1>
    <p className="text-gray-600">Description...</p>
    <button className="bg-primary-600 text-white"> {/* 10% bleu */}
      Action
    </button>
  </div>
</div>
```

### Cohérence émotionnelle

| Couleur | Émotion | Usage dans Mew-mew-Ai |
|---------|---------|------------------------|
| **Bleu** | Confiance, professionnalisme | CTA, liens, primaire |
| **Vert** | Succès, validation | Messages de succès, boutons de validation |
| **Rouge** | Attention, danger | Erreurs, suppressions |
| **Jaune** | Avertissement, prudence | Alertes, infos importantes |
| **Gris** | Neutralité, calme | Texte, backgrounds, bordures |

## Checklist Couleur

Avant de valider une palette :

- [ ] **Contraste WCAG AA** : Ratio 4.5:1 minimum pour le texte normal
- [ ] **Couleurs sémantiques** : Vert = succès, rouge = erreur, jaune = warning
- [ ] **Hiérarchie claire** : 1 CTA primary par page (bleu)
- [ ] **Dark mode** : Si applicable (portfolio), vérifier les contrastes inversés
- [ ] **Accessibilité** : Ne jamais utiliser la couleur seule (+ icône/texte)
- [ ] **Cohérence** : Utiliser les tokens Tailwind (pas de couleurs hardcodées)
- [ ] **Personnalisation** : Vérifier que la couleur perso fonctionne sur tous les backgrounds

---

**Utilisation** : Référence pour choisir et appliquer les couleurs dans Mew-mew-Ai
**Dernière mise à jour** : Février 2026
