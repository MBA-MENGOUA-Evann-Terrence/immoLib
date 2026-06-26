import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageLayout from '../Components/PageLayout';
import { useListings } from '../context/ListingsContext';
import { useAuth } from '../context/AuthContext';
import { LOCATIONS, PROPERTY_TYPES } from '../data/listings';

const inputClass =
  'w-full px-4 py-3 text-sm text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-immo-green/30 focus:border-immo-green placeholder:text-gray-400';

const labelClass = 'block text-sm font-medium text-gray-700 mb-2';

const INITIAL_FORM = {
  title: '',
  transaction: 'Vente',
  type: 'Appartement',
  location: 'Libreville',
  address: '',
  price: '',
  beds: '',
  baths: '',
  sqft: '',
  description: '',
  charges: '',
  year: '',
  parking: '',
  furnished: 'Non',
  floor: '',
  contactName: '',
  contactPhone: '',
};

export default function PostListingPage() {
  const navigate = useNavigate();
  const { addListing } = useListings();
  const { isAuthenticated } = useAuth();
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const newListing = await addListing(form);
      setSubmitted(true);
      setTimeout(() => {
        navigate(`/annonces/${newListing.id}`);
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <PageLayout>
        <div className="max-w-lg mx-auto text-center py-20">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Connexion requise</h1>
          <p className="text-sm text-gray-500 mb-6">
            Vous devez être connecté pour publier une annonce.
          </p>
          <Link
            to="/connexion"
            className="inline-block px-6 py-3 bg-immo-green text-white text-sm font-semibold rounded-xl hover:bg-immo-green-dark transition-colors"
          >
            Se connecter
          </Link>
        </div>
      </PageLayout>
    );
  }

  if (submitted) {
    return (
      <PageLayout>
        <div className="max-w-lg mx-auto text-center py-20">
          <div className="w-16 h-16 mx-auto rounded-full bg-immo-green/10 flex items-center justify-center mb-5">
            <span className="text-2xl">✓</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Annonce publiée !</h1>
          <p className="text-sm text-gray-500">Redirection vers votre annonce...</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Déposer une annonce
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Remplissez le formulaire ci-dessous pour publier votre bien sur ImmoLib.
          </p>
        </div>

        {error && (
          <p className="mb-6 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="bg-immo-beige rounded-2xl p-6 sm:p-8 space-y-5">
            <h2 className="text-lg font-bold text-gray-900">Informations du bien</h2>

            <div>
              <label htmlFor="title" className={labelClass}>Titre de l&apos;annonce</label>
              <input
                id="title"
                type="text"
                required
                value={form.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Ex : Villa moderne avec piscine"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <span className={labelClass}>Type de transaction</span>
                <div className="flex rounded-xl bg-white p-1 border border-gray-200">
                  {['Vente', 'Location'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => updateField('transaction', option)}
                      className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                        form.transaction === option
                          ? 'bg-immo-green text-white'
                          : 'text-gray-600 hover:text-immo-green'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="type" className={labelClass}>Type de bien</label>
                <select
                  id="type"
                  required
                  value={form.type}
                  onChange={(e) => updateField('type', e.target.value)}
                  className={`${inputClass} appearance-none cursor-pointer`}
                >
                  {PROPERTY_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="location" className={labelClass}>Ville</label>
                <select
                  id="location"
                  required
                  value={form.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  className={`${inputClass} appearance-none cursor-pointer`}
                >
                  {LOCATIONS.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="price" className={labelClass}>Prix (FCFA)</label>
                <input
                  id="price"
                  type="number"
                  required
                  min="0"
                  value={form.price}
                  onChange={(e) => updateField('price', e.target.value)}
                  placeholder="Ex : 850000"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className={labelClass}>Adresse complète</label>
              <input
                id="address"
                type="text"
                required
                value={form.address}
                onChange={(e) => updateField('address', e.target.value)}
                placeholder="Quartier, rue, numéro..."
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="beds" className={labelClass}>Chambres</label>
                <input
                  id="beds"
                  type="number"
                  required
                  min="0"
                  value={form.beds}
                  onChange={(e) => updateField('beds', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="baths" className={labelClass}>Salles de bain</label>
                <input
                  id="baths"
                  type="number"
                  required
                  min="0"
                  value={form.baths}
                  onChange={(e) => updateField('baths', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="sqft" className={labelClass}>Surface (m²)</label>
                <input
                  id="sqft"
                  type="number"
                  required
                  min="0"
                  value={form.sqft}
                  onChange={(e) => updateField('sqft', e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className={labelClass}>Description</label>
              <textarea
                id="description"
                required
                rows={5}
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Décrivez votre bien en détail..."
                className={`${inputClass} resize-none`}
              />
            </div>
          </section>

          <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-5">
            <h2 className="text-lg font-bold text-gray-900">Détails complémentaires</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="charges" className={labelClass}>Charges</label>
                <input
                  id="charges"
                  type="text"
                  value={form.charges}
                  onChange={(e) => updateField('charges', e.target.value)}
                  placeholder="Ex : Aucune, Incluses..."
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="year" className={labelClass}>Année de construction</label>
                <input
                  id="year"
                  type="text"
                  value={form.year}
                  onChange={(e) => updateField('year', e.target.value)}
                  placeholder="Ex : 2020"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="parking" className={labelClass}>Parking</label>
                <input
                  id="parking"
                  type="text"
                  value={form.parking}
                  onChange={(e) => updateField('parking', e.target.value)}
                  placeholder="Ex : 2 places"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="furnished" className={labelClass}>Meublé</label>
                <select
                  id="furnished"
                  value={form.furnished}
                  onChange={(e) => updateField('furnished', e.target.value)}
                  className={`${inputClass} appearance-none cursor-pointer`}
                >
                  <option value="Oui">Oui</option>
                  <option value="Non">Non</option>
                </select>
              </div>
            </div>
          </section>

          <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-5">
            <h2 className="text-lg font-bold text-gray-900">Vos coordonnées</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="contactName" className={labelClass}>Nom complet</label>
                <input
                  id="contactName"
                  type="text"
                  required
                  value={form.contactName}
                  onChange={(e) => updateField('contactName', e.target.value)}
                  placeholder="Votre nom"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="contactPhone" className={labelClass}>Téléphone</label>
                <input
                  id="contactPhone"
                  type="tel"
                  required
                  value={form.contactPhone}
                  onChange={(e) => updateField('contactPhone', e.target.value)}
                  placeholder="+241 06X XX XX XX"
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 border border-gray-200 text-sm font-semibold text-gray-700 rounded-xl hover:bg-immo-beige transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 bg-immo-orange text-white text-sm font-semibold rounded-xl hover:bg-immo-orange-dark transition-colors disabled:opacity-60"
            >
              {submitting ? 'Publication...' : "Publier l'annonce"}
            </button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}
