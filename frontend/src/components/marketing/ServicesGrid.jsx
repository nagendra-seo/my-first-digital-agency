import { Link } from "react-router-dom";
import { Icon } from "../ui/Icon.jsx";
import { SERVICES } from "../../lib/servicesData.js";

export function ServicesGrid({ limit }) {
  const services = limit ? SERVICES.slice(0, limit) : SERVICES;

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <Link key={service.slug} to={`/services/${service.slug}`} className="group flex flex-col rounded-2xl border border-charcoal-900/10 bg-white p-6 transition-shadow hover:shadow-xl hover:shadow-charcoal-900/5">
          <div className="flex items-start justify-between">
            <Icon path={service.iconPath} className="h-7 w-7 text-gold-600" />
            <span className="text-xs font-bold text-charcoal-900/20">{service.number}</span>
          </div>
          <h3 className="mt-5 font-display text-lg font-bold text-charcoal-900">{service.name}</h3>
          <p className="mt-2 flex-1 text-sm text-ink-soft">{service.shortDescription}</p>
          <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-charcoal-900 group-hover:text-gold-600">
            Explore
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </Link>
      ))}
    </div>
  );
}
