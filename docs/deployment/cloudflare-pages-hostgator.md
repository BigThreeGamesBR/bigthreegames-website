# Cloudflare Pages + HostGator Domain Setup

This setup keeps domain registration at HostGator while running DNS and hosting through Cloudflare with zero recurring hosting and DNS cost (within free-tier limits).

## 1. Connect Repository

1. Push this repository to GitHub.
2. In Cloudflare, open Pages and create a new project from your GitHub repo.
3. Build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`

## 2. Configure Environment Variables

In Cloudflare Pages project settings, set:

- `PUBLIC_TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`
- `RESEND_API_KEY`
- `CONTACT_FROM_EMAIL`
- `CONTACT_RECIPIENT_EMAIL`

## 3. Turnstile

1. Create a Turnstile site in Cloudflare dashboard.
2. Set allowed domain(s).
3. Use generated site key and secret in Pages variables.

## 4. Resend

1. Create a Resend account and API key (free tier).
2. Verify sender domain/email.
3. Set `CONTACT_FROM_EMAIL` and `RESEND_API_KEY` in Pages.

## 5. Keep Domain at HostGator, Move DNS to Cloudflare

1. Add your domain to Cloudflare.
2. Cloudflare gives two nameservers.
3. In HostGator domain settings, replace existing nameservers with the Cloudflare nameservers.
4. Wait for propagation.

## 6. Attach Custom Domain in Cloudflare Pages

1. In Pages project, open Custom Domains.
2. Add your root domain and `www` as needed.
3. Cloudflare will create DNS records automatically and issue SSL certificates.

## 7. Branch Workflow

Recommended GitHub branch protections:

- Require pull request before merge to `main`
- Require at least one approving review
- Keep Cloudflare preview deployments enabled for all PRs

## 8. Verify Contact Endpoint

After deployment:

1. Open `/contact`.
2. Submit a test message.
3. Confirm Turnstile challenge passes.
4. Confirm message arrives at `CONTACT_RECIPIENT_EMAIL`.
