import { Link } from "react-router-dom";
import { Container } from "../ui/Container.jsx";
import { Button } from "../ui/Button.jsx";
import { DashboardMock } from "./DashboardMock.jsx";

const checklist = ["Strategy that works", "Transparent reporting", "Dedicated support", "Long-term partnership"];

export function Hero() {
  return (
    <section className="section-py relative overflow-hidden bg-cream-100">
      <Container className="relative grid items-center gap-14 lg:grid-cols-2 lg:gap-10">
        <div>
          <p className="eyebrow mb-5">Strategy &middot; Traffic &middot; Leads &middot; Revenue</p>
          <h1 className="font-display text-4xl font-extrabold leading-[1.08] text-charcoal-900 sm:text-5xl lg:text-[3.4rem]">
            Turn your digital presence into <span className="text-gold-600">measurable growth.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-ink-soft">
            My First Digital Agency helps growth-minded businesses get found, get leads, and get more from every visitor — through SEO, paid media, websites and content that actually work together.
          </p>

          <ul className="mt-8 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {checklist.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm font-semibold text-charcoal-900">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <circle cx="10" cy="10" r="10" fill="#F5C319" />
                  <path d="M6 10.5l2.5 2.5 5.5-6" stroke="#1A1612" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button href="/free-audit" variant="primary">Get Your Free Audit</Button>
            <Button href="/how-we-work" variant="outline">See How We Work</Button>
          </div>

          <Link to="/about" className="mt-8 flex w-fit items-center gap-3 rounded-full border border-charcoal-900/10 bg-white/60 py-1.5 pl-1.5 pr-4 transition-colors hover:border-gold-400">
            <img src="/brand/founder.jpg" alt="Founder of My First Digital Agency" width={36} height={36} className="h-9 w-9 rounded-full object-cover" />
            <span className="text-xs font-semibold text-ink-soft">Your growth, handled personally by our founder</span>
          </Link>
        </div>

        <div className="flex justify-center lg:justify-end">
          <DashboardMock />
        </div>
      </Container>
    </section>
  );
}
