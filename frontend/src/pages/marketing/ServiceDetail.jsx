import { useParams, Navigate } from "react-router-dom";
import { Seo } from "../../components/Seo.jsx";
import { Container } from "../../components/ui/Container.jsx";
import { Eyebrow } from "../../components/ui/Eyebrow.jsx";
import { Icon } from "../../components/ui/Icon.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { FaqList } from "../../components/marketing/FaqList.jsx";
import { CTASection } from "../../components/marketing/CTASection.jsx";
import { getServiceBySlug } from "../../lib/servicesData.js";

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = getServiceBySlug(slug);
  if (!service) return <Navigate to="/404" replace />;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: service.name,
    provider: { "@type": "Organization", name: "My First Digital Agency" },
    description: service.shortDescription,
  };

  return (
    <>
      <Seo title={service.name} description={service.shortDescription} jsonLd={jsonLd} />
      <section className="section-py bg-cream-100">
        <Container>
          <Eyebrow index={service.number} label="Service" />
          <div className="flex items-start gap-4">
            <Icon path={service.iconPath} className="mt-1 h-9 w-9 text-gold-600" />
            <h1 className="font-display text-4xl font-extrabold leading-tight text-charcoal-900 sm:text-5xl">{service.name}</h1>
          </div>
          <p className="mt-6 max-w-2xl text-lg text-ink-soft">{service.whatItIs}</p>
          <div className="mt-8">
            <Button href="/free-audit" variant="primary">Get Your Free Audit</Button>
          </div>
        </Container>
      </section>

      <section className="section-py bg-white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl font-bold text-charcoal-900">The problem this solves</h2>
              <p className="mt-4 text-ink-soft">{service.problem}</p>
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-charcoal-900">Who it&rsquo;s for</h2>
              <p className="mt-4 text-ink-soft">{service.whoItsFor}</p>
            </div>
          </div>
        </Container>
      </section>

      <section className="section-py bg-cream-200">
        <Container>
          <h2 className="font-display text-2xl font-bold text-charcoal-900">How we approach it</h2>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2">
            {service.approach.map((step, i) => (
              <li key={step} className="flex gap-4 rounded-xl bg-white p-5">
                <span className="font-display text-lg font-bold text-gold-600">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-sm text-ink-soft">{step}</span>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="section-py bg-white">
        <Container>
          <h2 className="font-display text-2xl font-bold text-charcoal-900">Benefits</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {service.benefits.map((benefit) => (
              <li key={benefit} className="rounded-xl border border-charcoal-900/10 p-5 text-sm font-semibold text-charcoal-900">{benefit}</li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="section-py bg-cream-100">
        <Container className="max-w-3xl">
          <h2 className="font-display text-2xl font-bold text-charcoal-900">{service.name} — frequently asked questions</h2>
          <div className="mt-8">
            <FaqList items={service.faqs} />
          </div>
        </Container>
      </section>

      <CTASection siteKey={TURNSTILE_SITE_KEY} />
    </>
  );
}
