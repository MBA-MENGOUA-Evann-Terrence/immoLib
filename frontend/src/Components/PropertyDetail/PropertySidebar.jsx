import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendar,
  faClock,
  faPhone,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';

const inputClass =
  'w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-immo-green/30 focus:border-immo-green';

export default function PropertySidebar({ listing }) {
  const { agent, transaction, downPayment } = listing;

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <aside className="space-y-5 lg:sticky lg:top-24">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-card">
        <h3 className="text-lg font-bold text-gray-900 mb-5">Demander une visite</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="tour-date" className="block text-sm text-gray-600 mb-2">
              Date
            </label>
            <div className="relative">
              <input id="tour-date" type="date" className={`${inputClass} pl-10`} required />
              <FontAwesomeIcon
                icon={faCalendar}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="tour-time" className="block text-sm text-gray-600 mb-2">
              Heure
            </label>
            <div className="relative">
              <input id="tour-time" type="time" className={`${inputClass} pl-10`} required />
              <FontAwesomeIcon
                icon={faClock}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-immo-green text-white text-sm font-semibold rounded-xl hover:bg-immo-green-dark transition-colors"
          >
            Planifier une visite
          </button>

          <button
            type="button"
            className="w-full py-3.5 border-2 border-immo-green text-immo-green text-sm font-semibold rounded-xl hover:bg-immo-green/5 transition-colors"
          >
            Demander des infos
          </button>
        </form>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-card">
        <h3 className="text-lg font-bold text-gray-900 mb-5">Informations agent</h3>

        <div className="flex items-start gap-4">
          <div
            className="w-14 h-14 rounded-xl shrink-0 flex items-center justify-center text-lg font-bold text-white"
            style={{ backgroundColor: agent.color }}
          >
            {agent.initials}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{agent.name}</p>
            <p className="text-sm text-gray-500">{agent.agency}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {agent.badges.map((badge) => (
                <span
                  key={badge}
                  className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-immo-beige text-immo-green"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-2 text-sm text-gray-600">
          <p>Licence : {agent.license}</p>
          <p className="flex items-center gap-2">
            <FontAwesomeIcon icon={faPhone} className="text-immo-green shrink-0" />
            <a href={`tel:${agent.phone}`} className="hover:text-immo-green transition-colors">
              {agent.phone}
            </a>
          </p>
        </div>

        <button
          type="button"
          className="mt-5 w-full py-3 flex items-center justify-center gap-2 bg-immo-green/10 text-immo-green text-sm font-semibold rounded-xl hover:bg-immo-green/15 transition-colors"
        >
          <FontAwesomeIcon icon={faEnvelope} className="text-xs" />
          Contacter maintenant
        </button>
      </div>

      <p className="text-xs text-gray-400 text-center">
        {transaction === 'Vente' ? 'Acompte' : 'Caution'} : {downPayment}
      </p>
    </aside>
  );
}
