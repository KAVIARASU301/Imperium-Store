const rows = [
  ["BANKNIFTY", "ENTRY FILTER", "+0.82%", "text-emerald-400"],
  ["CVD LAB", "REPLAY", "v1.0.0", "text-brand"],
  ["RISK", "MAX LOSS", "DEFINED", "text-amber-300"],
  ["JOURNAL", "REVIEW", "READY", "text-slate-200"],
];

export default function TerminalPreview() {
  return (
    <div className="border border-cyan-border bg-section/95 p-4 shadow-2xl shadow-black/40">
      <div className="flex items-center justify-between border-b border-cyan-border pb-3 font-mono text-xs text-muted">
        <span>IMPERIUM_TERMINAL</span><span>LIVE PRACTICE MODE</span>
      </div>
      <div className="mt-4 grid gap-3">
        {rows.map(([symbol, label, value, color]) => (
          <div key={symbol} className="grid grid-cols-3 border border-cyan-border bg-main p-3 font-mono text-sm">
            <span className="text-white">{symbol}</span><span className="text-muted">{label}</span><span className={`text-right ${color}`}>{value}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 h-28 border border-cyan-border bg-[linear-gradient(135deg,rgba(73,199,232,.10),transparent_45%),linear-gradient(90deg,rgba(73,199,232,.10)_1px,transparent_1px),linear-gradient(rgba(73,199,232,.08)_1px,transparent_1px)] bg-[length:100%_100%,24px_24px,24px_24px]" />
    </div>
  );
}
