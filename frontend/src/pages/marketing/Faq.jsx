import { Seo } from "../../components/Seo.jsx";
import { Container } from "../../components/ui/Container.jsx";
import { Eyebrow } from "../../components/ui/Eyebrow.jsx";
import { FaqList } from "../../components/marketing/FaqList.jsx";
import { CTASection } from "../../components/marketing/CTASection.jsx";
import { GENERAL_FAQS } from "../../lib/faqData.js";

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";

export default function Faq() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: GENERAL_FAQS.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };

  return (
    <>
      <Seo title="FAQ" description="Answers to the questions we hear most often about the free audit, our process, and how engagements work." jsonLd={jsonLd} />
      <section className="section-py bg-cream-100">
        <Container className="max-w-3xl">
          <Eyebrow index="05" label="Good To Know" />
          <h1 className="font-display text-4xl font-extrabold leading-tight text-charcoal-900 sm:text-5xl">
            Questions, <span className="text-gold-600">answered.</span>
          </h1>
          <div className="mt-10">
            <FaqList items={GENERAL_FAQS} />
          </div>
        </Container>
      </section>
      <CTASection siteKey={TURNSTILE_SITE_KEY} />
    </>
  );
}
