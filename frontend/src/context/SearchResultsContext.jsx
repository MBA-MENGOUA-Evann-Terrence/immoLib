import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { useListings } from './ListingsContext';
import { mapTransactionToApiType } from '../mappers/annonce.mapper';
import { getCurrentPosition, LIBREVILLE_CENTER } from '../utils/geolocation';

const SearchResultsContext = createContext(null);

const DEFAULT_FILTERS = {
  q: '',
  quartier: '',
  prixRange: '',
  propertyType: '',
  transaction: '',
  rayon: 10,
};

function prixRangeToApi(range) {
  switch (range) {
    case '0-500000':
      return { prixMax: 500000 };
    case '500000-1000000':
      return { prixMin: 500000, prixMax: 1000000 };
    case '1000000+':
      return { prixMin: 1000000 };
    default:
      return {};
  }
}

function filterListingsClient(listings, filters, sortByDistance = false) {
  let result = listings;

  if (filters.propertyType) {
    const pt = filters.propertyType.toLowerCase();
    result = result.filter(
      (l) =>
        l.type?.toLowerCase().includes(pt) ||
        l.title?.toLowerCase().includes(pt) ||
        l.description?.toLowerCase().includes(pt)
    );
  }

  if (filters.quartier) {
    const q = filters.quartier.toLowerCase();
    result = result.filter(
      (l) =>
        l.quartier?.toLowerCase().includes(q) ||
        l.location?.toLowerCase().includes(q)
    );
  }

  if (filters.transaction) {
    result = result.filter((l) => l.transaction === filters.transaction);
  }

  if (sortByDistance) {
    const maxM = filters.rayon * 1000;
    result = result.filter(
      (l) => l.distanceM == null || l.distanceM <= maxM
    );
    result = [...result].sort(
      (a, b) => (a.distanceM ?? Infinity) - (b.distanceM ?? Infinity)
    );
  }

  return result;
}

export function SearchResultsProvider({ children }) {
  const { listings, loading, error, geoMeta, search, searchNearby, fetchListings } = useListings();

  const [viewMode, setViewModeState] = useState('list');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [activeListingId, setActiveListingId] = useState(null);
  const [geoCenter, setGeoCenter] = useState(null);
  const [userPosition, setUserPosition] = useState(null);
  const [useGeoRadius, setUseGeoRadius] = useState(false);

  const setViewMode = useCallback((mode) => {
    setViewModeState(mode === 'map' ? 'map' : 'list');
  }, []);

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setUseGeoRadius(false);
    setGeoCenter(null);
    setUserPosition(null);
    fetchListings();
  }, [fetchListings]);

  const applyFilters = useCallback(async (overrides = {}) => {
    const merged = { ...filters, ...overrides };
    const prix = merged.prixMax
      ? { prixMax: merged.prixMax }
      : prixRangeToApi(merged.prixRange);
    const apiType = mapTransactionToApiType(merged.transaction);

    if (useGeoRadius) {
      const center = userPosition ?? geoCenter ?? (await getCurrentPosition()) ?? LIBREVILLE_CENTER;
      setUserPosition(center);
      setGeoCenter(center);
      setUseGeoRadius(true);
      await searchNearby({
        lng: center.lng,
        lat: center.lat,
        rayon: merged.rayon,
      });
      return;
    }

    await search({
      q: merged.q.trim() || undefined,
      type: apiType,
      quartiers: merged.quartier || undefined,
      propertyType: merged.propertyType || undefined,
      ...prix,
    });
  }, [filters, useGeoRadius, geoCenter, userPosition, search, searchNearby]);

  const enableGeoSearch = useCallback(async () => {
    const pos = (await getCurrentPosition()) ?? LIBREVILLE_CENTER;
    setUserPosition(pos);
    setGeoCenter(pos);
    setUseGeoRadius(true);
    await searchNearby({ lng: pos.lng, lat: pos.lat, rayon: filters.rayon });
  }, [filters.rayon, searchNearby]);

  const searchNearbyFromCenter = useCallback(
    async (rayon) => {
      const center = userPosition ?? geoCenter;
      if (!center) return;
      await searchNearby({ lng: center.lng, lat: center.lat, rayon });
    },
    [userPosition, geoCenter, searchNearby]
  );

  const filteredListings = useMemo(
    () => filterListingsClient(listings, filters, useGeoRadius),
    [listings, filters, useGeoRadius]
  );

  const mapCenter = useGeoRadius && (userPosition ?? geoCenter)
    ? (userPosition ?? geoCenter)
    : LIBREVILLE_CENTER;
  const rayonKm = useGeoRadius ? (geoMeta?.rayonKm ?? filters.rayon) : filters.rayon;

  useEffect(() => {
    if (geoMeta?.mode === 'nearby') {
      const center = { lat: geoMeta.lat, lng: geoMeta.lng };
      setGeoCenter(center);
      setUserPosition((prev) => prev ?? center);
      setUseGeoRadius(true);
    }
  }, [geoMeta]);

  const value = useMemo(
    () => ({
      viewMode,
      setViewMode,
      filters,
      updateFilter,
      setFilters,
      applyFilters,
      resetFilters,
      activeListingId,
      setActiveListingId,
      filteredListings,
      geoCenter: mapCenter,
      userPosition: useGeoRadius ? userPosition : null,
      rayonKm,
      useGeoRadius,
      setUseGeoRadius,
      enableGeoSearch,
      searchNearbyFromCenter,
      loading,
      error,
    }),
    [
      viewMode,
      setViewMode,
      filters,
      updateFilter,
      applyFilters,
      resetFilters,
      activeListingId,
      filteredListings,
      mapCenter,
      userPosition,
      rayonKm,
      useGeoRadius,
      enableGeoSearch,
      searchNearbyFromCenter,
      loading,
      error,
    ]
  );

  return (
    <SearchResultsContext.Provider value={value}>
      {children}
    </SearchResultsContext.Provider>
  );
}

export function useSearchResults() {
  const ctx = useContext(SearchResultsContext);
  if (!ctx) {
    throw new Error('useSearchResults doit être utilisé dans SearchResultsProvider');
  }
  return ctx;
}
