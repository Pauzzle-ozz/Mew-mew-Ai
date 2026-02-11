# Skills Web - Référence Technique

## Pourquoi ce dossier existe

Quand je développe, optimise ou débogue Mew-mew-Ai, j'utilise les compétences documentées ici :

- **Développer des fonctionnalités** (frontend Next.js, backend Express)
- **Optimiser les performances** (Core Web Vitals, bundle size, caching)
- **Assurer la sécurité** (OWASP, authentification, validation)
- **Garantir l'accessibilité** (WCAG, semantic HTML, ARIA)
- **Déployer et maintenir** (CI/CD, monitoring, debugging)
- **Refactorer le code** (clean code, patterns, architecture)

## Stack technique de référence (Mew-mew-Ai)

### Frontend
- **Next.js 16.1.4** (App Router, React Server Components)
- **React 19.2.3** (JSX, hooks, composants)
- **Tailwind CSS 4** (PostCSS plugin, utility-first)
- **Supabase JS** (client pour auth + database)
- **qrcode.react** (génération QR codes portfolio)

### Backend
- **Express 5.2.1** (serveur Node.js)
- **Supabase JS** (client avec `SUPABASE_SERVICE_KEY`)
- **Axios** (appels n8n webhooks)
- **Multer 2** (upload fichiers)
- **pdf-parse** (extraction texte PDF)
- **Puppeteer 24** (génération PDF)
- **Resend** (envoi emails)
- **dotenv** (variables d'environnement)

### Services externes
- **Supabase** (PostgreSQL + Auth + Storage)
- **n8n** (workflows IA, port 5678)
- **Resend** (API emails transactionnels)

### Outils dev
- **ESLint 9** + eslint-config-next
- **Nodemon** (rechargement auto backend)
- **Git** (version control)

## Applications concrètes dans le projet

### 1. Architecture Next.js (App Router)

**Structure actuelle** :
```
frontend-v2/app/
├── page.js                    # Landing page (/)
├── layout.js                  # Layout global (polices Geist, metadata)
├── globals.css                # Tailwind imports
├── login/page.js              # /login
├── signup/page.js             # /signup
├── dashboard/page.js          # /dashboard
├── p/[slug]/page.js           # /p/:slug (portfolio public)
└── solutions/
    ├── analyse-cv/page.js
    ├── optimiseur-cv/page.js
    └── portfolio/
        ├── page.js            # Liste portfolios
        └── [id]/edit/page.js  # Éditeur portfolio
```

**Skills utilisés** :
- `skill_architecture_web.md` : Routing, layouts, data fetching
- `skill_frontend.md` : React hooks, composants, états

**Exemples d'utilisation** :
- "Crée une nouvelle page /pricing" → Je suis la structure App Router, créer `app/pricing/page.js`
- "Refactore le dashboard" → J'applique les patterns React (composition, hooks custom)

### 2. Backend Express (API)

**Structure actuelle** :
```
backend/src/
├── server.js                  # Point d'entrée (port 5000)
├── routes/
│   ├── solutions.js           # CV (analyse, optimise, génère)
│   ├── portfolio.js           # CRUD portfolios + blocs + médias
│   ├── portfolioStats.js      # Compteur de vues
│   └── contact.js             # Envoi email
├── services/
│   ├── cvService.js           # Appels n8n pour CV
│   ├── portfolioService.js    # CRUD Supabase
│   ├── emailService.js        # Envoi via Resend
│   └── pdfService.js          # Génération PDF Puppeteer
└── templates/
    └── templateFactory.js     # 6 templates CV HTML
```

**Skills utilisés** :
- `skill_backend.md` : Express routes, middlewares, services
- `skill_api_design.md` : REST, validation, error handling

**Exemples d'utilisation** :
- "Crée une nouvelle route API /api/billing" → Je suis les patterns Express (routes, services, validation)
- "Refactore cvService pour le rendre testable" → J'applique dependency injection, separation of concerns

### 3. Performance & Core Web Vitals

**Objectifs** :
- LCP < 2.5s (Largest Contentful Paint)
- FID < 100ms (First Input Delay)
- CLS < 0.1 (Cumulative Layout Shift)

**Skills utilisés** :
- `skill_performance.md` : Optimisation images, code splitting, caching
- `skill_frontend.md` : next/image, dynamic imports

**Exemples d'utilisation** :
- "Optimise le temps de chargement de la landing page" → J'analyse Lighthouse, optimise images, CSS, JS
- "Réduis le bundle size" → J'utilise dynamic imports, tree shaking

### 4. Sécurité (OWASP Top 10)

**Checklist actuelle** :
- ✅ HTTPS (production)
- ✅ CORS (backend Express)
- ✅ Validation inputs (Multer, cvService)
- ✅ Authentification (Supabase Auth)
- ✅ Variables d'environnement (.env)
- ⚠️ Rate limiting (à implémenter)
- ⚠️ CSP headers (à implémenter)

**Skills utilisés** :
- `skill_securite.md` : OWASP, validation, sanitization

**Exemples d'utilisation** :
- "Ajoute le rate limiting sur les routes API" → J'utilise express-rate-limit
- "Sécurise l'upload de fichiers" → Je valide type MIME, taille, sanitize filenames

### 5. Accessibilité (WCAG)

**Standards** :
- WCAG AA minimum (objectif AAA)
- Semantic HTML
- Navigation clavier
- Screen reader friendly

**Skills utilisés** :
- `skill_accessibilite.md` : ARIA, focus management, alt texts

**Exemples d'utilisation** :
- "Améliore l'accessibilité du formulaire CV" → Je vérifie labels, focus states, erreurs
- "Rends le portfolio navigable au clavier" → J'ajoute tabindex, focus visible

## Bonnes pratiques pour Mew-mew-Ai

### ✅ Frontend (Next.js)

- **Server Components par défaut** : Sauf si interaction client nécessaire (`'use client'`)
- **next/image** : Pour toutes les images (optimisation auto)
- **next/font** : Pour Geist Sans/Mono (déjà configuré)
- **Hooks custom** : Centraliser la logique réutilisable (`useAuth`, `useCVAnalyzer`)
- **API clients centralisés** : `lib/api/cvApi.js`, `lib/api/portfolioApi.js`
- **Validation côté client** : Mais TOUJOURS revalider côté serveur

### ✅ Backend (Express)

- **Services layer** : Logique métier dans `services/`, pas dans `routes/`
- **Validation inputs** : TOUJOURS valider (multer, regex, types)
- **Error handling** : try/catch + messages explicites
- **Logging** : console.log temporaire OK, mais prévoir logger en prod (Winston, Pino)
- **Variables d'env** : `.env` dans `backend/src/.env` (PAS `backend/.env`)
- **Pas de secrets hardcodés** : Utiliser process.env

### ✅ Supabase

- **Service key côté backend** : `SUPABASE_SERVICE_KEY` (bypass RLS)
- **Anon key côté frontend** : `NEXT_PUBLIC_SUPABASE_ANON_KEY` (respecte RLS)
- **Row Level Security** : Actif sur toutes les tables
- **Storage buckets** : `portfolio-media` pour les médias utilisateurs

### ✅ Performance

- **Lazy loading** : Images (`next/image` le fait), composants (dynamic import)
- **Code splitting** : Automatique avec App Router, mais optimisable avec dynamic()
- **Compression** : Activer Gzip/Brotli sur le serveur
- **Caching** : Cache-Control headers, ISR (Incremental Static Regeneration)

### ❌ À ÉVITER

- **Fetch dans composants sans gestion erreur** : Toujours try/catch + loading state
- **Secrets dans le code** : Utiliser .env
- **console.log en production** : Utiliser un logger
- **Validation uniquement côté client** : Backend doit TOUJOURS valider
- **URLs hardcodées** : Actuellement `http://localhost:5000` (à rendre configurable via env)
- **Pas de tests** : OK pour MVP, mais prévoir (Jest, Playwright)

## Patterns de code récurrents

### Appel API frontend → backend

```javascript
// frontend-v2/lib/api/cvApi.js
export async function analyzeCV(cvData) {
  try {
    const response = await fetch('http://localhost:5000/api/solutions/analyse-cv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cvData)
    });

    if (!response.ok) throw new Error('Erreur API');

    return await response.json();
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
}
```

### Route Express → Service → Supabase

```javascript
// backend/src/routes/portfolio.js
router.post('/', async (req, res) => {
  try {
    const portfolio = await portfolioService.createPortfolio(
      req.body.userId,
      req.body
    );
    res.json({ success: true, data: portfolio });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// backend/src/services/portfolioService.js
async createPortfolio(userId, data) {
  const { data: portfolio, error } = await supabase
    .from('portfolios')
    .insert({ user_id: userId, ...data })
    .select()
    .single();

  if (error) throw error;
  return portfolio;
}
```

## Outils de développement

### VS Code Extensions (recommandées)
- **ES7+ React snippets** : Snippets React (rafce, etc.)
- **ESLint** : Linting automatique
- **Tailwind IntelliSense** : Autocomplétion Tailwind
- **Path Intellisense** : Autocomplétion chemins

### Debugging
- **Chrome DevTools** : Network, Console, Performance
- **React DevTools** : Components, Profiler
- **Thunder Client** (VS Code) : Tester les APIs

### Performance
- **Lighthouse** (Chrome DevTools) : Audit complet
- **WebPageTest** : Tests approfondis
- **Bundle Analyzer** : Analyser le bundle JS

### Sécurité
- **npm audit** : Vulnérabilités dépendances
- **OWASP ZAP** : Scan de vulnérabilités

## Commandes utiles

```bash
# Frontend
cd frontend-v2
npm run dev        # Démarrer Next.js (port 3000)
npm run build      # Build production
npm run lint       # Vérifier ESLint

# Backend
cd backend
npm run dev        # Démarrer Express avec nodemon (port 5000)
npm start          # Démarrer Express production

# n8n
n8n start          # Démarrer n8n (port 5678)
```

## Points d'attention spécifiques Mew-mew-Ai

### 1. Backend .env est dans src/
❌ `backend/.env` (n'existe pas)
✅ `backend/src/.env` (bon chemin)

### 2. URLs hardcodées dans le frontend
⚠️ `lib/api/cvApi.js` et `lib/api/portfolioApi.js` utilisent `http://localhost:5000`
→ À rendre configurable via `NEXT_PUBLIC_API_URL` pour la production

### 3. n8n est requis pour l'analyse/optimisation CV
Si n8n n'est pas lancé → Erreur `ECONNREFUSED`
→ Backend retourne HTTP 503 avec message explicite

### 4. Fichier dupliqué
- `backend/src/emailService.js` (doublon inutilisé)
- `backend/src/services/emailService.js` (utilisé)
→ Supprimer le doublon

## Évolution technique prévue

### Court terme
- [ ] Migration TypeScript (frontend + backend)
- [ ] Tests automatisés (Jest, Playwright)
- [ ] CI/CD (GitHub Actions)
- [ ] Monitoring (Sentry)

### Moyen terme
- [ ] Variables d'env configurables (API URLs)
- [ ] Rate limiting
- [ ] CSP headers
- [ ] Design system documenté (Storybook)

### Long terme
- [ ] Microservices par domaine (emploi, finance, etc.)
- [ ] Architecture event-driven
- [ ] Scalabilité horizontale

## Relation avec les autres domaines

- **Design** : J'implémente en code ce qui est conçu visuellement
- **Marketing** : SEO technique, performance, analytics
- **Communication** : Textes dynamiques, emails transactionnels

---

**Utilisation** : Référence technique pour Claude lors du développement de Mew-mew-Ai
**Dernière mise à jour** : Février 2026
