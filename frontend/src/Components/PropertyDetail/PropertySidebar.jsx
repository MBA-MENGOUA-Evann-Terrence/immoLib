import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPhone,
  faEnvelope,
  faPaperPlane,
  faCircleCheck,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { contacterAnnonce } from '../../api/services/annonces.service.js';
import { useAuth } from '../../context/AuthContext';

const EMPTY_FORM = { nom: '', email: '', telephone: '', message: '' };

export default function PropertySidebar({ listing }) {
  const { utilisateur } = useAuth();
  const publisher = listing.publisher;

  const [form, setForm] = useState(() => ({
    nom: utilisateur?.nom ?? '',
    email: utilisateur?.email ?? '',
    telephone: utilisateur?.telephone ?? '',
    message: '',
  }));
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    setSuccess(false);

    try {
      await contacterAnnonce(listing.id, form);
      setSuccess(true);
      setForm((prev) => ({ ...EMPTY_FORM, nom: prev.nom, email: prev.email, telephone: prev.telephone }));
    } catch (err) {
      setError(err.message || 'Impossible d\'envoyer le message.');
    } finally {
      setSending(false);
    }
  };

  return (
    <aside className="lg:sticky lg:top-24">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-card space-y-6">
        {publisher ? (
          <div className="flex items-start gap-4 pb-6 border-b border-gray-100">
            {publisher.photoUrl ? (
              <img
                src={publisher.photoUrl}
                alt={publisher.name ? `Photo de ${publisher.name}` : 'Photo de profil'}
                className="w-16 h-16 rounded-full object-cover border-2 border-immo-beige shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-immo-green/10 flex items-center justify-center shrink-0">
                <span className="text-lg font-bold text-immo-green">
                  {publisher.initials || <FontAwesomeIcon icon={faUser} />}
                </span>
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Publié par</p>
              {publisher.name && (
                <p className="text-base font-bold text-gray-900 truncate">{publisher.name}</p>
              )}
              <div className="mt-2 space-y-1.5 text-sm text-gray-600">
                {publisher.phone && (
                  <a
                    href={`tel:${publisher.phone}`}
                    className="flex items-center gap-2 hover:text-immo-green transition-colors"
                  >
                    <FontAwesomeIcon icon={faPhone} className="text-immo-green w-3.5 shrink-0" />
                    <span>{publisher.phone}</span>
                  </a>
                )}
                {publisher.email && (
                  <a
                    href={`mailto:${publisher.email}`}
                    className="flex items-center gap-2 hover:text-immo-green transition-colors break-all"
                  >
                    <FontAwesomeIcon icon={faEnvelope} className="text-immo-green w-3.5 shrink-0" />
                    <span>{publisher.email}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="pb-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">Contacter le propriétaire</h3>
            <p className="text-sm text-gray-500 mt-1">
              Les informations du publieur ne sont pas disponibles pour cette annonce.
            </p>
          </div>
        )}

        {publisher && (
          <>
            <h3 className="text-lg font-bold text-gray-900">Envoyer un message</h3>

            {success && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-green-50 text-green-700 text-sm">
                <FontAwesomeIcon icon={faCircleCheck} className="mt-0.5 shrink-0" />
                <span>Votre message a été envoyé. Le propriétaire vous recontactera.</span>
              </div>
            )}

            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="contact-nom" className="block text-xs font-medium text-gray-600 mb-1.5">
                  Votre nom
                </label>
                <input
                  id="contact-nom"
                  name="nom"
                  type="text"
                  required
                  value={form.nom}
                  onChange={handleChange}
                  placeholder="Jean Dupont"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-immo-green/30 focus:border-immo-green"
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-xs font-medium text-gray-600 mb-1.5">
                  Votre e-mail
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="vous@exemple.com"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-immo-green/30 focus:border-immo-green"
                />
              </div>

              <div>
                <label htmlFor="contact-telephone" className="block text-xs font-medium text-gray-600 mb-1.5">
                  Votre téléphone <span className="text-gray-400">(optionnel)</span>
                </label>
                <input
                  id="contact-telephone"
                  name="telephone"
                  type="tel"
                  value={form.telephone}
                  onChange={handleChange}
                  placeholder="+241 06 00 00 00"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-immo-green/30 focus:border-immo-green"
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-medium text-gray-600 mb-1.5">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Bonjour, je suis intéressé(e) par cette annonce..."
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-immo-green/30 focus:border-immo-green"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full flex items-center justify-center gap-2 py-3 bg-immo-green text-white text-sm font-semibold rounded-xl hover:bg-immo-green-dark transition-colors disabled:opacity-60"
              >
                <FontAwesomeIcon icon={faPaperPlane} className="text-xs" />
                {sending ? 'Envoi en cours...' : 'Envoyer le message'}
              </button>
            </form>
          </>
        )}
      </div>
    </aside>
  );
}
