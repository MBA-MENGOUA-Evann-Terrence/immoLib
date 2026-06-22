import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faLocationDot,
  faShareNodes,
  faHeart,
} from '@fortawesome/free-solid-svg-icons';

export default function PropertyDetailHeader({ listing }) {
  const badgeClass =
    listing.transaction === 'Vente'
      ? 'bg-blue-50 text-blue-600'
      : 'bg-immo-orange/10 text-immo-orange';

  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-immo-green transition-colors mb-4"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
          Retour à la recherche
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
            {listing.title}
          </h1>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeClass}`}>
            {listing.transaction}
          </span>
        </div>

        <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
          <FontAwesomeIcon icon={faLocationDot} className="text-immo-green shrink-0" />
          {listing.address}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-immo-beige transition-colors"
        >
          <FontAwesomeIcon icon={faShareNodes} className="text-xs" />
          Partager
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-immo-beige transition-colors"
        >
          <FontAwesomeIcon icon={faHeart} className="text-xs" />
          Sauvegarder
        </button>
      </div>
    </div>
  );
}
