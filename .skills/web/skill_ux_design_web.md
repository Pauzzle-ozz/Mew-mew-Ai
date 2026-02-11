---
name: UX design web
description: UX spécifiquement pensée pour les interfaces web.
---

# Skill : UX Design Web

## Description

L'UX (User Experience) design est **l'expérience globale** que vit l'utilisateur sur Mew-mew-Ai. Contrairement à l'UI (ce que l'utilisateur voit), l'UX est **ce que l'utilisateur ressent** :
- **La fluidité** : Peut-il accomplir sa tâche rapidement ?
- **La clarté** : Comprend-il où il est et quoi faire ?
- **La satisfaction** : Se sent-il guidé, rassuré, valorisé ?
- **L'efficacité** : Atteint-il son objectif sans friction ?

## Analogie

L'UX design, c'est comme **l'expérience dans un parc d'attractions** :
- Les **panneaux** sont ta **navigation** (où suis-je, où puis-je aller)
- Les **files d'attente** sont tes **étapes de parcours** (courtes, claires, tolérables)
- Les **animateurs** sont tes **feedbacks** (succès, erreur, attente)
- L'**ambiance** est ton **tone of voice** (professionnel, chaleureux, tech)
- Le **plan du parc** est ton **sitemap** (structure globale)

Si le visiteur se perd, s'ennuie ou ne comprend pas → mauvaise UX.
Si tout est fluide, agréable et mémorable → excellente UX.

## Principes théoriques

### 1. Les 10 heuristiques de Nielsen (UX fondamentaux)

1. **Visibilité du statut du système** : L'utilisateur sait toujours ce qui se passe (loading, succès, erreur)
2. **Correspondance système/monde réel** : Langage utilisateur, pas jargon technique
3. **Contrôle et liberté** : Annuler, retour arrière, sortir facilement
4. **Consistance et standards** : Même comportement partout (bouton bleu = action)
5. **Prévention des erreurs** : Confirmation avant suppression, validation en temps réel
6. **Reconnaissance plutôt que rappel** : Montrer les options vs forcer l'utilisateur à se souvenir
7. **Flexibilité et efficacité** : Raccourcis pour experts, simple pour débutants
8. **Design minimaliste** : Pas d'infos inutiles, focus sur l'essentiel
9. **Aide à la récupération d'erreur** : Messages d'erreur clairs + solution
10. **Aide et documentation** : Accessible mais non intrusive

### 2. Les 5 dimensions de l'UX

1. **Utilisabilité** : Facile à utiliser (formulaire simple, navigation claire)
2. **Utilité** : Répond au besoin (analyse CV, génère portfolio)
3. **Désirabilité** : Donne envie (design moderne, animations)
4. **Accessibilité** : Pour tous (clavier, screen readers, contrastes)
5. **Crédibilité** : Inspire confiance (témoignages, sécurité, professionnalisme)

### 3. Loi de Tesler (Conservation de la complexité)

> "Toute application a une complexité incompressible. La question est : qui la gère, l'utilisateur ou le système ?"

**Exemple Mew-mew-Ai** :
- ❌ MAUVAIS : Demander à l'utilisateur de formater son CV en JSON
- ✅ BON : L'IA extrait automatiquement les données du PDF

### 4. Charge cognitive (Cognitive Load)

L'utilisateur a une capacité mentale limitée. Réduire la charge cognitive :
- **Chunking** : Grouper les infos (formulaire en 3 étapes vs 1 page géante)
- **Progressive disclosure** : Montrer seulement ce qui est nécessaire
- **Defaults intelligents** : Pré-remplir avec des valeurs sensées

## Architecture UX de Mew-mew-Ai

### 1. Parcours utilisateurs clés

**Parcours 1 : Nouvel utilisateur (Landing → Inscription → Dashboard)**
```
Landing page
    ↓ (CTA "Commencer gratuitement")
Signup (/signup)
    ↓ (Formulaire email/password)
Vérification email (Supabase Auth)
    ↓ (Clic lien email)
Dashboard (/dashboard)
    ↓ (Découverte des solutions)
Choix solution (CV, Portfolio)
```

**Parcours 2 : Analyse de CV (Dashboard → Analyse → Résultats → Téléchargement)**
```
Dashboard
    ↓ (Clic "Analyser mon CV")
/solutions/analyse-cv
    ↓ (Choix : Formulaire OU PDF)
Formulaire rempli OU PDF uploadé
    ↓ (Clic "Analyser")
Loading (appel n8n, 10-30s)
    ↓ (Réponse IA)
Résultats affichés
    ↓ (Métiers recommandés, points forts)
Action (Télécharger PDF, Optimiser)
```

**Parcours 3 : Création portfolio (Dashboard → Création → Édition → Publication → Partage)**
```
Dashboard
    ↓ (Clic "Créer un portfolio")
/solutions/portfolio
    ↓ (Formulaire titre + template)
Portfolio créé (slug généré)
    ↓ (Redirection /portfolio/[id]/edit)
Éditeur (blocs, médias, couleurs)
    ↓ (Ajout blocs, upload images)
Prévisualisation
    ↓ (Clic "Publier")
Portfolio publié
    ↓ (Lien public /p/[slug])
Partage (QR code, lien, réseaux sociaux)
```

### 2. Architecture de l'information (sitemap)

```
/                           # Landing page (non connecté)
├── /login                  # Connexion
├── /signup                 # Inscription
│
└── /dashboard              # Hub utilisateur (connecté)
    ├── /solutions/
    │   ├── analyse-cv/     # Analyser CV (formulaire + PDF)
    │   ├── optimiseur-cv/  # Optimiser CV (formulaire + PDF)
    │   └── portfolio/      # Liste portfolios
    │       ├── /[id]/edit/ # Éditeur portfolio
    │       └── /p/[slug]   # Portfolio public (non connecté OK)
    │
    └── /settings/          # (À créer) Paramètres compte
```

### 3. États du système (feedback utilisateur)

| État | Exemple Mew-mew-Ai | UI |
|------|--------------------|----|
| **Loading** | Analyse CV en cours (n8n) | Spinner + "Analyse en cours..." |
| **Success** | CV généré avec succès | Checkmark vert + "Votre CV est prêt !" |
| **Error** | Upload PDF échoué | Croix rouge + "Erreur lors de l'upload. Réessayez." |
| **Empty** | Aucun portfolio créé | Illustration + "Créez votre premier portfolio" |
| **Disabled** | Formulaire incomplet | Bouton grisé + tooltip "Remplissez tous les champs" |

## Exemples de code concrets (UX patterns)

### 1. Progressive disclosure (formulaire en étapes)

```jsx
// app/solutions/analyse-cv/page.js (extrait simplifié)
'use client';

import { useState } from 'react';

export default function AnalyzeCVPage() {
  const [step, setStep] = useState(1); // Étape actuelle
  const [formData, setFormData] = useState({
    // Étape 1 : Identité
    prenom: '',
    nom: '',
    email: '',
    // Étape 2 : Parcours
    titre_poste: '',
    experiences: [],
    formations: [],
    // Étape 3 : Compétences
    competences_techniques: '',
    competences_soft: '',
  });

  const totalSteps = 3;

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      {/* Indicateur de progression */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-semibold
                ${step >= s
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-500'}
              `}>
                {s}
              </div>
              {s < totalSteps && (
                <div className={`
                  h-1 w-24 mx-2
                  ${step > s ? 'bg-primary' : 'bg-gray-200'}
                `} />
              )}
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-600">
          Étape {step} sur {totalSteps}
        </p>
      </div>

      {/* Contenu de l'étape */}
      <div className="bg-white border border-gray-200 rounded-xl p-8">
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Identité</h2>
            <FormField label="Prénom" name="prenom" value={formData.prenom} onChange={handleChange} required />
            <FormField label="Nom" name="nom" value={formData.nom} onChange={handleChange} required />
            <FormField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Parcours professionnel</h2>
            <FormField label="Titre de poste actuel" name="titre_poste" value={formData.titre_poste} onChange={handleChange} required />
            {/* Expériences, formations */}
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Compétences</h2>
            <FormField label="Compétences techniques" name="competences_techniques" value={formData.competences_techniques} onChange={handleChange} />
            <FormField label="Compétences humaines" name="competences_soft" value={formData.competences_soft} onChange={handleChange} />
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button
          variant="ghost"
          onClick={prevStep}
          disabled={step === 1}
        >
          ← Précédent
        </Button>

        {step < totalSteps ? (
          <Button variant="primary" onClick={nextStep}>
            Suivant →
          </Button>
        ) : (
          <Button variant="primary" onClick={handleSubmit}>
            Analyser mon CV
          </Button>
        )}
      </div>
    </div>
  );
}
```

### 2. Feedback utilisateur (loading, success, error)

```jsx
// hooks/useCVAnalyzer.js (extrait)
import { useState } from 'react';
import { analyzeCV } from '@/lib/api/cvApi';

export function useCVAnalyzer() {
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  async function analyze(cvData) {
    setStatus('loading');
    setError(null);

    try {
      const response = await analyzeCV(cvData);
      setResults(response.data);
      setStatus('success');
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
      setStatus('error');
    }
  }

  return { status, results, error, analyze };
}

// Composant qui utilise le hook
export default function CVAnalyzer() {
  const { status, results, error, analyze } = useCVAnalyzer();

  return (
    <div>
      {status === 'idle' && (
        <form onSubmit={handleSubmit}>
          {/* Formulaire */}
          <Button type="submit" variant="primary">
            Analyser mon CV
          </Button>
        </form>
      )}

      {status === 'loading' && (
        <div className="text-center py-12">
          {/* Spinner */}
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900">
            Analyse en cours...
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Notre IA analyse votre parcours. Cela peut prendre jusqu'à 30 secondes.
          </p>
        </div>
      )}

      {status === 'success' && (
        <div className="bg-success/10 border border-success rounded-xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-success flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
            </svg>
            <div>
              <h3 className="font-semibold text-success mb-1">
                Analyse terminée avec succès !
              </h3>
              <p className="text-sm text-gray-700">
                Découvrez les métiers qui correspondent à votre profil.
              </p>
            </div>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="bg-error/10 border border-error rounded-xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-error flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
            </svg>
            <div>
              <h3 className="font-semibold text-error mb-1">
                Erreur lors de l'analyse
              </h3>
              <p className="text-sm text-gray-700">
                {error}
              </p>
              <Button variant="outline" size="sm" onClick={() => setStatus('idle')} className="mt-3">
                Réessayer
              </Button>
            </div>
          </div>
        </div>
      )}

      {status === 'success' && results && (
        <ResultsDisplay data={results} />
      )}
    </div>
  );
}
```

### 3. Confirmation avant action destructive

```jsx
// app/solutions/portfolio/[id]/edit/page.js (extrait)
const [showDeleteModal, setShowDeleteModal] = useState(false);

async function handleDelete() {
  try {
    await portfolioApi.delete(portfolioId, userId);
    router.push('/solutions/portfolio');
  } catch (error) {
    alert('Erreur lors de la suppression');
  }
}

return (
  <div>
    {/* Bouton supprimer */}
    <Button
      variant="danger"
      onClick={() => setShowDeleteModal(true)}
    >
      Supprimer le portfolio
    </Button>

    {/* Modal de confirmation */}
    <Modal
      isOpen={showDeleteModal}
      onClose={() => setShowDeleteModal(false)}
      title="Supprimer le portfolio ?"
      footer={
        <>
          <Button
            variant="ghost"
            onClick={() => setShowDeleteModal(false)}
          >
            Annuler
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
          >
            Oui, supprimer définitivement
          </Button>
        </>
      }
    >
      <div className="py-4">
        <p className="text-gray-700 mb-4">
          Cette action est <strong>irréversible</strong>. Le portfolio
          "<strong>{portfolio.title}</strong>" et tous ses blocs seront
          supprimés définitivement.
        </p>
        <div className="bg-warning/10 border border-warning rounded-lg p-4">
          <p className="text-sm text-gray-700">
            ⚠️ Le lien public /p/{portfolio.slug} ne sera plus accessible.
          </p>
        </div>
      </div>
    </Modal>
  </div>
);
```

### 4. Onboarding utilisateur (première visite)

```jsx
// app/dashboard/page.js
'use client';

import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà vu l'onboarding
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  function completeOnboarding() {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  }

  if (showOnboarding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-secondary/10 flex items-center justify-center px-6">
        <div className="max-w-2xl bg-white rounded-2xl shadow-2xl p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bienvenue sur Mew-mew-Ai ! 👋
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            Votre plateforme IA pour propulser votre carrière. Voici ce que vous pouvez faire :
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Analyser votre CV
              </h3>
              <p className="text-sm text-gray-600">
                Notre IA identifie les métiers qui vous correspondent
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Optimiser votre CV
              </h3>
              <p className="text-sm text-gray-600">
                Améliorez votre CV pour les ATS et recruteurs
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Créer un portfolio
              </h3>
              <p className="text-sm text-gray-600">
                Votre vitrine professionnelle en quelques clics
              </p>
            </div>
          </div>

          <Button variant="primary" size="lg" onClick={completeOnboarding}>
            Commencer l'exploration
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      {/* Dashboard normal */}
      <h1 className="text-4xl font-bold mb-8">
        Bonjour {user?.email} 👋
      </h1>
      {/* Reste du dashboard */}
    </div>
  );
}
```

### 5. Breadcrumb navigation (fil d'Ariane)

```jsx
// components/shared/Breadcrumb.jsx
import Link from 'next/link';

export default function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
      <Link href="/" className="hover:text-gray-900 transition-colors">
        Accueil
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
          </svg>
          {item.href ? (
            <Link href={item.href} className="hover:text-gray-900 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}

// Utilisation (page d'édition portfolio)
<Breadcrumb items={[
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Portfolios', href: '/solutions/portfolio' },
  { label: portfolio.title }
]} />
```

## Diagramme : Parcours utilisateur type

```
┌─────────────────────────────────────────────────────────┐
│          PARCOURS ANALYSE CV (FORMULAIRE)               │
└─────────────────────────────────────────────────────────┘

1. DÉCOUVERTE
   Landing page → CTA "Analyser mon CV"
   Décision : Inscription OU Connexion
   ↓

2. AUTHENTIFICATION
   /signup → Email/Password → Vérification email
   ↓

3. ONBOARDING (première visite)
   Modal bienvenue → Présentation des 3 solutions
   ↓

4. DASHBOARD
   Liste des solutions → Clic "Analyser mon CV"
   ↓

5. FORMULAIRE
   /solutions/analyse-cv
   Choix : Formulaire OU PDF
   Si Formulaire → 3 étapes (Identité, Parcours, Compétences)
   ↓

6. SOUMISSION
   Clic "Analyser" → Validation → Envoi backend
   ↓

7. TRAITEMENT
   Loading (spinner + message)
   Backend → n8n → IA (10-30s)
   ↓

8. RÉSULTATS
   Success → Affichage des métiers recommandés
   Points forts, axes d'amélioration
   ↓

9. ACTIONS SUIVANTES
   - Télécharger le rapport (PDF)
   - Optimiser le CV
   - Créer un portfolio
   - Partager sur LinkedIn
```

## Checklist pratique

### ✅ Visibilité du statut système

- [ ] Loading states sur toutes les actions asynchrones (spinner + texte)
- [ ] Messages de succès après actions (checkmark vert + message)
- [ ] Messages d'erreur explicites (croix rouge + solution)
- [ ] Indicateur de progression (étapes formulaire : 1/3, 2/3, 3/3)
- [ ] Breadcrumb navigation (fil d'Ariane sur pages profondes)

### ✅ Prévention des erreurs

- [ ] Validation en temps réel (email invalide → bordure rouge immédiate)
- [ ] Confirmation avant suppression (modal "Êtes-vous sûr ?")
- [ ] Champs requis indiqués (`*` rouge sur label)
- [ ] Boutons désactivés si formulaire incomplet
- [ ] Tooltip explicatif sur champs complexes

### ✅ Contrôle et liberté

- [ ] Bouton "Annuler" sur tous les formulaires
- [ ] Bouton "Retour" dans les parcours multi-étapes
- [ ] Fermeture modale avec Escape ou clic backdrop
- [ ] Undo/Redo sur éditeur de portfolio (si applicable)
- [ ] Sauvegarde automatique brouillon (portfolio)

### ✅ Consistance

- [ ] Même style de boutons partout (primary, secondary, etc.)
- [ ] Navigation identique sur toutes les pages
- [ ] Messages d'erreur au même format
- [ ] Même terminologie (ex: "Portfolio" partout, pas "Vitrine" ailleurs)

### ✅ Progressive disclosure

- [ ] Formulaires longs découpés en étapes (max 5 champs par étape)
- [ ] Options avancées cachées par défaut (accordéon, toggle)
- [ ] Onboarding par étapes (pas tout d'un coup)

### ✅ Feedback immédiat

- [ ] Hover states sur tous les cliquables (boutons, liens, cards)
- [ ] Focus visible sur navigation clavier (ring bleu)
- [ ] Animation de transition (fade, slide)
- [ ] Tooltip sur icônes (au survol, info claire)

### ✅ Empty states

- [ ] Message + illustration si aucun portfolio
- [ ] CTA clair ("Créer mon premier portfolio")
- [ ] Pas de page blanche vide

### ✅ Accessibilité UX

- [ ] Navigation clavier complète (Tab, Enter, Escape)
- [ ] Labels clairs sur formulaires (`htmlFor`)
- [ ] Messages d'erreur associés aux champs (ARIA)
- [ ] Focus trap dans modales (Escape pour fermer)

### ✅ Performance perçue

- [ ] Skeleton screens pendant chargement (vs spinner seul)
- [ ] Préchargement des données critiques
- [ ] Feedback instantané (optimistic UI si applicable)
- [ ] Images lazy-loaded

## Erreurs à éviter

### ❌ Pas de feedback après action

```jsx
// ❌ MAUVAIS : L'utilisateur ne sait pas si ça a marché
async function handleSubmit() {
  await savePortfolio(data);
}

// ✅ BON : Feedback clair
async function handleSubmit() {
  try {
    await savePortfolio(data);
    showSuccessMessage("Portfolio enregistré avec succès !");
  } catch (error) {
    showErrorMessage("Erreur lors de l'enregistrement. Réessayez.");
  }
}
```

### ❌ Formulaire trop long (charge cognitive)

```jsx
// ❌ MAUVAIS : 15 champs d'un coup
<form>
  <input name="prenom" />
  <input name="nom" />
  <input name="email" />
  <input name="telephone" />
  <input name="adresse" />
  <input name="ville" />
  <input name="code_postal" />
  <input name="pays" />
  <input name="titre_poste" />
  <input name="entreprise" />
  <input name="date_debut" />
  <input name="date_fin" />
  <textarea name="description" />
  <input name="competences" />
  <input name="langues" />
  <button>Soumettre</button>
</form>

// ✅ BON : 3 étapes de 5 champs max
<MultiStepForm steps={[
  { title: "Identité", fields: ["prenom", "nom", "email", "telephone"] },
  { title: "Localisation", fields: ["adresse", "ville", "code_postal", "pays"] },
  { title: "Professionnel", fields: ["titre_poste", "entreprise", "date_debut", "date_fin"] }
]} />
```

### ❌ Pas de confirmation avant suppression

```jsx
// ❌ MAUVAIS : Supprime directement
<button onClick={() => deletePortfolio(id)}>
  Supprimer
</button>

// ✅ BON : Demande confirmation
<button onClick={() => setShowConfirmModal(true)}>
  Supprimer
</button>

<Modal
  isOpen={showConfirmModal}
  title="Supprimer le portfolio ?"
  onConfirm={deletePortfolio}
  onCancel={() => setShowConfirmModal(false)}
>
  Cette action est irréversible.
</Modal>
```

### ❌ Erreur sans solution proposée

```jsx
// ❌ MAUVAIS : Message inutile
<ErrorMessage>
  Une erreur est survenue.
</ErrorMessage>

// ✅ BON : Erreur + solution
<ErrorMessage>
  Le fichier est trop volumineux (max 2 Mo).
  <Button onClick={compressFile}>
    Compresser automatiquement
  </Button>
</ErrorMessage>
```

### ❌ Pas de breadcrumb sur pages profondes

```jsx
// ❌ MAUVAIS : L'utilisateur ne sait pas où il est
/solutions/portfolio/abc123/edit/blocks/xyz789
→ Page sans contexte

// ✅ BON : Breadcrumb clair
Accueil > Dashboard > Portfolios > Mon portfolio > Édition
```

## Ressources & Outils

### Références UX
- [Nielsen Norman Group](https://www.nngroup.com/) - Articles et recherches UX
- [Laws of UX](https://lawsofux.com/) - Principes UX illustrés
- [UX Collective](https://uxdesign.cc/) - Communauté UX

### Outils de wireframing
- [Figma](https://www.figma.com/) - Design UX/UI
- [Whimsical](https://whimsical.com/) - Wireframes rapides
- [Balsamiq](https://balsamiq.com/) - Maquettes low-fi

### Tests utilisateurs
- [Hotjar](https://www.hotjar.com/) - Heatmaps, enregistrements
- [Maze](https://maze.co/) - Tests de prototypes
- [UserTesting](https://www.usertesting.com/) - Tests avec vrais utilisateurs

### Analyse de parcours
- [Amplitude](https://amplitude.com/) - Analytics comportementaux
- [Mixpanel](https://mixpanel.com/) - Suivi événements
- [Google Analytics 4](https://analytics.google.com/) - Analytics web

---

**Prochaines étapes** : Documenter l'ergonomie web pour optimiser la facilité d'utilisation.
