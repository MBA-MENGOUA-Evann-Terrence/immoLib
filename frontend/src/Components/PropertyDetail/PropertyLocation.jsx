import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

const TABS = ['Carte', 'Écoles', 'Commerces', 'Transports'];

export default function PropertyLocation({ address }) {
  const [activeTab, setActiveTab] = useState('Carte');

  return (
    <section>
      <h2 className="text-lg font-bold text-gray-900 mb-4">Localisation</h2>

      <div className="flex flex-wrap gap-2 mb-4">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-immo-green text-white'
                : 'bg-gray-100 text-gray-600 hover:text-immo-green'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden bg-immo-beige border border-gray-200">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-6">
            <div className="w-12 h-12 mx-auto rounded-full bg-immo-green/10 flex items-center justify-center mb-3">
              <FontAwesomeIcon icon={faLocationDot} className="text-immo-green text-lg" />
            </div>
            <p className="text-sm font-medium text-gray-700">{address}</p>
            <p className="text-xs text-gray-400 mt-1">Carte interactive — {activeTab}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
