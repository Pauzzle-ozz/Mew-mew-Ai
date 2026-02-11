---
name: refonte site
description: Méthodologie de refonte complète d'un site web (audit, conception, implémentation).
---

# Skill : Refonte de Site Web pour Mew-mew-Ai

## Contexte du projet

Mew-mew-Ai peut nécessiter une refonte pour :
- **Nouvelle identité visuelle** : Logo, couleurs, typographie
- **Amélioration UX** : Parcours utilisateurs optimisés
- **Nouvelles fonctionnalités** : Solutions supplémentaires (fiscalité, marketing)
- **Performance** : Temps de chargement, SEO
- **Accessibilité** : WCAG AA minimum

## 1. Méthodologie de refonte (5 phases)

### Phase 1 : Audit & Analyse (1-2 semaines)

**Objectif** : Comprendre l'existant et identifier les problèmes

**Actions** :

**1.1 Audit technique**
```bash
# Performance (Lighthouse)
npm run build
npx lighthouse http://localhost:3000 --view

# Accessibilité (axe DevTools)
# Chrome DevTools > Lighthouse > Accessibility

# SEO
# Google Search Console, SEMrush, Ahrefs
```

**Checklist technique** :
- [ ] Temps de chargement (< 3s)
- [ ] Score Lighthouse (Performance, Accessibility, SEO, Best Practices)
- [ ] Erreurs console JavaScript
- [ ] Broken links (liens cassés)
- [ ] Images non optimisées (trop lourdes)
- [ ] Mobile-friendliness (Google Mobile-Friendly Test)

**1.2 Audit UX**
- [ ] Taux de conversion par page (Google Analytics)
- [ ] Taux de rebond (bounce rate)
- [ ] Parcours utilisateurs (Hotjar, Clarity)
- [ ] Heatmaps (cartes de chaleur des clics)
- [ ] Session recordings (enregistrements de sessions)

**1.3 Audit contenu**
- [ ] Pages obsolètes ou dupliquées
- [ ] Textes trop longs ou peu clairs
- [ ] Hiérarchie de l'information (titres H1-H6)
- [ ] Appels à l'action (CTA) manquants ou inefficaces

**1.4 Benchmark concurrentiel**
- Analyser 3-5 concurrents (fonctionnalités, design, UX)
- Identifier les best practices
- Repérer les opportunités de différenciation

**Livrables Phase 1** :
- Rapport d'audit (PDF)
- Liste des problèmes priorisés (critical, high, medium, low)
- Recommandations chiffrées (KPIs actuels vs objectifs)

---

### Phase 2 : Stratégie & Conception (2-3 semaines)

**Objectif** : Définir la vision et l'architecture cible

**Actions** :

**2.1 Définition des objectifs**
```
Objectifs SMART :
- Réduire le taux de rebond de 60% à 40% (Spécifique, Mesurable)
- Augmenter les conversions (inscriptions) de 2% à 5% (Atteignable)
- Améliorer le score Lighthouse de 65 à 90+ (Réaliste)
- Délai : 3 mois après lancement (Temporel)
```

**2.2 Personas utilisateurs**
```
Persona 1 : Chercheur d'emploi (25-35 ans)
- Objectif : Trouver un emploi rapidement
- Pain points : CV pas assez optimisé, manque de visibilité
- Solutions : Analyseur CV, Optimiseur CV, Portfolio Pro

Persona 2 : Professionnel en reconversion (35-50 ans)
- Objectif : Changer de carrière
- Pain points : Valoriser les compétences transférables
- Solutions : Analyse CV, Portfolio pour montrer projets perso

Persona 3 : Freelance/Indépendant (25-45 ans)
- Objectif : Trouver des clients
- Pain points : Pas de portfolio professionnel
- Solutions : Portfolio Pro avec QR code et contact
```

**2.3 Sitemap (architecture de l'information)**
```
Mew-mew-Ai (/) ← Landing page repensée
|
|-- Solutions (refonte)
|   |-- Emploi-Carrière (/solutions/emploi)
|   |   |-- Analyser CV (refonte UI/UX)
|   |   |-- Optimiser CV (nouvelle feature : comparaison avant/après)
|   |   |-- Portfolio Pro (refonte éditeur)
|   |   |-- Lettre de motivation IA (nouvelle)
|   |
|   |-- Fiscalité (/solutions/fiscalite) ← Nouvelle solution
|   |   |-- Déclaration auto-entrepreneur
|   |   |-- Optimisation fiscale
|   |
|   |-- Marketing (/solutions/marketing) ← Nouvelle solution
|       |-- Générateur de posts LinkedIn
|       |-- Analyse de marché IA
|
|-- Pricing (nouvelle page)
|-- Blog (nouveau)
|-- Dashboard (refonte complète)
```

**2.4 Wireframes (croquis basse fidélité)**

Créer des wireframes pour :
- Landing page (nouvelle structure)
- Dashboard (nouvelle organisation)
- Pages de solutions (formulaires optimisés)
- Portfolio éditeur (nouvelle UI)

**Outils** : Figma, Sketch, Adobe XD, ou papier-crayon

**2.5 Design system (nouvelle charte)**
- Nouvelle palette de couleurs (si rebranding)
- Nouvelle typographie (si nécessaire)
- Nouveaux composants UI (buttons, cards, forms)
- Voir [skill_design_system.md](../design/skill_design_system.md)

**Livrables Phase 2** :
- Personas (PDF)
- Sitemap (schéma)
- Wireframes (Figma)
- Design system (documentation)

---

### Phase 3 : Design UI/UX (3-4 semaines)

**Objectif** : Créer les maquettes haute fidélité

**Actions** :

**3.1 Maquettes desktop (Figma)**
- Landing page (hero, solutions, testimonials, pricing, FAQ, footer)
- Dashboard (vue d'ensemble, navigation)
- Pages de solutions (formulaires, résultats)
- Éditeur de portfolio (nouvelle interface)
- Pages légales (terms, privacy, legal)

**3.2 Maquettes mobile**
- Toutes les pages principales en version mobile
- Menu hamburger
- Formulaires responsive

**3.3 Prototype interactif (Figma)**
- Créer un prototype cliquable (flows complets)
- Tester avec 5-10 utilisateurs (A/B tests)
- Itérer selon les retours

**3.4 Design system finalisé**
- Composants UI dans Figma (library)
- Tokens de design (couleurs, espacements, polices)
- Guidelines d'utilisation

**Livrables Phase 3** :
- Maquettes desktop (Figma)
- Maquettes mobile (Figma)
- Prototype interactif (lien Figma)
- Design system (Figma library)

---

### Phase 4 : Développement (6-8 semaines)

**Objectif** : Implémenter le nouveau design

**Actions** :

**4.1 Mise en place de l'environnement**
```bash
# Créer une branche de refonte
git checkout -b refonte-v2

# Installer les dépendances mises à jour
cd frontend-v2
npm install

# Créer un dossier pour les nouveaux composants
mkdir -p components/v2
```

**4.2 Implémentation du design system**
```jsx
// components/v2/Button.jsx (nouveau composant avec variants)
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  ...props
}) {
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
  };

  return (
    <button
      className={`${variants[variant]} ${sizes[size]} rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
      {...props}
    >
      {children}
    </button>
  );
}
```

**4.3 Refonte des pages principales**
- Landing page (nouvelle structure)
- Dashboard (nouvelle organisation)
- Solutions (nouveaux formulaires)
- Portfolio éditeur (nouvelle UI)

**4.4 Migration progressive**
```jsx
// Utiliser des feature flags pour basculer progressivement
const useV2Design = process.env.NEXT_PUBLIC_USE_V2_DESIGN === 'true';

export default function LandingPage() {
  if (useV2Design) {
    return <LandingPageV2 />;
  }
  return <LandingPageV1 />;
}
```

**4.5 Tests**
- Tests unitaires (Jest, React Testing Library)
- Tests E2E (Playwright, Cypress)
- Tests de régression visuelle (Percy, Chromatic)
- Tests d'accessibilité (axe DevTools, Pa11y)

**Livrables Phase 4** :
- Code fonctionnel (branche refonte-v2)
- Composants v2 (components/v2/)
- Tests automatisés (coverage > 80%)

---

### Phase 5 : Lancement & Suivi (2 semaines)

**Objectif** : Déployer et mesurer l'impact

**Actions** :

**5.1 Pré-lancement**
- [ ] Backup complet de la base de données
- [ ] Tests finaux sur staging
- [ ] Review de sécurité (scan de vulnérabilités)
- [ ] SEO : redirections 301 si URLs changent
- [ ] Communication : email aux utilisateurs existants

**5.2 Déploiement progressif**
```bash
# Option 1 : Déploiement progressif (canary)
# 10% du trafic sur v2, puis 50%, puis 100%

# Option 2 : Déploiement d'un coup
git checkout main
git merge refonte-v2
git push origin main

# Déploiement automatique via Vercel
```

**5.3 Monitoring post-lancement**
```bash
# Surveiller les erreurs (Sentry)
# Monitorer la performance (Vercel Analytics)
# Suivre les conversions (Google Analytics 4)
```

**Métriques à suivre (1 mois)** :
- Temps de chargement (avant/après)
- Taux de conversion (inscriptions)
- Taux de rebond
- Score Lighthouse
- Retours utilisateurs (Hotjar surveys)

**5.4 Optimisations post-lancement**
- Corriger les bugs critiques sous 24h
- Ajuster le design selon les retours
- A/B tests (couleurs CTA, wording, etc.)

**Livrables Phase 5** :
- Site en production (v2)
- Rapport de performance (avant/après)
- Roadmap des optimisations futures

---

## 2. Checklist de refonte complète

### Avant de commencer
- [ ] Objectifs clairs et mesurables (KPIs)
- [ ] Budget et timeline validés
- [ ] Équipe constituée (designer, dev, PM)
- [ ] Stakeholders alignés

### Pendant la refonte
- [ ] Audit complet (technique, UX, contenu)
- [ ] Personas définis
- [ ] Sitemap validé
- [ ] Wireframes approuvés
- [ ] Maquettes desktop + mobile
- [ ] Prototype testé avec utilisateurs
- [ ] Design system implémenté
- [ ] Code review avant merge
- [ ] Tests automatisés (unit, E2E, a11y)

### Après le lancement
- [ ] Monitoring des erreurs (Sentry)
- [ ] Suivi des KPIs (Google Analytics)
- [ ] Retours utilisateurs collectés (Hotjar)
- [ ] Optimisations itératives (A/B tests)
- [ ] Documentation mise à jour

---

## 3. Erreurs à éviter lors d'une refonte

### ❌ Erreur 1 : Tout changer d'un coup

**Problème** : Perte de repères pour les utilisateurs existants

**Solution** : Refonte progressive (feature flags, déploiement canary)

### ❌ Erreur 2 : Ne pas impliquer les utilisateurs

**Problème** : Design qui ne correspond pas aux besoins réels

**Solution** : Tests utilisateurs dès les wireframes, itérations

### ❌ Erreur 3 : Oublier le SEO

**Problème** : Perte de trafic organique si URLs changent sans redirections

**Solution** : Redirections 301, conserver les URLs importantes, sitemap.xml

### ❌ Erreur 4 : Sous-estimer le temps de développement

**Problème** : Deadline non tenue, fonctionnalités manquantes

**Solution** : Buffer de 20-30% sur les estimations, MVP (Minimum Viable Product)

### ❌ Erreur 5 : Ne pas mesurer l'impact

**Problème** : Impossible de savoir si la refonte a réussi

**Solution** : Définir les KPIs avant, mesurer pendant 1-3 mois après

---

## 4. Outils recommandés pour une refonte

### Design
- **Figma** : Wireframes, maquettes, prototypes
- **Coolors** : Générateur de palettes
- **Google Fonts** : Polices web

### Audit & Analytics
- **Lighthouse** : Performance, accessibilité, SEO
- **Google Analytics 4** : Trafic, conversions
- **Hotjar** : Heatmaps, session recordings
- **Microsoft Clarity** : Alternative gratuite à Hotjar

### Tests
- **Jest** : Tests unitaires
- **Playwright** : Tests E2E
- **axe DevTools** : Accessibilité
- **Percy** : Tests de régression visuelle

### Déploiement
- **Vercel** : Hosting Next.js avec preview deployments
- **Sentry** : Monitoring des erreurs

---

## 5. Timeline recommandée (Mew-mew-Ai)

| Phase | Durée | Livrables |
|-------|-------|-----------|
| **1. Audit** | 1-2 semaines | Rapport d'audit, recommandations |
| **2. Stratégie** | 2-3 semaines | Personas, sitemap, wireframes |
| **3. Design** | 3-4 semaines | Maquettes, prototype, design system |
| **4. Développement** | 6-8 semaines | Code, composants v2, tests |
| **5. Lancement** | 2 semaines | Déploiement, monitoring, optimisations |
| **Total** | **14-19 semaines** | **Site refonte complet** |

---

## Checklist Refonte de Site

Avant de lancer une refonte :

- [ ] **Objectifs SMART** définis (Spécifique, Mesurable, Atteignable, Réaliste, Temporel)
- [ ] **Audit complet** réalisé (technique, UX, contenu, SEO)
- [ ] **Personas** validés (3-5 profils utilisateurs types)
- [ ] **Sitemap** restructuré (architecture d'information)
- [ ] **Wireframes** approuvés par stakeholders
- [ ] **Maquettes** desktop + mobile finalisées
- [ ] **Prototype** testé avec 5-10 utilisateurs
- [ ] **Design system** documenté et implémenté
- [ ] **Tests automatisés** en place (unit, E2E, a11y)
- [ ] **Plan de déploiement** validé (feature flags, canary)
- [ ] **Monitoring** configuré (Sentry, Analytics)
- [ ] **KPIs** définis pour mesurer le succès

---

**Utilisation** : Référence pour piloter une refonte complète de Mew-mew-Ai
**Dernière mise à jour** : Février 2026
