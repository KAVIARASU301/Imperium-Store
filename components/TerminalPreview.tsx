const rows = [
  ["BANKNIFTY", "ENTRY FILTER", "+0.82%", "text-emerald-400"],
  ["CVD LAB", "REPLAY", "v1.0.0", "text-cyan-300"],
  ["RISK", "MAX LOSS", "DEFINED", "text-amber-300"],
  ["JOURNAL", "REVIEW", "READY", "text-slate-200"],
];

export default function TerminalPreview() {
  return (
    <div className="rounded-xl border border-cyan-400/20 bg-[#0B1020]/90 p-4 shadow-2xl shadow-cyan-950/40">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono text-xs text-slate-400">
        <span>IMPERIUM_TERMINAL</span><span>LIVE PRACTICE MODE</span>
      </div>
      <div className="mt-4 grid gap-3">
        {rows.map(([symbol, label, value, color]) => (
          <div key={symbol} className="grid grid-cols-3 rounded-md border border-slate-800 bg-black/20 p-3 font-mono text-sm">
            <span className="text-white">{symbol}</span><span className="text-slate-500">{label}</span><span className={`text-right ${color}`}>{value}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 h-28 rounded-md border border-slate-800 bg-[linear-gradient(135deg,rgba(34,211,238,.16),transparent_45%),linear-gradient(90deg,rgba(30,42,58,.45)_1px,transparent_1px),linear-gradient(rgba(30,42,58,.45)_1px,transparent_1px)] bg-[length:100%_100%,24px_24px,24px_24px]" />
    </div>
  );
}
