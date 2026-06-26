import { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import AnnoncesMap from '../Map/AnnoncesMap';

/**
 * @param {{ address?: string|null, coordinates?: { lat: number, lng: number }|null, title?: string }} props
 */
export default function PropertyLocation({ address, coordinates, title }) {
  const geojson = useMemo(() => {
    if (!coordinates) return null;
    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [coordinates.lng, coordinates.lat],
          },
          properties: {
            id: null,
            titre: title ?? '',
            prix: 0,
            type: 'vente',
            quartier: address ?? '',
          },
        },
      ],
    };
  }, [address, coordinates, title]);

  if (!address && !coordinates) return null;

  return (
    <section>
      <h2 className="text-lg font-bold text-gray-900 mb-4">Localisation</h2>

      {geojson ? (
        <AnnoncesMap geojson={geojson} height="320px" />
      ) : (
        <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden bg-immo-beige border border-gray-200">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-6">
              <div className="w-12 h-12 mx-auto rounded-full bg-immo-green/10 flex items-center justify-center mb-3">
                <FontAwesomeIcon icon={faLocationDot} className="text-immo-green text-lg" />
              </div>
              {address && <p className="text-sm font-medium text-gray-700">{address}</p>}
              <p className="text-xs text-gray-400 mt-1">Coordonnées GPS non renseignées pour ce bien</p>
            </div>
          </div>
        </div>
      )}

      {address && (
        <p className="mt-3 text-sm text-gray-500 flex items-center gap-2">
          <FontAwesomeIcon icon={faLocationDot} className="text-immo-green text-xs" />
          {address}
        </p>
      )}
    </section>
  );
}
