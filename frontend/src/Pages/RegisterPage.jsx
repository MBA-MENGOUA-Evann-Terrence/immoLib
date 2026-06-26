import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FaGoogle, FaFacebookF } from 'react-icons/fa6';
import AuthHero from '../Components/AuthHero';
import { useAuth } from '../context/AuthContext';

const inputClass =
  'w-full px-4 py-3 text-sm text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-immo-green/30 focus:border-immo-green placeholder:text-gray-400';

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, loading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (password !== confirmPassword) {
      setFormError('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      await register({
        nom,
        email,
        password,
        telephone: telephone || undefined,
      });
      navigate(location.state?.from || '/');
    } catch (err) {
      setFormError(err.message);
    }
  };

  const displayError = formError || error;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <AuthHero />

      <div className="flex-1 flex flex-col min-h-screen bg-immo-beige/40">
        <div className="flex items-center justify-between p-6 lg:p-8 border-b border-immo-beige-dark/30 bg-white">
          <Link to="/" className="text-xl font-bold text-immo-green">
            ImmoLib
          </Link>
          <Link
            to="/connexion"
            state={location.state}
            className="px-5 py-2 text-sm font-medium border border-immo-green text-immo-green rounded-xl hover:bg-immo-green/5 transition-colors"
          >
            Se connecter
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-10">
          <div className="w-full max-w-md bg-white rounded-2xl border border-immo-beige-dark/40 shadow-card p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
              Rejoignez <span className="text-immo-green">ImmoLib</span> !
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Créez votre compte gratuitement
            </p>

            {displayError && (
              <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                {displayError}
              </p>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="fullname" className="block text-sm text-gray-600 mb-2">
                  Nom complet
                </label>
                <input
                  id="fullname"
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Jean Dupont"
                  className={inputClass}
                  required
                />
              </div>

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
                <label htmlFor="telephone" className="block text-sm text-gray-600 mb-2">
                  Téléphone (optionnel)
                </label>
                <input
                  id="telephone"
                  type="tel"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder="+241 06X XX XX XX"
                  className={inputClass}
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

              <div>
                <label htmlFor="confirm-password" className="block text-sm text-gray-600 mb-2">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`${inputClass} pr-12`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={showConfirm ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    <FontAwesomeIcon icon={showConfirm ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>

              <label className="flex items-start gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-immo-green focus:ring-immo-green"
                />
                J&apos;accepte les{' '}
                <Link to="/conditions" className="text-immo-green hover:underline">
                  conditions d&apos;utilisation
                </Link>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-immo-orange text-white text-sm font-semibold rounded-xl hover:bg-immo-orange-dark transition-colors disabled:opacity-60"
              >
                {loading ? 'Création...' : 'Créer mon compte'}
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-xs text-gray-400 uppercase tracking-wide">
                  Inscription rapide
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-3 border border-immo-beige-dark/60 rounded-xl text-sm text-gray-600 hover:border-immo-green/40 hover:bg-immo-green/5 transition-colors"
              >
                <FaGoogle className="text-base" />
                Continuer avec Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-3 border border-immo-beige-dark/60 rounded-xl text-sm text-gray-600 hover:border-immo-green/40 hover:bg-immo-green/5 transition-colors"
              >
                <FaFacebookF className="text-base" />
                Continuer avec Facebook
              </button>
            </div>

            <p className="mt-8 text-center text-sm text-gray-500">
              Vous avez déjà un compte ?{' '}
              <Link
                to="/connexion"
                state={location.state}
                className="text-immo-green font-medium hover:underline"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
