import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faBath, faRulerCombined } from '@fortawesome/free-solid-svg-icons';

export default function PropertyFeatures({ beds, baths, sqft }) {
  const features = [
    { icon: faBed, label: `${beds} Ch.` },
    { icon: faBath, label: `${baths} Sdb.` },
    { icon: faRulerCombined, label: `${sqft} m²` },
  ];

  return (
    <div className="flex flex-wrap items-center gap-6 py-5 border-y border-gray-100">
      {features.map(({ icon, label }) => (
        <div key={label} className="flex items-center gap-2.5 text-gray-700">
          <FontAwesomeIcon icon={icon} className="text-immo-green text-sm" />
          <span className="text-sm font-medium">{label}</span>
        </div>
      ))}
    </div>
  );
}
