/**
 * Prompt d'optimisation CV par PDF
 */
function buildPrompt(cvText, numPages, posteCible) {
  const posteSection = posteCible
    ? `\n=== POSTE CIBLÉ ===\n${posteCible}\n\nOptimise le CV SPÉCIFIQUEMENT pour ce poste : utilise les mots-clés exacts, adapte le résumé, met en avant les expériences les plus pertinentes.\n`
    : '';
  return `Tu es un expert en rédaction de CV et optimisation ATS (Applicant Tracking Systems).

=== CV EXTRAIT D'UN PDF ===
${cvText}

Nombre de pages : ${numPages}
${posteSection}

=== MISSION ===
1. EXTRAIRE les informations du CV PDF
2. OPTIMISER le contenu pour MAXIMISER les chances de passer les ATS

=== RÈGLES ATS CRITIQUES (À RESPECTER ABSOLUMENT) ===

1. MOTS-CLÉS ATS
   - Intégrer les mots-clés techniques du secteur
   - Répéter les compétences clés 2-3 fois (titre, résumé, expériences)
   - Utiliser les termes exacts de l'industrie

2. FORMAT SIMPLE ET LISIBLE PAR LES ROBOTS
   - Pas de tableaux, pas de colonnes complexes
   - Sections standards : Résumé, Expérience, Formation, Compétences
   - Chronologie inversée (le plus récent en premier)

3. VERBES D'ACTION PUISSANTS
   Chaque point d'expérience doit commencer par :
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
   - Objectif professionnel

6. EXPÉRIENCES PROFESSIONNELLES
   - Titre du poste en gras
   - 3-5 bullets par expérience
   - Structure : Verbe d'action + Tâche + Résultat chiffré
   - Exemple : "Développé une API REST servant 100K+ requêtes/jour, réduisant le temps de réponse de 60%"

7. COMPÉTENCES TECHNIQUES
   - Liste claire et scannée par les ATS
   - Regrouper par catégories
   - Inclure niveau d'expertise

8. CONTRAINTE ABSOLUE : 1 PAGE MAXIMUM
   - Prioriser les 5 dernières années
   - Condenser sans perdre l'impact
   - Résumé : 3-4 phrases max
   - Expériences : 3-5 bullets max par poste
   - Formation : diplôme + établissement + année (sans description)
   - Supprimer les détails anciens

=== RÈGLES STRICTES ===
- EXTRAIRE toutes les informations disponibles dans le PDF
- NE JAMAIS inventer d'informations
- NE PAS modifier les noms d'entreprises, dates, diplômes
- Rester factuel et vérifiable
- TOUT DOIT TENIR SUR 1 PAGE au format A4

=== FORMAT DE RÉPONSE ===
Commence par :
SCORE ATS: [nombre entre 0 et 100 représentant le niveau d'optimisation ATS atteint]
POINTS FORTS: [liste de 3 à 5 points forts conservés ou améliorés, un par ligne avec "• "]
AMÉLIORATIONS: [liste de 3 à 5 changements clés effectués, un par ligne avec "• "]

Puis extrais et optimise le CV complet.`;
}

module.exports = { buildPrompt };
