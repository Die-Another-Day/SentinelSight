import Link from "next/link";
import { ArrowRight, Activity, ShieldCheck, Globe2 } from "lucide-react";

const cards = [
  {
    title: "Live scanning",
    description: "Run ICMP probes, traceroute and full scans from a secure backend.",
    icon: Activity,
  },
  {
    title: "Path intelligence",
    description: "Visualize route latency, hop details, and geolocation metadata.",
    icon: Globe2,
  },
  {
    title: "Secure delivery",
    description: "Backend-hosted scanning with safe public APIs and responsive UI.",
    icon: ShieldCheck,
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <header className="mb-12 flex flex-col gap-6 text-center">
          <span className="inline-flex rounded-full bg-[#061014] px-4 py-2 text-xs uppercase tracking-[0.35em] text-[#2ee3a4] ring-1 ring-[#2ee3a4]/20">
            SentinelSight Network Intelligence
          </span>
          <div className="space-y-6">
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
              Active route analysis with a hacker-grade UI.
            </h1>
            <p className="mx-auto max-w-3xl text-xl leading-8 text-slate-300">
              Run probe, traceroute, or full-path scans from the browser. SentinelSight connects to your backend, performs network intelligence, and visualizes results instantly.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/scan" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2ee3a4] px-6 py-3 text-sm font-semibold text-black transition hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-[#2ee3a4]/70">
              Start a scan
              <ArrowRight size={16} />
            </Link>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <article key={card.title} className="rounded-[1.5rem] border border-slate-800/80 bg-[#08131f]/70 p-6 shadow-[0_25px_50px_-25px_rgba(0,0,0,0.8)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-[#2ee3a4]/50">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0d242f] text-[#2ee3a4] shadow-lg shadow-[#0d242f]/80">
                  <Icon size={24} />
                </div>
                <h2 className="text-xl font-semibold text-white">{card.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">{card.description}</p>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
