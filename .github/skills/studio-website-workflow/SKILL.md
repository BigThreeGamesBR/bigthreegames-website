---
name: studio-website-workflow
description: "Plan and implement game studio website features end-to-end. Use for landing pages, game detail pages, studio/about sections, and production-ready frontend updates."
argument-hint: "Describe the page or feature, target audience, and design constraints"
user-invocable: true
---

# Studio Website Workflow

Use this skill for repeatable delivery of website features for Big Three Games.

## When To Use

- Building a new website page or section
- Refactoring existing frontend structure for maintainability
- Translating approved design into production UI
- Improving accessibility or performance for existing pages

## Inputs To Gather First

- Goal of the page or feature
- Target user and key action
- Available design direction or mockups
- Required integrations (forms, analytics, CMS, APIs)
- Definition of done (quality checks and acceptance criteria)

## Procedure

1. Discover active stack and project constraints from the workspace, defaulting to static HTML, CSS, and vanilla JavaScript unless requirements demand more.
2. Produce a compact implementation plan with file-level scope.
3. Implement reusable components and shared styling tokens first.
4. If a design exists, follow [website-design-system.instructions.md](../../instructions/website-design-system.instructions.md).
5. Add responsive behavior, accessibility states, and performance-minded asset handling.
6. Run available validation commands (build, lint, test) and report any limits.
7. Summarize changed files, user-visible outcomes, and remaining risks.

## Output Expectations

- Clear implementation summary
- File list with purpose of each file
- Validation results and unresolved gaps

## Related Customization

- Specialist agent: [studio-web-builder.agent.md](../../agents/studio-web-builder.agent.md)
