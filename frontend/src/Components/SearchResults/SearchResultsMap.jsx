import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useSearchResults } from '../../context/SearchResultsContext';
import { getCurrentPosition, LIBREVILLE_CENTER } from '../../utils/geolocation';
import MapListingPopup from './MapListingPopup';
import 'leaflet/dist/leaflet.css';

/** Zone verrouillée autour de Libreville — carte très stable. */
const LIBREVILLE_BOUNDS = L.latLngBounds([0.37, 9.40], [0.46, 9.52]);
const FIXED_ZOOM = 13;
const MAX_PAN_METERS = 400;

function createPinIcon(active, transaction = 'vente') {
  const fill = active ? '#F28500' : transaction === 'Location' ? '#008080' : '#1f2937';
  const scale = active ? 1.15 : 1;

  return L.divIcon({
    className: 'custom-pin-icon',
    html: `
      <div style="transform:scale(${scale});transform-origin:bottom center">
        <svg width="24" height="32" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 22 14 22s14-11.5 14-22C28 6.268 21.732 0 14 0z" fill="${fill}" stroke="${active ? '#fff' : 'none'}" stroke-width="2"/>
          <circle cx="14" cy="14" r="5" fill="white"/>
        </svg>
      </div>
    `,
    iconSize: [24, 32],
    iconAnchor: [12, 32],
    popupAnchor: [0, -34],
  });
}

/** Carte fixe : recentre doucement si l'utilisateur s'éloigne trop de Libreville. */
function MapStabilizer() {
  const map = useMap();

  useEffect(() => {
    map.setView([LIBREVILLE_CENTER.lat, LIBREVILLE_CENTER.lng], FIXED_ZOOM, { animate: false });
    map.setMaxBounds(LIBREVILLE_BOUNDS);
    map.setMinZoom(FIXED_ZOOM);
    map.setMaxZoom(14);

    const onMoveEnd = () => {
      const c = map.getCenter();
      const dist = map.distance(c, L.latLng(LIBREVILLE_CENTER.lat, LIBREVILLE_CENTER.lng));
      if (dist > MAX_PAN_METERS) {
        map.panTo([LIBREVILLE_CENTER.lat, LIBREVILLE_CENTER.lng], { animate: true, duration: 0.35 });
      }
      if (map.getZoom() !== FIXED_ZOOM) {
        map.setZoom(FIXED_ZOOM, { animate: false });
      }
    };

    map.on('moveend', onMoveEnd);
    return () => map.off('moveend', onMoveEnd);
  }, [map]);

  return null;
}

/**
 * Trace un itinéraire OSRM sans déplacer la carte.
 * @param {{ lat: number, lng: number }|null} destination
 * @param {(coords: [number, number][]|null) => void} onRoute
 */
function RouteFetcher({ destination, onRoute }) {
  useEffect(() => {
    if (!destination) {
      onRoute(null);
      return;
    }

    let cancelled = false;

    (async () => {
      const origin = (await getCurrentPosition()) ?? LIBREVILLE_CENTER;
      const url =
        `https://router.project-osrm.org/route/v1/driving/` +
        `${origin.lng},${origin.lat};${destination.lng},${destination.lat}` +
        `?overview=full&geometries=geojson`;

      try {
        const res = await fetch(url);
        const data = await res.json();
        if (cancelled) return;
        const coords = data.routes?.[0]?.geometry?.coordinates?.map(
          ([lng, lat]) => [lat, lng]
        );
        onRoute(coords ?? null);
      } catch {
        if (!cancelled) onRoute(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [destination, onRoute]);

  return null;
}

function MapMarkers({
  activeListing,
  listingsWithCoords,
  onSelectListing,
  onRequestRoute,
  routeLoadingId,
}) {
  const markerRefs = useRef({});

  useEffect(() => {
    if (activeListing?.id) {
      markerRefs.current[activeListing.id]?.openPopup();
    }
  }, [activeListing]);

  return (
    <>
      {listingsWithCoords.map((listing) => {
        const isActive = activeListing && String(activeListing.id) === String(listing.id);
        return (
          <Marker
            key={listing.id}
            ref={(ref) => {
              if (ref) markerRefs.current[listing.id] = ref;
            }}
            position={[listing.coordinates.lat, listing.coordinates.lng]}
            icon={createPinIcon(isActive, listing.transaction)}
            zIndexOffset={isActive ? 1000 : 0}
            eventHandlers={{
              click: () => onSelectListing(String(listing.id)),
            }}
          >
            <Popup
              maxWidth={160}
              minWidth={148}
              autoPan={false}
              className="map-popup-compact"
            >
              <MapListingPopup
                listing={listing}
                routeLoading={routeLoadingId === listing.id}
                onRoute={() => onRequestRoute(listing)}
              />
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}

export default function SearchResultsMap() {
  const {
    filteredListings,
    activeListingId,
    setActiveListingId,
    rayonKm,
    useGeoRadius,
  } = useSearchResults();

  const [routeTarget, setRouteTarget] = useState(null);
  const [routeCoords, setRouteCoords] = useState(null);
  const [routeLoadingId, setRouteLoadingId] = useState(null);

  const listingsWithCoords = useMemo(
    () => filteredListings.filter((l) => l.coordinates?.lat && l.coordinates?.lng),
    [filteredListings]
  );

  const activeListing = useMemo(
    () => filteredListings.find((l) => String(l.id) === String(activeListingId)),
    [filteredListings, activeListingId]
  );

  const handleRoute = useCallback((listing) => {
    setRouteLoadingId(listing.id);
    setRouteTarget({ lat: listing.coordinates.lat, lng: listing.coordinates.lng });
  }, []);

  const handleRouteResult = useCallback((coords) => {
    setRouteCoords(coords);
    setRouteLoadingId(null);
  }, []);

  const clearRoute = useCallback(() => {
    setRouteTarget(null);
    setRouteCoords(null);
    setRouteLoadingId(null);
  }, []);

  return (
    <div className="relative w-full h-full min-h-[360px]">
      {listingsWithCoords.length === 0 && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] px-3 py-1.5 bg-white/95 rounded-lg shadow text-xs text-gray-600">
          Aucun bien géolocalisé
        </div>
      )}

      {routeCoords && (
        <button
          type="button"
          onClick={clearRoute}
          className="absolute top-3 right-3 z-[1000] px-3 py-1.5 bg-white rounded-lg shadow text-xs font-medium text-gray-700 hover:bg-gray-50"
        >
          Effacer l&apos;itinéraire
        </button>
      )}

      <MapContainer
        center={[LIBREVILLE_CENTER.lat, LIBREVILLE_CENTER.lng]}
        zoom={FIXED_ZOOM}
        minZoom={FIXED_ZOOM}
        maxZoom={14}
        className="w-full h-full z-0 rounded-2xl"
        scrollWheelZoom={false}
        doubleClickZoom={false}
        boxZoom={false}
        maxBounds={LIBREVILLE_BOUNDS}
        maxBoundsViscosity={1}
      >
        <MapStabilizer />
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {useGeoRadius && (
          <Circle
            center={[LIBREVILLE_CENTER.lat, LIBREVILLE_CENTER.lng]}
            radius={rayonKm * 1000}
            pathOptions={{
              color: '#008080',
              fillColor: '#008080',
              fillOpacity: 0.07,
              weight: 2,
              dashArray: '6 4',
            }}
          />
        )}

        {routeCoords && (
          <Polyline
            positions={routeCoords}
            pathOptions={{ color: '#F28500', weight: 4, opacity: 0.85 }}
          />
        )}

        <RouteFetcher destination={routeTarget} onRoute={handleRouteResult} />

        <MapMarkers
          activeListing={activeListing}
          listingsWithCoords={listingsWithCoords}
          onSelectListing={setActiveListingId}
          onRequestRoute={handleRoute}
          routeLoadingId={routeLoadingId}
        />
      </MapContainer>
    </div>
  );
}
