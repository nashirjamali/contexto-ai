# Contexto — Design System

Design direction for the Contexto frontend, following the [Anthropic frontend-design skill](../../.cursor/skills/frontend-design/SKILL.md).

---

## Direction

| Attribute | Choice |
| --- | --- |
| Tone | Editorial / refined knowledge archive |
| Differentiator | Warm ink-and-paper palette with bronze citation accents — feels like a premium research desk, not a generic AI chatbot |
| Audience | Teams uploading documents and chatting with institutional knowledge |

---

## Typography

| Role | Font | Usage |
| --- | --- | --- |
| Display | Newsreader (serif) | Headlines, hero text, document titles |
| Body | DM Sans (sans) | UI labels, body copy, forms, chat |

Avoid Inter, Roboto, Geist, Space Grotesk, and system defaults.

---

## Color Tokens

| Token | Value | Usage |
| --- | --- | --- |
| `--ink` | `#0f1219` | Page background |
| `--surface` | `#181c27` | Cards, sidebar, panels |
| `--surface-raised` | `#222836` | Hover states, inputs |
| `--paper` | `#e8e4dc` | Primary text |
| `--paper-muted` | `#8a8698` | Secondary text |
| `--bronze` | `#d4a574` | CTAs, links, citation highlights |
| `--sage` | `#6b9b8a` | Success, ready status |
| `--ember` | `#c45c4a` | Errors, failed status |

---

## Motion

- Page load: staggered fade-up reveals (`animation-delay` on hero elements)
- Hover: subtle translate and glow on interactive elements
- Chat: message appear with short slide-in
- Prefer CSS animations; use Motion library for complex React sequences when needed

---

## Spatial Composition

- Dashboard: fixed sidebar + generous content area; asymmetric hero on landing
- Document cards: overlapping stack metaphor on marketing page
- Chat panel: full-height right column with citation blocks indented beneath answers
- Public share page: centered narrow column, minimal chrome

---

## Backgrounds & Texture

- Grain overlay on dark backgrounds (`noise` SVG filter or CSS pseudo-element)
- Radial gradient mesh behind hero (bronze + sage at low opacity)
- Document cards use subtle border + inner shadow for depth

---

## Component Patterns

| Component | Notes |
| --- | --- |
| Button primary | Bronze fill, dark text, rounded-sm not pill |
| Button ghost | Paper text, bronze border on hover |
| Input | Surface-raised bg, no heavy borders, bronze focus ring |
| Citation block | Left bronze border, muted paper bg, monospace chunk index |
| Status badge | Pill with sage (ready), amber (processing), ember (failed) |
| Sidebar | Full-height ink surface, bronze active indicator bar |

---

## Skill Reference

All frontend UI work must follow `.cursor/skills/frontend-design/SKILL.md`. Read it before building pages or components.
