import { useListings } from '../context/ListingsContext';
import PropertyListingGrid from './PropertyListingGrid';

export default function PropertyListings() {
  const { listings, loading, error } = useListings();

  if (loading) {
    return (
      <p className="mt-6 lg:mt-8 text-sm text-gray-500 text-center py-12">
        Chargement des annonces...
      </p>
    );
  }

  if (error) {
    return (
      <p className="mt-6 lg:mt-8 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-center">
        {error}
      </p>
    );
  }

  return (
    <PropertyListingGrid
      listings={listings}
      className="mt-6 lg:mt-8"
    />
  );
}
