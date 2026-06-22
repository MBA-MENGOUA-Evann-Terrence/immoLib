import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLocationDot,
  faArrowUpRightFromSquare,
  faStar,
  faHeart,
} from '@fortawesome/free-solid-svg-icons';
import { useFavorites } from '../context/FavoritesContext';

export default function PropertyCard({ listing }) {
  const { id, image, title, location, price, agent, rating } = listing;
  const { isFavorite, toggleFavorite } = useFavorites();
  const saved = isFavorite(id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(id);
  };

  return (
    <article className="group relative aspect-[3/4] rounded-[24px] overflow-hidden shadow-card">
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      <button
        type="button"
        onClick={handleFavoriteClick}
        className={`absolute top-3 left-3 z-10 w-9 h-9 rounded-full flex items-center justify-center shadow-sm transition-colors ${
          saved
            ? 'bg-immo-orange text-white'
            : 'bg-white/90 text-gray-500 hover:text-immo-orange'
        }`}
        aria-label={saved ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      >
        <FontAwesomeIcon icon={faHeart} className={`text-xs ${saved ? 'scale-110' : ''}`} />
      </button>

      <div className="absolute inset-x-0 bottom-0 p-3">
        <div className="relative backdrop-blur-md bg-white/75 rounded-2xl p-4 pt-5">
          <Link
            to={`/annonces/${id}`}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-immo-orange hover:bg-immo-orange hover:text-white transition-colors"
            aria-label={`Voir ${title}`}
          >
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-xs" />
          </Link>

          <h3 className="text-base font-bold text-gray-900 pr-10 leading-snug">
            <Link to={`/annonces/${id}`} className="hover:text-immo-green transition-colors">
              {title}
            </Link>
          </h3>

          <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
            <FontAwesomeIcon icon={faLocationDot} className="text-immo-green text-xs shrink-0" />
            <span className="truncate">{location}</span>
          </p>

          <div className="mt-4 flex items-end justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-xs font-semibold text-white"
                style={{ backgroundColor: agent.color }}
                aria-hidden="true"
              >
                {agent.initials}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-800 truncate">{agent.name}</p>
                <p className="flex items-center gap-1 text-xs text-gray-500">
                  <FontAwesomeIcon icon={faStar} className="text-immo-orange text-[10px]" />
                  <span>{rating} Avis</span>
                </p>
              </div>
            </div>

            <p className="text-base sm:text-lg font-bold text-gray-900 shrink-0">
              {price}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
