const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Generer du contenu multi-format
 */
export async function generateContent(brief, platforms) {
  const response = await fetch(`${API_BASE_URL}/api/marketing/redacteur/generer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ brief, platforms })
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.error || 'Erreur generation contenu');
  return json.data;
}

/**
 * Generer une strategie de contenu / calendrier editorial 30 jours
 */
export async function generateStrategy(input) {
  const response = await fetch(`${API_BASE_URL}/api/marketing/strategie/generer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.error || 'Erreur generation strategie');
  return json.data;
}
