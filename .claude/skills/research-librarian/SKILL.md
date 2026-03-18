# Skill: Research Librarian

## Identity
`research-librarian`

## Purpose
Research synthesis and archive intelligence skill. Use this when a task requires locating, organising, or synthesising pharmacological, cultural, or strategic information — either for a new ASA plate or for any intelligence output that requires evidence grounding.

---

## When to Use

- Pre-production research for a new ASA plate
- Synthesising pharmacological data into the ASA metadata schema
- Answering "what do we know about X mechanism/substance/class" questions
- Cross-checking existing plate content for accuracy
- Identifying knowledge gaps or inconsistencies in the archive
- Classifying a new substance by family, mechanism, and risk profile

---

## Instructions

### For ASA Plate Research

Work through the following in order:

**1. Substance classification**
- Chemical family (e.g. Phenethylamine, Tryptamine, Arylcyclohexylamine)
- Subclass or structural variant (e.g. Substituted Amphetamine, Ergoline)
- Pharmacological class (e.g. Stimulant, Dissociative, Psychedelic)
- Functional class (e.g. NMDA Antagonist, 5-HT2A Agonist, DAT Inhibitor)

**2. Primary mechanism**
- Identify the primary receptor or transporter target
- Describe the molecular action: inhibition / agonism / antagonism / reversal / modulation
- Note whether the action is competitive, non-competitive, use-dependent, etc.
- Identify which downstream neurotransmitters are primarily affected

**3. Secondary mechanisms**
- Additional receptor targets with meaningful contribution to effect profile
- Metabolic pathways if clinically relevant

**4. Pharmacokinetics**
- Half-life by route (oral, intranasal, IM, IV if relevant)
- Onset by route
- Duration by route
- Note if there is high inter-individual variability

**5. Risk profile**
- Primary lethal/critical risks (alert tier)
- Significant non-lethal risks (warn tier)
- Chronic use risks (if documented)
- Interaction risks — list by severity, name the mechanism for each

**6. Evidence tier assessment**
- `tier-1`: Strong clinical evidence, multiple peer-reviewed studies, clear consensus
- `tier-2`: Mixed evidence — some clinical data but gaps, conflicting studies, or limited sample sizes
- `tier-3`: Emerging — case reports, pre-clinical data only, or very recent research without replication

**7. Harm reduction landscape**
- What are the field-specific risks (festival, nightlife, home use)?
- What information do people in those environments most need?
- What does the Wingmate Protocol look like for this substance specifically?

---

## Output Format

```
[ANALYSIS] — Research Brief: [Substance Name]

## Classification
- Chemical Family: ...
- Pharmacological Class: ...
- Functional Class: ...

## Primary Mechanism
...

## Secondary Mechanisms
...

## Pharmacokinetics
| Route | Onset | Peak | Duration | Half-life |
|---|---|---|---|---|
| ... | ... | ... | ... | ... |

## Risk Profile
**Critical:**
- ...

**Significant:**
- ...

**Chronic:**
- ...

**Interactions:**
| Substance / Class | Risk Level | Mechanism |
|---|---|---|
| ... | ... | ... |

## Evidence Tier
**Tier:** [1 / 2 / 3]
**Rationale:** ...

## Harm Reduction Priorities
1. ...
2. ...
```

---

## Quality Check

Before using research output in a plate:
- [ ] Primary mechanism is stated at receptor/transporter level, not just effect level
- [ ] Pharmacokinetics have route-specific ranges, not single values
- [ ] Risk interactions include mechanism explanation
- [ ] Evidence tier has a rationale, not just a label
- [ ] Nothing in the research output could be read as dosage guidance or encouragement to use
