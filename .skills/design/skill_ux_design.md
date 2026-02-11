---
name: UX design
description: Optimisation de l'expérience utilisateur basée sur les usages réels de Mew-mew-Ai.
---

# Skill : UX Design pour Mew-mew-Ai

## Contexte du projet

Mew-mew-Ai est une plateforme SaaS avec plusieurs parcours utilisateurs complexes :
- **Onboarding** : Inscription → Dashboard → Première utilisation
- **Analyse CV** : Upload PDF ou formulaire → Résultats → Actions
- **Optimisation CV** : Formulaire/PDF → Suggestions → Génération PDF
- **Portfolio Pro** : Création → Édition (blocs) → Publication → Partage
- **Page publique portfolio** : Visite → Contact → Conversion

## Objectifs UX pour Mew-mew-Ai

1. **Réduire la friction** : Moins de clics, moins de confusion
2. **Feedback immédiat** : L'utilisateur sait toujours où il est et ce qui se passe
3. **Parcours guidés** : Pas de choix inutiles, étapes claires
4. **Récupération d'erreur** : Messages clairs, actions correctives
5. **Accessibilité** : Utilisable par tous (clavier, lecteur d'écran)

## 1. User Flows (parcours utilisateurs)

### Flow 1 : Inscription et premier CV

```
[Landing page]
      |
      v
[Clic "S'inscrire"]
      |
      v
[Formulaire inscription] (email + mot de passe)
      |
      v
[Vérification email] (optionnel)
      |
      v
[Dashboard] → Affiche les 3 solutions principales
      |
      v
[Clic "Analyser mon CV"]
      |
      +--- [Choix] : Formulaire ou PDF ?
      |           |
      |           +---> [Upload PDF] → Extraction → Analyse n8n → Résultats
      |           |
      |           +---> [Formulaire] → Remplissage (4 étapes) → Analyse n8n → Résultats
      |
      v
[Résultats analyse] → Métiers recommandés
      |
      +---> [Action suivante] : Optimiser le CV ou Générer un PDF ?
```

**Points de friction à éviter** :
- ❌ Demander trop d'infos à l'inscription (juste email + mdp)
- ❌ Forcer la vérification d'email avant d'accéder au dashboard
- ❌ Ne pas expliquer la différence formulaire vs PDF
- ❌ Ne pas proposer d'action claire après l'analyse

**Améliorations UX** :
- ✅ Montrer un aperçu des résultats possibles sur la landing page
- ✅ Guider avec une progress bar (étape 1/4)
- ✅ Proposer un CTA clair après l'analyse : "Optimiser mon CV maintenant"
- ✅ Permettre de sauvegarder le brouillon (localStorage)

### Flow 2 : Création et publication d'un portfolio

```
[Dashboard]
      |
      v
[Clic "Créer un portfolio"]
      |
      v
[Modal création] (titre + template)
      |
      v
[Éditeur vide] → Affiche un tutoriel contextuel
      |
      v
[Ajout de blocs] (hero, texte, image, projets, etc.)
      |
      +---> [Édition bloc par bloc] → Prévisualisation en temps réel
      |
      v
[Personnalisation] (couleur primaire, dark mode)
      |
      v
[Publication] → Génère le slug `/p/mon-portfolio`
      |
      v
[Page de succès] → QR code + lien à copier + bouton "Partager"
```

**Points de friction à éviter** :
- ❌ Éditeur vide sans guidance (l'utilisateur ne sait pas quoi faire)
- ❌ Trop d'options de blocs (paralysie du choix)
- ❌ Pas de prévisualisation avant publication
- ❌ Pas d'action claire après publication

**Améliorations UX** :
- ✅ Afficher un template pré-rempli (exemple) que l'utilisateur peut éditer
- ✅ Tutoriel interactif : "Ajoute d'abord un bloc Hero pour présenter ton profil"
- ✅ Prévisualisation en temps réel (split-screen éditeur/preview)
- ✅ Checklist avant publication : "✓ Titre, ✓ Au moins 1 bloc, ✓ Image de profil"
- ✅ Page de succès avec QR code, lien à copier, stats de vues

### Flow 3 : Visite d'un portfolio public

```
[URL /p/mon-portfolio] (partage sur LinkedIn, CV, etc.)
      |
      v
[Page publique] → Chargement rapide, design pro
      |
      +---> [Lecture des blocs] (scroll fluide)
      |
      +---> [Clic CTA] : "Me contacter"
      |           |
      |           v
      |     [Formulaire de contact] → Email envoyé au propriétaire
      |
      +---> [QR code en footer] (pour partager à nouveau)
```

**Points de friction à éviter** :
- ❌ Temps de chargement long (images non optimisées)
- ❌ Pas de CTA clair (l'utilisateur ne sait pas quoi faire)
- ❌ Formulaire de contact trop long
- ❌ Pas de feedback après envoi du formulaire

**Améliorations UX** :
- ✅ Optimiser les images (next/image, lazy loading)
- ✅ CTA fixe en bas : "Contactez-moi" (sticky button)
- ✅ Formulaire minimaliste : nom, email, message (3 champs)
- ✅ Toast de succès : "Message envoyé ! Je vous réponds sous 48h."
- ✅ Compteur de vues visible pour le propriétaire uniquement

## 2. Wireframes (croquis basse fidélité)

### Dashboard (vue d'ensemble)

```
+--------------------------------------------------------------+
|  Logo Mew-mew-Ai          [Profil] [Déconnexion]            |
+--------------------------------------------------------------+
|                                                              |
|  Bonjour, [Prénom] 👋                                        |
|  Bienvenue sur votre tableau de bord                         |
|                                                              |
|  +------------------+  +------------------+  +--------------+|
|  |  📄 Analyser CV  |  |  ✨ Optimiser CV |  | 🎨 Portfolio ||
|  |                  |  |                  |  |              ||
|  |  Identifiez les  |  |  Améliorez votre |  | Créez votre  ||
|  |  métiers qui     |  |  CV pour les ATS |  | portfolio    ||
|  |  matchent        |  |                  |  | professionnel||
|  |                  |  |                  |  |              ||
|  |  [Commencer →]   |  |  [Commencer →]   |  | [Créer →]    ||
|  +------------------+  +------------------+  +--------------+|
|                                                              |
|  Mes portfolios (2)                                          |
|  +-------------------------+  +---------------------------+  |
|  | Portfolio Pro 🌙        |  | Portfolio Perso           |  |
|  | 👁 123 vues             |  | 👁 45 vues                |  |
|  | [Éditer] [Voir]         |  | [Éditer] [Voir]           |  |
|  +-------------------------+  +---------------------------+  |
|                                                              |
+--------------------------------------------------------------+
```

### Formulaire d'analyse CV (étape 1/4)

```
+--------------------------------------------------------------+
|  [← Retour]               Analyser mon CV                    |
+--------------------------------------------------------------+
|                                                              |
|  Étape 1 sur 4 : Informations personnelles                   |
|  [████████████░░░░░░░░░░░░░░░░] 25%                          |
|                                                              |
|  +----------------------------------------------------------+|
|  |                                                          ||
|  |  Prénom *                                                ||
|  |  [________________]                                      ||
|  |                                                          ||
|  |  Nom *                                                   ||
|  |  [________________]                                      ||
|  |                                                          ||
|  |  Email *                                                 ||
|  |  [________________]                                      ||
|  |                                                          ||
|  |  Téléphone                                               ||
|  |  [________________]                                      ||
|  |                                                          ||
|  |  Titre du poste recherché *                              ||
|  |  [________________]                                      ||
|  |                                                          ||
|  +----------------------------------------------------------+|
|                                                              |
|                              [Annuler]  [Suivant →]          |
|                                                              |
+--------------------------------------------------------------+
```

### Éditeur de portfolio (split-screen)

```
+--------------------------------------------------------------+
|  [← Retour]   Mon Portfolio Pro      [Paramètres] [Publier] |
+--------------------------------------------------------------+
|                        |                                     |
|  BLOCS                 |  APERÇU                             |
|                        |                                     |
|  +------------------+  |  +-------------------------------+  |
|  | 🎨 Hero          |  |  |  [Photo profil]               |  |
|  | [✏️ Éditer] [🗑️]  |  |  |  Jean Dupont                  |  |
|  +------------------+  |  |  Développeur Full-Stack       |  |
|                        |  +-------------------------------+  |
|  +------------------+  |                                     |
|  | 📝 Texte         |  |  +-------------------------------+  |
|  | [✏️ Éditer] [🗑️]  |  |  |  À propos de moi              |  |
|  +------------------+  |  |  Passionné par le code...     |  |
|                        |  +-------------------------------+  |
|  +------------------+  |                                     |
|  | 💼 Projets       |  |  +-------------------------------+  |
|  | [✏️ Éditer] [🗑️]  |  |  |  Mes projets                  |  |
|  +------------------+  |  |  [Projet 1] [Projet 2]        |  |
|                        |  +-------------------------------+  |
|  [+ Ajouter un bloc]   |                                     |
|                        |                                     |
+--------------------------------------------------------------+
```

## 3. Principes d'ergonomie

### Loi de Hick (réduire les choix)

**Problème** : Dashboard avec 20 options → l'utilisateur est perdu

**Solution** : Afficher 3 solutions principales (Analyser, Optimiser, Portfolio)
```jsx
// ❌ Mauvais : trop de choix
<div className="grid grid-cols-4 gap-4">
  {20_features.map(feature => <Card key={feature.id} {...feature} />)}
</div>

// ✅ Bon : choix limités et hiérarchisés
<div className="space-y-8">
  <h2>Solutions principales</h2>
  <div className="grid grid-cols-3 gap-6">
    <Card title="Analyser CV" primary />
    <Card title="Optimiser CV" primary />
    <Card title="Portfolio Pro" primary />
  </div>

  <h2>Autres outils</h2>
  <div className="grid grid-cols-3 gap-4">
    {secondary_features.map(...)}
  </div>
</div>
```

### Loi de Fitts (cibles faciles à atteindre)

**Problème** : Boutons trop petits, difficiles à cliquer

**Solution** : Boutons de taille suffisante (44x44px minimum sur mobile)
```jsx
// ❌ Mauvais : bouton trop petit
<button className="px-2 py-1 text-xs">Valider</button>

// ✅ Bon : bouton de taille suffisante
<button className="px-6 py-3 text-base min-h-[44px]">Valider</button>
```

### Loi de Miller (7±2 items max)

**Problème** : Formulaire avec 15 champs → abandon

**Solution** : Découper en étapes (4 étapes max, 4 champs par étape)
```
Étape 1 : Identité (prénom, nom, email, téléphone)
Étape 2 : Expérience (titre poste, entreprise, dates, description)
Étape 3 : Formation (diplôme, école, dates)
Étape 4 : Compétences (techniques, soft skills, langues)
```

### Principe de proximité

**Problème** : Label éloigné de son input → confusion

**Solution** : Grouper visuellement les éléments liés
```jsx
// ❌ Mauvais : éléments dispersés
<label>Email</label>
<p>Entrez votre adresse email</p>
<input />
<p>Format : email@exemple.com</p>

// ✅ Bon : groupés dans un conteneur
<div className="space-y-2">
  <label className="block text-sm font-medium">Email</label>
  <input className="w-full" />
  <p className="text-sm text-gray-500">Nous ne partagerons jamais votre email.</p>
</div>
```

### Feedback immédiat

**Problème** : L'utilisateur clique et ne sait pas si ça a fonctionné

**Solution** : Feedback visuel à chaque action
```jsx
// Lors de l'upload d'un PDF
<div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
  {uploading ? (
    <div className="text-center">
      <svg className="animate-spin h-8 w-8 mx-auto text-primary-600" />
      <p className="text-gray-600 mt-2">Extraction du texte en cours...</p>
      <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
        <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${progress}%` }} />
      </div>
    </div>
  ) : (
    <div className="text-center">
      <svg className="h-12 w-12 mx-auto text-gray-400" />
      <p className="text-gray-600 mt-2">Glissez votre CV ici ou cliquez pour parcourir</p>
      <p className="text-sm text-gray-500 mt-1">PDF, max 2 Mo</p>
    </div>
  )}
</div>
```

## 4. Gestion des erreurs (récupération)

### Validation progressive (inline)

```jsx
// Valider au fur et à mesure, pas seulement à la soumission
const [email, setEmail] = useState('');
const [emailError, setEmailError] = useState('');

const validateEmail = (value) => {
  if (!value) {
    setEmailError('Email obligatoire');
  } else if (!/\S+@\S+\.\S+/.test(value)) {
    setEmailError('Email invalide');
  } else {
    setEmailError('');
  }
};

<div className="space-y-2">
  <label>Email *</label>
  <input
    value={email}
    onChange={(e) => {
      setEmail(e.target.value);
      validateEmail(e.target.value);
    }}
    className={emailError ? 'border-red-500' : 'border-gray-300'}
  />
  {emailError && (
    <p className="text-sm text-red-600 flex items-center gap-1">
      <svg className="w-4 h-4" /> {emailError}
    </p>
  )}
</div>
```

### Messages d'erreur actionnables

```jsx
// ❌ Mauvais : message vague
<p className="text-red-600">Une erreur s'est produite</p>

// ✅ Bon : message précis + action corrective
<div className="bg-red-50 border border-red-200 rounded-md p-4">
  <h4 className="font-medium text-red-800">Le fichier n'a pas pu être chargé</h4>
  <p className="text-sm text-red-700 mt-1">
    Le fichier doit être un PDF de moins de 2 Mo.
  </p>
  <button className="mt-3 text-red-600 hover:text-red-700 font-medium">
    Choisir un autre fichier →
  </button>
</div>
```

### Prévention des pertes de données

```jsx
// Sauvegarder automatiquement dans localStorage
useEffect(() => {
  const saveDraft = () => {
    localStorage.setItem('cv-draft', JSON.stringify(cvData));
  };

  const interval = setInterval(saveDraft, 30000); // Toutes les 30s
  return () => clearInterval(interval);
}, [cvData]);

// Récupérer au chargement
useEffect(() => {
  const draft = localStorage.getItem('cv-draft');
  if (draft && confirm('Voulez-vous reprendre votre brouillon ?')) {
    setCvData(JSON.parse(draft));
  }
}, []);
```

## 5. Accessibilité (a11y)

### Navigation au clavier

```jsx
// Tous les éléments interactifs doivent être accessibles au clavier
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
  className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500"
>
  Cliquez-moi
</div>
```

### Labels et ARIA

```jsx
// Labels explicites pour les inputs
<label htmlFor="firstname" className="sr-only">Prénom</label>
<input
  id="firstname"
  type="text"
  placeholder="Prénom"
  aria-required="true"
  aria-invalid={errors.firstname ? 'true' : 'false'}
  aria-describedby={errors.firstname ? 'firstname-error' : null}
/>
{errors.firstname && (
  <p id="firstname-error" className="text-red-600" role="alert">
    {errors.firstname}
  </p>
)}
```

### Focus visible

```jsx
// Focus toujours visible (WCAG 2.4.7)
<button className="bg-primary-600 text-white px-6 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
  Valider
</button>
```

## 6. Cas d'usage spécifiques Mew-mew-Ai

### Onboarding guidé (première utilisation)

```jsx
// Afficher un tooltip contextuel lors de la première visite
{isFirstVisit && (
  <div className="fixed bottom-20 right-4 bg-white border border-gray-200 rounded-lg shadow-xl p-4 max-w-sm">
    <div className="flex justify-between items-start">
      <div>
        <h4 className="font-medium text-gray-900">👋 Bienvenue sur Mew-mew-Ai !</h4>
        <p className="text-sm text-gray-600 mt-1">
          Commencez par analyser votre CV pour découvrir les métiers qui vous correspondent.
        </p>
      </div>
      <button onClick={() => setIsFirstVisit(false)} className="text-gray-400 hover:text-gray-600">
        ✕
      </button>
    </div>
    <button
      onClick={() => {
        setIsFirstVisit(false);
        router.push('/solutions/analyse-cv');
      }}
      className="mt-3 w-full bg-primary-600 text-white px-4 py-2 rounded-md"
    >
      Analyser mon CV →
    </button>
  </div>
)}
```

### Comparaison avant/après (optimisation CV)

```jsx
// Afficher le CV original vs optimisé côte à côte
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  <div className="space-y-4">
    <h3 className="text-xl font-semibold text-gray-900">Avant</h3>
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
      {originalCV}
    </div>
  </div>

  <div className="space-y-4">
    <h3 className="text-xl font-semibold text-primary-600">Après ✨</h3>
    <div className="bg-primary-50 border-2 border-primary-600 rounded-lg p-6">
      {optimizedCV}
    </div>
  </div>
</div>
```

## Checklist UX Design

Avant de valider une fonctionnalité :

- [ ] **User flow dessiné** : Schéma du parcours complet
- [ ] **Wireframes créés** : Croquis basse fidélité (papier ou Figma)
- [ ] **Feedback immédiat** : Loading, success, error states
- [ ] **Validation progressive** : Messages d'erreur inline
- [ ] **Récupération d'erreur** : Messages actionnables, retry
- [ ] **Sauvegarde auto** : Brouillons dans localStorage
- [ ] **Accessibilité** : Labels, ARIA, keyboard nav, focus visible
- [ ] **Mobile-friendly** : Testé sur mobile (touch targets 44x44px)
- [ ] **Onboarding** : Guidance pour les nouveaux utilisateurs
- [ ] **Analytics** : Tracking des actions clés (pour optimiser)

---

**Utilisation** : Référence pour optimiser les parcours utilisateurs de Mew-mew-Ai
**Dernière mise à jour** : Février 2026
