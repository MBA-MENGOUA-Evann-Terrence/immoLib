import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const LOCATIONS = [
  'Akanda',
  'Glass',
  'Nzeng-Ayong',
  'Libreville',
  'Owendo',
  'Ntoum',
];

const PROPERTY_TYPES = [
  'Appartement',
  'Maison',
  'Villa',
  'Terrain',
  'Bureau',
  'Commerce',
];

const fieldClass =
  'w-full px-4 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-immo-green/30 focus:border-immo-green placeholder:text-gray-400';

const labelClass = 'block text-xs font-medium text-gray-500 mb-1.5';

function TransactionToggle({ value, onChange }) {
  return (
    <div className="flex rounded-xl bg-immo-beige p-1 w-full sm:w-auto">
      {['Vente', 'Location'].map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`flex-1 sm:flex-none px-5 py-2 text-sm font-semibold rounded-lg transition-colors ${
            value === option
              ? 'bg-immo-green text-white shadow-sm'
              : 'text-gray-600 hover:text-immo-green'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default function SearchBar() {
  const [transaction, setTransaction] = useState('Vente');
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [budget, setBudget] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="relative z-30 w-full max-w-6xl mx-auto px-2 sm:px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/95 backdrop-blur-sm rounded-search shadow-search p-4 sm:p-5 border border-white/60"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
          <div className="lg:col-span-2">
            <span className={labelClass}>Type de transaction</span>
            <TransactionToggle value={transaction} onChange={setTransaction} />
          </div>

          <div className="lg:col-span-3">
            <label htmlFor="search-query" className={labelClass}>
              Recherche libre
            </label>
            <input
              id="search-query"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Mot-clé, quartier, référence..."
              className={fieldClass}
            />
          </div>

          <div className="lg:col-span-2">
            <label htmlFor="search-location" className={labelClass}>
              Localisation
            </label>
            <select
              id="search-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={`${fieldClass} appearance-none cursor-pointer`}
            >
              <option value="">Toutes les villes</option>
              {LOCATIONS.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-2">
            <label htmlFor="search-type" className={labelClass}>
              Type de bien
            </label>
            <select
              id="search-type"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className={`${fieldClass} appearance-none cursor-pointer`}
            >
              <option value="">Tous les types</option>
              {PROPERTY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-2">
            <label htmlFor="search-budget" className={labelClass}>
              Budget (FCFA)
            </label>
            <input
              id="search-budget"
              type="number"
              min="0"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Ex : 500000"
              className={fieldClass}
            />
          </div>

          <div className="lg:col-span-1">
            <button
              type="submit"
              aria-label="Rechercher"
              className="w-full h-[42px] flex items-center justify-center bg-immo-orange text-white rounded-xl hover:bg-immo-orange-dark transition-colors"
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-base" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
