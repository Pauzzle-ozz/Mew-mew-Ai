const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Envoyer un message a l'agent fiscalite
 * @param {string} userId
 * @param {string|null} sessionId - null pour creer une nouvelle session
 * @param {string} message
 * @param {File|null} file - document joint (PDF, Excel, CSV)
 * @returns {Object} { message, messageId, sessionId, createdAt }
 */
export async function sendAgentMessage(userId, sessionId, message, file = null) {
  const formData = new FormData();
  formData.append('userId', userId);
  if (sessionId) formData.append('sessionId', sessionId);
  formData.append('message', message);
  if (file) formData.append('document', file);

  const response = await fetch(`${API_BASE_URL}/api/agents/fiscalite/chat`, {
    method: 'POST',
    body: formData
  });

  const json = await response.json();
  if (!response.ok || !json.success) {
    throw new Error(json.error || 'Erreur agent fiscalite');
  }
  return json.data;
}

/**
 * Lister les sessions de l'agent fiscalite
 */
export async function getAgentSessions(userId) {
  const response = await fetch(`${API_BASE_URL}/api/agents/fiscalite/sessions/${userId}`);
  const json = await response.json();
  if (!response.ok || !json.success) {
    throw new Error(json.error || 'Erreur chargement sessions');
  }
  return json.data;
}

/**
 * Recuperer les messages d'une session
 */
export async function getSessionMessages(sessionId, userId) {
  const response = await fetch(
    `${API_BASE_URL}/api/agents/fiscalite/sessions/${sessionId}/messages?userId=${userId}`
  );
  const json = await response.json();
  if (!response.ok || !json.success) {
    throw new Error(json.error || 'Erreur chargement messages');
  }
  return json.data;
}

/**
 * Supprimer une session
 */
export async function deleteAgentSession(sessionId, userId) {
  const response = await fetch(`${API_BASE_URL}/api/agents/fiscalite/sessions/${sessionId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
  });
  const json = await response.json();
  if (!response.ok || !json.success) {
    throw new Error(json.error || 'Erreur suppression session');
  }
  return json;
}

/**
 * Renommer une session
 */
export async function renameAgentSession(sessionId, userId, title) {
  const response = await fetch(`${API_BASE_URL}/api/agents/fiscalite/sessions/${sessionId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, title })
  });
  const json = await response.json();
  if (!response.ok || !json.success) {
    throw new Error(json.error || 'Erreur renommage session');
  }
  return json.data;
}
