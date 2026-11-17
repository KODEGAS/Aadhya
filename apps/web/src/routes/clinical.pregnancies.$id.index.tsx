import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/clinical/pregnancies/$id/")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/clinical/pregnancies/$id/ultrasound", params });
  },
});
