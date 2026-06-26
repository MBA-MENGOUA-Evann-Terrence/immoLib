import { apiClient } from '../client.js';
import { ENDPOINTS } from '../endpoints.js';

/**
 * @typedef {Object} FiltresAnnonces
 * @property {string} [type] - 'location' | 'vente'
 * @property {number|string} [prixMin]
 * @property {number|string} [prixMax]
 * @property {number|string} [piecesMin]
 * @property {string} [quartiers] - Noms séparés par des virgules
 * @property {boolean|string} [avecPhotos]
 * @property {'prix_asc'|'prix_desc'|'recent'} [tri]
 * @property {number|string} [page]
 * @property {number|string} [limit]
 */

/**
 * Liste paginée avec filtres combinés.
 * @param {FiltresAnnonces} [filtres]
 * @returns {Promise<{ total: number, page: number, limit: number, annonces: object[] }>}
 */
export async function getAnnonces(filtres = {}) {
  try {
    return await apiClient.get(ENDPOINTS.ANNONCES.BASE, { params: filtres });
  } catch (err) {
    throw err;
  }
}

/**
 * Recherche plein-texte sur titre et description.
 * @param {string} q - Mots-clés
 * @returns {Promise<{ total: number, annonces: object[] }>}
 */
export async function rechercheTexte(q) {
  try {
    return await apiClient.get(ENDPOINTS.ANNONCES.RECHERCHE, { params: { q } });
  } catch (err) {
    throw err;
  }
}

/**
 * Recherche géospatiale ($near) autour d'un point.
 * @param {{ lng: number|string, lat: number|string, rayon?: number|string }} params
 * @returns {Promise<{ centre: object, rayonKm: number, total: number, annonces: object[] }>}
 */
export async function getAnnoncesProches({ lng, lat, rayon }) {
  try {
    return await apiClient.get(ENDPOINTS.ANNONCES.PROCHES, {
      params: { lng, lat, rayon },
    });
  } catch (err) {
    throw err;
  }
}

/**
 * Détail d'une annonce par identifiant MongoDB.
 * @param {string} id
 * @returns {Promise<object>}
 */
export async function getAnnonceParId(id) {
  try {
    return await apiClient.get(ENDPOINTS.ANNONCES.PAR_ID(id));
  } catch (err) {
    throw err;
  }
}

/**
 * Envoie un message au propriétaire d'une annonce.
 * @param {string} id
 * @param {{ nom: string, email: string, telephone?: string, message: string }} payload
 */
export async function contacterAnnonce(id, payload) {
  try {
    return await apiClient.post(ENDPOINTS.ANNONCES.CONTACT(id), payload);
  } catch (err) {
    throw err;
  }
}

/**
 * Crée une annonce (JWT requis).
 * @param {object} payload
 * @returns {Promise<{ message: string, annonce: object }>}
 */
export async function creerAnnonce(payload) {
  try {
    return await apiClient.post(ENDPOINTS.ANNONCES.BASE, payload);
  } catch (err) {
    throw err;
  }
}

/**
 * Met à jour une annonce (JWT requis, propriétaire ou admin).
 * @param {string} id
 * @param {object} payload
 * @returns {Promise<{ message: string, modifie: number }>}
 */
export async function updateAnnonce(id, payload) {
  try {
    return await apiClient.put(ENDPOINTS.ANNONCES.PAR_ID(id), payload);
  } catch (err) {
    throw err;
  }
}

/**
 * Suppression logique d'une annonce (JWT requis).
 * @param {string} id
 * @returns {Promise<{ message: string }>}
 */
export async function supprimerAnnonce(id) {
  try {
    return await apiClient.delete(ENDPOINTS.ANNONCES.PAR_ID(id));
  } catch (err) {
    throw err;
  }
}

/**
 * GeoJSON FeatureCollection pour carte Leaflet.
 * @param {Record<string, string|number>} [params]
 * @returns {Promise<{ type: string, features: object[] }>}
 */
export async function getCarte(params = {}) {
  try {
    return await apiClient.get(ENDPOINTS.ANNONCES.CARTE, { params });
  } catch (err) {
    throw err;
  }
}
