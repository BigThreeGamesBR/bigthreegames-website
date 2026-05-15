---
description: "Use when implementing or updating website UI after a design direction, mockup, or brand system is defined. Enforces tokenized styling and consistent execution."
name: "Website Design System Instruction"
applyTo: "**/*.{html,css,scss,sass,less}, **/*.{js,jsx,ts,tsx,vue,svelte}"
---

# Website Design System Execution

Use this instruction when a visual design exists and code must follow it precisely.

## Source Of Truth

- Treat approved design specs as the source of truth for color, type, spacing, grid, iconography, and motion.
- If a spec detail is missing, ask for clarification before making irreversible style decisions.

## Token-First Implementation

- Define or extend shared tokens before styling components.
- Use semantic tokens (for example `--color-surface-primary`, not raw hex names).
- Avoid hardcoded values in component-level styles when a token can represent the value.

## Layout And Responsiveness

- Build mobile-first, then scale up to tablet and desktop breakpoints.
- Preserve intended hierarchy and rhythm from the design at all screen sizes.
- Keep line length, spacing, and hit targets accessible on small screens.

## Components And States

- Implement full interactive states where relevant: default, hover, focus-visible, active, disabled, loading.
- Keep components composable and reusable; avoid one-off page-specific variants unless requested.

## Motion And Media

- Use meaningful transitions that support hierarchy or feedback.
- Respect reduced-motion preferences for non-essential animation.
- Optimize images and videos for web delivery and avoid layout shift.

## Validation Checklist

- Visual parity with approved design direction
- Responsive behavior across core breakpoints
- Keyboard accessibility and focus visibility
- No raw style constants repeated across components when tokens are available
