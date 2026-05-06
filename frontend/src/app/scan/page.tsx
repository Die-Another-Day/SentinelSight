"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import ScanForm from "../../components/ScanForm";



import { StatusPanel } from "../../components/StatusPanel";
import { ResultCharts } from "../../components/ResultCharts";
import { HopTable } from "../../components/HopTable";
import { GeoMap } from "../../components/GeoMap";
import { ActionBar } from "../../components/ActionBar";
import { postFullScan, postProbe, postTraceroute } from "@/lib/api";
import type { ScanPayload, ScanResponse } from "@/lib/types";

const initialResponse: ScanResponse = {
  target: "",
  probe_results: [],
  traceroute_results: [],
  summary: {},
};

export default function ScanPage() {
  const [status, setStatus] = useState("Ready to scan");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResponse>(initialResponse);
  const router = useRouter();

  useEffect(() => {
    if (!result.target) return;
    window.sessionStorage.setItem("sentinel-sight-last-scan", JSON.stringify(result));
  }, [result]);

  const latestRtt = useMemo(() => {
    if (!result.probe_results.length) return null;
    const rtts = result.probe_results.map((item) => item.rtt_ms ?? 0).filter((value) => value > 0);
    if (!rtts.length) return null;
    return Math.round(rtts.reduce((sum, value) => sum + value, 0) / rtts.length);
  }, [result.probe_results]);

  const handleScan = async (payload: ScanPayload) => {
    setError(null);
    setStatus(`Starting ${payload.scanType.toLowerCase()}...`);
    setIsLoading(true);

    try {
      let response: ScanResponse;
      if (payload.scanType === "probe") {
        setStatus("Sending ICMP probes...");
        response = await postProbe(payload);
      } else if (payload.scanType === "traceroute") {
        setStatus("Tracing route...");
        response = await postTraceroute(payload);
      } else {
        setStatus("Running full scan...");
        response = await postFullScan(payload);
      }

      setResult(response);
      setStatus("Scan complete. Review results below.");
      setTimeout(() => router.push("/results"), 300);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected scan error");
      setStatus("Scan failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#020406] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-10 px-6 py-8 lg:px-8">
        <div className="rounded-[2rem] border border-slate-800/80 bg-[#071017]/80 p-8 shadow-[0_30px_80px_-40px_rgba(0,255,180,0.3)] backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.36em] text-[#2ee3a4]/80">SentinelSight Scan Console</p>
              <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Run network intelligence scans safely.</h1>
              <p className="mt-3 max-w-2xl text-slate-300">Enter an IP or domain, choose the scan mode, and visualize path latency with a hacker-style dashboard.</p>
            </div>
          </div>
          <div className="mt-8">
            <ScanForm onSubmit={handleScan} disabled={isLoading} />
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatusPanel label="Status" value={status} error={error} loading={isLoading} />
            <StatusPanel label="Latest RTT" value={latestRtt ? `${latestRtt} ms` : "N/A"} />
            <StatusPanel label="Hop count" value={result.traceroute_results.length.toString() || "0"} />
          </div>
        </div>

        {result.target ? (
          <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
            <div className="rounded-[2rem] border border-slate-800/80 bg-[#071017]/80 p-6 shadow-[0_20px_60px_-30px_rgba(0,255,180,0.25)] backdrop-blur-xl">
              <h2 className="text-lg font-semibold text-white">Live Scan Preview</h2>
              <p className="mt-2 text-sm text-slate-400">A preview of the latest scan result before navigation.</p>
              <div className="mt-6 space-y-6">
                <ResultCharts tracerouteData={result.traceroute_results} />
              </div>
            </div>
            <div className="rounded-[2rem] border border-slate-800/80 bg-[#071017]/80 p-6 shadow-[0_20px_60px_-30px_rgba(0,255,180,0.25)] backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-white">Actions</h2>
                  <p className="mt-1 text-sm text-slate-400">Copy or download the latest result.</p>
                </div>
                <ActionBar data={result} />
              </div>
              <div className="mt-6">
                <HopTable data={result.traceroute_results} />
              </div>
            </div>
          </div>
        ) : null}

        {result.traceroute_results.length > 0 ? (
          <div className="rounded-[2rem] border border-slate-800/80 bg-[#071017]/80 p-6 shadow-[0_20px_60px_-30px_rgba(0,255,180,0.25)] backdrop-blur-xl">
            <h2 className="text-lg font-semibold text-white">Geolocation Map</h2>
            <p className="mt-2 text-sm text-slate-400">Hop coordinates display if supported by the backend response.</p>
            <div className="mt-6 h-[420px] rounded-[1.75rem] border border-slate-800 bg-[#020406]">
              <GeoMap data={result.traceroute_results} />
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
