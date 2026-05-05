interface StatusPanelProps {
  label: string;
  value?: string | number | null;
  error?: string | null;
  loading?: boolean;
}

export function StatusPanel({ label, value, error, loading }: StatusPanelProps) {
  return (
    <div className="rounded-[1.5rem] border border-slate-800/90 bg-[#04141d]/90 p-5 shadow-[0_20px_50px_-30px_rgba(46,227,164,0.4)]">
      <p className="text-xs uppercase tracking-[0.35em] text-slate-500">{label}</p>
      <div className="mt-3 flex items-center gap-3">
        <span className="h-3 w-3 rounded-full bg-[#2ee3a4] shadow-lg shadow-[#2ee3a4]/30"></span>
        <p className="text-sm font-semibold text-white">{loading ? "In progress..." : error ? "Error" : value ?? "n/a"}</p>
      </div>
      {error ? <p className="mt-3 text-sm text-rose-400">{error}</p> : null}
    </div>
  );
}
