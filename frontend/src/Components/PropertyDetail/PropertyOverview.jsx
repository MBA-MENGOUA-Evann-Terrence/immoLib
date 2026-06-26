import { useState } from 'react';

export default function PropertyOverview({ description }) {
  const [expanded, setExpanded] = useState(false);

  if (!description) return null;

  const preview = description.slice(0, 280);

  return (
    <section>
      <h2 className="text-lg font-bold text-gray-900 mb-4">Description</h2>
      <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
        {expanded ? description : `${preview}${description.length > 280 ? '...' : ''}`}
      </p>
      {description.length > 280 && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-sm font-medium text-immo-green hover:underline"
        >
          {expanded ? 'Voir moins' : 'Lire la suite'}
        </button>
      )}
    </section>
  );
}
