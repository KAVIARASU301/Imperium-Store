const rows = [
  ["BANKNIFTY", "ENTRY FILTER", "+0.82%", "text-emerald-400"],
  ["CVD LAB", "REPLAY", "v1.0.0", "text-[#0891b2]"],
  ["RISK", "MAX LOSS", "DEFINED", "text-amber-300"],
  ["JOURNAL", "REVIEW", "READY", "text-slate-200"],
];

export default function TerminalPreview() {
  return (
    <div className="border border-[#1b3055] bg-[#0c1525]/95 p-4 shadow-2xl shadow-black/40">
      <div className="flex items-center justify-between border-b border-[#1b3055] pb-3 font-mono text-xs text-[#6882a8]">
        <span>IMPERIUM_TERMINAL</span><span>LIVE PRACTICE MODE</span>
      </div>
      <div className="mt-4 grid gap-3">
        {rows.map(([symbol, label, value, color]) => (
          <div key={symbol} className="grid grid-cols-3 border border-[#1b3055] bg-[#070c17] p-3 font-mono text-sm">
            <span className="text-[#c5d5ee]">{symbol}</span><span className="text-[#6882a8]">{label}</span><span className={`text-right ${color}`}>{value}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 h-28 border border-[#1b3055] bg-[linear-gradient(135deg,rgba(8,145,178,.18),transparent_45%),linear-gradient(90deg,rgba(27,48,85,.55)_1px,transparent_1px),linear-gradient(rgba(27,48,85,.55)_1px,transparent_1px)] bg-[length:100%_100%,24px_24px,24px_24px]" />
    </div>
  );
}
