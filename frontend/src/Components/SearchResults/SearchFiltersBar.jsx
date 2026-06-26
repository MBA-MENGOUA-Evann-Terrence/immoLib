import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faChevronDown,
  faLocationCrosshairs,
  faRotateLeft,
  faChartColumn,
} from '@fortawesome/free-solid-svg-icons';
import { useSearchResults } from '../../context/SearchResultsContext';
import ViewModeToggle from './ViewModeToggle';
const QUARTIERS = ['Akanda', 'Glass', 'Nzeng-Ayong', 'Libreville', 'Owendo', 'Ntoum'];
const PROPERTY_TYPES = ['Appartement', 'Maison', 'Villa', 'Terrain', 'Bureau', 'Commerce'];
const PRIX_RANGES = [
  { value: '', label: 'Tous les prix' },
  { value: '0-500000', label: 'Jusqu\'à 500 000 FCFA' },
  { value: '500000-1000000', label: '500 000 – 1 000 000 FCFA' },
  { value: '1000000+', label: 'Plus de 1 000 000 FCFA' },
];
const RAYONS = [5, 10, 15, 25, 50];

const selectClass =
  'appearance-none w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-immo-green/30 focus:border-immo-green cursor-pointer';

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div className="relative min-w-0">
      <select value={value} onChange={(e) => onChange(e.target.value)} className={selectClass} aria-label={label}>
        {options.map((opt) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
      <FontAwesomeIcon
        icon={faChevronDown}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 pointer-events-none"
      />
    </div>
  );
}

export default function SearchFiltersBar({
  resultCount = 0,
  embedded = false,
  showPrixMoyen = false,
  onTogglePrixMoyen,
}) {
  const {
    filters,
    updateFilter,
    applyFilters,
    resetFilters,
    enableGeoSearch,
    useGeoRadius,
    geoCenter,
    searchNearbyFromCenter,
    loading,
  } = useSearchResults();

  const handleSubmit = (e) => {
    e.preventDefault();
    applyFilters();
  };

  return (
    <div className={`${embedded ? 'relative' : 'sticky top-16 lg:top-[72px]'} z-10 bg-white border-b border-gray-100`}>
      <div className={`${embedded ? 'px-4 sm:px-6 py-4' : 'max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4'}`}>        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            <div className="relative flex-1 min-w-0">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
              />
              <input
                type="text"
                value={filters.q}
                onChange={(e) => updateFilter('q', e.target.value)}
                placeholder="Rechercher par mot-clé, quartier..."
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-immo-green/30 focus:border-immo-green"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:items-center gap-2 flex-1">
              <FilterSelect
                label="Quartier"
                value={filters.quartier}
                onChange={(v) => updateFilter('quartier', v)}
                options={[{ value: '', label: 'Quartier' }, ...QUARTIERS]}
              />
              <FilterSelect
                label="Prix"
                value={filters.prixRange}
                onChange={(v) => updateFilter('prixRange', v)}
                options={PRIX_RANGES}
              />
              <FilterSelect
                label="Type de bien"
                value={filters.propertyType}
                onChange={(v) => updateFilter('propertyType', v)}
                options={[{ value: '', label: 'Type de bien' }, ...PROPERTY_TYPES]}
              />
              <FilterSelect
                label="Transaction"
                value={filters.transaction}
                onChange={(v) => updateFilter('transaction', v)}
                options={[
                  { value: '', label: 'Transaction' },
                  { value: 'Vente', label: 'Vente' },
                  { value: 'Location', label: 'Location' },
                ]}
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 text-sm font-semibold bg-immo-green text-white rounded-lg hover:bg-immo-green-dark transition-colors disabled:opacity-60"
              >
                Rechercher
              </button>
              <button
                type="button"
                onClick={resetFilters}
                disabled={loading}
                title="Réinitialiser tous les filtres"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border border-gray-200 text-gray-600 rounded-lg hover:bg-immo-beige transition-colors disabled:opacity-60"
              >
                <FontAwesomeIcon icon={faRotateLeft} className="text-xs" />
                Réinitialiser
              </button>
              <ViewModeToggle />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <FilterSelect
              label="Rayon"
              value={String(filters.rayon)}
              onChange={(v) => {
                const rayon = Number(v);
                updateFilter('rayon', rayon);
                if (useGeoRadius && geoCenter) {
                  searchNearbyFromCenter(rayon);
                }
              }}
              options={RAYONS.map((r) => ({ value: String(r), label: `Rayon ${r} km` }))}
            />
            <button
              type="button"
              onClick={enableGeoSearch}
              disabled={loading}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors disabled:opacity-60 ${
                useGeoRadius
                  ? 'border-immo-green bg-immo-green/10 text-immo-green'
                  : 'border-gray-200 text-gray-600 hover:bg-immo-beige'
              }`}
            >
              <FontAwesomeIcon icon={faLocationCrosshairs} />
              Zone autour de moi
            </button>
            {onTogglePrixMoyen && (
              <button
                type="button"
                onClick={onTogglePrixMoyen}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                  showPrixMoyen
                    ? 'border-immo-orange bg-immo-orange/10 text-immo-orange'
                    : 'border-gray-200 text-gray-600 hover:bg-immo-beige'
                }`}
              >
                <FontAwesomeIcon icon={faChartColumn} className="text-xs" />
                {showPrixMoyen ? 'Masquer prix m²' : 'Prix m² / quartier'}
              </button>
            )}
            <span className="text-gray-400 ml-auto">
              {loading ? 'Chargement...' : `${resultCount} résultat${resultCount > 1 ? 's' : ''}`}
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
