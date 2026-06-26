import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBars } from '@fortawesome/free-solid-svg-icons';
import backgroundImage from '../assets/images/background_image.jpg';
import { useListings } from '../context/ListingsContext';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { label: 'Louer', to: '/#resultats' },
  { label: 'Acheter', to: '/#resultats' },
  { label: 'Déposer', to: '/deposer' },
];

export default function Header() {
  const { pagination } = useListings();
  const { isAuthenticated, utilisateur } = useAuth();

  const totalAnnonces = pagination?.total > 0 ? pagination.total : null;

  return (
    <section className="relative overflow-hidden rounded-[28px] lg:rounded-[36px] shadow-card min-h-[300px] sm:min-h-[340px] lg:min-h-[360px]">
      {/* Image de fond sur toute la zone (navbar incluse) */}
      <div className="absolute inset-0">
        <img
          src={backgroundImage}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#1a1a1a]/75" />
      </div>

      {/* Navbar intégrée */}
      <div className="relative z-10 flex items-stretch min-h-[64px] lg:min-h-[72px]">
        {/* Partie gauche blanche avec découpe diagonale */}
        <div
          className="flex flex-1 items-center gap-6 lg:gap-10 pl-4 sm:pl-6 lg:pl-8 pr-16 sm:pr-24 bg-white"
          style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 48px) 100%, 0 100%)' }}
        >
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <span className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center text-white text-sm font-bold">
              I
            </span>
            <span className="text-lg font-bold tracking-tight text-gray-900">ImmoLib</span>
          </Link>

          <ul className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map(({ label, to }) => (
              <li key={label}>
                <Link
                  to={to}
                  className="px-3 lg:px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors whitespace-nowrap"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Partie droite — actions sur fond sombre (image visible) */}
        <div className="flex items-center justify-end gap-2 sm:gap-3 pr-4 sm:pr-6 lg:pr-8 -ml-12 sm:-ml-16 shrink-0">
          <Link
            to="/deposer"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-white/90 hover:text-white transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} className="text-xs" />
            Déposer
          </Link>

          {isAuthenticated ? (
            <span className="hidden sm:inline text-sm font-medium text-white/90 truncate max-w-[120px]">
              {utilisateur?.nom}
            </span>
          ) : (
            <Link
              to="/inscription"
              className="inline-flex items-center px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-white text-gray-900 text-sm font-semibold hover:bg-white/90 transition-colors"
            >
              S&apos;inscrire
            </Link>
          )}

          <button
            type="button"
            className="md:hidden w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
            aria-label="Menu"
          >
            <FontAwesomeIcon icon={faBars} className="text-sm" />
          </button>
        </div>
      </div>

      {/* Contenu hero */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:gap-12 items-end px-4 sm:px-6 lg:px-10 pb-8 sm:pb-10 lg:pb-12 pt-6 lg:pt-8">
        <div className="max-w-xl">
          <h1 className="text-2xl sm:text-3xl lg:text-[2.35rem] font-serif text-white leading-snug tracking-tight">
            Notre engagement : vous aider à trouver votre logement
          </h1>
          <p className="mt-3 text-sm sm:text-base text-white/65 max-w-md">
            Appartements, terrains et maisons disponibles à Libreville et au Gabon.
          </p>
        </div>

        <div className="flex items-stretch gap-6 lg:gap-8 border-t lg:border-t-0 lg:border-l border-white/20 pt-6 lg:pt-0 lg:pl-8">
          <div>
            <p className="text-2xl sm:text-3xl font-semibold text-white tabular-nums">
              {totalAnnonces != null ? `${totalAnnonces}+` : '500+'}
            </p>
            <div className="mt-2 w-8 h-px bg-white/30" />
            <p className="mt-2 text-xs sm:text-sm text-white/55">Annonces actives</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-semibold text-white tabular-nums">10 000+</p>
            <div className="mt-2 w-8 h-px bg-white/30" />
            <p className="mt-2 text-xs sm:text-sm text-white/55">Clients satisfaits</p>
          </div>
        </div>
      </div>
    </section>
  );
}
