# Dossier .skills - Bibliothèque de Compétences Techniques

## Qu'est-ce que ce dossier ?

Le dossier `.skills` est une **bibliothèque de référence technique** pour Claude (moi). C'est mon outil de travail quand je développe, améliore ou maintiens la plateforme **Mew-mew-Ai**.

## Pourquoi ce dossier existe ?

Quand tu (Pauzzle) me demandes de :
- Créer un nouveau template de CV → Je consulte `.skills/design/`
- Refondre l'interface de la plateforme → Je consulte `.skills/design/` et `.skills/web/`
- Optimiser le SEO du site → Je consulte `.skills/marketing/` et `.skills/web/`
- Rédiger les textes de la landing page → Je consulte `.skills/communication/`
- Améliorer la performance du code → Je consulte `.skills/web/`

**Les skills ne sont PAS des fonctionnalités à développer pour les utilisateurs finaux.**
**Les skills sont des CONNAISSANCES que j'utilise pour mieux développer le projet.**

## Structure du dossier

```
.skills/
│
├── _taxonomy.md              # Vocabulaire normalisé
├── claude.md                 # Ce fichier - documentation globale
│
├── emploi-carriere/          # Connaissances emploi & carrière
│   ├── claude.md             # Comment j'utilise ces compétences pour le projet
│   ├── skill_design_cv.md    # Comment créer de beaux CV
│   ├── skill_entretien_embauche.md
│   └── ...
│
├── finance/                  # Connaissances finance
│   ├── claude.md
│   └── ...
│
├── fiscalite/                # Connaissances fiscalité
│   ├── claude.md
│   └── ...
│
├── marketing/                # Connaissances marketing
│   ├── claude.md
│   └── ...
│
├── communication/            # Connaissances communication
│   ├── claude.md
│   └── ...
│
├── design/                   # Connaissances design
│   ├── claude.md
│   └── ...
│
└── web/                      # Connaissances développement web
    ├── claude.md
    └── ...
```

## Quand j'utilise ces skills

### Exemples concrets

| Tu me demandes... | J'utilise... |
|-------------------|--------------|
| "Crée un nouveau template de CV moderne" | `design/skill_design_cv.md`, `design/skill_typographie.md` |
| "Refais la landing page pour qu'elle convertisse mieux" | `marketing/`, `communication/skill_storytelling.md` |
| "Optimise le temps de chargement du site" | `web/skill_performance.md`, `web/skill_architecture_web.md` |
| "Rédige l'email de bienvenue pour les nouveaux utilisateurs" | `communication/skill_tonalite_de_marque.md` |
| "Améliore l'accessibilité du portfolio" | `design/skill_accessibilite.md`, `web/` |

## Format des fichiers de skills

Chaque fichier de skill contient des **connaissances techniques** structurées :

```markdown
# Nom de la compétence

## Description
[Ce que c'est, pourquoi c'est important]

## Quand l'utiliser (dans Mew-mew-Ai)
[Cas concrets où cette compétence s'applique au projet]

## Principes & Méthodologies
[Frameworks, approches, règles à suivre]

## Bonnes pratiques
[Ce qu'il FAUT faire]

## Erreurs à éviter
[Ce qu'il NE FAUT PAS faire]

## Exemples concrets
[Applications réelles, templates, code]

## Ressources & Outils
[Liens, librairies, outils recommandés]
```

## Différence avec les autres fichiers du projet

| Fichier | Rôle | Contenu |
|---------|------|---------|
| **CLAUDE.md** (racine) | Documentation technique du projet | Architecture, tech stack, APIs, déploiement |
| **MEMORY.md** (auto memory) | Mémoire des décisions et leçons | Erreurs passées, choix techniques, contexte projet |
| **.skills/** | **Bibliothèque de compétences métier** | Connaissances design, dev, marketing, etc. |

## Comment enrichir ce dossier

Quand on découvre une nouvelle technique, un pattern utile ou une bonne pratique :

1. **Identifier le domaine** (design, web, marketing, etc.)
2. **Créer/mettre à jour le skill** correspondant
3. **Documenter** : principes, exemples, code, ressources
4. **Utiliser** : mobiliser ce skill lors des prochaines tâches

## Vision

Ce dossier doit devenir ma **boîte à outils de référence** :
- Quand je crée un template → Je suis les principes de design documentés
- Quand j'écris du code → J'applique les patterns web documentés
- Quand je rédige un texte → Je respecte la tonalité de marque documentée
- Quand j'optimise le SEO → Je suis la checklist marketing documentée

**Objectif** : Ne jamais partir de zéro, toujours partir des meilleures pratiques documentées.

---

**Dernière mise à jour** : Février 2026
**Auteur** : Pauzzle-ozz
**Pour** : Claude (assistant IA développant Mew-mew-Ai)
