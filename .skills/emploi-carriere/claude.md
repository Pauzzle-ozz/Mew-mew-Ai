# Skills Emploi & Carrière - Référence Technique

## Pourquoi ce dossier existe

Quand je travaille sur les fonctionnalités emploi/carrière de Mew-mew-Ai, j'utilise les compétences documentées ici :

- **Créer des templates de CV** (HTML/CSS avec Puppeteer)
- **Optimiser l'analyseur de CV** (améliorer les prompts n8n, parsing)
- **Concevoir l'éditeur de portfolio** (UX, blocs, médias)
- **Rédiger les textes** de la plateforme (landing page, emails, tooltips)
- **Améliorer les formulaires** (structure, validation, UX)
- **Générer du contenu d'aide** (tooltips, exemples, guides)

## Compétences disponibles dans ce dossier

Les fichiers de skills ici couvrent :

- **Design de CV** : Structure, hiérarchie visuelle, lisibilité
- **Rédaction de CV** : Verbes d'action, quantification, mots-clés ATS
- **Lettres de motivation** : Structure, accroche, personnalisation
- **Préparation entretien** : Questions fréquentes, méthode STAR, pitch
- **Carrière long terme** : Plan de développement, reconversion
- **Portfolio professionnel** : Structure, projets, personal branding
- **LinkedIn & réseautage** : Optimisation profil, posts

## Applications concrètes dans Mew-mew-Ai

### 1. Templates de CV (6 templates)

**Fichier** : `backend/src/templates/templateFactory.js`

**Templates existants** :
| Template | Style | Police | Couleur | Public |
|----------|-------|--------|---------|--------|
| moderne | Épuré, bleu | Calibri | #0066cc | Tech, startups |
| classique | Centré, noir | Times New Roman | Noir | Finance, juridique |
| creatif | Gradient, audacieux | Helvetica | Rose/violet | Com, art |
| tech | Terminal, monospace | Consolas | Vert | Dev, IT |
| executive | Double bordure | Georgia | Noir/or | C-level |
| minimal | Ultra épuré | Helvetica Neue | Gris foncé | UX/UI, archi |

**Skills utilisés** :
- `skill_design_cv.md` : Principes de structure, hiérarchie
- `skill_typographie.md` : Choix de polices par style
- `skill_couleur.md` : Palettes adaptées au public cible

**Exemples d'utilisation** :
- "Crée un nouveau template scandinave/minimaliste" → J'applique whitespace, typographie épurée
- "Améliore le template tech" → J'ajoute des éléments visuels type terminal (borders, backgrounds)
- "Optimise tous les templates pour l'impression" → Je vérifie margins, page-break, @media print

### 2. Analyseur de CV

**Routes** :
- `POST /api/solutions/analyse-cv` (formulaire)
- `POST /api/solutions/analyse-cv-pdf-complete` (PDF)

**Workflow** :
1. Frontend envoie les données CV ou PDF
2. Backend appelle n8n webhook (via `cvService.js`)
3. n8n exécute le workflow IA (OpenAI/Claude)
4. Retour : métiers recommandés + analyse

**Skills utilisés** :
- `skill_carriere_long_terme.md` : Mapping compétences → métiers
- `skill_design_cv.md` : Comprendre la structure d'un CV pour mieux parser

**Exemples d'utilisation** :
- "Améliore le prompt n8n pour mieux détecter les soft skills" → J'utilise mes connaissances métier
- "Crée un système de scoring de CV" → J'applique les critères ATS, lisibilité, contenu

### 3. Optimiseur de CV

**Routes** :
- `POST /api/solutions/optimiser-cv-formulaire`
- `POST /api/solutions/optimiser-cv-pdf`

**Workflow** :
1. Analyse du CV actuel
2. Identification des points faibles (mots-clés manquants, verbes faibles, structure)
3. Suggestions d'amélioration

**Skills utilisés** :
- `skill_design_cv.md` : Structure optimale
- `skill_entretien_embauche.md` : Quantifier les résultats (méthode STAR)

**Exemples d'utilisation** :
- "Améliore les suggestions de l'optimiseur" → J'enrichis avec des exemples de verbes d'action
- "Ajoute une détection de mots-clés ATS" → J'utilise les listes de keywords par métier

### 4. Portfolio Pro (éditeur de blocs)

**Tables Supabase** :
- `portfolios` (titre, slug, template, published, views_count, primary_color, settings)
- `portfolio_blocks` (type, content JSONB, order)
- `portfolio_media` (Supabase Storage)

**Types de blocs** :
- Hero, texte, image, vidéo, galerie, projets, compétences, contact

**Skills utilisés** :
- `skill_carriere_long_terme.md` : Structurer un portfolio cohérent
- `skill_design_cv.md` : Hiérarchie visuelle, mise en avant des réalisations

**Exemples d'utilisation** :
- "Crée un nouveau type de bloc 'timeline'" → Je conçois le schéma JSONB, le composant React
- "Améliore l'UX de l'éditeur de blocs" → J'applique drag & drop, preview en temps réel
- "Ajoute des templates de portfolio pré-remplis" → Je crée des structures types (dev, designer, etc.)

### 5. Formulaires CV (analyse/optimisation)

**Composants** :
- `frontend-v2/components/cv/AnalyzerForm.jsx`
- `frontend-v2/components/cv/CVFormIdentity.jsx`

**Skills utilisés** :
- `skill_design_cv.md` : Savoir quels champs sont essentiels
- `skill_entretien_embauche.md` : Structurer les expériences (STAR method)

**Exemples d'utilisation** :
- "Améliore le formulaire d'expériences" → J'ajoute des placeholders explicites, tooltips
- "Crée un assistant de rédaction en temps réel" → Je suggère des verbes d'action pendant la saisie

### 6. Textes de la plateforme

**Où** :
- Landing page (`app/page.js`)
- Emails de bienvenue (via Resend)
- Tooltips, messages d'erreur, guides

**Skills utilisés** :
- `skill_lettre_motivation.md` : Storytelling, accroche
- `skill_entretien_embauche.md` : Pitch, clarté du message

**Exemples d'utilisation** :
- "Rédige la section héro de la landing page" → J'applique AIDA (Attention, Intérêt, Désir, Action)
- "Crée l'email de bienvenue" → Je structure : accueil, bénéfices, CTA
- "Écris les tooltips du formulaire CV" → Je fournis des exemples concrets, courts

## Principes métier appliqués

### Structure de CV optimale

1. **En-tête** : Nom, titre poste, contact, LinkedIn (pas de photo sauf si demandé)
2. **Résumé professionnel** : 2-3 lignes (pitch de valeur)
3. **Expériences** : Chronologique inversé, verbes d'action, résultats quantifiés
4. **Formations** : Diplômes, certifications
5. **Compétences** : Techniques + soft skills (mots-clés ATS)
6. **Langues** : Niveau CECRL (A1-C2)
7. **Centres d'intérêt** : Uniquement si pertinent/différenciant

### Verbes d'action (par catégorie)

| Catégorie | Verbes |
|-----------|--------|
| **Leadership** | Piloté, Dirigé, Coordonné, Supervisé, Managé |
| **Création** | Conçu, Développé, Créé, Lancé, Élaboré |
| **Amélioration** | Optimisé, Amélioré, Renforcé, Réorganisé, Modernisé |
| **Résultats** | Augmenté, Réduit, Généré, Économisé, Atteint |
| **Communication** | Présenté, Négocié, Rédigé, Animé, Formé |

### Quantification des résultats

❌ "Géré une équipe" → ✅ "Géré une équipe de 5 développeurs"
❌ "Augmenté les ventes" → ✅ "Augmenté les ventes de 30% en 6 mois"
❌ "Amélioré le processus" → ✅ "Réduit le temps de traitement de 2h à 30min (-75%)"

### Mots-clés ATS (Applicant Tracking Systems)

**Principes** :
- Utiliser les **termes exacts** de l'annonce
- Éviter les acronymes sans les définir (ex: "SEO (Search Engine Optimization)")
- Titres de postes **standards** (pas de créativité excessive)
- Format simple (pas de tableaux complexes, headers/footers)

**Formats acceptés** : PDF (privilégié), DOCX (OK)

### Structure de portfolio professionnel

**Sections essentielles** :
1. **Hero** : Nom, titre, tagline, photo pro, CTA
2. **À propos** : Parcours, expertise, différenciation
3. **Projets** : 3-6 projets phares (image, description, résultats, techno)
4. **Compétences** : Techniques + soft skills (visuel)
5. **Parcours** : Timeline (études + expériences)
6. **Témoignages** : Social proof (clients, collègues)
7. **Contact** : Formulaire + réseaux sociaux

## Bonnes pratiques pour les templates CV

### ✅ À FAIRE

- **Hiérarchie claire** : Nom > Titre > Sections > Contenus
- **Marges suffisantes** : 1.5-2cm (impression)
- **Line-height** : 1.4-1.6 (lisibilité)
- **Couleurs limitées** : 1-2 couleurs max (sauf template créatif)
- **Sections bien séparées** : Whitespace entre les blocs
- **Print-friendly** : CSS `@media print` pour optimiser l'impression

### ❌ À ÉVITER

- **Trop de pages** : 1 page (junior), max 2 pages (senior)
- **Polices fantaisistes** : Pas de Comic Sans, Papyrus, etc.
- **Texte trop petit** : Min 10pt (print), 14px (web)
- **Infos personnelles** : Pas d'âge, situation familiale, religion
- **"Curriculum Vitae"** comme titre (redondant)
- **Expériences > 15 ans** : Synthétiser ou supprimer

## Relation avec les autres domaines

- **Design** : Création visuelle des templates CV, UI du portfolio
- **Web** : Implémentation technique (Puppeteer PDF, éditeur de blocs)
- **Communication** : Storytelling, personal branding, pitch
- **Marketing** : SEO LinkedIn, self-promotion

## Évolution des skills

Au fur et à mesure, j'enrichis ce dossier avec :
- Nouveaux templates de CV (corporatif, startup, académique, etc.)
- Banque de verbes d'action par secteur (tech, finance, santé, etc.)
- Exemples de CVs bien/mal rédigés (avant/après)
- Guidelines spécifiques par métier (dev, designer, manager, etc.)

---

**Utilisation** : Référence technique pour Claude lors du développement des fonctionnalités emploi/carrière
**Dernière mise à jour** : Février 2026
