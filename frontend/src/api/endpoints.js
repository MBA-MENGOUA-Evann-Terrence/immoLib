/**
 * Constantes des routes API — aucune URL en dur dans les services.
 */
export const ENDPOINTS = {
  AUTH: {
    INSCRIPTION: '/api/auth/inscription',
    CONNEXION: '/api/auth/connexion',
  },
  ANNONCES: {
    BASE: '/api/annonces',
    RECHERCHE: '/api/annonces/recherche',
    PROCHES: '/api/annonces/proches',
    CARTE: '/api/annonces/carte',
    CORBEILLE: '/api/annonces/corbeille',
    PAR_UTILISATEUR: (userId) => `/api/annonces/utilisateur/${userId}`,
    PAR_ID: (id) => `/api/annonces/${id}`,
    CONTACT: (id) => `/api/annonces/${id}/contact`,
    RESTAURER: (id) => `/api/annonces/${id}/restaurer`,
  },
  QUARTIERS: {
    BASE: '/api/quartiers',
    PRIX_MOYEN_M2: '/api/quartiers/prix-moyen-m2',
  },
};
