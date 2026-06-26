export default function PropertyHighlights({ specs }) {
  if (!specs?.length) return null;

  return (
    <section>
      <h2 className="text-lg font-bold text-gray-900 mb-4">Caractéristiques</h2>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {specs.map(({ label, value }) => (
          <div
            key={label}
            className="bg-immo-beige/60 rounded-xl px-4 py-3 border border-immo-beige-dark/30"
          >
            <dt className="text-xs text-gray-500">{label}</dt>
            <dd className="text-sm font-semibold text-gray-900 mt-0.5">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
