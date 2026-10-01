const STYLES = {
  PENDING: "bg-gold-100 text-gold-800",
  CONFIRMED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-charcoal-100 text-charcoal-600 line-through decoration-charcoal-400",
  RESCHEDULED: "bg-cream-300 text-charcoal-800",
  COMPLETED: "bg-charcoal-900 text-cream-100",
};

export function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${STYLES[status] ?? "bg-cream-200 text-charcoal-800"}`}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}
