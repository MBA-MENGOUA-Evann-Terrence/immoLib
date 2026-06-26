import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FaGoogle, FaFacebookF } from 'react-icons/fa6';
import AuthHero from '../Components/AuthHero';
import { useAuth } from '../context/AuthContext';

const inputClass =
  'w-full px-4 py-3 text-sm text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-immo-green/30 focus:border-immo-green placeholder:text-gray-400';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      setFormError(err.message);
    }
  };

  const displayError = formError || error;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <AuthHero />

      <div className="flex-1 flex flex-col min-h-screen bg-white">
        <div className="flex items-center justify-between p-6 lg:p-8">
          <Link to="/" className="text-xl font-bold text-immo-green lg:hidden">
            ImmoLib
          </Link>
          <Link
            to="/connexion"
            className="ml-auto px-5 py-2 text-sm font-medium bg-gray-900 text-white rounded-full"
          >
            Se connecter
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 pb-10">
          <div className="w-full max-w-md">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
              Bon retour sur ImmoLib !
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Connectez-vous à votre compte
            </p>

            {displayError && (
              <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                {displayError}
              </p>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm text-gray-600 mb-2">
                  Votre e-mail
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemple@email.com"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm text-gray-600 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`${inputClass} pr-12`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-immo-green focus:ring-immo-green"
                  />
                  Se souvenir de moi
                </label>
                <Link to="/mot-de-passe-oublie" className="text-gray-500 hover:text-immo-green transition-colors">
                  Mot de passe oublié ?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-60"
              >
                {loading ? 'Connexion...' : 'Connexion'}
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-xs text-gray-400 uppercase tracking-wide">
                  Connexion instantanée
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-immo-beige transition-colors"
              >
                <FaGoogle className="text-base" />
                Continuer avec Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-immo-beige transition-colors"
              >
                <FaFacebookF className="text-base" />
                Continuer avec Facebook
              </button>
            </div>

            <p className="mt-8 text-center text-sm text-gray-500">
              Vous n&apos;avez pas de compte ?{' '}
              <Link to="/inscription" className="text-immo-green font-medium hover:underline">
                S&apos;inscrire
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
