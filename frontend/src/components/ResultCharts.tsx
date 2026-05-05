"use client";

import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { HopInfo } from "@/lib/types";

interface ResultChartsProps {
  tracerouteData: HopInfo[];
}

export function ResultCharts({ tracerouteData }: ResultChartsProps) {
  const chartData = tracerouteData.map((hop) => ({
    hop: hop.ttl,
    rtt: hop.rtt_ms ?? 0,
    status: hop.status,
  }));

  return (
    <div className="space-y-8">
      <div className="rounded-[1.75rem] border border-slate-800/90 bg-[#020406]/80 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">RTT per hop</p>
            <h3 className="mt-2 text-lg font-semibold text-white">Latency graph</h3>
          </div>
        </div>
        <div className="mt-5 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#1c2b35" strokeDasharray="3 3" />
              <XAxis dataKey="hop" stroke="#718096" />
              <YAxis stroke="#718096" />
              <Tooltip contentStyle={{ backgroundColor: "#061219", borderColor: "#2ee3a4" }} formatter={(value) => [`${value} ms`, "RTT"]} />
              <Line type="monotone" dataKey="rtt" stroke="#2ee3a4" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-slate-800/90 bg-[#020406]/80 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Hop summary</p>
            <h3 className="mt-2 text-lg font-semibold text-white">Hop latency overview</h3>
          </div>
        </div>
        <div className="mt-5 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#1c2b35" strokeDasharray="3 3" />
              <XAxis dataKey="hop" stroke="#718096" />
              <YAxis stroke="#718096" />
              <Tooltip contentStyle={{ backgroundColor: "#061219", borderColor: "#2ee3a4" }} formatter={(value) => [`${value} ms`, "RTT"]} />
              <Bar dataKey="rtt" fill="#2ee3a4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
