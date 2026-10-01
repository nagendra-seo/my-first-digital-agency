const toneClasses = {
  light: "bg-cream-200 text-charcoal-900",
  gold: "bg-gold-400 text-charcoal-900",
  dark: "bg-charcoal-900 text-cream-100",
};

export function ResultsGrid({ items }) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {items.map((item) => (
        <div key={item.slug} className={`rounded-2xl p-7 ${toneClasses[item.tone]}`}>
          <p className="text-xs font-bold uppercase tracking-wide opacity-70">{item.category}</p>
          <h3 className="mt-3 font-display text-xl font-bold leading-snug">{item.headline}</h3>
          <p className="mt-4 text-sm opacity-80">{item.result}</p>
        </div>
      ))}
    </div>
  );
}
