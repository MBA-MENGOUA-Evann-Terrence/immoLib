import { Link, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faPlus,
  faBars,
} from '@fortawesome/free-solid-svg-icons';

const navItems = [
  { label: 'Accueil', to: '/', end: true },
  { label: 'Annonces', to: '/annonces' },
  { label: 'Favoris', to: '/favoris' },
];

const navLinkClass = ({ isActive }) =>
  `px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
    isActive
      ? 'bg-immo-beige text-immo-green'
      : 'text-gray-500 hover:text-gray-900'
  }`;

const outlinedBtn =
  'inline-flex items-center justify-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border transition-colors whitespace-nowrap';

export default function NavBar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_auto_1fr] items-center gap-4 h-16 lg:h-[72px]">
          <Link
            to="/"
            className="text-xl font-bold tracking-tight text-immo-green shrink-0"
          >
            ImmoLib
          </Link>

          <ul className="hidden lg:flex items-center justify-center gap-1">
            {navItems.map(({ label, to, end }) => (
              <li key={to}>
                <NavLink to={to} end={end} className={navLinkClass}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-end gap-2 sm:gap-3 shrink-0">
            <Link
              to="/connexion"
              className={`${outlinedBtn} hidden sm:inline-flex border-immo-green text-immo-green hover:bg-immo-green/5`}
            >
              <FontAwesomeIcon icon={faUser} className="text-sm" />
              Se connecter
            </Link>

            <Link
              to="/deposer"
              className={`${outlinedBtn} hidden md:inline-flex border-immo-orange text-immo-orange hover:bg-immo-orange/5`}
            >
              <FontAwesomeIcon icon={faPlus} className="text-xs" />
              Déposer une annonce
            </Link>

            <button
              type="button"
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-immo-beige transition-colors lg:hidden"
              aria-label="Menu"
            >
              <FontAwesomeIcon icon={faBars} className="text-gray-700 text-sm" />
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
