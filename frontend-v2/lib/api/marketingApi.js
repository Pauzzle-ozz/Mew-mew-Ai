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

/**
 * SEO : audit complet d'un site web
 */
export async function auditSeo(url, maxPages = 10) {
  const response = await fetch(`${API_BASE_URL}/api/marketing/seo/audit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, maxPages })
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.error || 'Erreur audit SEO');
  return json.data;
}

// ═══════════════════════════════════════════
// CREATEUR DE CONTENU
// ═══════════════════════════════════════════

/**
 * Createur : generer du contenu depuis un brief
 */
export async function createContent(brief, platforms, contentType) {
  const response = await fetch(`${API_BASE_URL}/api/marketing/createur/generer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ brief, platforms, contentType })
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.error || 'Erreur creation contenu');
  return json.data;
}

/**
 * Createur : recreer du contenu depuis une URL
 */
export async function recreateContent(url, platforms, contentType, brief) {
  const response = await fetch(`${API_BASE_URL}/api/marketing/createur/recreer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, platforms, contentType, brief })
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.error || 'Erreur recreation contenu');
  return json.data;
}

/**
 * Createur : generer une image via DALL-E
 */
export async function generateContentImage(brief, platform, contentType) {
  const response = await fetch(`${API_BASE_URL}/api/marketing/createur/image`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ brief, platform, contentType })
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.error || 'Erreur generation image');
  return json.data;
}

/**
 * Createur : sauvegarder une creation
 */
export async function saveCreation(data) {
  const response = await fetch(`${API_BASE_URL}/api/marketing/createur/sauvegarder`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.error || 'Erreur sauvegarde');
  return json.data;
}

/**
 * Createur : recuperer l'historique des creations
 */
export async function getCreationHistory(userId, filters = {}) {
  const params = new URLSearchParams();
  if (filters.contentType) params.set('contentType', filters.contentType);
  if (filters.status) params.set('status', filters.status);
  if (filters.limit) params.set('limit', filters.limit);
  if (filters.offset) params.set('offset', filters.offset);

  const response = await fetch(`${API_BASE_URL}/api/marketing/createur/historique/${userId}?${params}`);

  const json = await response.json();
  if (!response.ok) throw new Error(json.error || 'Erreur historique');
  return json.data;
}

/**
 * Createur : recuperer une creation
 */
export async function getCreation(creationId, userId) {
  const response = await fetch(`${API_BASE_URL}/api/marketing/createur/${creationId}?userId=${userId}`);

  const json = await response.json();
  if (!response.ok) throw new Error(json.error || 'Erreur recuperation');
  return json.data;
}

/**
 * Createur : mettre a jour une creation
 */
export async function updateCreation(creationId, userId, updates) {
  const response = await fetch(`${API_BASE_URL}/api/marketing/createur/${creationId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, ...updates })
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.error || 'Erreur mise a jour');
  return json.data;
}

/**
 * Createur : supprimer une creation
 */
export async function deleteCreation(creationId, userId) {
  const response = await fetch(`${API_BASE_URL}/api/marketing/createur/${creationId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.error || 'Erreur suppression');
  return json.data;
}

// ═══════════════════════════════════════════
// RESEAUX SOCIAUX - CLES API & PUBLICATION
// ═══════════════════════════════════════════

/**
 * Sauvegarder les cles API d'une plateforme
 */
export async function saveSocialKeys(userId, platform, credentials) {
  const response = await fetch(`${API_BASE_URL}/api/social-media/keys`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, platform, credentials })
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.error || 'Erreur sauvegarde cles');
  return json.data;
}

/**
 * Lister les plateformes connectees
 */
export async function getSocialKeys(userId) {
  const response = await fetch(`${API_BASE_URL}/api/social-media/keys/${userId}`);

  const json = await response.json();
  if (!response.ok) throw new Error(json.error || 'Erreur recuperation cles');
  return json.data;
}

/**
 * Supprimer les cles d'une plateforme
 */
export async function deleteSocialKeys(userId, platform) {
  const response = await fetch(`${API_BASE_URL}/api/social-media/keys/${userId}/${platform}`, {
    method: 'DELETE'
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.error || 'Erreur suppression');
  return json.data;
}

/**
 * Tester la connexion d'une plateforme
 */
export async function testSocialConnection(userId, platform) {
  const response = await fetch(`${API_BASE_URL}/api/social-media/test`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, platform })
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.error || 'Test connexion echoue');
  return json.data;
}

/**
 * Publier du contenu sur une plateforme
 */
export async function publishToSocial(userId, platform, content, imageUrl) {
  const response = await fetch(`${API_BASE_URL}/api/social-media/publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, platform, content, imageUrl })
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.error || 'Erreur publication');
  return json.data;
}
