# Ecosystem Map

## Overview

The ViceLab ecosystem is a multi-brand, multi-product operation with a unified operational infrastructure. Three brands operate under it. Each has a distinct audience, positioning, and output type. Shared infrastructure includes: the Control Tower, the AI system, the content ops layer, and the prompt library.

---

## Brand Entities

### ViceLab
**Role:** Flagship media and intelligence brand
**Core product:** Altered State Archive (ASA)
**Audience:** Festival culture, harm reduction advocates, psychedelic community, nightlife
**Revenue model:** TBD — sponsorship, community, potentially paid intelligence tiers
**Current status:** Active publishing
**Site:** GitHub Pages static site
**Properties:**
- Altered State Archive — pharmacology plates
- Signal — harm reduction intelligence dispatches
- Dashboard — live data view (TBD)

---

### Cooked Pilot
**Role:** Creative culture brand — food, experience design, altered-state dining
**Core product:** TBD — editorial, events, experiential
**Audience:** Hospitality professionals, food-forward consumers, experience designers
**Revenue model:** Events, consultancy, editorial partnerships
**Current status:** Concept / early brand definition
**Site:** TBD

---

### VibeGuard
**Role:** B2B SaaS product — real-time safety intelligence for events
**Core product:** Event safety platform (dashboard, alerts, incident management)
**Audience:** Event organisers, venue operators, safety managers, HR/compliance
**Revenue model:** SaaS subscription, event licensing
**Current status:** Pre-launch / product design phase
**Site:** TBD

---

## Relationship Model

```
ViceLab (media/archive)
    ↕ Intelligence sharing (harm reduction research)
VibeGuard (event safety SaaS)
    ↔ Distinct commercial track, shared credibility signal

ViceLab (culture brand)
    ↕ Aesthetic and cultural overlap
Cooked Pilot (experience / food)
    ↔ Different audience segment, complementary positioning

VibeGuard ←→ Cooked Pilot
    No direct relationship
```

---

## Shared Infrastructure

| Layer | Shared by | Notes |
|---|---|---|
| Control Tower (this repo) | All three | Operational hub |
| Claude AI system | All three | Scoped per brand via CLAUDE.md rules |
| Prompt library | All three | Brand-tagged prompts in `ops/prompts/` |
| Decision log | All three | Single log, brand-tagged entries |
| Content ops system | ViceLab + Cooked Pilot | VibeGuard has separate product ops |

---

## Separation Enforcement

The three brands must never bleed into each other in public-facing outputs. The shared infrastructure is internal. To a reader, each brand should feel entirely independent.

**Failure modes to prevent:**
- Using ViceLab's harm reduction voice in VibeGuard marketing
- Applying Cooked Pilot's playful register to ASA plate content
- Letting VibeGuard's B2B tone contaminate ViceLab editorial
- Cross-linking brands publicly without deliberate strategic intent

---

## Ecosystem Status Summary

| Brand | Publishing | Product | Ops | Revenue |
|---|---|---|---|---|
| ViceLab | Active | ASA live | Active | Not yet |
| Cooked Pilot | Not started | Concept | Minimal | Not yet |
| VibeGuard | Not started | Design phase | Minimal | Not yet |
