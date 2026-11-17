import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { format, parseISO } from "date-fns";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Plus, ScanLine } from "lucide-react";
import { Panel, StatusBadge } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DEMO_TODAY,
  gestationalAge,
  getPregnancy,
  ultrasounds,
  type Ultrasound,
} from "@/lib/demo/fixtures";

export const Route = createFileRoute("/clinical/pregnancies/$id/ultrasound")({
  head: () => ({
    meta: [
      { title: "Ultrasound scans — Adhya" },
      {
        name: "description",
        content: "Dating, anomaly, growth and Doppler scans for this pregnancy.",
      },
      { property: "og:title", content: "Ultrasound scans — Adhya" },
      { property: "og:description", content: "Pregnancy ultrasound history and findings." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: UltrasoundPage,
});

const types: Ultrasound["type"][] = ["Dating", "Anomaly", "Growth", "Doppler"];

function UltrasoundPage() {
  const { id } = Route.useParams();
  const preg = getPregnancy(id)!;
  const [scans, setScans] = useState(() => ultrasounds.filter((u) => u.pregnancyId === id));
  const [adding, setAdding] = useState(false);
  const [type, setType] = useState<Ultrasound["type"]>("Growth");

  function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const hr = Number(f.get("hr"));
    setScans((s) => [
      ...s,
      {
        id: `local-${s.length}`,
        pregnancyId: id,
        date: format(DEMO_TODAY, "yyyy-MM-dd"),
        gaWeeks: gestationalAge(preg.lmp).weeks,
        type,
        efwGrams: Number(f.get("efw")) || undefined,
        presentation: String(f.get("presentation") || "—"),
        placenta: String(f.get("placenta") || "—"),
        liquor: String(f.get("liquor") || "—"),
        heartRate: hr,
        findings: String(f.get("findings") || ""),
        sonographer: "Dr. Asela Ranasinghe",
        concern: hr < 110 || hr > 160,
      },
    ]);
    setAdding(false);
  }

  const efw = scans
    .filter((s) => s.efwGrams)
    .map((s) => ({ week: `${s.gaWeeks}w`, efw: s.efwGrams }));

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        {preg.status === "ACTIVE" && !adding && (
          <Button onClick={() => setAdding(true)}>
            <Plus className="size-4" /> Record scan
          </Button>
        )}
      </div>

      {adding && (
        <Panel title="New scan (not saved — demo only)">
          <form onSubmit={save} className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-3 flex flex-wrap gap-2">
              {types.map((t) => (
                <Button
                  key={t}
                  type="button"
                  size="sm"
                  variant={t === type ? "default" : "outline"}
                  onClick={() => setType(t)}
                >
                  {t}
                </Button>
              ))}
            </div>
            <Field
              name="hr"
              label="Fetal heart rate (bpm)"
              type="number"
              required
              min={60}
              max={220}
            />
            <Field name="efw" label="Estimated fetal weight (g)" type="number" />
            <Field name="presentation" label="Presentation" placeholder="Cephalic" />
            <Field name="placenta" label="Placenta" placeholder="Posterior, upper segment" />
            <Field name="liquor" label="Liquor / AFI" placeholder="AFI 12 cm" />
            <div className="sm:col-span-3 space-y-1.5">
              <Label htmlFor="findings">Findings</Label>
              <Textarea id="findings" name="findings" rows={3} />
            </div>
            <div className="sm:col-span-3 flex gap-2">
              <Button type="submit">Add scan</Button>
              <Button type="button" variant="ghost" onClick={() => setAdding(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Panel>
      )}

      {efw.length > 1 && (
        <Panel title="Estimated fetal weight (g)">
          <div className="h-52">
            <ResponsiveContainer>
              <BarChart data={efw}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="week" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip cursor={{ fill: "var(--muted)" }} />
                <Bar dataKey="efw" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      )}

      {scans.length === 0 && (
        <Panel>
          <p className="py-8 text-center text-sm text-muted-foreground">
            No scans recorded for this pregnancy.
          </p>
        </Panel>
      )}
      {[...scans].reverse().map((s) => (
        <Panel key={s.id}>
          <div className="flex flex-wrap items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary-deep">
              <ScanLine className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold">
                  {s.type} scan · {s.gaWeeks} weeks
                </p>
                {s.concern && <StatusBadge status="CRITICAL" label="Needs review" />}
                {s.id.startsWith("local") && <StatusBadge status="WARNING" label="Not saved" />}
              </div>
              <p className="text-xs text-muted-foreground">
                {format(parseISO(s.date), "d MMM yyyy")} · {s.sonographer}
              </p>
              <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-5">
                {[
                  ["FHR", `${s.heartRate} bpm`],
                  ["EFW", s.efwGrams ? `${s.efwGrams} g` : "—"],
                  ["Presentation", s.presentation],
                  ["Placenta", s.placenta],
                  ["Liquor", s.liquor],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs text-muted-foreground">{k}</dt>
                    <dd className="font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
              {s.findings && <p className="mt-3 rounded-lg bg-muted p-3 text-sm">{s.findings}</p>}
            </div>
          </div>
        </Panel>
      ))}
    </div>
  );
}

function Field({
  label,
  name,
  ...rest
}: { label: string; name: string } & React.ComponentProps<typeof Input>) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} {...rest} />
    </div>
  );
}
