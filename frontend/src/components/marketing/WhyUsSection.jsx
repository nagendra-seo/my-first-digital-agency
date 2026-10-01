import { Container } from "../ui/Container.jsx";
import { Eyebrow } from "../ui/Eyebrow.jsx";

const points = ["One accountable partner", "Honest, human reporting", "Decisions explained in plain language", "No disappearing after the contract is signed"];

export function WhyUsSection() {
  return (
    <section className="section-py bg-charcoal-900 text-cream-100">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <Eyebrow index="02" label="The Difference" />
          <h2 className="font-display text-3xl font-extrabold leading-tight sm:text-4xl">
            Marketing should feel <span className="text-gold-400">clear, not complicated.</span>
          </h2>
          <p className="mt-6 max-w-lg text-cream-100/70">
            You don&rsquo;t just hire an agency. You get a team that personally handles your growth &mdash; and shows you exactly what is moving, and why.
          </p>
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {points.map((point) => (
              <li key={point} className="rounded-xl border border-cream-100/10 bg-cream-100/5 p-4 text-sm font-semibold">
                <span className="mr-2 text-gold-400">&#10003;</span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="overflow-hidden rounded-2xl border border-cream-100/10 shadow-2xl shadow-black/30">
          <img src="/gallery/promo-1.jpg" alt="My First Digital Agency — your growth, handled personally" width={1536} height={1024} className="h-auto w-full" />
        </div>
      </Container>
    </section>
  );
}
