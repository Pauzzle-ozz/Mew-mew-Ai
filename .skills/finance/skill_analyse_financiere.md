---
name: Analyse financiere
description: Analyse des données financières (bilan, compte de résultat, ratios) pour comprendre la santé d’un projet ou d’une entreprise.
---

## Objectif du Skill

Ce skill te permet de réaliser une analyse financière complète et rigoureuse d'une entreprise ou d'un projet. Tu dois être capable d'interpréter les documents comptables, calculer et analyser les ratios pertinents, et formuler un diagnostic financier clair et actionnable.

---

## 1. Les Documents Financiers Fondamentaux

### 1.1 Le Bilan

Le bilan est une photographie du patrimoine de l'entreprise à un instant T.

```
┌─────────────────────────────────────────────────────────────────┐
│                           BILAN                                  │
├─────────────────────────────┬───────────────────────────────────┤
│         ACTIF               │           PASSIF                  │
│    (Emplois des fonds)      │    (Origines des fonds)           │
├─────────────────────────────┼───────────────────────────────────┤
│                             │                                   │
│  ACTIF IMMOBILISÉ           │  CAPITAUX PROPRES                 │
│  ├─ Immobilisations         │  ├─ Capital social                │
│  │  incorporelles           │  ├─ Réserves                      │
│  ├─ Immobilisations         │  ├─ Résultat de l'exercice        │
│  │  corporelles             │  └─ Report à nouveau              │
│  └─ Immobilisations         │                                   │
│     financières             │  PROVISIONS                       │
│                             │                                   │
├─────────────────────────────┤  DETTES                           │
│                             │  ├─ Dettes financières            │
│  ACTIF CIRCULANT            │  │  (emprunts LT/MT)              │
│  ├─ Stocks                  │  ├─ Dettes d'exploitation         │
│  ├─ Créances clients        │  │  (fournisseurs, fiscales,      │
│  ├─ Autres créances         │  │   sociales)                    │
│  └─ Disponibilités          │  └─ Dettes diverses               │
│     (trésorerie)            │                                   │
│                             │                                   │
├─────────────────────────────┼───────────────────────────────────┤
│  TOTAL ACTIF = TOTAL PASSIF │  (Équilibre obligatoire)          │
└─────────────────────────────┴───────────────────────────────────┘
```

**Points clés à analyser :**
- Structure de l'actif : poids relatif des immobilisations vs actif circulant
- Structure du passif : autonomie financière (capitaux propres vs dettes)
- Qualité des actifs : vétusté des immobilisations, rotation des stocks
- Nature des dettes : court terme vs long terme

### 1.2 Le Compte de Résultat

Le compte de résultat mesure la performance de l'entreprise sur une période (généralement 1 an).

```
┌────────────────────────────────────────────────────────────────┐
│                    COMPTE DE RÉSULTAT                          │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Chiffre d'affaires (CA)                                       │
│  - Achats et charges externes                                  │
│  ─────────────────────────────────                             │
│  = VALEUR AJOUTÉE (VA)                                         │
│                                                                │
│  - Charges de personnel                                        │
│  - Impôts et taxes                                             │
│  ─────────────────────────────────                             │
│  = EXCÉDENT BRUT D'EXPLOITATION (EBE)                          │
│                                                                │
│  - Dotations aux amortissements et provisions                  │
│  + Reprises sur amortissements et provisions                   │
│  + Autres produits d'exploitation                              │
│  - Autres charges d'exploitation                               │
│  ─────────────────────────────────                             │
│  = RÉSULTAT D'EXPLOITATION (REX)                               │
│                                                                │
│  + Produits financiers                                         │
│  - Charges financières                                         │
│  ─────────────────────────────────                             │
│  = RÉSULTAT COURANT AVANT IMPÔTS (RCAI)                        │
│                                                                │
│  + Produits exceptionnels                                      │
│  - Charges exceptionnelles                                     │
│  ─────────────────────────────────                             │
│  = RÉSULTAT EXCEPTIONNEL                                       │
│                                                                │
│  - Participation des salariés                                  │
│  - Impôt sur les bénéfices                                     │
│  ─────────────────────────────────                             │
│  = RÉSULTAT NET                                                │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 1.3 Le Tableau de Flux de Trésorerie

```
┌────────────────────────────────────────────────────────────────┐
│              TABLEAU DE FLUX DE TRÉSORERIE                     │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  FLUX DE TRÉSORERIE D'EXPLOITATION                             │
│  ├─ Résultat net                                               │
│  ├─ + Dotations aux amortissements                             │
│  ├─ +/- Variation du BFR                                       │
│  └─ = Flux net d'exploitation (A)                              │
│                                                                │
│  FLUX DE TRÉSORERIE D'INVESTISSEMENT                           │
│  ├─ - Acquisitions d'immobilisations                           │
│  ├─ + Cessions d'immobilisations                               │
│  └─ = Flux net d'investissement (B)                            │
│                                                                │
│  FLUX DE TRÉSORERIE DE FINANCEMENT                             │
│  ├─ + Augmentation de capital                                  │
│  ├─ + Nouveaux emprunts                                        │
│  ├─ - Remboursements d'emprunts                                │
│  ├─ - Dividendes versés                                        │
│  └─ = Flux net de financement (C)                              │
│                                                                │
│  VARIATION DE TRÉSORERIE = (A) + (B) + (C)                     │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 2. Les Équilibres Financiers Fondamentaux

### 2.1 Le Fonds de Roulement (FR)

Le FR représente l'excédent de ressources stables sur les emplois stables.

```
┌─────────────────────────────────────────────────────────────┐
│                    FONDS DE ROULEMENT                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   FR = Ressources stables - Emplois stables                 │
│                                                             │
│   FR = (Capitaux propres + Dettes LT) - Actif immobilisé    │
│                                                             │
│   OU (approche par le bas du bilan) :                       │
│                                                             │
│   FR = Actif circulant - Dettes à court terme               │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  INTERPRÉTATION :                                           │
│  • FR > 0 : Les ressources stables financent les            │
│             immobilisations + une partie du cycle           │
│             d'exploitation → Situation saine                │
│  • FR < 0 : Les immobilisations sont financées par des      │
│             ressources à court terme → Situation risquée    │
│  • FR = 0 : Équilibre strict (rare et fragile)              │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Le Besoin en Fonds de Roulement (BFR)

Le BFR représente le besoin de financement généré par le cycle d'exploitation.

```
┌─────────────────────────────────────────────────────────────┐
│              BESOIN EN FONDS DE ROULEMENT                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   BFR = Actif circulant d'exploitation                      │
│         - Passif circulant d'exploitation                   │
│                                                             │
│   BFR = (Stocks + Créances clients + Autres créances)       │
│         - (Dettes fournisseurs + Dettes fiscales/sociales)  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  INTERPRÉTATION :                                           │
│  • BFR > 0 : L'entreprise doit financer son cycle           │
│              d'exploitation (cas le plus fréquent)          │
│  • BFR < 0 : Le cycle d'exploitation génère de la           │
│              trésorerie (ex: grande distribution)           │
│  • BFR qui augmente : Attention à la tension de trésorerie  │
└─────────────────────────────────────────────────────────────┘
```

**Décomposition du BFR en jours de CA :**

```
BFR en jours = (BFR / CA HT) × 365

Composantes :
• Délai de rotation des stocks = (Stock moyen / Achats HT) × 365
• Délai clients = (Créances clients / CA TTC) × 365
• Délai fournisseurs = (Dettes fournisseurs / Achats TTC) × 365

BFR en jours ≈ Délai stocks + Délai clients - Délai fournisseurs
```

### 2.3 La Trésorerie Nette (TN)

```
┌─────────────────────────────────────────────────────────────┐
│                    TRÉSORERIE NETTE                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   TN = Fonds de Roulement - Besoin en Fonds de Roulement    │
│                                                             │
│   TN = FR - BFR                                             │
│                                                             │
│   OU directement :                                          │
│                                                             │
│   TN = Disponibilités - Concours bancaires courants         │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  INTERPRÉTATION :                                           │
│  • TN > 0 : Excédent de trésorerie (à placer ou investir)   │
│  • TN < 0 : Besoin de financement CT (découvert, etc.)      │
│  • TN très négative : Risque de cessation de paiement       │
└─────────────────────────────────────────────────────────────┘
```

**Schéma de l'équilibre financier :**

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│   RESSOURCES STABLES          EMPLOIS STABLES                │
│   ┌─────────────────┐         ┌─────────────────┐            │
│   │ Capitaux propres│         │                 │            │
│   │ + Dettes LT     │─────────│ Actif immobilisé│            │
│   │                 │    ↓    │                 │            │
│   └─────────────────┘   FR    └─────────────────┘            │
│                          │                                   │
│                          ▼                                   │
│   ┌─────────────────────────────────────────────┐            │
│   │              BFR (Besoin)                    │            │
│   │  Stocks + Créances - Dettes exploitation    │            │
│   └─────────────────────────────────────────────┘            │
│                          │                                   │
│                          ▼                                   │
│   ┌─────────────────────────────────────────────┐            │
│   │         TRÉSORERIE NETTE = FR - BFR         │            │
│   └─────────────────────────────────────────────┘            │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 3. Les Soldes Intermédiaires de Gestion (SIG)

Les SIG permettent de décomposer la formation du résultat.

```
┌────────────────────────────────────────────────────────────────┐
│           SOLDES INTERMÉDIAIRES DE GESTION                     │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Ventes de marchandises                                        │
│  - Coût d'achat des marchandises vendues                       │
│  ═══════════════════════════════════════                       │
│  = MARGE COMMERCIALE                                           │
│    → Mesure la performance de l'activité de négoce             │
│                                                                │
│  Production vendue + Production stockée + Production immob.    │
│  ═══════════════════════════════════════                       │
│  = PRODUCTION DE L'EXERCICE                                    │
│    → Mesure l'activité industrielle                            │
│                                                                │
│  Marge commerciale + Production - Consommations externes       │
│  ═══════════════════════════════════════                       │
│  = VALEUR AJOUTÉE (VA)                                         │
│    → Richesse créée par l'entreprise                           │
│    → Permet de rémunérer : personnel, État, prêteurs,          │
│      actionnaires, et autofinancement                          │
│                                                                │
│  VA - Charges de personnel - Impôts et taxes                   │
│  ═══════════════════════════════════════                       │
│  = EXCÉDENT BRUT D'EXPLOITATION (EBE)                          │
│    → Performance opérationnelle pure                           │
│    → Indépendant des politiques d'amortissement et financière  │
│    → INDICATEUR CLÉ de la rentabilité d'exploitation           │
│                                                                │
│  EBE + Autres produits - Autres charges                        │
│  - Dotations + Reprises                                        │
│  ═══════════════════════════════════════                       │
│  = RÉSULTAT D'EXPLOITATION (REX)                               │
│    → Performance après politique d'investissement              │
│                                                                │
│  REX + Produits financiers - Charges financières               │
│  ═══════════════════════════════════════                       │
│  = RÉSULTAT COURANT AVANT IMPÔTS (RCAI)                        │
│    → Performance après politique de financement                │
│                                                                │
│  Produits exceptionnels - Charges exceptionnelles              │
│  ═══════════════════════════════════════                       │
│  = RÉSULTAT EXCEPTIONNEL                                       │
│    → Éléments non récurrents                                   │
│                                                                │
│  RCAI + Résultat exceptionnel - IS - Participation             │
│  ═══════════════════════════════════════                       │
│  = RÉSULTAT NET                                                │
│    → Enrichissement ou appauvrissement de l'exercice           │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 4. La Capacité d'Autofinancement (CAF)

La CAF représente le flux potentiel de trésorerie généré par l'activité.

```
┌────────────────────────────────────────────────────────────────┐
│            CAPACITÉ D'AUTOFINANCEMENT (CAF)                    │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  MÉTHODE ADDITIVE (à partir du résultat net) :                 │
│  ───────────────────────────────────────────                   │
│  Résultat net                                                  │
│  + Dotations aux amortissements et provisions                  │
│  - Reprises sur amortissements et provisions                   │
│  + Valeur nette comptable des éléments d'actif cédés           │
│  - Produits de cession des éléments d'actif                    │
│  - Quote-part des subventions virées au résultat               │
│  ═══════════════════════════════════════                       │
│  = CAF                                                         │
│                                                                │
│  MÉTHODE SOUSTRACTIVE (à partir de l'EBE) :                    │
│  ──────────────────────────────────────────                    │
│  EBE                                                           │
│  + Autres produits d'exploitation encaissables                 │
│  - Autres charges d'exploitation décaissables                  │
│  + Produits financiers encaissables                            │
│  - Charges financières décaissables                            │
│  + Produits exceptionnels encaissables                         │
│  - Charges exceptionnelles décaissables                        │
│  - Participation des salariés                                  │
│  - Impôt sur les bénéfices                                     │
│  ═══════════════════════════════════════                       │
│  = CAF                                                         │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│  UTILISATION DE LA CAF :                                       │
│  • Remboursement des emprunts                                  │
│  • Financement des investissements                             │
│  • Distribution de dividendes                                  │
│  • Renforcement de la trésorerie                               │
│                                                                │
│  AUTOFINANCEMENT = CAF - Dividendes distribués                 │
└────────────────────────────────────────────────────────────────┘
```

---

## 5. Les Ratios Financiers

### 5.1 Ratios de Structure Financière

```
┌────────────────────────────────────────────────────────────────┐
│              RATIOS DE STRUCTURE FINANCIÈRE                    │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  AUTONOMIE FINANCIÈRE                                          │
│  ═══════════════════                                           │
│  = Capitaux propres / Total bilan                              │
│  → Norme : > 20-25%                                            │
│  → Mesure l'indépendance vis-à-vis des créanciers              │
│                                                                │
│  TAUX D'ENDETTEMENT (Gearing)                                  │
│  ═════════════════════════════                                 │
│  = Dettes financières / Capitaux propres                       │
│  → Norme : < 1 (idéalement < 0.5)                              │
│  → Au-delà de 1 : l'entreprise est plus financée par la        │
│    dette que par les fonds propres                             │
│                                                                │
│  ENDETTEMENT NET / EBITDA                                      │
│  ═════════════════════════                                     │
│  = (Dettes financières - Trésorerie) / EBE                     │
│  → Norme : < 3x                                                │
│  → Nombre d'années pour rembourser la dette nette              │
│                                                                │
│  CAPACITÉ DE REMBOURSEMENT                                     │
│  ═════════════════════════                                     │
│  = Dettes financières / CAF                                    │
│  → Norme : < 3-4 ans                                           │
│  → Nombre d'années pour rembourser avec la CAF                 │
│                                                                │
│  COUVERTURE DES IMMOBILISATIONS                                │
│  ═════════════════════════════                                 │
│  = Ressources stables / Actif immobilisé                       │
│  → Norme : > 1                                                 │
│  → Les immobilisations doivent être financées par des          │
│    ressources longues                                          │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 5.2 Ratios de Liquidité

```
┌────────────────────────────────────────────────────────────────┐
│                   RATIOS DE LIQUIDITÉ                          │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  LIQUIDITÉ GÉNÉRALE (Current Ratio)                            │
│  ══════════════════════════════════                            │
│  = Actif circulant / Dettes à court terme                      │
│  → Norme : > 1.5                                               │
│  → Capacité à couvrir les dettes CT par les actifs CT          │
│                                                                │
│  LIQUIDITÉ RÉDUITE (Quick Ratio / Acid Test)                   │
│  ════════════════════════════════════════════                  │
│  = (Actif circulant - Stocks) / Dettes à court terme           │
│  → Norme : > 1                                                 │
│  → Exclut les stocks (moins liquides)                          │
│                                                                │
│  LIQUIDITÉ IMMÉDIATE (Cash Ratio)                              │
│  ═════════════════════════════════                             │
│  = Disponibilités / Dettes à court terme                       │
│  → Norme : > 0.2 - 0.3                                         │
│  → Capacité à payer immédiatement avec la trésorerie           │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 5.3 Ratios de Rentabilité

```
┌────────────────────────────────────────────────────────────────┐
│                  RATIOS DE RENTABILITÉ                         │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  RENTABILITÉ ÉCONOMIQUE (ROA / ROCE)                           │
│  ═══════════════════════════════════                           │
│                                                                │
│  ROA = Résultat d'exploitation / Total actif                   │
│  → Rentabilité de tous les actifs                              │
│                                                                │
│  ROCE = Résultat d'exploitation / Capitaux employés            │
│       = REX / (Capitaux propres + Dettes financières)          │
│  → Norme : > Coût du capital (WACC)                            │
│  → Rentabilité des capitaux investis dans l'exploitation       │
│                                                                │
│  RENTABILITÉ FINANCIÈRE (ROE)                                  │
│  ════════════════════════════                                  │
│  = Résultat net / Capitaux propres                             │
│  → Norme : > 10-15% selon secteur                              │
│  → Rentabilité pour les actionnaires                           │
│  → Inclut l'effet de levier financier                          │
│                                                                │
│  DÉCOMPOSITION DU ROE (Formule de DuPont)                      │
│  ════════════════════════════════════════                      │
│  ROE = (RN/CA) × (CA/Actif) × (Actif/CP)                       │
│      = Marge nette × Rotation × Levier financier               │
│                                                                │
│  MARGE BRUTE                                                   │
│  ═══════════                                                   │
│  = (CA - Coût des ventes) / CA                                 │
│  → Performance commerciale brute                               │
│                                                                │
│  MARGE D'EXPLOITATION                                          │
│  ════════════════════                                          │
│  = Résultat d'exploitation / CA                                │
│  → Performance opérationnelle                                  │
│                                                                │
│  MARGE NETTE                                                   │
│  ═══════════                                                   │
│  = Résultat net / CA                                           │
│  → Performance globale après tous les éléments                 │
│                                                                │
│  TAUX DE MARGE D'EBE (EBITDA Margin)                           │
│  ════════════════════════════════════                          │
│  = EBE / CA                                                    │
│  → Norme : très variable selon secteur (5% à 40%)              │
│  → Performance opérationnelle pure                             │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 5.4 Ratios d'Activité et de Rotation

```
┌────────────────────────────────────────────────────────────────┐
│              RATIOS D'ACTIVITÉ ET DE ROTATION                  │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ROTATION DE L'ACTIF                                           │
│  ═══════════════════                                           │
│  = CA / Total actif                                            │
│  → Efficacité dans l'utilisation des actifs                    │
│                                                                │
│  ROTATION DES STOCKS                                           │
│  ═══════════════════                                           │
│  = Coût des ventes / Stock moyen                               │
│  → Nombre de fois que le stock est renouvelé                   │
│                                                                │
│  DÉLAI DE ROTATION DES STOCKS                                  │
│  ════════════════════════════                                  │
│  = (Stock moyen / Coût des ventes) × 365                       │
│  → En jours                                                    │
│  → Norme : très variable (industrie 60-90j, commerce 30-45j)   │
│                                                                │
│  DÉLAI DE RÈGLEMENT CLIENTS (DSO)                              │
│  ════════════════════════════════                              │
│  = (Créances clients / CA TTC) × 365                           │
│  → Norme : 45-60 jours (selon secteur et pays)                 │
│  → Délai moyen de paiement des clients                         │
│                                                                │
│  DÉLAI DE RÈGLEMENT FOURNISSEURS (DPO)                         │
│  ══════════════════════════════════════                        │
│  = (Dettes fournisseurs / Achats TTC) × 365                    │
│  → Norme : 45-60 jours                                         │
│  → Délai moyen de paiement aux fournisseurs                    │
│                                                                │
│  CYCLE DE CONVERSION DE TRÉSORERIE (CCC)                       │
│  ════════════════════════════════════════                      │
│  = Délai stocks + Délai clients - Délai fournisseurs           │
│  → Plus le CCC est court, meilleure est la gestion du BFR      │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 5.5 Ratios de Couverture

```
┌────────────────────────────────────────────────────────────────┐
│                  RATIOS DE COUVERTURE                          │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  COUVERTURE DES INTÉRÊTS (ICR)                                 │
│  ═════════════════════════════                                 │
│  = EBE / Charges d'intérêts                                    │
│  OU = EBIT / Charges d'intérêts                                │
│  → Norme : > 3x (idéalement > 5x)                              │
│  → Capacité à payer les intérêts de la dette                   │
│                                                                │
│  COUVERTURE DU SERVICE DE LA DETTE (DSCR)                      │
│  ═════════════════════════════════════════                     │
│  = (EBE - Impôts - Variation BFR) / (Intérêts + Principal)     │
│  → Norme : > 1.2x (exigé par les banques)                      │
│  → Capacité à rembourser capital + intérêts                    │
│                                                                │
│  COUVERTURE DES CHARGES FIXES                                  │
│  ════════════════════════════                                  │
│  = (EBE + Loyers) / (Intérêts + Loyers + Remb. principal)      │
│  → Inclut les obligations locatives                            │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 6. L'Effet de Levier Financier

```
┌────────────────────────────────────────────────────────────────┐
│               L'EFFET DE LEVIER FINANCIER                      │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  PRINCIPE :                                                    │
│  L'endettement peut amplifier la rentabilité des capitaux      │
│  propres (ROE) si la rentabilité économique (ROCE) est         │
│  supérieure au coût de la dette.                               │
│                                                                │
│  FORMULE :                                                     │
│  ═════════                                                     │
│  ROE = ROCE + (ROCE - i) × (D/CP)                              │
│                                                                │
│  Où :                                                          │
│  • ROE = Rentabilité financière                                │
│  • ROCE = Rentabilité économique                               │
│  • i = Coût de la dette (taux d'intérêt)                       │
│  • D = Dettes financières                                      │
│  • CP = Capitaux propres                                       │
│  • D/CP = Levier financier                                     │
│                                                                │
│  INTERPRÉTATION :                                              │
│  ════════════════                                              │
│                                                                │
│  Si ROCE > i (rentabilité > coût de la dette) :                │
│  → L'effet de levier est POSITIF                               │
│  → Plus de dette = Plus de ROE                                 │
│  → MAIS plus de risque !                                       │
│                                                                │
│  Si ROCE < i (rentabilité < coût de la dette) :                │
│  → L'effet de levier est NÉGATIF ("effet massue")              │
│  → La dette détruit de la valeur                               │
│  → Il faut se désendetter                                      │
│                                                                │
│  EXEMPLE :                                                     │
│  ═════════                                                     │
│  ROCE = 12%, i = 4%, D/CP = 1                                  │
│  ROE = 12% + (12% - 4%) × 1 = 20%                              │
│                                                                │
│  → La dette a permis de passer de 12% à 20% de ROE             │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 7. Analyse de la Croissance

```
┌────────────────────────────────────────────────────────────────┐
│                 ANALYSE DE LA CROISSANCE                       │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  TAUX DE CROISSANCE DU CA                                      │
│  ════════════════════════                                      │
│  = (CA n - CA n-1) / CA n-1                                    │
│  → Évolution de l'activité                                     │
│  → À comparer avec la croissance du marché                     │
│                                                                │
│  CROISSANCE ORGANIQUE vs EXTERNE                               │
│  ══════════════════════════════                                │
│  Organique = croissance interne (nouveaux clients, volumes)    │
│  Externe = acquisitions                                        │
│  → Distinguer pour comprendre la qualité de la croissance      │
│                                                                │
│  CROISSANCE SOUTENABLE                                         │
│  ══════════════════════                                        │
│  = ROE × Taux de rétention des bénéfices                       │
│  = ROE × (1 - Taux de distribution)                            │
│  → Croissance maximale sans lever de nouveaux fonds propres    │
│                                                                │
│  ANALYSE DE LA CROISSANCE PAR LES MARGES                       │
│  ═════════════════════════════════════════                     │
│  Croissance CA + Amélioration marge = Croissance RN amplifée   │
│  Croissance CA + Dégradation marge = Croissance "en trompe-    │
│                                      l'œil"                    │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 8. Méthodologie d'Analyse Financière

### 8.1 Les Étapes de l'Analyse

```
┌────────────────────────────────────────────────────────────────┐
│          MÉTHODOLOGIE D'ANALYSE EN 7 ÉTAPES                    │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ÉTAPE 1 : COMPRENDRE L'ACTIVITÉ                               │
│  ─────────────────────────────────                             │
│  • Quel est le business model ?                                │
│  • Quels sont les produits/services ?                          │
│  • Qui sont les clients ? Les fournisseurs ?                   │
│  • Quel est l'environnement concurrentiel ?                    │
│  • Quels sont les facteurs clés de succès du secteur ?         │
│                                                                │
│  ÉTAPE 2 : ANALYSER L'ACTIVITÉ ET LA CROISSANCE                │
│  ──────────────────────────────────────────────                │
│  • Évolution du CA sur 3-5 ans                                 │
│  • Croissance organique vs externe                             │
│  • Saisonnalité de l'activité                                  │
│  • Parts de marché                                             │
│                                                                │
│  ÉTAPE 3 : ANALYSER LA RENTABILITÉ                             │
│  ─────────────────────────────────                             │
│  • Évolution des SIG                                           │
│  • Analyse des marges (brute, EBE, REX, nette)                 │
│  • Comparaison avec le secteur                                 │
│  • Identification des leviers d'amélioration                   │
│                                                                │
│  ÉTAPE 4 : ANALYSER LA STRUCTURE FINANCIÈRE                    │
│  ──────────────────────────────────────────                    │
│  • FR, BFR, Trésorerie nette                                   │
│  • Évolution sur plusieurs exercices                           │
│  • Niveau d'endettement                                        │
│  • Capacité de remboursement                                   │
│                                                                │
│  ÉTAPE 5 : ANALYSER LES FLUX DE TRÉSORERIE                     │
│  ─────────────────────────────────────────                     │
│  • CAF et son évolution                                        │
│  • Flux d'exploitation, investissement, financement            │
│  • Couverture des investissements par la CAF                   │
│  • Free cash-flow                                              │
│                                                                │
│  ÉTAPE 6 : CALCULER ET INTERPRÉTER LES RATIOS                  │
│  ─────────────────────────────────────────────                 │
│  • Sélectionner les ratios pertinents pour le secteur          │
│  • Comparer dans le temps (évolution)                          │
│  • Comparer avec les concurrents / le secteur                  │
│  • Identifier les écarts significatifs                         │
│                                                                │
│  ÉTAPE 7 : SYNTHÉTISER ET CONCLURE                             │
│  ─────────────────────────────────                             │
│  • Forces et faiblesses financières                            │
│  • Risques identifiés                                          │
│  • Recommandations                                             │
│  • Perspectives                                                │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 8.2 Grille d'Analyse Rapide

```
┌────────────────────────────────────────────────────────────────┐
│              GRILLE D'ANALYSE RAPIDE                           │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  QUESTIONS CLÉS À SE POSER :                                   │
│                                                                │
│  ACTIVITÉ                                                      │
│  □ Le CA est-il en croissance ?                                │
│  □ La croissance est-elle rentable ?                           │
│  □ L'activité est-elle diversifiée ou concentrée ?             │
│                                                                │
│  RENTABILITÉ                                                   │
│  □ Les marges sont-elles stables ou en amélioration ?          │
│  □ La rentabilité est-elle supérieure au secteur ?             │
│  □ L'EBE couvre-t-il les charges financières ?                 │
│                                                                │
│  STRUCTURE                                                     │
│  □ Le FR est-il positif et suffisant ?                         │
│  □ Le BFR est-il maîtrisé ?                                    │
│  □ L'endettement est-il soutenable ?                           │
│                                                                │
│  TRÉSORERIE                                                    │
│  □ La CAF est-elle positive et récurrente ?                    │
│  □ Le free cash-flow est-il positif ?                          │
│  □ La trésorerie permet-elle de faire face aux échéances ?     │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 9. Signaux d'Alerte et Points de Vigilance

### 9.1 Signaux d'Alerte Majeurs

```
┌────────────────────────────────────────────────────────────────┐
│                 SIGNAUX D'ALERTE MAJEURS                       │
│                      🚨 DANGER 🚨                               │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  RISQUE DE CESSATION DE PAIEMENT                               │
│  ══════════════════════════════                                │
│  ⚠ Trésorerie nette négative et qui se dégrade                 │
│  ⚠ Capitaux propres négatifs                                   │
│  ⚠ Fonds de roulement négatif                                  │
│  ⚠ Impossibilité de renouveler les lignes de crédit            │
│  ⚠ Dettes fournisseurs > 90 jours                              │
│  ⚠ Incidents de paiement (Banque de France)                    │
│                                                                │
│  DÉGRADATION DE LA RENTABILITÉ                                 │
│  ════════════════════════════                                  │
│  ⚠ Marge brute en baisse continue                              │
│  ⚠ EBE négatif ou en forte baisse                              │
│  ⚠ Résultat d'exploitation négatif sur 2-3 exercices           │
│  ⚠ Résultat net négatif récurrent                              │
│                                                                │
│  PROBLÈMES DE STRUCTURE                                        │
│  ══════════════════════                                        │
│  ⚠ Endettement > 4x EBITDA                                     │
│  ⚠ Dettes financières > 2x capitaux propres                    │
│  ⚠ ICR < 1.5x                                                  │
│  ⚠ Dépendance excessive à un client/fournisseur (> 30% CA)     │
│                                                                │
│  SIGNAUX OPÉRATIONNELS                                         │
│  ═════════════════════                                         │
│  ⚠ Stocks obsolètes ou à rotation très lente                   │
│  ⚠ Créances clients douteuses importantes                      │
│  ⚠ Investissements insuffisants (sous-investissement)          │
│  ⚠ Turnover élevé des dirigeants ou équipes clés               │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 9.2 Points de Vigilance par Secteur

```
┌────────────────────────────────────────────────────────────────┐
│            POINTS DE VIGILANCE PAR SECTEUR                     │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  INDUSTRIE                                                     │
│  • Taux d'utilisation des capacités                            │
│  • Vétusté des immobilisations (taux d'amortissement)          │
│  • Coûts fixes / Coûts variables (levier opérationnel)         │
│  • Dépendance aux matières premières                           │
│                                                                │
│  DISTRIBUTION / COMMERCE                                       │
│  • Rotation des stocks (crucial)                               │
│  • Marge arrière et conditions fournisseurs                    │
│  • Évolution du panier moyen et de la fréquentation            │
│  • Loyers et charges locatives                                 │
│                                                                │
│  SERVICES / CONSEIL                                            │
│  • Taux de facturation (utilisation des consultants)           │
│  • Taux journalier moyen                                       │
│  • Carnet de commandes                                         │
│  • Masse salariale / CA                                        │
│                                                                │
│  BTP / CONSTRUCTION                                            │
│  • Carnet de commandes et backlog                              │
│  • Avances clients vs travaux en cours                         │
│  • Provisions pour risques chantiers                           │
│  • Retenues de garantie                                        │
│                                                                │
│  TECH / SaaS                                                   │
│  • ARR (Annual Recurring Revenue) et croissance                │
│  • Churn rate (taux d'attrition)                               │
│  • CAC (Coût d'acquisition client) vs LTV                      │
│  • Rule of 40 (Croissance + Marge EBITDA > 40%)                │
│                                                                │
│  IMMOBILIER                                                    │
│  • Taux d'occupation                                           │
│  • Valeur du patrimoine vs dette                               │
│  • Yield (rendement locatif)                                   │
│  • Duration des baux                                           │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 10. Analyse Sectorielle et Benchmarking

```
┌────────────────────────────────────────────────────────────────┐
│           ANALYSE COMPARATIVE (BENCHMARKING)                   │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  PRINCIPES DU BENCHMARKING :                                   │
│  ═══════════════════════════                                   │
│  • Comparer avec des entreprises de taille similaire           │
│  • Utiliser le même secteur d'activité (code NAF)              │
│  • Prendre en compte le positionnement (premium vs discount)   │
│  • Analyser sur plusieurs années pour lisser les anomalies     │
│                                                                │
│  SOURCES DE DONNÉES SECTORIELLES :                             │
│  ═════════════════════════════════                             │
│  • Banque de France (FIBEN, données sectorielles)              │
│  • INSEE (statistiques sectorielles)                           │
│  • Greffes des tribunaux de commerce                           │
│  • Bases privées (Diane, Altares, Ellisphere)                  │
│  • Rapports d'analystes sectoriels                             │
│                                                                │
│  RATIOS MÉDIANS INDICATIFS PAR GRAND SECTEUR :                 │
│  ═════════════════════════════════════════════                 │
│                                                                │
│  ┌──────────────┬────────┬────────┬────────┬────────┐          │
│  │ Secteur      │ Marge  │ ROE    │ Gearing│ BFR/CA │          │
│  │              │ EBE    │        │        │        │          │
│  ├──────────────┼────────┼────────┼────────┼────────┤          │
│  │ Industrie    │ 8-12%  │ 8-15%  │ 0.5-1  │ 15-25% │          │
│  │ Distribution │ 3-6%   │ 10-20% │ 0.3-0.8│ -5-10% │          │
│  │ Services     │ 10-20% │ 15-25% │ 0.2-0.6│ 5-15%  │          │
│  │ BTP          │ 5-10%  │ 8-15%  │ 0.3-0.8│ 0-15%  │          │
│  │ Tech/SaaS    │ 15-40% │ Var.   │ 0-0.5  │ -10-5% │          │
│  └──────────────┴────────┴────────┴────────┴────────┘          │
│                                                                │
│  ⚠ Ces chiffres sont indicatifs et varient selon les sous-     │
│    secteurs, la taille et le positionnement des entreprises    │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 11. Analyse Prévisionnelle et Business Plan

```
┌────────────────────────────────────────────────────────────────┐
│         ANALYSE D'UN BUSINESS PLAN / PRÉVISIONNEL              │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  VÉRIFICATION DE LA COHÉRENCE :                                │
│  ══════════════════════════════                                │
│                                                                │
│  □ Les hypothèses de CA sont-elles réalistes ?                 │
│    • Taille du marché adressable                               │
│    • Part de marché visée vs concurrence                       │
│    • Cohérence avec les moyens commerciaux prévus              │
│                                                                │
│  □ Les charges sont-elles correctement estimées ?              │
│    • Masse salariale cohérente avec les effectifs              │
│    • Charges variables proportionnelles au CA                  │
│    • Charges fixes réalistes                                   │
│                                                                │
│  □ Le BFR est-il correctement anticipé ?                       │
│    • Délais clients/fournisseurs réalistes                     │
│    • Stocks nécessaires au niveau d'activité                   │
│    • Croissance du BFR avec le CA                              │
│                                                                │
│  □ Les investissements sont-ils suffisants ?                   │
│    • Capacité de production vs CA prévu                        │
│    • Investissements de maintenance                            │
│    • Investissements de croissance                             │
│                                                                │
│  □ Le financement est-il adapté ?                              │
│    • Fonds propres suffisants                                  │
│    • Capacité d'endettement                                    │
│    • Plan de financement équilibré                             │
│                                                                │
│  TESTS DE SENSIBILITÉ :                                        │
│  ══════════════════════                                        │
│  • Que se passe-t-il si le CA est inférieur de 20% ?           │
│  • Impact d'une hausse des coûts de 10% ?                      │
│  • Impact d'un allongement du délai clients de 15 jours ?      │
│  • Point mort opérationnel et financier                        │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 12. Formules Récapitulatives

```
┌────────────────────────────────────────────────────────────────┐
│              FORMULES ESSENTIELLES - MÉMO                      │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ÉQUILIBRES FINANCIERS                                         │
│  ═════════════════════                                         │
│  FR = Ressources stables - Emplois stables                     │
│  BFR = Actif circulant exploit. - Passif circulant exploit.    │
│  TN = FR - BFR = Disponibilités - Concours bancaires           │
│                                                                │
│  RENTABILITÉ                                                   │
│  ═══════════                                                   │
│  ROE = Résultat net / Capitaux propres                         │
│  ROCE = REX / (CP + Dettes financières)                        │
│  Marge EBE = EBE / CA                                          │
│  Marge nette = Résultat net / CA                               │
│                                                                │
│  STRUCTURE                                                     │
│  ═════════                                                     │
│  Autonomie financière = CP / Total bilan                       │
│  Gearing = Dettes financières / CP                             │
│  Capacité de remboursement = Dettes fin. / CAF                 │
│                                                                │
│  LIQUIDITÉ                                                     │
│  ═════════                                                     │
│  Liquidité générale = AC / DCT                                 │
│  Liquidité réduite = (AC - Stocks) / DCT                       │
│  Liquidité immédiate = Disponibilités / DCT                    │
│                                                                │
│  ROTATION                                                      │
│  ════════                                                      │
│  Délai clients = (Créances / CA TTC) × 365                     │
│  Délai fournisseurs = (Dettes fourn. / Achats TTC) × 365       │
│  Délai stocks = (Stock moyen / Coût ventes) × 365              │
│  CCC = Délai stocks + Délai clients - Délai fournisseurs       │
│                                                                │
│  COUVERTURE                                                    │
│  ══════════                                                    │
│  ICR = EBE / Charges d'intérêts                                │
│  DSCR = Cash-flow disponible / Service de la dette             │
│                                                                │
│  EFFET DE LEVIER                                               │
│  ═══════════════                                               │
│  ROE = ROCE + (ROCE - i) × (D/CP)                              │
│                                                                │
│  CROISSANCE                                                    │
│  ══════════                                                    │
│  Croissance soutenable = ROE × (1 - Taux distribution)         │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 13. Instructions pour l'Analyse

Lorsque tu réalises une analyse financière, tu dois :

1. **Toujours commencer par comprendre l'activité** avant de plonger dans les chiffres

2. **Demander les documents nécessaires** :
   - Bilan des 3 derniers exercices minimum
   - Compte de résultat des 3 derniers exercices
   - Annexes comptables
   - Tableau de flux de trésorerie si disponible

3. **Structurer ton analyse** :
   - Présenter le contexte et l'activité
   - Analyser les SIG et la rentabilité
   - Analyser la structure financière (FR, BFR, TN)
   - Calculer les ratios pertinents
   - Comparer avec le secteur
   - Identifier les forces, faiblesses et risques
   - Formuler des recommandations

4. **Adapter ton analyse au contexte** :
   - Startup : focus sur le cash burn et le runway
   - PME mature : focus sur la rentabilité et le désendettement
   - Entreprise en difficulté : focus sur la trésorerie et la restructuration
   - Acquisition : focus sur la valorisation et les synergies

5. **Être prudent dans tes conclusions** :
   - Ne jamais conclure sur un seul ratio
   - Toujours analyser les tendances (évolution)
   - Prendre en compte le contexte sectoriel
   - Mentionner les limites de l'analyse

6. **Utiliser des visuels** :
   - Tableaux de synthèse des ratios
   - Graphiques d'évolution
   - Schémas explicatifs pour les concepts

---

## 14. Glossaire des Termes Financiers

```
┌────────────────────────────────────────────────────────────────┐
│                       GLOSSAIRE                                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ACTIF CIRCULANT : Éléments de l'actif liés au cycle           │
│  d'exploitation, destinés à être transformés en liquidités     │
│  dans l'année (stocks, créances, disponibilités)               │
│                                                                │
│  BFR : Besoin en Fonds de Roulement - besoin de financement    │
│  généré par le décalage entre encaissements et décaissements   │
│  du cycle d'exploitation                                       │
│                                                                │
│  CAF : Capacité d'Autofinancement - flux potentiel de          │
│  trésorerie généré par l'activité                              │
│                                                                │
│  CAPITAUX PROPRES : Ressources appartenant aux actionnaires    │
│  (capital + réserves + résultat)                               │
│                                                                │
│  DSCR : Debt Service Coverage Ratio - ratio de couverture      │
│  du service de la dette                                        │
│                                                                │
│  EBE / EBITDA : Excédent Brut d'Exploitation - performance     │
│  opérationnelle avant amortissements et éléments financiers    │
│                                                                │
│  FR : Fonds de Roulement - excédent des ressources stables     │
│  sur les emplois stables                                       │
│                                                                │
│  FREE CASH-FLOW : Flux de trésorerie disponible après          │
│  investissements de maintenance                                │
│                                                                │
│  GEARING : Ratio d'endettement = Dettes fin. / CP              │
│                                                                │
│  ICR : Interest Coverage Ratio - ratio de couverture des       │
│  intérêts                                                      │
│                                                                │
│  LTV : Loan To Value - ratio dette / valeur d'un actif         │
│                                                                │
│  ROA : Return On Assets - rentabilité des actifs               │
│                                                                │
│  ROCE : Return On Capital Employed - rentabilité des           │
│  capitaux employés (rentabilité économique)                    │
│                                                                │
│  ROE : Return On Equity - rentabilité des capitaux propres     │
│  (rentabilité financière)                                      │
│                                                                │
│  SIG : Soldes Intermédiaires de Gestion - décomposition        │
│  de la formation du résultat                                   │
│                                                                │
│  TN : Trésorerie Nette = FR - BFR                              │
│                                                                │
│  VA : Valeur Ajoutée - richesse créée par l'entreprise         │
│                                                                │
│  WACC : Weighted Average Cost of Capital - coût moyen          │
│  pondéré du capital                                            │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 15. Modèle de Synthèse d'Analyse

Utilise ce modèle pour structurer tes conclusions :

```
┌────────────────────────────────────────────────────────────────┐
│              SYNTHÈSE DE L'ANALYSE FINANCIÈRE                  │
│                    [Nom de l'entreprise]                       │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  1. PRÉSENTATION DE L'ENTREPRISE                               │
│     • Activité :                                               │
│     • Secteur :                                                │
│     • Effectif :                                               │
│     • CA dernier exercice :                                    │
│                                                                │
│  2. POINTS FORTS                                               │
│     •                                                          │
│     •                                                          │
│     •                                                          │
│                                                                │
│  3. POINTS DE VIGILANCE                                        │
│     •                                                          │
│     •                                                          │
│     •                                                          │
│                                                                │
│  4. PRINCIPAUX RATIOS                                          │
│     ┌─────────────────────┬─────────┬─────────┬─────────┐      │
│     │ Ratio               │ N-2     │ N-1     │ N       │      │
│     ├─────────────────────┼─────────┼─────────┼─────────┤      │
│     │ Croissance CA       │         │         │         │      │
│     │ Marge EBE           │         │         │         │      │
│     │ ROE                 │         │         │         │      │
│     │ Gearing             │         │         │         │      │
│     │ BFR en jours CA     │         │         │         │      │
│     └─────────────────────┴─────────┴─────────┴─────────┘      │
│                                                                │
│  5. DIAGNOSTIC                                                 │
│     [Synthèse en 3-4 lignes]                                   │
│                                                                │
│  6. RECOMMANDATIONS                                            │
│     •                                                          │
│     •                                                          │
│     •                                                          │
│                                                                │
│  7. CONCLUSION / AVIS                                          │
│     □ Situation saine                                          │
│     □ Situation à surveiller                                   │
│     □ Situation préoccupante                                   │
│     □ Situation critique                                       │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```