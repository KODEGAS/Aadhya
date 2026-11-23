import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Match routes only: no loaders or rendering, so no server or network is needed.
describe("Postpartum route", () => {
  it.each([["/clinical/pregnancies/p1/postpartum", "/clinical/pregnancies/$id/postpartum"]])(
    "matches %s",
    (path, routeId) => {
      const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

      const matches = router.matchRoutes(path);

      expect(matches.at(-1)?.routeId).toBe(routeId);
    },
  );
});
