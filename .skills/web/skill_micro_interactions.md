---
name: micro interactions
description: Conception de micro-interactions améliorant l'expérience.
---

# Skill : Micro-Interactions

## Description

Les micro-interactions sont les **petits détails animés** qui rendent une interface **vivante et engageante**. Sur Mew-mew-Ai, elles servent à :
- **Feedback immédiat** (hover, clic, validation)
- **Guide visuel** (attention sur CTA, progression)
- **Plaisir d'usage** (l'interface est agréable, pas robotique)
- **Réassurance** (l'utilisateur sait que ça fonctionne)

## Analogie

Les micro-interactions, c'est comme les **détails d'une voiture de luxe** :
- **Clignotant sonore** = Feedback auditif (micro-interaction)
- **Démarrage progressif du moteur** = Animation fluide
- **Vibration du volant** = Retour haptique
- **Éclairage d'ambiance** = Transition de couleur

Une voiture sans ces détails fonctionne, mais l'**expérience est fade**.

## Anatomie d'une micro-interaction

**Modèle de Dan Saffer** (4 composantes) :

1. **Trigger** (déclencheur) : L'action qui lance l'interaction (hover, clic, scroll)
2. **Rules** (règles) : Ce qui se passe (changement de couleur, animation)
3. **Feedback** (retour) : Ce que l'utilisateur perçoit (visuel, sonore)
4. **Loops & Modes** (boucles) : Répétition ou variation (loading infini, étapes)

**Exemple : Bouton "Analyser mon CV"**

```
Trigger  : Utilisateur clique
Rules    : Bouton change de couleur, texte devient "Analyse en cours...", spinner apparaît
Feedback : Visuel (spinner), textuel (message), disabled (pas de re-clic)
Loops    : Spinner tourne en boucle jusqu'à réponse API
```

## Types de micro-interactions

### 1. Hover states (survol souris)

**Objectif** : Indiquer qu'un élément est cliquable.

```jsx
// Bouton avec hover
<button className="
  bg-primary text-white
  hover:bg-primary-hover          // Couleur change
  hover:scale-105                 // Grossit légèrement
  transition-all duration-200     // Animation fluide
">
  Analyser mon CV
</button>

// Link avec underline animé
<a className="
  text-primary
  underline decoration-transparent
  hover:decoration-primary        // Underline apparaît
  transition-all duration-300
">
  En savoir plus
</a>

// Card avec shadow
<div className="
  bg-white border border-gray-200
  hover:shadow-lg                 // Ombre apparaît
  hover:border-primary            // Bordure change
  hover:-translate-y-1            // Monte légèrement
  transition-all duration-300
  cursor-pointer
">
  Portfolio
</div>
```

### 2. Loading states (chargement)

**Objectif** : Rassurer l'utilisateur pendant le traitement.

```jsx
// Spinner simple
<button disabled className="
  bg-primary text-white
  flex items-center gap-2
  opacity-75 cursor-not-allowed
">
  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
  Analyse en cours...
</button>

// Skeleton screens (mieux que spinner seul)
<div className="animate-pulse space-y-4">
  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
  <div className="h-4 bg-gray-200 rounded w-full"></div>
  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
</div>

// Progress bar
<div className="w-full bg-gray-200 rounded-full h-2">
  <div
    className="bg-primary h-2 rounded-full transition-all duration-500"
    style={{ width: `${progress}%` }}
  />
</div>
```

### 3. Success/Error feedback (validation)

**Objectif** : Confirmer le succès ou signaler l'erreur.

```jsx
// Success message avec animation
<div className="
  bg-success/10 border border-success text-success
  px-4 py-3 rounded-lg
  animate-in slide-in-from-top-2 fade-in
  flex items-center gap-3
">
  <svg className="w-6 h-6 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
  </svg>
  CV analysé avec succès !
</div>

// Error shake animation
<div className="
  bg-error/10 border border-error text-error
  px-4 py-3 rounded-lg
  animate-shake
">
  Erreur lors de l'upload
</div>

// CSS shake (à ajouter dans globals.css)
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
}

.animate-shake {
  animation: shake 0.5s;
}
```

### 4. Focus states (navigation clavier)

**Objectif** : Accessibilité (utilisateurs au clavier).

```jsx
// Input avec focus visible
<input className="
  border border-gray-300
  focus:outline-none
  focus:ring-2 focus:ring-primary/50   // Ring bleu
  focus:border-primary                 // Bordure bleue
  transition-all
" />

// Bouton avec focus
<button className="
  bg-primary text-white
  focus:outline-none
  focus:ring-4 focus:ring-primary/30   // Ring large
  focus:ring-offset-2                  // Espace autour
">
  Valider
</button>
```

### 5. Transitions de page (Next.js)

**Objectif** : Fluidité entre les pages.

```jsx
// app/layout.js (animation globale)
import { motion, AnimatePresence } from 'framer-motion';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </body>
    </html>
  );
}
```

### 6. Toggle/Switch animés

**Objectif** : Feedback visuel sur changement d'état.

```jsx
// Toggle dark mode
const [darkMode, setDarkMode] = useState(false);

<button
  onClick={() => setDarkMode(!darkMode)}
  className={`
    relative w-14 h-8 rounded-full
    transition-colors duration-300
    ${darkMode ? 'bg-primary' : 'bg-gray-300'}
  `}
>
  <span className={`
    absolute top-1 left-1
    w-6 h-6 bg-white rounded-full
    transition-transform duration-300
    ${darkMode ? 'translate-x-6' : 'translate-x-0'}
  `} />
</button>
```

### 7. Notifications/Toasts

**Objectif** : Feedback non intrusif.

```jsx
// Toast avec auto-dismiss
import { useState, useEffect } from 'react';

export function Toast({ message, type = 'info', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // 3 secondes
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'bg-success text-white',
    error: 'bg-error text-white',
    info: 'bg-primary text-white',
  };

  return (
    <div className={`
      ${styles[type]}
      px-6 py-4 rounded-lg shadow-lg
      fixed bottom-4 right-4
      animate-in slide-in-from-bottom-2 fade-in
      z-50
    `}>
      <div className="flex items-center gap-3">
        <span>{message}</span>
        <button onClick={onClose} className="text-white/80 hover:text-white">
          ✕
        </button>
      </div>
    </div>
  );
}

// Usage
const [showToast, setShowToast] = useState(false);

{showToast && (
  <Toast
    message="Portfolio sauvegardé"
    type="success"
    onClose={() => setShowToast(false)}
  />
)}
```

### 8. Parallax scroll (effet de profondeur)

**Objectif** : Dynamisme sur la landing page.

```jsx
'use client';

import { useEffect, useState } from 'react';

export default function ParallaxHero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background bouge lentement */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-primary to-secondary"
        style={{ transform: `translateY(${scrollY * 0.5}px)` }}
      />

      {/* Contenu bouge normalement */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <h1 className="text-6xl font-bold text-white">
          Mew - L'IA qui vous propulse
        </h1>
      </div>
    </div>
  );
}
```

### 9. Drag & Drop (upload fichiers)

**Objectif** : Upload intuitif.

```jsx
'use client';

import { useState } from 'react';

export default function FileUploader() {
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    console.log('Fichier uploadé:', file);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`
        border-2 border-dashed rounded-xl
        p-12 text-center
        transition-all duration-300
        ${dragging
          ? 'border-primary bg-primary/5 scale-105'
          : 'border-gray-300 bg-gray-50'}
      `}
    >
      <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
      <p className="text-lg font-medium text-gray-700 mb-2">
        Glissez votre CV ici
      </p>
      <p className="text-sm text-gray-500">
        ou cliquez pour parcourir (max 2 Mo)
      </p>
    </div>
  );
}
```

### 10. Count-up animation (statistiques)

**Objectif** : Attirer l'attention sur les chiffres.

```jsx
'use client';

import { useEffect, useState, useRef } from 'react';

export function CountUp({ end, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const startRef = useRef(null);

  useEffect(() => {
    let startTime;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration]);

  return <span>{count.toLocaleString()}</span>;
}

// Usage (landing page)
<div className="text-center">
  <p className="text-5xl font-bold text-primary">
    <CountUp end={10000} />+
  </p>
  <p className="text-gray-600">
    CV analysés
  </p>
</div>
```

## Librairies recommandées

### Framer Motion (animations React)

```bash
npm install framer-motion
```

**Exemple** :
```jsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Contenu animé
</motion.div>
```

### Headless UI (composants accessibles)

```bash
npm install @headlessui/react
```

**Exemple (Transition)** :
```jsx
import { Transition } from '@headlessui/react';

<Transition
  show={isOpen}
  enter="transition-opacity duration-300"
  enterFrom="opacity-0"
  enterTo="opacity-100"
  leave="transition-opacity duration-300"
  leaveFrom="opacity-100"
  leaveTo="opacity-0"
>
  Contenu
</Transition>
```

### React Hot Toast (notifications)

```bash
npm install react-hot-toast
```

**Exemple** :
```jsx
import toast, { Toaster } from 'react-hot-toast';

// Dans layout.js
<Toaster position="bottom-right" />

// Utilisation
toast.success('Portfolio publié !');
toast.error('Erreur lors de l\'upload');
```

## Checklist pratique

### ✅ Hover states

- [ ] Tous les boutons ont un hover visible (couleur, scale, shadow)
- [ ] Tous les liens ont un hover (underline, couleur)
- [ ] Toutes les cards ont un hover (shadow, bordure, translate-y)
- [ ] Curseur pointer sur tous les cliquables (`cursor-pointer`)

### ✅ Loading states

- [ ] Spinner sur actions asynchrones (analyse CV, upload)
- [ ] Skeleton screens pendant chargement de listes
- [ ] Progress bar si progression mesurable
- [ ] Message rassurant ("Analyse en cours...")

### ✅ Feedback

- [ ] Success message après action (vert, checkmark)
- [ ] Error message après échec (rouge, croix, shake)
- [ ] Disabled state sur boutons pendant traitement
- [ ] Tooltip sur icônes (au hover)

### ✅ Focus states

- [ ] Ring visible sur tous les inputs/boutons (accessibilité)
- [ ] Contraste suffisant (ring-2 ring-primary/50)
- [ ] Focus trap dans modales (Escape pour fermer)

### ✅ Transitions

- [ ] `transition-all duration-200` sur hover/focus
- [ ] Animations fluides (pas de saccades)
- [ ] Pas d'animations trop longues (>500ms = trop lent)
- [ ] Respect `prefers-reduced-motion` (accessibilité)

### ✅ Animations

- [ ] Entrée de page (fade-in, slide-in)
- [ ] Apparition de modales (zoom-in, fade-in)
- [ ] Toast notifications (slide-in-from-bottom)
- [ ] Count-up sur chiffres importants

### ✅ Performance

- [ ] Animations GPU-accélérées (transform, opacity)
- [ ] Pas d'animations sur width/height (lent)
- [ ] `will-change` uniquement si nécessaire
- [ ] Débounce sur scroll events (parallax)

## Erreurs à éviter

### ❌ Animations trop lentes

```jsx
// ❌ MAUVAIS : 2 secondes = trop lent
<button className="transition-all duration-2000">
  Hover me
</button>

// ✅ BON : 200-300ms = fluide
<button className="transition-all duration-200">
  Hover me
</button>
```

### ❌ Pas de feedback sur actions longues

```jsx
// ❌ MAUVAIS : Utilisateur ne sait pas si ça marche
<button onClick={analyzeCV}>
  Analyser
</button>

// ✅ BON : Feedback visuel
<button onClick={analyzeCV} disabled={loading}>
  {loading ? (
    <>
      <Spinner /> Analyse en cours...
    </>
  ) : (
    'Analyser'
  )}
</button>
```

### ❌ Animations sur propriétés lentes

```jsx
// ❌ MAUVAIS : width/height = reflow (lent)
<div className="transition-all hover:w-full">
  Slow
</div>

// ✅ BON : transform = GPU-accéléré (rapide)
<div className="transition-transform hover:scale-105">
  Fast
</div>
```

### ❌ Pas de respect de prefers-reduced-motion

```jsx
// ❌ MAUVAIS : Force les animations (accessibilité)
<div className="animate-bounce">
  Bounce forever
</div>

// ✅ BON : Désactive si demandé
<div className="motion-safe:animate-bounce">
  Bounce (sauf si prefers-reduced-motion)
</div>
```

## Ressources

### Librairies
- [Framer Motion](https://www.framer.com/motion/) - Animations React
- [Headless UI](https://headlessui.com/) - Composants accessibles
- [React Hot Toast](https://react-hot-toast.com/) - Notifications
- [React Spring](https://www.react-spring.dev/) - Animations physiques

### Inspiration
- [Dribbble](https://dribbble.com/tags/micro-interactions) - Micro-interactions design
- [Awwwards](https://www.awwwards.com/) - Sites avec animations soignées
- [CodePen](https://codepen.io/search/pens?q=micro+interactions) - Exemples interactifs

### Tutorials
- [CSS-Tricks Animations](https://css-tricks.com/almanac/properties/a/animation/)
- [MDN Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)

---

**Prochaines étapes** : Documenter l'identité visuelle web pour garantir la cohérence de marque.
