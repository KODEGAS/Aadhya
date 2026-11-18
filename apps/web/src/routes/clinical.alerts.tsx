import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { format, parseISO } from "date-fns";
import { PageHeader, Panel, StatusBadge } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { alerts as seed } from "@/lib/demo/fixtures";

export const Route = createFileRoute("/clinical/alerts")({
  head: () => ({
    meta: [
      { title: "Clinical alerts — Adhya" },
      {
        name: "description",
        content: "Risk alerts raised from observations, missed visits and medication collection.",
      },
      { property: "og:title", content: "Clinical alerts — Adhya" },
      { property: "og:description", content: "Risk alerts for your caseload." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Alerts,
});

function Alerts() {
  const [list, setList] = useState(seed);
  return (
    <>
      <PageHeader
        title="Clinical alerts"
        subtitle="Acknowledging an alert here is local to this demo session and is not saved."
      />
      <div className="space-y-3">
        {list.map((a) => (
          <Panel key={a.id} className={a.acknowledged ? "opacity-60" : ""}>
            <div className="flex flex-wrap items-start gap-4">
              <StatusBadge status={a.severity} />
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{a.title}</p>
                <p className="text-sm text-muted-foreground">{a.detail}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  <Link
                    to="/clinical/patients/$id"
                    params={{ id: a.patientId }}
                    className="font-semibold text-primary hover:underline"
                  >
                    {a.patientName}
                  </Link>{" "}
                  · {format(parseISO(a.date), "d MMM yyyy")}
                </p>
              </div>
              <Button
                size="sm"
                variant={a.acknowledged ? "ghost" : "outline"}
                disabled={a.acknowledged}
                onClick={() =>
                  setList((l) => l.map((x) => (x.id === a.id ? { ...x, acknowledged: true } : x)))
                }
              >
                {a.acknowledged ? "Acknowledged" : "Acknowledge"}
              </Button>
            </div>
          </Panel>
        ))}
      </div>
    </>
  );
}
