# 🤖 AI Workflow Doctor - Guide d'Installation Complet

## 📋 Vue d'Ensemble

Le système **AI Workflow Doctor** est composé de **5 workflows interconnectés** qui travaillent ensemble pour détecter, analyser et corriger automatiquement les erreurs dans vos workflows n8n avec l'aide de l'IA Claude.

### Architecture du Système

```
1️⃣ Error Detector (Déjà créé sur votre n8n)
   ↓
2️⃣ AI Analyzer (Déjà créé sur votre n8n)
   ↓
3️⃣ Test Workflow Creator (À importer)
   ↓
4️⃣ Slack Validator (À importer)
   ↓
5️⃣ Iterative Retry (À importer)
```

---

## ✅ Workflows Déjà Créés

### ✅ Workflow 1: Error Detector
- **ID**: `0hWei4DBPRQGXZy6`
- **Statut**: ✅ Créé sur votre n8n
- **Action requise**: Configuration finale (voir étape 3)

### ✅ Workflow 2: AI Analyzer
- **ID**: `9qx6wAyScMXl1God`
- **Statut**: ✅ Créé sur votre n8n
- **Action requise**: Configuration credentials (voir étape 2)

---

## 📦 Étape 1: Importer les Workflows Restants

### 1.1 Importer Workflow 3: Test Workflow Creator

1. Ouvrez n8n dans votre navigateur
2. Cliquez sur **"Workflows"** dans le menu
3. Cliquez sur **"Import from File"**
4. Sélectionnez le fichier: `workflows/03-test-workflow-creator.json`
5. Cliquez sur **"Import"**
6. **Notez l'ID du workflow** qui apparaît dans l'URL (ex: `/workflow/XXXXX`)

### 1.2 Importer Workflow 4: Slack Validator

1. Même procédure avec le fichier: `workflows/04-slack-validator.json`
2. **Notez l'ID du workflow**

### 1.3 Importer Workflow 5: Iterative Retry

1. Même procédure avec le fichier: `workflows/05-iterative-retry.json`
2. **Notez l'ID du workflow**

---

## 🔑 Étape 2: Configurer les Credentials

### 2.1 Credential: n8n API Key

Cette credential permet aux workflows de communiquer avec votre instance n8n.

**Configuration:**
1. Dans n8n, allez dans **Settings** (⚙️) → **API**
2. Créez une nouvelle API Key si vous n'en avez pas
3. Copiez la clé API
4. Allez dans **Credentials** → **New Credential**
5. Cherchez **"HTTP Header Auth"**
6. Configurez:
   - **Name**: `n8n API Key`
   - **Header Name**: `X-N8N-API-KEY`
   - **Header Value**: `[Votre clé API n8n]`
7. **Save**

**Utilisé par**: Tous les workflows (2, 3, 4, 5)

### 2.2 Credential: Anthropic API Key (Claude)

Cette credential permet d'utiliser l'IA Claude pour l'analyse.

**Configuration:**
1. Obtenez une clé API sur: https://console.anthropic.com/
2. Dans n8n, **Credentials** → **New Credential**
3. Cherchez **"HTTP Header Auth"**
4. Configurez:
   - **Name**: `Anthropic API Key`
   - **Header Name**: `x-api-key`
   - **Header Value**: `sk-ant-[Votre clé Anthropic]`
5. **Save**

**Utilisé par**: Workflow 2 (AI Analyzer)

### 2.3 Configuration: Slack Webhook URL

**Option A: Avec Slack App (Recommandé pour boutons interactifs)**

1. Allez sur https://api.slack.com/apps
2. Cliquez **"Create New App"** → **"From scratch"**
3. Nommez votre app: `AI Workflow Doctor`
4. Choisissez votre workspace
5. Dans **"Incoming Webhooks"**:
   - Activez **"Activate Incoming Webhooks"**
   - Cliquez **"Add New Webhook to Workspace"**
   - Choisissez le canal de notification
   - Copiez le **Webhook URL** (format: `https://hooks.slack.com/services/...`)
6. Dans **"Interactivity & Shortcuts"**:
   - Activez **"Interactivity"**
   - **Request URL**: Laisser vide pour l'instant (on configurera après activation du workflow 4)
7. **Save Changes**

**Option B: Sans boutons interactifs (Simple)**

1. Créez simplement un Incoming Webhook: https://api.slack.com/messaging/webhooks
2. Copiez l'URL

**⚠️ Important**: Vous devrez remplacer `PLACEHOLDER_SLACK_WEBHOOK_URL` dans le workflow 4.

---

## 🔗 Étape 3: Connecter les Workflows Entre Eux

Chaque workflow doit connaître l'ID des autres workflows qu'il appelle. Voici ce qu'il faut configurer:

### 3.1 Workflow 1: Error Detector (`0hWei4DBPRQGXZy6`)

**Node à modifier**: `Set AI Analyzer ID`

1. Ouvrez le workflow **"🚨 AI Doctor - Error Detector"**
2. Cliquez sur le node **"Set AI Analyzer ID"**
3. Remplacez `PLACEHOLDER_AI_ANALYZER_ID` par: `9qx6wAyScMXl1God`
4. **Save** le workflow

### 3.2 Workflow 2: AI Analyzer (`9qx6wAyScMXl1God`)

**Node à modifier**: `Set Test Creator ID`

1. Ouvrez le workflow **"🤖 AI Doctor - AI Analyzer"**
2. Cliquez sur le node **"Set Test Creator ID"**
3. Remplacez `PLACEHOLDER_TEST_CREATOR_ID` par l'ID du workflow 3 (noté à l'étape 1.1)
4. **Vérifiez les credentials** sur les nodes:
   - `Get Workflow from n8n API`: Credential `n8n API Key`
   - `Get Execution History`: Credential `n8n API Key`
   - `Call Claude API`: Credential `Anthropic API Key`
5. **Save** le workflow

### 3.3 Workflow 3: Test Workflow Creator

**Nodes à modifier**: `Set Slack Validator ID`

1. Ouvrez le workflow **"🧪 AI Doctor - Test Workflow Creator"**
2. Cliquez sur le node **"Set Slack Validator ID"**
3. Remplacez `PLACEHOLDER_SLACK_VALIDATOR_ID` par l'ID du workflow 4 (noté à l'étape 1.2)
4. **Vérifiez les credentials** sur les nodes:
   - `Create Workflow Clone`: Credential `n8n API Key`
   - `Update Cloned Workflow`: Credential `n8n API Key`
5. **Save** le workflow

### 3.4 Workflow 4: Slack Validator

**Nodes à modifier**:
- `Send Slack Notification`: URL du webhook
- `Set Retry Workflow ID`: ID du workflow 5

1. Ouvrez le workflow **"📨 AI Doctor - Slack Validator"**
2. Node **"Send Slack Notification"**:
   - Remplacez `PLACEHOLDER_SLACK_WEBHOOK_URL` par votre Slack Webhook URL (étape 2.3)
3. Node **"Set Retry Workflow ID"**:
   - Remplacez `PLACEHOLDER_ITERATIVE_RETRY_ID` par l'ID du workflow 5 (noté à l'étape 1.3)
4. **Vérifiez les credentials** sur tous les nodes HTTP Request vers n8n API
5. **Save** le workflow

**Configuration Slack Interactivity:**
1. **Activez** le workflow
2. Cliquez sur le node **"Webhook - Button Click"**
3. Copiez l'URL du webhook (format: `https://votre-n8n.com/webhook/ai-doctor-slack-action`)
4. Retournez sur https://api.slack.com/apps → Votre app → **Interactivity & Shortcuts**
5. Collez l'URL dans **"Request URL"**
6. **Save Changes**

### 3.5 Workflow 5: Iterative Retry

**Node à modifier**: `Set AI Analyzer ID`

1. Ouvrez le workflow **"🔄 AI Doctor - Iterative Retry"**
2. Cliquez sur le node **"Set AI Analyzer ID"**
3. Remplacez `PLACEHOLDER_AI_ANALYZER_ID` par: `9qx6wAyScMXl1God`
4. **Vérifiez les credentials** sur le node `Get Failed Execution Details`
5. **Save** le workflow

---

## 🚀 Étape 4: Activer les Workflows

### 4.1 Activer dans l'Ordre

**Important**: Activez dans cet ordre pour éviter les erreurs:

1. ✅ **Workflow 5: Iterative Retry** (pas de dépendance)
2. ✅ **Workflow 4: Slack Validator** (dépend de 5)
3. ✅ **Workflow 3: Test Workflow Creator** (dépend de 4)
4. ✅ **Workflow 2: AI Analyzer** (dépend de 3)
5. ✅ **Workflow 1: Error Detector** (dépend de 2)

### 4.2 Comment Activer

Pour chaque workflow:
1. Ouvrez le workflow
2. Cliquez sur le toggle **"Active"** en haut à droite
3. Vérifiez qu'il devient vert ✅

---

## 🧪 Étape 5: Tester le Système

### Test 1: Créer un Workflow avec Erreur Volontaire

1. Créez un nouveau workflow de test
2. Ajoutez un node **"HTTP Request"**
3. URL: `https://api.invalid-domain-test-12345.com/endpoint`
4. **Activez** le workflow
5. **Exécutez** le workflow manuellement

**Résultat attendu:**
- ❌ Le workflow échoue (URL invalide)
- 🚨 Error Detector capture l'erreur
- 🤖 AI Analyzer analyse l'erreur
- 🧪 Un workflow de test est créé: `[Nom du workflow] [AI-FIX-TEST-v1]`
- 📨 Vous recevez une notification Slack avec détails et boutons

### Test 2: Valider la Correction

1. Dans Slack, cliquez sur **"✅ Tester"**
2. Le workflow de test s'exécute automatiquement
3. **Si succès**: Vous recevez une demande de confirmation pour appliquer en production
4. **Si échec**: Iterative Retry relance automatiquement l'analyse (jusqu'à 3 tentatives)

### Test 3: Vérifier les Logs

1. Dans n8n, allez dans **"Executions"**
2. Filtrez par workflow name: `AI Doctor`
3. Vérifiez que toutes les exécutions se sont bien déroulées
4. En cas d'erreur, consultez les logs de chaque node

---

## 🔍 Résolution de Problèmes

### Problème 1: "Workflow not found"

**Cause**: ID de workflow incorrect dans un node "Set ... ID"

**Solution**:
1. Vérifiez l'ID du workflow cible dans l'URL
2. Mettez à jour le node avec le bon ID
3. Save et réactivez le workflow

### Problème 2: "Authentication failed"

**Cause**: Credential incorrecte ou mal configurée

**Solution**:
1. Allez dans **Credentials**
2. Vérifiez la credential concernée (n8n API Key ou Anthropic API Key)
3. Testez la connexion
4. Si erreur, recréez la credential

### Problème 3: "Slack notification not received"

**Cause**: Webhook URL invalide ou Slack app mal configurée

**Solution**:
1. Testez le webhook avec curl:
   ```bash
   curl -X POST -H 'Content-type: application/json' \
   --data '{"text":"Test AI Doctor"}' \
   [VOTRE_WEBHOOK_URL]
   ```
2. Si erreur, vérifiez l'URL sur api.slack.com
3. Recréez le webhook si nécessaire

### Problème 4: "Boutons Slack ne fonctionnent pas"

**Cause**: Request URL non configurée dans Slack App

**Solution**:
1. Activez le workflow 4 (Slack Validator)
2. Copiez l'URL du webhook du node "Webhook - Button Click"
3. Collez dans api.slack.com → Votre app → Interactivity → Request URL
4. Save et testez

### Problème 5: "Claude API error"

**Cause**: Clé API Anthropic invalide ou quota dépassé

**Solution**:
1. Vérifiez votre quota sur console.anthropic.com
2. Vérifiez que la clé API est correcte
3. Si besoin, régénérez une nouvelle clé

---

## 📊 Statistiques et Monitoring

### Dashboard Recommandé

Créez un workflow séparé qui collecte les stats:
- Nombre d'erreurs détectées par jour
- Taux de succès des corrections IA
- Nombre de tentatives moyennes par correction
- Workflows les plus problématiques

### Logs Importants

**À surveiller:**
- Executions du workflow **Error Detector** → Toutes les erreurs détectées
- Executions du workflow **AI Analyzer** → Analyses IA
- Executions du workflow **Slack Validator** → Actions utilisateur

---

## 🔧 Configuration Avancée

### Personnaliser le Prompt Claude

Pour améliorer les analyses IA:

1. Ouvrez **Workflow 2: AI Analyzer**
2. Node **"Build AI Prompt"**
3. Modifiez le `systemPrompt` pour:
   - Ajouter des règles spécifiques à vos workflows
   - Inclure des patterns de votre architecture
   - Documenter vos conventions de naming

### Ajouter des Skills n8n au Contexte

Pour que Claude ait accès à toute la documentation n8n:

1. Node **"Build AI Prompt"**
2. Ajoutez dans le `userPrompt`:
   ```javascript
   // Lecture des skills locaux
   const fs = require('fs');
   const skillsPath = './skills/skills/';
   const skillDocs = fs.readdirSync(skillsPath)
     .map(dir => fs.readFileSync(`${skillsPath}/${dir}/README.md`, 'utf8'))
     .join('\\n\\n---\\n\\n');

   userPrompt += `\\n\\n## Documentation n8n Disponible\\n${skillDocs}`;
   ```

### Configurer un Error Workflow Global

Pour que TOUTES les erreurs soient capturées:

1. Allez dans **Settings** → **Workflows**
2. **Error Workflow**: Sélectionnez `🚨 AI Doctor - Error Detector`
3. Save

Maintenant, toute erreur dans n'importe quel workflow déclenchera automatiquement le système.

---

## 📚 Ressources Supplémentaires

### Documentation Officielle
- [n8n Error Workflows](https://docs.n8n.io/workflows/error-handling/)
- [n8n API Documentation](https://docs.n8n.io/api/)
- [Anthropic Claude API](https://docs.anthropic.com/claude/reference/)
- [Slack API - Interactivity](https://api.slack.com/interactivity)

### Fichiers du Projet
- `workflows/03-test-workflow-creator.json` - Workflow 3
- `workflows/04-slack-validator.json` - Workflow 4
- `workflows/05-iterative-retry.json` - Workflow 5
- `INSTALLATION-GUIDE.md` - Ce guide

### Support
Si vous rencontrez des problèmes:
1. Consultez les logs d'exécution dans n8n
2. Vérifiez la configuration des credentials
3. Testez chaque workflow individuellement
4. Consultez la communauté n8n: https://community.n8n.io

---

## 🎉 Félicitations !

Votre système **AI Workflow Doctor** est maintenant opérationnel ! 🤖

Il va automatiquement:
- ✅ Détecter les erreurs dans vos workflows
- ✅ Analyser les causes avec l'IA Claude
- ✅ Proposer des corrections intelligentes
- ✅ Créer des workflows de test sécurisés
- ✅ Vous notifier sur Slack pour validation
- ✅ Réessayer automatiquement si une correction échoue
- ✅ Apprendre de ses erreurs à chaque tentative

**Prochain step**: Créer votre premier workflow qui génère une erreur pour voir le système en action ! 🚀
