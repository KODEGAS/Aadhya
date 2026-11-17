import { createFileRoute, Link, notFound, Outlet } from "@tanstack/react-router";
import { format } from "date-fns";
import { PageHeader, StatusBadge } from "@/components/layout/app-shell";
import { eddFromLmp, gestationalAge, getMother, getPregnancy } from "@/lib/demo/fixtures";

export const Route = createFileRoute("/clinical/pregnancies/$id")({
  loader: ({ params }) => {
    const pregnancy = getPregnancy(params.id);
    const mother = pregnancy && getMother(pregnancy.motherId);
    if (!pregnancy || !mother) throw notFound();
    return { pregnancy, mother };
  },
  component: PregnancyLayout,
});

const tabs = [{ to: "/clinical/pregnancies/$id/ultrasound", label: "Ultrasound" }] as const;

function PregnancyLayout() {
  const { pregnancy: p, mother: m } = Route.useLoaderData();
  const ga = gestationalAge(p.lmp);
  return (
    <>
      <PageHeader
        title={m.name}
        subtitle={`${m.opd} · G${p.gravida} P${p.para} · EDD ${format(eddFromLmp(p.lmp), "d MMM yyyy")}${p.status === "ACTIVE" ? ` · ${ga.weeks}w ${ga.days}d` : ""}`}
        actions={
          <div className="flex gap-2">
            <StatusBadge status={p.status} />
            <StatusBadge
              status={p.risk}
              label={`${p.risk.charAt(0)}${p.risk.slice(1).toLowerCase()} risk`}
            />
          </div>
        }
      />
      <nav
        className="mb-6 flex gap-1 overflow-x-auto rounded-lg bg-muted p-1"
        aria-label="Pregnancy sections"
      >
        {tabs.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            params={{ id: p.id }}
            className="whitespace-nowrap rounded-md px-4 py-2 text-sm font-semibold text-muted-foreground"
            activeProps={{ className: "bg-card text-foreground shadow-sm" }}
          >
            {t.label}
          </Link>
        ))}
      </nav>
      <Outlet />
    </>
  );
}
