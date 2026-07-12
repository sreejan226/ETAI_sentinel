import { moduleFlow } from "@/lib/sentinel-data";
import {
  ArrowRight,
  BrainCircuit,
  FileScan,
  Fingerprint,
  MapPinned,
  Radar,
  Shield,
  Workflow,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 soft-grid opacity-15" />
      <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-amber-300/12 blur-3xl" />
      <div className="absolute -right-32 top-16 h-96 w-96 rounded-full bg-emerald-300/12 blur-3xl" />

      <div className="relative mx-auto max-w-[1680px] px-4 py-6 sm:px-6 lg:px-8">
        <header className="panel-strong mb-6 rounded-[28px] px-5 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-amber-300 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/20">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-amber-200/70">
                  SentinelAI
                </p>
                <p className="text-sm text-slate-300">
                  AI-powered fraud intelligence and investigation platform
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-amber-300 px-4 py-2.5 text-sm font-medium text-slate-950 transition hover:bg-amber-200"
              >
                Open dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/investigation"
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2.5 text-sm font-medium text-slate-100 transition hover:border-white/20 hover:bg-white/10"
              >
                Run investigation
              </Link>
            </div>
          </div>
        </header>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="panel-strong rounded-4xl p-6 sm:p-8">
            <div className="inline-flex rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.28em] text-emerald-100">
              Intelligence platform, not a complaint portal
            </div>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-slate-50 sm:text-6xl">
              Anonymous reporting flowing into AI, OSINT, graph analysis, and
              geospatial threat intelligence.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
              SentinelAI turns public complaints into actionable intelligence.
              Every signal is extracted, normalized, linked, scored, and placed
              on a live SOC-style dashboard for law enforcement and financial
              fraud teams.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                ["Anonymous intake", "No login, no identity, no friction."],
                [
                  "Entity resolution",
                  "Phone, UPI, wallets, domains, and handles.",
                ],
                [
                  "Actionable output",
                  "Threat score, evidence, and next steps.",
                ],
              ].map(([title, detail]) => (
                <div
                  key={title}
                  className="rounded-3xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="text-sm font-medium text-slate-100">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {detail}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/dashboard/complaints"
                className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2.5 text-sm font-medium text-amber-100 transition hover:bg-amber-300/15"
              >
                Start anonymous reporting
              </Link>
              <Link
                href="/report"
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2.5 text-sm font-medium text-slate-100 transition hover:border-white/20 hover:bg-white/10"
              >
                View AI report
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <div className="panel rounded-[28px] p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-amber-200/70">
                Intelligence chain
              </p>
              <div className="mt-4 space-y-3">
                {moduleFlow.map((step, index) => (
                  <div
                    key={step.title}
                    className="flex gap-4 rounded-3xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-amber-300 to-orange-500 text-sm font-semibold text-slate-950">
                      {index + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-slate-50">
                          {step.title}
                        </h3>
                        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] uppercase tracking-[0.2em] text-slate-400">
                          {step.accent}
                        </span>
                      </div>
                      <p className="mt-1 text-sm leading-6 text-slate-400">
                        {step.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel rounded-[28px] p-5">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-100">
                <Radar className="h-4 w-4 text-amber-200" />
                Built for judges, reviewers, and investigators
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  [
                    "AI classifier",
                    "Llama / Gemma / Gemini output with JSON only",
                  ],
                  [
                    "OSINT engine",
                    "WHOIS, DNS, search, media, and social traces",
                  ],
                  ["Deepfake analysis", "Image, audio, and face signals"],
                  ["Map + graph", "Heatmaps, clusters, and entity expansion"],
                ].map(([title, detail]) => (
                  <div
                    key={title}
                    className="rounded-3xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-100">
                      <Fingerprint className="h-4 w-4 text-amber-200" />
                      {title}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-3">
          {[
            {
              icon: BrainCircuit,
              title: "Classifier first",
              text: "Complaint understanding is the heart of the system. It extracts entities, threat level, and recommended action.",
            },
            {
              icon: FileScan,
              title: "OSINT enriched",
              text: "The platform collects Whois, DNS, phishing reputation, public mentions, and leaks to add evidence.",
            },
            {
              icon: MapPinned,
              title: "Geo aware",
              text: "District-level hotspots, patrol suggestions, and movement patterns make the intelligence operational.",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="panel rounded-[28px] p-5">
                <Icon className="h-5 w-5 text-amber-200" />
                <h3 className="mt-4 text-lg font-semibold text-slate-50">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {item.text}
                </p>
              </div>
            );
          })}
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="panel-strong rounded-4xl p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-amber-200/70">
                  Product layout
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-50">
                  One flow, every module feeding the next.
                </h2>
              </div>
              <Workflow className="h-6 w-6 text-amber-200" />
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                "Anonymous public intake",
                "AI complaint parsing",
                "OSINT enrichment",
                "Agentic investigation",
                "Knowledge graph merge",
                "Risk score and geospatial hot zones",
              ].map((step, index) => (
                <div
                  key={step}
                  className="rounded-3xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-100">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="panel rounded-4xl p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-amber-200/70">
              Deployment goals
            </p>
            <div className="mt-5 space-y-4 text-sm leading-6 text-slate-300">
              <p>
                Ship the anonymous intake portal, then connect it to the FastAPI
                complaint pipeline and the entity resolution layer.
              </p>
              <p>
                Add the OSINT collector, graph ingestion, and geospatial update
                jobs so every complaint can become a linked intelligence case.
              </p>
              <p>
                Finish with report generation, dashboard analytics, and PDF
                export for field investigators.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-amber-300 px-4 py-2.5 text-sm font-medium text-slate-950"
              >
                Enter SentinelAI
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard/complaints"
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2.5 text-sm font-medium text-slate-100"
              >
                Anonymous complaint portal
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
