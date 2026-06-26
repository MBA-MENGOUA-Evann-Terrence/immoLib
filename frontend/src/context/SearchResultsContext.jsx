import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { useListings } from './ListingsContext';import { mapTransactionToApiType } from '../mappers/annonce.mapper';
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

/**
 * Filtre client les annonces mappées (type de bien, quartier texte).
 */
function filterListingsClient(listings, filters) {
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

  return result;
}

export function SearchResultsProvider({ children }) {
  const { listings, loading, error, geoMeta, search, searchNearby, fetchListings } = useListings();

  const [viewMode, setViewModeState] = useState('list');  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [activeListingId, setActiveListingId] = useState(null);
  const [geoCenter, setGeoCenter] = useState(null);
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
    fetchListings();
  }, [fetchListings]);

  /**
   * Applique les filtres via l'API (liste + carte synchronisées).
   */
  const applyFilters = useCallback(async (overrides = {}) => {
    const merged = { ...filters, ...overrides };
    const prix = merged.prixMax
      ? { prixMax: merged.prixMax }
      : prixRangeToApi(merged.prixRange);    const apiType = mapTransactionToApiType(merged.transaction);

    if (useGeoRadius && geoCenter) {
      await searchNearby({
        lng: geoCenter.lng,
        lat: geoCenter.lat,
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
  }, [filters, useGeoRadius, geoCenter, search, searchNearby]);

  const enableGeoSearch = useCallback(async () => {
    const pos = (await getCurrentPosition()) ?? LIBREVILLE_CENTER;
    setGeoCenter(LIBREVILLE_CENTER);
    setUseGeoRadius(true);
    await searchNearby({ lng: pos.lng, lat: pos.lat, rayon: filters.rayon });
  }, [filters.rayon, searchNearby]);
  const filteredListings = useMemo(
    () => filterListingsClient(listings, filters),
    [listings, filters]
  );

  const mapCenter = LIBREVILLE_CENTER;
  const rayonKm = geoMeta?.rayonKm ?? filters.rayon;

  useEffect(() => {
    if (geoMeta?.mode === 'nearby') {
      setGeoCenter({ lat: geoMeta.lat, lng: geoMeta.lng });
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
      rayonKm,
      useGeoRadius,
      setUseGeoRadius,
      enableGeoSearch,
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
      rayonKm,
      useGeoRadius,
      enableGeoSearch,
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
