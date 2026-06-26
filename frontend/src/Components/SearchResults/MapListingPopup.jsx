import { Link } from 'react-router-dom';

/**
 * Popup carte compacte au clic sur un marqueur.
 */
export default function MapListingPopup({ listing, onRoute, routeLoading }) {
  return (
    <div className="w-[148px] font-sans leading-tight">
      {listing.image && (
        <img
          src={listing.image}
          alt=""
          className="w-full h-14 object-cover rounded-md mb-1.5"
        />
      )}
      <p className="text-[9px] font-semibold uppercase text-gray-400 truncate">{listing.type}</p>
      <p className="font-semibold text-[11px] text-gray-900 line-clamp-2 mt-0.5">{listing.title}</p>
      <p className="text-immo-green font-bold text-[11px] mt-1">{listing.price}</p>
      <p className="text-[10px] text-gray-500 mt-0.5 truncate">{listing.quartier}</p>
      <p className="text-[9px] text-gray-400">
        {listing.beds > 0 ? `${listing.beds} p.` : ''}
        {listing.sqft > 0 ? ` · ${listing.sqft} m²` : ''}
      </p>
      <div className="flex flex-col gap-1 mt-1.5">
        <button
          type="button"
          onClick={onRoute}
          disabled={routeLoading}
          className="w-full text-center text-[10px] font-medium py-1 px-2 border border-immo-green text-immo-green rounded-md hover:bg-immo-green/5 disabled:opacity-50"
        >
          {routeLoading ? 'Calcul...' : 'Itinéraire'}
        </button>
        <Link
          to={`/annonces/${listing.id}`}
          className="block text-center text-[10px] font-medium py-1 px-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
        >
          Détail
        </Link>
      </div>
    </div>
  );
}
