import {
  MetricCard,
  MiniList,
  Panel,
  PillList,
  ScoreBar,
  SectionHeader,
  Tag,
} from "@/components/dashboard/ui";
import { PortalShell } from "@/components/layout/portal-shell";
import {
  complaintAnalytics,
  dashboardMetrics,
  districtRanking,
  geoHotspots,
  knowledgeGraphNodes,
} from "@/lib/sentinel-data";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Fingerprint,
  MapPinned,
  Radar,
  Workflow,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <PortalShell
      eyebrow="Law enforcement dashboard"
      title="SentinelAI command center"
      subtitle="An intelligence-first SOC view of complaints, OSINT, graph signals, and geospatial threats."
      actions={
        <>
          <Link
            href="/dashboard/complaints"
            className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2.5 text-sm font-medium text-slate-100 transition hover:border-white/20 hover:bg-white/10"
          >
            New complaint
          </Link>
          <Link
            href="/investigation"
            className="inline-flex items-center gap-2 rounded-full bg-amber-300 px-4 py-2.5 text-sm font-medium text-slate-950 transition hover:bg-amber-200"
          >
            Run investigation
            <ArrowRight className="h-4 w-4" />
          </Link>
        </>
      }
    >
      <section className="grid gap-4 xl:grid-cols-3">
        {dashboardMetrics.map((metric, index) => (
          <MetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            delta={metric.delta}
            tone={metric.tone}
            icon={
              index === 0 ? (
                <Activity className="h-5 w-5" />
              ) : index === 1 ? (
                <AlertTriangle className="h-5 w-5" />
              ) : index === 2 ? (
                <Radar className="h-5 w-5" />
              ) : index === 3 ? (
                <Fingerprint className="h-5 w-5" />
              ) : index === 4 ? (
                <BarChart3 className="h-5 w-5" />
              ) : (
                <Workflow className="h-5 w-5" />
              )
            }
          />
        ))}
      </section>

      <section id="geo" className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel className="overflow-hidden">
          <SectionHeader
            eyebrow="Geospatial intelligence"
            title="District risk map"
            description="Hotspots are ranked by complaint density, threat score, recent activity, and OSINT corroboration."
            actions={<Tag tone="rose">Live</Tag>}
          />

          <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_30%_20%,rgba(245,158,11,0.18),transparent_35%),linear-gradient(180deg,rgba(10,18,31,0.95),rgba(7,13,23,0.95))] p-5">
              <div className="soft-grid rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
                <div className="grid grid-cols-3 gap-3">
                  {geoHotspots.map((spot) => (
                    <div
                      key={spot.district}
                      className="rounded-3xl border border-white/10 bg-slate-950/40 p-4"
                    >
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                        {spot.district}
                      </p>
                      <p className="mt-3 text-2xl font-semibold text-slate-50">
                        {spot.intensity}
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        {spot.complaints} complaints
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[
                    [
                      "Complaint density",
                      "Andheri East, Whitefield, Gurugram Cyber Hub",
                    ],
                    [
                      "Movement patterns",
                      "Shared device traces across 3 districts",
                    ],
                    [
                      "Patrol priority",
                      "Maharashtra + Karnataka fraud corridors",
                    ],
                    ["Live alerts", "UPI refund and impersonation clusters"],
                  ].map(([title, detail]) => (
                    <div
                      key={title}
                      className="rounded-3xl border border-white/10 bg-white/5 p-4"
                    >
                      <p className="text-sm font-medium text-slate-100">
                        {title}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-amber-200/70">
                  AI summary
                </p>
                <h3 className="mt-3 text-xl font-semibold text-slate-50">
                  Mumbai remains the highest-risk district.
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  UPI refund scams are trending, deepfake impersonation is
                  rising, and three high-risk accounts share device
                  fingerprints.
                </p>

                <div className="mt-4 space-y-4">
                  <ScoreBar score={88} />
                  <PillList
                    items={[
                      "Trending UPI: support@paytm",
                      "Emerging scam: refund + OTP bait",
                      "Suggested patrol: Andheri East",
                    ]}
                  />
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-amber-200/70">
                  District ranking
                </p>
                <div className="mt-4 space-y-4">
                  {districtRanking.map((district) => (
                    <div key={district.district}>
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="font-medium text-slate-100">
                          {district.district}
                        </span>
                        <span className="text-slate-400">
                          {district.cases} cases
                        </span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-white/8">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-amber-300 to-orange-500"
                          style={{ width: `${district.score}%` }}
                        />
                      </div>
                      <p className="mt-2 text-xs text-slate-500">
                        {district.signal}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Panel>

        <Panel>
          <SectionHeader
            eyebrow="Operational intelligence"
            title="Right-panel summary"
            description="The dashboard turns the most actionable signals into next steps for investigators."
          />

          <div className="mt-6 space-y-4">
            {[
              ["Highest risk district", "Mumbai"],
              ["Emerging scam", "UPI refund scam"],
              ["Trending UPI", "support@paytm"],
              ["Top scam category", "upi_fraud"],
              ["Suggested patrol", "Andheri East, Mumbai"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-3xl border border-white/10 bg-white/5 p-4"
              >
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  {label}
                </p>
                <p className="mt-2 text-base font-medium text-slate-100">
                  {value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[28px] border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.28em] text-amber-200/70">
              Live complaint stream
            </p>
            <div className="mt-4 space-y-3">
              {[
                "UPI refund bait with Telegram escalation",
                "Fake bank KYC link landing on clone domain",
                "Voice clone used for urgent payment request",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 text-sm text-slate-300"
                >
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-300" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </section>

      <section id="graph" className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Panel>
          <SectionHeader
            eyebrow="Knowledge graph"
            title="Entity expansion preview"
            description="Phone, UPI, Telegram, wallet, complaint, and domain nodes are linked by shared evidence."
          />
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {knowledgeGraphNodes.map((node) => (
              <div
                key={node.label}
                className="rounded-3xl border border-white/10 bg-white/5 p-4"
              >
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  {node.label}
                </p>
                <p className="mt-2 text-sm font-medium text-slate-100">
                  {node.value}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-[28px] border border-white/10 bg-slate-950/40 p-5">
            <MiniList
              itemTone="amber"
              items={[
                "owns -> phone, UPI, wallet",
                "reported -> complaint, complaint, complaint",
                "connected -> Telegram, website, device fingerprint",
                "shared_location -> Andheri East, Borivali, Thane",
              ]}
            />
          </div>
        </Panel>

        <Panel>
          <SectionHeader
            eyebrow="Complaint analytics"
            title="What is driving the risk"
            description="Simple visuals keep the operational story obvious to decision makers."
          />

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="space-y-4 rounded-[28px] border border-white/10 bg-white/5 p-5">
              {complaintAnalytics.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-100">{item.label}</span>
                    <span className="text-slate-400">{item.value}%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-white/8">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-emerald-300 to-amber-300"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 rounded-[28px] border border-white/10 bg-white/5 p-5">
              <div className="rounded-3xl border border-amber-300/15 bg-amber-300/10 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-amber-200/70">
                  Suggested next action
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  Freeze linked handles, preserve evidence, and hand off to the
                  regional cyber cell for device and banking traces.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-100">
                  <MapPinned className="h-4 w-4 text-amber-200" />
                  District heat signal
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Crime clusters are weighted by complaint frequency, recency,
                  graph centrality, and OSINT corroboration.
                </p>
              </div>
            </div>
          </div>
        </Panel>
      </section>
    </PortalShell>
  );
}
