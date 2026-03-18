# Product System

## Purpose

Defines the product taxonomy, development philosophy, and build process for all ecosystem products. Covers both the ASA publishing system (active) and future product development (VibeGuard, Cooked Pilot).

---

## Product Taxonomy

### ViceLab Products

| Product | Type | Status | Tech |
|---|---|---|---|
| Altered State Archive | Static publishing system | Active | HTML/CSS/JS, GitHub Pages |
| Signal | Intelligence dispatch | Concept | TBD |
| Dashboard | Data view | Concept | TBD |

### VibeGuard Products

| Product | Type | Status | Tech |
|---|---|---|---|
| Event Safety Platform | SaaS dashboard | Design phase | TBD |
| Incident API | Data API | Pre-concept | TBD |

### Cooked Pilot Products

| Product | Type | Status | Tech |
|---|---|---|---|
| Editorial platform | Publishing | Concept | TBD |
| Experience database | Structured content | Concept | TBD |

---

## ASA System — Active Product Spec

### Architecture
- Static HTML site, GitHub Pages hosted
- Shared CSS layer (`asa-plate.css`) + shared JS (`asa-plate.js`)
- JSON data index (`asa-index.json`) — fetched client-side for archive rendering
- Per-plate CSS tokens for class colour theming
- Static HTML fallback for all JS-rendered content

### Plate Types
1. **Substance Plate** — Individual pharmacological entry (e.g. MDMA, Cocaine, Ketamine)
2. **Class Plate** — Substance family overview (e.g. Stimulants)

### Plate Components
| Component | Class | Source |
|---|---|---|
| Archive header | `.arc-header` | Per-plate |
| Plate visual (SVG) | `.plate-visual` | Per-plate (mechanism art) |
| Status tags | `.asa-status-row` / `.asa-tag` | `asa-plate.css` |
| Family tree | `.asa-family-tree` | `asa-plate.css` |
| Metadata table | `.meta-table` | `asa-plate.css` |
| Harm reduction panel | `.hr-panel` | `asa-plate.css` |
| Research context | `.research-section` | `asa-plate.css` |
| Related plates | `.related-section` | `asa-plate.css` |
| Navigation ribbon | `.plate-nav` | `asa-plate.css` |

### Colour System
| Class | Hex | RGB |
|---|---|---|
| Empathogen | `#E43CFF` | `228,60,255` |
| Stimulant | `#4DA3FF` | `77,163,255` |
| Dissociative | `#00FFC6` | `0,255,198` |
| Psychedelic | `#A78BFA` | `167,139,250` |
| Opioid | `#F0A030` | `240,160,48` |
| Cannabinoid | `#7EE482` | `126,228,130` |

### Evidence Tier System
| Tier | Label | Meaning |
|---|---|---|
| `tier-1` | Tier 1 | Strong clinical evidence, multiple studies |
| `tier-2` | Mixed | Mixed or limited evidence base |
| `tier-3` | Emerging | Early research, case reports only |

### Status Tags
| Status | CSS class | Meaning |
|---|---|---|
| Verified | `.asa-tag.verified` | Pharmacology well-established |
| Limited | `.asa-tag.limited` | Partial evidence, gaps noted |
| Emerging | `.asa-tag.emerging` | Active research area, evolving |

---

## Product Development Principles

1. **Static-first where possible** — no server dependency for read-only publishing
2. **Data before UI** — define the JSON/data model before building the rendering layer
3. **Progressive enhancement** — JS enhances static HTML; static HTML must stand alone
4. **No premature abstraction** — build for current need, not hypothetical future scale
5. **Separation of concerns** — data (JSON), presentation (CSS), behaviour (JS) stay separate
6. **GitHub Pages compatibility** — all current web products must deploy from a git push

---

## Build Checklist (ASA Plates)

Before marking any plate as complete:

- [ ] `asa-index.json` updated with correct fields
- [ ] HTML file created from `_template.html`
- [ ] Class colour tokens set in per-plate `<style>` block
- [ ] `data-cc-rgb` set on `<html>` element
- [ ] `data-plate-tags` set on `<html>` element
- [ ] SVG plate art represents primary mechanism
- [ ] Status row includes correct `.asa-tag` variants
- [ ] Family tree block populated
- [ ] Metadata table complete and accurate
- [ ] Harm reduction notes (minimum 5 notes + Wingmate Protocol)
- [ ] Research context section written
- [ ] 4 related plate cards (live links for published plates, `archive.html` fallback for unpublished)
- [ ] Navigation ribbon prev/next links correct
- [ ] No absolute paths (`/` prefix) anywhere in the file
- [ ] No links to non-existent pages
- [ ] Adjacent plate nav links updated
- [ ] Static fallback card added to `archive.html`
- [ ] Archive stats updated
