---
name: branding
description: Définition de l'identité visuelle et de la cohérence de marque pour Mew-mew-Ai.
---

# Skill : Branding pour Mew-mew-Ai

## Contexte du projet

Mew-mew-Ai est une plateforme SaaS multi-solutions qui nécessite :
- **Identité visuelle forte** : Logo, couleurs, polices, style graphique
- **Positionnement clair** : IA accessible, professionnelle, moderne
- **Cohérence de marque** : Même look & feel sur toutes les solutions (CV, portfolio, etc.)
- **Ton de voix** : Communication, messages, copywriting

## 1. Identité de marque

### Positionnement

**Promesse** : "L'IA qui propulse votre carrière"

**Valeurs** :
- **Accessible** : Outils IA simples, pas de jargon technique
- **Professionnel** : Résultats de qualité, fiables
- **Moderne** : Technologies récentes (Next.js, IA, n8n)
- **Humain** : Accompagnement, pas seulement des algorithmes

**Public cible** :
- Chercheurs d'emploi (tous niveaux)
- Professionnels en reconversion
- Freelances/indépendants (portfolio)
- Jeunes diplômés

**Différenciation** :
- Multi-solutions (pas seulement CV)
- IA orchestrée par n8n (flexible)
- Portfolio Pro intégré
- Templates CV personnalisables (6 styles)

### Personnalité de marque

| Dimension | Mew-mew-Ai |
|-----------|------------|
| **Innovant** ↔️ Traditionnel | 80% innovant (IA, tech moderne) |
| **Accessible** ↔️ Elite | 70% accessible (pour tous) |
| **Sérieux** ↔️ Ludique | 60% sérieux (contexte pro) |
| **Minimaliste** ↔️ Expressif | 70% minimaliste (UI épurée) |
| **Humain** ↔️ Tech | 60% humain (empathie + tech) |

## 2. Logo et identité visuelle

### Logo actuel (hypothèse)

**Nom** : Mew-mew-Ai (stylisé `Mew-mew-Ai` ou `MEW-MEW-AI`)

**Concepts possibles** :
1. **Typographique** : Nom seul avec typo moderne (Geist Sans Bold)
2. **Icône + texte** : Symbole IA (neurone, circuit) + nom
3. **Mascotte** : Chat stylisé (référence "mew" = miaulement) + tech

### Recommandations pour un logo

**Contraintes** :
- Lisible en petit (favicon 16x16px)
- Fonctionne en noir & blanc (accessibilité)
- Déclinable (horizontal, vertical, icône seule)
- Moderne mais intemporel

**Structure recommandée** :
```
+---+  MEW-MEW-AI
| 🤖 |  L'IA qui propulse
+---+  votre carrière
```

**Déclinaisons** :
- **Horizontal** : Logo + texte côte à côte (header)
- **Vertical** : Logo au-dessus du texte (mobile)
- **Icône seule** : Favicon, app icon
- **Noir & blanc** : Version monochrome (impression)

### Palette de couleurs de marque

**Couleur primaire** : Bleu #2563eb (primary-600)
- **Signification** : Confiance, professionnalisme, technologie
- **Usage** : Logo, CTA, liens, accents

**Couleurs secondaires** :
- **Gris foncé** : #1f2937 (gray-800) - Texte, sérieux
- **Gris clair** : #f9fafb (gray-50) - Backgrounds
- **Accent vert** : #16a34a (green-600) - Success, validation

**Palette complète** : Voir [skill_couleur.md](skill_couleur.md)

### Typographie de marque

**Principale** : Geist Sans
- Moderne, lisible, tech
- Usage : Titres, UI, texte

**Secondaire** : Geist Mono
- Technique, code
- Usage : Code snippets, template Tech

**Voir détails** : [skill_typographie.md](skill_typographie.md)

## 3. Charte graphique

### Principes de design

**1. Épuré et moderne**
```jsx
// ✅ Interface claire, whitespace généreux
<div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
  <h1 className="text-4xl font-bold text-gray-900">Titre clair</h1>
  <p className="text-lg text-gray-600 max-w-2xl">
    Texte aéré, facile à lire.
  </p>
</div>

// ❌ Éviter : trop de contenu entassé
<div className="p-2">
  <h1 className="text-sm">Titre trop petit</h1>
  <p className="text-xs">Texte illisible...</p>
</div>
```

**2. Hiérarchie visuelle forte**
- 1 CTA principal par page (bleu)
- Titres décroissants (h1 > h2 > h3)
- Espacement cohérent (multiples de 8px)

**3. Contrastes WCAG AA**
- Texte noir/gris foncé sur fond blanc
- Boutons avec ratio 4.5:1 minimum
- Voir [skill_accessibilite.md](skill_accessibilite.md)

**4. Responsive mobile-first**
- Desktop → Tablette → Mobile
- Breakpoints Tailwind (sm, md, lg)
- Voir [skill_design_web.md](skill_design_web.md)

### Éléments graphiques

#### Icônes

**Style** : Outline (contour), 24x24px par défaut

**Bibliothèque recommandée** : Heroicons (par Tailwind)
```jsx
import { DocumentTextIcon, SparklesIcon, BriefcaseIcon } from '@heroicons/react/24/outline';

<div className="flex items-center gap-2">
  <DocumentTextIcon className="w-6 h-6 text-primary-600" />
  <span>Analyser mon CV</span>
</div>
```

**Couleurs** :
- Icônes primaires : `text-primary-600`
- Icônes secondaires : `text-gray-600`
- Icônes désactivées : `text-gray-400`

#### Illustrations

**Style** : Minimalistes, flat design, couleurs de la palette

**Usages** :
- Landing page (hero section)
- Pages vides (empty states)
- Onboarding (tutoriels)

**Exemple d'empty state** :
```jsx
<div className="text-center py-12">
  <svg className="w-24 h-24 mx-auto text-gray-300">
    {/* Illustration */}
  </svg>
  <h3 className="text-xl font-semibold text-gray-900 mt-4">
    Aucun portfolio pour le moment
  </h3>
  <p className="text-gray-600 mt-2">
    Créez votre premier portfolio en quelques minutes.
  </p>
  <button className="mt-6 bg-primary-600 text-white px-6 py-2.5 rounded-md">
    Créer un portfolio
  </button>
</div>
```

#### Images

**Style** : Professionnelles, modernes, diversifiées

**Formats** :
- **Photos** : WebP (optimisées)
- **Icônes/logos** : SVG (vectoriel)
- **Screenshots** : PNG (haute résolution)

**Optimisation Next.js** :
```jsx
import Image from 'next/image';

<Image
  src="/images/hero.jpg"
  alt="Personne travaillant sur son CV"
  width={1200}
  height={800}
  priority
  className="rounded-lg"
/>
```

### Photographie

**Style** : Professionnelle, lumineuse, diverse

**Sujets** :
- Personnes au travail (bureau, laptop)
- Entretiens d'embauche
- Équipes collaboratives
- Diversité (âge, origine, genre)

**À éviter** :
- Photos stock clichées (poignée de main, costume)
- Fonds blancs artificiels
- Manque de diversité

**Sources recommandées** :
- Unsplash (gratuit)
- Pexels (gratuit)
- Pixabay (gratuit)

## 4. Ton de voix et copywriting

### Principes de communication

**1. Clair et direct**
```
✅ "Analysez votre CV en 5 minutes"
❌ "Procédez à l'analyse exhaustive de votre curriculum vitae"
```

**2. Inclusif et accessible**
```
✅ "Votre CV" (tutoiement, proximité)
❌ "Le curriculum vitae de l'utilisateur" (distant)
```

**3. Positif et encourageant**
```
✅ "Améliorez votre CV pour décrocher plus d'entretiens"
❌ "Votre CV a des défauts qui bloquent vos candidatures"
```

**4. Humain et empathique**
```
✅ "Nous comprenons que chercher un emploi peut être difficile"
❌ "Le système analyse vos données"
```

### Vocabulaire de marque

**Mots-clés** :
- Propulser (slogan)
- Optimiser, améliorer
- Décrocher (un entretien, un poste)
- Valoriser (vos compétences)
- Créer, générer
- Personnaliser

**À éviter** :
- Jargon technique (backend, webhook, n8n)
- Termes négatifs (échec, rejet, faible)
- Promesses exagérées ("100% de réussite")

### Messages clés par solution

#### Analyseur de CV
```
Titre : "Découvrez les métiers qui vous correspondent"
Sous-titre : "Notre IA analyse votre CV et identifie les opportunités cachées"
CTA : "Analyser mon CV gratuitement"
```

#### Optimiseur de CV
```
Titre : "Optimisez votre CV pour les ATS"
Sous-titre : "Passez les filtres automatiques et décrochez plus d'entretiens"
CTA : "Optimiser mon CV maintenant"
```

#### Générateur de CV
```
Titre : "Créez un CV professionnel en quelques clics"
Sous-titre : "Choisissez parmi 6 templates conçus par des experts"
CTA : "Générer mon CV PDF"
```

#### Portfolio Pro
```
Titre : "Créez votre portfolio en ligne en 10 minutes"
Sous-titre : "Mettez en avant vos projets et partagez votre QR code"
CTA : "Créer mon portfolio gratuit"
```

### Microcopy (petits textes)

**Boutons** :
```
✅ "Commencer" (action claire)
❌ "Cliquez ici" (générique)

✅ "Envoyer mon message"
❌ "Soumettre" (technique)

✅ "Télécharger mon CV PDF"
❌ "Télécharger" (imprécis)
```

**Placeholders** :
```
✅ "Développeur Full-Stack passionné par le web"
❌ "Entrez votre résumé"

✅ "jean.dupont@exemple.com"
❌ "Email"
```

**Messages d'erreur** :
```
✅ "L'email est obligatoire pour vous contacter"
❌ "Champ requis"

✅ "Le fichier doit être un PDF de moins de 2 Mo"
❌ "Erreur de validation"
```

**Messages de succès** :
```
✅ "CV généré avec succès ! Téléchargez-le ci-dessous."
❌ "Opération réussie"

✅ "Votre portfolio est en ligne sur mew-mew.ai/p/mon-portfolio"
❌ "Portfolio publié"
```

## 5. Cohérence de marque

### Sur toutes les solutions

**Même structure** :
1. Titre clair (h1)
2. Sous-titre explicatif (p)
3. CTA visible (button primary)
4. Illustration/screenshot

**Même palette** :
- Primary : Bleu #2563eb
- Success : Vert #16a34a
- Error : Rouge #dc2626

**Même typographie** :
- Titres : Geist Sans Bold
- Texte : Geist Sans Regular
- Code : Geist Mono

### Sur tous les points de contact

| Point de contact | Cohérence à vérifier |
|------------------|----------------------|
| **Site web** | Couleurs, polices, ton de voix |
| **Emails** | Header avec logo, footer cohérent |
| **CV générés** | Mention "Généré avec Mew-mew-Ai" |
| **Portfolio public** | Footer "Propulsé par Mew-mew-Ai" |
| **Réseaux sociaux** | Même logo, même bio |
| **Documentation** | Même style rédactionnel |

### Templates de communication

#### Email de bienvenue
```
Objet : Bienvenue sur Mew-mew-Ai 👋

Bonjour [Prénom],

Bienvenue sur Mew-mew-Ai, la plateforme IA qui propulse votre carrière !

Vous pouvez dès maintenant :
- 📄 Analyser votre CV en 5 minutes
- ✨ Optimiser votre CV pour les ATS
- 🎨 Créer votre portfolio professionnel

Commencez par analyser votre CV : [CTA]

À très bientôt,
L'équipe Mew-mew-Ai

---
Mew-mew-Ai | L'IA qui propulse votre carrière
mew-mew.ai
```

#### Email de contact (portfolio)
```
Objet : [Nom] vous a contacté via votre portfolio

Bonjour [Prénom du propriétaire],

[Nom du visiteur] ([email]) vous a envoyé un message via votre portfolio :

"[Message]"

Vous pouvez répondre directement à cet email.

---
Ce message a été envoyé depuis votre portfolio :
mew-mew.ai/p/[slug]

Propulsé par Mew-mew-Ai
```

## 6. Guide d'utilisation de la marque

### Logo

**✅ À FAIRE** :
- Respecter les marges de sécurité (whitespace)
- Utiliser les couleurs officielles
- Conserver les proportions
- Fond blanc ou transparent

**❌ À ÉVITER** :
- Déformer le logo
- Changer les couleurs
- Ajouter des effets (ombre, gradient)
- Placer sur fond complexe

### Couleurs

**✅ Utiliser** :
- Palette définie (primary, gray, sémantiques)
- Tokens Tailwind (pas de hex en dur)
- Contrastes WCAG AA

**❌ Éviter** :
- Couleurs hors palette
- Contrastes insuffisants
- Trop de couleurs sur une page

### Typographie

**✅ Utiliser** :
- Geist Sans (titres, UI)
- Geist Mono (code)
- Hiérarchie claire (h1 > h2 > h3)

**❌ Éviter** :
- Polices custom non optimisées
- Trop de styles (italic, underline, etc.)
- Tailles incohérentes

## 7. Évolution de la marque

### Itérations futures

**Phase 1 (actuel)** :
- Logo typographique simple
- Palette bleu + gris
- 3 solutions (CV, portfolio)

**Phase 2 (croissance)** :
- Logo avec icône/mascotte
- Illustration style propre
- Nouvelles solutions (fiscalité, marketing)

**Phase 3 (maturité)** :
- Design system publié
- Brand book complet (PDF)
- Merchandising (si pertinent)

### Feedback utilisateurs

**Mesurer la perception** :
- Sondages (professionnel ? moderne ? accessible ?)
- A/B tests (logo, couleurs, copywriting)
- Analytics (taux de conversion par CTA)

**Ajuster si nécessaire** :
- Ton de voix trop formel → Plus décontracté
- Couleurs trop froides → Ajouter du orange/vert
- Logo illisible → Simplifier

## Checklist Branding

Avant de publier un nouveau contenu :

- [ ] **Logo** : Utilisé correctement (taille, couleurs, proportions)
- [ ] **Couleurs** : Palette respectée (primary, gray, sémantiques)
- [ ] **Typographie** : Geist Sans + Geist Mono
- [ ] **Ton de voix** : Clair, direct, positif, humain
- [ ] **Messages clés** : Cohérents avec le positionnement
- [ ] **Microcopy** : Boutons, placeholders, erreurs optimisés
- [ ] **Illustrations** : Style cohérent, flat design
- [ ] **Photos** : Professionnelles, diversifiées
- [ ] **Accessibilité** : Contrastes, alt texts, ARIA
- [ ] **Cohérence** : Même look sur toutes les solutions

---

**Utilisation** : Référence pour maintenir une identité de marque forte et cohérente sur Mew-mew-Ai
**Dernière mise à jour** : Février 2026
