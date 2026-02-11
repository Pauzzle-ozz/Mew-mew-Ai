/**
 * Prompt pour analyser un CV et identifier les métiers correspondants
 * Utilisé par jobDiscoveryService en mode Découverte
 */
function buildPrompt(cvText) {
  return `Tu es un expert en orientation professionnelle et en recrutement en France.

Tu vas analyser le texte d'un CV et identifier les métiers les mieux adaptés à ce profil.

## Analyse du profil

Depuis le texte du CV ci-dessous :
1. Identifie le niveau d'expérience global (junior <3 ans, confirmé 3-7 ans, senior >7 ans)
2. Identifie 3 à 5 métiers/postes pour lesquels ce profil est qualifié ou pourrait postuler
3. Pour chaque métier, propose des mots-clés de recherche en français adaptés au marché français

## Règles
- Les métiers doivent être des intitulés de poste réalistes et recherchables sur les job boards français
- Favorise les intitulés courts (ex: "Développeur Full-Stack", "Chef de projet", "Data Analyst")
- Les mots-clés doivent être des termes réellement utilisés dans les offres d'emploi françaises
- Ne propose que des métiers cohérents avec le niveau d'expérience détecté

---

**TEXTE DU CV :**

${cvText}

---

Réponds UNIQUEMENT avec du JSON valide, sans markdown, sans commentaires :

{
  "niveau_experience": "junior | confirme | senior",
  "resume_profil": "Une phrase décrivant le profil en 20 mots max",
  "metiers": [
    {
      "titre": "Intitulé exact du poste",
      "niveau": "junior | confirme | senior",
      "mots_cles": ["mot-clé 1", "mot-clé 2", "mot-clé 3"],
      "description_courte": "Ce que fait ce professionnel en 1 phrase"
    }
  ]
}`;
}

module.exports = { buildPrompt };
