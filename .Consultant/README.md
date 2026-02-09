# N8N Expert Consultant

Un consultant IA spécialisé en n8n, capable d'opérer à un niveau professionnel pour concevoir, optimiser et maintenir des workflows d'automatisation de haute qualité.

## Table des Matières

- [Vue d'ensemble](#vue-densemble)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [Skills Disponibles](#skills-disponibles)
- [Exemples](#exemples)
- [Architecture](#architecture)
- [Contribution](#contribution)

---

## Vue d'ensemble

Ce projet fournit un consultant IA expert en n8n qui peut :

- Analyser et optimiser des workflows existants
- Créer de nouveaux workflows professionnels
- Débugger et résoudre des problèmes complexes
- Configurer le monitoring et les alertes
- Effectuer des audits de sécurité
- Générer de la documentation complète
- Assister dans les déploiements

### Caractéristiques principales

- **8 skills modulaires** pour différentes tâches
- **Intégration MCP** pour accès aux APIs et bases de données
- **Best practices** intégrées
- **Templates réutilisables**
- **Documentation automatique**
- **Monitoring et alerting**

---

## Installation

### Prérequis

- Node.js 18+ et npm
- n8n installé (self-hosted ou cloud)
- Claude Code CLI
- Git (optionnel, pour version control)

### Étapes d'installation

1. **Cloner ou télécharger ce projet**
```bash
git clone <repo-url>
cd "n8n Consultant"
```

2. **Installer les dépendances MCP**
```bash
npm install -g @modelcontextprotocol/server-n8n
npm install -g @modelcontextprotocol/server-filesystem
npm install -g @modelcontextprotocol/server-postgres
npm install -g @modelcontextprotocol/server-fetch
```

3. **Créer les dossiers nécessaires**
```bash
mkdir -p workflows templates documentation logs
```

4. **Configurer les variables d'environnement**

Créer un fichier `.env` :
```bash
# n8n Configuration
N8N_API_KEY=your_n8n_api_key_here
N8N_API_URL=http://localhost:5678/api/v1

# Database (si self-hosted)
DATABASE_URL=postgresql://user:password@localhost:5432/n8n

# Monitoring (optionnel)
PROMETHEUS_URL=http://localhost:9090
MONITORING_API_KEY=your_monitoring_key

# Notifications (optionnel)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
```

---

## Configuration

### Configuration Claude Code

1. **Intégrer le fichier claude.md**

Le fichier [claude.md](claude.md) contient toute la configuration du consultant. Claude Code le chargera automatiquement.

2. **Configuration MCP**

Ajouter la configuration MCP à votre fichier `~/.claude/mcp.json` ou créer un fichier local :

```bash
cp mcp-config.json ~/.claude/mcp.json
```

Ou fusionner avec votre configuration existante.

3. **Configuration des Skills**

Les skills sont définis dans [skills.json](skills.json) et sont automatiquement chargés.

### Variables d'environnement

Assurez-vous de configurer toutes les variables nécessaires :

| Variable | Description | Obligatoire |
|----------|-------------|-------------|
| `N8N_API_KEY` | Clé API n8n | Oui |
| `N8N_API_URL` | URL de l'API n8n | Oui |
| `DATABASE_URL` | URL de la base de données | Non* |
| `PROMETHEUS_URL` | URL Prometheus | Non |
| `SLACK_WEBHOOK_URL` | Webhook Slack pour notifications | Non |

\* Obligatoire uniquement si vous utilisez les fonctionnalités d'analyse de base de données

---

## Utilisation

### Démarrer une session

```bash
cd "n8n Consultant"
claude-code
```

Le consultant est maintenant actif et prêt à vous assister !

### Commandes de base

#### Analyser un workflow
```
Peux-tu analyser le workflow ID "abc123" et me donner des recommandations ?
```

#### Créer un nouveau workflow
```
Je veux créer un workflow qui :
- Reçoit des webhooks de Stripe
- Crée un client dans mon CRM
- Envoie un email de bienvenue
- Notifie l'équipe sur Slack
```

#### Optimiser la performance
```
Mon workflow "data-sync" est lent. Peux-tu l'optimiser ?
```

#### Débugger un problème
```
J'ai une erreur sur l'exécution "xyz789" :
[collez les logs d'erreur]
```

#### Configurer le monitoring
```
Configure le monitoring pour mes workflows de production avec alertes Slack.
```

#### Générer de la documentation
```
Génère la documentation complète du workflow "customer-onboarding".
```

### Utilisation des Skills

Les skills peuvent être invoqués directement :

```
/analyze-workflow workflow_id=abc123 focus_areas=["performance","security"]
```

Ou de manière conversationnelle :
```
Analyse le workflow abc123 en te concentrant sur la performance et la sécurité.
```

---

## Skills Disponibles

### 1. analyze-workflow
Analyse approfondie d'un workflow avec recommandations.

**Paramètres:**
- `workflow_id` ou `workflow_json`
- `focus_areas` (optionnel)

**Sorties:**
- Score global
- Points forts et faibles
- Recommandations priorisées
- Impact estimé

### 2. create-workflow
Génère un workflow complet à partir de spécifications.

**Paramètres:**
- `description` (requis)
- `trigger_type`
- `integrations` (requis)
- `error_handling`
- `monitoring`

**Sorties:**
- JSON du workflow
- Documentation
- Instructions de setup
- Cas de test

### 3. optimize-workflow
Optimise un workflow pour la performance.

**Paramètres:**
- `workflow_id` ou `workflow_json`
- `optimization_goals`
- `constraints`

**Sorties:**
- Workflow optimisé
- Comparaison avant/après
- Rapport d'optimisation
- Étapes d'implémentation

### 4. debug-workflow
Diagnostique et résout les problèmes.

**Paramètres:**
- `workflow_id` (optionnel)
- `error_logs` (requis)
- `execution_id` (optionnel)
- `symptoms` (requis)

**Sorties:**
- Cause racine
- Rapport de diagnostic
- Étapes de résolution
- Mesures préventives

### 5. deploy-workflow
Assiste la migration entre environnements.

**Paramètres:**
- `workflow_json` (requis)
- `source_env` (requis)
- `target_env` (requis)
- `deployment_strategy`

**Sorties:**
- Plan de déploiement
- Script de migration
- Plan de rollback
- Checklist de validation

### 6. document-workflow
Génère une documentation complète.

**Paramètres:**
- `workflow_id` ou `workflow_json`
- `documentation_level`
- `include_diagrams`

**Sorties:**
- Documentation technique
- Guide utilisateur
- Diagramme d'architecture
- Runbook opérationnel

### 7. setup-monitoring
Configure le monitoring et l'alerting.

**Paramètres:**
- `workflow_ids` (requis)
- `notification_channels`
- `alert_thresholds`
- `monitoring_level`

**Sorties:**
- Error workflows créés
- Configuration des alertes
- URL du dashboard
- Guide de monitoring

### 8. security-audit
Audit de sécurité et conformité.

**Paramètres:**
- `workflow_ids` ou `workflow_jsons`
- `compliance_standards`
- `scan_depth`

**Sorties:**
- Score de sécurité
- Vulnérabilités détectées
- Statut de conformité
- Plan de remédiation
- Rapport d'audit

---

## Exemples

### Exemple 1 : Création d'un workflow complet

**Demande:**
```
Crée un workflow pour synchroniser les nouveaux contacts de HubSpot vers mon CRM et envoyer une notification Slack.
```

**Réponse du consultant:**
- Analyse des besoins
- Proposition d'architecture
- Génération du workflow JSON
- Configuration des credentials
- Documentation complète
- Cas de test

### Exemple 2 : Optimisation de performance

**Demande:**
```
Mon workflow fait 500 appels API séquentiels et prend 10 minutes. Comment optimiser ?
```

**Réponse du consultant:**
- Analyse du workflow actuel
- Identification du problème (pas de batching)
- Solution : implémenter le batching (50 items par appel)
- Workflow optimisé
- Réduction estimée : 90% du temps d'exécution

### Exemple 3 : Debug d'erreur

**Demande:**
```
Mon workflow échoue avec l'erreur : "Cannot read property 'email' of undefined"
```

**Réponse du consultant:**
- Analyse des logs
- Identification : données manquantes de l'API source
- Cause racine : endpoint API a changé
- Solution : mise à jour du mapping + validation
- Workflow corrigé
- Mesures préventives

---

## Architecture

### Structure du projet

```
n8n Consultant/
├── README.md                 # Ce fichier
├── claude.md                 # Configuration du consultant
├── skills.json              # Définition des skills
├── mcp-config.json          # Configuration MCP
├── .env                     # Variables d'environnement
├── workflows/               # Workflows exportés
├── templates/               # Templates réutilisables
├── documentation/           # Documentation générée
└── logs/                    # Logs MCP
```

### Diagramme d'architecture

```
┌─────────────────┐
│  Claude Code    │
│   (Interface)   │
└────────┬────────┘
         │
         ├─── claude.md (Configuration)
         ├─── skills.json (Compétences)
         │
         v
┌─────────────────┐
│   MCP Layer     │
│   (Protocol)    │
└────────┬────────┘
         │
         ├─── n8n API Server
         ├─── Filesystem Server
         ├─── Database Server
         ├─── Web Server
         ├─── Git Server
         └─── Monitoring Server
         │
         v
┌─────────────────┐
│   n8n Instance  │
│  (Workflows)    │
└─────────────────┘
```

### Flux de travail typique

1. **Utilisateur** fait une demande via Claude Code
2. **Consultant** analyse la demande et le contexte
3. **MCP** récupère les données nécessaires (workflows, exécutions, etc.)
4. **Consultant** applique son expertise et génère une solution
5. **MCP** applique les changements (si demandé)
6. **Consultant** fournit la documentation et les explications

---

## Best Practices

### Pour obtenir les meilleurs résultats

1. **Soyez spécifique** dans vos demandes
2. **Fournissez le contexte** (IDs, logs d'erreur, etc.)
3. **Indiquez vos contraintes** (budget API, SLA, etc.)
4. **Revoyez les recommandations** avant de les appliquer
5. **Testez en dev** avant la production

### Sécurité

- Ne commitez jamais le fichier `.env`
- Utilisez des API keys avec les permissions minimales
- Activez l'audit logging
- Revoyez régulièrement les accès

### Performance

- Utilisez le caching quand possible
- Implémentez le batching pour les gros volumes
- Monitore z les métriques clés
- Optimisez régulièrement

---

## Troubleshooting

### Le consultant ne répond pas correctement

1. Vérifier que [claude.md](claude.md) est dans le dossier courant
2. Vérifier les variables d'environnement
3. Relancer Claude Code

### Erreurs MCP

1. Vérifier que les serveurs MCP sont installés
2. Vérifier la configuration dans `~/.claude/mcp.json`
3. Vérifier les credentials (API keys, URLs)
4. Consulter les logs dans `./logs/`

### Connexion à n8n échoue

1. Vérifier que n8n est démarré
2. Vérifier `N8N_API_URL` et `N8N_API_KEY`
3. Tester manuellement l'API : `curl -H "X-N8N-API-KEY: $N8N_API_KEY" $N8N_API_URL/workflows`

---

## Contribution

Pour améliorer ce consultant :

1. Ajouter de nouveaux skills dans [skills.json](skills.json)
2. Enrichir la base de connaissances dans [claude.md](claude.md)
3. Créer des templates réutilisables dans `./templates/`
4. Partager vos cas d'usage dans `./documentation/`

---

## Ressources

### Documentation n8n
- [Documentation officielle](https://docs.n8n.io)
- [Community forum](https://community.n8n.io)
- [GitHub](https://github.com/n8n-io/n8n)

### MCP
- [Model Context Protocol](https://modelcontextprotocol.io)
- [MCP Servers](https://github.com/modelcontextprotocol)

### Claude Code
- [Documentation](https://docs.anthropic.com/claude-code)
- [GitHub](https://github.com/anthropics/claude-code)

---

## Licence

Ce projet est fourni tel quel pour usage personnel ou professionnel.

---

## Support

Pour toute question ou problème :
1. Consulter ce README
2. Vérifier la configuration
3. Consulter les logs
4. Demander au consultant lui-même !

---

**Version:** 1.0.0
**Dernière mise à jour:** 2026-02-02
**Auteur:** N8N Expert Consultant Team
