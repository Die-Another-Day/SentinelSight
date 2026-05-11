import type { HopResult } from "../lib/type";

interface HopTableProps {
  data: HopResult[];
}


export function HopTable({ data }: HopTableProps) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-slate-800 bg-[#020406]">
      <div className="grid grid-cols-[80px_1fr_100px_120px] gap-4 bg-[#071c28] px-6 py-4 text-xs uppercase tracking-[0.3em] text-slate-500 sm:grid-cols-[80px_1fr_120px_140px]">
        <span>Hop</span>
        <span>IP / Location</span>
        <span>RTT</span>
        <span>Status</span>
      </div>
      <div className="divide-y divide-slate-800">
        {data.map((hop) => (
          <div key={hop.ttl} className="grid grid-cols-[80px_1fr_100px_120px] gap-4 px-6 py-5 text-sm text-slate-200 sm:grid-cols-[80px_1fr_120px_140px]">
            <p className="font-semibold text-[#8be4ff]">{hop.ttl}</p>
            <div className="space-y-1">
              <p>{hop.source ?? "unknown"}</p>
              <p className="text-xs text-slate-500">{hop.city ? `${hop.city}, ${hop.country}` : "No geo data"}</p>
            </div>
            <p>{hop.rtt_ms ? `${hop.rtt_ms.toFixed(2)} ms` : "—"}</p>
            <p className="rounded-full bg-[#122028] px-3 py-1 text-xs text-[#2ee3a4]">{hop.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
