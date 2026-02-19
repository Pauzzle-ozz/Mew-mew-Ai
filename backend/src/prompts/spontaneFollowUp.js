/**
 * Prompt suivi candidature spontanee
 * Appele a la demande quand l'utilisateur veut envoyer une relance
 */
function buildPrompt({ originalSubject, targetPosition, company, candidateName, daysSince }) {
  const companyLine = company ? `chez ${company}` : '';

  return `Tu es un expert en candidature spontanee.

## Contexte
Le candidat ${candidateName} avait envoye une candidature spontanee pour le poste de "${targetPosition}" ${companyLine} il y a ${daysSince} jours.
Objet original : "${originalSubject}"

## Ta mission

Redige un email de relance court et poli.

Regles :
- Maximum 80 mots
- Commence par "Madame, Monsieur,"
- Rappelle brievement la candidature initiale
- Reitere l'interet et la disponibilite
- Ton : persistant mais respectueux, jamais insistant
- Termine par "Cordialement," puis "${candidateName}"

Structure ta reponse :
SUBJECT: Re: ${originalSubject}
---
[corps de la relance]`;
}

module.exports = { buildPrompt };
