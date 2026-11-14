import { createFileRoute, Link } from "@tanstack/react-router";
import { Baby, HeartPulse, ShieldCheck, Stethoscope, UserCog } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Adhya — Maternal & child health, connected" },
      {
        name: "description",
        content:
          "Adhya connects mothers, midwives and doctors across pregnancy, delivery and the first five years of a child's life.",
      },
      { property: "og:title", content: "Adhya — Maternal & child health, connected" },
      {
        property: "og:description",
        content:
          "A FHIR-based longitudinal record for mothers and children, from preconception to age five.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignIn,
});

const accounts = [
  {
    to: "/portal",
    icon: Baby,
    title: "Mother portal",
    who: "Kamala Perera · Patient",
    desc: "Pregnancy progress, appointments, medicines and your child's vaccinations.",
  },
  {
    to: "/clinical",
    icon: Stethoscope,
    title: "Clinical portal",
    who: "Dr. Asela Ranasinghe · Doctor",
    desc: "Patient registry, risk alerts, observations and today's clinic.",
  },
  {
    to: "/admin",
    icon: UserCog,
    title: "Administration",
    who: "Ruwan Dissanayake · Admin",
    desc: "Users, roles, clinics and the security audit trail.",
  },
] as const;

function SignIn() {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      <section className="relative hidden flex-col justify-between overflow-hidden bg-sidebar p-12 text-sidebar-foreground lg:flex">
        <div className="flex items-center gap-2">
          <span className="grid size-10 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <HeartPulse className="size-5" />
          </span>
          <span className="font-display text-xl font-semibold">Adhya</span>
        </div>
        <div className="max-w-lg">
          <h1 className="text-5xl font-semibold leading-[1.05]">
            One record, from the first visit to the fifth birthday.
          </h1>
          <p className="mt-6 text-lg opacity-80">
            Preconception → pregnancy → delivery → postpartum → child health. Shared securely
            between mothers and the people caring for them.
          </p>
          <ol className="mt-10 flex flex-wrap gap-2 text-xs font-semibold">
            {["Preconception", "Antenatal", "Delivery", "Postpartum", "Child 0–5"].map((s, i) => (
              <li key={s} className="rounded-full border border-sidebar-border px-3 py-1.5">
                <span className="opacity-60">{i + 1}</span> {s}
              </li>
            ))}
          </ol>
        </div>
        <p className="flex items-center gap-2 text-sm opacity-70">
          <ShieldCheck className="size-4" /> HL7 FHIR R4 · role-based access · full audit trail
        </p>
      </section>

      <section className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-semibold">Sign in</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Demo mode — choose an account. All records are synthetic.
          </p>
          <div className="mt-8 space-y-3">
            {accounts.map((a) => (
              <Link
                key={a.to}
                to={a.to}
                className="surface group flex gap-4 p-4 transition hover:border-primary"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary-deep">
                  <a.icon className="size-5" />
                </span>
                <span>
                  <span className="block font-semibold group-hover:text-primary">{a.title}</span>
                  <span className="block text-xs font-medium text-muted-foreground">{a.who}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">{a.desc}</span>
                </span>
              </Link>
            ))}
          </div>
          <p className="mt-8 rounded-lg bg-warning-soft p-3 text-xs text-warning">
            Real sign-in is not connected yet. Nothing you do here is saved to a backend.
          </p>
        </div>
      </section>
    </div>
  );
}
