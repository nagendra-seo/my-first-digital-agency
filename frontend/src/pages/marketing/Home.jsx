import { Link } from "react-router-dom";
import { Seo } from "../../components/Seo.jsx";
import { Hero } from "../../components/marketing/Hero.jsx";
import { WhyUsSection } from "../../components/marketing/WhyUsSection.jsx";
import { ServicesGrid } from "../../components/marketing/ServicesGrid.jsx";
import { ProcessSteps } from "../../components/marketing/ProcessSteps.jsx";
import { ResultsGrid } from "../../components/marketing/ResultsGrid.jsx";
import { FaqList } from "../../components/marketing/FaqList.jsx";
import { CTASection } from "../../components/marketing/CTASection.jsx";
import { Container } from "../../components/ui/Container.jsx";
import { Eyebrow } from "../../components/ui/Eyebrow.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { CASE_STUDIES } from "../../lib/resultsData.js";
import { GENERAL_FAQS } from "../../lib/faqData.js";

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";

export default function Home() {
  return (
    <>
      <Seo description="My First Digital Agency helps growth-minded businesses turn visibility into leads with SEO, paid media, websites and content — backed by a free, no-obligation audit." />
      <Hero />

      <section className="section-py bg-cream-100">
        <Container>
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <Eyebrow index="01" label="What We Do" />
              <h2 className="max-w-xl font-display text-3xl font-extrabold leading-tight text-charcoal-900 sm:text-4xl">
                Everything your growth <span className="text-gold-600">needs to move.</span>
              </h2>
            </div>
            <p className="max-w-sm text-sm text-ink-soft">
              One senior team across strategy, media, web and creative &mdash; so every part of your marketing pulls in the same direction.
            </p>
          </div>
          <div className="mt-12">
            <ServicesGrid limit={6} />
          </div>
        </Container>
      </section>

      <WhyUsSection />

      <section className="section-py bg-cream-100">
        <Container>
          <Eyebrow index="03" label="How We Work" />
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <h2 className="max-w-xl font-display text-3xl font-extrabold leading-tight text-charcoal-900 sm:text-4xl">
              A better way to <span className="text-gold-600">grow together.</span>
            </h2>
            <p className="max-w-sm text-sm text-ink-soft">No mystery. No disappearing act. Just a simple process built around smart decisions and consistent momentum.</p>
          </div>
          <div className="mt-16">
            <ProcessSteps />
          </div>
        </Container>
      </section>

      <section className="section-py bg-cream-200">
        <Container>
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <Eyebrow index="04" label="Results" />
              <h2 className="max-w-xl font-display text-3xl font-extrabold leading-tight text-charcoal-900 sm:text-4xl">
                Good brands <span className="text-gold-600">deserve to be found.</span>
              </h2>
            </div>
            <Button href="/results" variant="outline">View all results</Button>
          </div>
          <div className="mt-12">
            <ResultsGrid items={CASE_STUDIES.slice(0, 4)} />
          </div>
          <p className="mt-6 text-xs text-ink-faint">These are clearly-labelled illustrative examples used to demonstrate how we work, not verified client results.</p>
        </Container>
      </section>

      <section className="section-py bg-cream-100">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-16">
            <div>
              <Eyebrow index="05" label="Good To Know" />
              <h2 className="font-display text-3xl font-extrabold leading-tight text-charcoal-900 sm:text-4xl">
                Questions, <span className="text-gold-600">answered.</span>
              </h2>
              <p className="mt-5 text-sm text-ink-soft">Still curious? We&rsquo;re always happy to have a straightforward chat.</p>
              <Link to="/contact" className="mt-4 inline-block border-b-2 border-gold-500 pb-0.5 text-sm font-bold text-charcoal-900">Ask us anything ↗</Link>
            </div>
            <FaqList items={GENERAL_FAQS.slice(0, 5)} />
          </div>
        </Container>
      </section>

      <CTASection siteKey={TURNSTILE_SITE_KEY} />
    </>
  );
}
