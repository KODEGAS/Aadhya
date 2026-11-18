import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, BellRing, Building2, LayoutDashboard, Sprout } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { alerts } from "@/lib/demo/fixtures";

export const Route = createFileRoute("/clinical")({
  component: () => (
    <AppShell
      portalLabel="Clinical portal"
      user={{ name: "Dr. Asela Ranasinghe", role: "Doctor · Borella MOH" }}
      alertCount={alerts.filter((a) => !a.acknowledged && a.severity !== "INFO").length}
      nav={[
        { to: "/clinical", label: "Dashboard", icon: LayoutDashboard, exact: true },
        { to: "/clinical/pregnancies", label: "Pregnancies", icon: Sprout },
        { to: "/clinical/alerts", label: "Clinical alerts", icon: BellRing },
        { to: "/clinical/clinics", label: "Clinics", icon: Building2 },
        { to: "/clinical/reports", label: "Reports", icon: BarChart3 },
      ]}
    />
  ),
});
