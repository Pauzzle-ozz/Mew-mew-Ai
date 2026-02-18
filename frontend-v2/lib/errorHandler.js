/**
 * Gestionnaire d'erreurs centralisé
 * Convertit les erreurs techniques en messages user-friendly
 */

const ERROR_MESSAGES = {
  // Erreurs réseau
  NETWORK: 'Impossible de contacter le serveur. Vérifiez votre connexion internet.',
  TIMEOUT: 'La requête a pris trop de temps. Réessayez dans quelques instants.',

  // Erreurs API
  400: 'Données invalides. Vérifiez les informations saisies.',
  401: 'Session expirée. Veuillez vous reconnecter.',
  403: 'Accès refusé.',
  404: 'Ressource introuvable.',
  429: 'Trop de requêtes. Veuillez patienter quelques minutes.',
  500: 'Erreur serveur. Réessayez plus tard.',
  503: 'Service temporairement indisponible. Réessayez dans quelques instants.',

  // Erreurs spécifiques
  PDF_UPLOAD: 'Impossible de lire le fichier PDF. Vérifiez qu\'il n\'est pas protégé ou corrompu.',
  FILE_TOO_LARGE: 'Le fichier est trop volumineux.',
  INVALID_FORMAT: 'Format de fichier non supporté.',

  // Fallback
  DEFAULT: 'Une erreur inattendue est survenue. Réessayez.'
}

/**
 * Retourne un message user-friendly à partir d'une erreur
 */
export function getErrorMessage(error) {
  // Erreur réseau (fetch échoué)
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return ERROR_MESSAGES.NETWORK
  }

  // Erreur avec timeout
  if (error.name === 'AbortError') {
    return ERROR_MESSAGES.TIMEOUT
  }

  // Erreur API avec status
  if (error.status && ERROR_MESSAGES[error.status]) {
    return ERROR_MESSAGES[error.status]
  }

  // Erreur avec code spécifique
  if (error.code && ERROR_MESSAGES[error.code]) {
    return ERROR_MESSAGES[error.code]
  }

  // Message d'erreur du serveur
  if (error.message && !error.message.includes('Error') && error.message.length < 200) {
    return error.message
  }

  return ERROR_MESSAGES.DEFAULT
}

/**
 * Gère une erreur API : log + retourne un message user-friendly
 */
export function handleApiError(error, context = '') {
  if (context) {
    console.error(`[${context}]`, error)
  }
  return getErrorMessage(error)
}
