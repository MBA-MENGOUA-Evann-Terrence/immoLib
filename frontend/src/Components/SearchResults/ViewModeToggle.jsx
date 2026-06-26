import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faMap } from '@fortawesome/free-solid-svg-icons';
import { useSearchResults } from '../../context/SearchResultsContext';

export default function ViewModeToggle() {
  const { viewMode, setViewMode } = useSearchResults();

  return (
    <div className="flex rounded-lg border border-gray-200 p-0.5 bg-gray-50">
      <button
        type="button"
        onClick={() => setViewMode('list')}
        className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          viewMode === 'list'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        aria-pressed={viewMode === 'list'}
      >
        <FontAwesomeIcon icon={faList} className="text-xs" />
        <span className="hidden sm:inline">Liste</span>
      </button>
      <button
        type="button"
        onClick={() => setViewMode('map')}
        className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          viewMode === 'map'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        aria-pressed={viewMode === 'map'}
      >
        <FontAwesomeIcon icon={faMap} className="text-xs" />
        <span className="hidden sm:inline">Carte</span>
      </button>
    </div>
  );
}
