---
name: accessibilite
description: Design inclusif respectant les normes WCAG AA/AAA pour Mew-mew-Ai.
---

# Skill : Accessibilité pour Mew-mew-Ai

## Contexte du projet

Mew-mew-Ai doit être accessible à tous :
- **Utilisateurs** : Chercheurs d'emploi avec handicaps visuels, moteurs, cognitifs
- **Normes** : WCAG 2.1 niveau AA minimum (AAA si possible)
- **Technologies** : Next.js, React, Tailwind CSS
- **Outils** : Screen readers (NVDA, JAWS, VoiceOver), navigation clavier

## 1. Contrastes de couleurs (WCAG 1.4.3)

### Ratios requis

**WCAG AA (minimum)** :
- Texte normal (< 18px ou < 14px bold) : **4.5:1**
- Texte large (≥ 18px ou ≥ 14px bold) : **3:1**
- Composants UI (boutons, inputs, icônes) : **3:1**

**WCAG AAA (optimal)** :
- Texte normal : **7:1**
- Texte large : **4.5:1**

### Vérification des contrastes

**Outils** :
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Coolors Contrast Checker](https://coolors.co/contrast-checker)
- Extension Chrome : **axe DevTools**
- Extension Chrome : **WAVE Evaluation Tool**

### Combinaisons sûres pour Mew-mew-Ai

#### Texte sur fond blanc

| Couleur | Ratio | WCAG AA | WCAG AAA | Usage |
|---------|-------|---------|----------|-------|
| `text-gray-900` (#111827) | 21:1 | ✅ | ✅ | Titres |
| `text-gray-800` (#1f2937) | 16.5:1 | ✅ | ✅ | Texte principal |
| `text-gray-700` (#374151) | 12.6:1 | ✅ | ✅ | Texte accentué |
| `text-gray-600` (#4b5563) | 8.6:1 | ✅ | ✅ | Texte secondaire |
| `text-gray-500` (#6b7280) | 5.7:1 | ✅ | ❌ | Texte tertiaire |
| `text-gray-400` (#9ca3af) | 2.8:1 | ❌ | ❌ | **Interdit** (placeholders seulement) |
| `text-primary-600` (#2563eb) | 4.6:1 | ✅ | ❌ | Liens |

#### Texte blanc sur fond coloré

| Background | Ratio | WCAG AA | Usage |
|------------|-------|---------|-------|
| `bg-primary-600` (#2563eb) | 4.6:1 | ✅ | Boutons primaires |
| `bg-primary-700` (#1d4ed8) | 6.2:1 | ✅ | Boutons hover |
| `bg-green-600` (#16a34a) | 4.1:1 | ✅ | Boutons success |
| `bg-red-600` (#dc2626) | 5.1:1 | ✅ | Boutons danger |
| `bg-gray-600` (#4b5563) | 8.6:1 | ✅ | Boutons neutres |

### Code examples

```jsx
// ✅ Bon : contraste suffisant (4.6:1)
<p className="text-primary-600">
  Ce texte est lisible (bleu sur blanc).
</p>

// ❌ Mauvais : contraste insuffisant (2.8:1)
<p className="text-gray-400">
  Ce texte est illisible (trop clair).
</p>

// ✅ Bon : placeholder avec aria-label
<input
  type="text"
  placeholder="Prénom"
  aria-label="Prénom"
  className="placeholder:text-gray-400" // Placeholder peut être clair
/>
```

### Erreurs fréquentes

```jsx
// ❌ Mauvais : texte gris clair sur fond gris
<div className="bg-gray-100">
  <p className="text-gray-400">Illisible (1.5:1)</p>
</div>

// ✅ Bon : texte foncé sur fond clair
<div className="bg-gray-100">
  <p className="text-gray-700">Lisible (9.1:1)</p>
</div>

// ❌ Mauvais : icône seule sans label
<button className="p-2">
  <svg className="w-5 h-5 text-gray-400" /> {/* Ratio insuffisant */}
</button>

// ✅ Bon : icône + texte ou aria-label
<button className="p-2" aria-label="Supprimer">
  <svg className="w-5 h-5 text-gray-600" /> {/* Ratio OK */}
</button>
```

## 2. Navigation au clavier (WCAG 2.1.1)

### Règles fondamentales

**Tous les éléments interactifs doivent être accessibles au clavier** :
- Boutons : `<button>` natif
- Liens : `<a href>`
- Inputs : `<input>`, `<textarea>`, `<select>`
- Éléments custom : `tabIndex={0}` + `onKeyDown`

### Ordre de tabulation logique

**Principe** : L'ordre de tabulation (Tab) doit suivre l'ordre visuel

```jsx
// ✅ Bon : ordre logique
<form>
  <input id="firstname" /> {/* Tab 1 */}
  <input id="lastname" />  {/* Tab 2 */}
  <button type="submit">Valider</button> {/* Tab 3 */}
</form>

// ❌ Mauvais : tabindex manuel (éviter)
<form>
  <input tabIndex={3} /> {/* Confus */}
  <input tabIndex={1} />
  <button tabIndex={2}>Valider</button>
</form>
```

### Focus visible (WCAG 2.4.7)

**Obligatoire** : Le focus doit toujours être visible

```jsx
// ✅ Bon : focus ring visible
<button className="bg-primary-600 text-white px-6 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
  Valider
</button>

// ❌ Mauvais : focus supprimé
<button className="outline-none">
  Valider {/* Inaccessible au clavier */}
</button>
```

### Gestion des événements clavier

**Éléments custom** : Simuler le comportement natif

```jsx
// ✅ Bon : div interactive accessible au clavier
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
  className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md p-4"
>
  Cliquez-moi
</div>

// ❌ Mauvais : div non accessible
<div onClick={handleClick} className="cursor-pointer">
  Cliquez-moi {/* Inaccessible au clavier */}
</div>
```

### Skip links (WCAG 2.4.1)

**Principe** : Permettre de sauter la navigation répétitive

```jsx
// Layout global avec skip link
<body>
  {/* Skip link (invisible jusqu'au focus) */}
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-600 text-white px-4 py-2 rounded-md z-50"
  >
    Aller au contenu principal
  </a>

  <header>
    {/* Navigation */}
  </header>

  <main id="main-content">
    {/* Contenu principal */}
  </main>
</body>
```

### Modal et focus trap

**Principe** : Le focus doit rester dans la modal jusqu'à sa fermeture

```jsx
import { useEffect, useRef } from 'react';

function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Sauvegarder l'élément actif
      const previousActiveElement = document.activeElement;

      // Focus sur le premier élément focusable de la modal
      const firstFocusable = modalRef.current.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      firstFocusable?.focus();

      // Restaurer le focus à la fermeture
      return () => {
        previousActiveElement?.focus();
      };
    }
  }, [isOpen]);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }

    if (e.key === 'Tab') {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onKeyDown={handleKeyDown}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
      >
        {children}
      </div>
    </div>
  );
}
```

## 3. Screen readers (lecteurs d'écran)

### Labels explicites (WCAG 1.3.1)

**Tous les inputs doivent avoir un label**

```jsx
// ✅ Bon : label visible
<div className="space-y-2">
  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
    Email
  </label>
  <input
    id="email"
    type="email"
    className="w-full px-4 py-2.5 border border-gray-300 rounded-md"
  />
</div>

// ✅ Bon : label invisible (sr-only) mais présent
<div>
  <label htmlFor="search" className="sr-only">
    Rechercher
  </label>
  <input
    id="search"
    type="search"
    placeholder="Rechercher..."
    className="w-full px-4 py-2.5 border border-gray-300 rounded-md"
  />
</div>

// ❌ Mauvais : pas de label
<input type="email" placeholder="Email" />
```

### Alt texts pour les images (WCAG 1.1.1)

**Toutes les images doivent avoir un alt**

```jsx
// ✅ Bon : alt descriptif
<Image
  src="/images/hero.jpg"
  alt="Personne travaillant sur son CV sur un ordinateur portable"
  width={1200}
  height={800}
/>

// ✅ Bon : alt vide pour image décorative
<Image
  src="/images/decoration.svg"
  alt="" {/* Image purement décorative */}
  width={100}
  height={100}
/>

// ❌ Mauvais : pas d'alt
<img src="/images/hero.jpg" />

// ❌ Mauvais : alt non descriptif
<img src="/images/hero.jpg" alt="image" />
```

### Boutons et liens accessibles

```jsx
// ✅ Bon : texte visible
<button className="bg-primary-600 text-white px-6 py-2.5 rounded-md">
  Générer mon CV
</button>

// ✅ Bon : aria-label pour bouton icône seule
<button
  aria-label="Supprimer le portfolio"
  className="p-2 text-red-600 hover:bg-red-50 rounded-md"
>
  <TrashIcon className="w-5 h-5" />
</button>

// ❌ Mauvais : icône sans label
<button className="p-2">
  <TrashIcon className="w-5 h-5" />
</button>

// ✅ Bon : lien explicite
<a href="/solutions/analyse-cv" className="text-primary-600 hover:underline">
  En savoir plus sur l'analyseur de CV
</a>

// ❌ Mauvais : "cliquez ici"
<a href="/solutions/analyse-cv">Cliquez ici</a>
```

### Formulaires accessibles

```jsx
// ✅ Bon : formulaire complet avec aria
<form onSubmit={handleSubmit}>
  <div className="space-y-2">
    <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
      Prénom *
    </label>
    <input
      id="firstname"
      type="text"
      required
      aria-required="true"
      aria-invalid={errors.firstname ? 'true' : 'false'}
      aria-describedby={errors.firstname ? 'firstname-error' : 'firstname-help'}
      className={`w-full px-4 py-2.5 border rounded-md ${
        errors.firstname ? 'border-red-500' : 'border-gray-300'
      }`}
    />
    <p id="firstname-help" className="text-sm text-gray-500">
      Entrez votre prénom tel qu'il apparaît sur vos documents.
    </p>
    {errors.firstname && (
      <p id="firstname-error" className="text-sm text-red-600" role="alert">
        {errors.firstname}
      </p>
    )}
  </div>

  <button
    type="submit"
    disabled={isSubmitting}
    aria-busy={isSubmitting}
    className="mt-6 bg-primary-600 text-white px-6 py-2.5 rounded-md disabled:opacity-50"
  >
    {isSubmitting ? 'Envoi en cours...' : 'Valider'}
  </button>
</form>
```

## 4. ARIA (Accessible Rich Internet Applications)

### Quand utiliser ARIA

**Principe** : "No ARIA is better than bad ARIA"

**Utiliser ARIA quand** :
- HTML natif ne suffit pas (composants custom)
- Besoin d'indiquer un état dynamique
- Créer une relation entre éléments

**Ne PAS utiliser ARIA quand** :
- Un élément HTML natif existe (`<button>` au lieu de `<div role="button">`)

### Rôles ARIA

```jsx
// ✅ Bon : utiliser l'élément HTML natif
<button onClick={handleClick}>Cliquer</button>

// ❌ Mauvais : div avec role="button" (redondant)
<div role="button" onClick={handleClick}>Cliquer</div>

// ✅ Bon : role nécessaire pour composant custom
<div
  role="tablist"
  aria-label="Solutions Mew-mew-Ai"
  className="flex border-b border-gray-200"
>
  <button
    role="tab"
    aria-selected={activeTab === 'analyse'}
    aria-controls="panel-analyse"
    onClick={() => setActiveTab('analyse')}
    className={activeTab === 'analyse' ? 'border-b-2 border-primary-600' : ''}
  >
    Analyse
  </button>
  <button
    role="tab"
    aria-selected={activeTab === 'optimise'}
    aria-controls="panel-optimise"
    onClick={() => setActiveTab('optimise')}
  >
    Optimisation
  </button>
</div>

<div id="panel-analyse" role="tabpanel" aria-labelledby="tab-analyse" hidden={activeTab !== 'analyse'}>
  {/* Contenu analyse */}
</div>
```

### États ARIA

```jsx
// ✅ Bon : indiquer les états dynamiques
<button
  aria-expanded={isOpen}
  aria-controls="dropdown-menu"
  onClick={() => setIsOpen(!isOpen)}
>
  Menu {isOpen ? '▲' : '▼'}
</button>

<div id="dropdown-menu" hidden={!isOpen}>
  {/* Contenu du menu */}
</div>

// ✅ Bon : loading state
<button disabled={isLoading} aria-busy={isLoading}>
  {isLoading ? 'Chargement...' : 'Générer mon CV'}
</button>

// ✅ Bon : erreur live
<div role="alert" aria-live="assertive" className="bg-red-50 p-4">
  <p className="text-red-800">Le fichier doit être un PDF de moins de 2 Mo.</p>
</div>
```

### aria-live regions

**Principe** : Annoncer les changements dynamiques aux screen readers

```jsx
// ✅ Bon : notification de succès
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
  className={`fixed bottom-4 right-4 bg-green-50 border border-green-200 rounded-lg p-4 ${
    showToast ? 'block' : 'hidden'
  }`}
>
  <p className="text-green-800">CV généré avec succès !</p>
</div>

// ✅ Bon : erreur critique
<div
  role="alert"
  aria-live="assertive"
  className={`bg-red-50 p-4 ${showError ? 'block' : 'hidden'}`}
>
  <p className="text-red-800">Une erreur s'est produite.</p>
</div>
```

## 5. Cas d'usage spécifiques Mew-mew-Ai

### Upload de fichier accessible

```jsx
<div className="space-y-4">
  <label htmlFor="cv-upload" className="block text-sm font-medium text-gray-700">
    Télécharger votre CV (PDF, max 2 Mo)
  </label>
  <input
    id="cv-upload"
    type="file"
    accept=".pdf"
    onChange={handleFileChange}
    aria-describedby="cv-upload-help"
    className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary-600 file:text-white hover:file:bg-primary-700"
  />
  <p id="cv-upload-help" className="text-sm text-gray-500">
    Formats acceptés : PDF. Taille maximale : 2 Mo.
  </p>
  {uploadError && (
    <p role="alert" className="text-sm text-red-600">
      {uploadError}
    </p>
  )}
</div>
```

### Sélecteur de template CV accessible

```jsx
<fieldset className="space-y-4">
  <legend className="text-lg font-semibold text-gray-900">
    Choisissez un template de CV
  </legend>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {templates.map(template => (
      <div key={template.id}>
        <input
          type="radio"
          id={`template-${template.id}`}
          name="cv-template"
          value={template.id}
          checked={selectedTemplate === template.id}
          onChange={() => setSelectedTemplate(template.id)}
          className="sr-only peer"
        />
        <label
          htmlFor={`template-${template.id}`}
          className="block border-2 rounded-lg p-4 cursor-pointer peer-checked:border-primary-600 peer-checked:bg-primary-50 peer-focus:ring-2 peer-focus:ring-primary-500 peer-focus:ring-offset-2"
        >
          <img
            src={template.preview}
            alt={`Aperçu du template ${template.name}`}
            className="w-full h-48 object-cover rounded mb-2"
          />
          <h3 className="font-semibold text-gray-900">{template.name}</h3>
          <p className="text-sm text-gray-600">{template.description}</p>
        </label>
      </div>
    ))}
  </div>
</fieldset>
```

### Éditeur de portfolio accessible

```jsx
<div className="space-y-4" role="region" aria-label="Blocs du portfolio">
  {blocks.map((block, index) => (
    <div
      key={block.id}
      className="bg-white border-2 border-gray-200 rounded-lg p-4"
      role="article"
      aria-label={`Bloc ${index + 1} : ${block.type}`}
    >
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-900">{block.type}</h3>
        <div className="flex gap-2">
          <button
            aria-label={`Éditer le bloc ${block.type}`}
            onClick={() => handleEdit(block.id)}
            className="p-2 text-primary-600 hover:bg-primary-50 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <PencilIcon className="w-5 h-5" />
          </button>
          <button
            aria-label={`Supprimer le bloc ${block.type}`}
            onClick={() => handleDelete(block.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  ))}
</div>
```

## 6. Tests d'accessibilité

### Outils de test

**Automatiques** :
- **axe DevTools** (extension Chrome/Firefox)
- **WAVE** (extension Chrome/Firefox)
- **Lighthouse** (intégré à Chrome DevTools)
- **Pa11y** (CLI)

**Manuels** :
- **Navigation clavier** : Tab, Shift+Tab, Enter, Espace, Échap
- **Screen reader** : NVDA (Windows), JAWS (Windows), VoiceOver (Mac)
- **Zoom** : Tester à 200% de zoom (WCAG 1.4.4)

### Checklist de tests

**Avant chaque release** :

- [ ] **Contrastes** : Tous les textes ≥ 4.5:1 (axe DevTools)
- [ ] **Keyboard** : Tous les éléments interactifs accessibles au Tab
- [ ] **Focus visible** : Le focus est toujours visible
- [ ] **Labels** : Tous les inputs ont un label (visible ou sr-only)
- [ ] **Alt texts** : Toutes les images ont un alt (descriptif ou vide)
- [ ] **ARIA** : Pas d'erreurs ARIA (axe DevTools)
- [ ] **Formulaires** : aria-invalid, aria-required, aria-describedby
- [ ] **Modals** : Focus trap, Échap pour fermer
- [ ] **Skip links** : Présent et fonctionnel
- [ ] **Zoom** : Pas de dépassement horizontal à 200%

### Tests avec screen reader

**Exemple de scénario** (VoiceOver sur Mac) :

1. **Activer VoiceOver** : Cmd+F5
2. **Naviguer** : Tab, flèches, Ctrl+Option+flèches
3. **Lire** : Ctrl+Option+A (tout lire)
4. **Vérifier** :
   - Les titres sont bien annoncés (h1, h2, h3)
   - Les labels des inputs sont lus
   - Les boutons ont un texte clair
   - Les erreurs sont annoncées (role="alert")

## Checklist Accessibilité

Avant de valider une fonctionnalité :

- [ ] **Contrastes WCAG AA** : Texte ≥ 4.5:1, UI ≥ 3:1
- [ ] **Navigation clavier** : Tous les éléments interactifs accessibles
- [ ] **Focus visible** : Ring de focus toujours visible
- [ ] **Labels** : Tous les inputs labellisés (htmlFor + id)
- [ ] **Alt texts** : Toutes les images avec alt (descriptif ou vide)
- [ ] **Sémantique HTML** : Utiliser les bonnes balises (button, a, header, main, nav)
- [ ] **ARIA minimal** : Seulement si nécessaire (pas de redondance)
- [ ] **Erreurs live** : role="alert" pour les messages critiques
- [ ] **Modals** : Focus trap, Échap, restauration du focus
- [ ] **Tests auto** : axe DevTools, Lighthouse (score ≥ 90)

---

**Utilisation** : Référence pour garantir l'accessibilité de Mew-mew-Ai (WCAG AA minimum)
**Dernière mise à jour** : Février 2026
