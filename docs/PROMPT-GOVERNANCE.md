# Prompt Governance

## Purpose

Defines how prompts are created, stored, versioned, and used across the ViceLab ecosystem. Prompts are operational assets — they must be discoverable, reusable, and maintained to the same standard as code.

---

## Prompt Library Location

All reusable prompts live in `ops/prompts/`.

Directory structure:
```
ops/prompts/
├── asa/                     — ASA plate and archive prompts
├── vicelab/                 — ViceLab editorial prompts
├── cooked-pilot/            — Cooked Pilot prompts
├── viguard/                 — VibeGuard prompts
└── system/                  — Control Tower system prompts
```

---

## Prompt File Format

Every prompt file must follow this structure:

```markdown
# [Prompt Name]

## Metadata
- **ID:** [unique-id]
- **Brand:** [ViceLab / Cooked Pilot / VibeGuard / System]
- **Type:** [content / brief / analysis / record / decision]
- **Version:** [v1.0]
- **Last updated:** [YYYY-MM-DD]

## Purpose
[One sentence: what this prompt produces]

## When to Use
[Specific trigger conditions — when should someone reach for this prompt]

## Input Requirements
[What context must be provided before running this prompt]

## Prompt
---
[The actual prompt text]
---

## Output Format
[What the output should look like — structure, length, format]

## Quality Check
[Questions to ask before accepting the output]

## Notes
[Edge cases, known limitations, dependencies]
```

---

## Versioning Rules

- Use semantic versioning: `v1.0`, `v1.1`, `v2.0`
- Increment minor version (`v1.x`) for wording improvements that don't change purpose
- Increment major version (`v2.0`) for changes to output format or purpose
- Never delete a prompt — mark as `deprecated` and note the replacement
- Deprecated prompts move to `ops/prompts/_deprecated/`

---

## Prompt Quality Standards

Before adding a prompt to the library:

- [ ] Has been tested and produces a usable output
- [ ] Input requirements are fully specified
- [ ] Output format is defined precisely enough to evaluate
- [ ] Brand voice is correctly scoped
- [ ] No duplication — check existing library first
- [ ] Metadata is complete

---

## ASA-Specific Prompts (Planned)

| Prompt | ID | Status |
|---|---|---|
| New plate research brief | `asa-research-brief-v1` | To create |
| SVG plate art brief | `asa-svg-brief-v1` | To create |
| Harm reduction notes writer | `asa-hr-notes-v1` | To create |
| Archive context writer | `asa-context-v1` | To create |
| Metadata table generator | `asa-metadata-v1` | To create |
| JSON entry generator | `asa-json-entry-v1` | To create |

---

## Rules

1. **Prompts are version-controlled** — commit prompt changes like code
2. **One file per prompt** — do not bundle multiple unrelated prompts
3. **Test before committing** — a prompt that hasn't been run is not a prompt, it's a draft
4. **Brand-scope every prompt** — a ViceLab prompt must not produce acceptable output when run with Cooked Pilot context, and vice versa
5. **Prompts reference templates** — if a prompt produces a specific format, that format should have a corresponding template in `ops/templates/`
