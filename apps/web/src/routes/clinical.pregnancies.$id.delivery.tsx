import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { format, parseISO } from "date-fns";
import { Baby } from "lucide-react";
import { Panel, StatusBadge } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DEMO_TODAY,
  deliveries,
  gestationalAge,
  getPregnancy,
  isPostpartumHaemorrhage,
  type Delivery,
} from "@/lib/demo/fixtures";

export const Route = createFileRoute("/clinical/pregnancies/$id/delivery")({
  head: () => ({
    meta: [
      { title: "Delivery record — Adhya" },
      {
        name: "description",
        content: "Birth details, mode of delivery, blood loss and newborn assessment.",
      },
      { property: "og:title", content: "Delivery record — Adhya" },
      { property: "og:description", content: "Labour and birth outcome for this pregnancy." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DeliveryPage,
});

const modes: Delivery["mode"][] = [
  "Spontaneous vaginal",
  "Assisted vaginal",
  "Elective C-section",
  "Emergency C-section",
];

function DeliveryPage() {
  const { id } = Route.useParams();
  const preg = getPregnancy(id)!;
  const [record, setRecord] = useState<Delivery | undefined>(() =>
    deliveries.find((d) => d.pregnancyId === id),
  );
  const [local, setLocal] = useState(false);
  const [mode, setMode] = useState<Delivery["mode"]>("Spontaneous vaginal");
  const [sex, setSex] = useState<"F" | "M">("F");

  if (!record) {
    return (
      <Panel title="Record delivery (not saved — demo only)">
        <p className="mb-4 text-sm text-muted-foreground">
          No delivery recorded yet. Current gestation {gestationalAge(preg.lmp).weeks} weeks.
        </p>
        <form
          className="grid gap-4 sm:grid-cols-3"
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            setRecord({
              pregnancyId: id,
              date: format(DEMO_TODAY, "yyyy-MM-dd"),
              time: String(f.get("time")),
              gaWeeks: gestationalAge(preg.lmp).weeks,
              facility: String(f.get("facility")),
              mode,
              attendant: "Dr. Asela Ranasinghe",
              bloodLossMl: Number(f.get("ebl")),
              complications: [],
              baby: {
                sex,
                weightKg: Number(f.get("weight")),
                apgar1: Number(f.get("apgar1")),
                apgar5: Number(f.get("apgar5")),
              },
            });
            setLocal(true);
          }}
        >
          <div className="space-y-1.5 sm:col-span-3">
            <Label>Mode of delivery</Label>
            <div className="flex flex-wrap gap-2">
              {modes.map((m) => (
                <Button
                  key={m}
                  type="button"
                  size="sm"
                  variant={m === mode ? "default" : "outline"}
                  onClick={() => setMode(m)}
                >
                  {m}
                </Button>
              ))}
            </div>
          </div>
          <F name="time" label="Time of birth" type="time" required />
          <F
            name="facility"
            label="Facility"
            defaultValue="Castle Street Hospital for Women"
            required
          />
          <F name="ebl" label="Estimated blood loss (mL)" type="number" min={0} required />
          <div className="space-y-1.5">
            <Label>Baby's sex</Label>
            <div className="flex gap-2">
              {(["F", "M"] as const).map((s) => (
                <Button
                  key={s}
                  type="button"
                  size="sm"
                  variant={s === sex ? "default" : "outline"}
                  onClick={() => setSex(s)}
                >
                  {s === "F" ? "Girl" : "Boy"}
                </Button>
              ))}
            </div>
          </div>
          <F
            name="weight"
            label="Birth weight (kg)"
            type="number"
            step="0.01"
            min={0.3}
            max={6}
            required
          />
          <div className="grid grid-cols-2 gap-2">
            <F name="apgar1" label="APGAR 1 min" type="number" min={0} max={10} required />
            <F name="apgar5" label="APGAR 5 min" type="number" min={0} max={10} required />
          </div>
          <div className="sm:col-span-3">
            <Button type="submit">Save delivery</Button>
          </div>
        </form>
      </Panel>
    );
  }

  const pph = isPostpartumHaemorrhage(record.bloodLossMl, record.mode);
  const lowWeight = record.baby.weightKg < 2.5;
  const lowApgar = record.baby.apgar5 < 7;

  return (
    <div className="space-y-6">
      {local && (
        <p className="rounded-lg bg-warning-soft p-3 text-sm text-warning">
          Shown for this session only — not saved to any record system.
        </p>
      )}
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Birth">
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <D
              k="Date & time"
              v={`${format(parseISO(record.date), "d MMM yyyy")} · ${record.time}`}
            />
            <D k="Gestation at birth" v={`${record.gaWeeks} weeks`} />
            <D k="Mode" v={record.mode} />
            <D k="Facility" v={record.facility} />
            <D k="Attendant" v={record.attendant} />
            <div>
              <dt className="text-xs text-muted-foreground">Blood loss</dt>
              <dd className="flex items-center gap-2 font-medium">
                {record.bloodLossMl} mL {pph && <StatusBadge status="CRITICAL" label="PPH" />}
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-sm text-muted-foreground">
            Complications: {record.complications.join(", ") || "None recorded"}
          </p>
        </Panel>
        <Panel title="Newborn">
          <div className="flex items-start gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-primary-soft text-primary-deep">
              <Baby className="size-6" />
            </span>
            <dl className="grid flex-1 grid-cols-2 gap-4 text-sm">
              <D k="Sex" v={record.baby.sex === "F" ? "Girl" : "Boy"} />
              <div>
                <dt className="text-xs text-muted-foreground">Birth weight</dt>
                <dd className="flex items-center gap-2 font-medium">
                  {record.baby.weightKg} kg{" "}
                  {lowWeight && <StatusBadge status="WARNING" label="Low birth weight" />}
                </dd>
              </div>
              <D k="APGAR 1 min" v={String(record.baby.apgar1)} />
              <div>
                <dt className="text-xs text-muted-foreground">APGAR 5 min</dt>
                <dd className="flex items-center gap-2 font-medium">
                  {record.baby.apgar5}{" "}
                  {lowApgar && <StatusBadge status="CRITICAL" label="Below 7" />}
                </dd>
              </div>
            </dl>
          </div>
          {record.baby.childId && (
            <p className="mt-4 text-sm">
              Child record created —{" "}
              <Link
                to="/clinical/patients/$id"
                params={{ id: preg.motherId }}
                className="font-semibold text-primary hover:underline"
              >
                view on mother's profile
              </Link>
            </p>
          )}
        </Panel>
      </div>
    </div>
  );
}

function D({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{k}</dt>
      <dd className="font-medium">{v}</dd>
    </div>
  );
}
function F({
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
