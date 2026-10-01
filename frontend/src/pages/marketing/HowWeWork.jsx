import { Seo } from "../../components/Seo.jsx";
import { Container } from "../../components/ui/Container.jsx";
import { Eyebrow } from "../../components/ui/Eyebrow.jsx";
import { ProcessSteps } from "../../components/marketing/ProcessSteps.jsx";
import { CTASection } from "../../components/marketing/CTASection.jsx";

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";

const STAGES = [
  { number: "01", title: "Audit", body: "We start by understanding exactly where you stand today — technical SEO, website experience, existing campaigns, and competitive position. No recommendations before we've actually looked." },
  { number: "02", title: "Strategy", body: "We turn audit findings into a prioritized plan: what to fix first, what to build, and what to leave alone for now. You'll see the reasoning, not just a task list." },
  { number: "03", title: "Implementation", body: "Our team executes the plan — from technical fixes and content production to campaign builds and website changes — with clear timelines you can follow along with." },
  { number: "04", title: "Optimization", body: "Nothing is set-and-forget. We track what's actually happening and adjust — doubling down on what's working, changing course on what isn't." },
  { number: "05", title: "Growth", body: "As the plan compounds, reporting shifts from 'here's what we did' to 'here's what it's doing for the business' — with the numbers to back it up." },
];

export default function HowWeWork() {
  return (
    <>
      <Seo title="How We Work" description="Audit, Strategy, Implementation, Optimization, Growth — the five-stage process My First Digital Agency uses with every client." />
      <section className="section-py bg-cream-100">
        <Container>
          <Eyebrow index="03" label="How We Work" />
          <h1 className="max-w-2xl font-display text-4xl font-extrabold leading-tight text-charcoal-900 sm:text-5xl">
            A better way to <span className="text-gold-600">grow together.</span>
          </h1>
          <p className="mt-5 max-w-xl text-ink-soft">No mystery. No disappearing act. Just a simple process built around smart decisions and consistent momentum.</p>
          <div className="mt-16">
            <ProcessSteps />
          </div>
        </Container>
      </section>

      <section className="section-py bg-white">
        <Container className="space-y-12">
          {STAGES.map((stage) => (
            <div key={stage.number} className="grid gap-4 border-b border-charcoal-900/10 pb-12 last:border-0 sm:grid-cols-[100px_1fr]">
              <span className="font-display text-4xl font-extrabold text-gold-400">{stage.number}</span>
              <div>
                <h2 className="font-display text-2xl font-bold text-charcoal-900">{stage.title}</h2>
                <p className="mt-3 max-w-2xl text-ink-soft">{stage.body}</p>
              </div>
            </div>
          ))}
        </Container>
      </section>

      <CTASection siteKey={TURNSTILE_SITE_KEY} />
    </>
  );
}
