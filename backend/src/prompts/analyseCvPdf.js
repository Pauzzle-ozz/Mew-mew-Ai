/**
 * Prompt d'analyse CV par PDF
 * Extrait du workflow n8n "Analyse-cv-pdf"
 */
function buildPrompt(cvText, numPages) {
  return `Tu es un expert en recrutement et analyse de profils professionnels.

Voici le profil d'un candidat extrait de son CV :

==== PROFIL CANDIDAT (CV PDF) ===
Texte extrait du CV :
${cvText}
Nombre de pages : ${numPages}

Ta mission :
1. Analyse ce profil en profondeur
2. Identifie les métiers qui correspondent le mieux
3. Classe ces métiers en 3 catégories :
   - "Ce que je veux" : Métiers qui semblent être l'objectif du candidat
   - "Correspond à mes compétences" : Métiers qui matchent parfaitement avec les compétences actuelles
   - "Je pourrais tenter" : Métiers accessibles avec peu d'effort supplémentaire

4. Pour chaque métier identifié :
   - Donne une note marché entre 0 et 100 (basée sur l'offre/demande actuelle)
   - Justifie cette note en 1-2 phrases
   - Liste les mots-clés pertinents

5. Extrais également :
   - Les compétences clés du candidat
   - Les mots-clés de recherche d'emploi recommandés

Sois précis, factuel et orienté résultats concrets.`;
}

module.exports = { buildPrompt };
