# Skill: Control Tower Orchestrator

## Identity
`control-tower-orchestrator`

## Purpose
High-level coordination and planning skill. Use this skill when the task involves multiple files, multiple brands, or system-level decisions — any work that requires you to understand the whole before touching the parts.

---

## When to Use

- Planning a multi-step operation (e.g. new ASA plate from scratch)
- Cross-system impact assessment before making changes
- Identifying what needs to be updated when a core structural element changes
- Generating a structured task plan before execution begins
- Reviewing completeness of a feature or release

---

## Instructions

1. **Establish scope first.** Before planning, confirm: which brand, which system layer, what files will be touched.
2. **Check for existing work.** Read `asa-index.json`, scan relevant docs, check DECISION-LOG.md. Do not plan work that duplicates what exists.
3. **Identify the canonical order.** For ASA work: JSON first → plate HTML → nav updates → archive updates. Never reverse this order.
4. **Surface dependencies.** Note every file that will need updating and why. Make the dependency chain explicit before any work begins.
5. **Flag risks.** If a planned action could break navigation, orphan a page, or create a relative-path error, say so before proceeding.
6. **Output a structured plan.** Numbered steps, each with: action, file affected, what to check.

---

## Output Format

```
## Task Plan: [Task Name]

**Brand:** [brand]
**Scope:** [what this touches]
**Risk flags:** [any identified risks]

### Steps
1. [Action] — [file] — [check]
2. ...

### Files to Update
| File | Change | Priority |
|---|---|---|
| ... | ... | ... |

### Post-completion QA
- [ ] ...
```

---

## Quality Check

Before handing off a plan for execution:
- Every file that will be modified is named
- The order respects the canonical sequence (data before UI)
- No step will create a broken link or orphaned page
- Relative path compliance is noted where relevant
