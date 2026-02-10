# Guide Complet - Mew-mew-Ai (Plateforme IA SaaS)

> **Projet** : Plateforme SaaS d'Intelligence Artificielle pour la recherche d'emploi
> **Pour qui ?** Ce guide est concu pour les debutants en programmation. Chaque etape est expliquee en detail.
> **Repository** : https://github.com/Pauzzle-ozz/Mew-mew-Ai

---

## Table des Matieres

1. [Vue d'ensemble du projet](#vue-densemble-du-projet)
2. [Prerequis et installations](#prerequis-et-installations)
3. [Structure complete du projet](#structure-complete-du-projet)
4. [Extensions VS Code recommandees](#extensions-vs-code-recommandees)
5. [Guide de demarrage](#guide-de-demarrage)
6. [Architecture technique](#architecture-technique)
7. [Integration OpenAI (IA directe)](#integration-openai-ia-directe)
8. [Explication detaillee du code](#explication-detaillee-du-code)
9. [Base de donnees Supabase](#base-de-donnees-supabase)
10. [API et Routes](#api-et-routes)
11. [Commandes utiles](#commandes-utiles)
12. [Variables d'environnement](#variables-denvironnement)
13. [Resolution des problemes](#resolution-des-problemes)
14. [Deploiement](#deploiement)
15. [Bonnes pratiques](#bonnes-pratiques)

---

## Vue d'ensemble du projet

### Qu'est-ce que Mew-mew-Ai ?

**Mew-mew-Ai** est une plateforme SaaS (Software as a Service) qui utilise l'Intelligence Artificielle pour aider les chercheurs d'emploi a :

- **Analyser leur CV** (formulaire ou PDF) et identifier les metiers correspondants
- **Optimiser leur CV** pour les ATS (systemes de recrutement) via formulaire ou PDF
- **Generer un CV PDF** a partir de donnees structurees avec 6 templates au choix
- **Creer un portfolio professionnel** avec editeur de blocs, medias, QR code et page publique
- **Suivre les statistiques** de leur portfolio (compteur de vues)
- **Recevoir des messages** via formulaire de contact integre au portfolio

### Technologies utilisees

#### Frontend (Interface utilisateur)
- **Next.js 16.1.4** - Framework React avec App Router
- **React 19.2.3** - Bibliotheque JavaScript pour creer des interfaces
- **Tailwind CSS 4** - Framework CSS (via `@tailwindcss/postcss`)
- **Supabase JS** - Client pour authentification + base de donnees
- **qrcode.react** - Generation de QR codes pour les portfolios
- **Polices Geist** - Geist Sans + Geist Mono (via `next/font/google`)

#### Backend (Serveur)
- **Express.js 5.2.1** - Framework Node.js pour creer des APIs
- **Node.js** - Environnement JavaScript cote serveur
- **OpenAI SDK** - Client officiel pour appeler l'API OpenAI (GPT-4o, GPT-4.1-mini)
- **Axios** - Client HTTP pour le scraping d'URLs
- **Multer 2** - Gestion de l'upload de fichiers (PDF, images, videos)
- **pdf-parse** - Extraction de texte depuis les fichiers PDF
- **Puppeteer 24** - Generation de PDF a partir de HTML (headless Chrome)
- **Resend** - Service d'envoi d'emails transactionnels
- **docx** - Generation de documents Word (disponible mais non utilise actuellement)
- **CORS** - Communication frontend <-> backend
- **dotenv** - Variables d'environnement

#### Services externes
- **OpenAI API** - Intelligence artificielle (GPT-4o pour la generation, GPT-4.1-mini pour l'analyse et conversion JSON)
- **Supabase** - Base de donnees PostgreSQL + Auth + Storage (medias portfolio)
- **Resend** - API d'envoi d'emails

#### Outils de developpement
- **ESLint 9** + eslint-config-next - Detection d'erreurs
- **Nodemon** - Rechargement automatique du backend en dev
- **Git** - Gestion de versions

---

## Prerequis et installations

### Etape 1 : Installer Node.js (OBLIGATOIRE)

Node.js est le moteur qui fait tourner votre application.

1. **Telecharger** : https://nodejs.org/
2. **Choisir** : Version **LTS** (Long Term Support)
3. **Verifier** l'installation :

```bash
node --version   # v20.x.x ou v22.x.x
npm --version    # 10.x.x
```

Si les commandes ne fonctionnent pas : redemarrez votre ordinateur.

### Etape 2 : Installer VS Code

https://code.visualstudio.com/

### Etape 3 : Installer Git

https://git-scm.com/

```bash
git --version   # git version 2.x.x
```

### Etape 4 : Obtenir une cle API OpenAI (IMPORTANT - IA)

OpenAI fournit les modeles d'IA utilises par la plateforme. Sans cle API, les fonctionnalites d'analyse et d'optimisation ne fonctionneront pas.

1. Aller sur https://platform.openai.com/
2. Creer un compte ou se connecter
3. Aller dans API Keys et creer une nouvelle cle
4. Noter : `OPENAI_API_KEY` (commence par `sk-...`)

**Modeles utilises** :
- **GPT-4o** : Generation de CV personnalises, CV ideaux, lettres de motivation
- **GPT-4.1-mini** : Analyse de CV, optimisation, conversion JSON

### Etape 5 : Creer un compte Supabase

1. Aller sur https://supabase.com/
2. Se connecter avec GitHub
3. Creer un nouveau projet :
   - Project Name : `mew-mew-ai`
   - Database Password : Notez-le bien !
   - Region : Europe West
4. Noter :
   - `SUPABASE_URL` (Settings > API > Project URL)
   - `SUPABASE_ANON_KEY` (Settings > API > anon/public key)
   - `SUPABASE_SERVICE_KEY` (Settings > API > service_role key - SECRETE)

### Etape 6 : Creer un compte Resend (envoi d'emails)

1. Aller sur https://resend.com/
2. Creer un compte
3. Obtenir votre cle API
4. Noter : `RESEND_API_KEY`

---

## Structure complete du projet

```
Mew-mew-Ai/
|
|-- .gitignore                           # Fichiers ignores par Git
|-- README.md                            # Documentation du projet
|-- claude.md                            # Ce fichier - guide complet
|
|-- backend/                             # SERVEUR EXPRESS.JS
|   |-- package.json                     # Dependances backend
|   |-- package-lock.json
|   |
|   |-- src/                             # Code source backend
|       |-- .env                         # Variables d'environnement (SECRET)
|       |-- server.js                    # Point d'entree du serveur (port 5000)
|       |-- emailService.js             # Doublon de services/emailService.js
|       |
|       |-- routes/                      # Routes API (endpoints)
|       |   |-- solutions.js             # Routes analyseur + optimiseur + generateur CV
|       |   |-- portfolio.js             # Routes CRUD portfolios + blocs + medias
|       |   |-- portfolioStats.js        # Route compteur de vues
|       |   |-- contact.js               # Route envoi d'email de contact
|       |
|       |-- services/                    # Logique metier
|       |   |-- aiService.js             # Client OpenAI centralise (generate, generateJSON, generateThenConvert)
|       |   |-- cvService.js             # Service d'analyse/optimisation CV (appels OpenAI)
|       |   |-- matcherService.js        # Service de matching offres + generation documents
|       |   |-- scraperService.js        # Service de scraping d'URLs (Axios + Puppeteer)
|       |   |-- portfolioService.js      # Service CRUD portfolios + blocs + medias (Supabase)
|       |   |-- emailService.js          # Service d'envoi d'emails (Resend)
|       |   |-- pdfService.js            # Service de generation de PDF (Puppeteer)
|       |
|       |-- prompts/                     # Prompts IA (un fichier par workflow)
|       |   |-- helpers.js               # Fonctions de formatage partagees (offre, candidat, CV)
|       |   |-- jsonSchemas.js           # 5 prompts de conversion JSON
|       |   |-- analyseCvForm.js         # Prompt analyse CV formulaire
|       |   |-- analyseCvPdf.js          # Prompt analyse CV PDF
|       |   |-- optimiseCvForm.js        # Prompt optimisation CV formulaire
|       |   |-- optimiseCvPdf.js         # Prompt optimisation CV PDF
|       |   |-- matcherCvPersonnalise.js # Prompt matcher CV personnalise
|       |   |-- matcherCvIdeal.js        # Prompt matcher CV ideal
|       |   |-- matcherLettre.js         # Prompt matcher lettre de motivation
|       |   |-- scraperCvPersonnalise.js # Prompt scraper CV personnalise
|       |   |-- scraperCvIdeal.js        # Prompt scraper CV ideal
|       |   |-- scraperLettre.js         # Prompt scraper lettre de motivation
|       |
|       |-- templates/                   # Templates HTML pour CV
|       |   |-- templateFactory.js       # Factory avec 6 templates (moderne, classique, creatif, tech, executive, minimal)
|       |   |-- letterTemplateFactory.js # Factory pour lettres de motivation
|       |
|       |-- config/                      # (vide - reserve pour future config)
|       |-- utils/                       # (vide - reserve pour futurs utilitaires)
|
|-- frontend-v2/                         # INTERFACE NEXT.JS
    |-- .env.local                       # Variables d'environnement (SECRET)
    |-- package.json                     # Dependances frontend
    |-- package-lock.json
    |-- jsconfig.json                    # Alias de chemin (@/*)
    |-- next.config.mjs                  # Configuration Next.js (ESM)
    |-- postcss.config.mjs               # Configuration PostCSS + Tailwind CSS 4
    |-- eslint.config.mjs                # Configuration ESLint 9
    |
    |-- app/                             # Pages et routes Next.js (App Router)
    |   |-- page.js                      # Page d'accueil / Landing page
    |   |-- layout.js                    # Layout global (polices Geist, metadata)
    |   |-- globals.css                  # Styles globaux Tailwind
    |   |-- favicon.ico
    |   |
    |   |-- login/
    |   |   |-- page.js                  # Page de connexion
    |   |
    |   |-- signup/
    |   |   |-- page.js                  # Page d'inscription
    |   |
    |   |-- dashboard/
    |   |   |-- page.js                  # Tableau de bord utilisateur
    |   |
    |   |-- p/
    |   |   |-- [slug]/
    |   |       |-- page.js              # Page publique du portfolio (accessible par slug)
    |   |
    |   |-- solutions/
    |       |-- analyse-cv/
    |       |   |-- page.js              # Analyseur de CV (formulaire + PDF)
    |       |-- optimiseur-cv/
    |       |   |-- page.js              # Optimiseur de CV (formulaire + PDF)
    |       |-- portfolio/
    |           |-- page.js              # Liste et creation de portfolios
    |           |-- [id]/
    |               |-- edit/
    |                   |-- page.js      # Editeur de portfolio (blocs, medias, parametres)
    |
    |-- components/                      # Composants React reutilisables
    |   |-- cv/                          # Composants lies au CV
    |   |   |-- AnalyzerForm.jsx         # Formulaire d'analyse CV
    |   |   |-- CVFormIdentity.jsx       # Formulaire identite (prenom, nom, etc.)
    |   |   |-- CVTemplateSelector.jsx   # Selecteur de templates CV
    |   |   |-- FormatSelector.jsx       # Selecteur de format (PDF)
    |   |   |-- ResultsDisplay.jsx       # Affichage des resultats d'analyse
    |   |   |-- TemplatePreview.jsx      # Previsualisation d'un template
    |   |
    |   |-- shared/                      # Composants partages
    |       |-- ErrorMessage.jsx         # Messages d'erreur
    |       |-- ProgressBar.jsx          # Barre de progression
    |
    |-- hooks/                           # React Hooks personnalises
    |   |-- useAuth.js                   # Hook d'authentification (verifie user, redirige)
    |   |-- useCVAnalyzer.js             # Hook analyse CV
    |   |-- useCVOptimizer.js            # Hook optimisation CV
    |
    |-- lib/                             # Bibliotheques et configs
    |   |-- supabase.js                  # Client Supabase (createClient)
    |   |
    |   |-- api/                         # Clients API centralises
    |   |   |-- cvApi.js                 # Appels API backend pour CV (analyse, optimise, genere)
    |   |   |-- portfolioApi.js          # Appels API backend pour portfolios + blocs + medias
    |   |
    |   |-- constants/                   # Constantes de l'application
    |   |   |-- templates.js             # Definition des 6 templates CV (metadata)
    |   |
    |   |-- utils/                       # Fonctions utilitaires
    |       |-- cvParser.js              # Parse le texte d'un CV (email, tel, nom)
    |       |-- fileHelpers.js           # Validation PDF, base64 -> blob, download
    |
    |-- public/                          # Fichiers statiques
        |-- file.svg
        |-- globe.svg
        |-- next.svg
        |-- vercel.svg
        |-- window.svg
```

---

## Extensions VS Code recommandees

### Essentielles

| Extension | ID | Utilite |
|---|---|---|
| ES7+ React snippets | `dsznajder.es7-react-js-snippets` | Snippets React (rafce, etc.) |
| ESLint | `dbaeumer.vscode-eslint` | Detection d'erreurs JS |
| Prettier | `esbenp.prettier-vscode` | Formatage automatique |
| Tailwind IntelliSense | `bradlc.vscode-tailwindcss` | Autocompletion Tailwind CSS 4 |
| Auto Rename Tag | `formulahendry.auto-rename-tag` | Renommage auto des balises JSX |
| Path Intellisense | `christian-kohler.path-intellisense` | Autocompletion des chemins |

### Utiles (optionnelles)

| Extension | ID | Utilite |
|---|---|---|
| GitLens | `eamodio.gitlens` | Historique Git dans VS Code |
| Thunder Client | `rangav.vscode-thunder-client` | Tester vos APIs |
| Error Lens | `usernamehw.errorlens` | Erreurs inline dans le code |
| Console Ninja | `WallabyJs.console-ninja` | console.log inline |

### Configuration VS Code recommandee

Creer/modifier `.vscode/settings.json` a la racine :

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

---

## Guide de demarrage

### Installation initiale

```bash
# Cloner le repo
git clone https://github.com/Pauzzle-ozz/Mew-mew-Ai.git
cd Mew-mew-Ai

# Installer les dependances BACKEND
cd backend
npm install

# Installer les dependances FRONTEND
cd ../frontend-v2
npm install
```

### Configurer les variables d'environnement

#### Backend : `backend/src/.env`

```env
PORT=5000

# OpenAI
OPENAI_API_KEY=sk-votre_cle_api_openai

# Supabase
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_SERVICE_KEY=votre_service_role_key

# Resend (envoi d'emails)
RESEND_API_KEY=re_votre_cle_resend
```

#### Frontend : `frontend-v2/.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_publique_anon
```

**Note** : Le frontend appelle le backend directement sur `http://localhost:5000` (l'URL est codee en dur dans `lib/api/cvApi.js`, `lib/api/portfolioApi.js` et `lib/api/matcherApi.js`).

### Demarrer l'application (2 terminaux)

#### Terminal 1 : Backend

```bash
cd backend
npm run dev     # Utilise nodemon pour le rechargement auto
# Accessible sur http://localhost:5000
```

#### Terminal 2 : Frontend

```bash
cd frontend-v2
npm run dev
# Accessible sur http://localhost:3000
```

### Verifier que tout fonctionne

- Backend : http://localhost:5000 doit afficher `{"message":"Backend fonctionne !","status":"OK"}`
- Backend health : http://localhost:5000/api/health
- Frontend : http://localhost:3000 affiche la landing page

---

## Architecture technique

### Schema de communication

```
UTILISATEUR (Navigateur)
      |
      | http://localhost:3000
      v
FRONTEND (Next.js 16 - Port 3000)
  |-- Pages (app/)
  |-- Composants React (components/cv/, components/shared/)
  |-- Hooks (hooks/useAuth, useCVAnalyzer, useCVOptimizer)
  |-- API clients (lib/api/cvApi.js, portfolioApi.js)
  |-- Supabase client (lib/supabase.js) --> Supabase Auth directement
      |
      | fetch() vers http://localhost:5000/api/...
      v
BACKEND (Express 5 - Port 5000)
  |-- Routes (routes/solutions, matcher, portfolio, portfolioStats, contact)
  |-- Services (aiService, cvService, matcherService, scraperService, portfolioService, emailService, pdfService)
  |-- Prompts (prompts/ - 13 fichiers de prompts IA)
  |-- Templates (templateFactory + letterTemplateFactory - templates HTML)
      |
      |-- OpenAI SDK --> API OpenAI (GPT-4o, GPT-4.1-mini)
      |-- supabase-js --> Supabase (BDD + Storage)
      |-- Resend --> Emails transactionnels
      |-- Puppeteer --> Generation PDF
```

### Flux de donnees : Analyser un CV (formulaire)

```
1. Utilisateur remplit le formulaire (AnalyzerForm.jsx)
2. Hook useCVAnalyzer.js appelle cvApi.analyzeCV(cvData)
3. Frontend POST http://localhost:5000/api/solutions/analyse-cv
4. Backend route solutions.js recoit la requete
5. cvService.analyzeCV() construit le prompt et appelle OpenAI (2 etapes)
6. OpenAI retourne l'analyse structuree en JSON
7. Backend retourne le resultat au frontend
8. ResultsDisplay.jsx affiche les metiers recommandes
```

### Flux de donnees : Generer un CV PDF

```
1. Utilisateur choisit un template et remplit ses donnees
2. Frontend POST http://localhost:5000/api/solutions/generer-cv
3. templateFactory.getTemplate(template, cvData) genere le HTML
4. pdfService.generatePDF(html) lance Puppeteer (headless Chrome)
5. Puppeteer convertit le HTML en PDF (buffer)
6. Le PDF est encode en base64 et retourne au frontend
7. fileHelpers.downloadGeneratedCV() decode et telecharge le fichier
```

### Flux de donnees : Portfolio

```
1. Utilisateur cree un portfolio (titre, template)
2. portfolioService cree l'entree en BDD Supabase + genere un slug
3. Utilisateur ajoute des blocs (texte, image, video, etc.)
4. Les blocs sont stockes dans la table portfolio_blocks
5. Les medias sont uploades sur Supabase Storage (bucket portfolio-media)
6. L'utilisateur publie son portfolio (published = true)
7. Le portfolio est accessible sur /p/[slug] (page publique)
8. Les visiteurs peuvent envoyer un message via le formulaire de contact
9. Le message est envoye par email via Resend
```

---

## Integration OpenAI (IA directe)

### Architecture IA

Le backend appelle directement l'API OpenAI via le SDK officiel (`openai` npm package). Aucun intermediaire (n8n, LangChain, etc.) n'est utilise.

### Service centralise : aiService.js

Fichier : `backend/src/services/aiService.js`

Singleton qui encapsule toutes les interactions avec OpenAI :
- `generate(prompt, options)` : generation de texte libre
- `generateJSON(prompt, options)` : generation JSON avec `response_format: { type: "json_object" }` + retry auto
- `generateThenConvert(genPrompt, jsonPrompt, genOptions, convOptions)` : pipeline 2 etapes (texte creatif puis conversion JSON)

### Modeles utilises

| Modele | Utilisation | Temperature |
|---|---|---|
| `gpt-4.1-mini` | Analyse CV, optimisation CV, conversion JSON | Defaut |
| `gpt-4o` | Generation CV personnalise, CV ideal, lettre de motivation | 0.7 |

### Organisation des prompts

Tous les prompts sont dans `backend/src/prompts/` :
- Un fichier par workflow (10 fichiers de generation)
- `jsonSchemas.js` contient les 5 prompts de conversion JSON
- `helpers.js` contient les fonctions de formatage partagees
- Chaque fichier exporte une fonction `buildPrompt(data) => string`

### Pipeline IA (2 etapes)

La plupart des workflows suivent ce pattern :
1. **Etape 1** : generation de texte creatif/analytique (GPT-4o ou GPT-4.1-mini)
2. **Etape 2** : conversion du texte en JSON structure (GPT-4.1-mini avec JSON mode)

### Gestion des erreurs OpenAI

- **Rate limit (429)** : retourne HTTP 503 "Service IA temporairement surcharge"
- **Timeout (60s)** : retourne HTTP 500
- **JSON invalide** : retry automatique une fois avec instruction stricte

---

## Explication detaillee du code

### Backend : server.js (point d'entree)

Fichier : `backend/src/server.js`

- Charge les variables d'environnement depuis `./src/.env` (relatif a la racine backend)
- Demarre Express 5 sur le port 5000
- Applique les middlewares : `cors()` et `express.json()`
- Monte les routes :
  - `/api/solutions` -> solutions.js (analyseur, optimiseur, generateur CV)
  - `/api/portfolio` -> portfolio.js (CRUD portfolios, blocs, medias)
  - `/api/portfolio-stats` -> portfolioStats.js (compteur de vues)
  - `/api/contact` -> contact.js (envoi d'email)
- Route de test : `GET /` et `GET /api/health`

Scripts npm :
- `npm start` -> `node src/server.js`
- `npm run dev` -> `nodemon src/server.js` (rechargement auto)

### Backend : cvService.js

Fichier : `backend/src/services/cvService.js`

Classe `CVService` qui centralise :
- `validateCVData(cvData)` : verifie que prenom, nom et titre_poste sont presents
- `analyzeCV(cvData)` : construit le prompt et appelle OpenAI pour analyse (2 etapes)
- `analyzePDF(cvText, numPages, userId)` : analyse le texte extrait du PDF via OpenAI
- `optimizeCVForm(cvData, userId)` : optimise un CV depuis un formulaire via OpenAI
- `optimizeCVPdf(cvText, numPages, userId)` : optimise un CV depuis un PDF via OpenAI

### Backend : portfolioService.js

Fichier : `backend/src/services/portfolioService.js`

Classe `PortfolioService` qui gere tout via Supabase (utilise la `SUPABASE_SERVICE_KEY`) :

**Portfolios** :
- `createPortfolio(userId, data)` : cree un portfolio + genere un slug unique
- `getUserPortfolios(userId)` : liste tous les portfolios d'un utilisateur
- `getPortfolioById(portfolioId, userId)` : recupere un portfolio (verification proprietaire)
- `getPortfolioBySlug(slug)` : recupere un portfolio public par slug
- `updatePortfolio(portfolioId, userId, data)` : met a jour (title, description, template, published, settings, primary_color)
- `deletePortfolio(portfolioId, userId)` : supprime un portfolio
- `getFullPortfolio(portfolioId, userId)` : portfolio + blocs + medias
- `getFullPortfolioBySlug(slug)` : idem mais par slug (public)

**Blocs** :
- `getPortfolioBlocks(portfolioId)` : liste les blocs (table `portfolio_blocks`)
- `addBlock(portfolioId, userId, blockData)` : ajoute un bloc avec ordre auto
- `updateBlock(blockId, userId, blockData)` : met a jour (verification via jointure)
- `deleteBlock(blockId, userId)` : supprime un bloc
- `reorderBlocks(portfolioId, userId, blocksOrder)` : reordonne les blocs

**Medias** :
- `uploadMedia(userId, portfolioId, file)` : upload sur Supabase Storage (bucket `portfolio-media`) + enregistrement en BDD
- `getPortfolioMedia(portfolioId)` : liste les medias
- `deleteMedia(mediaId, userId)` : supprime du Storage + de la BDD

### Backend : templateFactory.js

Fichier : `backend/src/templates/templateFactory.js`

Classe `TemplateFactory` qui genere du HTML pour 6 templates de CV :

| Template | Style | Police | Public cible |
|---|---|---|---|
| `moderne` | Bleu, epure | Calibri | Tech, startups |
| `classique` | Noir, centre | Times New Roman | Finance, juridique |
| `creatif` | Rose/violet, gradient | Helvetica | Communication, art |
| `tech` | Style terminal, vert | Consolas (monospace) | Developpeurs, IT |
| `executive` | Double bordure, elegant | Georgia | Managers, cadres |
| `minimal` | Ultra epure, leger | Helvetica Neue | Architecture, UX/UI |

Chaque template genere un HTML A4 complet avec CSS inline, optimise pour Puppeteer.

### Backend : pdfService.js

Fichier : `backend/src/services/pdfService.js`

Utilise Puppeteer (headless Chrome) pour convertir le HTML en PDF A4.
Options : `--no-sandbox`, `--disable-setuid-sandbox`, format A4, `printBackground: true`.

### Backend : emailService.js

Fichier : `backend/src/services/emailService.js`

Utilise l'API **Resend** (pas Gmail) pour envoyer des emails.
- Expediteur : `Portfolio Contact <onboarding@resend.dev>` (adresse par defaut de Resend)
- Destinataire : l'email du proprietaire du portfolio
- Reply-to : l'email du visiteur (pour repondre directement)
- Template HTML inline avec le message du visiteur

**Note** : Il existe un doublon `backend/src/emailService.js` identique a `backend/src/services/emailService.js`. Seul le fichier dans `services/` est utilise par le code.

### Frontend : Layout et configuration

Fichier : `frontend-v2/app/layout.js`
- Polices : Geist Sans (`--font-geist-sans`) et Geist Mono (`--font-geist-mono`)
- Metadata : titre "Mew - L'IA qui vous propulse"
- Langue : `fr`

Fichier : `frontend-v2/next.config.mjs`
- `experimental.turbo: false` (Turbopack desactive)

Fichier : `frontend-v2/postcss.config.mjs`
- Plugin `@tailwindcss/postcss` (Tailwind CSS 4, pas de tailwind.config.js)

### Frontend : Hooks

**useAuth.js** : Verifie si l'utilisateur est connecte via `supabase.auth.getUser()`. Redirige vers `/login` si non connecte.

**useCVAnalyzer.js** : Gere le flux d'analyse de CV (appels API, etats de chargement, resultats).

**useCVOptimizer.js** : Gere le flux d'optimisation de CV.

### Frontend : Clients API

**lib/api/cvApi.js** : Toutes les methodes pour communiquer avec le backend CV :
- `analyzeCV(cvData)` - POST `/api/solutions/analyse-cv`
- `analyzePDF(file, userId)` - POST `/api/solutions/analyse-cv-pdf-complete` (multipart)
- `extractCV(file)` - POST `/api/solutions/extraire-cv` (multipart)
- `optimizeCV(cvData)` - POST `/api/solutions/optimiser-cv`
- `generateCV(cvData, template)` - POST `/api/solutions/generer-cv`
- `optimizeCVForm(cvData, userId)` - POST `/api/solutions/optimiser-cv-formulaire`
- `optimizeCVPDF(file, userId)` - POST `/api/solutions/optimiser-cv-pdf` (multipart)

**lib/api/portfolioApi.js** : Toutes les methodes CRUD pour les portfolios :
- Portfolios : create, getAll, getById, getPublic, update, delete, togglePublish
- Blocs : add, update, delete, reorder
- Medias : upload (multipart), getAll, delete

**Important** : Les URLs du backend sont codees en dur (`http://localhost:5000`). En production, il faudra les rendre configurables via une variable d'environnement.

### Frontend : Utilitaires

**lib/utils/cvParser.js** : Parse le texte brut d'un CV pour extraire email, telephone, nom, prenom, titre de poste, adresse. Utilise des regex adaptees aux formats francais.

**lib/utils/fileHelpers.js** :
- `validatePDF(file)` : verifie type PDF et taille max 2 Mo
- `base64ToBlob(base64, type)` : convertit base64 en Blob
- `downloadFile(blob, filename)` : telecharge un fichier via un lien temporaire
- `downloadGeneratedCV(result)` : decode le PDF base64 et le telecharge

---

## Base de donnees Supabase

### Tables

#### Table `portfolios`

| Colonne | Type | Description |
|---|---|---|
| `id` | UUID | Identifiant unique |
| `user_id` | UUID | Reference vers auth.users |
| `slug` | VARCHAR UNIQUE | URL unique du portfolio (genere automatiquement) |
| `title` | VARCHAR | Titre du portfolio |
| `description` | TEXT | Description |
| `template` | VARCHAR | Nom du template ('moderne' par defaut) |
| `published` | BOOLEAN | Portfolio publie ou brouillon (defaut: false) |
| `settings` | JSONB | Configuration additionnelle |
| `primary_color` | VARCHAR | Couleur personnalisee |
| `views_count` | INTEGER | Compteur de vues |
| `created_at` | TIMESTAMP | Date de creation |
| `updated_at` | TIMESTAMP | Date de derniere modification |

#### Table `portfolio_blocks`

| Colonne | Type | Description |
|---|---|---|
| `id` | UUID | Identifiant unique |
| `portfolio_id` | UUID | Reference vers portfolios |
| `type` | VARCHAR | Type de bloc (hero, texte, image, video, etc.) |
| `content` | JSONB | Contenu du bloc |
| `order` | INTEGER | Ordre d'affichage |
| `created_at` | TIMESTAMP | Date de creation |

#### Table `portfolio_media`

| Colonne | Type | Description |
|---|---|---|
| `id` | UUID | Identifiant unique |
| `portfolio_id` | UUID | Reference vers portfolios |
| `user_id` | UUID | Reference vers auth.users |
| `type` | VARCHAR | 'image' ou 'video' |
| `url` | TEXT | URL publique Supabase Storage |
| `filename` | VARCHAR | Nom du fichier original |
| `size` | INTEGER | Taille en octets |
| `mime_type` | VARCHAR | Type MIME du fichier |
| `created_at` | TIMESTAMP | Date de creation |

### Supabase Storage

- **Bucket** : `portfolio-media`
- **Structure des fichiers** : `{userId}/{portfolioId}/{timestamp}.{extension}`
- **Types acceptes** : JPEG, PNG, GIF, WEBP, MP4, WEBM
- **Taille max** : 50 Mo par fichier

### Fonction SQL requise

```sql
-- Fonction pour incrementer le compteur de vues
CREATE OR REPLACE FUNCTION increment_portfolio_views(portfolio_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE portfolios
  SET views_count = COALESCE(views_count, 0) + 1
  WHERE id = portfolio_id;
END;
$$ LANGUAGE plpgsql;
```

### Politiques de securite (RLS)

```sql
-- Activer RLS sur les tables
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_media ENABLE ROW LEVEL SECURITY;

-- Portfolios : lecture par le proprietaire ou si publie
CREATE POLICY "Users can view own portfolios or published ones"
  ON portfolios FOR SELECT
  USING (auth.uid() = user_id OR published = TRUE);

CREATE POLICY "Users can insert own portfolios"
  ON portfolios FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own portfolios"
  ON portfolios FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own portfolios"
  ON portfolios FOR DELETE
  USING (auth.uid() = user_id);

-- Blocs : acces via le portfolio parent
CREATE POLICY "Users can manage blocks of their portfolios"
  ON portfolio_blocks FOR ALL
  USING (portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid()));

-- Medias : acces par proprietaire
CREATE POLICY "Users can manage their own media"
  ON portfolio_media FOR ALL
  USING (user_id = auth.uid());
```

**Note** : Le backend utilise la `SUPABASE_SERVICE_KEY` (service_role) qui bypass les politiques RLS. Les politiques ci-dessus s'appliquent uniquement si le frontend accede directement a Supabase.

---

## API et Routes

### Solutions IA

#### Analyser un CV (formulaire)
```
POST /api/solutions/analyse-cv
Content-Type: application/json

Body: { prenom, nom, type_poste, ...autres_champs }

Response: { success: true, data: { ...resultat_analyse_ia } }
```

#### Extraire le texte d'un PDF
```
POST /api/solutions/analyse-cv-pdf
Content-Type: multipart/form-data

Body: cv (fichier PDF, max 2 Mo)

Response: { success: true, data: { texte_extrait, nombre_pages } }
```

#### Analyser un CV PDF complet (extraction + analyse IA)
```
POST /api/solutions/analyse-cv-pdf-complete
Content-Type: multipart/form-data

Body: cv (fichier PDF), userId

Response: { success: true, data: { ...resultat_analyse_ia } }
```

#### Optimiser un CV (formulaire)
```
POST /api/solutions/optimiser-cv-formulaire
Content-Type: application/json

Body: { cvData: { prenom, nom, titre_poste, ... }, userId }

Response: { success: true, data: { ...resultat_optimisation_ia } }
```

#### Optimiser un CV (PDF)
```
POST /api/solutions/optimiser-cv-pdf
Content-Type: multipart/form-data

Body: cv (fichier PDF), userId

Response: { success: true, data: { ...resultat_optimisation_ia } }
```

#### Generer un CV (PDF)
```
POST /api/solutions/generer-cv
Content-Type: application/json

Body: {
  cvData: { prenom, nom, titre_poste, email, telephone, adresse, linkedin,
            resume, experiences: [...], formations: [...],
            competences_techniques, competences_soft, langues },
  template: "moderne" | "classique" | "creatif" | "tech" | "executive" | "minimal"
}

Response: {
  success: true,
  data: { pdf: "base64...", filename: "CV_Prenom_Nom" }
}
```

### Portfolios

#### Creer un portfolio
```
POST /api/portfolio
Body: { userId, title, description?, template? }
Response: { success: true, data: { id, slug, ... } }
```

#### Lister les portfolios d'un utilisateur
```
GET /api/portfolio/user/:userId
Response: { success: true, data: [...] }
```

#### Recuperer un portfolio (editeur)
```
GET /api/portfolio/:portfolioId?userId=xxx
Response: { success: true, data: { ...portfolio, blocks: [...], media: [...] } }
```

#### Recuperer un portfolio public
```
GET /api/portfolio/public/:slug
Response: { success: true, data: { ...portfolio, blocks: [...], media: [...] } }
```

#### Mettre a jour un portfolio
```
PUT /api/portfolio/:portfolioId
Body: { userId, title?, description?, template?, published?, settings?, primary_color? }
Response: { success: true, data: { ... } }
```

#### Supprimer un portfolio
```
DELETE /api/portfolio/:portfolioId
Body: { userId }
Response: { success: true, message: "Portfolio supprime" }
```

### Blocs de portfolio

#### Ajouter un bloc
```
POST /api/portfolio/:portfolioId/blocks
Body: { userId, type, content?, order? }
Response: { success: true, data: { id, type, content, order } }
```

#### Mettre a jour un bloc
```
PUT /api/portfolio/blocks/:blockId
Body: { userId, content?, order?, type? }
```

#### Supprimer un bloc
```
DELETE /api/portfolio/blocks/:blockId
Body: { userId }
```

#### Reorganiser les blocs
```
PUT /api/portfolio/:portfolioId/blocks/reorder
Body: { userId, blocksOrder: ["blockId1", "blockId2", ...] }
```

### Medias de portfolio

#### Uploader un media
```
POST /api/portfolio/:portfolioId/media
Content-Type: multipart/form-data
Body: file (image/video, max 50 Mo), userId
Types acceptes: JPEG, PNG, GIF, WEBP, MP4, WEBM
```

#### Lister les medias
```
GET /api/portfolio/:portfolioId/media
```

#### Supprimer un media
```
DELETE /api/portfolio/media/:mediaId
Body: { userId }
```

### Statistiques portfolio

#### Incrementer les vues
```
POST /api/portfolio-stats/increment-views
Body: { portfolioId }
Response: { success: true }
```

### Contact

#### Envoyer un email de contact
```
POST /api/contact/send
Body: { name, email, message, portfolioOwnerEmail, portfolioTitle? }
Response: { success: true, message: "Email envoye avec succes", data: { messageId } }
```

---

## Commandes utiles

### Backend

```bash
cd backend
npm run dev        # Demarrer avec nodemon (rechargement auto)
npm start          # Demarrer en production
npm install <pkg>  # Installer une dependance
```

### Frontend

```bash
cd frontend-v2
npm run dev        # Demarrer Next.js en dev
npm run build      # Creer un build de production
npm start          # Demarrer le build de production
npm run lint       # Verifier les erreurs ESLint
```

### Git

```bash
git status                   # Voir les fichiers modifies
git add .                    # Ajouter tous les fichiers
git commit -m "description"  # Creer un commit
git push origin main         # Pousser vers GitHub
git pull origin main         # Recuperer les derniers changements
git checkout -b feature/xxx  # Creer une branche
git log --oneline            # Historique compact
```

---

## Variables d'environnement

### Backend : `backend/src/.env`

| Variable | Description | Obligatoire |
|---|---|---|
| `PORT` | Port du serveur (defaut: 5000) | Non |
| `OPENAI_API_KEY` | Cle API OpenAI (commence par `sk-...`) | Oui |
| `SUPABASE_URL` | URL du projet Supabase | Oui |
| `SUPABASE_SERVICE_KEY` | Cle service_role Supabase (SECRETE) | Oui |
| `RESEND_API_KEY` | Cle API Resend pour l'envoi d'emails | Oui |

### Frontend : `frontend-v2/.env.local`

| Variable | Description | Obligatoire |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase (meme que backend) | Oui |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Cle publique anon Supabase | Oui |

**ATTENTION** : Les variables `NEXT_PUBLIC_*` sont visibles cote client. Ne JAMAIS y mettre la `service_role` key.

### Fichiers ignores par Git (`.gitignore`)

Les fichiers `.env`, `backend/src/.env` et `frontend-v2/.env.local` sont dans le `.gitignore`. Ne les commitez JAMAIS.

---

## Resolution des problemes

### "Cannot find module"

```bash
cd backend  # ou frontend-v2
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### "Port 5000 already in use"

**Windows** :
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Mac/Linux** :
```bash
kill -9 $(lsof -ti:5000)
```

### "CORS error" dans le navigateur

1. Verifiez que le backend tourne sur le port 5000
2. Verifiez que `cors()` est bien applique dans `server.js`

### Variables d'environnement non chargees

1. Verifiez que le fichier est au bon endroit : `backend/src/.env` (pas `backend/.env`)
2. Pas d'espaces autour du `=` dans le `.env`
3. Redemarrez le serveur apres modification

### "Service IA temporairement surcharge" ou erreur OpenAI

1. Verifiez que votre `OPENAI_API_KEY` est valide dans `backend/src/.env`
2. Verifiez votre solde de credits sur https://platform.openai.com/usage
3. Si erreur 429 (rate limit), attendez quelques secondes et reessayez
4. Verifiez que la cle commence par `sk-...`

### Supabase "Invalid JWT" ou "Invalid API key"

1. Verifiez les cles dans Supabase Dashboard > Settings > API
2. Backend utilise la `service_role` key
3. Frontend utilise la `anon` key
4. Les cles commencent par `eyJ...`

### Cache Next.js corrompu

```bash
cd frontend-v2
rm -rf .next
npm run dev
```
Dans le navigateur : Ctrl+Shift+R pour forcer le rechargement.

### Puppeteer ne fonctionne pas

Sur Linux/Docker, Puppeteer peut necessiter des dependances systeme :
```bash
# Debian/Ubuntu
sudo apt-get install -y libx11-xcb1 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libpango-1.0-0 libcairo2 libasound2 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libnspr4 libnss3
```

---

## Deploiement

### Checklist avant deploiement

- [ ] Build fonctionne en local (`cd frontend-v2 && npm run build`)
- [ ] Pas de `console.log` inutiles
- [ ] Variables d'environnement configurees pour production
- [ ] `.gitignore` contient `.env`
- [ ] Tables Supabase creees avec RLS active
- [ ] Fonction SQL `increment_portfolio_views` creee
- [ ] URLs du backend dans `lib/api/cvApi.js` et `lib/api/portfolioApi.js` mises a jour pour la production
- [ ] `OPENAI_API_KEY` configuree pour la production

### Frontend sur Vercel

1. Creer un compte sur https://vercel.com/
2. Importer le repo GitHub
3. Configuration :
   - Root Directory : `frontend-v2`
   - Framework : Next.js
   - Build Command : `npm run build`
4. Variables d'environnement :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deployer

### Backend sur Railway

1. Creer un compte sur https://railway.app/
2. Deployer depuis GitHub
3. Configuration :
   - Root Directory : `backend`
   - Start Command : `node src/server.js`
4. Ajouter toutes les variables d'env du `.env`
5. Mettre a jour les URLs dans le frontend pour pointer vers l'URL Railway

### Points d'attention pour la production

1. **URLs codees en dur** : `lib/api/cvApi.js` et `lib/api/portfolioApi.js` utilisent `http://localhost:5000`. En production, il faut les remplacer par une variable d'environnement (`NEXT_PUBLIC_API_URL`).
2. **Email Resend** : l'adresse d'expedition `onboarding@resend.dev` est limitee. En production, configurez un domaine verifie sur Resend.
3. **Puppeteer** : peut necessiter un buildpack Chrome sur les plateformes cloud.
4. **CORS** : en production, restreindre les origines autorisees dans `server.js`.

---

## Bonnes pratiques

### Organisation du code

- Composants organises en sous-dossiers thematiques (`cv/`, `shared/`)
- Hooks personnalises pour la logique reutilisable
- API clients centralises dans `lib/api/`
- Utilitaires dans `lib/utils/`
- Constantes dans `lib/constants/`
- Services backend separes par domaine (CV, portfolio, email, PDF)

### Nommage

```
Fichiers pages    : page.js (convention Next.js App Router)
Composants        : PascalCase.jsx (AnalyzerForm.jsx)
Hooks             : camelCase avec use (useAuth.js)
Services backend  : camelCase (cvService.js)
Variables         : camelCase (userName)
Constantes        : UPPER_SNAKE_CASE (API_BASE_URL)
Routes API        : kebab-case (/api/solutions/analyse-cv)
```

### Commits Git

```bash
# Format : type: description
git commit -m "feat: ajout analyseur CV PDF"
git commit -m "fix: correction validation email"
git commit -m "refactor: separation composants CV"
git commit -m "docs: mise a jour claude.md"
```

### Securite

- Ne JAMAIS commiter les fichiers `.env`
- Utiliser la `anon` key cote frontend, la `service_role` key cote backend uniquement
- Validation des entrees (multer pour les fichiers, verification des champs requis)
- CORS active cote backend
- RLS active sur Supabase
- Cle API OpenAI stockee uniquement dans le `.env` backend (jamais cote frontend)

---

**Derniere mise a jour** : Fevrier 2026
**Auteur** : Pauzzle-ozz
**Licence** : MIT
**Repository** : https://github.com/Pauzzle-ozz/Mew-mew-Ai
