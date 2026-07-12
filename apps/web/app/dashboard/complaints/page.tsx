"use client";

import { Panel, ScoreBar, SectionHeader, Tag } from "@/components/dashboard/ui";
import { PortalShell } from "@/components/layout/portal-shell";
import {
  ArrowRight,
  Camera,
  Mic,
  Upload,
  UserCheck,
  Video,
} from "lucide-react";
import { useMemo, useState } from "react";

type ReporterType = "citizen" | "police" | "bank";

const sampleComplaints = [
  {
    id: "CMP-10482",
    title: "UPI refund scam via Telegram",
    score: 91,
    status: "Investigated",
    district: "Mumbai",
  },
  {
    id: "CMP-10463",
    title: "Fake bank KYC link",
    score: 86,
    status: "Processing",
    district: "Bengaluru",
  },
  {
    id: "CMP-10407",
    title: "Voice note impersonation",
    score: 79,
    status: "Queued",
    district: "Delhi NCR",
  },
];

function extractSignals(text: string) {
  const phone = text.match(/(?:\+91[\s-]?)?[6-9]\d{9}/)?.[0] ?? "Not detected";
  const upi = text.match(/[\w.\-]+@[\w]+/)?.[0] ?? "Not detected";
  const url =
    text.match(/https?:\/\/[\w.\-/]+|www\.[\w.\-/]+/)?.[0] ?? "Not detected";
  const amount =
    text.match(/(?:rs\.?|inr|₹)\s*([\d,]+(?:\.\d+)?)/i)?.[1] ?? "Not detected";

  return { phone, upi, url, amount };
}

export default function ComplaintPortalPage() {
  const [description, setDescription] = useState(
    "I received a WhatsApp message asking me to refund a failed UPI transfer through a Telegram support channel.",
  );
  const [phone, setPhone] = useState("+91 98765 43210");
  const [upi, setUpi] = useState("fraud@ybl");
  const [website, setWebsite] = useState("https://verify-payments.in");
  const [location, setLocation] = useState("Andheri East, Mumbai");
  const [amount, setAmount] = useState("25000");
  const [reporterType, setReporterType] = useState<ReporterType>("citizen");
  const [submitted, setSubmitted] = useState(false);
  const [recent, setRecent] = useState(sampleComplaints);

  const preview = useMemo(() => {
    const signals = extractSignals(
      `${description} ${phone} ${upi} ${website} ${amount}`,
    );
    const computedScore = Math.min(
      96,
      38 +
        (signals.upi !== "Not detected" ? 18 : 0) +
        (signals.phone !== "Not detected" ? 14 : 0) +
        (signals.url !== "Not detected" ? 14 : 0) +
        (Number(amount) > 10000 ? 12 : 0),
    );

    return {
      signals,
      computedScore,
      riskLabel:
        computedScore >= 75
          ? "Critical"
          : computedScore >= 50
            ? "High"
            : "Medium",
      summary:
        "AI classifies this as a UPI refund scam with impersonation and phishing indicators.",
    };
  }, [amount, description, phone, upi, website]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    setRecent((current) => [
      {
        id: `CMP-${10480 + current.length + 1}`,
        title: description.slice(0, 60) || "Anonymous complaint",
        score: preview.computedScore,
        status: "Processing",
        district: location.split(",")[0],
      },
      ...current,
    ]);
  };

  return (
    <PortalShell
      eyebrow="Anonymous reporting portal"
      title="Submit intelligence, not just a complaint"
      subtitle="No login. No identity capture. Every field is optimized for entity extraction, AI classification, and investigation routing."
      actions={
        <>
          <Tag tone="emerald">Anonymous</Tag>
          <Tag tone="amber">No login</Tag>
        </>
      }
    >
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel>
          <SectionHeader
            eyebrow="Intake form"
            title="Anonymous complaint submission"
            description="Text, voice note, screenshot, video, fake profile link, website, UPI, phone, location, and amount all feed the intelligence pipeline."
          />

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm text-slate-300">Phone number</span>
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-amber-300/40"
                  placeholder="+91..."
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm text-slate-300">UPI ID</span>
                <input
                  value={upi}
                  onChange={(event) => setUpi(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-amber-300/40"
                  placeholder="name@bank"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm text-slate-300">
                  Website or profile link
                </span>
                <input
                  value={website}
                  onChange={(event) => setWebsite(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-amber-300/40"
                  placeholder="https://..."
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm text-slate-300">Scam amount</span>
                <input
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-amber-300/40"
                  placeholder="25000"
                />
              </label>
            </div>

            <label className="block space-y-2">
              <span className="text-sm text-slate-300">Location</span>
              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-amber-300/40"
                placeholder="District, city"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm text-slate-300">
                Complaint description
              </span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={6}
                className="w-full rounded-[24px] border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-amber-300/40"
                placeholder="Describe what happened, how the scam was initiated, and any evidence you have."
              />
            </label>

            <div className="grid gap-4 md:grid-cols-3">
              {(
                [
                  [Mic, "Voice note"],
                  [Camera, "Screenshot"],
                  [Video, "Video"],
                ] as const
              ).map(([Icon, label]) => (
                <label
                  key={label}
                  className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[24px] border border-dashed border-white/12 bg-white/4 px-4 py-6 text-slate-300 transition hover:border-amber-300/30 hover:bg-white/6"
                >
                  <Icon className="h-5 w-5 text-amber-200" />
                  <span className="text-sm">{label}</span>
                  <input type="file" className="hidden" />
                </label>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {(
                [
                  ["citizen", "Citizen"],
                  ["police", "Police"],
                  ["bank", "Bank"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setReporterType(value)}
                  className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                    reporterType === value
                      ? "border-amber-300/30 bg-amber-300/12 text-amber-100"
                      : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <UserCheck className="h-4 w-4" />
                    {label}
                  </span>
                </button>
              ))}
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-amber-300 px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-amber-200"
            >
              Submit anonymously
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </Panel>

        <div className="space-y-6">
          <Panel>
            <SectionHeader
              eyebrow="AI pre-analysis"
              title="What the classifier will extract"
              description="This preview mirrors the backend prompt: scam category, entities, threat level, confidence, and recommended action."
            />

            <div className="mt-6 space-y-4">
              <ScoreBar score={preview.computedScore} />
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ["Threat level", preview.riskLabel],
                  ["Reporter type", reporterType],
                  ["Location", location],
                  ["Status", submitted ? "Queued for processing" : "Draft"],
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

              <div className="rounded-[24px] border border-white/10 bg-slate-950/40 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-amber-200/70">
                  Extracted entities
                </p>
                <div className="mt-4 space-y-2 text-sm text-slate-300">
                  <div>Phone: {preview.signals.phone}</div>
                  <div>UPI: {preview.signals.upi}</div>
                  <div>URL: {preview.signals.url}</div>
                  <div>Amount: {preview.signals.amount}</div>
                </div>
              </div>

              <div className="rounded-[24px] border border-emerald-300/15 bg-emerald-300/10 p-4 text-sm leading-6 text-slate-200">
                {preview.summary}
              </div>
            </div>
          </Panel>

          <Panel>
            <SectionHeader
              eyebrow="Recent intake"
              title="Already queued for analysis"
              description="These are example complaint records the dashboard can route into the classifier and graph layer."
            />

            <div className="mt-5 space-y-3">
              {recent.map((complaint) => (
                <div
                  key={complaint.id}
                  className="rounded-3xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                        {complaint.id}
                      </p>
                      <p className="mt-2 text-sm font-medium text-slate-100">
                        {complaint.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {complaint.district}
                      </p>
                    </div>
                    <Tag
                      tone={
                        complaint.score >= 85
                          ? "rose"
                          : complaint.score >= 75
                            ? "amber"
                            : "emerald"
                      }
                    >
                      {complaint.score}/100
                    </Tag>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                    <span>{complaint.status}</span>
                    <span>{complaint.district}</span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <SectionHeader
              eyebrow="Evidence capture"
              title="Media inputs"
              description="All uploads are optional. The portal is designed to capture screenshots, audio, and video when available."
            />

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {(
                [
                  [Upload, "Screenshots and PDFs"],
                  [Mic, "Voice notes and calls"],
                  [Video, "Screen recordings"],
                ] as const
              ).map(([Icon, label]) => (
                <div
                  key={label}
                  className="rounded-3xl border border-white/10 bg-white/5 p-4 text-center"
                >
                  <Icon className="mx-auto h-5 w-5 text-amber-200" />
                  <p className="mt-3 text-sm text-slate-300">{label}</p>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </section>
    </PortalShell>
  );
}
