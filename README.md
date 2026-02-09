# Mew-mew-Ai

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![Express](https://img.shields.io/badge/Express-5-lightgrey)

**Plateforme SaaS d'Intelligence Artificielle multi-solutions**

[Documentation technique](./claude.md) · [Signaler un bug](https://github.com/Pauzzle-ozz/Mew-mew-Ai/issues) · [Proposer une fonctionnalite](https://github.com/Pauzzle-ozz/Mew-mew-Ai/issues)

</div>

---

## A propos

**Mew-mew-Ai** est une plateforme SaaS qui regroupe plusieurs solutions propulsees par l'intelligence artificielle. L'objectif est de fournir des outils IA concrets et accessibles dans differents domaines : emploi, fiscalite, marketing, developpement, et bien d'autres a venir.

La plateforme est construite de maniere modulaire : chaque domaine est un espace de solutions independant, ce qui permet d'en ajouter de nouveaux au fil du temps sans impacter les existants.

### Solutions disponibles

**Recherche d'emploi** (en production)
- Analyseur de CV par formulaire ou PDF (IA via n8n)
- Optimiseur de CV pour les ATS (systemes de recrutement)
- Generateur de CV PDF avec 6 templates professionnels
- Portfolio Pro : editeur de blocs, medias, QR code, page publique, compteur de vues, formulaire de contact

### Solutions prevues

| Domaine | Description | Statut |
|---|---|---|
| Fiscalite | Aide a la declaration, optimisation fiscale, simulation d'impots | Planifie |
| Marketing | Generation de contenu, analyse de marche, strategies IA | Planifie |
| Espace Developpeurs | Outils de code, debug, generation de documentation | Planifie |
| *Autres domaines* | *Ajout progressif selon le developpement de la plateforme* | A definir |

---

## Fonctionnalites actuelles

### Analyseur de CV
- Analyse par formulaire (saisie manuelle) ou upload PDF
- Extraction automatique du texte via `pdf-parse`
- Traitement IA orchestre par n8n (modele IA configurable)
- Suggestions de metiers adaptes au profil

### Optimiseur de CV
- Optimisation pour les ATS (Applicant Tracking Systems)
- Disponible en mode formulaire et PDF
- Suggestions d'amelioration via IA (n8n)

### Generateur de CV PDF
- 6 templates : Moderne, Classique, Creatif, Tech, Executive, Minimal
- Generation HTML avec CSS inline via `templateFactory`
- Conversion en PDF A4 via Puppeteer (headless Chrome)
- Telechargement direct

### Portfolio Pro
- Editeur de blocs (Hero, Texte, Image, Video, etc.)
- Bibliotheque de medias (images/videos jusqu'a 50 Mo via Supabase Storage)
- URL publique unique avec slug (`/p/mon-portfolio`)
- Generation de QR code
- Couleurs personnalisees et mode sombre
- Compteur de vues
- Formulaire de contact integre (envoi d'email via Resend)
- Publication/depublication

### Authentification
- Inscription / Connexion via Supabase Auth
- Protection des routes (hook `useAuth`)
- Redirection automatique vers `/login` si non connecte

---

## Technologies

### Frontend
| Technologie | Version | Role |
|---|---|---|
| [Next.js](https://nextjs.org/) | 16.1.4 | Framework React (App Router) |
| [React](https://react.dev/) | 19.2.3 | Bibliotheque UI |
| [Tailwind CSS](https://tailwindcss.com/) | 4 | Framework CSS (via `@tailwindcss/postcss`) |
| [Supabase JS](https://supabase.com/) | 2.91.0 | Client Auth |
| [qrcode.react](https://www.npmjs.com/package/qrcode.react) | 4.2.0 | Generation de QR codes |

### Backend
| Technologie | Version | Role |
|---|---|---|
| [Express.js](https://expressjs.com/) | 5.2.1 | Framework serveur |
| [Supabase JS](https://supabase.com/) | 2.93.3 | BDD + Storage |
| [Axios](https://axios-http.com/) | 1.13.2 | Client HTTP (appels n8n) |
| [Multer](https://www.npmjs.com/package/multer) | 2.0.2 | Upload de fichiers |
| [pdf-parse](https://www.npmjs.com/package/pdf-parse) | 1.1.1 | Extraction texte PDF |
| [Puppeteer](https://pptr.dev/) | 24.36.1 | Generation de PDF |
| [Resend](https://resend.com/) | 6.9.1 | Envoi d'emails |
| [Nodemon](https://nodemon.io/) | 3.1.11 | Rechargement auto (dev) |

### Services externes
| Service | Role |
|---|---|
| [Supabase](https://supabase.com/) | Base de donnees PostgreSQL + Auth + Storage |
| [n8n](https://n8n.io/) | Orchestration des workflows IA |
| [Resend](https://resend.com/) | Emails transactionnels |

---

## Prerequis

- **Node.js** >= 18.0.0 ([Telecharger](https://nodejs.org/))
- **npm** >= 9.0.0 (inclus avec Node.js)
- **Git** ([Telecharger](https://git-scm.com/))
- **n8n** (workflows IA) : `npm install n8n -g`
- Un compte [Supabase](https://supabase.com/) (gratuit)
- Un compte [Resend](https://resend.com/) (gratuit, pour les emails)

```bash
# Verifier les installations
node --version   # v18+ ou v20+ ou v22+
npm --version    # 9+
git --version    # 2.x.x
```

---

## Installation

### 1. Cloner le repository

```bash
git clone https://github.com/Pauzzle-ozz/Mew-mew-Ai.git
cd Mew-mew-Ai
```

### 2. Installer les dependances

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend-v2
npm install
```

### 3. Configurer les variables d'environnement

#### Backend : `backend/src/.env`

```env
PORT=5000

# Webhooks n8n
N8N_WEBHOOK_URL=http://localhost:5678/webhook/analyse-cv
N8N_WEBHOOK_PDF_URL=http://localhost:5678/webhook/analyse-cv-pdf
N8N_WEBHOOK_OPTIMISER_FORM_URL=http://localhost:5678/webhook/optimiser-cv-formulaire
N8N_WEBHOOK_OPTIMISER_PDF_URL=http://localhost:5678/webhook/optimiser-cv-pdf

# Securite n8n
N8N_SECRET_KEY=votre_cle_secrete

# Supabase
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_SERVICE_KEY=votre_service_role_key

# Resend
RESEND_API_KEY=re_votre_cle_resend
```

#### Frontend : `frontend-v2/.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_publique_anon
```

> **Important** : Le fichier `.env` backend est dans `backend/src/`, pas dans `backend/`. Les fichiers `.env` sont dans le `.gitignore` et ne doivent jamais etre commites.

### 4. Configurer Supabase

Creez les tables suivantes dans votre projet Supabase (SQL Editor) :

```sql
-- Table portfolios
CREATE TABLE portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255),
  description TEXT,
  template VARCHAR(100) DEFAULT 'moderne',
  published BOOLEAN DEFAULT FALSE,
  settings JSONB,
  primary_color VARCHAR(50),
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table blocs de portfolio
CREATE TABLE portfolio_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  type VARCHAR(100) NOT NULL,
  content JSONB,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table medias de portfolio
CREATE TABLE portfolio_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50),
  url TEXT,
  filename VARCHAR(255),
  size INTEGER,
  mime_type VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fonction pour incrementer les vues
CREATE OR REPLACE FUNCTION increment_portfolio_views(portfolio_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE portfolios
  SET views_count = COALESCE(views_count, 0) + 1
  WHERE id = portfolio_id;
END;
$$ LANGUAGE plpgsql;

-- Activer RLS
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_media ENABLE ROW LEVEL SECURITY;

-- Politiques RLS
CREATE POLICY "Users can view own or published portfolios"
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

CREATE POLICY "Users can manage blocks of their portfolios"
  ON portfolio_blocks FOR ALL
  USING (portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own media"
  ON portfolio_media FOR ALL
  USING (user_id = auth.uid());
```

Creez aussi un bucket **Storage** nomme `portfolio-media` (public).

---

## Utilisation

L'application necessite **3 terminaux** simultanes :

#### Terminal 1 : n8n (workflows IA)
```bash
n8n start
# Interface sur http://localhost:5678
```

#### Terminal 2 : Backend
```bash
cd backend
npm run dev
# API sur http://localhost:5000
```

#### Terminal 3 : Frontend
```bash
cd frontend-v2
npm run dev
# Application sur http://localhost:3000
```

### Verification

| Service | URL | Resultat attendu |
|---|---|---|
| Backend | http://localhost:5000 | `{"message":"Backend fonctionne !","status":"OK"}` |
| Health check | http://localhost:5000/api/health | Status OK |
| Frontend | http://localhost:3000 | Landing page |
| n8n | http://localhost:5678 | Interface n8n |

---

## Architecture

```
Utilisateur (navigateur)
       |
       | http://localhost:3000
       v
 Frontend (Next.js 16 - Port 3000)
   |-- Pages (App Router)
   |-- Composants React
   |-- Hooks (useAuth, useCVAnalyzer, useCVOptimizer)
   |-- Supabase Auth (direct)
       |
       | fetch() vers http://localhost:5000/api/...
       v
 Backend (Express 5 - Port 5000)
   |-- Routes (solutions, portfolio, portfolioStats, contact)
   |-- Services (cvService, portfolioService, emailService, pdfService)
   |-- Templates (templateFactory - 6 templates HTML)
       |
       |----> n8n (Port 5678) -----> IA (analyse/optimisation CV)
       |----> Supabase (BDD PostgreSQL + Storage)
       |----> Resend (envoi d'emails)
       |----> Puppeteer (generation PDF)
```

### Structure des dossiers

```
Mew-mew-Ai/
|
|-- backend/                        # Serveur Express.js
|   |-- package.json
|   |-- src/
|       |-- .env                    # Variables d'environnement (SECRET)
|       |-- server.js               # Point d'entree (port 5000)
|       |-- routes/
|       |   |-- solutions.js        # Analyse + optimisation + generation CV
|       |   |-- portfolio.js        # CRUD portfolios + blocs + medias
|       |   |-- portfolioStats.js   # Compteur de vues
|       |   |-- contact.js          # Envoi d'email de contact
|       |-- services/
|       |   |-- cvService.js        # Appels n8n (analyse/optimisation)
|       |   |-- portfolioService.js # CRUD Supabase (portfolios, blocs, medias)
|       |   |-- emailService.js     # Envoi d'emails (Resend)
|       |   |-- pdfService.js       # Generation PDF (Puppeteer)
|       |-- templates/
|           |-- templateFactory.js  # 6 templates CV (HTML)
|
|-- frontend-v2/                    # Application Next.js
|   |-- .env.local                  # Variables d'environnement
|   |-- package.json
|   |-- next.config.mjs
|   |-- postcss.config.mjs
|   |-- app/                        # Pages (App Router)
|   |   |-- page.js                 # Landing page
|   |   |-- layout.js               # Layout global (polices Geist)
|   |   |-- globals.css             # Styles Tailwind
|   |   |-- login/page.js           # Connexion
|   |   |-- signup/page.js          # Inscription
|   |   |-- dashboard/page.js       # Tableau de bord
|   |   |-- p/[slug]/page.js        # Portfolio public
|   |   |-- solutions/
|   |       |-- analyse-cv/page.js
|   |       |-- optimiseur-cv/page.js
|   |       |-- portfolio/page.js
|   |       |-- portfolio/[id]/edit/page.js
|   |-- components/
|   |   |-- cv/                     # Composants CV
|   |   |-- shared/                 # Composants partages
|   |-- hooks/                      # useAuth, useCVAnalyzer, useCVOptimizer
|   |-- lib/
|       |-- supabase.js             # Client Supabase
|       |-- api/                    # Clients API (cvApi, portfolioApi)
|       |-- constants/              # Templates CV (metadata)
|       |-- utils/                  # cvParser, fileHelpers
|
|-- claude.md                       # Documentation technique complete
|-- README.md                       # Ce fichier
|-- .gitignore
```

---

## API

### Solutions CV

| Methode | Endpoint | Description |
|---|---|---|
| POST | `/api/solutions/analyse-cv` | Analyser un CV (formulaire) |
| POST | `/api/solutions/analyse-cv-pdf` | Extraire le texte d'un PDF |
| POST | `/api/solutions/analyse-cv-pdf-complete` | Extraire + analyser un PDF |
| POST | `/api/solutions/optimiser-cv-formulaire` | Optimiser un CV (formulaire) |
| POST | `/api/solutions/optimiser-cv-pdf` | Optimiser un CV (PDF) |
| POST | `/api/solutions/generer-cv` | Generer un CV PDF (6 templates) |

### Portfolios

| Methode | Endpoint | Description |
|---|---|---|
| POST | `/api/portfolio` | Creer un portfolio |
| GET | `/api/portfolio/user/:userId` | Lister les portfolios d'un utilisateur |
| GET | `/api/portfolio/:portfolioId` | Recuperer un portfolio (editeur) |
| GET | `/api/portfolio/public/:slug` | Recuperer un portfolio public |
| PUT | `/api/portfolio/:portfolioId` | Mettre a jour un portfolio |
| DELETE | `/api/portfolio/:portfolioId` | Supprimer un portfolio |

### Blocs et medias

| Methode | Endpoint | Description |
|---|---|---|
| POST | `/api/portfolio/:portfolioId/blocks` | Ajouter un bloc |
| PUT | `/api/portfolio/blocks/:blockId` | Modifier un bloc |
| DELETE | `/api/portfolio/blocks/:blockId` | Supprimer un bloc |
| PUT | `/api/portfolio/:portfolioId/blocks/reorder` | Reordonner les blocs |
| POST | `/api/portfolio/:portfolioId/media` | Uploader un media |
| GET | `/api/portfolio/:portfolioId/media` | Lister les medias |
| DELETE | `/api/portfolio/media/:mediaId` | Supprimer un media |

### Statistiques et contact

| Methode | Endpoint | Description |
|---|---|---|
| POST | `/api/portfolio-stats/increment-views` | Incrementer les vues |
| POST | `/api/contact/send` | Envoyer un email de contact |

> Pour la documentation API detaillee (body, responses), voir [claude.md](./claude.md#api-et-routes).

---

## Deploiement

### Frontend sur Vercel

1. Creer un compte sur [vercel.com](https://vercel.com/)
2. Importer le repo GitHub
3. Configurer :
   - **Root Directory** : `frontend-v2`
   - **Framework** : Next.js
4. Variables d'environnement :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Backend sur Railway

1. Creer un compte sur [railway.app](https://railway.app/)
2. Deployer depuis GitHub
3. Configurer :
   - **Root Directory** : `backend`
   - **Start Command** : `node src/server.js`
4. Ajouter toutes les variables d'env du fichier `.env`

### n8n en production

- [n8n Cloud](https://n8n.io/cloud) (heberge)
- Self-hosted sur Railway/Render avec PostgreSQL

### Points d'attention

- Les URLs du backend sont codees en dur (`http://localhost:5000`) dans `lib/api/cvApi.js` et `lib/api/portfolioApi.js`. En production, les remplacer par une variable `NEXT_PUBLIC_API_URL`.
- L'adresse d'expedition Resend (`onboarding@resend.dev`) est limitee. Configurer un domaine verifie en production.
- Puppeteer peut necessiter un buildpack Chrome sur les plateformes cloud.
- Restreindre les origines CORS en production dans `server.js`.

---

## Resolution des problemes

| Probleme | Solution |
|---|---|
| `Cannot find module` | `rm -rf node_modules package-lock.json && npm install` |
| Port 5000 deja utilise (Windows) | `netstat -ano \| findstr :5000` puis `taskkill /PID <PID> /F` |
| Port 5000 deja utilise (Mac/Linux) | `kill -9 $(lsof -ti:5000)` |
| Erreur CORS | Verifier que le backend tourne sur le port 5000 |
| Variables d'env non chargees | Le `.env` doit etre dans `backend/src/` (pas `backend/`). Redemarrer apres modification. |
| n8n inaccessible (503) | Lancer `n8n start` dans un terminal separe |
| Supabase "Invalid JWT" | Verifier les cles dans Supabase Dashboard > Settings > API |
| Cache Next.js corrompu | `rm -rf frontend-v2/.next` puis relancer `npm run dev` |

> Guide de depannage complet : [claude.md](./claude.md#resolution-des-problemes)

---

## Roadmap

- [x] Authentification utilisateur (Supabase Auth)
- [x] Analyseur de CV (formulaire + PDF)
- [x] Optimiseur de CV (formulaire + PDF)
- [x] Generateur de CV PDF (6 templates)
- [x] Portfolio Pro (editeur de blocs, medias, QR code)
- [x] Compteur de vues portfolio
- [x] Mode sombre portfolio
- [x] Formulaire de contact portfolio (Resend)
- [ ] Solutions fiscales IA
- [ ] Solutions marketing IA
- [ ] Espace developpeurs IA
- [ ] Support multilingue (FR/EN)
- [ ] URL backend configurable via variable d'environnement
- [ ] Tests unitaires et E2E
- [ ] CI/CD (GitHub Actions)

---

## Contribution

Les contributions sont les bienvenues.

```bash
# 1. Forker le projet sur GitHub

# 2. Creer une branche
git checkout -b feature/ma-fonctionnalite

# 3. Commiter
git commit -m "feat: description de la fonctionnalite"

# 4. Pusher
git push origin feature/ma-fonctionnalite

# 5. Ouvrir une Pull Request sur GitHub
```

### Conventions de commit

| Prefixe | Usage |
|---|---|
| `feat:` | Nouvelle fonctionnalite |
| `fix:` | Correction de bug |
| `docs:` | Documentation |
| `refactor:` | Refactoring |
| `style:` | Formatage |
| `test:` | Tests |
| `chore:` | Maintenance |

---

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de details.

---

## Contact

**Pauzzle-ozz**

- GitHub : [@Pauzzle-ozz](https://github.com/Pauzzle-ozz)
- Repository : [Mew-mew-Ai](https://github.com/Pauzzle-ozz/Mew-mew-Ai)
- Issues : [Signaler un probleme](https://github.com/Pauzzle-ozz/Mew-mew-Ai/issues)
- Documentation technique : [claude.md](./claude.md)

---

## Remerciements

- [Next.js](https://nextjs.org/) - Framework React
- [Supabase](https://supabase.com/) - Base de donnees + Auth + Storage
- [n8n](https://n8n.io/) - Orchestration des workflows IA
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Resend](https://resend.com/) - Envoi d'emails
- [Puppeteer](https://pptr.dev/) - Generation de PDF
