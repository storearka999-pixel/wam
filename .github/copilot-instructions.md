# Agent instructions

## Repository snapshot

- The application source is supplied in `wijaya-abadi-main.zip`.
- When working on the source, extract that archive and treat the `wijaya-abadi-main/` directory as the project root.
- Do not edit or replace the ZIP archive unless the user explicitly asks for the repository snapshot itself to change.
- Read `README.md`, `README.deploy.md`, `package.json`, `ecosystem.config.cjs`, and `SECURITY.md` before making broad or deployment-related changes.

## Project overview

- This is a full-stack React 18 and TypeScript website for a Honda motorcycle dealer.
- Vite builds the browser application; Express in `server.ts` serves the application, APIs, uploads, SEO pages, admin functionality, and local JSON persistence.
- The browser entry points are `src/main.tsx` and `src/App.tsx`.
- Reusable UI belongs in `src/components/`.
- Shared types belong in `src/types.ts`; domain/API helpers belong in `src/services/`; pure image, WhatsApp, SEO, and catalog helpers belong in `src/utils/`, `src/catalogAnimation.ts`, and `src/constants.ts`.
- Static and SEO assets belong in `public/`; deployment configuration belongs in `deploy/`, `.github/workflows/`, and the root deployment scripts.

## Required workflow

- Use Node.js 22 and the npm dependency lockfile by default. Prefer `npm install` only when dependencies need restoration; preserve both package-manager lockfiles unless a deliberate dependency change is requested.
- Before editing, inspect the nearest existing implementation and follow its naming, error handling, and component patterns.
- Keep changes surgical. Do not refactor unrelated components, rename public routes, or change dealer copy, domains, branding, or SEO data without a reason tied to the request.
- Make application changes in source files, then run the smallest relevant validation:
  - `npm run lint` for TypeScript validation.
  - `npm run build` for the Vite and server bundle.
- Existing tests are limited. Use the repository's configured runner for an affected test; do not introduce a test framework solely to validate a small change.
- Do not start a production deployment or run destructive VPS/database commands unless the user explicitly requests deployment.

## Frontend conventions

- Keep React components typed and preserve the existing function-component style.
- Reuse `src/services/api.ts` for API calls instead of adding ad hoc `fetch` calls.
- Preserve loading, empty, and error states for CMS, catalog, and dashboard data.
- Use existing theme and customization structures in `src/types.ts`, `src/constants.ts`, and `src/themes/`. Do not replace a theme with unrelated global CSS.
- Keep mobile behavior and Indonesian dealer-facing copy intentional. Verify responsive layouts when changing catalog cards, navigation, modals, or admin panels.
- Preserve SEO and routing behavior, including `/admin`, `/login`, `/masuk`, `/motor/:slug`, `/artikel/:slug`, `robots.txt`, and `sitemap.xml`.
- Do not add or remove canonical domains, subdomains, or landing-page host detection without updating both `src/App.tsx` and the server rendering logic.

## Server and data conventions

- `server.ts` is currently large and route-based. Make the smallest coherent change near the relevant route rather than duplicating data or authentication logic elsewhere.
- Persist site-specific data through `DATA_DIR` and `db.json`; do not add shared mutable state for domains that require separate settings.
- The shared catalog is stored under `CATALOG_API_URL`/`CATALOG_OWNER_DATA_FILE` in the owner process. Satellite sites proxy catalog writes and keep their own themes and CMS data.
- Preserve `UPLOADS_DIR` behavior and keep uploaded files in the configured upload root. Validate file names, limits, and response paths for upload changes.
- Preserve service authentication: catalog writes use `CATALOG_SERVICE_TOKEN`, and admin routes use the existing authentication middleware. `CATALOG_SERVICE_TOKEN` must remain a 64-character hex secret.
- Never log or commit `.env`, API keys, Google service-account JSON, SSH keys, passwords, or bearer tokens. Use `.env.example` and secret names rather than real values.
- JSON database updates must remain compatible with existing `db.json` data and should preserve unrelated site settings.

## SEO and catalog constraints

- Catalog motor records must remain compatible with `schemas/katalog-motor.schema.json` and `examples/katalog-motor.json`.
- Preserve support for up to 80 photos per motor, cover-photo behavior, catalog animation settings, and normalized FIF price-list behavior.
- Shared FIF/model data must merge without losing site-specific customization.
- Changes to sitemap, robots, canonical URLs, metadata, or landing paths require verification in `server.ts` and the corresponding React SEO logic.

## Deployment safety

- Deployment is a full-stack, multi-domain VPS process. The primary catalog process uses port 3000; satellite processes use ports 3001-3003.
- Review `README.deploy.md`, `ecosystem.config.cjs`, `.github/workflows/deploy-ubuntu-vps.yml`, and `deploy-vps-safe.sh` before changing build, PM2, Nginx, DNS, SSL, or release behavior.
- Keep database files and upload directories separate and backed up. Do not delete old databases or uploads during migration.
- Do not disable SSH host-key verification or weaken secret handling.
- If deployment scripts change, validate shell syntax and dry-run behavior without applying production changes.

## Before finishing

- Check `git diff` for unintended files or secrets.
- Summarize changed source files and the exact validation commands run.
- If validation could not run, state the reason explicitly rather than claiming success.
