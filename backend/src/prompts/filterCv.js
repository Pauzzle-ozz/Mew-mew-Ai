/**
 * Prompt de filtrage CV — Étape 2
 * Reçoit un CV enrichi et le condense pour tenir sur 1 page A4
 * Peut cibler des sections spécifiques ou tout condenser
 */
function buildPrompt(cvData, sections) {
  const cvJSON = JSON.stringify(cvData, null, 2);
  const allSections = !sections || sections.length === 0;
  const has = (s) => allSections || sections.includes(s);

  const rules = [];
  if (has('resume'))
    rules.push('1. RÉSUMÉ : condenser à 2-3 phrases (50 mots max). Garder l\'accroche la plus percutante.');
  if (has('experiences'))
    rules.push(`2. EXPÉRIENCES :
   - Garder maximum 3 postes (les plus récents/pertinents)
   - Réduire à 2-3 bullets par poste (les plus impactants)
   - Chaque bullet : 15 mots max. Verbe + Action + Résultat chiffré
   - Supprimer les répétitions entre postes`);
  if (has('competences'))
    rules.push(`3. COMPÉTENCES TECHNIQUES :
   - Garder uniquement les compétences les plus pertinentes (10-15 max)
   - Supprimer les compétences trop génériques ou redondantes`);
  if (has('qualifications'))
    rules.push(`4. QUALIFICATIONS CLÉS :
   - Réduire à 6-8 qualifications (les plus percutantes)
   - Raccourcir les phrases si trop longues (10-15 mots max chacune)
   - Garder le format : phrases séparées par des retours à la ligne`);
  if (has('formations'))
    rules.push('5. FORMATIONS : diplôme + établissement + année UNIQUEMENT (pas de description)');

  const sectionNote = allSections
    ? 'FILTRER et CONDENSER TOUTES les sections du CV pour qu\'il tienne sur 1 PAGE A4.'
    : `FILTRER et CONDENSER UNIQUEMENT les sections suivantes : ${sections.join(', ')}. Les autres sections doivent rester INTACTES (recopier telles quelles).`;

  return `Tu es un éditeur professionnel de CV. Tu reçois un CV déjà enrichi et optimisé, mais qui contient trop d'informations.

=== CV À FILTRER ===
${cvJSON}

=== MISSION ===
${sectionNote}

=== RÈGLES DE FILTRAGE ===
${rules.join('\n\n')}

=== CE QU'IL FAUT SUPPRIMER (dans les sections ciblées) ===
- Informations redondantes (même compétence dite 3 fois)
- Détails peu pertinents ou trop anciens
- Expériences de plus de 10 ans (sauf si très pertinentes)
- Qualifications trop vagues ou génériques
- Descriptions trop longues

=== CE QU'IL FAUT GARDER ===
- Les chiffres et résultats mesurables
- Les compétences techniques spécifiques
- Les réalisations les plus impressionnantes
- Les qualifications les plus différenciantes

=== FORMAT DE RÉPONSE ===
Retourne UNIQUEMENT du JSON valide avec la MÊME structure que l'entrée.
Pas de texte avant/après. Pas de \`\`\`json.
Conserve TOUS les champs (prenom, nom, email, telephone, adresse, linkedin, titre_poste, resume, experiences, formations, competences_techniques, competences_soft, langues, interets).`;
}

module.exports = { buildPrompt };
