import { Link } from 'react-router-dom';
import { formatDistance } from '../../utils/geolocation';

/**
 * Popup carte ultra-compacte au clic sur un marqueur.
 */
export default function MapListingPopup({ listing, onRoute, routeLoading }) {
  const meta = [
    listing.beds > 0 ? `${listing.beds} p.` : null,
    listing.sqft > 0 ? `${listing.sqft} m²` : null,
    listing.distanceM != null ? formatDistance(listing.distanceM) : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className="w-[112px] font-sans leading-none">
      {listing.image && (
        <img
          src={listing.image}
          alt=""
          className="w-full h-9 object-cover rounded-[6px] mb-1"
        />
      )}
      <p className="font-semibold text-[10px] text-gray-900 line-clamp-2 leading-snug">
        {listing.title}
      </p>
      <p className="text-immo-green font-bold text-[10px] mt-1">{listing.price}</p>
      {listing.quartier && (
        <p className="text-[9px] text-gray-500 mt-0.5 truncate">{listing.quartier}</p>
      )}
      {meta && <p className="text-[8px] text-gray-400 mt-0.5 truncate">{meta}</p>}
      <div className="flex gap-1 mt-1.5">
        <button
          type="button"
          onClick={onRoute}
          disabled={routeLoading}
          className="flex-1 text-center text-[8px] font-medium py-1 border border-immo-green text-immo-green rounded-[5px] hover:bg-immo-green/5 disabled:opacity-50"
        >
          {routeLoading ? '…' : 'Route'}
        </button>
        <Link
          to={`/annonces/${listing.id}`}
          className="flex-1 text-center text-[8px] font-medium py-1 bg-gray-900 text-white rounded-[5px] hover:bg-gray-800"
        >
          Voir
        </Link>
      </div>
    </div>
  );
}
