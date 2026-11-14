# Adhya Web

Frontend for the Adhya maternal and child health platform.

**Stack:** TanStack Start (React 19 + Vite), TanStack Router (file-based routing), Tailwind CSS v4, shadcn/ui, Recharts.

> Status: the UI currently runs on synthetic demo data only. No call reaches a backend yet.

## Run locally

```sh
cd apps/web
npm install
npm run dev
```

`.npmrc` sets `legacy-peer-deps=true` because a plain `npm install` hits an npm resolver bug with this dependency set.

## Pages

| Route       | Page                               |
| ----------- | ---------------------------------- |
| `/`         | Landing page with demo sign-in     |
| `/clinical` | Clinical dashboard (doctor portal) |

## Scripts

| Command          | What it does                     |
| ---------------- | -------------------------------- |
| `npm run dev`    | Start the dev server             |
| `npm run build`  | Production build                 |
| `npm run lint`   | ESLint (includes Prettier rules) |
| `npm run format` | Format all files with Prettier   |
| `npm run test`   | Run Vitest                       |

## Conventions

- Routes live in `src/routes` (see `src/routes/README.md`). `src/routeTree.gen.ts` is auto-generated: do not edit it by hand. If it conflicts during a merge, run `npm run build` and commit the regenerated file.
- UI primitives are in `src/components/ui` (shadcn/ui).
- Use synthetic data only. Never add real patient data.
