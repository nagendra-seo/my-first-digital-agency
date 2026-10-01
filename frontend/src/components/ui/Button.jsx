import { Link } from "react-router-dom";

const base = "inline-flex items-center justify-center gap-2 rounded-full font-bold transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed";

const variants = {
  primary: "bg-gold-400 text-charcoal-900 hover:bg-gold-300 px-6 py-3",
  dark: "bg-charcoal-900 text-cream-100 hover:bg-charcoal-800 px-6 py-3",
  outline: "border-2 border-charcoal-900 text-charcoal-900 hover:bg-charcoal-900 hover:text-cream-100 px-6 py-3",
  ghost: "text-charcoal-900 hover:text-gold-600 px-2 py-1",
};

export function Button({ children, variant = "primary", href, className = "", type = "button", ...rest }) {
  const classes = `${base} ${variants[variant]} ${className}`;
  if (href) {
    return (
      <Link to={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}
