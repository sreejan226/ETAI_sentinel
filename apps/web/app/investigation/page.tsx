"use client";

import {
  Panel,
  PillList,
  ScoreBar,
  SectionHeader,
  Tag,
} from "@/components/dashboard/ui";
import { PortalShell } from "@/components/layout/portal-shell";
import { investigationSamples } from "@/lib/sentinel-data";
import { BadgeAlert, Search, Shield, Workflow } from "lucide-react";
import { useMemo, useState } from "react";

function findSample(query: string) {
  const lower = query.toLowerCase();
  return (
    investigationSamples.find(
      (sample) => sample.entity.toLowerCase() === lower,
    ) ??
    investigationSamples.find(
      (sample) => sample.entityType === "domain" && lower.includes("http"),
    ) ??
    investigationSamples[0]
  );
}

export default function InvestigationPage() {
  const [query, setQuery] = useState("fraud@ybl");
  const [current, setCurrent] = useState(() => findSample(query));

  const selected = useMemo(() => current, [current]);

  const runInvestigation = () => {
    setCurrent(findSample(query));
  };

  return (
    <PortalShell
      eyebrow="Agentic investigation"
      title="Search an entity and open the full intelligence view"
      subtitle="The investigator AI follows the complaint graph, enriches with OSINT, highlights missing information, and recommends the next step."
      actions={
        <>
          <Tag tone="amber">Planner</Tag>
          <Tag tone="rose">OSINT agent</Tag>
          <Tag tone="emerald">Graph agent</Tag>
        </>
      }
    >
      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel>
          <SectionHeader
            eyebrow="Search"
            title="Investigate phone, UPI, domain, email, or Telegram"
            description="Search by any known identifier, then expand into the intelligence report."
          />

          <div className="mt-6 flex gap-3">
            <label className="flex-1">
              <span className="sr-only">Search entity</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-amber-300/40"
                placeholder="fraud@ybl"
              />
            </label>
            <button
              type="button"
              onClick={runInvestigation}
              className="inline-flex items-center gap-2 rounded-2xl bg-amber-300 px-4 py-3 text-sm font-medium text-slate-950 transition hover:bg-amber-200"
            >
              <Search className="h-4 w-4" />
              Run
            </button>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {["Phone", "UPI", "Domain", "Email", "Telegram", "Username"].map(
              (type) => (
                <div
                  key={type}
                  className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300"
                >
                  {type}
                </div>
              ),
            )}
          </div>

          <div className="mt-6 rounded-[28px] border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-amber-200" />
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  Investigation target
                </p>
                <p className="text-base font-medium text-slate-100">
                  {selected.entity}
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <ScoreBar score={selected.score} />
              <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-amber-200/70">
                  Status
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {selected.status}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-[28px] border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-amber-200/70">
              Planner output
            </p>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <p>1. Collect OSINT for the entity and its connected signals.</p>
              <p>
                2. Pull related complaints and merge aliases into the graph.
              </p>
              <p>
                3. Score the case, flag missing evidence, and generate the
                report.
              </p>
            </div>
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel>
            <SectionHeader
              eyebrow="Investigation report"
              title="Full intelligence view"
              description="This mirrors the final report the agent produces after the planner, OSINT agent, graph agent, geo agent, and report agent finish."
            />

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                ["Threat score", `${selected.score} / 100`],
                ["Entity type", selected.entityType],
                ["Connected complaints", `${selected.complaints.length}`],
                ["Evidence sources", `${selected.osint.length}`],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-3xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                    {label}
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-100">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-amber-200/70">
                  Aliases
                </p>
                <div className="mt-4">
                  <PillList items={selected.aliases} />
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-amber-200/70">
                  Connected complaints
                </p>
                <div className="mt-4 space-y-2 text-sm text-slate-300">
                  {selected.complaints.map((complaint) => (
                    <div key={complaint} className="flex items-center gap-3">
                      <Workflow className="h-4 w-4 text-amber-200" />
                      {complaint}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Panel>

          <Panel>
            <SectionHeader
              eyebrow="OSINT findings"
              title="Collected evidence"
              description="The OSINT layer aggregates public traces so the report can be defended with evidence, not just model output."
            />
            <div className="mt-6 space-y-3">
              {selected.osint.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300"
                >
                  <BadgeAlert className="mt-1 h-4 w-4 shrink-0 text-amber-200" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </Panel>

          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <Panel>
              <SectionHeader
                eyebrow="Missing information"
                title="What the agent still needs"
                description="The investigator surfaces the gaps that matter so field teams can close them quickly."
              />
              <div className="mt-5 space-y-3 text-sm text-slate-300">
                {selected.missing.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-rose-300" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel>
              <SectionHeader
                eyebrow="Recommended action"
                title="Next move"
                description="The agent recommends the operational step that best matches the current evidence."
              />
              <div className="mt-5 space-y-3">
                {selected.suggestedActions.map((action) => (
                  <div
                    key={action}
                    className="rounded-3xl border border-amber-300/15 bg-amber-300/10 p-4 text-sm text-slate-200"
                  >
                    {action}
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          <Panel>
            <SectionHeader
              eyebrow="Evidence timeline"
              title="How the case evolves"
              description="A simple timeline keeps the story readable for reviewers and investigators."
            />
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {[
                [
                  "Complaint received",
                  "Anonymous citizen report with phone and UPI",
                ],
                [
                  "OSINT expanded",
                  "Domain age, social mentions, and scam patterns linked",
                ],
                [
                  "Graph merged",
                  "Aliases and complaints collapsed into one entity",
                ],
              ].map(([title, detail], index) => (
                <div
                  key={title}
                  className="rounded-3xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                    Step {index + 1}
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-100">
                    {title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {detail}
                  </p>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </section>
    </PortalShell>
  );
}
