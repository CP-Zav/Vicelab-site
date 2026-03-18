# ASA System Status

**Status:** Stable · Canonical Lock · 2026
**Last updated:** 2026-03-18

---

## 1. System Overview

The Altered State Archive (ASA) is ViceLab's primary content infrastructure for evidence-based substance intelligence. It publishes pharmacological reference plates — static HTML pages combining scientific metadata, harm reduction guidance, research context, and visual pharmacology diagrams. The archive is accessible via `archive.html` (the hub) and individual plate files. It is a static system, designed for GitHub Pages deployment, and serves as the primary editorial output of ViceLab Research Intelligence.

---

## 2. Current State (Locked)

The following are complete and stable as of this status record.

| Component | Status |
|---|---|
| `archive.html` — ASA hub | Implemented and functional. Cards rendered from `asa-index.json` with static HTML fallback. |
| Navigation | Fully repaired. All plate files use relative paths only. No broken routes. |
| `_template.html` | Canonical base for all new plates. Filename convention comment corrected. Breadcrumb comment clarified. |
| `ASA_STANDARD.md` | Created. Single source of truth for plate structure rules, navigation rules, asset rules, and QA checklist. |
| `ASA_NEW_ENTRY.md` | Fully rewritten to match the working system. Correct template section names, archive order table, class colour reference, updated prompt. |
| Plate consistency | All four live plates audited and corrected: related card IDs, `data-accent` values, status row formatting, breadcrumb format, system strip labels. |
| `asa-pl-02-stimulants.html` | Fully rebuilt from `_template.html`. Inline CSS, inline JS, non-standard class names, and non-standard section structure eliminated. |
| `archive.html` stats comment | Maintenance comment added to stats block documenting fallback behaviour and update requirement. |
| CLAUDE.md | ASA subsystem rules integrated. |

---

## 3. Live Plates

4 plates published. All conform to the locked ASA standard.

| ID | Title | File | Type |
|---|---|---|---|
| ASA-EM-01 | MDMA | `asa-em-01-mdma.html` | Substance Plate |
| ASA-ST-02 | Cocaine | `asa-st-02-cocaine.html` | Substance Plate |
| ASA-DS-01 | Ketamine | `asa-ds-01-ketamine.html` | Substance Plate |
| ASA-PL-02 | Stimulants | `asa-pl-02-stimulants.html` | Class Plate |

**Archive sequence:** ASA-EM-01 → ASA-ST-02 → ASA-DS-01 → ASA-PL-02 → archive.html

---

## 4. System Rules (Summary)

Full rules in `ASA_STANDARD.md`. Key points:

- **Template:** Every new plate is built by copying `_template.html`. No exceptions.
- **Section order:** `arc-header` → `plate-display-section` → `sci-meta-section` → `hr-section` → `research-section` → `related-section` → `plate-nav` → `footer` → `<script src="asa-plate.js">`. Non-negotiable.
- **Assets:** `asa-plate.css` linked in `<head>`. `asa-plate.js` at end of `<body>`. No inline CSS beyond six `--cc-*` accent tokens. No inline JS.
- **Navigation:** Relative paths only. No root-absolute URLs.
- **Breadcrumbs:** Both links point to `archive.html`. No class filtering.
- **Related plates:** Always exactly 4 cards. `data-accent` matches the linked plate's class, not the current plate. Unpublished plates link to `archive.html`.
- **Archive update:** Every new plate requires a JSON entry, a static fallback card in `archive.html`, and manual stat updates.

---

## 5. Known Constraints

- **Static site only.** GitHub Pages deployment. No server-side logic, no build step.
- **No routing framework.** All navigation is direct file linking. No query-string or hash-based filtering.
- **Archive stats are manual.** The four stat numbers in `archive.html` are static HTML. They are overwritten at runtime by the JSON renderer, but must be manually updated to keep the no-JS fallback accurate.
- **Breadcrumb class links are non-functional.** Both breadcrumb segments point to `archive.html`. There is no class-filtered view. The class label is display only.
- **Related plate placeholders.** Unpublished plates referenced in related cards (ASA-PL-03, ASA-PL-04, ASA-PL-05) link to `archive.html`. These must be updated when the corresponding plates are published.

---

## 6. Known Technical Debt

**One pre-existing colour system inconsistency remains.**

The `_template.html` colour reference documents Stimulants as `#4DA3FF` (electric blue). `asa-st-02-cocaine.html` correctly uses electric blue. The `asa-pl-02-stimulants.html` class plate uses `#FFB830` (amber-gold), which matches the `archive.html` `.pl-st` card accent but diverges from the template reference.

The archive also has `--accent-stimulant: #FFB830` (amber) but `border-color: rgba(77,163,255)` (electric blue) on the `.st` substance card — internally inconsistent.

**Resolution required:** Decide whether electric blue is for stimulant substance plates and amber-gold for the stimulant class plate, document this split intentionally in `_template.html`, and fix the `archive.html` border colour to match. This is a visual and documentation fix — no structural work.

No other technical debt remains. All plates now conform to the locked standard.

---

## 7. Future Enhancements (Not Required Now)

These are optional improvements that do not affect current stability.

| Enhancement | Description |
|---|---|
| Archive class filtering | Add query-string or hash routing in `archive.html` JS to filter the grid by class. Requires no structural plate changes. |
| Dynamic stat generation | Auto-calculate stat numbers from JSON rather than hardcoding. Would eliminate the manual update requirement. |
| Breadcrumb class links | Once filtering is implemented, the breadcrumb class segment can link to a filtered archive view. |
| asa-index.json expansion | Add `color_hex` field to JSON so archive card borders can be driven by data rather than CSS class matching. |
| Plate search / index | A text-search or tag-filter layer across all published plates. |

---

## 8. Operating Rule Going Forward

The ASA system is a **stable subsystem**. Treat it accordingly.

- **Extend via template only.** New plates are produced by copying `_template.html` and following `ASA_NEW_ENTRY.md`.
- **No structural redesign** unless a critical rendering or compatibility issue requires it.
- **No divergence from `ASA_STANDARD.md`.** If a future plate cannot be produced within the standard, the correct response is to update the standard first — not to make an exception.
- **Governance files take precedence.** `ASA_STANDARD.md` overrides individual judgement on structural questions. If in doubt, consult it.
- **Every publish triggers a full QA pass.** Use the checklist in `ASA_STANDARD.md` before setting any plate to `"published": true`.
