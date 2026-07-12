"use client";

import {
  ArrowRight,
  ClipboardList,
  Database,
  FileText,
  Grid2x2,
  MapPinned,
  Radar,
  ShieldAlert,
  Target,
  Workflow,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Grid2x2 },
  { href: "/dashboard/complaints", label: "Complaints", icon: ClipboardList },
  { href: "/investigation", label: "Investigation", icon: Radar },
  { href: "/report", label: "Reports", icon: FileText },
  { href: "/dashboard#graph", label: "Knowledge Graph", icon: Workflow },
  { href: "/dashboard#geo", label: "Heatmap", icon: MapPinned },
];

export function PortalShell({
  title,
  subtitle,
  eyebrow,
  actions,
  children,
}: {
  title: string;
  subtitle: string;
  eyebrow: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="page-shell relative overflow-hidden">
      <div className="absolute inset-0 soft-grid opacity-20" />
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-amber-300/10 blur-3xl" />
      <div className="absolute right-0 top-10 h-80 w-80 rounded-full bg-emerald-300/10 blur-3xl" />

      <div className="relative mx-auto grid min-h-screen max-w-[1680px] lg:grid-cols-[290px_minmax(0,1fr)]">
        <aside className="no-print border-b border-white/10 bg-[#07111f]/90 px-4 py-5 backdrop-blur-xl lg:min-h-screen lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-4 py-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/20">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-amber-200/70">
                SentinelAI
              </p>
              <p className="text-sm text-slate-300">Fraud intelligence SOC</p>
            </div>
          </div>

          <nav className="mt-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active =
                pathname === item.href ||
                (item.href !== "/dashboard" &&
                  pathname.startsWith(item.href.split("#")[0]));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm transition ${
                    active
                      ? "border-amber-300/30 bg-amber-300/10 text-amber-100"
                      : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/8"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </span>
                  <ArrowRight className="h-4 w-4 opacity-50" />
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 rounded-3xl border border-emerald-400/15 bg-emerald-400/8 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-200">
              <Target className="h-4 w-4" />
              Live intelligence status
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Complaints are flowing into AI classification, OSINT enrichment,
              and entity resolution.
            </p>
            <div className="mt-4 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300">
              <Database className="h-4 w-4 text-amber-200" />
              Neo4j graph sync ready
            </div>
          </div>
        </aside>

        <main className="relative px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
          <header className="panel-strong no-print sticky top-4 z-20 mb-6 rounded-[28px] px-5 py-4 backdrop-blur-xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.3em] text-amber-200/70">
                  {eyebrow}
                </p>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
                  {title}
                </h1>
                <p className="max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
                  {subtitle}
                </p>
              </div>
              {actions ? (
                <div className="flex flex-wrap gap-3">{actions}</div>
              ) : null}
            </div>
          </header>

          <div className="space-y-6 pb-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
