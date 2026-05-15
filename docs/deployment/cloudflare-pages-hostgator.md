# Cloudflare Pages + HostGator Domain Setup

This setup keeps domain registration at HostGator while running DNS and hosting through Cloudflare with zero recurring hosting and DNS cost (within free-tier limits).

## 1. Connect Repository

1. Push this repository to GitHub.
2. In Cloudflare, open Pages and create a new project from your GitHub repo.
3. Build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`

## 2. Configure Environment Variables

No runtime environment variables are required for the current static website and direct-email contact flow.

## 3. Keep Domain at HostGator, Move DNS to Cloudflare

1. Add your domain to Cloudflare.
2. Cloudflare gives two nameservers.
3. In HostGator domain settings, replace existing nameservers with the Cloudflare nameservers.
4. Wait for propagation.

## 4. Attach Custom Domain in Cloudflare Pages

1. In Pages project, open Custom Domains.
2. Add your root domain and `www` as needed.
3. Cloudflare will create DNS records automatically and issue SSL certificates.

## 5. Branch Workflow

Recommended GitHub branch protections:

- Require pull request before merge to `main`
- Require at least one approving review
- Keep Cloudflare preview deployments enabled for all PRs

## 6. Verify Contact Route

After deployment:

1. Open `/contact`.
2. Verify the direct contact email link opens your email client correctly.
3. Confirm all primary routes render without 404s.
