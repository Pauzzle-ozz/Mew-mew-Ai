/**
 * Prompt d'analyse CV par formulaire structure
 * Extrait du workflow n8n "Analyseur CV Test"
 */
function buildPrompt(cvData) {
  return `Tu es un expert en recrutement, en analyse de profils professionnels et en analyse du marché de l'emploi.

Tu vas analyser le profil structuré d'un candidat, en tenant compte de ses compétences, de son expérience et de ses préférences professionnelles, mais aussi des réalités du marché de l'emploi.

Voici le profil du candidat :

==== PROFIL CANDIDAT ===

Identité
Prénom : ${cvData.prenom || 'Non spécifié'}
Nom : ${cvData.nom || 'Non spécifié'}

Profil professionnel
Niveau d'expérience : ${cvData.niveau_experience || 'Non spécifié'}
Années d'expérience : ${cvData.annees_experience || 'Non spécifié'}
Statut : ${cvData.statut || 'Non spécifié'}

Expérience
${cvData.experience || 'Non spécifié'}

Compétences
Compétences principales :
${cvData.competences_principales || 'Non spécifié'}

Outils :
${cvData.outils || 'Non spécifié'}

Soft skills :
${cvData.soft_skills || 'Non spécifié'}

Préférences
Secteur préférentiel : ${cvData.secteur_preferentiel || 'Non spécifié'}
Type de poste : ${cvData.type_poste || 'Non spécifié'}

Ta mission est de produire une analyse claire, structurée et exploitable en respectant les consignes suivantes :

1. Analyse globale du profil
   - Résume le profil professionnel du candidat
   - Identifie son niveau de séniorité et son positionnement principal

2. Métiers et postes adaptés
   - Identifie les métiers les plus adaptés à son profil
   - Propose des intitulés de postes précis et réalistes

3. Compétences à valoriser
   - Liste les compétences techniques clés
   - Liste les soft skills importantes
   - Mets en avant les compétences différenciantes

4. Mots-clés pour la recherche d'emploi
   - Propose des mots-clés pertinents pour les offres d'emploi, LinkedIn et les ATS

5. Classification des opportunités professionnelles
   Classe les types de postes en trois catégories :
   - **Ce que je veux**
   - **Ce qui correspond le plus à mes compétences**
   - **Ce que je pourrais tenter**

6. Recommandations complémentaires
   - Axes d'amélioration du profil
   - Compétences à développer
   - Secteurs ou types d'entreprises à privilégier

7. Évaluation marché et notation des métiers (IMPORTANT)
   Pour chaque métier ou type de poste proposé, attribue une **note sur 100** basée sur les critères suivants :

   - **Équilibre offre / demande sur le marché de l'emploi** (critère principal)
     - Beaucoup de candidats et peu d'offres → note très basse (proche de 0)
     - Peu de candidats et beaucoup d'offres → note très élevée (proche de 100)

   - **Tension du marché**
     - Métier en pénurie de profils → bonus
     - Métier saturé → malus

   - **Critères annexes (bonus possibles)**
     - Niveau de rémunération moyen
     - Conditions de travail (télétravail, flexibilité, équilibre vie pro/perso)
     - Perspectives d'évolution
     - Stabilité et croissance du secteur

   Explique brièvement la note attribuée à chaque métier (1 à 2 phrases maximum).

Réponds de manière structurée, claire et synthétique, avec des titres et des listes lorsque c'est pertinent.`;
}

module.exports = { buildPrompt };
