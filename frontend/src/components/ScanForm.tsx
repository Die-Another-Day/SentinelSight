"use client";

import { useState } from "react";
import type { ScanPayload } from "@/lib/types";

const scanOptions = [
  { value: "probe", label: "Probe" },
  { value: "traceroute", label: "Traceroute" },
  { value: "full-scan", label: "Full Scan" },
];

interface ScanFormProps {
  onSubmit: (payload: ScanPayload) => void;
  disabled?: boolean;
}

export function ScanForm({ onSubmit, disabled = false }: ScanFormProps) {
  const [target, setTarget] = useState("");
  const [count, setCount] = useState(3);
  const [scanType, setScanType] = useState<ScanPayload["scanType"]>("full-scan");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({ target: target.trim(), count, scanType });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-[1.5fr_1fr] lg:grid-cols-[1.3fr_0.8fr]">
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-slate-200">Target IP / domain</label>
        <input
          type="text"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="e.g. 8.8.8.8 or example.com"
          className="w-full rounded-3xl border border-slate-700/90 bg-[#031116] px-4 py-4 text-slate-100 outline-none transition focus:border-[#2ee3a4] focus:ring-2 focus:ring-[#2ee3a4]/15"
          required
          disabled={disabled}
        />
      </div>

      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-200">Number of probes</label>
          <input
            type="number"
            value={count}
            min={1}
            max={10}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full rounded-3xl border border-slate-700/90 bg-[#031116] px-4 py-4 text-slate-100 outline-none transition focus:border-[#2ee3a4] focus:ring-2 focus:ring-[#2ee3a4]/15"
            disabled={disabled}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-200">Scan type</label>
          <select
            value={scanType}
            onChange={(e) => setScanType(e.target.value as ScanPayload["scanType"])}
            className="w-full rounded-3xl border border-slate-700/90 bg-[#031116] px-4 py-4 text-slate-100 outline-none transition focus:border-[#2ee3a4] focus:ring-2 focus:ring-[#2ee3a4]/15"
            disabled={disabled}
          >
            {scanOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-[#020406] text-slate-100">
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={disabled}
          className="rounded-3xl bg-[#2ee3a4] px-6 py-4 text-sm font-semibold text-black transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {disabled ? "Scanning..." : "Launch Scan"}
        </button>
      </div>
    </form>
  );
}
