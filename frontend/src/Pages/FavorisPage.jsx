import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import PageLayout from '../Components/PageLayout';
import PropertyListingGrid from '../Components/PropertyListingGrid';
import { useListings } from '../context/ListingsContext';
import { useFavorites } from '../context/FavoritesContext';

export default function FavorisPage() {
  const { listings } = useListings();
  const { favoriteIds } = useFavorites();

  const favoriteListings = listings.filter((listing) =>
    favoriteIds.includes(listing.id)
  );

  return (
    <PageLayout>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
          <FontAwesomeIcon icon={faHeart} className="text-immo-orange text-xl" />
          Mes favoris
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          {favoriteListings.length === 0
            ? 'Vous n\'avez pas encore sauvegardé d\'annonce.'
            : `${favoriteListings.length} annonce${favoriteListings.length > 1 ? 's' : ''} sauvegardée${favoriteListings.length > 1 ? 's' : ''}`}
        </p>
      </div>

      {favoriteListings.length === 0 ? (
        <div className="bg-immo-beige rounded-[32px] p-12 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-white flex items-center justify-center mb-5">
            <FontAwesomeIcon icon={faHeart} className="text-2xl text-gray-300" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Aucun favori pour le moment
          </h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
            Parcourez les annonces et cliquez sur le cœur pour sauvegarder les biens qui vous intéressent.
          </p>
          <Link
            to="/annonces"
            className="inline-flex items-center gap-2 px-6 py-3 bg-immo-green text-white text-sm font-semibold rounded-xl hover:bg-immo-green-dark transition-colors"
          >
            Voir les annonces
            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </Link>
        </div>
      ) : (
        <PropertyListingGrid
          listings={favoriteListings}
          emptyMessage="Aucun favori ne correspond à vos filtres."
        />
      )}
    </PageLayout>
  );
}
