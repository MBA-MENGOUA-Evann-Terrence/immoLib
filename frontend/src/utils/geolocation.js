/** Centre de Libreville par défaut [lat, lng] */
export const LIBREVILLE_CENTER = { lat: 0.4162, lng: 9.4673 };

/**
 * Récupère la position GPS du navigateur.
 * @param {{ timeout?: number }} [options]
 * @returns {Promise<{ lat: number, lng: number } | null>}
 */
export function getCurrentPosition(options = {}) {
  const { timeout = 10000 } = options;

  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      () => resolve(null),
      { enableHighAccuracy: true, timeout, maximumAge: 60000 }
    );
  });
}

/**
 * Formate une distance en mètres en texte lisible.
 * @param {number} metres
 */
export function formatDistance(metres) {
  if (metres == null || Number.isNaN(metres)) return '';
  if (metres < 1000) return `${Math.round(metres)} m`;
  return `${(metres / 1000).toFixed(1)} km`;
}
