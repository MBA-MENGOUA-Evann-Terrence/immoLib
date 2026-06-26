import { useEffect, useState } from 'react';
import { getPrixMoyenM2 } from '../../api/services/quartiers.service';
import { mapTransactionToApiType } from '../../mappers/annonce.mapper';
import { useSearchResults } from '../../context/SearchResultsContext';

function formatPrixM2(value) {
  if (value == null || Number.isNaN(value)) return '—';
  return `${Math.round(value).toLocaleString('fr-FR')} FCFA/m²`;
}

export default function PrixMoyenM2ParQuartier() {
  const { filters } = useSearchResults();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const type = mapTransactionToApiType(filters.transaction);
    const params = { disponible: true };
    if (type) params.type = type;

    getPrixMoyenM2(params)
      .then((data) => {
        if (!cancelled) setStats(data.statistiques ?? []);
      })
      .catch(() => {
        if (!cancelled) setStats([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filters.transaction]);

  if (loading) {
    return (
      <div className="px-4 sm:px-6 py-3 border-b border-gray-100 bg-immo-beige/40">
        <p className="text-xs text-gray-500">Chargement des prix moyens au m²…</p>
      </div>
    );
  }

  if (stats.length === 0) {
    return (
      <div className="px-4 sm:px-6 py-3 border-b border-gray-100 bg-immo-beige/40">
        <p className="text-xs text-gray-500">Aucune statistique disponible pour le moment.</p>
      </div>
    );
  }

  const transactionLabel = filters.transaction || 'Toutes transactions';

  return (
    <div className="px-4 sm:px-6 py-3 border-b border-gray-100 bg-immo-beige/40">
      <div className="flex items-center justify-between gap-3 mb-2">
        <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
          Prix moyen au m² par quartier
        </h3>
        <span className="text-[11px] text-gray-400 shrink-0">{transactionLabel}</span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {stats.map((row) => (
          <div
            key={row._id}
            className="shrink-0 min-w-[130px] px-3 py-2 rounded-xl bg-white border border-gray-100 shadow-sm"
          >
            <p className="text-xs font-semibold text-gray-900 truncate">{row._id}</p>
            <p className="text-sm font-bold text-immo-green mt-0.5">
              {formatPrixM2(row.prixMoyenM2)}
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              {row.nombreAnnonces} annonce{row.nombreAnnonces > 1 ? 's' : ''}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
