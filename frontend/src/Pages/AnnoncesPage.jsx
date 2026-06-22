import { Link } from 'react-router-dom';
import PageLayout from '../Components/PageLayout';
import PropertyListingGrid from '../Components/PropertyListingGrid';
import { useListings } from '../context/ListingsContext';

export default function AnnoncesPage() {
  const { listings } = useListings();

  return (
    <PageLayout>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Toutes les annonces
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          {listings.length} bien{listings.length > 1 ? 's' : ''} disponible{listings.length > 1 ? 's' : ''} au Gabon
        </p>
      </div>

      <PropertyListingGrid
        listings={listings}
        emptyMessage="Aucune annonce ne correspond à vos critères."
      />
    </PageLayout>
  );
}
