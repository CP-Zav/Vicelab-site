# Content Ops System

## Purpose

Defines content types, production workflow, and quality standards for all ViceLab ecosystem publishing. This document governs how content moves from brief to published output.

---

## Content Types

### ViceLab

| Type | ID | Description | Template | Owner |
|---|---|---|---|---|
| ASA Substance Plate | `asa-substance` | Full pharmacology plate for individual substance | `_template.html` | Archive |
| ASA Class Plate | `asa-class` | Pharmacology overview for substance class | `_template.html` | Archive |
| Signal Dispatch | `signal-dispatch` | Intelligence summary, event-driven or periodic | TBD | Editorial |
| Dashboard View | `dashboard-view` | Data visualisation and summary | TBD | Data |
| Field Note | `field-note` | Short-form operational harm reduction note | TBD | Editorial |

### Cooked Pilot

| Type | ID | Description | Template | Owner |
|---|---|---|---|---|
| Editorial | `cp-editorial` | Long-form culture piece | TBD | Editorial |
| Experience Guide | `cp-experience` | Structured experiential walkthrough | TBD | Editorial |
| Profile | `cp-profile` | Maker / operator / venue profile | TBD | Editorial |

### VibeGuard

| Type | ID | Description | Template | Owner |
|---|---|---|---|---|
| Product Doc | `vg-doc` | Platform feature or process documentation | TBD | Product |
| Case Study | `vg-case` | Operator outcome narrative | TBD | Product/Sales |
| Onboarding Copy | `vg-onboarding` | Platform onboarding sequence | TBD | Product |

---

## ASA Production Workflow

The ASA workflow is the most structured and active process in the system.

```
1. RESEARCH BRIEF
   Define substance/class, identify primary mechanism, gather sources

2. JSON ENTRY
   Add to asa-index.json with all required fields
   (Do this FIRST — it is the canonical record)

3. PLATE CREATION
   Create HTML from _template.html
   - SVG plate art (mechanism-driven visual)
   - Metadata table
   - Family tree taxonomy
   - Status tags (verified / limited / emerging + evidence tier)
   - Harm reduction notes
   - Research context section
   - Related plates (live plates link direct; unpublished link to archive.html)

4. NAVIGATION UPDATE
   Update prev plate's next link
   Update next plate's prev link

5. ARCHIVE UPDATE
   Add static fallback card to archive.html
   Update stat counters if JS fallback values changed

6. QA CHECKLIST
   □ No absolute paths
   □ No broken links
   □ All class colour tokens set
   □ data-cc-rgb set on <html>
   □ data-plate-tags set on <html>
   □ asa-index.json and plate content consistent
   □ Navigation chain verified

7. COMMIT AND PUSH
   Clear commit message referencing plate ID
```

See `ASA_NEW_ENTRY.md` for full plate creation guide.

---

## Quality Standards

### Scientific accuracy
ASA content must reflect current pharmacological understanding. Primary mechanisms must be accurate. Risk and interaction data must be sourced from clinical or harm reduction literature, not anecdotal sources.

### Harm reduction standard
All risk-facing content must be:
- Evidence-based, not anecdotal
- Non-judgemental in framing
- Operationally useful — actionable in the environments where the substance is encountered
- Free of prohibition language

### Brand voice
Every piece of content must pass a brand voice check against `BRAND-GOVERNANCE.md` before publication.

---

## Content Status System

| Status | Meaning |
|---|---|
| `draft` | In progress, not ready for review |
| `review` | Ready for editorial review |
| `approved` | Cleared for publication |
| `published` | Live |
| `archived` | Superseded or withdrawn |

---

## Prompt Library

Reusable prompt templates for content production live in `ops/prompts/`. Each prompt file should include:
- Task type
- Brand context
- Input requirements
- Output format
- Quality check

See `docs/PROMPT-GOVERNANCE.md` for prompt management rules.
