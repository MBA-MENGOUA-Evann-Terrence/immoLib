import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import { useAuth } from '../context/AuthContext';

const legalLinks = [
  { label: 'Conditions d\'utilisation', to: '/conditions' },
  { label: 'Politique de confidentialité', to: '/confidentialite' },
  { label: 'Mentions légales', to: '/mentions-legales' },
];

const socialLinks = [
  { icon: FaFacebookF, label: 'Facebook', href: '#' },
  { icon: FaInstagram, label: 'Instagram', href: '#' },
  { icon: FaLinkedinIn, label: 'LinkedIn', href: '#' },
  { icon: FaXTwitter, label: 'Twitter', href: '#' },
];

export default function Footer() {
  const { isAuthenticated } = useAuth();

  const quickLinks = [
    { label: 'Accueil', to: '/' },
    {
      label: 'Déposer une annonce',
      to: isAuthenticated ? '/deposer' : '/connexion',
      state: isAuthenticated ? undefined : { from: '/deposer' },
    },
  ];

  return (
    <footer className="mt-16 rounded-[32px] bg-immo-beige border border-immo-beige-dark/40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 lg:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="text-xl font-bold text-immo-green">
              ImmoLib
            </Link>
            <p className="mt-4 text-sm text-gray-600 leading-relaxed max-w-xs">
              Votre plateforme immobilière de référence au Gabon. Trouvez, louez ou
              vendez votre bien en toute simplicité.
            </p>
            <div className="flex gap-2.5 mt-6">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-immo-green hover:border-immo-green transition-colors"
                >
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Navigation</h3>
            <ul className="space-y-3">
              {quickLinks.map(({ label, to, state }) => (
                <li key={label}>
                  <Link
                    to={to}
                    state={state}
                    className="text-sm text-gray-600 hover:text-immo-green transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-3">
                <FontAwesomeIcon icon={faLocationDot} className="mt-0.5 text-immo-green shrink-0" />
                <span>Libreville, Gabon<br />Owendo &bull; Akanda &bull; Ntoum</span>
              </li>
              <li className="flex items-center gap-3">
                <FontAwesomeIcon icon={faPhone} className="text-immo-green shrink-0" />
                <a href="tel:+24162452112" className="hover:text-immo-green transition-colors">
                  +241 062 45 21 12
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FontAwesomeIcon icon={faEnvelope} className="text-immo-green shrink-0" />
                <a href="mailto:contact@immolib.ga" className="hover:text-immo-green transition-colors">
                  contact@immolib.ga
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Newsletter</h3>
            <p className="text-sm text-gray-600 mb-4">
              Recevez les dernières annonces directement dans votre boîte mail.
            </p>
            <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Votre adresse e-mail"
                className="w-full px-4 py-2.5 rounded-xl text-sm text-gray-900 bg-white border border-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-immo-green/30 focus:border-immo-green"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-immo-orange text-white text-sm font-semibold hover:bg-immo-orange-dark transition-colors"
              >
                S&apos;inscrire
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-immo-beige-dark/50 bg-white/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} ImmoLib. Tous droits réservés.</p>
          <div className="flex flex-wrap justify-center gap-4">
            {legalLinks.map(({ label, to }) => (
              <Link key={to} to={to} className="hover:text-immo-green transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
