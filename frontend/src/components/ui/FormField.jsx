const fieldBase = "w-full rounded-lg border bg-white px-4 py-3 text-sm text-charcoal-900 placeholder:text-ink-faint focus:border-gold-500 focus:outline-none";

function fieldBorder(error) {
  return error ? "border-red-400" : "border-charcoal-900/15";
}

export function Label({ children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-charcoal-900">
      {children}
    </label>
  );
}

export function ErrorText({ children }) {
  if (!children) return null;
  return <p className="mt-1 text-xs font-medium text-red-600">{children}</p>;
}

export function TextInput({ error, className = "", ...rest }) {
  return <input className={`${fieldBase} ${fieldBorder(error)} ${className}`} {...rest} />;
}

export function TextArea({ error, className = "", ...rest }) {
  return <textarea className={`${fieldBase} ${fieldBorder(error)} ${className}`} {...rest} />;
}

export function Select({ error, className = "", children, ...rest }) {
  return (
    <select className={`${fieldBase} ${fieldBorder(error)} ${className}`} {...rest}>
      {children}
    </select>
  );
}
