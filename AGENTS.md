# Big Three Games - Agent Guidelines

These instructions apply across this workspace and define how AI coding agents should operate while the website is being built.

## Project State

- This repository is greenfield. Prefer discovering the stack from committed files before assuming frameworks.
- If stack choices are missing for a requested task, propose the smallest viable option and proceed only after user confirmation.
- Default implementation preference is a static website using HTML, CSS, and vanilla JavaScript so it can be hosted anywhere.

## Website Focus

- Display and promote studio games.
- Explain the studio identity, values, and background.
- Provide a clear contact path through a form or comparable lightweight method.

## Delivery Expectations

- Build production-ready website code, not throwaway prototypes, unless the user asks for a spike.
- Keep changes small and scoped to the request.
- Preserve visual consistency with the active design direction.
- Favor accessibility, performance, and responsive behavior by default.

## Architecture Guardrails

- Keep presentation, content data, and integration logic separated.
- Prefer reusable components and shared style tokens over page-level duplication.
- Place long-form project docs in `docs/` and link to them from chat customization files instead of duplicating content.

## Build And Validation

- Discover and run the project's real build, lint, and test commands from package manager config or documented scripts.
- If no commands exist yet, state that validation is limited and avoid inventing fake command output.

## Frontend Quality Bar

- Implement mobile-first layouts with clean scaling to desktop.
- Use semantic HTML and keyboard-accessible interactions.
- Optimize media assets and avoid unnecessary runtime dependencies.

## Customization Map

- Design implementation rules: [.github/instructions/website-design-system.instructions.md](.github/instructions/website-design-system.instructions.md)
- Content authoring rules: [.github/instructions/content-authoring-guidelines.instructions.md](.github/instructions/content-authoring-guidelines.instructions.md)
- Repeatable website workflow: [.github/skills/studio-website-workflow/SKILL.md](.github/skills/studio-website-workflow/SKILL.md)
- Specialist build agent: [.github/agents/studio-web-builder.agent.md](.github/agents/studio-web-builder.agent.md)
- Accessibility review agent: [.github/agents/accessibility-reviewer.agent.md](.github/agents/accessibility-reviewer.agent.md)