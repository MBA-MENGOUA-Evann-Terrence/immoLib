import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faCoins,
  faCalendar,
  faCar,
  faCouch,
  faBuilding,
} from '@fortawesome/free-solid-svg-icons';

const ICON_MAP = {
  home: faHouse,
  fee: faCoins,
  year: faCalendar,
  parking: faCar,
  furniture: faCouch,
  floor: faBuilding,
};

export default function PropertyHighlights({ highlights }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-gray-900 mb-4">Points clés</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {highlights.map(({ label, value, icon }) => (
          <div
            key={label}
            className="bg-immo-beige/60 rounded-xl p-4 border border-immo-beige-dark/30"
          >
            <FontAwesomeIcon
              icon={ICON_MAP[icon] ?? faHouse}
              className="text-immo-green text-sm mb-2"
            />
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-sm font-semibold text-gray-900 mt-0.5">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
