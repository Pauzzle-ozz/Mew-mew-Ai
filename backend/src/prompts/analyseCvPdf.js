/**
 * Prompt d'analyse CV par PDF
 */
function buildPrompt(cvText, numPages) {
  return `Tu es un expert senior en recrutement, en analyse de profils professionnels et en analyse du marché de l'emploi en France et en Europe.

Voici le profil d'un candidat extrait de son CV :

==== PROFIL CANDIDAT (CV PDF) ===
Texte extrait du CV :
${cvText}
Nombre de pages : ${numPages}

Ta mission :

1. Analyse ce profil en profondeur
   - Résume le profil professionnel du candidat
   - Identifie son niveau de séniorité et son positionnement principal

2. Identifie entre 6 et 10 métiers qui correspondent le mieux au profil

3. Classe CHAQUE métier dans l'une de ces 2 catégories (IMPORTANT - utilise EXACTEMENT ces noms) :
   - "Correspond a mes competences" : Métiers qui matchent directement avec les compétences et l'expérience actuelles du candidat. Le candidat peut postuler immédiatement.
   - "Je pourrais tenter" : Métiers accessibles avec un effort raisonnable (formation courte, montée en compétence). Le candidat a des bases mais doit progresser.

   ATTENTION : utilise EXACTEMENT ces noms de catégories, sans accents, sans majuscules différentes.

4. Scoring multi-critères - Pour chaque métier, attribue 3 notes sur 100 :

   a) **Score adéquation profil** (adequation_profil : 0-100)
      - Correspondance des compétences techniques (40%)
      - Correspondance de l'expérience et du niveau de séniorité (30%)
      - Correspondance des soft skills (15%)
      - Formations et certifications pertinentes (15%)

   b) **Score marché emploi** (marche_emploi : 0-100)
      - Ratio offres/candidats (40%)
      - Tension du marché et pénurie (25%)
      - Volume d'offres disponibles (20%)
      - Tendance du marché croissance/déclin (15%)

   c) **Score potentiel évolution** (potentiel_evolution : 0-100)
      - Perspectives de carrière et évolution hiérarchique (30%)
      - Potentiel salarial (25%)
      - Stabilité et pérennité du secteur (25%)
      - Conditions de travail (télétravail, flexibilité) (20%)

   Pour chaque note, écris une justification courte (1 phrase).

5. Pour chaque métier, donne aussi :
   - Ce que le candidat a déjà (compétences qui matchent)
   - Ce qui lui manque (compétences/certifications à acquérir)
   - Un conseil actionnable en 1 phrase
   - Les mots-clés pertinents

6. Extrais également :
   - Les compétences clés du candidat
   - Les mots-clés de recherche d'emploi recommandés

Sois précis, factuel et orienté résultats concrets.`;
}

module.exports = { buildPrompt };
