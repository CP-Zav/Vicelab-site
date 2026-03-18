# ViceLab Control Tower

Operational hub for the ViceLab ecosystem — managing content, product, archive, and brand intelligence across ViceLab, Cooked Pilot, and VibeGuard.

---

## What This Is

The Control Tower is the working layer of the ViceLab ecosystem. It holds:

- **The Altered State Archive (ASA)** — evidence-based pharmacology plates, served as a static GitHub Pages site
- **Operational docs** — brand governance, content systems, product structure, roadmap
- **Claude system files** — AI operating rules, skill definitions, prompt library
- **Build artefacts** — templates, exports, logs

This is a production system. Everything here has a function.

---

## Ecosystem Brands

| Brand | Type | Status |
|---|---|---|
| **ViceLab** | Media / Archive / Intelligence | Active |
| **Cooked Pilot** | Creative culture / Experience design | Development |
| **VibeGuard** | Event safety SaaS | Pre-launch |

See `docs/ECOSYSTEM-MAP.md` for full relationship model.

---

## Project Structure

```
/
├── CLAUDE.md                    — AI system identity and operating rules
├── README.md                    — This file
├── asa-index.json               — Canonical ASA archive data index
├── archive.html                 — ASA hub page (GitHub Pages entry point)
├── asa-plate.css                — Shared ASA plate stylesheet
├── asa-plate.js                 — Shared ASA plate scripts
├── _template.html               — New plate template
├── ASA_NEW_ENTRY.md             — Guide for adding archive plates
│
├── docs/                        — Strategy, governance, architecture
│   ├── CONTROL-TOWER-ARCHITECTURE.md
│   ├── ECOSYSTEM-MAP.md
│   ├── BRAND-GOVERNANCE.md
│   ├── CONTENT-OPS-SYSTEM.md
│   ├── PRODUCT-SYSTEM.md
│   ├── LAUNCH-ROADMAP.md
│   ├── PROMPT-GOVERNANCE.md
│   └── DECISION-LOG.md
│
├── .claude/                     — Claude Code system files
│   ├── settings.json
│   ├── rules/                   — Scoped rule fragments (imported by CLAUDE.md)
│   └── skills/                  — Reusable Claude skill definitions
│       ├── control-tower-orchestrator/SKILL.md
│       ├── brand-guardian/SKILL.md
│       ├── content-ops/SKILL.md
│       ├── research-librarian/SKILL.md
│       └── product-structurer/SKILL.md
│
├── ops/                         — Operational working files
│   ├── prompts/                 — Prompt library (reusable, versioned)
│   ├── templates/               — Copy and content templates
│   ├── logs/                    — Session logs, changelogs
│   └── exports/                 — Finished outputs ready to publish/deliver
│
└── src/                         — Source assets (scripts, components, future tooling)
```

---

## ASA Plate System

The Altered State Archive is a static site hosted on GitHub Pages. Each plate is an HTML file with a shared CSS/JS layer.

**Adding a new plate:**
1. Read `ASA_NEW_ENTRY.md`
2. Add the entry to `asa-index.json` first
3. Create the plate HTML from `_template.html`
4. Update navigation in adjacent plates
5. The archive hub (`archive.html`) renders from JSON automatically

**Current plate sequence:**
```
ASA-EM-01 (MDMA) → ASA-ST-02 (Cocaine) → ASA-DS-01 (Ketamine) → ASA-PL-02 (Stimulants class)
```

**Class colour system:**
| Class | Colour | Hex |
|---|---|---|
| Empathogen | Magenta | `#E43CFF` |
| Stimulant | Electric Blue | `#4DA3FF` |
| Dissociative | Teal | `#00FFC6` |
| Psychedelic | Violet | `#A78BFA` |
| Opioid | Amber | `#F0A030` |
| Cannabinoid | Green | `#7EE482` |

---

## GitHub Pages Compatibility Rules

- All links must be **relative** (no `/archive`, `/signal` root-absolute paths)
- No server-side rendering — static HTML + JS fetch only
- `asa-index.json` is fetched client-side; static HTML cards are the no-JS fallback
- Never link to pages that do not exist

---

## Quick Reference

| Task | Where to start |
|---|---|
| Add an ASA plate | `ASA_NEW_ENTRY.md` |
| Understand brand rules | `docs/BRAND-GOVERNANCE.md` |
| Log a decision | `docs/DECISION-LOG.md` |
| Find/create a prompt | `ops/prompts/` |
| Change AI behaviour | `CLAUDE.md` |
| Run a skill | `.claude/skills/<name>/SKILL.md` |
