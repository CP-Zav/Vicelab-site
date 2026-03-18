# Control Tower Architecture

## Overview

The ViceLab Control Tower is the operational layer connecting three brands, one active publishing system (the Altered State Archive), and a growing set of product and content operations. Its function is coordination — ensuring that work done in one part of the system is consistent with, and does not duplicate, work done elsewhere.

---

## System Layers

### Layer 1 — Publishing (Active)
The static GitHub Pages site. Delivers the Altered State Archive and ViceLab's public-facing content.

```
GitHub Pages
    └── archive.html          (ASA hub)
    └── asa-[id]-[slug].html  (plate pages)
    └── asa-plate.css / .js   (shared layer)
    └── asa-index.json        (canonical data index)
    └── index.html            (ViceLab root — TBD)
    └── dashboard.html        (Dashboard — TBD)
    └── signal.html           (Signal — TBD)
```

**Constraints:** Static only. All rendering is client-side. No absolute root paths. JSON fetch with static HTML fallback.

---

### Layer 2 — Intelligence (Operational)
The Control Tower's internal working layer. Lives in this repository.

```
/docs           — Strategy and governance documents
/ops/prompts    — Reusable prompt templates
/ops/templates  — Copy and content templates
/ops/logs       — Session logs, changelogs
/ops/exports    — Finished outputs ready to deliver
```

---

### Layer 3 — AI System (Active)
Claude Code operating under CLAUDE.md rules, with skill definitions for typed, scoped tasks.

```
CLAUDE.md               — Master operating rules
.claude/settings.json   — Claude Code configuration
.claude/rules/          — Scoped rule fragments
.claude/skills/         — Skill definitions (typed task execution)
```

---

### Layer 4 — Products (Pre-launch)
VibeGuard and Cooked Pilot are brand entities within the ecosystem but are not yet in active development in this repository. Their governance is defined in docs; their build will live in `/src` or separate repos as appropriate.

---

## Data Flow

```
Editorial decision
    → DECISION-LOG.md entry
    → asa-index.json update (if ASA)
    → plate HTML creation (if ASA)
    → archive.html static card update
    → nav chain update in adjacent plates
    → commit + push
```

```
Content brief
    → ops/prompts/ (if reusable pattern)
    → ops/templates/ (if reusable format)
    → ops/exports/ (finished output)
```

---

## Canonical Sources of Truth

| Subject | Canonical location | Notes |
|---|---|---|
| Archive plate data | `asa-index.json` | Never duplicated elsewhere |
| Brand rules | `docs/BRAND-GOVERNANCE.md` | Governs all three brands |
| Decisions made | `docs/DECISION-LOG.md` | Append-only |
| AI operating rules | `CLAUDE.md` | Imports skills from `.claude/skills/` |
| Content types | `docs/CONTENT-OPS-SYSTEM.md` | Defines all content formats |
| Product taxonomy | `docs/PRODUCT-SYSTEM.md` | Defines all product categories |
| Prompt library | `ops/prompts/` | Versioned prompt files |

---

## Scaling Model

The system is designed to grow without duplication or structural debt:

1. **New ASA plate** → follow `ASA_NEW_ENTRY.md`, update `asa-index.json`, no architectural change
2. **New content type** → add to `CONTENT-OPS-SYSTEM.md`, create template in `ops/templates/`
3. **New brand initiative** → add to `ECOSYSTEM-MAP.md`, update `BRAND-GOVERNANCE.md`, log in `DECISION-LOG.md`
4. **New Claude skill** → add to `.claude/skills/`, reference in `CLAUDE.md`
5. **New product** → add to `PRODUCT-SYSTEM.md`, scaffold in `/src` if code required

---

## What Does Not Belong Here

- Production code for external services (VibeGuard API, etc.) — separate repo
- User data of any kind
- Unpublished research that has not been verified through the ASA process
- Brand assets (logos, fonts) — separate asset management
