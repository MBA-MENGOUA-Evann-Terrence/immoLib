import { useState } from 'react';
import SearchFiltersBar from './SearchFiltersBar';
import PrixMoyenM2ParQuartier from './PrixMoyenM2ParQuartier';
import PropertyCardCompact from './PropertyCardCompact';
import ListingsListPanel from './ListingsListPanel';
import SearchResultsMap from './SearchResultsMap';
import { useSearchResults } from '../../context/SearchResultsContext';

export default function HomeListingsSection() {
  const [showPrixMoyen, setShowPrixMoyen] = useState(false);

  const {
    viewMode,
    filteredListings,
    loading,
    error,
    resetFilters,
    useGeoRadius,
    rayonKm,
  } = useSearchResults();

  const emptyMessage = useGeoRadius
    ? `Aucune annonce dans un rayon de ${rayonKm} km autour de votre position.`
    : 'Aucune annonce ne correspond à vos critères.';

  return (
    <section id="resultats" className="mt-8 lg:mt-10 scroll-mt-24">
      <div className="rounded-[28px] lg:rounded-[32px] bg-gray-50 border border-gray-100 overflow-hidden">
        <SearchFiltersBar
          embedded
          resultCount={filteredListings.length}
          showPrixMoyen={showPrixMoyen}
          onTogglePrixMoyen={() => setShowPrixMoyen((v) => !v)}
        />
        {showPrixMoyen && <PrixMoyenM2ParQuartier />}

        {error && (
          <div className="px-4 sm:px-6 pt-4">
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              {error}
            </p>
          </div>
        )}

        {viewMode === 'list' ? (
          <div className="p-4 sm:p-6 lg:p-8">
            {loading ? (
              <p className="text-sm text-gray-500 text-center py-16">Chargement des annonces...</p>
            ) : filteredListings.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 mb-4">{emptyMessage}</p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-sm text-immo-green font-medium hover:underline"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
                {filteredListings.map((listing) => (
                  <PropertyCardCompact key={listing.id} listing={listing} variant="grid" />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row h-[560px] lg:h-[calc(100vh-260px)] min-h-[440px]">
            <aside className="w-full lg:w-[30%] xl:w-[28%] border-b lg:border-b-0 lg:border-r border-gray-200 bg-white h-[38%] lg:h-full overflow-hidden shrink-0">
              <ListingsListPanel emptyMessage={emptyMessage} />
            </aside>
            <section className="flex-1 p-2 lg:p-3 bg-gray-100 min-h-[280px] lg:min-h-0">
              <SearchResultsMap />
            </section>
          </div>
        )}
      </div>
    </section>
  );
}
