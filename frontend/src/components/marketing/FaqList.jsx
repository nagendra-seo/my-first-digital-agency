// Every question is shown together with its answer — nothing is collapsed.
export function FaqList({ items }) {
  return (
    <dl className="divide-y divide-charcoal-900/10 border-y border-charcoal-900/10">
      {items.map((item) => (
        <div key={item.question} className="py-6">
          <dt className="font-display text-lg font-bold text-charcoal-900 sm:text-xl">{item.question}</dt>
          <dd className="mt-3 max-w-3xl text-base leading-relaxed text-ink-soft">{item.answer}</dd>
        </div>
      ))}
    </dl>
  );
}
