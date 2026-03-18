# Decision Log

This is an append-only record of significant decisions made in the ViceLab ecosystem. Do not edit or delete existing entries. Add new entries at the bottom.

Format: add a new `---` separator and entry block. Tag each entry with brand and category.

---

## Entry Format

```
## [YYYY-MM-DD] — [Decision title]
**Brand:** [ViceLab / Cooked Pilot / VibeGuard / System]
**Category:** [Architecture / Content / Product / Brand / Operations]
**Status:** [Made / Revisited / Superseded by YYYY-MM-DD entry]

**Context:**
[Why this decision was necessary]

**Decision:**
[What was decided]

**Rationale:**
[Why this option over others]

**Implications:**
[What changes as a result]
```

---

## 2026-03-01 — Static site architecture for ASA
**Brand:** ViceLab
**Category:** Architecture
**Status:** Made

**Context:**
The Altered State Archive needed a hosting solution that was free, reliable, and required no backend infrastructure.

**Decision:**
GitHub Pages static site. All rendering is client-side. No server-side processing.

**Rationale:**
Zero cost, zero ops overhead, version-controlled deployment, GitHub-native. The archive is read-only — there is no user data, no authentication, no server interaction required.

**Implications:**
All paths must be relative (no root-absolute links). All JS must run client-side. JSON data fetched via `fetch()` with static HTML fallback. No dynamic routing.

---

## 2026-03-05 — JSON-first data architecture for archive
**Brand:** ViceLab
**Category:** Architecture
**Status:** Made

**Context:**
The archive needed to scale beyond manual HTML card management. Adding each new plate required manual updates to `archive.html` cards and stat counters.

**Decision:**
Introduce `asa-index.json` as the canonical data index. `archive.html` fetches it and renders cards dynamically. Static HTML cards remain in the DOM as no-JS fallback.

**Rationale:**
Single source of truth for plate metadata. Archive.html becomes automatically current when a new plate is added to JSON. Stat counts computed from live data. No duplication risk between JSON record and HTML.

**Implications:**
All new plates must be added to `asa-index.json` first. Static fallback cards must still be manually maintained (acceptable tradeoff). Navigation fields (`prev_plate`, `next_plate`) live in JSON.

---

## 2026-03-08 — Ketamine as first dissociative entry
**Brand:** ViceLab
**Category:** Content
**Status:** Made

**Context:**
The first three entries (MDMA, Cocaine, Stimulants class) established the archive pattern. The next entry needed to test the architecture across a new substance class.

**Decision:**
ASA-DS-01 Ketamine. First dissociative entry. Plate ID: `asa-ds-01-ketamine.html`. Class colour: teal `#00FFC6`.

**Rationale:**
Ketamine is simultaneously a licensed anaesthetic, an approved antidepressant (esketamine), and one of the most widely encountered dissociatives in festival environments. Its dual clinical/recreational profile makes it a strong structural test case. The NMDA antagonism mechanism is distinct from all previous entries (monoamine system), confirming the archive can represent different pharmacological classes correctly.

**Implications:**
`di` category added to `CATEGORY_CSS` in `archive.html`. `asa-index.json` updated to insert DS-01 between ST-02 and PL-02. Navigation chain: Cocaine → Ketamine → Stimulants. Dissociative class colour `#00FFC6` now reserved.

---

## 2026-03-18 — Control Tower structure initialised
**Brand:** System
**Category:** Operations
**Status:** Made

**Context:**
The repository had grown beyond a simple plate archive. Multiple brands, multiple content types, and an AI system needed coordinating infrastructure.

**Decision:**
Formalise the Control Tower project structure. Create `/docs`, `/.claude`, `/ops`, `/src` directories. Establish `CLAUDE.md` as the AI operating definition, `docs/DECISION-LOG.md` as the decision record, and skill definitions in `.claude/skills/`.

**Rationale:**
Operational clarity at scale. Without governance documents, every AI session starts from scratch. With them, Claude operates within a defined system that accumulates knowledge.

**Implications:**
All future sessions should reference `CLAUDE.md` for operating rules. Significant decisions append to this log. Prompts live in `ops/prompts/`. Skills in `.claude/skills/`.
