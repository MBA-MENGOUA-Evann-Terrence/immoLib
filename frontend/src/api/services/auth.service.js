import { apiClient } from '../client.js';
import { ENDPOINTS } from '../endpoints.js';

/**
 * @typedef {Object} InscriptionPayload
 * @property {string} nom
 * @property {string} email
 * @property {string} password
 * @property {string} [telephone]
 */

/**
 * @typedef {Object} ConnexionPayload
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} AuthResponse
 * @property {string} message
 * @property {string} token
 * @property {object} utilisateur
 */

/**
 * Inscription d'un nouvel utilisateur.
 * @param {InscriptionPayload} payload
 * @returns {Promise<AuthResponse>}
 */
export async function inscription(payload) {
  try {
    return await apiClient.post(ENDPOINTS.AUTH.INSCRIPTION, payload);
  } catch (err) {
    throw err;
  }
}

/**
 * Connexion et récupération du token JWT.
 * @param {ConnexionPayload} payload
 * @returns {Promise<AuthResponse>}
 */
export async function connexion(payload) {
  try {
    return await apiClient.post(ENDPOINTS.AUTH.CONNEXION, payload);
  } catch (err) {
    throw err;
  }
}
