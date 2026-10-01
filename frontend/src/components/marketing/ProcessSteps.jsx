const STEPS = [
  { number: "01", title: "Audit", subtitle: "Find the gaps" },
  { number: "02", title: "Strategy", subtitle: "Pick the plays" },
  { number: "03", title: "Implementation", subtitle: "Make it happen" },
  { number: "04", title: "Optimization", subtitle: "Learn & improve" },
  { number: "05", title: "Growth", subtitle: "Own the result" },
];

export function ProcessSteps() {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-5">
      {STEPS.map((step, i) => (
        <div key={step.number} className="relative flex flex-col items-center text-center">
          {i < STEPS.length - 1 && <span aria-hidden="true" className="absolute left-1/2 top-6 hidden h-px w-full border-t border-dashed border-gold-500/50 sm:block" />}
          <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-gold-400 bg-cream-100 font-display text-sm font-bold text-gold-700">{step.number}</span>
          <p className="mt-4 font-display text-base font-bold text-charcoal-900">{step.title}</p>
          <p className="mt-1 text-xs text-ink-faint">{step.subtitle}</p>
        </div>
      ))}
    </div>
  );
}
