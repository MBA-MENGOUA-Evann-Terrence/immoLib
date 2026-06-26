import PropertyCardCompact from './PropertyCardCompact';
import { useSearchResults } from '../../context/SearchResultsContext';

export default function ListingsListPanel({ emptyMessage }) {
  const {
    filteredListings,
    activeListingId,
    setActiveListingId,
    loading,
  } = useSearchResults();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <p className="text-sm text-gray-500">Chargement des annonces...</p>
      </div>
    );
  }

  if (filteredListings.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-8 text-center">
        <p className="text-sm text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto overscroll-contain px-4 py-4 space-y-3">
      {filteredListings.map((listing) => (
        <div
          key={listing.id}
          role="button"
          tabIndex={0}
          onClick={() => setActiveListingId(String(listing.id))}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setActiveListingId(String(listing.id));
            }
          }}
        >
          <PropertyCardCompact
            listing={listing}
            variant="panel"
            isActive={String(activeListingId) === String(listing.id)}
            onHover={() => setActiveListingId(String(listing.id))}
          />
        </div>
      ))}
    </div>
  );
}
