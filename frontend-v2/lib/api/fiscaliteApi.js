const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ═══ FISCALITE ═══

/**
 * Audit fiscal complet
 */
export async function auditFiscal(data, file) {
  const formData = new FormData();
  formData.append('data', JSON.stringify(data));
  if (file) formData.append('document', file);

  const response = await fetch(`${API_BASE_URL}/api/fiscalite/audit`, {
    method: 'POST',
    body: formData
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.error || 'Erreur lors de l\'audit fiscal');
  return json.data;
}

/**
 * Preparer une declaration fiscale
 */
export async function preparerDeclaration(data, file) {
  const formData = new FormData();
  formData.append('data', JSON.stringify(data));
  if (file) formData.append('document', file);

  const response = await fetch(`${API_BASE_URL}/api/fiscalite/assistant/declarations`, {
    method: 'POST',
    body: formData
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.error || 'Erreur lors de la preparation');
  return json.data;
}

/**
 * Generer un calendrier fiscal personnalise
 */
export async function genererCalendrier(data) {
  const response = await fetch(`${API_BASE_URL}/api/fiscalite/assistant/calendrier`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.error || 'Erreur lors de la generation du calendrier');
  return json.data;
}

/**
 * Preparer un controle fiscal
 */
export async function preparerControle(data, file) {
  const formData = new FormData();
  formData.append('data', JSON.stringify(data));
  if (file) formData.append('document', file);

  const response = await fetch(`${API_BASE_URL}/api/fiscalite/assistant/controle`, {
    method: 'POST',
    body: formData
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.error || 'Erreur lors de la preparation du controle');
  return json.data;
}

/**
 * Question fiscale libre
 */
export async function questionFiscale(question, contexte) {
  const response = await fetch(`${API_BASE_URL}/api/fiscalite/assistant/question`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, contexte })
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.error || 'Erreur lors du traitement de la question');
  return json.data;
}

/**
 * Simulation de strategie juridique et fiscale
 */
export async function simulerStrategie(data, file) {
  const formData = new FormData();
  formData.append('data', JSON.stringify(data));
  if (file) formData.append('document', file);

  const response = await fetch(`${API_BASE_URL}/api/fiscalite/simulateur`, {
    method: 'POST',
    body: formData
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.error || 'Erreur lors de la simulation');
  return json.data;
}

// ═══ FINANCE ═══

/**
 * Analyse fondamentale d'un actif
 */
export async function analyseFondamentale(actif, type_actif, marche) {
  const response = await fetch(`${API_BASE_URL}/api/finance/fondamentale`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ actif, type_actif, marche })
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.error || 'Erreur lors de l\'analyse fondamentale');
  return json.data;
}

/**
 * Analyse technique d'un actif
 */
export async function analyseTechnique(actif, type_actif, periode) {
  const response = await fetch(`${API_BASE_URL}/api/finance/technique`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ actif, type_actif, periode })
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.error || 'Erreur lors de l\'analyse technique');
  return json.data;
}

/**
 * Analyse trading complete (fondamentale + technique)
 */
export async function analyseTrading(data) {
  const response = await fetch(`${API_BASE_URL}/api/finance/trading/analyser`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.error || 'Erreur lors de l\'analyse trading');
  return json.data;
}

/**
 * Analyse d'un portefeuille
 */
export async function analysePortefeuille(data) {
  const response = await fetch(`${API_BASE_URL}/api/finance/trading/portefeuille`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.error || 'Erreur lors de l\'analyse du portefeuille');
  return json.data;
}
