---
name: cashflow
description: Analyse et gestion des flux de trésorerie pour éviter les tensions financières.
---

# GUIDE COMPLET : ANALYSE ET GESTION DES FLUX DE TRÉSORERIE

## I. FONDAMENTAUX DU CASHFLOW

### 1.1 Définition et Importance

Le **cashflow** (ou flux de trésorerie) représente l'ensemble des mouvements d'entrées et de sorties de liquidités d'une entreprise sur une période donnée. Il constitue l'indicateur vital de la santé financière opérationnelle.

**Distinction fondamentale :**
- **Résultat comptable** : mesure la rentabilité (produits - charges)
- **Cashflow** : mesure la liquidité réelle (encaissements - décaissements)

> Une entreprise peut être rentable sur le papier mais en cessation de paiement par manque de trésorerie.

### 1.2 Les Trois Catégories de Flux

```
┌─────────────────────────────────────────────────────────┐
│              FLUX DE TRÉSORERIE TOTAUX                  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────┐      │
│  │  1. FLUX OPÉRATIONNELS (CFO)                 │      │
│  │  • Activité courante                          │      │
│  │  • Ventes, achats, salaires                   │      │
│  │  • Indicateur de performance du cœur métier   │      │
│  └──────────────────────────────────────────────┘      │
│                                                          │
│  ┌──────────────────────────────────────────────┐      │
│  │  2. FLUX D'INVESTISSEMENT (CFI)              │      │
│  │  • Acquisitions/cessions d'actifs             │      │
│  │  • Immobilisations, équipements               │      │
│  │  • Développement long terme                   │      │
│  └──────────────────────────────────────────────┘      │
│                                                          │
│  ┌──────────────────────────────────────────────┐      │
│  │  3. FLUX DE FINANCEMENT (CFF)                │      │
│  │  • Capitaux propres et dettes                 │      │
│  │  • Emprunts, dividendes, augmentation capital │      │
│  │  • Structure financière                       │      │
│  └──────────────────────────────────────────────┘      │
│                                                          │
│  ════════════════════════════════════════════════      │
│  VARIATION DE TRÉSORERIE = CFO + CFI + CFF            │
└─────────────────────────────────────────────────────────┘
```

---

## II. MÉTHODES D'ANALYSE DU CASHFLOW

### 2.1 Tableau des Flux de Trésorerie (TFT)

**Méthode directe** : liste explicite des encaissements et décaissements
```
ENCAISSEMENTS
+ Ventes clients encaissées
+ Produits financiers reçus
+ Autres encaissements

DÉCAISSEMENTS
- Achats fournisseurs payés
- Salaires et charges sociales
- Impôts et taxes payés
- Intérêts payés
- Autres décaissements
════════════════════════
= FLUX DE TRÉSORERIE OPÉRATIONNEL
```

**Méthode indirecte** : part du résultat net et ajuste les éléments non-cash
```
Résultat net
+ Dotations aux amortissements
+ Provisions
- Reprises sur provisions
+/- Variation du BFR
+/- Plus/moins-values de cession
════════════════════════
= FLUX DE TRÉSORERIE OPÉRATIONNEL
```

### 2.2 Indicateurs Clés de Performance (KPI)

#### A. Besoin en Fonds de Roulement (BFR)
```
BFR = (Stocks + Créances clients) - Dettes fournisseurs
```

**Interprétation :**
- BFR positif : besoin de financement du cycle d'exploitation
- BFR négatif : ressource dégagée par le cycle (rare, ex : grande distribution)
- Augmentation du BFR : consomme de la trésorerie
- Diminution du BFR : libère de la trésorerie

#### B. Délai de Rotation (en jours)

**DSO (Days Sales Outstanding)** - Délai de paiement clients
```
DSO = (Créances clients / CA TTC) × 365
```
Objectif : minimiser (accélérer les encaissements)

**DPO (Days Payable Outstanding)** - Délai de paiement fournisseurs
```
DPO = (Dettes fournisseurs / Achats TTC) × 365
```
Objectif : optimiser (négocier sans dégrader relations)

**DIO (Days Inventory Outstanding)** - Rotation des stocks
```
DIO = (Stock moyen / Coût des ventes) × 365
```
Objectif : réduire (limiter l'immobilisation)

**Cycle de conversion de trésorerie (CCC)**
```
CCC = DSO + DIO - DPO
```
Plus le CCC est court, meilleure est la gestion de trésorerie.

#### C. Ratios de Liquidité

**Ratio de liquidité générale**
```
Actif circulant / Passif circulant
```
Seuil : > 1 (capacité à honorer les dettes à court terme)

**Ratio de liquidité immédiate (Quick Ratio)**
```
(Actif circulant - Stocks) / Passif circulant
```
Seuil : > 0,8-1

**Free Cash Flow (FCF)**
```
FCF = Flux opérationnel - Investissements nécessaires (CAPEX)
```
Mesure la trésorerie disponible après maintien de l'outil de production.

---

## III. PRÉVISION ET PILOTAGE DE LA TRÉSORERIE

### 3.1 Plan de Trésorerie Prévisionnel

Structure mensuelle recommandée :

```
┌───────────────────────────────────────────────────────┐
│  PLAN DE TRÉSORERIE - MOIS M                          │
├───────────────────────────────────────────────────────┤
│  TRÉSORERIE INITIALE                    [A]           │
│                                                        │
│  ENCAISSEMENTS PRÉVISIONNELS                          │
│  + Ventes au comptant                                 │
│  + Créances échéance M                                │
│  + Créances échéance M-1                              │
│  + Autres produits encaissables                       │
│  TOTAL ENCAISSEMENTS                    [B]           │
│                                                        │
│  DÉCAISSEMENTS PRÉVISIONNELS                          │
│  - Achats au comptant                                 │
│  - Fournisseurs échéance M                            │
│  - Salaires et charges                                │
│  - Charges fixes (loyers, assurances...)              │
│  - TVA                                                 │
│  - Impôts et taxes                                     │
│  - Remboursements emprunts                            │
│  - Investissements planifiés                          │
│  TOTAL DÉCAISSEMENTS                    [C]           │
│                                                        │
│  ════════════════════════════════════════════         │
│  FLUX DE TRÉSORERIE NET (B-C)           [D]           │
│  TRÉSORERIE FINALE (A+D)                [E]           │
│                                                        │
│  Solde bancaire                                        │
│  + Disponibilités autorisées (découvert)              │
│  = TRÉSORERIE DISPONIBLE                              │
└───────────────────────────────────────────────────────┘
```

### 3.2 Horizon de Prévision

- **Court terme (0-3 mois)** : détail hebdomadaire ou quotidien
- **Moyen terme (3-12 mois)** : détail mensuel
- **Long terme (1-3 ans)** : vision trimestrielle ou annuelle

### 3.3 Scénarios de Sensibilité

Tester systématiquement :
1. **Scénario optimiste** : +10-15% sur encaissements
2. **Scénario réaliste** : hypothèses prudentes
3. **Scénario pessimiste** : -15-20% sur encaissements, +10% délais

**Analyse d'écart** : comparer réalisé vs prévisionnel chaque mois
```
Écart = Trésorerie réelle - Trésorerie prévue
```
Ajuster les prévisions futures en conséquence.

---

## IV. STRATÉGIES D'OPTIMISATION DU CASHFLOW

### 4.1 Optimisation des Encaissements

#### Actions prioritaires :
1. **Réduire le DSO**
   - Facturation immédiate post-livraison
   - Conditions de paiement claires (30 jours nets)
   - Relances systématiques : J+7, J+15, J+30
   - Pénalités de retard appliquées
   - Escompte pour paiement anticipé (ex : -2% si paiement à 10 jours)

2. **Diversifier les modes de paiement**
   - Prélèvement automatique
   - Paiement en ligne sécurisé
   - Cartes bancaires (coût vs rapidité)

3. **Affacturage (Factoring)**
   - Céder créances clients à un factor (70-90% immédiat)
   - Coût : 1-3% du CA + frais
   - Avantage : trésorerie immédiate + externalisation recouvrement

4. **Acomptes et avances**
   - 30-50% à la commande
   - Paiements échelonnés sur projets longs

### 4.2 Optimisation des Décaissements

#### Actions prioritaires :
1. **Négocier les délais fournisseurs**
   - Objectif : 45-60 jours sans détériorer relations
   - Respecter les engagements (crédibilité)

2. **Optimiser la gestion des stocks**
   - Méthode juste-à-temps (JIT) si applicable
   - Réduire stocks dormants et obsolètes
   - Négocier consignation ou drop-shipping

3. **Maîtriser les charges fixes**
   - Audit des abonnements et contrats
   - Renégociation loyers, assurances
   - Variabiliser certaines charges (externalisation)

4. **Planification des investissements**
   - Étaler dans le temps
   - Leasing vs achat (préserver trésorerie)
   - Subventions et aides publiques

### 4.3 Gestion du Besoin en Fonds de Roulement

**Formule de pilotage :**
```
ΔBFR = ΔStocks + ΔCréances - ΔDettes fournisseurs
```

**Objectif** : stabiliser ou réduire le BFR
- Croissance du CA → BFR augmente mécaniquement
- Anticiper ce besoin de financement

**Ratio BFR/CA** :
```
Taux de BFR = (BFR / CA) × 365
```
Suivre l'évolution : une hausse signale dégradation.

---

## V. SOLUTIONS DE FINANCEMENT DE LA TRÉSORERIE

### 5.1 Financement à Court Terme

| Solution | Durée | Caractéristiques | Coût |
|----------|-------|------------------|------|
| **Découvert bancaire** | < 1 an | Souplesse, renouvellement | TAEG élevé (8-15%) |
| **Facilité de caisse** | Quelques jours/mois | Décalages ponctuels | Agios |
| **Dailly (cession Dailly)** | < 90 jours | Mobilisation créances | 1-3% + frais |
| **Affacturage** | Permanent | Gestion déléguée | 1-3% CA + frais |
| **Escompte commercial** | Échéance effet | Mobilisation effets de commerce | Taux variable |

### 5.2 Financement à Moyen Terme

- **Crédit de trésorerie** : 1-2 ans, reconduction possible
- **Prêt BFR** : financer durablement le besoin structurel
- **Crédit-bail mobilier** : financer équipements
- **Obligations convertibles** : pour entreprises établies

### 5.3 Aides et Dispositifs Publics

- Prêts garantis par l'État (PGE)
- Aides de Bpifrance : prêts croissance, innovation
- Subventions régionales et européennes
- Crédit d'Impôt Recherche (CIR) : encaisser le remboursement

---

## VI. SIGNAUX D'ALERTE ET GESTION DE CRISE

### 6.1 Indicateurs de Tension de Trésorerie

**Signaux faibles (prévention) :**
- [ ] Allongement du DSO > +5 jours sur 3 mois
- [ ] Augmentation du BFR > 10% du CA
- [ ] Retards paiements fournisseurs
- [ ] Utilisation régulière du découvert > 80%
- [ ] Baisse du ratio de liquidité < 1

**Signaux critiques (urgence) :**
- [ ] Impossibilité payer salaires à échéance
- [ ] Dépassements découverts autorisés
- [ ] Rejets de prélèvements (URSSAF, impôts)
- [ ] Créances clients > 90 jours en hausse
- [ ] Trésorerie nette négative > 30 jours consécutifs

### 6.2 Plan d'Action d'Urgence

**Phase 1 : Diagnostic express (J+0 à J+7)**
1. Actualiser plan de trésorerie sur 90 jours
2. Lister encaissements et décaissements certains
3. Identifier le « trou de trésorerie » : date et montant
4. Calculer le besoin de financement minimum

**Phase 2 : Actions immédiates (J+7 à J+30)**

**Priorité 1 - Accélérer encaissements :**
- Relance agressive clients (appels directs)
- Proposer escomptes exceptionnels
- Activer affacturage en urgence
- Facturer toutes prestations en cours

**Priorité 2 - Différer décaissements :**
- Négocier délais supplémentaires fournisseurs clés
- Reporter investissements non-critiques
- Échelonner dettes fiscales/sociales (demande officielle)
- Suspendre dividendes et distributions

**Priorité 3 - Sécuriser financement :**
- Demander augmentation découvert
- Solliciter prêt de trésorerie bancaire
- Apport en compte courant d'associés
- Négocier prêt participatif (Bpifrance)

**Phase 3 : Restructuration (J+30 à J+90)**
- Audit complet des charges
- Renégociation contrats fournisseurs structurels
- Optimisation effectifs si nécessaire
- Plan de développement commercial (CA)
- Mise en place tableau de bord hebdomadaire

### 6.3 Procédures Préventives

**Mandat ad hoc** : médiation amiable pré-contentieuse
**Procédure de conciliation** : < 45 jours de cessation de paiements
**Sauvegarde** : anticiper difficultés (entreprise non en cessation)

> Principe : agir dès les premiers signaux, pas quand la trésorerie est à zéro.

---

## VII. OUTILS ET MODÈLES PRATIQUES

### 7.1 Tableau de Bord Synthétique

**Indicateurs à suivre mensuellement :**

```
┌─────────────────────────────────────────────────────┐
│  KPI TRÉSORERIE                Réalisé    Objectif  │
├─────────────────────────────────────────────────────┤
│  Trésorerie disponible         XXX k€     > 50 k€   │
│  Jours de trésorerie restants  XX jours   > 30 j    │
│  DSO (délai clients)           XX jours   < 45 j    │
│  DPO (délai fournisseurs)      XX jours   45-60 j   │
│  BFR / CA annuel               XX%        < 20%     │
│  Ratio liquidité générale      X.XX       > 1.2     │
│  Taux utilisation découvert    XX%        < 50%     │
│  Créances > 90 jours           XX%        < 5%      │
└─────────────────────────────────────────────────────┘
```

### 7.2 Formules Clés à Mémoriser

**1. Trésorerie nette**
```
TN = Trésorerie active - Dettes financières CT
```

**2. Fonds de Roulement Net Global (FRNG)**
```
FRNG = Capitaux permanents - Actifs immobilisés
```

**3. Équation fondamentale**
```
TRÉSORERIE = FRNG - BFR
```

**4. Variation de trésorerie**
```
ΔTrésorerie = CAF - ΔBFR - Investissements nets + ΔDettes financières
```

**5. Capacité d'Autofinancement (CAF)**
```
CAF = Résultat net + Dotations - Reprises + VNC actifs cédés - PVCE
```

### 7.3 Check-list Mensuelle du Trésorier

**Semaine 1 du mois :**
- [ ] Rapprochement bancaire
- [ ] Mise à jour plan de trésorerie J+90
- [ ] Analyse écarts prévisionnel/réalisé mois précédent
- [ ] Calcul DSO, DPO, DIO

**Semaine 2 :**
- [ ] Relance clients > 30 jours
- [ ] Validation paiements fournisseurs à échéance
- [ ] Point emprunts et échéances

**Semaine 3 :**
- [ ] Calcul BFR et variation
- [ ] Actualisation scénarios (optimiste/pessimiste)
- [ ] Identification besoins financement futurs

**Semaine 4 :**
- [ ] Reporting direction (dashboard)
- [ ] Comité de trésorerie si besoin
- [ ] Ajustements prévisions mois suivants

---

## VIII. CAS D'USAGE ET EXEMPLES TYPES

### Cas 1 : Entreprise en Croissance Forte

**Situation :**
- CA : +40% sur 12 mois
- Tensions de trésorerie malgré rentabilité

**Diagnostic :**
```
BFR année N-1 : 500 k€
BFR année N : 700 k€
ΔBFR = +200 k€ → consommation de trésorerie
```

**Solution :**
- Financer structurellement l'augmentation BFR (prêt CT ou augmentation capital)
- Accélérer rotation stocks
- Négocier délais fournisseurs

### Cas 2 : Saisonnalité Forte

**Situation :**
- Activité concentrée sur 4 mois
- Décalage encaissements/décaissements

**Outils :**
- Plan de trésorerie annuel avec détail mensuel
- Ligne de crédit saisonnière
- Provisions en haute saison pour basse saison
- Modulation charges (intérim, externalisations)

### Cas 3 : Projet Long Terme

**Situation :**
- Projet 18 mois, facturation à l'achèvement
- Charges mensuelles continues

**Solutions :**
- Négocier acomptes (30% commande, 40% étapes, 30% livraison)
- Financement projet spécifique bancaire
- Mobilisation créances travaux en cours (Dailly)

---

## IX. AUTOMATISATION ET DIGITALISATION

### 9.1 Outils Logiciels Recommandés

**Solutions de gestion de trésorerie :**
- **Agicap** : pilotage et prévisions automatisées
- **Pennylane** : comptabilité et trésorerie connectées
- **Fygr** : cashflow management pour TPE/PME
- **Kyriba** : trésorerie grandes entreprises
- **Excel/Google Sheets** : modèles sur-mesure

**Connexions bancaires API** :
- Agrégation multi-banques temps réel
- Catégorisation automatique transactions
- Alertes personnalisées

### 9.2 Indicateurs à Automatiser

1. **Alertes automatiques** :
   - Trésorerie < seuil critique
   - Créances > 60 jours
   - Dépassement budget mensuel

2. **Rapports automatiques** :
   - Dashboard hebdomadaire
   - Prévisions glissantes 90 jours
   - Analyse aging créances/dettes

---

## X. SYNTHÈSE ET BONNES PRATIQUES

### Règles d'Or de la Gestion de Trésorerie

1. **Anticiper plutôt que subir** : prévisions glissantes systématiques
2. **Cash is King** : rentabilité ≠ trésorerie
3. **Piloter le BFR** : chaque jour de réduction = trésorerie libérée
4. **Diversifier financements** : ne pas dépendre d'une seule source
5. **Monitorer quotidiennement** : 15 min/jour > crise de 6 mois
6. **Communiquer** : transparence avec banques et partenaires en amont
7. **Sécuriser** : maintenir matelas de trésorerie (30-90 jours charges)
8. **Former** : sensibiliser équipes commerciales/achats à impact trésorerie

### Erreurs Fréquentes à Éviter

❌ Confondre résultat et trésorerie
❌ Négliger le plan de trésorerie prévisionnel
❌ Ne relancer clients qu'en situation critique
❌ Investir massivement sans anticiper impact trésorerie
❌ Accepter systématiquement délais paiements longs
❌ Ignorer les signaux faibles d'alerte
❌ Ne pas provisionner charges fiscales/sociales
❌ Financer investissements LT par découvert CT

---

## ANNEXES

### Glossaire Finance de Trésorerie

- **Actif circulant** : actifs < 1 an (stocks, créances, disponibilités)
- **Agios** : intérêts et frais sur découvert bancaire
- **CAF** : Capacité d'Autofinancement, génération interne de ressources
- **CAPEX** : Capital Expenditures, investissements en immobilisations
- **Cessation de paiements** : impossibilité faire face au passif exigible
- **Covenant** : clause contractuelle bancaire (ratios à respecter)
- **Escompte** : réduction prix pour paiement anticipé
- **Passif circulant** : dettes < 1 an
- **Trésorerie zéro** : principe d'optimisation (ni excès ni déficit)
- **VNC** : Valeur Nette Comptable d'un actif

### Références Réglementaires

- Code de commerce : articles L. 123-12 et suivants (comptabilité)
- LME (Loi de Modernisation de l'Économie) : délais de paiement
- Directive UE 2011/7/UE : lutte contre retards de paiement
- Plan Comptable Général : tableau des flux de trésorerie

---

**Document établi comme référence complète pour l'analyse et la gestion des flux de trésorerie. Utilisable pour formation, audit, diagnostic et pilotage opérationnel.**