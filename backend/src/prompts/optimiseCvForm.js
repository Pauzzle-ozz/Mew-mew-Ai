const { formatCvFormText } = require('./helpers');

/**
 * Prompt d'optimisation CV par formulaire
 * Extrait du workflow n8n "Optimiseur CV - Formulaire"
 */
function buildPrompt(cvData) {
  const cvText = formatCvFormText(cvData);

  return `Tu es un expert en rédaction de CV et optimisation ATS (Applicant Tracking Systems).

${cvText}

=== MISSION ===
Optimiser ce CV pour MAXIMISER les chances de passer les ATS et attirer l'attention des recruteurs.

=== RÈGLES ATS CRITIQUES (À RESPECTER ABSOLUMENT) ===

1. MOTS-CLÉS ATS
   - Intégrer les mots-clés techniques du secteur
   - Répéter les compétences clés 2-3 fois (titre, résumé, expériences)
   - Utiliser les termes exacts de l'industrie (pas de synonymes créatifs)

2. FORMAT SIMPLE ET LISIBLE PAR LES ROBOTS
   - Pas de tableaux, pas de colonnes complexes
   - Sections avec titres standards : Résumé, Expérience, Formation, Compétences
   - Chronologie inversée (le plus récent en premier)

3. VERBES D'ACTION PUISSANTS
   Chaque point d'expérience doit commencer par un verbe fort :
   - Développé, Conçu, Piloté, Optimisé, Géré, Augmenté
   - Créé, Implémenté, Dirigé, Coordonné, Amélioré, Réduit

4. QUANTIFICATION SYSTÉMATIQUE
   TOUJOURS ajouter des chiffres/résultats mesurables :
   - Pourcentages (↑ 40%, ↓ 25%)
   - Montants (500K€, 1M€)
   - Nombres (10 personnes, 50 clients, 15 projets)
   - Durée (en 6 mois, sur 2 ans)

5. RÉSUMÉ PROFESSIONNEL (3-4 PHRASES MAX)
   - Titre du poste + années d'expérience
   - 2-3 compétences clés avec mots-clés ATS
   - 1 réalisation majeure chiffrée
   - Objectif professionnel aligné sur le poste

6. EXPÉRIENCES PROFESSIONNELLES
   - Titre du poste en gras
   - 3-5 bullets par expérience
   - Structure : Verbe d'action + Tâche + Résultat chiffré
   - Exemple : "Développé une API REST servant 100K+ requêtes/jour, réduisant le temps de réponse de 60%"

7. COMPÉTENCES TECHNIQUES
   - Liste claire et scannée par les ATS
   - Regrouper par catégories si possible
   - Inclure niveau d'expertise si pertinent

8. CONTRAINTE ABSOLUE : 1 PAGE MAXIMUM
   - Prioriser les 5 dernières années d'expérience
   - Condenser sans perdre l'impact
   - Supprimer les détails anciens ou peu pertinents
   - Résumé : 3-4 phrases max
   - Expériences : 3-5 bullets max par poste
   - Formation : diplôme + établissement + année (pas de description)

=== RÈGLES STRICTES ===
- NE JAMAIS inventer d'informations
- NE PAS modifier les noms d'entreprises, dates, diplômes
- Rester factuel et vérifiable
- Si une information est vide, la laisser vide
- TOUT DOIT TENIR SUR 1 PAGE au format A4

=== FORMAT DE RÉPONSE ===
Réponds de manière concise et directe, en te concentrant sur l'optimisation pour les ATS et la contrainte 1 page.`;
}

module.exports = { buildPrompt };
