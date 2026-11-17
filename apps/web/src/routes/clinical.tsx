import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { alerts } from "@/lib/demo/fixtures";

export const Route = createFileRoute("/clinical")({
  component: () => (
    <AppShell
      portalLabel="Clinical portal"
      user={{ name: "Dr. Asela Ranasinghe", role: "Doctor · Borella MOH" }}
      alertCount={alerts.filter((a) => !a.acknowledged && a.severity !== "INFO").length}
      nav={[{ to: "/clinical", label: "Dashboard", icon: LayoutDashboard, exact: true }]}
    />
  ),
});
