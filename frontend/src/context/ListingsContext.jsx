import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { INITIAL_LISTINGS, buildListing } from '../data/listings';

const USER_LISTINGS_KEY = 'immolib_user_listings';

const ListingsContext = createContext(null);

function readUserListings() {
  try {
    const stored = localStorage.getItem(USER_LISTINGS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function ListingsProvider({ children }) {
  const [userListings, setUserListings] = useState(readUserListings);

  useEffect(() => {
    localStorage.setItem(USER_LISTINGS_KEY, JSON.stringify(userListings));
  }, [userListings]);

  const allListings = useMemo(
    () => [...INITIAL_LISTINGS, ...userListings],
    [userListings]
  );

  const getListingById = useCallback(
    (id) => allListings.find((listing) => listing.id === Number(id)),
    [allListings]
  );

  const addListing = useCallback((formData) => {
    const nextId =
      allListings.length > 0
        ? Math.max(...allListings.map((l) => l.id)) + 1
        : 1;
    const newListing = buildListing(formData, nextId);
    setUserListings((prev) => [...prev, newListing]);
    return newListing;
  }, [allListings]);

  const value = useMemo(
    () => ({ listings: allListings, getListingById, addListing }),
    [allListings, getListingById, addListing]
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
    throw new Error('useListings must be used within ListingsProvider');
  }
  return context;
}
