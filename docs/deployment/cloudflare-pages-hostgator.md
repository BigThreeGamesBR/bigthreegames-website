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

## 7. Protect the Internal Admin Area (Cloudflare Access + GitHub)

The `/admin` section is internal documentation and must only be reachable by
Big Three Games members. The public marketing site stays open. Access is enforced
at the edge with Cloudflare Zero Trust, so no application code handles auth.

### 7.1 Enable Zero Trust

1. In the Cloudflare dashboard, open **Zero Trust**.
2. Complete the one-time team setup (choose a team name) if prompted.
3. The free plan covers a small team and is sufficient for this use case.

### 7.2 Add GitHub as an Identity Provider

1. Go to **Settings → Authentication → Login methods**.
2. Add **GitHub** as a login method.
3. Create a GitHub OAuth App (GitHub → Settings → Developer settings → OAuth Apps):
   - Homepage URL: your site URL.
   - Authorization callback URL: the value Cloudflare shows when adding GitHub.
4. Paste the GitHub OAuth **Client ID** and **Client Secret** into Cloudflare.
5. Save and use **Test** to confirm the login method works.

### 7.3 Create the Access Application

1. Go to **Access → Applications → Add an application → Self-hosted**.
2. Application name: `Big Three Games – Internal Admin`.
3. Application domain: add a path-scoped entry so only the internal area is gated:
   - Domain: your production domain (and Pages preview domain if you want previews gated).
   - Path: `admin` (this protects `/admin` and everything beneath it,
     including `/admin/vinculum/opdd/` and all static assets under that path).
4. Identity providers: select **GitHub** only.

### 7.4 Add the Authorization Policy

Choose the rule that matches how access is granted today.

- **GitHub organization membership (current setup, org `big-three-games`):**
  1. Policy name: `Allow B3G org members`.
  2. Action: **Allow**.
  3. Include rule: **Login Methods → GitHub**, then add a rule on the member's
     GitHub email or use the **GitHub organization** group once configured.
  4. Practical approach for a small team: add an **Include → Emails** rule listing
     each member's GitHub account email. This is the simplest reliable gate while
     the org has no dedicated team.

- **Future tightening (recommended once a team exists):**
  switch the include rule to a specific GitHub **team** (for example
  `big-three-games/core`) so access follows team membership automatically.

5. Set the default action for anyone not matched to **Deny**.

### 7.5 Verify Access Control

After the policy is live, test with two accounts:

1. A member account: visiting `/admin` shows the Cloudflare login, then the
   page loads after GitHub sign-in.
2. A non-member account (or incognito with a different GitHub user): the request
   is blocked and never reaches the page.
3. Direct asset check: open
   `/admin/vinculum/opdd/index.html` unauthenticated and confirm it is also
   blocked. The path policy protects HTML and assets equally.

### 7.6 Membership Maintenance

- Add a member: add their GitHub email to the include rule (or add them to the
  GitHub team when team-based policy is in use).
- Remove a member: remove their email/team membership; access revokes on next
  authentication.
- Review the allow list quarterly to remove stale access.
