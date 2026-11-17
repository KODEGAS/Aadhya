import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { PageHeader, Panel, StatusBadge } from "@/components/layout/app-shell";
import { eddFromLmp, gestationalAge, getMother, pregnancies } from "@/lib/demo/fixtures";

export const Route = createFileRoute("/clinical/pregnancies/")({
  head: () => ({
    meta: [
      { title: "Pregnancies — Adhya" },
      {
        name: "description",
        content: "Active and completed pregnancies with scans, delivery and postnatal records.",
      },
      { property: "og:title", content: "Pregnancies — Adhya" },
      {
        property: "og:description",
        content: "Pregnancy caseload with ultrasound, delivery and postpartum care.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <>
      <PageHeader
        title="Pregnancies"
        subtitle="Open a pregnancy to see its scans, delivery and postnatal care."
      />
      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted-foreground">
              <tr>
                <th className="pb-2">Mother</th>
                <th className="pb-2">Gestation</th>
                <th className="pb-2">EDD</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {pregnancies.map((p) => {
                const m = getMother(p.motherId);
                const ga = gestationalAge(p.lmp);
                return (
                  <tr key={p.id} className="hover:bg-muted/50">
                    <td className="py-3">
                      <Link
                        to="/clinical/pregnancies/$id/ultrasound"
                        params={{ id: p.id }}
                        className="font-semibold text-primary hover:underline"
                      >
                        {m?.name}
                      </Link>
                      <div className="text-xs text-muted-foreground">
                        G{p.gravida} P{p.para}
                      </div>
                    </td>
                    <td>{p.status === "ACTIVE" ? `${ga.weeks}w ${ga.days}d` : "—"}</td>
                    <td>{format(eddFromLmp(p.lmp), "d MMM yyyy")}</td>
                    <td>
                      <StatusBadge status={p.status} />
                    </td>
                    <td>
                      <StatusBadge status={p.risk} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  ),
});
