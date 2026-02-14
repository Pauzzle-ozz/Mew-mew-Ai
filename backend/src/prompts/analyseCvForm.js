/**
 * Prompt d'analyse CV par formulaire structure
 */
function buildPrompt(cvData) {
  return `Tu es un expert senior en recrutement, en analyse de profils professionnels et en analyse du marché de l'emploi en France et en Europe.

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
   - Identifie entre 6 et 10 métiers adaptés au profil
   - Propose des intitulés de postes précis et réalistes

3. Compétences à valoriser
   - Liste les compétences techniques clés
   - Liste les soft skills importantes
   - Mets en avant les compétences différenciantes

4. Mots-clés pour la recherche d'emploi
   - Propose des mots-clés pertinents pour les offres d'emploi, LinkedIn et les ATS

5. Classification des opportunités (IMPORTANT - 2 catégories uniquement)
   Classe CHAQUE métier dans l'une de ces 2 catégories :
   - **Correspond a mes competences** : Métiers qui matchent directement avec les compétences et l'expérience actuelles du candidat. Le candidat peut postuler immédiatement avec son profil actuel.
   - **Je pourrais tenter** : Métiers accessibles avec un effort raisonnable (formation courte, montée en compétence, reconversion partielle). Le candidat a des bases mais doit progresser.

   ATTENTION : utilise EXACTEMENT ces noms de catégories, sans accents, sans majuscules différentes.

6. Recommandations et conseils par métier
   Pour chaque métier proposé, donne :
   - Ce que le candidat a déjà (compétences qui matchent)
   - Ce qui lui manque (compétences/certifications/formations à acquérir)
   - Un conseil actionnable en 1 phrase

7. Scoring multi-critères (TRES IMPORTANT)
   Pour chaque métier, attribue 3 notes distinctes sur 100 :

   a) **Score adéquation profil** (adequation_profil : 0-100)
      Évalue à quel point le profil du candidat correspond au métier :
      - Correspondance des compétences techniques (40%)
      - Correspondance de l'expérience et du niveau de séniorité (30%)
      - Correspondance des soft skills et de la personnalité (15%)
      - Formations et certifications pertinentes (15%)
      Note haute = le candidat est très qualifié pour ce poste

   b) **Score marché emploi** (marche_emploi : 0-100)
      Évalue les conditions du marché pour ce métier :
      - Ratio offres/candidats (40%) : beaucoup d'offres et peu de candidats = note haute
      - Tension du marché et pénurie (25%) : métier en pénurie = bonus
      - Volume d'offres disponibles (20%) : beaucoup d'offres publiées = bonus
      - Tendance du marché (15%) : métier en croissance = bonus, en déclin = malus
      Note haute = marché très favorable au candidat

   c) **Score potentiel évolution** (potentiel_evolution : 0-100)
      Évalue les perspectives à moyen/long terme :
      - Perspectives de carrière et d'évolution hiérarchique (30%)
      - Potentiel salarial et progression de rémunération (25%)
      - Stabilité et pérennité du secteur (25%)
      - Conditions de travail (télétravail, flexibilité) (20%)
      Note haute = excellent potentiel d'évolution

   Pour chaque note, écris une justification courte (1 phrase).

Réponds de manière structurée, claire et synthétique, avec des titres et des listes lorsque c'est pertinent.`;
}

module.exports = { buildPrompt };
