---
name: parcours utilisateur
description: Définition et optimisation des parcours utilisateurs sur un site.
---

# Skill : Parcours Utilisateur

## Description

Un parcours utilisateur (user journey) est la **séquence d'étapes** qu'un utilisateur suit pour accomplir un objectif sur Mew-mew-Ai. Optimiser ces parcours signifie :
- **Réduire les frictions** (moins de clics, moins de champs, moins d'attente)
- **Guider l'utilisateur** (CTA clairs, étapes logiques)
- **Anticiper les besoins** (suggestions, pré-remplissage, raccourcis)
- **Mesurer et améliorer** (analytics, A/B testing)

## Analogie

Un parcours utilisateur, c'est comme **un parcours client dans un magasin IKEA** :
- **Entrée** = Landing page (première impression)
- **Showroom** = Découverte des solutions (navigation)
- **Sélection** = Choix d'une solution (analyse CV, portfolio)
- **Caisse** = Action finale (génération PDF, publication)
- **Sortie** = Résultat + prochaines actions (téléchargement, partage)

Si le client se perd, fait la queue trop longtemps ou ne trouve pas ce qu'il cherche → il abandonne.

## Parcours clés de Mew-mew-Ai

### Parcours 1 : Acquisition (Visiteur → Utilisateur inscrit)

```
┌──────────────────────────────────────────────┐
│  ÉTAPE 1 : DÉCOUVERTE                        │
│  Landing page (/)                            │
│  - Proposition de valeur claire              │
│  - 3 solutions visibles (CV, Optimiseur,     │
│    Portfolio)                                │
│  - Témoignages / Social proof                │
│  - CTA : "Commencer gratuitement"            │
└──────────────────────────────────────────────┘
                 ↓
┌──────────────────────────────────────────────┐
│  ÉTAPE 2 : INSCRIPTION                       │
│  /signup                                     │
│  - Email + Mot de passe (simple)             │
│  - OU SSO (Google, LinkedIn)                 │
│  - Validation email (Supabase Auth)          │
└──────────────────────────────────────────────┘
                 ↓
┌──────────────────────────────────────────────┐
│  ÉTAPE 3 : ONBOARDING                        │
│  /dashboard (première visite)                │
│  - Modal bienvenue                           │
│  - Tour guidé des 3 solutions                │
│  - Suggestion : "Commencez par analyser      │
│    votre CV"                                 │
└──────────────────────────────────────────────┘
                 ↓
┌──────────────────────────────────────────────┐
│  ÉTAPE 4 : ACTIVATION                        │
│  Dashboard → Première action (analyse CV)    │
└──────────────────────────────────────────────┘

KPIs à mesurer :
- Taux de conversion landing → signup (objectif : >5%)
- Taux de validation email (objectif : >80%)
- Taux d'activation (objectif : >60%)
- Time to first action (objectif : <2 min)
```

### Parcours 2 : Analyse de CV (objectif = métiers recommandés)

```
┌──────────────────────────────────────────────┐
│  POINT D'ENTRÉE                              │
│  Dashboard → Clic "Analyser mon CV"          │
└──────────────────────────────────────────────┘
                 ↓
┌──────────────────────────────────────────────┐
│  ÉTAPE 1 : CHOIX MÉTHODE                     │
│  /solutions/analyse-cv                       │
│  - Formulaire (recommandé, guidé)            │
│  - Upload PDF (rapide, automatique)          │
└──────────────────────────────────────────────┘
                 ↓
┌──────────────────────────────────────────────┐
│  ÉTAPE 2 : SAISIE DONNÉES                    │
│  SI FORMULAIRE :                             │
│  - Étape 1/3 : Identité (prénom, nom, email) │
│  - Étape 2/3 : Parcours (poste, exp, form)   │
│  - Étape 3/3 : Compétences                   │
│                                              │
│  SI PDF :                                    │
│  - Drag & drop ou clic                       │
│  - Validation taille (<2 Mo)                 │
│  - Extraction texte automatique              │
└──────────────────────────────────────────────┘
                 ↓
┌──────────────────────────────────────────────┐
│  ÉTAPE 3 : TRAITEMENT                        │
│  - Loading (spinner + message rassurant)     │
│  - Appel n8n → IA (10-30s)                   │
│  - Feedback : "Analyse en cours... 75%"      │
└──────────────────────────────────────────────┘
                 ↓
┌──────────────────────────────────────────────┐
│  ÉTAPE 4 : RÉSULTATS                         │
│  - Success message                           │
│  - Métiers recommandés (top 5)               │
│  - Points forts / axes d'amélioration        │
│  - Score de compatibilité (%)                │
└──────────────────────────────────────────────┘
                 ↓
┌──────────────────────────────────────────────┐
│  ÉTAPE 5 : ACTIONS SUIVANTES                 │
│  - Télécharger le rapport (PDF)              │
│  - Optimiser le CV                           │
│  - Créer un portfolio                        │
│  - Partager sur LinkedIn                     │
└──────────────────────────────────────────────┘

KPIs à mesurer :
- Taux de complétion formulaire (objectif : >70%)
- Taux d'erreur upload PDF (objectif : <5%)
- Temps moyen de traitement (objectif : <30s)
- Taux de satisfaction (NPS, survey)
- Taux de conversion vers optimisation (objectif : >30%)
```

### Parcours 3 : Création de portfolio (objectif = publication + partage)

```
┌──────────────────────────────────────────────┐
│  POINT D'ENTRÉE                              │
│  Dashboard → Clic "Créer un portfolio"       │
└──────────────────────────────────────────────┘
                 ↓
┌──────────────────────────────────────────────┐
│  ÉTAPE 1 : CRÉATION                          │
│  /solutions/portfolio                        │
│  - Titre (ex: "John Doe - Développeur Web")  │
│  - Template (moderne, créatif, minimal)      │
│  - Génération slug automatique               │
└──────────────────────────────────────────────┘
                 ↓
┌──────────────────────────────────────────────┐
│  ÉTAPE 2 : ÉDITION                           │
│  /solutions/portfolio/[id]/edit              │
│  - Ajout blocs (Hero, Texte, Image, Vidéo)   │
│  - Upload médias (images, vidéos)            │
│  - Personnalisation couleur primaire         │
│  - Prévisualisation temps réel               │
└──────────────────────────────────────────────┘
                 ↓
┌──────────────────────────────────────────────┐
│  ÉTAPE 3 : PUBLICATION                       │
│  - Toggle "Publier" (published = true)       │
│  - Génération lien public /p/[slug]          │
│  - QR code généré automatiquement            │
└──────────────────────────────────────────────┘
                 ↓
┌──────────────────────────────────────────────┐
│  ÉTAPE 4 : PARTAGE                           │
│  - Copier lien (clipboard)                   │
│  - Télécharger QR code (PNG)                 │
│  - Partager sur réseaux sociaux              │
│  - Intégrer dans email signature             │
└──────────────────────────────────────────────┘
                 ↓
┌──────────────────────────────────────────────┐
│  ÉTAPE 5 : SUIVI                             │
│  - Statistiques de vues (compteur)           │
│  - Messages reçus (formulaire contact)       │
│  - Modifications (édition continue)          │
└──────────────────────────────────────────────┘

KPIs à mesurer :
- Temps moyen de création (objectif : <10 min)
- Nombre de blocs par portfolio (objectif : >5)
- Taux de publication (objectif : >50%)
- Taux de partage (objectif : >70%)
- Nombre de vues moyen par portfolio
- Taux de conversion contact (objectif : >5%)
```

## Optimisation des parcours (techniques)

### 1. Réduire les frictions

**Formulaire multi-étapes** :
```jsx
// Au lieu d'un formulaire géant (friction élevée)
// Découper en 3 étapes (progression visible)

const [step, setStep] = useState(1);
const totalSteps = 3;

return (
  <div>
    {/* Indicateur de progression */}
    <ProgressBar current={step} total={totalSteps} />

    {/* Étape actuelle */}
    {step === 1 && <IdentityStep />}
    {step === 2 && <ExperienceStep />}
    {step === 3 && <SkillsStep />}

    {/* Navigation */}
    <div className="flex justify-between mt-6">
      <Button onClick={() => setStep(s => s - 1)} disabled={step === 1}>
        Précédent
      </Button>
      <Button onClick={() => setStep(s => s + 1)} disabled={step === totalSteps}>
        Suivant
      </Button>
    </div>
  </div>
);
```

**Pré-remplissage intelligent** :
```jsx
// Si l'utilisateur a déjà un profil Supabase, pré-remplir
useEffect(() => {
  if (user) {
    setFormData(prev => ({
      ...prev,
      email: user.email,
      prenom: user.user_metadata?.prenom || '',
      nom: user.user_metadata?.nom || ''
    }));
  }
}, [user]);
```

**Sauvegarde automatique** :
```jsx
// Portfolio : sauvegarde brouillon toutes les 30s
useEffect(() => {
  const interval = setInterval(() => {
    if (hasUnsavedChanges) {
      autosavePortfolio(portfolioData);
      setHasUnsavedChanges(false);
      showToast('Brouillon sauvegardé');
    }
  }, 30000); // 30s

  return () => clearInterval(interval);
}, [hasUnsavedChanges, portfolioData]);
```

### 2. Guider l'utilisateur (CTA clairs)

**Hiérarchie des actions** :
```jsx
// Action primaire = gros bouton bleu
// Action secondaire = bouton outline
// Action tertiaire = lien texte

<div className="flex flex-col gap-4">
  {/* Primaire */}
  <Button variant="primary" size="lg" className="w-full">
    Analyser mon CV avec l'IA
  </Button>

  {/* Secondaire */}
  <Button variant="outline" size="md" className="w-full">
    Importer un CV existant (PDF)
  </Button>

  {/* Tertiaire */}
  <Link href="/exemples" className="text-center text-sm text-gray-600 hover:text-gray-900">
    Voir des exemples de CV analysés
  </Link>
</div>
```

**Suggestions contextuelles** :
```jsx
// Après analyse CV, suggérer l'optimisation
{status === 'success' && (
  <div className="mt-8 bg-primary/10 border border-primary rounded-xl p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      Prochaine étape recommandée
    </h3>
    <p className="text-gray-700 mb-4">
      Votre CV a été analysé. Voulez-vous maintenant l'optimiser pour les ATS ?
    </p>
    <Button variant="primary" onClick={goToOptimizer}>
      Optimiser mon CV →
    </Button>
  </div>
)}
```

### 3. Mesurer et améliorer

**Tracking événements (exemple Plausible/GA4)** :
```jsx
// Tracker les étapes du parcours
import { trackEvent } from '@/lib/analytics';

// Étape 1 : Début formulaire
trackEvent('cv_analysis_started', { method: 'form' });

// Étape 2 : Progression
trackEvent('cv_analysis_step_completed', { step: 1 });

// Étape 3 : Soumission
trackEvent('cv_analysis_submitted', {
  method: 'form',
  duration_seconds: timeElapsed
});

// Étape 4 : Succès
trackEvent('cv_analysis_completed', {
  method: 'form',
  jobs_count: results.jobs.length
});

// Étape 5 : Conversion
trackEvent('cv_optimization_started', {
  from: 'analysis_results'
});
```

**Funnel de conversion** :
```
Analyse CV :
1. Visite page (/solutions/analyse-cv)         → 100 users
2. Commence formulaire                          → 75 users  (75%)
3. Complète étape 1/3                           → 60 users  (80% de 75)
4. Complète étape 2/3                           → 50 users  (83%)
5. Soumet formulaire                            → 45 users  (90%)
6. Reçoit résultats                             → 43 users  (96%)
7. Télécharge rapport                           → 25 users  (58%)
8. Clique "Optimiser CV"                        → 15 users  (35%)

Points de friction identifiés :
- Abandon étape 1 → 2 (20%) → Simplifier étape 1
- Faible téléchargement rapport (58%) → CTA plus visible
- Faible conversion optimisation (35%) → Meilleur call-to-action
```

## Diagramme : Carte des parcours (user journey map)

```
┌─────────────────────────────────────────────────────────┐
│                  PARCOURS MEW-MEW-AI                    │
└─────────────────────────────────────────────────────────┘

Phase          │ Découverte │ Considération │ Décision │ Usage │ Fidélisation
───────────────┼────────────┼───────────────┼──────────┼───────┼──────────────
               │            │               │          │       │
Point contact  │ Google     │ Landing page  │ Signup   │ CV    │ Dashboard
               │ Pub social │ Témoignages   │ Email    │ Port- │ Newsletter
               │            │               │ verif    │ folio │ Premium?
               │            │               │          │       │
Objectif user  │ Trouver    │ Comprendre    │ Tester   │ Géné- │ Optimiser
               │ solution   │ valeur        │ gratuit  │ rer   │ parcours
               │            │               │          │       │
Émotion        │ Curieux    │ Intéressé     │ Confiant │ Satis-│ Engagé
               │            │               │          │ fait  │
Friction       │ Confiance? │ Trop cher?    │ Trop     │ IA    │ Manque
               │            │ Trop complexe?│ long?    │ lente?│ features?
               │            │               │          │       │
Opportunité    │ SEO        │ Social proof  │ SSO      │ Feed- │ Upgrade
               │ Content    │ Vidéo démo    │ Google   │ back  │ Pro
               │            │               │          │ temps │
               │            │               │          │ réel  │
```

## Checklist pratique

### ✅ Cartographier les parcours

- [ ] Identifier les 3-5 parcours critiques (acquisition, activation, conversion)
- [ ] Lister toutes les étapes de chaque parcours
- [ ] Identifier les points de friction (où les users abandonnent)
- [ ] Mesurer les taux de conversion à chaque étape

### ✅ Réduire les frictions

- [ ] Formulaires découpés en max 3-5 champs par étape
- [ ] Pré-remplissage automatique (email, profil)
- [ ] Sauvegarde automatique brouillons
- [ ] Validation en temps réel (pas d'erreur surprise)
- [ ] SSO (Google, LinkedIn) pour signup rapide

### ✅ Guider l'utilisateur

- [ ] CTA primaire clairement identifiable
- [ ] Indicateur de progression (étapes formulaire)
- [ ] Suggestions contextuelles ("Prochaine étape recommandée")
- [ ] Breadcrumb navigation sur pages profondes
- [ ] Messages de succès après actions

### ✅ Optimiser les conversions

- [ ] CTA "above the fold" (visible sans scroll)
- [ ] Témoignages / social proof sur landing
- [ ] Urgency / scarcity (si pertinent, sans manipulation)
- [ ] A/B testing CTA (texte, couleur, position)
- [ ] Exit intent popup (si abandon)

### ✅ Mesurer et améliorer

- [ ] Analytics installé (Plausible, GA4, Mixpanel)
- [ ] Tracking événements clés (start, step, submit, success)
- [ ] Funnel de conversion configuré
- [ ] Heatmaps (Hotjar, Crazy Egg) sur pages critiques
- [ ] Session recordings (comprendre blocages)
- [ ] NPS / satisfaction survey après actions clés

## Erreurs à éviter

### ❌ Trop d'étapes (friction)

```
❌ MAUVAIS :
Landing → Signup → Verify email → Profil → Préférences → Tutorial → Dashboard → Solution
(8 étapes avant d'utiliser le produit)

✅ BON :
Landing → Signup (avec SSO) → Dashboard → Solution
(3 étapes, email verification en background)
```

### ❌ CTA multiples (confusion)

```jsx
// ❌ MAUVAIS : 5 boutons au même niveau
<div>
  <Button variant="primary">Analyser CV</Button>
  <Button variant="primary">Optimiser CV</Button>
  <Button variant="primary">Créer portfolio</Button>
  <Button variant="primary">Générer CV</Button>
  <Button variant="primary">Contact</Button>
</div>

// ✅ BON : 1 CTA primaire, les autres secondaires
<div>
  <Button variant="primary" size="lg">
    Commencer avec l'analyse CV
  </Button>
  <div className="flex gap-3 mt-4">
    <Button variant="ghost" size="sm">Optimiser CV</Button>
    <Button variant="ghost" size="sm">Portfolio</Button>
  </div>
</div>
```

### ❌ Pas de feedback pendant traitement

```jsx
// ❌ MAUVAIS : Utilisateur ne sait pas ce qui se passe
async function handleSubmit() {
  await analyzeCV(data); // 30 secondes sans feedback
}

// ✅ BON : Feedback progressif
async function handleSubmit() {
  setStatus('loading');
  setProgress('Envoi des données...');

  setTimeout(() => setProgress('Analyse en cours (50%)...'), 5000);
  setTimeout(() => setProgress('Finalisation (90%)...'), 15000);

  await analyzeCV(data);
  setStatus('success');
}
```

## Ressources & Outils

### Cartographie parcours
- [Miro](https://miro.com/) - User journey maps
- [Whimsical](https://whimsical.com/) - Flowcharts
- [Figjam](https://www.figma.com/figjam/) - Brainstorming collaboratif

### Analytics & tracking
- [Plausible](https://plausible.io/) - Analytics simple, privacy-first
- [Mixpanel](https://mixpanel.com/) - Event tracking
- [Amplitude](https://amplitude.com/) - Product analytics
- [PostHog](https://posthog.com/) - Open-source analytics

### Heatmaps & session recordings
- [Hotjar](https://www.hotjar.com/) - Heatmaps + recordings + surveys
- [Microsoft Clarity](https://clarity.microsoft.com/) - Gratuit
- [Fullstory](https://www.fullstory.com/) - Session replay avancé

### A/B testing
- [Vercel Edge Config](https://vercel.com/docs/storage/edge-config) - Feature flags Next.js
- [Split.io](https://www.split.io/) - Feature flags + A/B testing
- [Optimizely](https://www.optimizely.com/) - Plateforme complète

---

**Prochaines étapes** : Documenter la consistance graphique pour garantir une identité cohérente.
