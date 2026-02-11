# Skills Marketing - Référence Technique

## Pourquoi ce dossier existe

Quand je travaille sur les aspects marketing de Mew-mew-Ai, j'utilise les compétences documentées ici :

- **Optimiser le SEO** de la plateforme (technique + contenu)
- **Créer des landing pages** qui convertissent
- **Rédiger du contenu** engageant (blog, pages, emails)
- **Analyser les performances** (analytics, KPIs, conversions)
- **Concevoir des funnels** d'acquisition et conversion
- **Optimiser les CTAs** (Call-to-Actions)

## Compétences disponibles dans ce dossier

Les fichiers de skills ici couvrent :

- **SEO** : On-page, technique, mots-clés, structured data
- **SEA** : Google Ads, Meta Ads (si campagnes payantes)
- **Content marketing** : Blog, guides, ressources
- **Funnel optimization** : TOFU, MOFU, BOFU (Top/Middle/Bottom of funnel)
- **Copywriting** : Headlines, CTAs, value propositions
- **Analytics** : Google Analytics, tracking, KPIs
- **Growth hacking** : Acquisition virale, referral

## Applications concrètes dans Mew-mew-Ai

### 1. SEO technique (Next.js)

**Optimisations actuelles** :
- ✅ **SSR par défaut** (Next.js App Router)
- ✅ **Metadata** dans `app/layout.js`
- ⚠️ **Sitemap.xml** (à générer)
- ⚠️ **Robots.txt** (à configurer)
- ⚠️ **Structured data** (JSON-LD à ajouter)

**Skills utilisés** :
- `skill_seo.md` : Optimisation on-page, meta tags, sitemap
- `skill_strategie_marketing.md` : Positionnement, mots-clés cibles

**Exemples d'utilisation** :
- "Améliore le SEO de la page d'accueil" → J'optimise title, meta description, headings (h1, h2), structured data
- "Crée le sitemap.xml" → J'utilise `next-sitemap` ou génère manuellement
- "Ajoute le JSON-LD pour les templates CV" → Je structure les données (Product schema)

### 2. Landing page (conversion)

**Page actuelle** : `frontend-v2/app/page.js`

**Structure optimale** :
1. **Hero** : Headline + value proposition + CTA principal
2. **Problème** : Pain points de la cible (chercheurs d'emploi)
3. **Solution** : Fonctionnalités (analyseur, optimiseur, portfolio)
4. **Bénéfices** : Ce que ça apporte concrètement
5. **Social proof** : Témoignages, stats (si disponibles)
6. **Pricing** : Transparence des offres
7. **FAQ** : Répondre aux objections
8. **CTA final** : Rappel de l'action à faire

**Skills utilisés** :
- `skill_copywriting.md` : Headlines percutants, value props
- `skill_funnel.md` : Structurer le parcours de conversion

**Exemples d'utilisation** :
- "Refais la landing page" → J'applique la structure AIDA (Attention, Intérêt, Désir, Action)
- "Optimise les CTAs" → Je rends les boutons visibles, textes action-oriented ("Analyser mon CV" > "En savoir plus")
- "Ajoute une section social proof" → Je conçois témoignages, logos clients, stats

### 3. Pages de solutions (SEO + conversion)

**Pages actuelles** :
- `/solutions/analyse-cv`
- `/solutions/optimiseur-cv`
- `/solutions/portfolio`

**Optimisations** :
- **Title tags** : "[Solution] - Mew-mew-Ai | [Bénéfice]"
- **Meta descriptions** : 150-160 caractères, include CTA
- **Headings** : h1 unique, h2/h3 structurés
- **Mots-clés** : Analyse sémantique, synonymes, longue traîne

**Skills utilisés** :
- `skill_seo.md` : Optimisation on-page
- `skill_content_marketing.md` : Rédaction orientée SEO

**Exemples d'utilisation** :
- "Optimise la page analyseur CV pour le SEO" → J'enrichis le contenu, ajoute FAQ, mots-clés longue traîne
- "Crée la page /templates-cv" → Je structure avec headings, images (next/image), mots-clés

### 4. Blog (content marketing)

**Objectif** : Attirer du trafic organique via du contenu de valeur

**Structure recommandée** :
```
app/blog/
├── page.js              # Liste des articles
└── [slug]/
    └── page.js          # Article individuel
```

**Topics** :
- "Comment optimiser son CV pour les ATS"
- "10 erreurs fréquentes dans un CV"
- "Guide complet du portfolio professionnel"
- "Préparer un entretien d'embauche : méthode STAR"

**Skills utilisés** :
- `skill_content_marketing.md` : Calendrier éditorial, SEO, storytelling
- `skill_seo.md` : Mots-clés, liens internes

**Exemples d'utilisation** :
- "Crée un article de blog sur l'optimisation CV" → Je rédige avec structure SEO (h2, h3, lists, images)
- "Génère 10 idées d'articles" → J'utilise keyword research, questions fréquentes

### 5. Emails transactionnels (Resend)

**Types d'emails** :
- Bienvenue (signup)
- Confirmation d'action (portfolio publié, CV généré)
- Contact portfolio (déjà implémenté)
- Newsletter (futur)

**Skills utilisés** :
- `skill_copywriting.md` : Subject lines, CTAs
- `skill_email_marketing.md` : Structure, personnalisation

**Exemples d'utilisation** :
- "Rédige l'email de bienvenue" → Je structure : accueil chaleureux, bénéfices, premiers pas, CTA
- "Améliore le template email contact" → J'améliore le design (HTML), clarté, branding

### 6. Analytics & KPIs

**Outils à implémenter** :
- Google Analytics 4 (GA4)
- Google Search Console
- Plausible (alternative privacy-friendly)

**KPIs à tracker** :
- **Trafic** : Visites, utilisateurs uniques, sources
- **Engagement** : Taux de rebond, temps sur page, pages/session
- **Conversion** : Inscriptions, CV générés, portfolios créés
- **SEO** : Positionnement mots-clés, CTR, impressions

**Skills utilisés** :
- `skill_analytics.md` : Configuration, tracking, interprétation

**Exemples d'utilisation** :
- "Implémente Google Analytics" → J'ajoute le script GA4, configure events (signup, cv_generated)
- "Crée un dashboard des KPIs" → Je liste les métriques clés, configure le tracking

## Principes marketing appliqués

### SEO on-page (checklist)

- [ ] **Title tag** : 50-60 caractères, mot-clé principal au début
- [ ] **Meta description** : 150-160 caractères, include CTA
- [ ] **URL** : Courte, descriptive, hyphens (pas underscores)
- [ ] **H1** : Un seul par page, mot-clé principal
- [ ] **H2/H3** : Structure sémantique, mots-clés secondaires
- [ ] **Images** : Alt texts descriptifs, formats modernes (WebP), lazy loading
- [ ] **Liens internes** : Maillage vers pages connexes
- [ ] **Structured data** : JSON-LD (Organization, Product, Article)

### Copywriting (formules)

**AIDA** :
- **Attention** : Headline percutant
- **Intérêt** : Problème + solution
- **Désir** : Bénéfices, social proof
- **Action** : CTA clair

**PAS** :
- **Problème** : Pain point de la cible
- **Agitation** : Conséquences du problème
- **Solution** : Ce que vous proposez

**FAB** :
- **Features** : Fonctionnalités (analyseur CV)
- **Advantages** : Avantages (gain de temps)
- **Benefits** : Bénéfices (décrocher plus d'entretiens)

### CTAs efficaces

❌ "En savoir plus" → ✅ "Analyser mon CV gratuitement"
❌ "Cliquez ici" → ✅ "Créer mon portfolio maintenant"
❌ "Soumettre" → ✅ "Optimiser mon CV"

**Principes** :
- Action-oriented (verbe à l'impératif)
- Bénéfice clair (gratuit, maintenant, facile)
- Contraste visuel (bouton qui ressort)
- Au-dessus du pli (fold)

## Bonnes pratiques pour Mew-mew-Ai

### ✅ À FAIRE

- **Mots-clés naturels** : Pas de keyword stuffing, écrire pour l'humain d'abord
- **Mobile-first** : Design responsive (Next.js + Tailwind le font déjà)
- **Vitesse** : Optimiser Core Web Vitals (Lighthouse score > 90)
- **Contenu de valeur** : Guides, tutos, ressources gratuites (lead magnets)
- **CTAs multiples** : Au moins 3 par page (hero, middle, footer)
- **Social proof** : Témoignages, logos, stats (si disponibles)

### ❌ À ÉVITER

- **Keyword stuffing** : Répétition excessive de mots-clés
- **Clickbait** : Promesses exagérées (déception = bounce)
- **Manque de CTAs** : L'utilisateur doit toujours savoir quoi faire
- **Trop de choix** : Paradoxe du choix (simplifier les options)
- **Ignorer les analytics** : Décisions basées sur des données, pas des intuitions
- **Pas de A/B testing** : Tester headlines, CTAs, layouts

## Outils de référence

### SEO
- **Google Search Console** : Indexation, erreurs, performances
- **Google Keyword Planner** : Recherche de mots-clés
- **Ubersuggest** : Alternative gratuite
- **Screaming Frog** : Audit SEO technique

### Analytics
- **Google Analytics 4** : Tracking complet
- **Plausible** : Alternative privacy-friendly
- **Hotjar** : Heatmaps, enregistrements sessions

### Copywriting
- **Hemingway Editor** : Simplifier le texte
- **Grammarly** : Correction orthographe/grammaire
- **CoSchedule Headline Analyzer** : Tester headlines

## Mots-clés cibles pour Mew-mew-Ai

### Primaires (forte concurrence)
- créer un cv
- générateur de cv
- portfolio professionnel
- optimiser cv

### Longue traîne (moins de concurrence, meilleure conversion)
- comment créer un cv pour les ATS
- générateur de cv gratuit en ligne
- créer un portfolio développeur
- optimiser cv pour recruteur
- templates cv modernes gratuits

## Relation avec les autres domaines

- **Design** : Landing pages, CTAs visuels, brand identity
- **Web** : SEO technique, performance, structured data
- **Communication** : Storytelling, copywriting, brand voice

## Évolution des skills

Au fur et à mesure, j'enrichis ce dossier avec :
- Mots-clés performants (basés sur les analytics)
- Templates de landing pages (A/B testés)
- Exemples de CTAs qui convertissent
- Structures d'articles de blog SEO-friendly

---

**Utilisation** : Référence technique pour Claude lors de l'optimisation marketing de Mew-mew-Ai
**Dernière mise à jour** : Février 2026
