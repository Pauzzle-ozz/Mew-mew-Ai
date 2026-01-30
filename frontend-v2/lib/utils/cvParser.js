/**
 * Parser de CV
 * Extrait les informations structurées d'un texte de CV
 */

/**
 * Parser le texte d'un CV pour extraire les informations
 */
export function parseCV(texte) {
  const parsed = {};
  
  // Extraire l'email
  const emailMatch = texte.match(/[\w.-]+@[\w.-]+\.\w+/);
  if (emailMatch) {
    parsed.email = emailMatch[0];
  }
  
  // Extraire le téléphone (formats français)
  const telMatch = texte.match(/(?:0|\+33)[1-9](?:[\s.-]?\d{2}){4}/);
  if (telMatch) {
    parsed.telephone = telMatch[0].replace(/\s/g, '');
  }
  
  // Extraire le nom (première ligne généralement)
  const lines = texte.split('\n').filter(l => l.trim());
  if (lines[0]) {
    const nameParts = lines[0].trim().split(' ');
    if (nameParts.length >= 2) {
      parsed.prenom = nameParts[0];
      parsed.nom = nameParts.slice(1).join(' ');
    }
  }
  
  // Extraire le titre (souvent ligne 2)
  if (lines[1] && !lines[1].includes('@') && !lines[1].match(/\d{5}/)) {
    parsed.titre_poste = lines[1].trim();
  }
  
  // Extraire l'adresse (recherche de code postal)
  const adresseMatch = texte.match(/\d{3,5}\s+[\w\s-]+(?:rue|avenue|boulevard|chemin|allée)[\w\s,-]*/i);
  if (adresseMatch) {
    parsed.adresse = adresseMatch[0];
  }
  
  return parsed;
}

/**
 * Compter le nombre de champs extraits
 */
export function countExtractedFields(parsedData) {
  return Object.keys(parsedData).filter(key => parsedData[key]).length;
}