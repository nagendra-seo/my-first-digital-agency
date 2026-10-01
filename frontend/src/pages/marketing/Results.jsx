import { Seo } from "../../components/Seo.jsx";
import { Container } from "../../components/ui/Container.jsx";
import { Eyebrow } from "../../components/ui/Eyebrow.jsx";
import { CTASection } from "../../components/marketing/CTASection.jsx";
import { CASE_STUDIES } from "../../lib/resultsData.js";

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";

const toneClasses = { light: "bg-cream-200 text-charcoal-900", gold: "bg-gold-400 text-charcoal-900", dark: "bg-charcoal-900 text-cream-100" };

export default function Results() {
  return (
    <>
      <Seo title="Results" description="How we approach client work, illustrated through example case studies covering SEO, website optimization, lead generation and content strategy." />
      <section className="section-py bg-cream-100">
        <Container>
          <Eyebrow index="04" label="Results" />
          <h1 className="max-w-2xl font-display text-4xl font-extrabold leading-tight text-charcoal-900 sm:text-5xl">
            Good brands <span className="text-gold-600">deserve to be found.</span>
          </h1>
          <p className="mt-5 max-w-xl text-ink-soft">We&rsquo;re early in publishing verified client results on this site. In the meantime, here&rsquo;s how we approach real engagements, shown through clearly-labelled illustrative examples.</p>
          <div className="mt-3 inline-block rounded-full bg-gold-100 px-4 py-1.5 text-xs font-bold text-gold-800">Illustrative examples — not verified client results</div>

          <div className="mt-14 space-y-8">
            {CASE_STUDIES.map((study) => (
              <article key={study.slug} className={`rounded-2xl p-8 ${toneClasses[study.tone]}`}>
                <p className="text-xs font-bold uppercase tracking-wide opacity-70">{study.category} &middot; {study.industry}</p>
                <h2 className="mt-3 font-display text-2xl font-bold">{study.headline}</h2>
                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  <div><p className="text-xs font-bold uppercase opacity-60">Challenge</p><p className="mt-2 text-sm opacity-90">{study.challenge}</p></div>
                  <div><p className="text-xs font-bold uppercase opacity-60">Strategy</p><p className="mt-2 text-sm opacity-90">{study.strategy}</p></div>
                  <div><p className="text-xs font-bold uppercase opacity-60">Implementation</p><p className="mt-2 text-sm opacity-90">{study.implementation}</p></div>
                  <div><p className="text-xs font-bold uppercase opacity-60">Result</p><p className="mt-2 text-sm opacity-90">{study.result}</p></div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-16">
            <p className="eyebrow mb-4">Campaign snapshot</p>
            <div className="overflow-hidden rounded-2xl border border-charcoal-900/10 bg-white shadow-xl shadow-charcoal-900/10">
              <img src="/gallery/promo-4.jpg" alt="SEO and growth campaign dashboards — organic traffic, leads and keyword rankings" width={1374} height={1145} className="h-auto w-full" />
            </div>
          </div>
        </Container>
      </section>

      <CTASection siteKey={TURNSTILE_SITE_KEY} />
    </>
  );
}
