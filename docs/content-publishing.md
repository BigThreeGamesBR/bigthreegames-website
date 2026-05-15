# Content Publishing Workflow

## Publishing Model

- Editors create or update content through Decap CMS at `/admin`.
- Decap writes updates to repository files in `src/content/site/en/`.
- Changes open as pull requests (`editorial_workflow` mode).
- Approved pull requests merge into `main` and deploy automatically.

## Where Content Lives

- `src/content/site/en/global.json`
- `src/content/site/en/home.json`
- `src/content/site/en/about.json`
- `src/content/site/en/contact.json`
- `src/content/site/en.json`

## Localization Readiness

The current launch language is English.

To add a new language later:

1. Create a sibling locale folder under `src/content/site/` (for example `pt-br`).
2. Mirror all JSON file names from `en`.
3. Wire locale loading in `src/lib/content.ts`.
4. Extend page routes and language switch UX.

## Safety Checklist Before Merge

- Content renders correctly in Cloudflare preview URL
- Contact links and external links resolve correctly
- Heading hierarchy remains logical
- No placeholder copy remains
