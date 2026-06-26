import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons';
import PageLayout from '../Components/PageLayout';
import { useListings } from '../context/ListingsContext';
import { useAuth } from '../context/AuthContext';
import { getQuartiers } from '../api/services/quartiers.service';
import { getCurrentPosition, LIBREVILLE_CENTER } from '../utils/geolocation';

const inputClass =
  'w-full px-4 py-3 text-sm text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-immo-green/30 focus:border-immo-green placeholder:text-gray-400';

const labelClass = 'block text-sm font-medium text-gray-700 mb-2';

const INITIAL_FORM = {
  titre: '',
  type: 'vente',
  description: '',
  prix: '',
  surface: '',
  nbr_pieces: '',
  quartierId: '',
  lat: '',
  lng: '',
  disponible: true,
  photoUrl: '',
};

export default function PostListingPage() {
  const navigate = useNavigate();
  const { addListing } = useListings();
  const { isAuthenticated } = useAuth();
  const [form, setForm] = useState(INITIAL_FORM);
  const [quartiers, setQuartiers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/connexion', { state: { from: '/deposer' }, replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    getQuartiers()
      .then((data) => setQuartiers(data.quartiers ?? []))
      .catch(() => setQuartiers([]));
  }, []);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleUseMyPosition = async () => {
    setLocating(true);
    const pos = (await getCurrentPosition()) ?? LIBREVILLE_CENTER;
    setForm((prev) => ({
      ...prev,
      lat: String(pos.lat),
      lng: String(pos.lng),
    }));
    setLocating(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.lat || !form.lng) {
      setError('La localisation GPS est requise pour publier une annonce géolocalisée.');
      return;
    }

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
    return null;
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
            Renseignez les champs correspondant à la base de données. La position GPS permet la recherche par kilomètre.
          </p>
        </div>

        {error && (
          <p className="mb-6 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="bg-immo-beige rounded-2xl p-6 sm:p-8 space-y-5">
            <h2 className="text-lg font-bold text-gray-900">Informations principales</h2>

            <div>
              <label htmlFor="titre" className={labelClass}>Titre *</label>
              <input
                id="titre"
                type="text"
                required
                value={form.titre}
                onChange={(e) => updateField('titre', e.target.value)}
                placeholder="Ex : Studio meublé à Nzeng-Ayong"
                className={inputClass}
              />
            </div>

            <div>
              <span className={labelClass}>Type de transaction *</span>
              <div className="flex rounded-xl bg-white p-1 border border-gray-200">
                {[
                  { value: 'vente', label: 'Vente' },
                  { value: 'location', label: 'Location' },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => updateField('type', value)}
                    className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                      form.type === value
                        ? 'bg-immo-green text-white'
                        : 'text-gray-600 hover:text-immo-green'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="prix" className={labelClass}>Prix (FCFA) *</label>
              <input
                id="prix"
                type="number"
                required
                min="0"
                value={form.prix}
                onChange={(e) => updateField('prix', e.target.value)}
                placeholder="Ex : 850000"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="surface" className={labelClass}>Surface (m²)</label>
                <input
                  id="surface"
                  type="number"
                  min="0"
                  value={form.surface}
                  onChange={(e) => updateField('surface', e.target.value)}
                  placeholder="Ex : 65"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="nbr_pieces" className={labelClass}>Nombre de pièces</label>
                <input
                  id="nbr_pieces"
                  type="number"
                  min="0"
                  value={form.nbr_pieces}
                  onChange={(e) => updateField('nbr_pieces', e.target.value)}
                  placeholder="Ex : 3"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="quartierId" className={labelClass}>Quartier</label>
              <select
                id="quartierId"
                value={form.quartierId}
                onChange={(e) => updateField('quartierId', e.target.value)}
                className={`${inputClass} appearance-none cursor-pointer`}
              >
                <option value="">Sélectionner un quartier</option>
                {quartiers.map((q) => {
                  const id = q._id?.toString?.() ?? q._id;
                  return (
                    <option key={id} value={id}>
                      {q.nom}{q.ville ? ` — ${q.ville}` : ''}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label htmlFor="description" className={labelClass}>Description</label>
              <textarea
                id="description"
                rows={5}
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Décrivez le bien..."
                className={`${inputClass} resize-none`}
              />
            </div>
          </section>

          <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-5">
            <h2 className="text-lg font-bold text-gray-900">Localisation GPS *</h2>
            <p className="text-sm text-gray-500 -mt-2">
              Obligatoire pour apparaître dans la recherche par rayon (km).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="lat" className={labelClass}>Latitude</label>
                <input
                  id="lat"
                  type="number"
                  step="any"
                  required
                  value={form.lat}
                  onChange={(e) => updateField('lat', e.target.value)}
                  placeholder="Ex : 0.4162"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="lng" className={labelClass}>Longitude</label>
                <input
                  id="lng"
                  type="number"
                  step="any"
                  required
                  value={form.lng}
                  onChange={(e) => updateField('lng', e.target.value)}
                  placeholder="Ex : 9.4673"
                  className={inputClass}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleUseMyPosition}
              disabled={locating}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-immo-green text-immo-green rounded-xl hover:bg-immo-green/5 transition-colors disabled:opacity-60"
            >
              <FontAwesomeIcon icon={faLocationCrosshairs} />
              {locating ? 'Localisation...' : 'Utiliser ma position'}
            </button>
          </section>

          <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-5">
            <h2 className="text-lg font-bold text-gray-900">Options</h2>

            <div>
              <label htmlFor="photoUrl" className={labelClass}>URL d&apos;une photo</label>
              <input
                id="photoUrl"
                type="url"
                value={form.photoUrl}
                onChange={(e) => updateField('photoUrl', e.target.value)}
                placeholder="https://..."
                className={inputClass}
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.disponible}
                onChange={(e) => updateField('disponible', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-immo-green focus:ring-immo-green/30"
              />
              <span className="text-sm text-gray-700">Bien disponible</span>
            </label>
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
