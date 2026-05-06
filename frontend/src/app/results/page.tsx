"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ResultCharts from "../../components/ResultCharts";
import HopTable from "../../components/HopTable";
import GeoMap from "../../components/GeoMap";
import ActionBar from "../../components/ActionBar";

import { someFunction } from "../../lib/api";

const emptyResult: ScanResponse = {
  target: "",
  probe_results: [],
  traceroute_results: [],
  summary: {},
};

export default function ResultsPage() {
  const [result, setResult] = useState<ScanResponse>(emptyResult);

  useEffect(() => {
    const raw = window.sessionStorage.getItem("sentinel-sight-last-scan");
    if (raw) {
      try {
        setResult(JSON.parse(raw));
      } catch {
        setResult(emptyResult);
      }
    }
  }, []);

  return (
    <main className="min-h-screen bg-[#020406] text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#2ee3a4]/80">Scan results</p>
            <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Recent SentinelSight result</h1>
          </div>
          <Link href="/scan" className="rounded-full border border-[#2ee3a4]/50 bg-[#061014] px-5 py-3 text-sm font-semibold text-[#2ee3a4] transition hover:bg-[#072126]">
            Run a new scan
          </Link>
        </div>

        {!result.target ? (
          <div className="rounded-[2rem] border border-dashed border-slate-700/80 bg-[#071017]/80 p-10 text-center text-slate-400">
            No scan data found. Run a scan first and return to this page.
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
            <section className="rounded-[2rem] border border-slate-800/80 bg-[#071017]/80 p-6 shadow-[0_20px_60px_-30px_rgba(0,255,180,0.25)] backdrop-blur-xl">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-[#2ee3a4]/80">Target</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">{result.target}</h2>
                </div>
                <div className="rounded-full bg-[#05181f] px-4 py-2 text-sm text-slate-300">
                  {result.summary?.max_ttl ? `Max TTL: ${result.summary.max_ttl}` : "Probe only"}
                </div>
              </div>
              <ResultCharts tracerouteData={result.traceroute_results} />
            </section>

            <section className="space-y-6">
              <div className="rounded-[2rem] border border-slate-800/80 bg-[#071017]/80 p-6 shadow-[0_20px_60px_-30px_rgba(0,255,180,0.25)] backdrop-blur-xl">
                <h3 className="text-lg font-semibold text-white">Summary</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-[#041217]/90 p-4">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Average RTT</p>
                    <p className="mt-2 text-2xl font-semibold text-[#2ee3a4]">{result.summary?.average_rtt_ms ?? "—"} ms</p>
                  </div>
                  <div className="rounded-3xl bg-[#041217]/90 p-4">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Probes sent</p>
                    <p className="mt-2 text-2xl font-semibold text-[#8be4ff]">{result.summary?.probes_sent ?? "—"}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-800/80 bg-[#071017]/80 p-6 shadow-[0_20px_60px_-30px_rgba(0,255,180,0.25)] backdrop-blur-xl">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Actions</h3>
                    <p className="mt-1 text-sm text-slate-400">Copy or download the current scan payload.</p>
                  </div>
                  <ActionBar data={result} />
                </div>
              </div>
            </section>
          </div>
        )}

        {result.traceroute_results.length > 0 ? (
          <div className="mt-6 rounded-[2rem] border border-slate-800/80 bg-[#071017]/80 p-6 shadow-[0_20px_60px_-30px_rgba(0,255,180,0.25)] backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-white">Hop-by-Hop details</h3>
            <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-slate-800 bg-[#020406]">
              <HopTable data={result.traceroute_results} />
            </div>
            <div className="mt-8 h-[420px] rounded-[1.75rem] border border-slate-800 bg-[#020406]">
              <GeoMap data={result.traceroute_results} />
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
