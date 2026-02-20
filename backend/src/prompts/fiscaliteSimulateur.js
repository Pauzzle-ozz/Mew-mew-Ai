/**
 * Prompt pour le simulateur de strategie juridique et fiscale
 * Compare les regimes, simule les changements de statut, optimise la remuneration
 */

function buildSimulateurPrompt(data) {
  const { situation_actuelle, objectifs, projections, documentText } = data;
  const sit = situation_actuelle || {};

  let documentSection = '';
  if (documentText) {
    documentSection = `

DOCUMENTS COMPTABLES FOURNIS :
${documentText.substring(0, 15000)}
${documentText.length > 15000 ? '\n[... document tronque]' : ''}`;
  }

  return `Tu es un expert-comptable et conseiller en strategie fiscale avec 20 ans d'experience. Tu accompagnes les PME et independants dans leurs choix de structure juridique et fiscale.

SITUATION ACTUELLE :
- Statut juridique : ${sit.statut || 'Non precise'}
- Chiffre d'affaires annuel : ${sit.ca ? sit.ca + ' EUR' : 'Non precise'}
- Charges annuelles : ${sit.charges ? sit.charges + ' EUR' : 'Non precise'}
- Remuneration du dirigeant : ${sit.remuneration_dirigeant ? sit.remuneration_dirigeant + ' EUR/an' : 'Non precise'}
- Nombre de salaries : ${sit.nombre_salaries !== undefined ? sit.nombre_salaries : 'Non precise'}
- Secteur : ${sit.secteur || 'Non precise'}

OBJECTIFS DU CLIENT :
${objectifs && objectifs.length > 0 ? objectifs.map(o => `- ${o}`).join('\n') : '- Non precises'}

PROJECTIONS DE CROISSANCE :
- CA cible a 3 ans : ${projections?.ca_cible_3ans ? projections.ca_cible_3ans + ' EUR' : 'Non precise'}
- CA cible a 5 ans : ${projections?.ca_cible_5ans ? projections.ca_cible_5ans + ' EUR' : 'Non precise'}
- Embauches prevues : ${projections?.embauches_prevues || 'Non precise'}${documentSection}

MISSION : Realise une simulation COMPLETE de strategie juridique et fiscale.

1. ANALYSE DE LA SITUATION ACTUELLE :
   - Calcul detaille de la charge fiscale totale actuelle
   - Taux effectif d'imposition global (IS/IR + cotisations + TVA nette)
   - Points forts et faiblesses du statut actuel

2. COMPARAISON DES REGIMES FISCAUX :
   Compare TOUS les statuts pertinents parmi :
   - Micro-entreprise (si CA < seuils)
   - EI au reel (IR)
   - EURL a l'IS
   - EURL a l'IR
   - SASU a l'IS
   - SARL a l'IS
   - SAS a l'IS

   Pour CHAQUE statut, calcule :
   - Impot sur les societes (si IS) avec taux reduit 15% (0-42 500 EUR) et normal 25%
   - Cotisations sociales (TNS ~45% vs assimile salarie ~65-82%)
   - IR du dirigeant (salaire + dividendes)
   - Charge fiscale TOTALE (IS + cotisations + IR)
   - Economie vs situation actuelle

3. OPTIMISATION DE LA REMUNERATION DU DIRIGEANT :
   Pour le statut recommande, calcule le mix optimal :
   - Part salaire vs dividendes
   - Avantages en nature eventuels
   - PER (Plan Epargne Retraite) deductible
   - Cheques vacances, titres restaurant si salaries

4. PROJECTIONS SUR 3 ET 5 ANS :
   En fonction des objectifs de croissance :
   - Evolution de la charge fiscale
   - Seuils critiques a anticiper :
     * Franchise TVA (91 900 EUR vente / 36 800 EUR services)
     * Plafond micro (188 700 EUR / 77 700 EUR)
     * Seuil IS taux reduit (42 500 EUR de benefice)
     * Seuil CVAE si applicable
   - Moment optimal pour changer de statut

5. SEUILS CRITIQUES ET ALERTES :
   - Tous les seuils proches de la situation actuelle
   - Impact de chaque franchissement de seuil
   - Echeance estimee en fonction de la croissance

6. RECOMMANDATION FINALE :
   - Statut recommande avec justification
   - Plan d'action etape par etape
   - Cout de la transformation (si changement de statut)
   - Calendrier recommande

REFERENCES :
- Regime mere-fille : exoneration 95% des dividendes remontes
- Pacte Dutreil : exoneration 75% pour transmission
- CIR : 30% des depenses R&D (jusqu'a 100M EUR)
- JEI : exoneration d'IS partielle + exoneration cotisations
- Holding : avantages integration fiscale
- IS : 15% (0-42 500 EUR si CA < 10M EUR et capital libere), 25% au-dela
- Cotisations TNS : ~45% | Assimile salarie : ~65-82% du brut
- Flat tax dividendes : 30% (12.8% IR + 17.2% PS)

Fournis des CALCULS PRECIS et CHIFFRES pour chaque scenario.`;
}

module.exports = { buildSimulateurPrompt };
