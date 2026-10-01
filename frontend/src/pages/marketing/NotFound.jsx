import { Link } from "react-router-dom";
import { Seo } from "../../components/Seo.jsx";
import { Container } from "../../components/ui/Container.jsx";
import { Button } from "../../components/ui/Button.jsx";

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found" />
      <section className="flex min-h-[60vh] items-center bg-cream-100">
        <Container className="text-center">
          <p className="font-display text-7xl font-extrabold text-gold-400">404</p>
          <h1 className="mt-4 font-display text-2xl font-bold text-charcoal-900">We couldn&rsquo;t find that page.</h1>
          <p className="mx-auto mt-3 max-w-md text-ink-soft">The page you&rsquo;re looking for may have moved, or the link might be out of date.</p>
          <div className="mt-8 flex justify-center gap-3">
            <Button href="/" variant="primary">Back to home</Button>
            <Button href="/contact" variant="outline">Contact us</Button>
          </div>
          <p className="mt-8">
            <Link to="/services" className="text-sm font-semibold text-charcoal-900 underline decoration-gold-400">Browse our services instead</Link>
          </p>
        </Container>
      </section>
    </>
  );
}
