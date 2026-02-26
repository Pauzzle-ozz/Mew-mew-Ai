/**
 * Base de connaissances fiscales francaises
 * Donnees de reference pour le systeme RAG de l'Agent Fiscalite
 *
 * Mise a jour : Fevrier 2026
 * Sources : CGI, BOFiP, loi de finances 2025/2026, bareme officiel
 */

const fiscalKnowledgeData = [

  // ═══════════════════════════════════════════════
  // BAREME IMPOT SUR LE REVENU (IR)
  // ═══════════════════════════════════════════════

  {
    category: 'bareme_ir',
    title: 'Bareme progressif IR 2025 (revenus 2024)',
    content: `Bareme de l'impot sur le revenu applicable aux revenus de 2024 (declaration 2025) :

Tranche 1 : De 0 a 11 294 EUR → Taux 0%
Tranche 2 : De 11 295 a 28 797 EUR → Taux 11%
Tranche 3 : De 28 798 a 82 341 EUR → Taux 30%
Tranche 4 : De 82 342 a 177 106 EUR → Taux 41%
Tranche 5 : Au-dela de 177 106 EUR → Taux 45%

Le taux marginal d'imposition (TMI) est le taux applique a la derniere tranche de revenus.
Le quotient familial divise le revenu imposable par le nombre de parts (1 part par adulte, 0.5 par enfant a charge, 1 part a partir du 3eme enfant).
Plafonnement du quotient familial : 1 759 EUR par demi-part supplementaire (art. 197 CGI).

Reference : Article 197 du CGI.`
  },

  {
    category: 'bareme_ir',
    title: 'Decote et seuils IR',
    content: `Decote IR 2025 (revenus 2024) :
- Celibataire : si impot brut < 1 929 EUR, decote = 873 - (impot brut x 45,25%)
- Couple : si impot brut < 3 191 EUR, decote = 1 444 - (impot brut x 45,25%)

Seuil de mise en recouvrement : l'impot n'est pas mis en recouvrement s'il est inferieur a 61 EUR.

Contribution exceptionnelle sur les hauts revenus (CEHR) :
- Celibataire : 3% entre 250 000 et 500 000 EUR, 4% au-dela de 500 000 EUR
- Couple : 3% entre 500 000 et 1 000 000 EUR, 4% au-dela de 1 000 000 EUR

Reference : Articles 197, 1657-1 bis et 223 sexies du CGI.`
  },

  {
    category: 'bareme_ir',
    title: 'Prelevement a la source (PAS)',
    content: `Le prelevement a la source est calcule sur la base du taux personnalise (calcule par l'administration) ou du taux neutre (grille par defaut).

Grille de taux neutre 2025 (base mensuelle, metropolitain) :
- Jusqu'a 1 590 EUR/mois : 0%
- De 1 591 a 1 653 EUR : 0,5%
- De 1 654 a 1 759 EUR : 1,3%
- De 1 760 a 1 876 EUR : 2,1%
- De 1 877 a 1 998 EUR : 2,9%
- ... (progressif jusqu'a 43% au-dela de 18 572 EUR/mois)

Options : taux individualise pour les couples, modulation possible si variation de revenus > 5%.

Reference : Article 204 H du CGI.`
  },

  {
    category: 'bareme_ir',
    title: 'Frais reels vs deduction forfaitaire 10%',
    content: `Deduction forfaitaire de 10% pour frais professionnels :
- Minimum : 495 EUR par salarie
- Maximum : 14 171 EUR par salarie
- Appliquee automatiquement si l'option frais reels n'est pas choisie

Frais reels (option) - principaux frais deductibles :
- Frais de transport domicile-travail : bareme kilometrique ou transports en commun
- Frais de repas : difference entre le cout du repas et le forfait repas a domicile (5,35 EUR en 2025)
- Double residence : loyer, frais de transport hebdomadaires
- Formation professionnelle, materiel informatique, tenue de travail obligatoire

Bareme kilometrique 2025 (voitures) :
- 3 CV : d x 0,529 (jusqu'a 5000 km), (d x 0,316) + 1065 (5001-20000 km)
- 4 CV : d x 0,606, (d x 0,340) + 1330
- 5 CV : d x 0,636, (d x 0,357) + 1395
- 6 CV : d x 0,665, (d x 0,374) + 1457
- 7 CV et + : d x 0,697, (d x 0,394) + 1515

Reference : Article 83-3° du CGI, BOFiP BOI-BAREME-000001.`
  },

  // ═══════════════════════════════════════════════
  // IMPOT SUR LES SOCIETES (IS)
  // ═══════════════════════════════════════════════

  {
    category: 'taux_is',
    title: 'Taux IS 2025',
    content: `Taux d'impot sur les societes applicables en 2025 :

Taux reduit PME : 15% sur les 42 500 premiers euros de benefice
Conditions du taux reduit (art. 219 I b du CGI) :
- CA HT < 10 000 000 EUR
- Capital entierement libere
- Capital detenu a 75% minimum par des personnes physiques (ou par des societes elles-memes detenues a 75% par des personnes physiques)

Taux normal : 25% au-dela de 42 500 EUR de benefice

Exemple : une SARL avec 100 000 EUR de benefice paie :
- 42 500 x 15% = 6 375 EUR
- 57 500 x 25% = 14 375 EUR
- Total IS = 20 750 EUR (taux effectif : 20,75%)

Acomptes IS : 4 acomptes trimestriels (15 mars, 15 juin, 15 septembre, 15 decembre), chacun egal a 25% de l'IS de l'exercice precedent.

Reference : Article 219 du CGI.`
  },

  {
    category: 'taux_is',
    title: 'Report de deficits IS',
    content: `Report en avant des deficits (art. 209 I CGI) :
- Imputable sur les benefices des exercices suivants sans limitation de duree
- Plafonne a 1 000 000 EUR + 50% du benefice excedant 1 000 000 EUR par exercice
- Exemple : benefice de 3 000 000 EUR, deficits reportables de 5 000 000 EUR
  → Imputation : 1 000 000 + (2 000 000 x 50%) = 2 000 000 EUR maximum

Report en arriere (carry-back, art. 220 quinquies CGI) :
- Uniquement sur le benefice de l'exercice precedent
- Plafonne a 1 000 000 EUR
- Genere une creance d'IS (remboursable au bout de 5 ans ou imputable sur l'IS futur)

Reference : Articles 209 I et 220 quinquies du CGI.`
  },

  {
    category: 'taux_is',
    title: 'Credit Impot Recherche (CIR) et Innovation (CII)',
    content: `Credit d'Impot Recherche (CIR) - art. 244 quater B CGI :
- 30% des depenses de recherche jusqu'a 100 000 000 EUR
- 5% au-dela de 100 000 000 EUR
- Depenses eligibles : personnel chercheur, amortissement materiel recherche, brevets, sous-traitance (plafonnee)
- Jeunes docteurs : depenses comptees pour le double pendant 24 mois

Credit d'Impot Innovation (CII) - art. 244 quater B II CGI :
- Reserve aux PME au sens communautaire (< 250 salaries, CA < 50M EUR ou bilan < 43M EUR)
- 20% des depenses d'innovation (conception prototypes, installations pilotes)
- Plafond : 400 000 EUR de depenses eligibles par an (soit 80 000 EUR de credit max)

Le CIR/CII s'impute sur l'IS. Si l'IS est insuffisant, le credit est reportable 3 ans puis rembourse.
Les PME peuvent demander le remboursement immediat.

Reference : Article 244 quater B du CGI.`
  },

  // ═══════════════════════════════════════════════
  // TVA
  // ═══════════════════════════════════════════════

  {
    category: 'tva',
    title: 'Taux de TVA en France 2025',
    content: `Taux de TVA applicables en France metropolitaine :

- Taux normal : 20% (la majorite des biens et services)
- Taux intermediaire : 10% (restauration sur place, travaux de renovation, transports, hebergement)
- Taux reduit : 5,5% (alimentation, livres, abonnements energie, travaux amelioration energetique)
- Taux super-reduit : 2,1% (medicaments rembourses, presse, spectacles vivants)

Taux DOM (Guadeloupe, Martinique, Reunion) :
- Taux normal : 8,5%
- Taux reduit : 2,1%

Guyane et Mayotte : pas de TVA.

Reference : Articles 278 a 281 nonies du CGI.`
  },

  {
    category: 'tva',
    title: 'Franchise en base de TVA - seuils 2025',
    content: `Franchise en base de TVA (art. 293 B CGI) - seuils 2025 :

Prestations de services (BIC et BNC) :
- Seuil de base : 36 800 EUR de CA HT
- Seuil majore : 39 100 EUR (perte de la franchise si depasse)

Ventes de marchandises / fourniture de logement :
- Seuil de base : 91 900 EUR de CA HT
- Seuil majore : 101 000 EUR

Avocats, auteurs, artistes-interpretes :
- Seuil specifique : 47 600 EUR

Mecanisme :
- En dessous du seuil de base : franchise maintenue l'annee suivante
- Entre seuil de base et seuil majore : franchise maintenue l'annee en cours, perdue l'annee suivante si depassement 2 ans de suite
- Au-dessus du seuil majore : franchise perdue immediatement, TVA applicable des le 1er jour du mois de depassement

Important : la franchise signifie que l'entreprise ne facture PAS de TVA mais ne peut PAS deduire la TVA sur ses achats.

Reference : Article 293 B du CGI.`
  },

  {
    category: 'tva',
    title: 'Regimes de TVA (reel normal et simplifie)',
    content: `Regime reel normal de TVA :
- Obligatoire au-dessus de 840 000 EUR CA (ventes) ou 254 000 EUR CA (services)
- Declaration mensuelle CA3 (ou trimestrielle si TVA annuelle < 4 000 EUR)
- TVA due = TVA collectee - TVA deductible

Regime reel simplifie :
- CA entre les seuils franchise et reel normal
- 2 acomptes semestriels (55% en juillet, 40% en decembre de la TVA N-1)
- Declaration annuelle CA12 (avant le 2eme jour ouvre suivant le 1er mai)
- Regularisation annuelle

TVA deductible - conditions :
- Facture conforme avec TVA mentionnee
- Bien/service utilise pour l'activite professionnelle
- TVA sur carburant : gasoil 100%, essence 80% (vehicules de tourisme)
- TVA sur vehicules de tourisme : non deductible (sauf pour les loueurs, taxis, auto-ecoles)

Reference : Articles 287 et 302 septies A du CGI.`
  },

  // ═══════════════════════════════════════════════
  // COTISATIONS SOCIALES
  // ═══════════════════════════════════════════════

  {
    category: 'cotisations_sociales',
    title: 'Cotisations auto-entrepreneur 2025',
    content: `Taux de cotisations sociales auto-entrepreneur 2025 :

Activites de vente de marchandises (BIC) : 12,3% du CA
Prestations de services commerciales (BIC) : 21,2% du CA
Prestations de services liberales (BNC - SSI) : 21,1% du CA
Activites liberales (BNC - CIPAV) : 21,2% du CA

Versement liberatoire de l'IR (option) :
- Vente de marchandises : 1% du CA
- Services BIC : 1,7% du CA
- Services BNC : 2,2% du CA
Condition : revenu fiscal de reference N-2 < 27 478 EUR (1 part)

Contribution a la formation professionnelle :
- Commerce : 0,1% du CA
- Services et liberaux : 0,2% du CA
- Artisanat : 0,3% du CA

ACRE (Aide aux Createurs et Repreneurs d'Entreprise) :
- Exoneration de 50% des cotisations la 1ere annee
- Conditions : ne pas avoir beneficie de l'ACRE dans les 3 dernieres annees

Reference : Articles L613-7 et D613-4 du Code de la securite sociale.`
  },

  {
    category: 'cotisations_sociales',
    title: 'Cotisations sociales TNS (SARL gerant majoritaire)',
    content: `Cotisations sociales du travailleur non salarie (TNS) - gerant majoritaire SARL/EURL a l'IS :

Base de calcul : remuneration nette + part des dividendes > 10% du capital social

Maladie-maternite :
- Sur revenus < 17 597 EUR : taux progressif de 0% a 4%
- Sur revenus entre 17 597 et 45 250 EUR : 4%
- Sur revenus > 45 250 EUR : 6,35% (+ 0,5% contribution supplementaire sans plafond)

Retraite de base (plafonnee au PASS = 46 368 EUR en 2025) :
- Tranche 1 : 17,75% jusqu'au PASS
- Tranche 2 : 0,60% sur la totalite

Retraite complementaire :
- Tranche 1 : 7% jusqu'a 42 946 EUR
- Tranche 2 : 8% de 42 946 a 185 472 EUR

Invalidite-deces : 1,3% dans la limite du PASS

Allocations familiales :
- Revenus < 47 455 EUR : 0%
- Revenus entre 47 455 et 60 580 EUR : taux progressif
- Revenus > 60 580 EUR : 3,10%

CSG-CRDS : 9,70% sur 98,25% du revenu (dont 6,8% deductible)

Estimation : pour une remuneration de 50 000 EUR net, les cotisations TNS representent environ 45% du net, soit ~22 500 EUR.

Reference : Code de la securite sociale, Livre 6.`
  },

  {
    category: 'cotisations_sociales',
    title: 'Cotisations sociales assimile salarie (SAS/SASU president)',
    content: `Cotisations sociales du president de SAS/SASU (assimile salarie) :

Le president est assimile salarie : il releve du regime general de la securite sociale.
Pas de cotisation chomage (sauf Assurance chomage des dirigeants, facultative).

Charges patronales (sur le salaire brut) :
- Maladie : 7% (+ 6% complementaire)
- Vieillesse plafonnee : 8,55%
- Vieillesse deplafonnee : 2,02%
- Allocations familiales : 3,45% a 5,25%
- Accidents du travail : variable (environ 1%)
- FNAL : 0,1% a 0,5%
- Retraite complementaire AGIRC-ARRCO : 6,01% T1, 8,64% T2
- CSA (contribution solidarite autonomie) : 0,3%
- Total patronal estime : ~40 a 45% du brut

Charges salariales (retenues sur le brut) :
- Maladie : 0% (sauf Alsace-Moselle 1,3%)
- Vieillesse plafonnee : 6,90%
- Vieillesse deplafonnee : 0,40%
- CSG : 9,20% (sur 98,25% du brut, dont 6,80% deductible)
- CRDS : 0,50% (sur 98,25% du brut)
- Retraite complementaire : 3,15% T1, 4,32% T2
- Total salarial estime : ~22 a 25% du brut

Cout total employeur : environ 1,80 a 1,85x le salaire net.
Exemple : pour un net de 3 000 EUR/mois → cout total ~5 400 a 5 550 EUR.

Les dividendes du president de SAS ne sont PAS soumis aux cotisations sociales (uniquement CSG/CRDS a 17,2% ou flat tax 30%).

Reference : Code de la securite sociale, Livre 2.`
  },

  {
    category: 'cotisations_sociales',
    title: 'Plafond Securite Sociale (PASS) 2025',
    content: `Plafond annuel de la securite sociale (PASS) 2025 : 46 368 EUR
Plafond mensuel : 3 864 EUR
Plafond journalier : 213 EUR
Plafond horaire : 29 EUR

Le PASS sert de reference pour :
- Le calcul des cotisations vieillesse plafonnees
- Les seuils d'assujettissement aux dividendes TNS (10% du capital + primes d'emission + comptes courants)
- Les plafonds de deduction PER (10% des revenus, plafonne a 8 PASS soit 37 094 EUR en 2025)
- Les seuils de certaines exonerations

Evolution recente :
- 2024 : 46 368 EUR (revalorisation de 5,4%)
- 2023 : 43 992 EUR
- 2022 : 41 136 EUR

Reference : Arrete ministeriel annuel fixant le plafond SS.`
  },

  // ═══════════════════════════════════════════════
  // SEUILS ET PLAFONDS
  // ═══════════════════════════════════════════════

  {
    category: 'seuils',
    title: 'Seuils micro-entreprise 2025',
    content: `Seuils du regime micro-entreprise (auto-entrepreneur) 2025 :

Vente de marchandises, fourniture de logement :
- Seuil micro-BIC : 188 700 EUR de CA HT annuel
- Au-dela : basculement obligatoire en regime reel

Prestations de services (BIC et BNC) :
- Seuil micro-BIC services : 77 700 EUR de CA HT annuel
- Seuil micro-BNC : 77 700 EUR de CA HT annuel
- Au-dela : basculement en regime reel

Abattements forfaitaires pour le calcul du revenu imposable :
- Ventes : abattement de 71% (imposition sur 29% du CA)
- Services BIC : abattement de 50% (imposition sur 50% du CA)
- BNC : abattement de 34% (imposition sur 66% du CA)
- Minimum d'abattement : 305 EUR

Attention : ces seuils sont differents des seuils de franchise TVA (36 800 / 91 900 EUR).
Un auto-entrepreneur peut depasser le seuil TVA tout en restant en micro (il facture alors la TVA).

Reference : Articles 50-0 et 102 ter du CGI.`
  },

  {
    category: 'seuils',
    title: 'Seuils obligations comptables',
    content: `Obligations comptables selon la taille de l'entreprise :

Micro-entreprise :
- Livre des recettes chronologique
- Registre des achats (si vente de marchandises)
- Pas de bilan ni compte de resultat

Regime reel simplifie (BIC) :
- Comptabilite simplifiee (constatation des creances/dettes en fin d'exercice)
- Bilan et compte de resultat simplifies
- CA < 840 000 EUR (ventes) ou < 254 000 EUR (services)

Regime reel normal (BIC) :
- Comptabilite complete (partie double, inventaire)
- Bilan, compte de resultat et annexe detailles
- CA > 840 000 EUR (ventes) ou > 254 000 EUR (services)

BNC - Declaration controlee :
- Tenue d'un livre-journal des recettes et depenses
- Registre des immobilisations et amortissements
- Declaration 2035

Seuils d'obligation de commissaire aux comptes :
- SA : toujours obligatoire
- SARL/SAS : si 2 des 3 seuils depasses : 4 000 000 EUR bilan, 8 000 000 EUR CA, 50 salaries

Reference : Articles 50-0, 96, L123-12 Code de commerce.`
  },

  // ═══════════════════════════════════════════════
  // STATUTS JURIDIQUES
  // ═══════════════════════════════════════════════

  {
    category: 'statuts_juridiques',
    title: 'Comparaison SASU vs EURL',
    content: `Comparaison SASU et EURL - les deux formes les plus utilisees pour un entrepreneur seul :

SASU (Societe par Actions Simplifiee Unipersonnelle) :
- Dirigeant : President (assimile salarie)
- Cotisations sociales : ~80% du net (charges patronales + salariales)
- Dividendes : flat tax 30% (ou bareme IR + 17,2% PS), PAS de cotisations sociales
- Protection sociale : regime general (meilleure couverture retraite)
- Pas de remuneration = pas de cotisations = pas de protection
- Formalisme : statuts souples, pas de minimum de capital

EURL (Entreprise Unipersonnelle a Responsabilite Limitee) :
- Dirigeant : Gerant (TNS si associe unique = gerant majoritaire)
- Cotisations sociales : ~45% du net (moins cher que la SASU)
- Dividendes : soumis aux cotisations sociales pour la part > 10% du capital + primes + CCA
- Protection sociale : SSI (ex-RSI), couverture retraite inferieure
- Cotisations minimales meme sans remuneration (~1 200 EUR/an)
- Option IR possible les 5 premieres annees

Conseil general :
- Faible remuneration + gros dividendes → SASU avantageuse
- Remuneration elevee + peu de dividendes → EURL moins chere en cotisations
- Protection sociale maximale → SASU
- Cout global minimal → EURL

Reference : Code de commerce, articles L227-1 et suivants (SAS), L223-1 et suivants (SARL).`
  },

  {
    category: 'statuts_juridiques',
    title: 'SCI (Societe Civile Immobiliere)',
    content: `SCI - Societe Civile Immobiliere :

Objet : detenir et gerer un ou plusieurs biens immobiliers.
Associes : minimum 2 (personnes physiques ou morales).
Capital : libre (pas de minimum).

Fiscalite par defaut : transparence fiscale (IR)
- Chaque associe declare sa quote-part de revenus fonciers dans sa declaration personnelle
- Plus-values : regime des plus-values des particuliers (abattement par duree de detention)
  - Exoneration IR apres 22 ans
  - Exoneration PS apres 30 ans
- Pas d'amortissement du bien

Option IS (irrevocable) :
- La SCI est imposee a l'IS (15% puis 25%)
- Le bien est amortissable (deduction comptable)
- Les dividendes distribues sont imposes chez les associes (flat tax 30%)
- Plus-values : regime des plus-values professionnelles (pas d'abattement pour duree)
  - La plus-value est calculee sur la valeur nette comptable (apres amortissements)
  - Resultat : impot plus eleve a la revente

Interets de la SCI :
- Transmission facilitee (donation de parts avec decote 10-15%)
- Separation du patrimoine
- Gestion collective d'un bien familial

Reference : Articles 8 et 238 bis K du CGI, article 1845 du Code civil.`
  },

  {
    category: 'statuts_juridiques',
    title: 'Micro-entreprise vs EI au reel',
    content: `Comparaison micro-entreprise et entreprise individuelle au regime reel :

Micro-entreprise :
- Comptabilite ultra-simplifiee (livre de recettes)
- Cotisations calculees sur le CA (pas de charges deductibles)
- Impot calcule apres abattement forfaitaire (71%, 50% ou 34%)
- Pas de TVA si CA < seuils franchise
- Plafonds CA : 188 700 EUR (ventes) / 77 700 EUR (services)
- Pas de deduction des charges reelles

Entreprise individuelle au reel :
- Comptabilite complete (ou simplifiee en reel simplifie)
- Cotisations calculees sur le benefice reel (CA - charges)
- Impot sur le benefice reel (apres deduction de toutes les charges)
- TVA obligatoire (deductible sur les achats)
- Pas de plafond de CA
- Charges deductibles : loyer, materiel, deplacement, assurance, telephone, etc.

Quand passer au reel :
- Charges reelles > abattement forfaitaire (en general quand charges > 34-50% du CA)
- CA approchant les plafonds micro
- Besoin de deduire des investissements (amortissements)
- Clients professionnels qui veulent recuperer la TVA

Depuis 2022 : le statut unique d'Entrepreneur Individuel (EI) remplace l'EIRL. Le patrimoine professionnel est automatiquement separe.

Reference : Articles 50-0, 102 ter du CGI, Loi 2022-172 du 14 fevrier 2022.`
  },

  // ═══════════════════════════════════════════════
  // OPTIMISATION FISCALE
  // ═══════════════════════════════════════════════

  {
    category: 'optimisation',
    title: 'Plan Epargne Retraite (PER) - avantage fiscal',
    content: `Plan d'Epargne Retraite (PER) - deduction fiscale :

Les versements volontaires sur un PER sont deductibles du revenu global imposable.

Plafonds de deduction 2025 :
- Salaries : 10% des revenus nets d'activite, plafonne a 10% de 8 PASS = 37 094 EUR
- Minimum : 10% du PASS = 4 637 EUR (meme sans revenu)
- TNS : 10% du benefice + 15% du benefice entre 1 et 8 PASS (Madelin)
- Possibilite de reporter les plafonds non utilises des 3 annees precedentes
- Mutualisation entre conjoints possible

Sortie :
- En capital : imposable a l'IR (base) + PFU sur les gains (ou bareme)
- En rente viagere : imposable a l'IR apres abattement (selon l'age)
- Cas de deblocage anticipe : achat residence principale, accident de la vie

Economie d'impot : un contribuable au TMI 30% qui verse 10 000 EUR sur son PER economise 3 000 EUR d'impot.

Attention : la deduction a l'entree implique une imposition a la sortie. Avantageux si le TMI a la retraite est inferieur au TMI actuel.

Reference : Articles 154 bis et 163 quatervicies du CGI, Loi PACTE 2019.`
  },

  {
    category: 'optimisation',
    title: 'Remuneration vs dividendes - arbitrage dirigeant',
    content: `Optimisation remuneration/dividendes du dirigeant de societe a l'IS :

La remuneration est :
- Deductible du resultat de la societe (reduit l'IS)
- Imposable a l'IR + cotisations sociales pour le dirigeant

Les dividendes sont :
- Non deductibles du resultat (payes apres IS)
- Imposes a la flat tax 30% (12,8% IR + 17,2% PS) ou au bareme IR

Pour un gerant majoritaire EURL/SARL (TNS) :
- Dividendes > 10% du capital : soumis aux cotisations sociales (comme de la remuneration)
- Donc peu d'interet a se verser des dividendes si capital faible

Pour un president SAS/SASU :
- Dividendes non soumis aux cotisations sociales
- Strategie : se verser une remuneration juste suffisante pour la protection sociale, et le reste en dividendes
- Mais : pas de remuneration = pas de cotisation retraite = pas de trimestres

Exemple chiffre (SASU, benefice avant remuneration : 100 000 EUR) :
- Tout en remuneration : ~3 200 EUR net/mois apres charges + IR
- Remuneration 30 000 EUR + dividendes : president recoit ~4 000 EUR net/mois equivalent
- Tout en dividendes : 100 000 x 75% (apres IS 25%) x 70% (apres flat tax) = 52 500 EUR net

Reference : Articles 39-1, 62, 158 et 200 A du CGI.`
  },

  {
    category: 'optimisation',
    title: 'Reductions et credits d impot principaux',
    content: `Principales reductions et credits d'impot pour les particuliers (2025) :

REDUCTIONS D'IMPOT (diminuent l'impot, pas de remboursement si > impot) :
- Dons aux associations : 66% du montant, plafond 20% du revenu imposable
  - 75% pour aide aux personnes en difficulte (plafond 1 000 EUR)
- Investissement Pinel : 9% a 14% du montant investi (selon duree 6/9/12 ans) - fin progressive
- FCPI/FIP : 18% du montant investi (25% pour FIP Corse/Outre-mer)
- Sofica (cinema) : 30% a 36% du montant
- Investissement forestier (DEFI Foret) : 18% a 25%

CREDITS D'IMPOT (rembourses si > impot) :
- Emploi a domicile : 50% des depenses, plafond 12 000 EUR + 1 500 EUR/enfant (max 15 000 EUR)
  - Premiere annee : plafond 15 000 EUR + 1 500 EUR/enfant (max 18 000 EUR)
- Frais de garde d'enfant (< 6 ans) : 50%, plafond 3 500 EUR par enfant
- Transition energetique (MaPrimeRenov') : remplace le CITE
- Investissement en Corse : 20% des investissements productifs

Plafonnement global des niches fiscales : 10 000 EUR/an (18 000 EUR pour Sofica, Outre-mer, Girardin)

Reference : Articles 199 ter et suivants du CGI.`
  },

  {
    category: 'optimisation',
    title: 'Deficits fonciers',
    content: `Regime des deficits fonciers (art. 156 I 3° CGI) :

Quand les charges deductibles des revenus fonciers depassent les loyers percus, il y a deficit foncier.

Regles d'imputation :
- Deficit lie aux charges financieres (interets d'emprunt) : imputable uniquement sur les revenus fonciers des 10 annees suivantes
- Deficit lie aux autres charges (travaux, assurance, taxe fonciere) : imputable sur le revenu global dans la limite de 10 700 EUR/an
- Le surplus est reportable sur les revenus fonciers des 10 annees suivantes

Charges deductibles des revenus fonciers :
- Interets d'emprunt et frais d'acquisition du pret
- Travaux d'entretien, reparation et amelioration (PAS les travaux de construction/agrandissement)
- Taxe fonciere (hors ordures menageres)
- Frais de gestion : 20 EUR par local, frais de gerance, assurance
- Provisions pour charges de copropriete

Condition : le bien doit etre loue jusqu'au 31 decembre de la 3eme annee suivant l'imputation sur le revenu global.

Mesure temporaire 2023-2025 : le plafond est double a 21 400 EUR pour les travaux de renovation energetique.

Reference : Article 156 I 3° du CGI, BOFiP BOI-RFPI-BASE-30.`
  },

  // ═══════════════════════════════════════════════
  // DECLARATIONS
  // ═══════════════════════════════════════════════

  {
    category: 'declarations',
    title: 'Calendrier fiscal 2025 - principales echeances',
    content: `Calendrier fiscal 2025 - echeances principales :

JANVIER :
- 15 jan : Acompte IS 4eme trimestre (si exercice = annee civile)
- 15 jan : CFE (2eme moitie si non-mensualisee)

FEVRIER :
- Debut fev : Ouverture du service de declaration en ligne des revenus

MARS :
- 15 mar : Acompte IS 1er trimestre
- 31 mar : Date limite de depot de la CA12 (TVA simplifiee, exercice = annee civile)

AVRIL-JUIN :
- Mi-avril a debut juin : Declaration des revenus (dates variables selon departement)
  - Zone 1 (dept 01-19) : vers le 22 mai
  - Zone 2 (dept 20-54) : vers le 29 mai
  - Zone 3 (dept 55-976) : vers le 5 juin

MAI :
- 2eme jour ouvre apres le 1er mai : Depot liasse fiscale IS (si exercice = annee civile)
- 3 mai : Depot declaration 2065 (IS)

JUIN :
- 15 juin : Acompte IS 2eme trimestre

JUILLET :
- Acompte TVA simplifiee (55% de la TVA N-1)

SEPTEMBRE :
- 15 sept : Acompte IS 3eme trimestre

OCTOBRE-NOVEMBRE :
- Avis d'imposition IR
- 15 oct : CFE (si non-mensualisee, avis en octobre)

DECEMBRE :
- 15 dec : CFE (solde)
- Acompte TVA simplifiee (40% de la TVA N-1)
- 15 dec : Acompte IS 4eme trimestre

Reference : CGI, BOFiP, calendrier DGFiP.`
  },

  {
    category: 'declarations',
    title: 'Declaration 2042 et annexes',
    content: `Declaration de revenus 2042 - structure et annexes :

2042 (declaration principale) :
- Etat civil, situation familiale, nombre de parts
- Traitements et salaires (case 1AJ/1BJ)
- Pensions de retraite (1AS/1BS)
- Revenus de capitaux mobiliers
- Plus-values mobilieres

2042 C (complementaire) :
- Revenus des professions non salariees (BIC, BNC, BA)
- Plus-values professionnelles
- Revenus de l'etranger

2042 C PRO :
- Detail des BIC et BNC micro ou reel
- Auto-entrepreneurs : CA par nature d'activite

2042 RICI (reductions et credits d'impot) :
- Dons, emploi a domicile, frais de garde
- Investissements locatifs (Pinel, Denormandie)
- PER, FCPI/FIP

2044 (revenus fonciers) :
- Revenus fonciers au regime reel
- Detail par bien : loyers, charges, travaux
- Calcul du deficit foncier

2074 (plus-values mobilieres) :
- Detail des cessions de valeurs mobilieres
- Calcul des plus/moins-values

Declaration en ligne obligatoire sauf si le domicile n'a pas d'acces internet.

Reference : Articles 170 et suivants du CGI.`
  },

  // ═══════════════════════════════════════════════
  // CONTROLE FISCAL
  // ═══════════════════════════════════════════════

  {
    category: 'controle_fiscal',
    title: 'Types de controle fiscal et droits du contribuable',
    content: `Types de controle fiscal :

1. Controle sur pieces :
- L'administration verifie la declaration depuis ses bureaux
- Peut envoyer une demande de renseignements ou de justificatifs
- Le plus frequent, souvent pour des incoherences mineures

2. Examen de situation fiscale personnelle (ESFP) :
- Controle de la coherence entre revenus declares et train de vie
- Dure au maximum 1 an (sauf complexite)
- L'administration peut utiliser des indices de train de vie (art. 168 CGI)

3. Verification de comptabilite :
- Controle des ecritures comptables d'une entreprise
- Se deroule dans les locaux de l'entreprise (ou chez le comptable)
- Duree maximale : 3 mois pour les petites entreprises (CA < 840 000 ventes / 254 000 services)
- Droit a un debat oral et contradictoire

Droits du contribuable :
- Etre informe avant le controle (avis de verification)
- Se faire assister d'un conseil (avocat, expert-comptable)
- Debat oral et contradictoire pendant la verification
- Notification des rehaussements motives (proposition de rectification)
- 30 jours pour repondre (60 jours sur demande motivee)
- Recours : saisine du superieur hierarchique, commission departementale, mediateur, tribunal administratif

Delais de prescription :
- Droit commun : 3 ans (l'administration peut verifier N-1, N-2, N-3)
- Activite occulte : 6 ans
- Fraude fiscale : 10 ans
- Droits d'enregistrement : 6 ans

Penalites :
- Interets de retard : 0,2% par mois (2,4% par an)
- Majoration 10% : retard de declaration
- Majoration 40% : manquement delibere
- Majoration 80% : manoeuvres frauduleuses, abus de droit

Reference : Livre des procedures fiscales (LPF), articles L10 et suivants.`
  },

  // ═══════════════════════════════════════════════
  // ARTICLES CGI IMPORTANTS
  // ═══════════════════════════════════════════════

  {
    category: 'cgi_articles',
    title: 'Article 39 CGI - Charges deductibles des entreprises',
    content: `Article 39 du CGI - Charges deductibles du benefice industriel et commercial (BIC) :

Le benefice net est determine en deduisant des produits les charges suivantes :

1° Frais generaux : depenses engagees dans l'interet de l'exploitation
   - Loyers, assurances, fournitures, publicite, sous-traitance
   - Remunerations (si elles correspondent a un travail effectif et ne sont pas excessives)
   - Cotisations sociales obligatoires

2° Amortissements : depreciation des immobilisations
   - Lineaire (defaut) ou degressif (pour certains biens)
   - Durees d'usage : materiel informatique 3 ans, mobilier 10 ans, vehicule 4-5 ans, immeubles 20-50 ans
   - Vehicules de tourisme : plafond d'amortissement 18 300 EUR (9 900 EUR si CO2 > 160g/km, 30 000 EUR si electrique)

3° Provisions : charges probables et nettement precisees
   - Provision pour creances douteuses
   - Provision pour garantie
   - Provision pour conges payes

Charges non deductibles :
- Amendes et penalites
- Impot sur les societes
- Depenses somptuaires (chasse, peche, yachts, residences de plaisance - sauf si liees a l'exploitation)
- Cadeaux > 3 000 EUR/an/beneficiaire (a declarer sur releve 2067)

Reference : Article 39 du CGI et BOFiP BOI-BIC-CHG.`
  },

  {
    category: 'cgi_articles',
    title: 'Flat tax (PFU) - Article 200 A du CGI',
    content: `Prelevement Forfaitaire Unique (PFU / Flat tax) - art. 200 A CGI :

Taux global : 30% = 12,8% IR + 17,2% prelevements sociaux

S'applique aux :
- Dividendes
- Interets
- Plus-values de cession de valeurs mobilieres
- Assurance-vie (pour les primes versees apres le 27/09/2017, au-dela de 150 000 EUR)
- Crypto-monnaies (plus-values > 305 EUR/an)

Option pour le bareme progressif (art. 200 A 2 CGI) :
- Option globale (s'applique a tous les revenus du capital)
- Avantageuse si TMI < 12,8% (soit TMI a 0% ou 11%)
- En cas d'option : abattement de 40% sur les dividendes (art. 158-3 2° CGI)
- Pas d'abattement de 40% en flat tax

Prelevements sociaux (17,2%) :
- CSG : 9,2% (dont 6,8% deductible si option bareme)
- CRDS : 0,5%
- Prelevement de solidarite : 7,5%

Plus-values mobilieres :
- Flat tax 30% par defaut
- Option bareme : abattement pour duree de detention (pour titres acquis avant 2018) : 50% entre 2-8 ans, 65% au-dela de 8 ans

Reference : Article 200 A du CGI, loi de finances 2018.`
  },

  {
    category: 'cgi_articles',
    title: 'Plus-values immobilieres des particuliers',
    content: `Plus-values immobilieres des particuliers (art. 150 U et suivants CGI) :

Calcul de la plus-value :
- Plus-value brute = Prix de cession - Prix d'acquisition
- Prix d'acquisition majore de : frais d'acquisition forfaitaires (7,5%) ou reels, travaux forfaitaires (15% si detention > 5 ans) ou reels

Exoneration totale :
- Residence principale : toujours exoneree
- Premiere cession d'un logement autre que RP (sous conditions : pas ete proprietaire de sa RP les 4 dernieres annees, remploi dans l'achat d'une RP dans les 24 mois)
- Prix de cession < 15 000 EUR
- Detention > 22 ans (IR) / > 30 ans (PS)

Abattement pour duree de detention (IR - 19%) :
- 6% par an de la 6eme a la 21eme annee
- 4% la 22eme annee
- Exoneration totale IR apres 22 ans

Abattement pour duree de detention (PS - 17,2%) :
- 1,65% par an de la 6eme a la 21eme annee
- 1,60% la 22eme annee
- 9% par an de la 23eme a la 30eme annee
- Exoneration totale PS apres 30 ans

Imposition :
- IR : 19% sur la plus-value nette
- Prelevements sociaux : 17,2% sur la plus-value nette
- Surtaxe si PV nette > 50 000 EUR : de 2% a 6% (art. 1609 nonies G CGI)

Le notaire preleve l'impot et le verse directement au Tresor.

Reference : Articles 150 U a 150 VH du CGI.`
  },

  // ═══════════════════════════════════════════════
  // CFE / CVAE / CET
  // ═══════════════════════════════════════════════

  {
    category: 'cfe_cvae',
    title: 'CFE et CVAE - Contribution Economique Territoriale',
    content: `Contribution Economique Territoriale (CET) = CFE + CVAE

CFE (Cotisation Fonciere des Entreprises) :
- Base : valeur locative des biens immobiliers utilises par l'entreprise
- Taux : fixe par la commune/intercommunalite (variable, 15-30% en moyenne)
- Cotisation minimale si faible valeur locative (entre 237 et 7 046 EUR selon CA)
  - CA < 10 000 EUR : minimum entre 237 et 565 EUR
  - CA entre 10 001 et 32 600 EUR : minimum entre 237 et 1 130 EUR
  - CA entre 32 601 et 100 000 EUR : minimum entre 237 et 2 374 EUR
  - CA > 100 000 EUR : minimum entre 237 et 7 046 EUR (fixe par la commune)
- Exoneration la 1ere annee de creation
- Exoneration permanente : auto-entrepreneurs CA < 5 000 EUR

CVAE (Cotisation sur la Valeur Ajoutee des Entreprises) :
- Supprimee a partir de 2024 pour les entreprises avec CA < 500 000 EUR
- Pour les entreprises avec CA > 500 000 EUR : taux de 0,28% en 2025 (suppression progressive)
- Base : valeur ajoutee produite par l'entreprise

Plafonnement de la CET :
- La CET (CFE + CVAE) est plafonnee a 1,531% de la valeur ajoutee
- Demande de degrevement possible si depassement

Reference : Articles 1447-0, 1586 ter et suivants du CGI.`
  },

  // ═══════════════════════════════════════════════
  // TRANSMISSION / SUCCESSION
  // ═══════════════════════════════════════════════

  {
    category: 'transmission',
    title: 'Droits de succession et donation - baremes 2025',
    content: `Droits de mutation a titre gratuit (successions et donations) :

Abattements (renouveles tous les 15 ans pour les donations) :
- En ligne directe (parent/enfant) : 100 000 EUR par parent par enfant
- Entre epoux/partenaires PACS : 80 724 EUR
- Entre freres et soeurs : 15 932 EUR
- Neveux/nieces : 7 967 EUR
- Abattement general (tout beneficiaire) : 1 594 EUR
- Handicapes : abattement supplementaire de 159 325 EUR

Bareme en ligne directe (parent → enfant) :
- Jusqu'a 8 072 EUR : 5%
- De 8 073 a 12 109 EUR : 10%
- De 12 110 a 15 932 EUR : 15%
- De 15 933 a 552 324 EUR : 20%
- De 552 325 a 902 838 EUR : 30%
- De 902 839 a 1 805 677 EUR : 40%
- Au-dela de 1 805 677 EUR : 45%

Entre epoux/partenaires PACS : exoneration totale en succession (loi TEPA 2007)
En donation : meme bareme que ligne directe

Entre freres et soeurs :
- Jusqu'a 24 430 EUR : 35%
- Au-dela : 45%
- Exoneration en succession sous conditions (> 50 ans ou infirme, domicile commun 5 ans)

Assurance-vie :
- Primes versees avant 70 ans : abattement 152 500 EUR par beneficiaire, puis 20% jusqu'a 700 000 EUR, 31,25% au-dela
- Primes versees apres 70 ans : abattement global 30 500 EUR, puis droits de succession classiques (interets exoneres)

Pacte Dutreil (transmission d'entreprise) :
- Exoneration de 75% de la valeur des titres transmis
- Conditions : engagement de conservation des titres (2 ans collectif + 4 ans individuel), exercice de fonctions de direction

Reference : Articles 777 et suivants du CGI.`
  },

  // ═══════════════════════════════════════════════
  // CRYPTO / ACTIFS NUMERIQUES
  // ═══════════════════════════════════════════════

  {
    category: 'crypto',
    title: 'Fiscalite des crypto-monnaies en France',
    content: `Regime fiscal des actifs numeriques (crypto-monnaies) en France :

Particuliers (cessions occasionnelles) :
- Flat tax 30% (12,8% IR + 17,2% PS) sur les plus-values
- Option bareme progressif possible (depuis 2023)
- Exoneration si total des cessions < 305 EUR/an
- Base : prix de cession - (prix total d'acquisition x fraction cedee)
- Les echanges crypto-crypto sont des cessions imposables
- Les echanges crypto-stablecoin sont des cessions imposables
- Les echanges contre des biens/services sont des cessions imposables
- Declaration obligatoire des comptes detenus sur des plateformes etrangeres (formulaire 3916-bis)

Professionnels (activite habituelle - trading, mining) :
- BIC ou BNC selon l'activite
- Cotisations sociales applicables
- Criteres de l'activite habituelle : frequence, montants, moyens techniques, intention speculative

Miners :
- Si occasionnel : BNC
- Si professionnel : BIC
- TVA : exonere pour le minage

NFT :
- Assimiles aux actifs numeriques si fongibles
- Si NFT d'art : regime des oeuvres d'art possible (6,5% + 17,2% PS ou bareme PV)

Declaration : cases 3AN/3BN de la 2042 C, formulaire 2086 pour le detail des cessions

Amende pour non-declaration de compte : 750 EUR par compte non declare (1 500 EUR si valeur > 50 000 EUR)

Reference : Article 150 VH bis du CGI, BOFiP BOI-RPPM-PVBMC-30-10.`
  },

  // ═══════════════════════════════════════════════
  // IMMOBILIER LOCATIF
  // ═══════════════════════════════════════════════

  {
    category: 'immobilier',
    title: 'LMNP - Location Meublee Non Professionnelle',
    content: `Location Meublee Non Professionnelle (LMNP) :

Conditions du statut LMNP :
- Recettes locatives < 23 000 EUR/an ET < revenus professionnels du foyer
- Si depassement : passage en LMP (Location Meublee Professionnelle)

Regime micro-BIC :
- Si recettes < 77 700 EUR (meuble classique) ou < 188 700 EUR (meuble de tourisme classe)
- Abattement : 50% (classique) ou 71% (tourisme classe)
- Nouveau depuis 2024 : meuble de tourisme non classe = 30% d'abattement, plafond 15 000 EUR

Regime reel (recommande si charges elevees) :
- Deduction de toutes les charges reelles
- Amortissement du bien (hors terrain, ~80-85% de la valeur, sur 25-30 ans)
- Amortissement du mobilier (5-10 ans)
- Resultat souvent nul ou deficitaire grace aux amortissements
- Deficit imputable uniquement sur les revenus BIC de location meublee (pas sur le revenu global)
- Report possible pendant 10 ans

Avantages du LMNP au reel :
- Pas d'impot sur les loyers pendant de nombreuses annees (grace a l'amortissement)
- A la revente : plus-value des particuliers (pas de reprise des amortissements, contrairement au LMP)
- Abattement pour duree de detention applicable

Obligations :
- Inscription au greffe du tribunal de commerce (numero SIRET)
- Declaration P0i dans les 15 jours du debut d'activite
- Comptabilite : livre-journal, registre des immobilisations
- CFE due (sauf exoneration commune)
- Declaration 2031 + 2033 (liasse simplifiee)

Reference : Articles 35 bis et 50-0 du CGI, BOFiP BOI-BIC-CHAMP-40-10.`
  },

  {
    category: 'immobilier',
    title: 'Dispositif Pinel - reduction d impot investissement locatif',
    content: `Dispositif Pinel - reduction d'impot pour investissement locatif neuf :

Fin progressive :
- Pinel classique : taux reduits en 2024 (9%/12%/14%), fin au 31/12/2024
- Pinel+ (quartiers prioritaires ou logements exemplaires) : taux pleins maintenus jusqu'a fin 2024
- Pas de nouveau Pinel depuis le 1er janvier 2025

Taux de reduction (Pinel+ / taux pleins historiques) :
- Engagement 6 ans : 12% du prix d'acquisition
- Engagement 9 ans : 18% du prix d'acquisition
- Engagement 12 ans : 21% du prix d'acquisition

Plafonds :
- Investissement : 300 000 EUR par an, 5 500 EUR/m2
- 2 logements maximum par an

Conditions :
- Logement neuf ou VEFA
- Respect des plafonds de loyer (par zone : A bis, A, B1, B2)
- Respect des plafonds de ressources du locataire
- Location nue a usage de residence principale
- Pas de location a un ascendant/descendant (possible depuis 2015 sous conditions)

Reference : Article 199 novovicies du CGI.`
  },

  // ═══════════════════════════════════════════════
  // TVA INTRACOMMUNAUTAIRE
  // ═══════════════════════════════════════════════

  {
    category: 'tva',
    title: 'TVA intracommunautaire et echanges internationaux',
    content: `TVA sur les echanges intracommunautaires et internationaux :

Acquisitions intracommunautaires (achat a un fournisseur UE) :
- Autoliquidation : l'acheteur francais declare et deduit la TVA simultanement
- Pas de TVA payee au fournisseur etranger (celui-ci facture HT)
- Declaration sur CA3 lignes 03 et 08

Livraisons intracommunautaires (vente a un client UE pro) :
- Exoneration de TVA si le client a un numero de TVA intracommunautaire valide
- Mention obligatoire sur la facture : "Exoneration de TVA - art. 262 ter I du CGI"
- Declaration DEB/DES obligatoire si > 460 000 EUR

Vente a distance B2C (particuliers UE) :
- Seuil unique : 10 000 EUR de CA pour l'ensemble de l'UE
- Au-dela : TVA du pays du client (guichet unique OSS)
- En dessous : TVA francaise applicable

Importations (pays hors UE) :
- TVA due a l'importation (autoliquidation possible depuis 2022 sur CA3)
- Droits de douane eventuels

Exportations (ventes hors UE) :
- Exoneration de TVA (art. 262 I CGI)
- Justificatifs : DAU (Document Administratif Unique) vise par la douane

Numero de TVA intracommunautaire :
- Format France : FR + 2 caracteres (cle) + 9 chiffres SIREN
- Obligatoire pour les echanges B2B intracommunautaires
- Verification : service VIES de la Commission europeenne

Reference : Articles 256 bis, 262 ter et 283-2 du CGI.`
  }
];

module.exports = fiscalKnowledgeData;
