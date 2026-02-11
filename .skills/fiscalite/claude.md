# Skills Fiscalité - Référence Technique

## Pourquoi ce dossier existe

**Note** : Le domaine fiscalité n'est pas directement applicable au développement technique de Mew-mew-Ai, mais ces compétences peuvent être utiles pour :

- **Comprendre les obligations légales** (entreprise, auto-entrepreneur)
- **Gérer la facturation** (TVA, mentions légales)
- **Respecter les réglementations** (RGPD, CGV, CGU)
- **Conseiller sur le statut juridique** (si Pauzzle consulte)

## Compétences disponibles dans ce dossier

Les fichiers de skills ici couvrent :

- **Statuts juridiques** : Auto-entrepreneur, SASU, EURL, SAS
- **TVA** : Franchise en base, TVA intracommunautaire
- **Facturation** : Mentions obligatoires, numérotation
- **RGPD** : Protection des données (applicable à Mew-mew-Ai)
- **CGV/CGU** : Conditions générales (si SaaS payant)

## Applications concrètes dans Mew-mew-Ai

### 1. RGPD & Protection des données

**Obligations** :
- **Consentement** : Cookies, analytics, newsletters
- **Droit d'accès** : Utilisateur peut demander ses données
- **Droit à l'effacement** : "Droit à l'oubli"
- **Portabilité** : Export des données en format standard
- **Politique de confidentialité** : Document obligatoire

**Stack actuel** :
- Supabase (hébergement EU, conforme RGPD)
- Pas de cookies tiers (bon point RGPD)
- Auth via Supabase (pas de stockage passwords en clair)

**Skills utilisés** :
- `skill_rgpd.md` : Obligations, implémentation

**Exemples d'utilisation** :
- "Crée la politique de confidentialité" → Je rédige selon le template RGPD
- "Implémente le droit à l'effacement" → Je code la suppression complète des données utilisateur
- "Ajoute le banner de cookies" → J'implémente le consentement (si analytics ajouté)

### 2. Mentions légales

**Obligatoire sur tout site web** :

- **Éditeur** : Nom, adresse, email, téléphone
- **Hébergeur** : Supabase (nom, siège social)
- **Directeur de publication** : Pauzzle-ozz
- **CNIL** : Si collecte de données (Supabase = responsable de traitement)

**Page à créer** : `/mentions-legales`

**Skills utilisés** :
- `skill_mentions_legales.md` : Obligations légales

**Exemples d'utilisation** :
- "Crée la page mentions légales" → Je rédige avec toutes les mentions obligatoires
- "Vérifie la conformité légale du site" → Je checklist RGPD, mentions, CGV/CGU

### 3. CGV/CGU (si SaaS payant)

**CGV** (Conditions Générales de Vente) : Si vente de services/produits
- Tarifs, modalités de paiement
- Droit de rétractation (14 jours en France)
- Garanties, responsabilités

**CGU** (Conditions Générales d'Utilisation) : Pour tous les utilisateurs
- Utilisation autorisée de la plateforme
- Propriété intellectuelle (templates CV, contenu)
- Limitation de responsabilité
- Résiliation du compte

**Pages à créer** :
- `/cgv` (si payant)
- `/cgu` (obligatoire)

**Skills utilisés** :
- `skill_cgv_cgu.md` : Rédaction, clauses importantes

**Exemples d'utilisation** :
- "Rédige les CGU de Mew-mew-Ai" → Je couvre utilisation, propriété intellectuelle, résiliation
- "Ajoute les clauses spécifiques SaaS" → Je documente les limites de service, uptime, données

### 4. Facturation (si SaaS payant)

**Mentions obligatoires sur factures** :
- Numéro de facture unique et séquentiel
- Date d'émission
- Identité vendeur (SIRET, adresse, TVA si assujetti)
- Identité client (nom, adresse)
- Description des services
- Prix HT, TVA, Prix TTC
- Modalités de paiement

**Outils** :
- Stripe Billing (génère les factures automatiquement)
- Alternative : Pennylane, Sellsy

**Skills utilisés** :
- `skill_facturation.md` : Mentions obligatoires, conformité

**Exemples d'utilisation** :
- "Configure Stripe Billing" → Je setup les factures automatiques conformes
- "Crée un template de facture" → Je m'assure d'avoir toutes les mentions légales

### 5. TVA (si entreprise française)

**Franchise en base** (auto-entrepreneur) :
- Pas de TVA si CA < seuils (77 700€ services, 188 700€ vente)
- Mention obligatoire : "TVA non applicable, art. 293 B du CGI"

**Si assujetti à la TVA** :
- Collecter la TVA (20% en France pour services numériques)
- Déclarer mensuellement ou trimestriellement
- Numéro de TVA intracommunautaire

**Skills utilisés** :
- `skill_tva.md` : Régimes, déclarations

**Exemples d'utilisation** :
- "Dois-je appliquer la TVA sur Mew-mew-Ai ?" → J'analyse le statut, le CA prévisionnel
- "Implémente la TVA dans Stripe" → Je configure les tax rates

### 6. Propriété intellectuelle

**Éléments à protéger** :
- **Code source** : License (MIT, GPL, propriétaire)
- **Templates CV** : Copyright Mew-mew-Ai
- **Marque "Mew-mew-Ai"** : Dépôt INPI (optionnel mais recommandé)
- **Contenus utilisateurs** : Clause dans CGU (propriété utilisateur, licence d'utilisation)

**License recommandée pour le code** :
- **Open-source** : MIT (permissive), GPL (copyleft)
- **Propriétaire** : Tous droits réservés (si SaaS commercial)

**Skills utilisés** :
- `skill_propriete_intellectuelle.md` : Protections, licenses

**Exemples d'utilisation** :
- "Ajoute une license au code" → Je crée LICENSE.md (MIT ou propriétaire)
- "Rédige la clause de propriété intellectuelle des CGU" → Je définis qui possède quoi

## Checklist conformité légale (France)

- [ ] **Mentions légales** : Page `/mentions-legales`
- [ ] **Politique de confidentialité** : Page `/confidentialite`
- [ ] **CGU** : Page `/cgu`
- [ ] **CGV** : Page `/cgv` (si payant)
- [ ] **Cookies** : Banner de consentement (si analytics)
- [ ] **RGPD** : Droit d'accès, rectification, effacement
- [ ] **Facturation** : Conforme (si payant)
- [ ] **TVA** : Gérée correctement (si applicable)
- [ ] **License code** : LICENSE.md à la racine du repo

## Bonnes pratiques légales

### ✅ À FAIRE

- **Consulter un avocat** : Pour les CGV/CGU (si SaaS payant)
- **Héberger en UE** : RGPD plus simple (Supabase EU = ✅)
- **Documenter** : Conservation des preuves (emails, factures) 6-10 ans
- **Transparence** : Clarté des prix, conditions, données collectées
- **Versioning** : Dater les CGV/CGU, notifier les changements

### ❌ À ÉVITER

- **Copier-coller des CGV/CGU** : Personnaliser à votre activité
- **Ignorer le RGPD** : Risque d'amendes (jusqu'à 4% du CA ou 20M€)
- **Pas de mentions légales** : Obligatoires, risque de 75 000€ d'amende
- **Stockage de données sensibles** : Minimiser la collecte (RGPD by design)
- **Cookies sans consentement** : Illégal (sauf cookies strictement nécessaires)

## Outils & ressources

### Générateurs de documents légaux
- **LegalPlace** : CGV/CGU personnalisées (payant)
- **CNIL** : Templates RGPD (gratuit)
- **Pixelpoint.io** : Générateur de politique de confidentialité

### Juridique
- **INPI** : Dépôt de marque (Mew-mew-Ai)
- **Legalstart** : Création d'entreprise, contrats
- **Captain Contrat** : Documents légaux

### RGPD
- **CNIL** : Ressources, guides, modèles
- **Cookiebot** : Gestion du consentement cookies

## Templates de clauses importantes

### Limitation de responsabilité (CGU)
> "Mew-mew-Ai est fourni 'tel quel' sans garantie d'aucune sorte. Nous ne garantissons pas que le service sera ininterrompu ou exempt d'erreurs. L'utilisateur est seul responsable de l'utilisation qu'il fait des résultats fournis par l'IA."

### Propriété intellectuelle (CGU)
> "Les templates CV, le code source et les contenus de la plateforme sont la propriété de Mew-mew-Ai et protégés par le droit d'auteur. Les contenus créés par l'utilisateur (CV, portfolios) restent sa propriété, mais il accorde à Mew-mew-Ai une licence d'utilisation pour le fonctionnement du service."

### Données personnelles (Politique de confidentialité)
> "Nous collectons les données suivantes : email, nom, prénom, CV (texte), portfolios. Ces données sont stockées sur Supabase (EU) et utilisées uniquement pour le fonctionnement du service. Vous disposez d'un droit d'accès, de rectification et de suppression de vos données."

## Relation avec les autres domaines

- **Web** : Implémentation technique du RGPD (suppression données, export)
- **Communication** : Rédaction des documents légaux (clarté, accessibilité)
- **Finance** : Facturation conforme, TVA

## Évolution des skills

Si Mew-mew-Ai évolue juridiquement (paiement, international), j'enrichis ce dossier avec :
- Templates de documents légaux validés par avocat
- Checklist de conformité par pays (si international)
- Gestion de la TVA intracommunautaire (si clients EU)
- Conformité GDPR (version internationale du RGPD)

---

**Utilisation** : Référence technique pour Claude sur les aspects légaux de Mew-mew-Ai
**État** : Domaine de support (pas de développement technique, mais conformité obligatoire)
**Dernière mise à jour** : Février 2026
