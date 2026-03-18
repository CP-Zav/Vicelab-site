# Skill: Brand Guardian

## Identity
`brand-guardian`

## Purpose
Brand voice and compliance skill. Use this when reviewing, writing, or evaluating any public-facing output. Ensures outputs match the correct brand register, never conflate brands, and meet the voice standards defined in `docs/BRAND-GOVERNANCE.md`.

---

## When to Use

- Reviewing any copy or content before it is marked approved
- Writing copy for a specific brand where voice precision is critical
- Auditing an existing page or document for voice drift
- Checking whether a piece of content belongs to ViceLab, Cooked Pilot, or VibeGuard
- Resolving ambiguity when a task could belong to more than one brand

---

## Instructions

1. **Identify the brand.** Every task must be assigned to exactly one brand before output is produced. If unclear, ask.
2. **Load the brand voice.** Recall the voice spec from `BRAND-GOVERNANCE.md`:
   - ViceLab: technical precision + cultural fluency, non-judgemental, evidence-first
   - Cooked Pilot: playful precision, culinary-meets-psychedelic, cultured not pretentious
   - VibeGuard: operational, professional, tool-first, outcome-focused
3. **Check for register violations.** Identify any sentence, phrase, or word choice that could belong to a different brand.
4. **Check the prohibition list.** For ViceLab: no scare language, no moralising, no dosage as guidance, no encouragement to use.
5. **Produce or revise output.** Every output sentence should pass the test: "Could this appear in another brand's voice without modification?" If yes, it is too generic or cross-contaminated.

---

## Voice Quick Reference

| Brand | Test question |
|---|---|
| ViceLab | Does this read like precise, non-judgemental intelligence — not a warning, not a promotion? |
| Cooked Pilot | Does this feel like it belongs in a thoughtful, curious food and culture conversation? |
| VibeGuard | Does this sound like a professional tool for operators who need to act, not a brand speaking to consumers? |

---

## Output Format

For **reviews:**
```
## Brand Voice Review: [document or section name]
**Brand:** [assigned brand]
**Overall verdict:** [Pass / Needs revision]

### Violations found
| Line / section | Issue | Suggested fix |
|---|---|---|
| ... | ... | ... |

### Confirmed passes
- [What the content does well in voice terms]
```

For **original copy:**
Produce the copy directly, preceded by:
```
[CONTENT] — [Brand]: [ViceLab / Cooked Pilot / VibeGuard]
```

---

## Quality Check

Before accepting any copy output:
- [ ] Brand is explicitly named at the top
- [ ] No crossover language from another brand
- [ ] Harm reduction standard met (ViceLab only)
- [ ] No links to non-existent pages
- [ ] No prohibition framing (ViceLab only)
