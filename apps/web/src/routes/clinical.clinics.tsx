import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, CalendarClock } from "lucide-react";
import { PageHeader, Panel, StatusBadge } from "@/components/layout/app-shell";
import { clinics, clinicSummary } from "@/lib/demo/fixtures";

export const Route = createFileRoute("/clinical/clinics")({
  head: () => ({
    meta: [
      { title: "Clinics — Adhya" },
      { name: "description", content: "MOH clinics and hospitals, their sessions and caseload." },
      { property: "og:title", content: "Clinics — Adhya" },
      { property: "og:description", content: "Clinic directory with sessions and caseload." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Clinics,
});

function Clinics() {
  return (
    <>
      <PageHeader
        title="Clinics"
        subtitle="Demo clinic directory — names, addresses and phone numbers are made up."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {clinics.map((c) => {
          const s = clinicSummary(c.name);
          return (
            <Panel key={c.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">{c.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {c.type} · {c.district} · Lead: {c.lead}
                  </p>
                </div>
                {s.highRisk > 0 && <StatusBadge status="HIGH" label={`${s.highRisk} high risk`} />}
              </div>
              <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <MapPin className="size-4" />
                  {c.address}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="size-4" />
                  {c.phone}
                </p>
                {c.sessions.map((x) => (
                  <p key={x} className="flex items-center gap-2">
                    <CalendarClock className="size-4" />
                    {x}
                  </p>
                ))}
              </div>
              <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                {[
                  ["Mothers", s.mothers],
                  ["Upcoming", s.upcoming],
                  ["Missed", s.missed],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-lg bg-muted p-2">
                    <dt className="text-xs text-muted-foreground">{k}</dt>
                    <dd className="text-xl font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
            </Panel>
          );
        })}
      </div>
    </>
  );
}
