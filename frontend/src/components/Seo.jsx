import { Helmet } from "react-helmet-async";

const SITE_NAME = "My First Digital Agency";

/** Sets the document title/description/JSON-LD for one page. Because this
 *  is a client-rendered SPA (no server-side rendering), search engines
 *  that don't execute JavaScript will see the fallback tags already in
 *  index.html rather than these — see README's SEO note for the tradeoff
 *  and how to add prerendering later if you need it. */
export function Seo({ title, description, jsonLd }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — SEO, Ads, Websites & Growth`;
  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:site_name" content={SITE_NAME} />}
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
}
