import { createFileRoute, Link } from "@tanstack/react-router";
import { addDays, format, parseISO } from "date-fns";
import { Check } from "lucide-react";
import { Panel, StatusBadge } from "@/components/layout/app-shell";
import {
  deliveries,
  DEMO_TODAY,
  epdsLevel,
  POSTNATAL_SCHEDULE,
  postpartumVisits,
} from "@/lib/demo/fixtures";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/clinical/pregnancies/$id/postpartum")({
  head: () => ({
    meta: [
      { title: "Postpartum care — Adhya" },
      {
        name: "description",
        content: "Postnatal visits, recovery checks, breastfeeding and maternal mood screening.",
      },
      { property: "og:title", content: "Postpartum care — Adhya" },
      { property: "og:description", content: "Postnatal follow-up for mother after birth." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PostpartumPage,
});

function PostpartumPage() {
  const { id } = Route.useParams();
  const delivery = deliveries.find((d) => d.pregnancyId === id);
  const visits = postpartumVisits.filter((v) => v.pregnancyId === id);

  if (!delivery) {
    return (
      <Panel>
        <p className="py-8 text-center text-sm text-muted-foreground">
          Postpartum care starts once the birth is recorded.{" "}
          <Link
            to="/clinical/pregnancies/$id/delivery"
            params={{ id }}
            className="font-semibold text-primary hover:underline"
          >
            Record delivery
          </Link>
        </p>
      </Panel>
    );
  }

  const birth = parseISO(delivery.date);

  return (
    <div className="space-y-6">
      <Panel title="Postnatal contacts">
        <ol className="grid gap-3 sm:grid-cols-4">
          {POSTNATAL_SCHEDULE.map((s) => {
            const done = visits.some((v) => v.dayAfterBirth >= s.from && v.dayAfterBirth <= s.to);
            const due = addDays(birth, s.day);
            const overdueAfter = addDays(birth, s.to);
            const overdue = !done && overdueAfter < DEMO_TODAY;
            return (
              <li
                key={s.day}
                className={cn(
                  "rounded-lg border p-3",
                  done && "border-success bg-success-soft",
                  overdue && "border-destructive bg-critical-soft",
                )}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{s.label}</p>
                  {done && <Check className="size-4 text-success" />}
                </div>
                <p className="text-xs text-muted-foreground">{format(due, "d MMM yyyy")}</p>
                <p className="mt-1 text-xs font-semibold">
                  {done ? "Completed" : overdue ? "Missed" : "Upcoming"}
                </p>
              </li>
            );
          })}
        </ol>
      </Panel>

      <Panel title="Visit record">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted-foreground">
              <tr>
                <th className="pb-2">Date</th>
                <th className="pb-2">BP</th>
                <th className="pb-2">Temp</th>
                <th className="pb-2">Uterus</th>
                <th className="pb-2">Lochia</th>
                <th className="pb-2">Feeding</th>
                <th className="pb-2">Mood (EPDS)</th>
                <th className="pb-2">By</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {visits.map((v) => (
                <tr key={v.id}>
                  <td className="py-3">
                    <div className="font-semibold">{format(parseISO(v.date), "d MMM yyyy")}</div>
                    <div className="text-xs text-muted-foreground">Day {v.dayAfterBirth}</div>
                  </td>
                  <td>{v.bp}</td>
                  <td className={v.temperatureC >= 38 ? "font-semibold text-critical" : ""}>
                    {v.temperatureC}°C
                  </td>
                  <td>{v.uterus}</td>
                  <td>{v.lochia}</td>
                  <td>{v.breastfeeding}</td>
                  <td>
                    <span className="mr-2 font-semibold">{v.epds}</span>
                    <StatusBadge
                      status={epdsLevel(v.epds)}
                      label={
                        { LOW: "Low", MODERATE: "Follow up", HIGH: "Refer" }[epdsLevel(v.epds)]
                      }
                    />
                  </td>
                  <td className="text-muted-foreground">{v.provider}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {visits.at(-1)?.contraception && (
          <p className="mt-4 text-sm">
            <span className="text-muted-foreground">Family planning:</span>{" "}
            <span className="font-semibold">{visits.at(-1)!.contraception}</span>
          </p>
        )}
      </Panel>
    </div>
  );
}
