import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLocationDot,
  faDoorOpen,
  faRulerCombined,
} from '@fortawesome/free-solid-svg-icons';
import { formatDistance } from '../../utils/geolocation';
/**
 * Miniature annonce — photo, titre, type, prix, quartier, surface, pièces.
 */
export default function PropertyCardCompact({
  listing,
  variant = 'grid',
  isActive = false,
  onHover,
  onLeave,
}) {
  const {
    id,
    image,
    title,
    quartier,
    price,
    beds,
    sqft,
    type,
    transaction,
    distanceM,
  } = listing;
  const isPanel = variant === 'panel';

  return (
    <article
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`group bg-white rounded-2xl border overflow-hidden transition-all duration-200 ${
        isPanel ? 'flex gap-3 p-2.5' : 'flex flex-col'
      } ${
        isActive
          ? 'border-immo-orange shadow-lg ring-2 ring-immo-orange/25'
          : 'border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200'
      }`}
    >
      <Link
        to={`/annonces/${id}`}
        className={`relative shrink-0 overflow-hidden bg-gray-100 ${
          isPanel ? 'w-[92px] h-[92px] rounded-lg' : 'w-full aspect-[4/3]'
        }`}
      >
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      <div className={`flex flex-col min-w-0 flex-1 ${isPanel ? 'justify-center py-0.5' : 'p-3.5 pt-3'}`}>
        <div className="flex flex-wrap items-center gap-1.5 mb-1">
          <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide rounded-md bg-gray-100 text-gray-600">
            {type}
          </span>
          {transaction && (
            <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-immo-green/10 text-immo-green">
              {transaction}
            </span>
          )}
        </div>

        <Link to={`/annonces/${id}`}>
          <h3
            className={`font-semibold text-gray-900 leading-snug line-clamp-2 hover:text-immo-green transition-colors ${
              isPanel ? 'text-sm' : 'text-[15px]'
            }`}
          >
            {title}
          </h3>
        </Link>

        <p className={`mt-1 flex items-center gap-1 text-gray-500 truncate ${isPanel ? 'text-xs' : 'text-sm'}`}>
          <FontAwesomeIcon icon={faLocationDot} className="text-immo-green text-[10px] shrink-0" />
          <span className="truncate">
            {quartier}
            {distanceM != null && (
              <span className="text-immo-green font-medium"> · {formatDistance(distanceM)}</span>
            )}
          </span>
        </p>
        <div className={`flex items-center gap-3 text-gray-400 ${isPanel ? 'mt-1.5 text-[11px]' : 'mt-2 text-xs'}`}>
          <span className="flex items-center gap-1" title="Nombre de pièces">
            <FontAwesomeIcon icon={faDoorOpen} />
            {beds > 0 ? `${beds} pièce${beds > 1 ? 's' : ''}` : '— pièces'}
          </span>
          <span className="flex items-center gap-1" title="Surface">
            <FontAwesomeIcon icon={faRulerCombined} />
            {sqft > 0 ? `${sqft} m²` : '— m²'}
          </span>
        </div>

        <p className={`font-bold text-gray-900 mt-auto ${isPanel ? 'text-sm mt-1.5' : 'text-base mt-2.5'}`}>
          {price}
        </p>
      </div>
    </article>
  );
}
