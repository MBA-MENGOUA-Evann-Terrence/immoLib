import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faPlus,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';

const outlinedBtn =
  'inline-flex items-center justify-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border transition-colors whitespace-nowrap';

function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function NavBar() {
  const navigate = useNavigate();
  const { isAuthenticated, utilisateur, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const displayName = utilisateur?.nom || 'Mon compte';
  const photoUrl = utilisateur?.photo_profil;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between gap-4 h-16 lg:h-[72px]">
          <Link
            to="/"
            className="text-xl font-bold tracking-tight text-immo-green shrink-0"
          >
            ImmoLib
          </Link>

          <div className="flex items-center justify-end gap-2 sm:gap-3 shrink-0 min-w-0">
            <Link
              to={isAuthenticated ? '/deposer' : '/connexion'}
              state={isAuthenticated ? undefined : { from: '/deposer' }}
              className={`${outlinedBtn} border-immo-orange text-immo-orange hover:bg-immo-orange/5`}
            >
              <FontAwesomeIcon icon={faPlus} className="text-xs" />
              <span className="hidden sm:inline">Déposer une annonce</span>
              <span className="sm:hidden">Déposer</span>
            </Link>

            {!isAuthenticated ? (
              <Link
                to="/connexion"
                className={`${outlinedBtn} border-immo-green text-immo-green hover:bg-immo-green/5`}
              >
                <FontAwesomeIcon icon={faUser} className="text-sm" />
                <span className="hidden sm:inline">Se connecter</span>
              </Link>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3 pl-1 sm:pl-2 border-l border-gray-200 min-w-0">
                  <div
                    className="flex items-center gap-2 min-w-0 max-w-[140px] sm:max-w-[200px]"
                    title={displayName}
                  >
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt=""
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-gray-200 shrink-0"
                      />
                    ) : (
                      <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-immo-green/10 text-immo-green text-xs font-bold flex items-center justify-center shrink-0">
                        {getInitials(displayName)}
                      </span>
                    )}
                    <span className="hidden md:inline text-sm font-medium text-gray-800 truncate">
                      {displayName}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className={`${outlinedBtn} border-gray-200 text-gray-600 hover:bg-immo-beige hover:text-gray-900 px-3 sm:px-4`}
                    title="Se déconnecter"
                  >
                    <FontAwesomeIcon icon={faRightFromBracket} className="text-sm" />
                    <span className="hidden sm:inline">Déconnexion</span>
                  </button>
                </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
