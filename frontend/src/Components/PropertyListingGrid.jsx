import { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faMap,
  faGrip,
} from '@fortawesome/free-solid-svg-icons';
import PropertyCard from './PropertyCard';

const CATEGORIES = ['Tous', 'Villa', 'Appartement', 'Maison', 'Terrain'];

const filterSelectClass =
  'appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-9 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-immo-green/30 focus:border-immo-green cursor-pointer';

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div className="relative min-w-[140px]">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${filterSelectClass} w-full`}
        aria-label={label}
      >
        {options.map((opt) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
      <FontAwesomeIcon
        icon={faChevronDown}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none"
      />
    </div>
  );
}

function sortListings(listings, sortBy) {
  const sorted = [...listings];
  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.priceNumeric - b.priceNumeric);
    case 'price-desc':
      return sorted.sort((a, b) => b.priceNumeric - a.priceNumeric);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    default:
      return sorted;
  }
}

export default function PropertyListingGrid({
  listings,
  emptyMessage = 'Aucune annonce trouvée.',
  className = '',
}) {
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [viewMode, setViewMode] = useState('grid');
  const [location, setLocation] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  const filtered = useMemo(() => {
    let result = listings;

    if (activeCategory !== 'Tous') {
      result = result.filter((l) => l.type === activeCategory);
    }
    if (location) {
      result = result.filter((l) => l.location.includes(location));
    }
    if (propertyType) {
      result = result.filter((l) => l.type === propertyType);
    }
    if (priceRange === '0-500000') {
      result = result.filter((l) => l.priceNumeric <= 500000);
    } else if (priceRange === '500000-1000000') {
      result = result.filter((l) => l.priceNumeric > 500000 && l.priceNumeric <= 1000000);
    } else if (priceRange === '1000000+') {
      result = result.filter((l) => l.priceNumeric > 1000000);
    }

    return sortListings(result, sortBy);
  }, [listings, activeCategory, location, propertyType, priceRange, sortBy]);

  return (
    <section className={`bg-immo-beige rounded-[32px] lg:rounded-[40px] p-5 sm:p-8 ${className}`}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-immo-green text-white'
                  : 'bg-white text-gray-600 hover:text-immo-green'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 self-end lg:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              viewMode === 'map'
                ? 'bg-immo-green text-white'
                : 'bg-white text-gray-600 hover:text-immo-green'
            }`}
          >
            <FontAwesomeIcon icon={faMap} className="text-xs" />
            Carte
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              viewMode === 'grid'
                ? 'bg-immo-green text-white'
                : 'bg-white text-gray-600 hover:text-immo-green'
            }`}
          >
            <FontAwesomeIcon icon={faGrip} className="text-xs" />
            Grille
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-8">
        <FilterSelect
          label="Localisation"
          value={location}
          onChange={setLocation}
          options={[
            { value: '', label: 'Localisation' },
            'Akanda',
            'Glass',
            'Nzeng-Ayong',
            'Libreville',
            'Owendo',
            'Ntoum',
          ]}
        />
        <FilterSelect
          label="Fourchette de prix"
          value={priceRange}
          onChange={setPriceRange}
          options={[
            { value: '', label: 'Fourchette de prix' },
            { value: '0-500000', label: '0 - 500 000 FCFA' },
            { value: '500000-1000000', label: '500 000 - 1 000 000 FCFA' },
            { value: '1000000+', label: '1 000 000+ FCFA' },
          ]}
        />
        <FilterSelect
          label="Type de bien"
          value={propertyType}
          onChange={setPropertyType}
          options={[
            { value: '', label: 'Type de bien' },
            'Appartement',
            'Maison',
            'Villa',
            'Terrain',
          ]}
        />
        <FilterSelect
          label="Trier par"
          value={sortBy}
          onChange={setSortBy}
          options={[
            { value: 'recent', label: 'Trier par' },
            { value: 'price-asc', label: 'Prix croissant' },
            { value: 'price-desc', label: 'Prix décroissant' },
            { value: 'rating', label: 'Meilleures notes' },
          ]}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 px-6">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
          {filtered.map((listing) => (
            <PropertyCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </section>
  );
}
