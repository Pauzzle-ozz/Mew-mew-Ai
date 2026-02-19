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

/**
 * Veille : identifier les sources media d'un secteur
 */
export async function identifySources(sector, country, keywords) {
  const response = await fetch(`${API_BASE_URL}/api/marketing/veille/sources`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sector, country, keywords })
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.error || 'Erreur identification sources');
  return json.data;
}

/**
 * Veille : analyse approfondie des sources (scraping + tendances)
 */
export async function deepAnalyze(sector, sources) {
  const response = await fetch(`${API_BASE_URL}/api/marketing/veille/analyser`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sector, sources })
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.error || 'Erreur analyse approfondie');
  return json.data;
}

/**
 * Concurrence : analyser un ou plusieurs concurrents
 */
export async function analyzeCompetitors(competitors, sector) {
  const response = await fetch(`${API_BASE_URL}/api/marketing/concurrence/analyser`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ competitors, sector })
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.error || 'Erreur analyse concurrence');
  return json.data;
}

/**
 * Concurrence : generer un benchmark comparatif
 */
export async function generateBenchmark(analyses, sector) {
  const response = await fetch(`${API_BASE_URL}/api/marketing/concurrence/benchmark`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ analyses, sector })
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.error || 'Erreur generation benchmark');
  return json.data;
}

/**
 * Performance : analyser les metriques de contenu marketing
 */
export async function analyzePerformance(metricsData) {
  const response = await fetch(`${API_BASE_URL}/api/marketing/performance/analyser`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ metricsData })
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.error || 'Erreur analyse performance');
  return json.data;
}
