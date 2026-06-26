import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faPlus,
  faBars,
} from '@fortawesome/free-solid-svg-icons';

const outlinedBtn =
  'inline-flex items-center justify-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border transition-colors whitespace-nowrap';

export default function NavBar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between gap-4 h-16 lg:h-[72px]">
          <Link
            to="/"
            className="flex items-center gap-2.5 shrink-0"
          >
            <span className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-bold">
              I
            </span>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              ImmoLib
            </span>
          </Link>

          <div className="flex items-center justify-end gap-2 sm:gap-3 shrink-0">
            <Link
              to="/connexion"
              className={`${outlinedBtn} hidden sm:inline-flex border-gray-200 text-gray-700 hover:bg-gray-50`}
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

            <Link
              to="/inscription"
              className="inline-flex sm:hidden items-center px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold"
            >
              S&apos;inscrire
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
