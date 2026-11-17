import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, CalendarCheck, Sprout, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader, Panel, StatCard, StatusBadge } from "@/components/layout/app-shell";
import {
  alerts,
  appointments,
  DEMO_TODAY,
  mothers,
  pregnancies,
  registrationsByMonth,
} from "@/lib/demo/fixtures";
import { format } from "date-fns";

export const Route = createFileRoute("/clinical/")({
  head: () => ({
    meta: [
      { title: "Clinical dashboard — Adhya" },
      {
        name: "description",
        content: "Today's clinic, high-risk pregnancies and unresolved clinical alerts.",
      },
      { property: "og:title", content: "Clinical dashboard — Adhya" },
      { property: "og:description", content: "Today's clinic and high-risk caseload." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ClinicalDashboard,
});

function ClinicalDashboard() {
  const today = format(DEMO_TODAY, "yyyy-MM-dd");
  const todays = appointments.filter((a) => a.date === today);
  const open = alerts.filter((a) => !a.acknowledged && a.severity !== "INFO");
  const high = pregnancies.filter((p) => p.risk === "HIGH");

  return (
    <>
      <PageHeader
        title="Clinical dashboard"
        subtitle={`Borella MOH Clinic · ${format(DEMO_TODAY, "EEEE d MMMM yyyy")}`}
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Users}
          label="Registered mothers"
          value={mothers.length}
          hint="in your caseload"
        />
        <StatCard
          icon={Sprout}
          label="Active pregnancies"
          value={pregnancies.filter((p) => p.status === "ACTIVE").length}
          tone="info"
        />
        <StatCard
          icon={AlertTriangle}
          label="High risk"
          value={high.length}
          hint="need closer follow-up"
          tone="critical"
        />
        <StatCard
          icon={CalendarCheck}
          label="Today's visits"
          value={todays.length}
          tone="success"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Panel title="Today's clinic">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-muted-foreground">
                <tr>
                  <th className="pb-2">Time</th>
                  <th className="pb-2">Patient</th>
                  <th className="pb-2">Visit</th>
                  <th className="pb-2">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {todays.map((a) => {
                  const p = pregnancies.find((x) => x.motherId === a.patientId);
                  return (
                    <tr key={a.id}>
                      <td className="py-3 font-semibold">{a.time}</td>
                      <td>
                        <Link
                          to="/clinical/patients/$id"
                          params={{ id: a.patientId }}
                          className="font-semibold text-primary hover:underline"
                        >
                          {a.patientName}
                        </Link>
                      </td>
                      <td className="text-muted-foreground">{a.type}</td>
                      <td>{p && <StatusBadge status={p.risk} />}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>
        <Panel
          title="Open alerts"
          action={
            <Link to="/clinical/alerts" className="text-sm font-semibold text-primary">
              All alerts
            </Link>
          }
        >
          <ul className="space-y-3">
            {open.map((a) => (
              <li key={a.id} className="rounded-lg border p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold">{a.title}</p>
                  <StatusBadge status={a.severity} />
                </div>
                <p className="text-sm text-muted-foreground">
                  {a.patientName} — {a.detail}
                </p>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Maternal registrations by month" className="xl:col-span-2">
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={registrationsByMonth}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip cursor={{ fill: "var(--muted)" }} />
                <Bar dataKey="count" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
    </>
  );
}
