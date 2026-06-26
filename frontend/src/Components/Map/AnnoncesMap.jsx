import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { formatPrix } from '../../mappers/annonce.mapper';
import { formatDistance } from '../../utils/geolocation';
import 'leaflet/dist/leaflet.css';

const LIBREVILLE = [0.4162, 9.4673];

function createTypeIcon(color) {
  return L.divIcon({
    className: '',
    html: `<div style="background:${color};width:18px;height:18px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 4px rgba(0,0,0,.35)"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

const TYPE_ICONS = {
  location: createTypeIcon('#2563eb'),
  vente: createTypeIcon('#db2777'),
};

const USER_ICON = createTypeIcon('#16a34a');

/**
 * @param {object} props
 * @param {import('geojson').FeatureCollection|null} props.geojson
 * @param {{ lat: number, lng: number }|null} [props.userPosition]
 * @param {string} [props.className]
 * @param {string} [props.height]
 * @param {(bbox: string) => void} [props.onBoundsChange]
 */
export default function AnnoncesMap({
  geojson,
  userPosition = null,
  className = '',
  height = '500px',
  onBoundsChange,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);
  const userMarkerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current).setView(LIBREVILLE, 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);

    if (onBoundsChange) {
      map.on('moveend', () => {
        const bounds = map.getBounds();
        const sw = bounds.getSouthWest();
        const ne = bounds.getNorthEast();
        onBoundsChange(`${sw.lng},${sw.lat},${ne.lng},${ne.lat}`);
      });
    }

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
      userMarkerRef.current = null;
    };
  }, [onBoundsChange]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (userMarkerRef.current) {
      map.removeLayer(userMarkerRef.current);
      userMarkerRef.current = null;
    }

    if (userPosition) {
      userMarkerRef.current = L.marker([userPosition.lat, userPosition.lng], {
        icon: USER_ICON,
      })
        .addTo(map)
        .bindPopup('<b>Vous êtes ici</b>');
    }
  }, [userPosition]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (layerRef.current) {
      map.removeLayer(layerRef.current);
      layerRef.current = null;
    }

    if (!geojson?.features?.length) return;

    layerRef.current = L.geoJSON(geojson, {
      pointToLayer: (feature, latlng) =>
        L.marker(latlng, {
          icon: TYPE_ICONS[feature.properties?.type] || TYPE_ICONS.vente,
        }),
      onEachFeature: (feature, layer) => {
        const p = feature.properties ?? {};
        const coords = feature.geometry?.coordinates ?? [];
        const lat = coords[1];
        const lng = coords[0];
        const photo = p.photo
          ? `<img src="${p.photo}" alt="" style="width:100%;height:100px;object-fit:cover;border-radius:8px;margin-bottom:8px" />`
          : '';
        const dist = p.distanceM != null ? formatDistance(p.distanceM) : '';
        const prix = formatPrix(p.prix);
        const typeLabel = p.type === 'location' ? 'Location' : 'Vente';
        const detailLink = p.id ? `/annonces/${p.id}` : '#';

        layer.bindPopup(`
          <div style="min-width:200px;font-family:system-ui,sans-serif">
            ${photo}
            <strong style="font-size:14px">${p.titre ?? 'Annonce'}</strong>
            <div style="color:#0f766e;font-weight:700;margin-top:4px">${prix}</div>
            <div style="font-size:12px;color:#64748b;margin-top:2px">
              ${p.quartier ?? ''}${dist ? ` · ${dist}` : ''}
            </div>
            <span style="display:inline-block;margin-top:6px;font-size:11px;padding:2px 8px;border-radius:999px;color:#fff;background:${p.type === 'location' ? '#2563eb' : '#db2777'}">${typeLabel}</span>
            <a href="${detailLink}" style="display:block;margin-top:8px;text-align:center;padding:6px;background:#111;color:#fff;border-radius:8px;text-decoration:none;font-size:13px">Voir l'annonce</a>
          </div>
        `);
      },
    }).addTo(map);

    map.fitBounds(layerRef.current.getBounds(), { padding: [40, 40], maxZoom: 15 });
  }, [geojson]);

  return (
    <div
      ref={containerRef}
      className={`w-full rounded-2xl overflow-hidden border border-gray-200 z-0 ${className}`}
      style={{ height, minHeight: height }}
    />
  );
}
