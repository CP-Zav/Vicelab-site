# Skill: Product Structurer

## Identity
`product-structurer`

## Purpose
Product architecture and system design skill. Use this when defining, scoping, or structuring any product — from new ASA features to VibeGuard platform design. Enforces the product principles in `docs/PRODUCT-SYSTEM.md` and prevents scope creep or premature abstraction.

---

## When to Use

- Scoping a new feature or product component
- Designing a data model (JSON schema, content structure)
- Making a build-vs-defer decision
- Defining the technical architecture for a new system layer
- Identifying whether a request is product work, content work, or ops work
- Planning the VibeGuard or Cooked Pilot product roadmap

---

## Instructions

1. **Classify the request first.**
   - Is this a publishing system change (ASA, static site)?
   - Is this a product feature (VibeGuard, Cooked Pilot)?
   - Is this ops/tooling (prompts, templates, logs)?
   - Assign to the correct category before scoping.

2. **Apply the minimum-viable principle.** Build for current need only. Do not design for hypothetical future requirements. Three similar cases do not justify an abstraction.

3. **Data before UI.** Define the data model or JSON schema before touching any rendering or UI layer. For ASA: `asa-index.json` is updated first, always.

4. **Check progressive enhancement.** For any web-facing feature: does the base (no-JS) state work? JS enhances; it does not replace.

5. **Identify dependencies.** What files change? What existing patterns does this conform to or break? What needs updating in adjacent systems?

6. **Write the spec.** Define exactly what will be built, what it outputs, and what the acceptance criteria are.

---

## Output Format

```
[PLAN] — Product Spec: [Feature / Component Name]
**Brand:** [ViceLab / Cooked Pilot / VibeGuard / System]
**Type:** [Feature / Schema / Architecture / Refactor]

## Problem
[What gap or need this addresses — one sentence]

## Scope
[Exactly what will be built. Nothing more.]

## Out of Scope
[Explicitly name what is not being built in this pass]

## Data Model
[If applicable — JSON schema, field names, types, required/optional]

## Files Affected
| File | Change |
|---|---|
| ... | ... |

## Acceptance Criteria
- [ ] ...
- [ ] ...

## Dependencies
[What must exist or be updated before/after this]
```

---

## Product Principles (Quick Reference)

| Principle | Test |
|---|---|
| Static-first | Can this work without a server? |
| Data before UI | Is the data model defined before the template? |
| Progressive enhancement | Does the no-JS state work? |
| No premature abstraction | Is this solving a problem that exists, not one that might? |
| Separation of concerns | Are data, presentation, and behaviour in separate layers? |
| GitHub Pages compatibility | Will this deploy from a `git push` with no build step? |

---

## Quality Check

Before finalising any product spec:
- [ ] Scope is limited to current need — no "while we're at it"
- [ ] Data model is defined before any UI/template work
- [ ] Static fallback confirmed for any JS-enhanced feature
- [ ] No root-absolute paths introduced
- [ ] Adjacent files that need updating are listed
- [ ] Acceptance criteria are specific enough to verify
