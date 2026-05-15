# Big Three Games Website

Production-ready website structure rebuilt from scratch using the existing `reference/` pages as visual and content baseline.

## Stack

- Astro (static-first)
- Tokenized CSS architecture (`src/styles/`)
- Vanilla JS for interaction (`public/js/site.js`)
- Cloudflare Pages Functions for contact handling (`functions/api/contact.ts`)
- Decap CMS entrypoint for non-technical publishing (`public/admin/`)

## Project Structure

- `src/layouts/` shared page shell
- `src/components/` reusable header and footer
- `src/pages/` route pages (`/`, `/about`, `/contact`, `/games/heritage`)
- `src/content/site/en/*.json` English-first content files (i18n-ready)
- `src/styles/` tokens, base, layout, component, and page styles
- `public/js/site.js` navigation, reveal motion, parallax, gallery, contact form logic
- `functions/api/contact.ts` edge endpoint with Turnstile + Resend integration
- `public/admin/` Decap CMS admin UI and config

## Local Development

Use the project-isolated install flow (venv-style for Node):

1. Safe isolated install with pnpm via Corepack:

```powershell
npm run install:safe
```

2. If you must use npm, run deterministic install with blocklist check:

```powershell
npm run install:safe:npm
```

3. Start local dev server:

```powershell
npm run dev
```

4. Build production output:

```powershell
npm run build
```

5. Run dependency blocklist check any time:

```powershell
npm run deps:blocklist
```

Current blocklist includes `@tanstack/` to guard against the risk profile you raised.

## Environment Variables

Copy `.env.example` into your secret management workflow and set real values in Cloudflare Pages.

## Content Editing

- Primary content source: `src/content/site/en/*.json`
- Decap admin URL (after deploy): `/admin`
- Decap config file: `public/admin/config.yml`

Update `backend.repo` and `site_url` in `public/admin/config.yml` before production use.

## Hosting

Deployment and DNS flow is documented in `docs/deployment/cloudflare-pages-hostgator.md`.
