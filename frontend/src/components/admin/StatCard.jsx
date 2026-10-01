export function StatCard({ label, value, accent = false }) {
  return (
    <div className={`rounded-2xl border p-5 ${accent ? "border-gold-400 bg-gold-50" : "border-charcoal-900/10 bg-white"}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">{label}</p>
      <p className="mt-2 font-display text-3xl font-extrabold text-charcoal-900">{value}</p>
    </div>
  );
}
