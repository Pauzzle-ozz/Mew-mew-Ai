# Skills Finance - Référence Technique

## Pourquoi ce dossier existe

**Note** : Le domaine finance n'est pas encore développé dans Mew-mew-Ai, mais ces compétences peuvent être utiles pour :

- **Créer la page de pricing** (tarification de la plateforme)
- **Gérer les abonnements** (si modèle SaaS payant)
- **Comprendre le business model** (gratuit, freemium, premium)
- **Calculer les métriques SaaS** (MRR, churn, LTV, CAC)
- **Conseiller sur la monétisation** (quand/comment faire payer)

## Compétences disponibles dans ce dossier

Les fichiers de skills ici couvrent :

- **Gestion de budget** : Budgets perso/entreprise (si fonctionnalité future)
- **Investissement** : Pas directement utile pour le projet actuel
- **Produits financiers** : Pas applicable
- **Métriques SaaS** : MRR, ARR, churn, LTV, CAC, burn rate
- **Pricing strategy** : Comment tarifer les fonctionnalités

## Applications concrètes dans Mew-mew-Ai

### 1. Page de pricing (si monétisation)

**Modèles possibles** :
- **Freemium** : Gratuit de base, payant pour fonctionnalités avancées
  - Gratuit : 3 CV générés/mois, 1 portfolio
  - Pro : Illimité, templates premium, analytics portfolio

- **Tiered** : Plusieurs niveaux
  - Free : Limité
  - Starter : 9€/mois
  - Pro : 19€/mois
  - Business : 49€/mois

- **Pay-per-use** : Paiement à l'usage
  - 1 crédit = 1 CV généré
  - Pack de 10 crédits = 5€

**Skills utilisés** :
- `skill_pricing_strategy.md` : Psychologie du pricing, ancrage
- `skill_metriques_saas.md` : Calculer le bon prix (LTV > CAC)

**Exemples d'utilisation** :
- "Crée la page de pricing" → Je conçois les tiers, highlight du plan recommandé (Pro)
- "Définis la stratégie de pricing" → J'analyse la valeur apportée, le marché, la concurrence

### 2. Métriques SaaS (suivi de performance)

**Métriques clés à tracker (si payant)** :

| Métrique | Définition | Objectif |
|----------|------------|----------|
| **MRR** | Monthly Recurring Revenue (revenus récurrents mensuels) | Croissance |
| **Churn** | % d'utilisateurs qui partent chaque mois | < 5% |
| **LTV** | Lifetime Value (valeur vie client) | > 3x CAC |
| **CAC** | Customer Acquisition Cost (coût d'acquisition) | < LTV/3 |
| **ARR** | Annual Recurring Revenue (revenus annuels) | Croissance |

**Skills utilisés** :
- `skill_metriques_saas.md` : Calculer, interpréter, optimiser

**Exemples d'utilisation** :
- "Calcule le LTV/CAC ratio" → J'aide à déterminer si l'acquisition est rentable
- "Crée un dashboard des métriques SaaS" → Je liste les KPIs financiers à suivre

### 3. Intégration de paiement (Stripe)

**Si monétisation** :
- Stripe pour les paiements (carte bancaire, SEPA)
- Webhooks pour gérer les abonnements
- Gestion des invoices

**Stack technique** :
- Frontend : Stripe.js (checkout)
- Backend : Stripe Node SDK (webhooks, subscriptions)
- Database : Table `subscriptions` (user_id, plan, status, stripe_customer_id)

**Skills utilisés** :
- `skill_paiements.md` : Intégration Stripe, gestion abonnements

**Exemples d'utilisation** :
- "Implémente Stripe pour les abonnements" → J'intègre checkout, webhooks, dashboard
- "Gère les changements de plan" → Je code upgrade/downgrade/cancel

### 4. Business model (gratuit vs payant)

**Stratégies possibles** :

**Option 1 : Tout gratuit (monétisation indirecte)**
- Revenus : Publicité, affiliation, partenariats
- Avantages : Croissance rapide, viralité
- Inconvénients : Difficile de scaler, dépendance aux partenaires

**Option 2 : Freemium**
- Gratuit : Fonctionnalités de base (limité)
- Payant : Fonctionnalités avancées
- Avantages : Acquisition facile, conversion des power users
- Inconvénients : Risque de cannibalisation

**Option 3 : Premium uniquement**
- Tout payant dès le départ (essai gratuit 7-14 jours)
- Avantages : Revenus immédiats, qualification des utilisateurs
- Inconvénients : Barrière à l'entrée, croissance plus lente

**Skills utilisés** :
- `skill_business_model.md` : Analyser les options, choisir

**Exemples d'utilisation** :
- "Quelle stratégie de monétisation pour Mew-mew-Ai ?" → J'analyse les options, recommande freemium

### 5. Fonctionnalités gratuites vs payantes (ligne de partage)

**Recommandation freemium Mew-mew-Ai** :

| Fonctionnalité | Gratuit | Pro |
|----------------|---------|-----|
| Analyse CV | 3/mois | Illimité |
| Optimisation CV | 1/mois | Illimité |
| Génération CV | 3/mois | Illimité |
| Templates CV | 3 basiques | 6 (dont premium) |
| Portfolio | 1 | 3 |
| Portfolio analytics | ❌ | ✅ (vues, clics, sources) |
| Custom domain portfolio | ❌ | ✅ |
| Enlever "Powered by Mew-mew-Ai" | ❌ | ✅ |
| Support prioritaire | ❌ | ✅ |

**Skills utilisés** :
- `skill_pricing_strategy.md` : Équilibrer valeur gratuite et payante

**Exemples d'utilisation** :
- "Définis les limites du plan gratuit" → J'équilibre acquisition (généreux) et conversion (frustration ciblée)

## Bonnes pratiques pricing SaaS

### ✅ À FAIRE

- **Transparence** : Prix clairement affichés, pas de frais cachés
- **Essai gratuit** : 7-14 jours sans carte bancaire (augmente conversion)
- **Highlight du plan recommandé** : Visuel (badge "Populaire", couleur)
- **Annuel avec réduction** : -20% si paiement annuel (améliore MRR)
- **Ancrage de prix** : Afficher un plan cher pour rendre le moyen attractif
- **FAQ pricing** : Répondre aux objections (remboursement, changement de plan)

### ❌ À ÉVITER

- **Trop de tiers** : Max 3-4 plans (paradoxe du choix)
- **Différences floues** : Chaque plan doit avoir une cible claire
- **Tarification complexe** : Prix au crédit difficile à comprendre
- **Pas d'essai gratuit** : Barrière psychologique trop forte
- **Forcer la carte bancaire** : Convertit moins bien que sans CB

## Outils de référence

### Paiements
- **Stripe** : Paiements en ligne, abonnements (recommandé)
- **PayPal** : Alternative grand public
- **Lemon Squeezy** : Tout-en-un (paiement + facturation + taxes)

### Analytics SaaS
- **ChartMogul** : MRR, churn, LTV
- **Baremetrics** : Dashboards Stripe
- **Google Analytics** : Comportement utilisateurs

### Pricing inspiration
- **Price Intelligently** : Recherche sur le pricing
- **Pricingpage.xyz** : Exemples de pages pricing

## Psychologie du pricing

### Ancrage de prix
Afficher un plan cher (même si peu l'achètent) rend le plan moyen attractif.

**Exemple** :
- Free : 0€
- **Pro : 19€/mois** ← Semble raisonnable
- Enterprise : 99€/mois ← Ancrage (fait paraître Pro pas cher)

### Prix charm (9,99€ vs 10€)
19€ vs 20€ : différence psychologique importante (même si minime)

### Présentation annuelle
Montrer le prix mensuel même si facturation annuelle :
- "19€/mois (facturé 228€/an)" → Plus digeste que "228€/an"

## Relation avec les autres domaines

- **Marketing** : Page de pricing, conversion, CTAs
- **Design** : Design de la page pricing (comparaison, CTAs)
- **Web** : Intégration Stripe, webhooks, gestion abonnements

## Évolution des skills

Si Mew-mew-Ai implémente la monétisation, j'enrichis ce dossier avec :
- Retours sur la stratégie de pricing choisie
- Taux de conversion par plan
- A/B tests sur la page pricing
- Gestion des edge cases (remboursements, upgrades, downgrades)

---

**Utilisation** : Référence technique pour Claude si Mew-mew-Ai implémente la monétisation
**État** : Domaine non encore développé (préparation future)
**Dernière mise à jour** : Février 2026
