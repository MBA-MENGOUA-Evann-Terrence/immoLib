import { ApiError } from './errors.js';

const TOKEN_KEY = 'immolib_token';

/** @type {string|null} */
let authToken = null;

/**
 * Définit le token JWT utilisé pour les requêtes authentifiées.
 * @param {string|null} token
 */
export function setAuthToken(token) {
  authToken = token;
}

/**
 * @returns {string|null}
 */
export function getAuthToken() {
  return authToken ?? localStorage.getItem(TOKEN_KEY);
}

/**
 * Construit l'URL complète avec paramètres de requête optionnels.
 * @param {string} path
 * @param {Record<string, string|number|boolean|undefined|null>} [params]
 */
function buildUrl(path, params) {
  const baseUrl = import.meta.env.VITE_API_URL;
  if (!baseUrl) {
    throw new ApiError('VITE_API_URL non configurée dans le fichier .env', 0, null);
  }

  const url = new URL(path, baseUrl.replace(/\/$/, ''));

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
}

/**
 * Client HTTP centralisé (fetch natif).
 * @param {'GET'|'POST'|'PUT'|'DELETE'} method
 * @param {string} path
 * @param {{ body?: object, params?: Record<string, unknown> }} [options]
 */
async function request(method, path, options = {}) {
  const { body, params } = options;

  const headers = { 'Content-Type': 'application/json' };
  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(buildUrl(path, params), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const contentType = response.headers.get('content-type');
    /** @type {object|null} */
    let data = null;

    if (contentType?.includes('application/json')) {
      data = await response.json();
    }

    if (!response.ok) {
      throw new ApiError(
        data?.erreur || `Erreur HTTP ${response.status}`,
        response.status,
        data
      );
    }

    return data;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(err.message || 'Impossible de joindre le serveur', 0, null);
  }
}

/** @type {{ get: Function, post: Function, put: Function, delete: Function }} */
export const apiClient = {
  get: (path, options) => request('GET', path, options),
  post: (path, body, options = {}) => request('POST', path, { ...options, body }),
  put: (path, body, options = {}) => request('PUT', path, { ...options, body }),
  delete: (path, options) => request('DELETE', path, options),
};
