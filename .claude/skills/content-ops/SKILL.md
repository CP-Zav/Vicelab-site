# Skill: Content Ops

## Identity
`content-ops`

## Purpose
Content production and workflow skill. Use this when creating, editing, or managing content assets — from ASA plate copy to Signal dispatches. Enforces the content workflow defined in `docs/CONTENT-OPS-SYSTEM.md` and the brand rules in `docs/BRAND-GOVERNANCE.md`.

---

## When to Use

- Writing or editing any ASA plate section (metadata, harm reduction notes, research context)
- Producing a Signal dispatch
- Creating a Field Note
- Generating a content brief for any brand
- Auditing existing content against quality standards
- Populating an `ops/templates/` file with real content

---

## Instructions

### For ASA Plate Content

Follow this section order and these standards for each:

**1. Metadata table**
- Class name and chemical tags must be accurate
- Scientific name: IUPAC or accepted systematic name
- Common names: list all widely used street/informal names
- Primary mechanism: state the receptor/transporter interaction precisely — not "affects serotonin", but "triggers reverse transport via SERT, driving efflux"
- Secondary effects: real, documented secondary mechanisms only
- Half-life, onset, duration: sourced ranges, not single figures
- Primary risks: use `.tag.alert` for lethal/critical risks; `.tag.warn` for significant but non-lethal
- Interactions: flag the most dangerous first; explain *why* each interaction is dangerous (mechanism, not just "avoid")

**2. Harm reduction notes**
- Minimum 5 notes + Wingmate Protocol
- Each note: one specific, actionable concept — not a list of rules
- No dosage guidance as instruction
- No scare language
- Operational framing: "what to do in the environment where this substance is encountered"
- Wingmate Protocol must be the final note, marked `.hr-note.full`

**3. Research context**
- 3 paragraphs
- Para 1: Why this substance belongs in this archive; its cultural/public health significance
- Para 2: The epistemic context — what is known, what is contested, what the archive's position is
- Para 3: Why this specific plate visual was chosen; what the mechanism model shows

### For Signal Dispatches (TBD format)
- Define: what event or development prompted this
- Define: what the harm reduction or intelligence implication is
- Tone: ViceLab voice — precise, non-judgemental, field-operational

---

## Output Format

Declare content type at the top of every output:
```
[CONTENT] — ASA-[ID] · [Substance] — [Section name]
```

For multi-section outputs, use a heading per section. No wall-of-text.

---

## Quality Check

Before accepting content as complete:
- [ ] Scientific claims are accurate and not overstated
- [ ] No dosage as guidance
- [ ] No scare language or prohibition framing
- [ ] Harm reduction notes are operationally useful, not just informational
- [ ] Research context explains the *why* — not just the what
- [ ] ViceLab voice throughout (see `docs/BRAND-GOVERNANCE.md`)
- [ ] Wingmate Protocol included in harm reduction section
