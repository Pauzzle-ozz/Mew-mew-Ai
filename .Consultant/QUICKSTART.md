# Guide de Démarrage Rapide - N8N Expert Consultant

**Ce guide vous permet de démarrer avec le consultant n8n expert en moins de 10 minutes.**

Ce consultant utilise :
- **Serveur n8n-mcp officiel** (1,084 nodes, 2,709 templates, 20 outils MCP)
- **7 skills n8n officiels** (Expression Syntax, MCP Tools, Workflow Patterns, etc.)
- Développés par Romuald Członkowski

## Prérequis

Avant de commencer, assurez-vous d'avoir :
- [ ] **n8n installé et fonctionnel** (Cloud ou self-hosted)
- [ ] **Node.js 18+** installé
- [ ] **Claude Code** installé
- [ ] Une **clé API n8n**

## Étape 1 : Obtenir votre clé API n8n

### n8n Cloud
1. Connectez-vous à votre instance n8n Cloud
2. Allez dans **Settings** > **API** (ou `/settings/api`)
3. Cliquez sur **Create API Key**
4. Copiez la clé générée (format JWT : `eyJhbGci...`)

### n8n Self-hosted
1. Ouvrez n8n dans votre navigateur (ex: `http://localhost:5678`)
2. Allez dans **Settings** > **API**
3. Générez une nouvelle **API key**
4. Notez l'URL de votre instance avec `/api/v1` (ex: `http://localhost:5678/api/v1`)

## Étape 2 : Configuration MCP

### 2.1 Éditer le fichier .mcp.json

Le fichier [.mcp.json](.mcp.json) configure le serveur n8n-mcp officiel. Éditez-le :

```json
{
  "mcpServers": {
    "n8n-mcp": {
      "command": "npx",
      "args": ["n8n-mcp"],
      "env": {
        "MCP_MODE": "stdio",
        "N8N_API_URL": "http://localhost:5678/api/v1",
        "N8N_API_KEY": "VOTRE_CLE_API_ICI",
        "LOG_LEVEL": "error",
        "DISABLE_CONSOLE_OUTPUT": "true"
      }
    }
  }
}
```

**Pour n8n Cloud**, changez l'URL :
```json
"N8N_API_URL": "https://votre-instance.app.n8n.cloud/api/v1"
```

**Pour Docker local**, utilisez :
```json
"N8N_API_URL": "http://host.docker.internal:5678/api/v1"
```

### 2.2 (Optionnel) Configuration .env

Pour des options avancées (monitoring, notifications, etc.), créez un fichier [.env](.env) :

```bash
cp .env.example .env
```

Puis éditez les variables optionnelles (Slack, PagerDuty, SMTP, etc.)

## Étape 3 : Installation des Dépendances

### Option A : Installation Rapide (Recommandée)

```bash
npm run setup
```

Cette commande installe automatiquement :
- Le serveur n8n-mcp (v2.33.5+)
- Les dépendances Node.js
- Crée les dossiers nécessaires (`workflows/`, `templates/`, `documentation/`, `logs/`)

### Option B : Installation Manuelle

```bash
npm install
npm run create-dirs
```

## Étape 4 : Vérification de la Configuration MCP

Testez que le serveur n8n-mcp fonctionne :

```bash
npm run mcp:test
```

Si vous voyez l'aide du serveur n8n-mcp, la configuration est correcte.

## Étape 5 : Lancer le Consultant

Ouvrez Claude Code dans le dossier du projet :

```bash
cd "c:\Users\pauzzle\OneDrive\Bureau\n8n Consultant"
claude-code
```

Le consultant expert n8n est maintenant actif !

**Note :** Le fichier [CLAUDE.md](CLAUDE.md) configure automatiquement le consultant avec :
- Expertise n8n niveau Senior/Expert
- Accès aux 1,084 nodes via n8n-mcp
- 7 skills n8n activés contextuellement
- Méthodologie de travail professionnelle

## Étape 6 : Premier Test

### Test de Connexion

Essayez cette commande pour vérifier la connexion à n8n :

```
Peux-tu lister mes workflows n8n ?
```

Si le consultant liste vos workflows, tout est correctement configuré !

### Test de Présentation

```
Présente-toi et explique-moi ce que tu peux faire pour moi.
```

Le consultant devrait se présenter en tant qu'expert n8n et lister ses capacités principales.

## Cas d'Usage Rapides

### 1. Analyser un workflow existant

```
Récupère et analyse le workflow avec l'ID "abc123".
Donne-moi des recommandations sur :
- La performance
- La gestion d'erreurs
- Les best practices
```

Le consultant utilisera le **n8n-mcp** pour récupérer le workflow et l'**n8n-validation-expert** skill pour l'analyser.

### 2. Créer un nouveau workflow webhook vers Slack

```
Crée-moi un workflow qui :
1. Reçoit un webhook avec des données JSON (email, name, message)
2. Valide que tous les champs sont présents
3. Formate un message pour Slack
4. Envoie le message à #notifications
5. En cas d'erreur, log dans un fichier et envoie une alerte
```

Le consultant utilisera les **workflow-patterns** et **node-configuration** skills.

### 3. Débugger une erreur d'expression

```
Mon workflow échoue avec cette erreur :
"ERROR: Cannot read property 'body' of undefined"

Dans mon webhook node, j'essaie d'accéder à {{ $json.data.body }}
```

Le consultant activera l'**expression-syntax** skill pour corriger l'expression.

### 4. Optimiser un workflow lent

```
Mon workflow "data-sync" met 5 minutes à traiter 100 items.
Peux-tu l'analyser et proposer des optimisations ?

ID du workflow : xyz789
```

Le consultant analysera le workflow et utilisera les **workflow-patterns** pour suggérer du batching ou de la parallélisation.

### 5. Configurer un node Code JavaScript

```
J'ai besoin d'un node Code qui :
- Récupère tous les items d'entrée
- Filtre ceux avec status = "active"
- Transforme chaque item pour extraire id, name, email
- Retourne un tableau JSON
```

Le consultant utilisera le **code-javascript** skill avec les patterns corrects.

### 6. Rechercher des nodes pour une tâche

```
Quels nodes dois-je utiliser pour :
- Lire un fichier Excel
- Transformer les données
- Envoyer vers une API REST avec authentification OAuth2
```

Le consultant utilisera le **mcp-tools-expert** skill pour rechercher parmi les 1,084 nodes.

## Options d'Installation Avancées

### Option 1 : Hosted Service (Recommandée pour démarrer)

Utilisez le service managé sans installation locale :

1. Créez un compte sur [dashboard.n8n-mcp.com](https://dashboard.n8n-mcp.com)
2. Tier gratuit : **100 appels/jour**
3. Configurez [.mcp.json](.mcp.json) avec l'URL du service

**Avantages :**
- Aucune installation requise
- Toujours à jour
- Idéal pour tester

### Option 2 : NPX (Configuration actuelle)

**C'est la méthode utilisée par défaut dans ce projet.**

Le fichier [.mcp.json](.mcp.json) configure déjà :
```json
{
  "mcpServers": {
    "n8n-mcp": {
      "command": "npx",
      "args": ["n8n-mcp"],
      "env": {
        "MCP_MODE": "stdio",
        ...
      }
    }
  }
}
```

**Important :** `MCP_MODE: "stdio"` est obligatoire pour éviter les erreurs de parsing JSON.

### Option 3 : Docker

Pour isoler le serveur dans un container :

```bash
docker pull ghcr.io/czlonkowski/n8n-mcp:latest
docker run -d \
  -e N8N_API_URL=http://host.docker.internal:5678/api/v1 \
  -e N8N_API_KEY=your_key \
  -e MCP_MODE=stdio \
  --name n8n-mcp \
  ghcr.io/czlonkowski/n8n-mcp:latest
```

Image compacte (~280MB) sans dépendances n8n complètes.

### Option 4 : Configuration Globale Claude Desktop

Pour utiliser n8n-mcp dans **toutes** vos sessions Claude :

**macOS** : `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows** : `%APPDATA%\Claude\claude_desktop_config.json`
**Linux** : `~/.config/Claude/claude_desktop_config.json`

Ajoutez :
```json
{
  "mcpServers": {
    "n8n-mcp": {
      "command": "npx",
      "args": ["n8n-mcp"],
      "env": {
        "MCP_MODE": "stdio",
        "N8N_API_URL": "http://localhost:5678/api/v1",
        "N8N_API_KEY": "YOUR_KEY",
        "LOG_LEVEL": "error",
        "DISABLE_CONSOLE_OUTPUT": "true"
      }
    }
  }
}
```

⚠️ **Redémarrez Claude Desktop** après modification.

## Vérification de l'Installation Complète

### Test 1 : Connexion n8n-mcp

```
Utilise n8n_health_check en mode diagnostic pour vérifier la connexion.
```

Le consultant devrait confirmer que le serveur n8n-mcp est connecté et fonctionnel.

### Test 2 : Récupération de workflows

```
Liste tous mes workflows n8n avec leurs statuts (actif/inactif).
```

Si la liste s'affiche, tout est correctement configuré !

### Test 3 : Recherche de nodes

```
Recherche les nodes disponibles pour envoyer des emails.
```

Le consultant utilisera `search_nodes` et devrait trouver plusieurs options (Send Email, Gmail, Outlook, etc.)

### Test 4 : Activation des skills

```
Explique-moi la syntaxe correcte pour accéder aux données
d'un webhook dans une expression n8n.
```

Le skill **n8n-expression-syntax** devrait s'activer automatiquement et expliquer `{{ $json.body }}`.

## Les 7 Skills n8n Officiels

Ce projet inclut les **7 skills n8n officiels** qui s'activent **automatiquement selon le contexte** :

| Skill | Activation | Description |
|-------|------------|-------------|
| **Expression Syntax** | Questions sur `{{ }}`, variables, expressions | Maîtrise de la syntaxe n8n (`$json`, `$node`, `$now`, etc.) |
| **MCP Tools Expert** | Recherche de nodes, questions techniques | Utilisation correcte des 20 outils MCP, formats de paramètres |
| **Workflow Patterns** | Création/conception de workflows | 5 patterns basés sur 2,653+ templates (Webhook, API, Database, AI, Scheduled) |
| **Validation Expert** | Erreurs de validation, problèmes de config | Interprétation d'erreurs, solutions, troubleshooting |
| **Node Configuration** | Configuration de nodes spécifiques | Guide pour configurer les 525+ nodes avec dépendances et règles |
| **Code JavaScript** | Nodes Code JavaScript | Patterns d'accès aux données, Top 5 erreurs (62%+ couverture) |
| **Code Python** | Nodes Code Python | Patterns Python avec limitations (pas de `requests`, `pandas`, `numpy`) |

**Exemple d'activation contextuelle :**

- Question sur une expression → **Expression Syntax**
- "Crée un workflow webhook" → **Workflow Patterns** + **Node Configuration**
- Erreur de validation → **Validation Expert**
- "Comment utiliser Code node" → **Code JavaScript** ou **Code Python**

## Capacités du Serveur n8n-mcp

Le serveur n8n-mcp donne accès à :

### 7 Outils Core (Documentation)
- `tools_documentation` - Documentation des outils MCP
- `search_nodes` - Recherche parmi 1,084 nodes (core + community)
- `get_node` - Détails complets d'un node (propriétés, opérations, exemples)
- `validate_node` - Validation de configuration de node
- `get_template` - Récupération de template par ID
- `search_templates` - Recherche parmi 2,709 templates
- `validate_workflow` - Validation complète de workflow

### 13 Outils de Gestion (Avec N8N_API_KEY)

**Gestion de Workflows**
- `n8n_create_workflow` - Créer un workflow
- `n8n_get_workflow` - Récupérer un workflow (4 modes de détail)
- `n8n_update_full_workflow` - Mise à jour complète
- `n8n_update_partial_workflow` - Mise à jour incrémentale (diff operations)
- `n8n_delete_workflow` - Suppression de workflow
- `n8n_list_workflows` - Liste tous les workflows
- `n8n_validate_workflow` - Valider un workflow par ID
- `n8n_autofix_workflow` - Correction automatique d'erreurs
- `n8n_test_workflow` - Exécuter/tester un workflow

**Gestion des Exécutions**
- `n8n_executions` - Lister/récupérer/supprimer des exécutions

**Gestion Avancée**
- `n8n_workflow_versions` - Versioning et rollback
- `n8n_deploy_template` - Déployer un template directement

**Système**
- `n8n_health_check` - Vérification santé de l'instance

### Couverture des Données

- **1,084 nodes** (537 core + 547 community)
- **99% de couverture** des propriétés de nodes
- **63.6% de couverture** des opérations
- **87% de couverture** de la documentation officielle
- **265 variantes d'outils AI** documentés
- **2,646 configurations réelles** extraites de templates
- **2,709 templates** de workflows disponibles

## Problèmes Courants

### 1. Le consultant ne trouve pas n8n

**Symptôme :** "Cannot connect to n8n API" ou "Error fetching workflows"

**Solutions :**

1. **Vérifier que n8n est démarré**
   ```bash
   # Pour n8n local
   curl http://localhost:5678
   ```

2. **Tester l'API manuellement**
   ```bash
   curl -H "X-N8N-API-KEY: YOUR_KEY" http://localhost:5678/api/v1/workflows
   ```
   Devrait retourner un JSON avec la liste des workflows.

3. **Vérifier la configuration dans [.mcp.json](.mcp.json)**
   - L'URL doit inclure `/api/v1` : `http://localhost:5678/api/v1`
   - La clé API doit être complète (JWT commençant par `eyJ...`)
   - Pour Docker local, utilisez `http://host.docker.internal:5678/api/v1`

4. **Vérifier les permissions de la clé API**
   Dans n8n : Settings > API > vérifier que la clé a les permissions nécessaires

### 2. Erreur MCP "JSON parsing error"

**Symptôme :** Erreurs de parsing JSON lors de l'utilisation du serveur MCP

**Solution :**

⚠️ **CRITIQUE** : Vérifiez que `MCP_MODE: "stdio"` est défini dans [.mcp.json](.mcp.json) :

```json
{
  "mcpServers": {
    "n8n-mcp": {
      "env": {
        "MCP_MODE": "stdio",  // ← OBLIGATOIRE
        ...
      }
    }
  }
}
```

Sans ce paramètre, le serveur ne peut pas communiquer correctement avec Claude Code.

### 3. Serveur n8n-mcp introuvable

**Symptôme :** "Command not found: n8n-mcp" ou "MCP server not responding"

**Solutions :**

1. **Vérifier l'installation**
   ```bash
   npm list n8n-mcp
   ```
   Devrait afficher `n8n-mcp@2.33.5` ou supérieur.

2. **Réinstaller les dépendances**
   ```bash
   npm install
   ```

3. **Tester le serveur directement**
   ```bash
   npm run mcp:test
   ```

4. **Option alternative : Installation globale**
   ```bash
   npm install -g n8n-mcp
   ```
   Puis modifier [.mcp.json](.mcp.json) pour utiliser `n8n-mcp` directement au lieu de `npx n8n-mcp`.

### 4. Skills n8n non activés

**Symptôme :** Le consultant ne semble pas utiliser les skills spécialisés

**Solutions :**

1. **Vérifier l'installation des skills**
   ```bash
   npm run skills:list
   ```
   Devrait afficher les 7 skills dans `skills/skills/`.

2. **Les skills s'activent automatiquement selon le contexte.** Utilisez des questions spécifiques :
   - "Comment accéder à $json dans une expression n8n ?" → Active **Expression Syntax**
   - "Recherche les nodes Slack" → Active **MCP Tools Expert**
   - "Crée un workflow webhook" → Active **Workflow Patterns**

3. **Vérifier le fichier [CLAUDE.md](CLAUDE.md)**
   Ce fichier doit exister et contenir la configuration du consultant.

### 5. Le consultant ne répond pas comme attendu

**Solutions :**

1. **Vérifier le dossier de travail**
   ```bash
   pwd
   ```
   Devrait afficher : `c:\Users\pauzzle\OneDrive\Bureau\n8n Consultant`

2. **Vérifier la présence de [CLAUDE.md](CLAUDE.md)**
   ```bash
   ls -l CLAUDE.md
   ```
   Ce fichier configure toute l'expertise du consultant.

3. **Redémarrer Claude Code**
   ```bash
   # Quitter Claude Code (Ctrl+C)
   claude-code
   ```

4. **Vérifier la version de Claude Code**
   Assurez-vous d'utiliser une version récente qui supporte MCP.

### 6. Télémétrie du serveur n8n-mcp

**Pour désactiver la télémétrie** (collecte anonyme de statistiques) :

```bash
npm run mcp:telemetry-disable
```

Ou via variable d'environnement dans [.mcp.json](.mcp.json) :
```json
{
  "env": {
    "N8N_MCP_TELEMETRY_DISABLED": "true"
  }
}
```

### 7. Erreur "Rate limit exceeded"

**Symptôme :** Trop de requêtes à l'API n8n

**Solutions :**

1. **Attendre quelques minutes** (rate limiting temporaire)
2. **Vérifier la configuration n8n** pour augmenter les limites
3. **Pour le hosted service** : Passer au tier payant pour plus d'appels/jour

## Prochaines Étapes

Maintenant que tout fonctionne, explorez les capacités du consultant :

### 1. Explorez les Templates n8n (2,709 disponibles)

```
Recherche les templates les plus populaires pour automatiser
l'onboarding de clients.
```

Le consultant utilisera `search_templates` avec différents modes (keyword, by_nodes, by_task).

### 2. Testez les Workflow Patterns

```
Montre-moi les 5 patterns de workflows principaux et
donne un exemple concret pour chacun.
```

Le skill **workflow-patterns** s'activera et expliquera :
- Webhook Processing
- HTTP API Integration
- Database Operations
- AI Integration
- Scheduled Tasks

### 3. Créez votre Premier Workflow Complet

```
Crée un workflow de A à Z qui :
1. Écoute un webhook sur /onboard-customer
2. Valide les données (email, name, company)
3. Crée un contact dans HubSpot
4. Envoie un email de bienvenue
5. Poste une notification sur Slack #sales
6. Gère les erreurs avec retry et alerting
```

### 4. Analysez vos Workflows Existants

Si vous avez déjà des workflows :

```
Liste tous mes workflows et identifie ceux qui pourraient
avoir des problèmes de performance ou de fiabilité.
```

### 5. Apprenez les Best Practices

```
Quelles sont les 10 best practices essentielles pour
créer des workflows n8n production-ready ?
```

## Ressources Officielles

### Serveur n8n-mcp
- **Repository** : [github.com/czlonkowski/n8n-mcp](https://github.com/czlonkowski/n8n-mcp)
- **Documentation** : README complet avec toutes les options
- **Hosted Service** : [dashboard.n8n-mcp.com](https://dashboard.n8n-mcp.com)
- **Issues** : [github.com/czlonkowski/n8n-mcp/issues](https://github.com/czlonkowski/n8n-mcp/issues)

### Skills n8n
- **Repository** : [github.com/czlonkowski/n8n-skills](https://github.com/czlonkowski/n8n-skills)
- **Documentation** : Guides d'installation et utilisation
- **Marketplace** : Disponible dans Claude Code Marketplace

### n8n Officiel
- **Documentation** : [docs.n8n.io](https://docs.n8n.io)
- **Community** : [community.n8n.io](https://community.n8n.io)
- **Templates** : [n8n.io/workflows](https://n8n.io/workflows)
- **API** : [docs.n8n.io/api](https://docs.n8n.io/api/)

### Documentation Locale
- **README Principal** : [README.md](README.md) - Vue d'ensemble du projet
- **Configuration Expert** : [CLAUDE.md](CLAUDE.md) - Configuration complète du consultant
- **Skills Installés** : [skills.json](skills.json) - Liste des 7 skills
- **Templates Locaux** : [templates/](templates/) - Templates de workflows
- **Documentation** : [documentation/](documentation/) - Guides et références

## Support et Aide

### Option 1 : Demander au Consultant

Le consultant peut vous aider avec ses propres problèmes :

```
J'ai une erreur "MCP server not found". Comment puis-je débugger ça ?
```

### Option 2 : Consulter les Logs

```bash
# Logs du serveur MCP (si configuré)
cat ./logs/mcp-server.log

# Logs Claude Code
# Emplacement selon OS
```

### Option 3 : Health Check Diagnostic

```
Lance un health check en mode diagnostic et montre-moi
tous les détails de configuration.
```

### Option 4 : Community et Issues

- **n8n-mcp Issues** : [github.com/czlonkowski/n8n-mcp/issues](https://github.com/czlonkowski/n8n-mcp/issues)
- **n8n Community** : [community.n8n.io](https://community.n8n.io)
- **Claude Community** : Forums Claude AI

### Scripts NPM Disponibles

```bash
npm run setup                  # Installation complète
npm run mcp:start              # Démarrer le serveur MCP
npm run mcp:test               # Tester le serveur MCP
npm run mcp:telemetry-disable  # Désactiver la télémétrie
npm run skills:list            # Lister les skills installés
npm run skills:update          # Mettre à jour les skills
```

## Exemple de Session Complète

Voici un exemple de session typique montrant l'activation contextuelle des skills :

```
Utilisateur: Bonjour ! Je voudrais créer un workflow pour automatiser
l'onboarding de nouveaux clients.

Consultant: Bonjour ! Je suis le consultant expert n8n. Je vais vous aider
à créer un workflow d'onboarding professionnel.

Avant de commencer, j'ai besoin de quelques précisions :
1. Comment les nouveaux clients arrivent ? (webhook, formulaire, API ?)
2. Quels systèmes souhaitez-vous intégrer ? (CRM, email, chat, etc.)
3. Quelles données recevez-vous du client ?
4. Avez-vous des contraintes de délai ou de volume ?

[Le consultant pose des questions méthodiques pour comprendre le besoin]

Utilisateur: Les clients s'inscrivent via notre formulaire web qui envoie
un webhook. Je veux :
1. Créer un contact dans HubSpot
2. Envoyer un email de bienvenue personnalisé
3. Créer un ticket dans Zendesk
4. Notifier l'équipe commerciale sur Slack

Les données : email, name, company, phone, plan (free/pro/enterprise)

Consultant: Parfait ! Je vais créer un workflow basé sur le pattern
"Webhook Processing" avec intégrations multiples.

[Le skill "workflow-patterns" s'active automatiquement]

Voici l'architecture que je propose :

**Workflow : Customer Onboarding Automation**

1. **Webhook Trigger** (POST /onboard-customer)
   - Authentification via API key
   - Réception des données JSON

2. **Validation Node** (Code JavaScript)
   - Validation email, phone, required fields
   - Sanitization des inputs

   [Le skill "code-javascript" s'active pour générer le code]

3. **HubSpot - Create Contact**
   - Node: HubSpot
   - Operation: Create Contact
   - Mapping des propriétés

   [Le skill "node-configuration" s'active pour la config]

4. **Send Email - Welcome**
   - Node: Send Email (SMTP)
   - Template personnalisé selon le plan
   - Variables : {{ $json.name }}, {{ $json.company }}

   [Le skill "expression-syntax" s'active pour les expressions]

5. **Zendesk - Create Ticket**
   - Node: Zendesk
   - Operation: Create Ticket
   - Priority basée sur le plan

6. **Slack Notification**
   - Node: Slack
   - Channel: #sales
   - Message formaté avec détails client

7. **Error Workflow**
   - Capture toutes les erreurs
   - Retry 3x avec backoff exponentiel
   - Notification d'échec sur Slack #tech
   - Logging dans PostgreSQL

Voulez-vous que je crée le JSON de ce workflow ?

Utilisateur: Oui, génère le workflow complet.

Consultant: [Génère le JSON complet avec tous les nodes configurés]

Maintenant testons que le workflow est valide :

[Utilise "validate_workflow" pour vérifier la configuration]

✅ Workflow validé avec succès !

Voulez-vous que je le déploie sur votre instance n8n ?

Utilisateur: Oui, déploie-le.

Consultant: [Utilise "n8n_create_workflow" pour créer le workflow]

✅ Workflow créé avec succès !
- ID: abc123xyz
- Statut: Inactive (activez-le après configuration des credentials)
- URL webhook: https://your-instance.app.n8n.cloud/webhook/onboard-customer

Prochaines étapes :
1. Configurez les credentials (HubSpot, Zendesk, Slack, SMTP)
2. Activez le workflow
3. Testez avec un webhook de test

Voulez-vous que je génère un script de test curl ?
```

## Conseils pour Bien Démarrer

### 1. Soyez Spécifique et Détaillé
❌ **Mauvais** : "Crée-moi un workflow"
✅ **Bon** : "Crée un workflow qui reçoit un webhook avec des données client (email, name, company), les valide, puis les envoie à HubSpot et envoie une notification Slack"

### 2. Utilisez les IDs de Workflows
❌ **Mauvais** : "Analyse mon workflow de sync"
✅ **Bon** : "Analyse le workflow avec l'ID 'abc123' et donne-moi des recommandations de performance"

### 3. Fournissez le Contexte des Erreurs
❌ **Mauvais** : "Mon workflow ne marche pas"
✅ **Bon** : "Mon workflow échoue au node 'Transform Data' avec l'erreur 'Cannot read property body of undefined'. Voici les données d'entrée : {...}"

### 4. Explorez les Patterns Avant de Créer
✅ **Bon** : "Quels sont les patterns recommandés pour synchroniser des données entre deux APIs en temps réel ?"

### 5. Demandez des Validations
✅ **Bon** : "Valide ce workflow et dis-moi s'il y a des problèmes de configuration ou de performance"

### 6. Utilisez les Skills Contextuellement
- **Expressions** : "Comment accéder au 3ème élément d'un tableau dans une expression n8n ?"
- **Patterns** : "Montre-moi comment implémenter un circuit breaker dans n8n"
- **Code** : "Écris un code JavaScript pour filtrer les items avec status=active"

### 7. Itérez et Affinez
Le consultant est conçu pour le dialogue. N'hésitez pas à :
- Demander des clarifications
- Proposer des modifications
- Tester et revenir avec des questions

### 8. Profitez des Templates
✅ **Bon** : "Recherche les templates pour intégrer ChatGPT avec Slack et montre-moi le plus populaire"

## Niveaux de Configuration

### ⚡ Configuration Express (2 minutes)

**Ce dont vous avez besoin :**
- Clé API n8n
- Éditer [.mcp.json](.mcp.json) avec votre clé

**Commandes :**
```bash
# Éditer .mcp.json avec votre N8N_API_KEY
claude-code
```

**Capacités :**
- ✅ Accès complet aux 1,084 nodes via documentation
- ✅ 7 skills n8n activés
- ✅ Recherche de templates
- ✅ Création de workflows (JSON)
- ✅ Validation de configurations
- ❌ Pas d'accès direct à votre instance n8n

**Idéal pour :** Apprendre n8n, créer des workflows, consulter la documentation

### 🚀 Configuration Complète (10 minutes)

**Ce dont vous avez besoin :**
- Configuration Express +
- n8n instance accessible via API

**Commandes :**
```bash
# 1. Installer les dépendances
npm run setup

# 2. Configurer .mcp.json avec votre clé API n8n

# 3. Tester la connexion
npm run mcp:test

# 4. Lancer Claude Code
claude-code
```

**Capacités :**
- ✅ Toutes les capacités Express
- ✅ Accès direct à vos workflows n8n
- ✅ Création/modification/suppression de workflows
- ✅ Exécution et test de workflows
- ✅ Analyse des exécutions passées
- ✅ Versioning et rollback
- ✅ Déploiement de templates
- ✅ Health checks et diagnostics

**Idéal pour :** Production, développement actif, maintenance de workflows

### 🏢 Configuration Entreprise (20 minutes)

**Ce dont vous avez besoin :**
- Configuration Complète +
- Monitoring, notifications, CI/CD

**Commandes :**
```bash
# 1. Configuration complète (ci-dessus)

# 2. Configurer .env pour monitoring
cp .env.example .env
# Éditer : SLACK_WEBHOOK_URL, PAGERDUTY_API_KEY, etc.

# 3. Setup Git pour version control
git init
git add .
git commit -m "Initial n8n consultant setup"

# 4. (Optionnel) Docker pour isolation
docker-compose up -d
```

**Capacités :**
- ✅ Toutes les capacités Complète
- ✅ Notifications Slack/PagerDuty
- ✅ Logging avancé
- ✅ Version control automatique
- ✅ Backup et disaster recovery
- ✅ Monitoring multi-instance
- ✅ Rate limiting et caching

**Idéal pour :** Équipes, production critique, conformité

---

## 🎉 Vous êtes Prêt !

Vous avez maintenant un **consultant n8n expert de niveau Senior** à votre disposition avec :

- ✅ **1,084 nodes** documentés
- ✅ **2,709 templates** disponibles
- ✅ **7 skills spécialisés** activés contextuellement
- ✅ **20 outils MCP** (documentation + gestion)
- ✅ **Méthodologie professionnelle** intégrée
- ✅ **Best practices** et patterns éprouvés

**Première commande à essayer :**

```
Présente-toi et liste tes 10 capacités principales avec des exemples concrets.
```

Pour toute question, n'hésitez pas à demander directement au consultant ! 🚀
