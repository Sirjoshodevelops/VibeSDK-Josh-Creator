# Repository Guidelines

## Project Structure & Module Organization
- `src/` is the React + Vite app (routes under `src/routes`, UI in `src/components`, shared helpers in `src/lib`/`src/utils`).
- `worker/` holds Cloudflare Worker agents, streaming/diff formatters, and runtime bindings; avoid mixing UI code here.
- `shared/` exposes cross-runtime TypeScript contracts; update both app and worker imports when interfaces change.
- `migrations/`, `scripts/`, and `debug-tools/` cover D1 schema changes, automation scripts, and diagnostic playgrounds; run scripts via `bun` unless noted.

## Build, Test, and Development Commands
- `npm run dev` launches Vite with `DEV_MODE` flags; `npm run dev:worker` rebuilds and starts `wrangler dev` with remote bindings.
- `npm run build` runs the TypeScript project references then performs a production Vite build.
- `npm run lint` applies the ESLint config; fix violations before committing.
- `npm run test`, `npm run test:watch`, and `npm run test:coverage` run Vitest suites; prefer the coverage run before PRs touching agents or shared code.
- Database helpers: `bun run db:generate` after schema edits, `bun run db:migrate:local` to apply migrations, and `bun run db:check` before deploying.

## Coding Style & Naming Conventions
- TypeScript throughout; add explicit return types when modules cross runtimes.
- Prettier enforces single quotes and hard tabs; do not reconfigure per-file.
- React components live in `UpperCamelCase` files; hooks use the `useFeature` pattern, and worker entrypoints end with `.worker.ts`.
- Respect ESLint import ordering and path aliases from `tsconfig.json`.

## Testing Guidelines
- Vitest config lives in `vitest.config.ts`; co-locate `.test.ts` files next to implementations (e.g., `worker/agents/...`).
- Prefer fast unit tests; integration tests should stub external services using the helpers in `shared/`.
- Run `npm run test:coverage` before merging and attach notable deltas to the PR if coverage drops.

## Commit & Pull Request Guidelines
- Use imperative commit subjects under 72 characters; separate unrelated changes and call out schema or config updates in the body.
- Reference issues or Linear tickets (`Refs #123`) and list any follow-up tasks.
- PRs need a summary, test evidence, and screenshots/GIFs for UI changes; mention new env vars or bindings explicitly.
- Confirm lint, tests, and required `db:*` commands before requesting review.

## Environment & Secrets
- Store dev credentials in `.env.local`; production secrets belong in `wrangler` environment variables only.
- Run `npm run cf-typegen` whenever Durable Objects, KV, or bindings change to refresh generated types.
- Keep `wrangler.jsonc` and `worker-configuration.d.ts` synchronized after binding updates.
