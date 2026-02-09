# 🎯 Workflow n8n - Matcher d'Offres

## 📦 Fichier de workflow
- **Fichier** : `matcher-offres-workflow.json`
- **Webhook URL** : `http://localhost:5678/webhook/matcher-offre`
- **Méthode** : POST
- **Mode** : lastNode (retourne automatiquement le dernier node)

## 🚀 Installation rapide

### 1. Importer le workflow dans n8n

1. Ouvre ton interface n8n : http://localhost:5678
2. Clique sur **+ New Workflow** (ou ouvre un workflow existant)
3. Clique sur les **3 points** (menu) en haut à droite
4. Sélectionne **Import from File**
5. Choisis le fichier `matcher-offres-workflow.json`
6. Le workflow s'importe avec tous les nodes configurés ✅

### 2. Configurer les credentials OpenAI

Le workflow utilise **2 modèles IA** :
- **GPT-4o** pour l'analyse principale (node "Analyser Match IA")
- **GPT-4.1-mini** pour la conversion JSON (node "Convertir en JSON")

**Configuration :**

1. Clique sur le node **"Analyser Match IA"**
2. Dans le panneau de droite, clique sur **Credential to connect with**
3. Sélectionne ton credential OpenAI existant (ou crée-en un avec ta clé `sk-...`)
4. Répète pour le node **"Convertir en JSON"**
5. Clique sur **Save** en haut à droite

### 3. Activer le workflow

1. Clique sur le bouton **Inactive** en haut à droite
2. Le statut passe à **Active** ✅
3. Le webhook est maintenant accessible !

## 📋 Structure du workflow

```
[Webhook] → [Formater Données] → [Créer Prompt] → [Analyser Match IA] → [Convertir en JSON] → [Parser JSON] → [Formater Réponse]
                                                      (GPT-4o)              (GPT-4.1-mini)
```

### Nodes du workflow

1. **Webhook Matcher Offre** (Trigger)
   - Path : `/matcher-offre`
   - Mode : `lastNode` (retourne automatiquement le dernier node)
   - Reçoit l'offre + profil candidat

2. **Formater Données** (Set)
   - Formate l'offre et le candidat en texte structuré
   - Crée `offer_text` et `candidate_text`

3. **Créer Prompt Analyse** (Set)
   - Construit le prompt système complet
   - Inclut les instructions détaillées pour les 3 documents

4. **Analyser Match IA** (OpenAI - GPT-4o)
   - Température : 0.7
   - Max tokens : 4000
   - Génère les 3 documents en **texte naturel** :
     * CV personnalisé
     * CV idéal
     * Lettre de motivation

5. **Convertir en JSON** (OpenAI - GPT-4.1-mini)
   - Convertit le texte en **JSON strict**
   - Valide la structure attendue
   - Élimine les erreurs de formatage

6. **Parser JSON** (Set)
   - Parse le JSON retourné
   - Stocke dans `parsed`

7. **Formater Réponse Finale** (Code)
   - Valide que les 3 documents sont présents
   - Ajoute les métadatas (titre offre, nom candidat, date)
   - Retourne le résultat structuré au backend

## 🧪 Tester le workflow

### Via l'interface n8n (mode test)

1. Clique sur **Execute Workflow** (bouton Play)
2. Clique sur le node **Webhook Matcher Offre**
3. Clique sur **Listen for Test Event**
4. Envoie une requête test depuis Postman/Thunder Client :

```bash
POST http://localhost:5678/webhook-test/matcher-offre
Content-Type: application/json

{
  "offer": {
    "title": "Développeur Full Stack",
    "company": "TechCorp",
    "location": "Paris",
    "contract_type": "CDI",
    "salary": "45-55k€",
    "description": "Nous recherchons un développeur Full Stack maîtrisant React et Node.js pour rejoindre notre équipe innovation..."
  },
  "candidate": {
    "prenom": "John",
    "nom": "Doe",
    "titre_poste": "Développeur Full Stack",
    "email": "john.doe@example.com",
    "telephone": "06 12 34 56 78",
    "adresse": "Paris, France",
    "linkedin": "linkedin.com/in/johndoe",
    "experiences": [
      {
        "poste": "Développeur Full Stack",
        "entreprise": "Startup XYZ",
        "localisation": "Paris",
        "date_debut": "2021",
        "date_fin": "Présent",
        "description": "Développement d'applications web avec React et Node.js"
      }
    ],
    "formations": [
      {
        "diplome": "Master Informatique",
        "etablissement": "Université Paris",
        "localisation": "Paris",
        "date_fin": "2021"
      }
    ],
    "competences_techniques": "React, Node.js, TypeScript, PostgreSQL, Docker",
    "competences_soft": "Travail d'équipe, Communication, Résolution de problèmes",
    "langues": "Français (natif), Anglais (courant)"
  }
}
```

5. Le workflow s'exécute et tu vois les résultats dans chaque node ✅

### Via le backend (mode production)

Une fois le workflow **Active**, il écoute automatiquement sur :
```
http://localhost:5678/webhook/matcher-offre
```

Le backend peut appeler ce webhook directement.

## ✨ Avantages de cette approche

### 2 appels IA séparés = Plus fiable

**Pourquoi 2 appels ?**

1. **Premier appel (GPT-4o)** - Génération créative
   - Se concentre sur la **qualité** du contenu
   - Rédige en **langage naturel**
   - Pas de contrainte de format JSON
   - Résultat : texte bien structuré mais libre

2. **Deuxième appel (GPT-4.1-mini)** - Conversion stricte
   - Se concentre sur le **formatage**
   - Convertit en **JSON valide**
   - Moins cher (mini model)
   - Résultat : JSON 100% exploitable

**Avantages :**
- ✅ Moins d'erreurs de parsing JSON
- ✅ Meilleure qualité de contenu (pas de conflit entre créativité et contrainte JSON)
- ✅ Plus économique (mini model pour le parsing)
- ✅ Plus facile à débugger (2 étapes distinctes)

## 🔧 Personnalisation

### Changer les modèles IA

**Node "Analyser Match IA" :**
- **GPT-4o** (recommandé) : meilleure qualité de contenu
- **GPT-4o-mini** : plus rapide, moins cher, qualité correcte
- **GPT-3.5-turbo** : économique mais qualité réduite

**Node "Convertir en JSON" :**
- **GPT-4.1-mini** (recommandé) : parfait pour le parsing JSON
- **GPT-3.5-turbo** : alternative économique

### Modifier le prompt système

Le prompt système définit comment l'IA génère les documents. Tu peux le modifier dans le node **"Analyse IA (OpenAI)"** → **Messages** → **System Message**.

### Ajouter des validations

Tu peux ajouter un node **IF** après **"Parser Réponse IA"** pour valider que :
- Les expériences sont au bon format
- Les compétences sont présentes
- La lettre a tous les champs requis

## 📊 Monitoring

### Voir l'historique d'exécution

1. Dans n8n, va dans **Executions** (menu de gauche)
2. Tu verras toutes les exécutions du workflow
3. Clique sur une exécution pour voir le détail

### Débugger les erreurs

Si le backend retourne une erreur "n8n non accessible" :
- Vérifie que n8n tourne : http://localhost:5678
- Vérifie que le workflow est **Active**
- Vérifie l'URL du webhook dans `.env` : `N8N_WEBHOOK_MATCHER_URL`

Si le parsing JSON échoue :
- Regarde le node **"Parser Réponse IA"**
- Vérifie que l'IA retourne bien du JSON valide
- Ajuste le prompt si nécessaire

## 🔐 Sécurité

Le workflow actuel **n'a pas d'authentification** (mode développement).

Pour sécuriser en production :
1. Ajoute un node **Header Auth** avant **"Extraire Données"**
2. Vérifie que le header `Authorization: Bearer <N8N_SECRET_KEY>` est présent
3. Rejette la requête si l'authentification échoue

## 🎉 C'est prêt !

Une fois importé et activé, le workflow est opérationnel. Le backend peut appeler le webhook et recevoir les 3 documents générés par l'IA.

**URL finale** : `http://localhost:5678/webhook/matcher-offre`
