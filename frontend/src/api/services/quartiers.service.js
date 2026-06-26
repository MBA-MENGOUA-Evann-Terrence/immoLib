import { apiClient } from '../client.js';
import { ENDPOINTS } from '../endpoints.js';

/**
 * Liste tous les quartiers.
 * @returns {Promise<object[]>}
 */
export async function getQuartiers() {
  try {
    return await apiClient.get(ENDPOINTS.QUARTIERS.BASE);
  } catch (err) {
    throw err;
  }
}

/**
 * Prix moyen au m² par quartier (agrégation MongoDB).
 * @param {{ type?: string, disponible?: boolean|string }} [params]
 * @returns {Promise<object[]>}
 */
export async function getPrixMoyenM2(params = {}) {
  try {
    return await apiClient.get(ENDPOINTS.QUARTIERS.PRIX_MOYEN_M2, { params });
  } catch (err) {
    throw err;
  }
}
