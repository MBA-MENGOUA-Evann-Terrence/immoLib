import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import * as annoncesService from '../api/services/annonces.service.js';
import { mapAnnonceToListing, mapFormToAnnoncePayload } from '../mappers/annonce.mapper.js';

const ListingsContext = createContext(null);

function filtrerAnnoncesClient(annonces, filtres) {
  let result = annonces;

  if (filtres.type) {
    result = result.filter((a) => a.type === filtres.type);
  }
  if (filtres.prixMax) {
    result = result.filter((a) => a.prix <= Number(filtres.prixMax));
  }
  if (filtres.prixMin) {
    result = result.filter((a) => a.prix >= Number(filtres.prixMin));
  }

  return result;
}

export function ListingsProvider({ children }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20 });
  const [geoMeta, setGeoMeta] = useState(null);

  const mapList = useCallback(
    (annonces) => annonces.map((doc) => mapAnnonceToListing(doc)),
    []
  );

  const fetchListings = useCallback(async (filtres = {}) => {
    setLoading(true);
    setError(null);
    setGeoMeta(null);
    try {
      const data = await annoncesService.getAnnonces(filtres);
      setListings(mapList(data.annonces));
      setPagination({ total: data.total, page: data.page, limit: data.limit });
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [mapList]);

  const search = useCallback(async (filtres = {}) => {
    setLoading(true);
    setError(null);
    setGeoMeta(null);
    try {
      const { q, type, prixMax, prixMin, quartiers, propertyType } = filtres;
      const searchQuery = [q, propertyType].filter(Boolean).join(' ').trim();
      const apiFiltres = { type, prixMax, prixMin, quartiers };
      const hasStructuredFilters = Boolean(type || prixMax || prixMin || quartiers);

      let annonces;

      if (searchQuery && !hasStructuredFilters) {
        const data = await annoncesService.rechercheTexte(searchQuery);
        annonces = data.annonces;
        setPagination({ total: data.total, page: 1, limit: data.total });
      } else if (!searchQuery && hasStructuredFilters) {
        const data = await annoncesService.getAnnonces(apiFiltres);
        annonces = data.annonces;
        setPagination({ total: data.total, page: data.page, limit: data.limit });
      } else if (searchQuery && hasStructuredFilters) {
        const data = await annoncesService.getAnnonces(apiFiltres);
        annonces = filtrerAnnoncesClient(data.annonces, apiFiltres);
        const lowerQ = searchQuery.toLowerCase();
        annonces = annonces.filter(
          (a) =>
            a.titre?.toLowerCase().includes(lowerQ) ||
            a.description?.toLowerCase().includes(lowerQ)
        );
        setPagination({ total: annonces.length, page: 1, limit: annonces.length });
      } else {
        const data = await annoncesService.getAnnonces();
        annonces = data.annonces;
        setPagination({ total: data.total, page: data.page, limit: data.limit });
      }

      setListings(mapList(annonces));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [mapList]);

  /**
   * Recherche géospatiale ($near) autour d'une position.
   * @param {{ lng: number, lat: number, rayon?: number }} params
   */
  const searchNearby = useCallback(async ({ lng, lat, rayon = 10 }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await annoncesService.getAnnoncesProches({ lng, lat, rayon });
      setListings(mapList(data.annonces));
      setPagination({ total: data.total, page: 1, limit: data.total });
      setGeoMeta({
        mode: 'nearby',
        lat: Number(lat),
        lng: Number(lng),
        rayonKm: data.rayonKm ?? Number(rayon),
      });
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [mapList]);

  const fetchListingById = useCallback(async (id) => {
    const doc = await annoncesService.getAnnonceParId(id);
    const listing = mapAnnonceToListing(doc);
    setListings((prev) => {
      const idx = prev.findIndex((l) => String(l.id) === String(id));
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = listing;
        return next;
      }
      return [...prev, listing];
    });
    return listing;
  }, []);

  const getListingById = useCallback(
    (id) => listings.find((listing) => String(listing.id) === String(id)),
    [listings]
  );

  const addListing = useCallback(async (formData) => {
    const payload = mapFormToAnnoncePayload(formData);
    const data = await annoncesService.creerAnnonce(payload);
    const listing = mapAnnonceToListing(data.annonce);
    setListings((prev) => [listing, ...prev]);
    return listing;
  }, []);

  useEffect(() => {
    fetchListings().catch(() => {});
  }, [fetchListings]);

  const value = useMemo(
    () => ({
      listings,
      loading,
      error,
      pagination,
      geoMeta,
      fetchListings,
      search,
      searchNearby,
      getListingById,
      fetchListingById,
      addListing,
    }),
    [
      listings,
      loading,
      error,
      pagination,
      geoMeta,
      fetchListings,
      search,
      searchNearby,
      getListingById,
      fetchListingById,
      addListing,
    ]
  );

  return (
    <ListingsContext.Provider value={value}>
      {children}
    </ListingsContext.Provider>
  );
}

export function useListings() {
  const context = useContext(ListingsContext);
  if (!context) {
    throw new Error('useListings doit être utilisé dans ListingsProvider');
  }
  return context;
}
