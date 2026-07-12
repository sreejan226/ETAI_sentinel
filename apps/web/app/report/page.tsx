"use client";

import {
  Panel,
  PillList,
  ScoreBar,
  SectionHeader,
  Tag,
} from "@/components/dashboard/ui";
import { PortalShell } from "@/components/layout/portal-shell";
import { reportHighlights } from "@/lib/sentinel-data";
import {
  ArrowDownToLine,
  BadgeInfo,
  FileText,
  Layers3,
  Printer,
  ShieldCheck,
  Timeline,
} from "lucide-react";
import Link from "next/link";

const reportSections = [
  { icon: FileText, label: "Summary and case framing" },
  { icon: Layers3, label: "Connected entities and aliases" },
  { icon: Timeline, label: "Timeline of activity and evidence" },
] as const;

export default function ReportPage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <PortalShell
      eyebrow="AI report"
      title="Generate an investigator-ready report"
      subtitle="The final case report combines classifier output, graph evidence, OSINT, timeline context, and suggested actions."
      actions={
        <>
          <Tag tone="amber">PDF ready</Tag>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-full bg-amber-300 px-4 py-2.5 text-sm font-medium text-slate-950 transition hover:bg-amber-200"
          >
            <Printer className="h-4 w-4" />
            Download PDF
          </button>
        </>
      }
    >
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Panel>
          <SectionHeader
            eyebrow="Case brief"
            title="Investigation report summary"
            description="This page is the printable final layer for police, banks, and analysts reviewing a fraud case."
          />

          <div className="mt-6 rounded-[28px] border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-300" />
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  Case status
                </p>
                <p className="text-base font-medium text-slate-100">
                  Critical, multi-entity fraud network
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-4">
              <ScoreBar score={91} />
              <p className="text-sm leading-6 text-slate-300">
                The report indicates a coordinated UPI refund scam with phishing
                infrastructure, Telegram distribution, and shared device
                fingerprints across multiple complaints.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {reportHighlights.map((item) => (
              <div
                key={item.label}
                className="rounded-3xl border border-white/10 bg-white/5 p-4"
              >
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  {item.label}
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-50">
                  {item.value}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {item.note}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-amber-200/70">
                Evidence
              </p>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                {[
                  "Complaint text, phone, UPI, and location",
                  "OSINT evidence from domain and social presence",
                  "Graph links to related complaints and aliases",
                  "Threat score derived from complaint count and recency",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <BadgeInfo className="mt-1 h-4 w-4 shrink-0 text-amber-200" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-amber-200/70">
                Suggested actions
              </p>
              <div className="mt-4 space-y-3">
                {[
                  "Freeze linked UPI handles and preserve records.",
                  "Share the case with the cyber cell and fraud desk.",
                  "Prioritize victims in high-risk districts for notification.",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-3xl border border-amber-300/15 bg-amber-300/10 p-4 text-sm text-slate-200"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel>
            <SectionHeader
              eyebrow="Report structure"
              title="What the PDF contains"
              description="The printable output keeps the important details grouped for fast review."
            />
            <div className="mt-5 space-y-3">
              {reportSections.map((section) => {
                const Icon = section.icon;

                return (
                  <div
                    key={section.label}
                    className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300"
                  >
                    <Icon className="h-4 w-4 text-amber-200" />
                    {section.label}
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel>
            <SectionHeader
              eyebrow="Key entities"
              title="Primary suspect signals"
              description="The report should surface the linked handles and entities most relevant to investigators."
            />
            <div className="mt-5">
              <PillList
                items={[
                  "fraud@ybl",
                  "+91 98765 43210",
                  "verify-payments.in",
                  "@refund_support",
                ]}
              />
            </div>
          </Panel>

          <Panel>
            <SectionHeader
              eyebrow="Export"
              title="Print to PDF"
              description="The browser print flow works as a lightweight PDF export until backend generation is wired in."
            />
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-2 rounded-full bg-amber-300 px-4 py-2.5 text-sm font-medium text-slate-950 transition hover:bg-amber-200"
              >
                <ArrowDownToLine className="h-4 w-4" />
                Print report
              </button>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2.5 text-sm font-medium text-slate-100"
              >
                Back to dashboard
              </Link>
            </div>
          </Panel>
        </div>
      </section>
    </PortalShell>
  );
}
