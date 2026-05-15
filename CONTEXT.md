# Big Three Games Website

This context defines the canonical business language for the public-facing studio website.

## Language

**Studio Website**:
The official public site that presents the studio and its games.
_Avoid_: App, portal

**Content/Marketing Website**:
A website focused on discoverability, brand storytelling, and contact conversion rather than authenticated product workflows.
_Avoid_: SaaS app, product dashboard

**Scale (Website)**:
The ability to add pages, campaigns, and game entries quickly using repeatable patterns.
_Avoid_: Feature scaling for logged-in app users

**Non-Technical Publishing**:
The ability for team members to publish or update website content without editing source code directly.
_Avoid_: Developer-only publishing

**Editorial Console**:
An in-site admin area where authorized team members edit and publish website content.
_Avoid_: External-only CMS dashboard

**Git-Backed Publishing**:
A publishing model where content updates are committed to Git and deployed through the website pipeline.
_Avoid_: Direct database-only publishing

**Static Runtime**:
A deployment model where public pages are pre-rendered and served as static assets without a continuously running application server.
_Avoid_: Server-rendered app runtime

**Submission Integration**:
The form-handling path used to receive inquiries from the contact page.
_Avoid_: Full custom backend for basic contact flows

**Editorial Identity**:
The authentication method used by content editors to access the Editorial Console.
_Avoid_: Public or anonymous editor access

**Cost Guardrail**:
The constraint that hosting and DNS for the website should run at zero recurring infrastructure cost in v1.
_Avoid_: Paid baseline infrastructure before clear revenue need

**Domain Registrar**:
The provider that manages domain ownership, renewal, and registration records.
_Avoid_: Assuming it must host DNS or website runtime

**Authoritative DNS Provider**:
The service that hosts DNS records and answers DNS queries for the domain.
_Avoid_: Treating it as the same role as the Domain Registrar

**Publishing Workflow**:
The sequence used for editorial changes from draft to production publish.
_Avoid_: Uncontrolled direct-to-production updates

**Review Gate**:
The required approval step before content changes are merged and published.
_Avoid_: Auto-publish without human verification

**Preview Deployment**:
An automatically generated temporary website URL for validating pull request changes before production merge.
_Avoid_: Approving content without visual verification

**Edge Submission Handler**:
A lightweight provider-native function that receives contact form submissions for the static website.
_Avoid_: Long-running custom backend services for basic contact intake

**Contact Inbox Record**:
The operational source of truth for contact submissions, stored as received messages in an email inbox.
_Avoid_: Mandatory database storage for v1 contact intake

**Editorial Platform**:
The CMS layer used by non-technical editors to create and update content in the Editorial Console.
_Avoid_: Building a custom admin system before validated need

**Decap CMS**:
The selected Git-based editorial platform for v1 non-technical publishing.
_Avoid_: High-complexity CMS setups for initial launch

**Site Framework**:
The foundation used to generate and structure the public website.
_Avoid_: Runtime-heavy framework choices that conflict with static delivery goals

**Astro**:
The selected static-first framework for building and scaling the studio website.
_Avoid_: Choosing framework complexity beyond content-site needs

**Canonical Repository Platform**:
The primary source control provider that owns pull requests, branch protections, and editorial merge flow.
_Avoid_: Splitting critical workflow across multiple repository platforms

**GitHub**:
The selected canonical repository platform for v1 website operations.
_Avoid_: Multi-platform repository workflow in early stages

**Tracking Policy**:
The rule that governs whether visitor behavior tracking technologies are used on the website.
_Avoid_: Default-on behavioral tracking

**Tracker-Free Runtime**:
The v1 operating mode where no third-party behavioral trackers or user-profiling scripts are deployed.
_Avoid_: Analytics scripts that identify or profile users

**Launch Language**:
The language used for public website content at initial release.
_Avoid_: Assuming multilingual launch by default

**Localization-Ready Content Model**:
Content structure organized so additional languages can be introduced later without full rewrite.
_Avoid_: Hard-coding language assumptions into content architecture

**English-First Launch**:
The selected launch mode where public content is published in English only for v1.
_Avoid_: Immediate multi-language rollout before operational capacity exists

**Environment Model**:
The set of long-lived deployment environments used for website operations.
_Avoid_: Unnecessary permanent environments that increase maintenance overhead

**Two-Environment Model**:
The selected v1 setup with local development and production, supported by temporary pull request previews.
_Avoid_: Permanent staging environment without clear operational need

**Branch Protection**:
Repository rules that prevent unreviewed or unsafe changes from merging into production branch.
_Avoid_: Direct merges to production branch without controls

**Single-Reviewer Gate**:
The v1 branch protection policy requiring at least one reviewer approval before merge.
_Avoid_: Zero-review merges

**Spam Defense**:
The protection layer that reduces automated abuse of contact form submissions.
_Avoid_: Unprotected public form endpoints

**Turnstile Protection**:
The selected Cloudflare Turnstile challenge used to validate contact submissions before processing.
_Avoid_: CAPTCHA solutions that conflict with tracker-free goals

**Delivery Channel**:
The transport path used by the Edge Submission Handler to deliver validated contact messages to the inbox.
_Avoid_: Unreliable direct SMTP implementations in v1

**Transactional Email Relay**:
The selected API-based email delivery service used by the edge handler to send contact submissions.
_Avoid_: Maintaining custom mail transport infrastructure in v1

## Relationships

- A **Studio Website** is intentionally a **Content/Marketing Website** for this project.
- **Scale (Website)** is primarily achieved through repeatable publishing patterns.
- **Non-Technical Publishing** is a required capability for ongoing website operations.
- The preferred path for **Non-Technical Publishing** is an in-site **Editorial Console**.
- The **Editorial Console** publishes through **Git-Backed Publishing**.
- The website delivery model is a **Static Runtime**.
- **Submission Integration** should be lightweight and compatible with a **Static Runtime**.
- **Editorial Identity** is provided through GitHub account access.
- Single-provider hosting and DNS is preferred when it satisfies the **Cost Guardrail**.
- The **Domain Registrar** may remain separate from the **Authoritative DNS Provider**.
- The preferred zero-cost path is Cloudflare as **Authoritative DNS Provider** and static host, while domain ownership can remain with HostGator as **Domain Registrar**.
- The default **Publishing Workflow** is Git-based and requires a **Review Gate**.
- The **Review Gate** is satisfied by pull request approval before merge.
- Each pull request should generate a **Preview Deployment** before approval.
- **Submission Integration** should use a Cloudflare **Edge Submission Handler** while staying within the **Cost Guardrail**.
- The canonical record for v1 contact submissions is the **Contact Inbox Record**.
- The selected **Editorial Platform** for v1 is **Decap CMS**.
- The selected **Site Framework** for v1 is **Astro**.
- The selected **Canonical Repository Platform** for v1 is **GitHub**.
- The selected **Tracking Policy** for v1 is a **Tracker-Free Runtime**.
- The selected **Launch Language** for v1 is **English-First Launch**.
- The content architecture must remain a **Localization-Ready Content Model**.
- The selected **Environment Model** for v1 is a **Two-Environment Model** with PR preview deployments.
- The selected **Branch Protection** policy is a **Single-Reviewer Gate** for main branch merges.
- The selected **Spam Defense** for the contact flow is **Turnstile Protection**.
- The selected **Delivery Channel** for contact messages is a free-tier **Transactional Email Relay** compatible with the **Cost Guardrail**.

## Example dialogue

> **Dev:** "Should we prioritize account logins now?"
> **Domain expert:** "No. This is a **Content/Marketing Website**; focus on discoverability and contact conversion first."

## Flagged ambiguities

- "scale" could mean traffic scaling or product-feature scaling. Resolved: in this context, it means content and page-operation scaling first.
- "publishing" could mean code deployment or content updates. Resolved: in this context, it includes non-technical content updates.
- "admin area" could mean player account management. Resolved: in this context, it means an **Editorial Console** for content operations.
- "static" could be interpreted as no dynamic capabilities at all. Resolved: static page delivery is required, with lightweight integrations allowed for form submission.
- "account" could mean player profile accounts. Resolved: in this context, accounts refer to authorized content editors using GitHub identities.
- "zero cost" could be interpreted as including domain renewal. Resolved: the **Cost Guardrail** applies to hosting and DNS platform costs, not domain registration renewals.
- "same provider" could be interpreted as including domain registration. Resolved: it applies to hosting and DNS operations, not necessarily the registrar.
- "publish" could mean saving an editor draft. Resolved: publishing means a merged, approved pull request reaching production.
- "preview" could mean local-only review. Resolved: preview means a shareable hosted URL tied to a pull request.
- "provider-native" could mean introducing paid managed products. Resolved: use Cloudflare-native capabilities that remain within free-tier limits for v1.
- "record" could imply a required database entry. Resolved: for v1 submissions, the record is the delivered email in the contact inbox.
- "CMS" could imply a separate hosted content backend. Resolved: in this context, CMS means a Git-backed editorial workflow via Decap.
- "framework-light" could imply no framework at all. Resolved: Astro is the framework baseline, with minimal client-side JavaScript by default.
- "Git-backed" could refer to any provider. Resolved: GitHub is the canonical repository platform for PR workflow and approvals.
- "tracker" could include basic operational logs. Resolved: tracker-free means no behavioral or profiling scripts, while standard infrastructure logs remain acceptable.
- "single language" could imply permanent monolingual strategy. Resolved: v1 is English-only, but the model remains localization-ready for future languages.
- "staging" could mean either a permanent environment or temporary previews. Resolved: v1 uses temporary PR previews, not a permanent staging environment.
- "approved" could imply optional reviewer checks for content updates. Resolved: all merges to main require at least one reviewer approval.
- "tracker-free" could be interpreted as no abuse protection at all. Resolved: Turnstile is allowed as spam defense while maintaining the tracker-free runtime policy.
- "free-tier email" could imply unlimited sending. Resolved: v1 relies on free-tier limits, and upgrades only when volume requires it.