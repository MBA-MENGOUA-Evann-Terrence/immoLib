import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useSearchResults } from '../../context/SearchResultsContext';
import { getCurrentPosition, LIBREVILLE_CENTER } from '../../utils/geolocation';
import MapListingPopup from './MapListingPopup';
import 'leaflet/dist/leaflet.css';

/** Zone verrouillée autour de Libreville — mode navigation classique. */
const LIBREVILLE_BOUNDS = L.latLngBounds([0.37, 9.40], [0.46, 9.52]);
const FIXED_ZOOM = 13;
const MAX_PAN_METERS = 400;

/** Marqueur annonce — jamais orange (réservé à la position utilisateur). */
function createListingPinIcon(active, transaction = 'vente') {
  const fill = transaction === 'Location' ? '#008080' : '#1f2937';
  const scale = active ? 1.18 : 1;

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

/** Marqueur orange unique : position actuelle de l'utilisateur. */
function createUserPositionIcon() {
  return L.divIcon({
    className: 'user-position-icon',
    html: `
      <div style="position:relative;width:28px;height:28px">
        <span style="position:absolute;inset:0;border-radius:50%;background:#F28500;opacity:0.25;animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite"></span>
        <span style="position:absolute;inset:4px;border-radius:50%;background:#F28500;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.35)"></span>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

/** Mode classique : carte verrouillée sur Libreville. */
function MapStabilizer({ geoMode }) {
  const map = useMap();

  useEffect(() => {
    if (geoMode) {
      map.setMaxBounds(null);
      return undefined;
    }

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
  }, [map, geoMode]);

  return null;
}

/** Calcule les bounds d'un cercle sans l'attacher à la carte (évite l'erreur getBounds). */
function circleBounds(lat, lng, radiusMeters) {
  const dLat = radiusMeters / 111320;
  const cosLat = Math.cos((lat * Math.PI) / 180) || 1e-6;
  const dLng = radiusMeters / (111320 * cosLat);
  return L.latLngBounds([lat - dLat, lng - dLng], [lat + dLat, lng + dLng]);
}

/** Ajuste la vue sur le cercle de recherche (rayon N km). */
function FitGeoRadius({ center, radiusKm, active }) {
  const map = useMap();

  useEffect(() => {
    if (!active || !center || !radiusKm) return;

    const bounds = circleBounds(center.lat, center.lng, radiusKm * 1000);

    const fit = () => {
      if (!map.getContainer()?.isConnected) return;
      map.fitBounds(bounds, { padding: [32, 32], maxZoom: 14, animate: true });
    };

    if (map._loaded) {
      fit();
    } else {
      map.whenReady(fit);
    }
  }, [map, center?.lat, center?.lng, radiusKm, active]);

  return null;
}

function RouteFetcher({ destination, origin, onRoute }) {
  useEffect(() => {
    if (!destination) {
      onRoute(null);
      return;
    }

    let cancelled = false;

    (async () => {
      const start = origin ?? (await getCurrentPosition()) ?? LIBREVILLE_CENTER;
      const url =
        `https://router.project-osrm.org/route/v1/driving/` +
        `${start.lng},${start.lat};${destination.lng},${destination.lat}` +
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
  }, [destination, origin, onRoute]);

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
            icon={createListingPinIcon(isActive, listing.transaction)}
            zIndexOffset={isActive ? 500 : 0}
            eventHandlers={{
              click: () => onSelectListing(String(listing.id)),
            }}
          >
            <Popup
              maxWidth={124}
              minWidth={112}
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
    geoCenter,
    userPosition,
  } = useSearchResults();

  const [routeTarget, setRouteTarget] = useState(null);
  const [routeCoords, setRouteCoords] = useState(null);
  const [routeLoadingId, setRouteLoadingId] = useState(null);

  const searchCenter = userPosition ?? geoCenter;

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

  const mapCenter = useGeoRadius && searchCenter
    ? [searchCenter.lat, searchCenter.lng]
    : [LIBREVILLE_CENTER.lat, LIBREVILLE_CENTER.lng];

  return (
    <div className="relative w-full h-full min-h-[360px]">
      {useGeoRadius && searchCenter && (
        <div className="absolute top-3 left-3 z-[1000] px-3 py-1.5 bg-white/95 rounded-lg shadow text-xs text-gray-600">
          Rayon <strong>{rayonKm} km</strong> autour de vous
        </div>
      )}

      {listingsWithCoords.length === 0 && !useGeoRadius && (
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
        center={mapCenter}
        zoom={FIXED_ZOOM}
        minZoom={useGeoRadius ? 10 : FIXED_ZOOM}
        maxZoom={14}
        className="w-full h-full z-0 rounded-2xl"
        scrollWheelZoom={false}
        doubleClickZoom={false}
        boxZoom={false}
        maxBounds={useGeoRadius ? undefined : LIBREVILLE_BOUNDS}
        maxBoundsViscosity={useGeoRadius ? 0 : 1}
      >
        <MapStabilizer geoMode={useGeoRadius} />
        {useGeoRadius && searchCenter && (
          <FitGeoRadius center={searchCenter} radiusKm={rayonKm} active={useGeoRadius} />
        )}
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {useGeoRadius && searchCenter && (
          <>
            <Circle
              center={[searchCenter.lat, searchCenter.lng]}
              radius={rayonKm * 1000}
              pathOptions={{
                color: '#F28500',
                fillColor: '#F28500',
                fillOpacity: 0.08,
                weight: 2,
                dashArray: '6 4',
              }}
            />
            <Marker
              position={[searchCenter.lat, searchCenter.lng]}
              icon={createUserPositionIcon()}
              zIndexOffset={2000}
              interactive={false}
            />
          </>
        )}

        {routeCoords && (
          <Polyline
            positions={routeCoords}
            pathOptions={{ color: '#008080', weight: 4, opacity: 0.85 }}
          />
        )}

        <RouteFetcher
          destination={routeTarget}
          origin={searchCenter}
          onRoute={handleRouteResult}
        />

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
