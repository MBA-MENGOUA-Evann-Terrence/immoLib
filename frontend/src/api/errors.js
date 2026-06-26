/**
 * Erreur HTTP typée renvoyée par le client API.
 */
export class ApiError extends Error {
  /**
   * @param {string} message - Message lisible pour l'utilisateur
   * @param {number} status - Code HTTP (0 = erreur réseau)
   * @param {object|null} body - Corps JSON de la réponse
   */
  constructor(message, status, body = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}
