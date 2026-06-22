import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag } from '@fortawesome/free-solid-svg-icons';

export default function PropertyPriceBlock({ listing }) {
  const label = listing.transaction === 'Vente' ? 'À vendre' : 'À louer';
  const subLabel =
    listing.transaction === 'Vente'
      ? `Acompte ${listing.downPayment}`
      : `Caution ${listing.downPayment}`;

  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-immo-green/10 flex items-center justify-center shrink-0">
        <FontAwesomeIcon icon={faTag} className="text-immo-green" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl sm:text-3xl font-bold text-gray-900">{listing.price}</p>
        <p className="text-sm text-gray-500 mt-1">{subLabel}</p>
      </div>
    </div>
  );
}
