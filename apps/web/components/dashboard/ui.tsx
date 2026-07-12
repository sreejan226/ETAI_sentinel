import type { ReactNode } from "react";

type Tone = "emerald" | "amber" | "orange" | "rose";

const toneStyles: Record<Tone, string> = {
  emerald: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
  amber: "border-amber-400/20 bg-amber-400/10 text-amber-200",
  orange: "border-orange-400/20 bg-orange-400/10 text-orange-200",
  rose: "border-rose-400/20 bg-rose-400/10 text-rose-200",
};

export function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`panel-strong rounded-[28px] p-5 sm:p-6 ${className}`}>
      {children}
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-amber-200/70">
          {eyebrow}
        </p>
        <h2 className="text-2xl font-semibold text-slate-50 sm:text-3xl">
          {title}
        </h2>
        <p className="text-sm leading-6 text-slate-300 sm:text-base">
          {description}
        </p>
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}

export function MetricCard({
  label,
  value,
  delta,
  tone,
  icon,
}: {
  label: string;
  value: string;
  delta: string;
  tone: Tone;
  icon?: ReactNode;
}) {
  return (
    <Panel className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-amber-300/70 to-transparent" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <div className="mt-3 flex items-end gap-3">
            <h3 className="text-3xl font-semibold tracking-tight text-slate-50">
              {value}
            </h3>
            <span
              className={`rounded-full border px-2.5 py-1 text-xs font-medium ${toneStyles[tone]}`}
            >
              {delta}
            </span>
          </div>
        </div>
        {icon ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-amber-200">
            {icon}
          </div>
        ) : null}
      </div>
    </Panel>
  );
}

export function Tag({
  children,
  tone = "amber",
}: {
  children: ReactNode;
  tone?: Tone;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${toneStyles[tone]}`}
    >
      {children}
    </span>
  );
}

export function ScoreBar({ score }: { score: number }) {
  const width = Math.min(Math.max(score, 0), 100);
  const classes =
    score >= 75
      ? "from-rose-400 to-orange-400"
      : score >= 50
        ? "from-amber-300 to-orange-300"
        : "from-emerald-300 to-cyan-300";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>Risk</span>
        <span>{score}/100</span>
      </div>
      <div className="h-2 rounded-full bg-white/8">
        <div
          className={`h-2 rounded-full bg-gradient-to-r ${classes}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

export function PillList({ items }: { items: readonly string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export function MiniList({
  items,
  itemTone = "emerald",
}: {
  items: readonly string[];
  itemTone?: Tone;
}) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item}
          className="flex items-start gap-3 text-sm text-slate-300"
        >
          <span
            className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${itemTone === "rose" ? "bg-rose-400" : itemTone === "amber" ? "bg-amber-300" : itemTone === "orange" ? "bg-orange-300" : "bg-emerald-300"}`}
          />
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}
