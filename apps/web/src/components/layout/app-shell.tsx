import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState, type ComponentType, type ReactNode } from "react";
import { Bell, HeartPulse, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavItem {
  to: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  exact?: boolean;
}

interface AppShellProps {
  portalLabel: string;
  nav: NavItem[];
  user: { name: string; role: string };
  alertCount?: number;
}

export function AppShell({ portalLabel, nav, user, alertCount = 0 }: AppShellProps) {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  const isActive = (item: NavItem) =>
    item.exact ? path === item.to : path === item.to || path.startsWith(item.to + "/");

  const sidebar = (
    <nav className="flex h-full flex-col gap-1 bg-sidebar p-4 text-sidebar-foreground">
      <Link to="/" className="mb-6 flex items-center gap-2 px-2 pt-1">
        <span className="grid size-9 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <HeartPulse className="size-5" />
        </span>
        <span>
          <span className="block font-display text-lg font-semibold leading-none">Adhya</span>
          <span className="text-xs opacity-70">{portalLabel}</span>
        </span>
      </Link>
      {nav.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={() => setOpen(false)}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            isActive(item)
              ? "bg-sidebar-primary text-sidebar-primary-foreground"
              : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          )}
        >
          <item.icon className="size-4" />
          {item.label}
        </Link>
      ))}
      <div className="mt-auto border-t border-sidebar-border pt-4">
        <div className="px-3 text-sm font-semibold">{user.name}</div>
        <div className="px-3 text-xs opacity-70">{user.role}</div>
        <Link
          to="/"
          className="mt-3 flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-sidebar-accent"
        >
          <LogOut className="size-4" /> Switch account
        </Link>
      </div>
    </nav>
  );

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 lg:block">{sidebar}</aside>
      {open && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="w-64">{sidebar}</div>
          <button
            aria-label="Close menu"
            className="flex-1 bg-foreground/40"
            onClick={() => setOpen(false)}
          />
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-card/90 px-4 backdrop-blur lg:px-8">
          <button aria-label="Open menu" className="lg:hidden" onClick={() => setOpen(true)}>
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <span className="rounded-full bg-warning-soft px-2.5 py-0.5 text-xs font-semibold text-warning">
            Demo mode · synthetic data
          </span>
          <div className="ml-auto flex items-center gap-3">
            <button aria-label="Notifications" className="relative rounded-full p-2 hover:bg-muted">
              <Bell className="size-5 text-muted-foreground" />
              {alertCount > 0 && (
                <span className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                  {alertCount}
                </span>
              )}
            </button>
            <span className="grid size-8 place-items-center rounded-full bg-primary-soft text-sm font-semibold text-primary-deep">
              {user.name
                .replace("Dr. ", "")
                .split(" ")
                .map((p) => p[0])
                .join("")
                .slice(0, 2)}
            </span>
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold lg:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions}
    </div>
  );
}

export function Panel({
  title,
  action,
  children,
  className,
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("surface p-5", className)}>
      {title && (
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "primary",
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  icon: ComponentType<{ className?: string }>;
  tone?: Tone;
}) {
  return (
    <div className="surface flex items-start gap-4 p-5">
      <span className={cn("grid size-10 shrink-0 place-items-center rounded-lg", toneClass[tone])}>
        <Icon className="size-5" />
      </span>
      <div className="min-w-0">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="font-display text-2xl font-semibold">{value}</div>
        {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
      </div>
    </div>
  );
}

export type Tone = "primary" | "success" | "warning" | "critical" | "info" | "muted";
const toneClass: Record<Tone, string> = {
  primary: "bg-primary-soft text-primary-deep",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  critical: "bg-critical-soft text-critical",
  info: "bg-info-soft text-info",
  muted: "bg-muted text-muted-foreground",
};

const statusTone: Record<string, Tone> = {
  LOW: "success",
  MODERATE: "warning",
  HIGH: "critical",
  INFO: "info",
  WARNING: "warning",
  CRITICAL: "critical",
  SCHEDULED: "info",
  COMPLETED: "success",
  MISSED: "critical",
  CANCELLED: "muted",
  GIVEN: "success",
  UPCOMING: "info",
  OVERDUE: "critical",
  ACTIVE: "success",
  SUSPENDED: "critical",
  SUCCESS: "success",
  DENIED: "critical",
  DELIVERED: "primary",
  CLOSED: "muted",
};

export function StatusBadge({ status, label }: { status: string; label?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        toneClass[statusTone[status] ?? "muted"],
      )}
    >
      {label ?? status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}
