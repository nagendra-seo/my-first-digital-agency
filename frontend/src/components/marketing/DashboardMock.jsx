const points = [8, 14, 13, 22, 26, 24, 34, 40, 46, 58, 68, 82];
const width = 460;
const height = 140;
const maxVal = Math.max(...points);
const stepX = width / (points.length - 1);

function toPath(vals) {
  return vals
    .map((v, i) => {
      const x = i * stepX;
      const y = height - (v / maxVal) * (height - 10) - 5;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

const linePath = toPath(points);
const areaPath = `${linePath} L${width},${height} L0,${height} Z`;

function Metric({ label, value, delta }) {
  return (
    <div className="rounded-xl border border-charcoal-900/8 bg-cream-100 p-4">
      <p className="text-xs text-ink-faint">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold text-charcoal-900">{value}</p>
      <p className="mt-1 text-xs font-semibold text-emerald-600">↑ {delta}</p>
    </div>
  );
}

export function DashboardMock() {
  return (
    <div className="w-full max-w-md rounded-2xl border border-charcoal-900/10 bg-white p-5 shadow-2xl shadow-charcoal-900/10 sm:p-6" aria-hidden="true">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gold-400 text-[11px] font-bold text-charcoal-900">MF</span>
          <span className="text-sm font-bold text-charcoal-900">Growth dashboard</span>
        </div>
        <span className="rounded-full bg-cream-200 px-3 py-1 text-[11px] font-semibold text-ink-soft">Last 6 months</span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <Metric label="Organic traffic" value="235K" delta="164%" />
        <Metric label="Qualified leads" value="4,850" delta="210%" />
        <Metric label="Conversions" value="1,240" delta="183%" />
      </div>

      <div className="mt-5 rounded-xl border border-charcoal-900/8 p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-charcoal-900">Website traffic</p>
          <p className="text-[11px] text-ink-faint">Jan &ndash; Jun</p>
        </div>
        <svg viewBox={`0 0 ${width} ${height}`} className="mt-3 w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="goldFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F5C319" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#F5C319" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#goldFade)" />
          <path d={linePath} fill="none" stroke="#DDA80E" strokeWidth="2.5" />
        </svg>
        <div className="mt-1 flex justify-between text-[10px] text-ink-faint">
          <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
        </div>
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-ink-faint">Illustrative dashboard for demonstration purposes — not client data.</p>
    </div>
  );
}
