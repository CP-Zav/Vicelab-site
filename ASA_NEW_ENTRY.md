# ASA New Entry Workflow

## Purpose
Defines the exact workflow for adding a new plate to the Altered State Archive. Follow every step in order. Do not skip steps.

---

## Core Files

| File | Role |
|---|---|
| `_template.html` | Canonical base — copy for every new plate |
| `asa-plate.css` | Shared layout and component styles |
| `asa-plate.js` | Starfield, floating tags, scroll reveal |
| `asa-index.json` | Canonical data index — archive hub renders from this |
| `archive.html` | Archive hub — cards rendered from JSON with static fallback |

All new plates must use these files. Do not inline the CSS or duplicate the JS.

---

## Naming Convention

### Substance plates
`asa-[class]-[nn]-[name].html`

| Part | Rule |
|---|---|
| `[class]` | Two-letter class code (see table below) |
| `[nn]` | Zero-padded sequential number within that class — `01`, `02`, etc. |
| `[name]` | Lowercase substance name, hyphens for spaces |

Examples:
- `asa-em-01-mdma.html`
- `asa-st-02-cocaine.html`
- `asa-ps-01-lsd.html`

### Class plates
`asa-pl-[nn]-[class].html`

Examples:
- `asa-pl-02-stimulants.html`
- `asa-pl-04-dissociatives.html`

### Class codes

| Code | Class |
|---|---|
| `em` | Empathogen / Entactogen |
| `st` | Stimulant |
| `ps` | Psychedelic |
| `ds` | Dissociative |
| `op` | Opioid / Depressant |
| `ca` | Cannabinoid |

---

## Standard Workflow

### Step 1 — Confirm filename
- Identify the correct class code
- Check existing files to find the next sequential number
- Confirm the final filename before creating anything

Example: LSD → psychedelic → `ps` → next available → `asa-ps-01-lsd.html`

### Step 2 — Duplicate the template
- Copy `_template.html`
- Rename using the confirmed filename

Do not rename without the class prefix. `asa-lsd.html` is wrong. `asa-ps-01-lsd.html` is correct.

### Step 3 — Set the four config values

In the new file, update these four things first before touching any content:

| Config | Location | What to change |
|---|---|---|
| `data-cc-rgb` | `<html>` attribute | R,G,B of the class colour |
| `data-plate-tags` | `<html>` attribute | Plate ID + substance terms + class + HARM REDUCTION,VICELAB,ASA |
| Page title | `<title>` tag | `ASA-XX-00 · [Substance] — Altered State Archive · ViceLab` |
| Accent tokens | `<style>` block | Six `--cc-*` CSS variables for the class colour |

Class colour reference:

| Class | Hex | RGB |
|---|---|---|
| Stimulants | `#4DA3FF` | `77,163,255` |
| Empathogens | `#E43CFF` | `228,60,255` |
| Dissociatives | `#00FFC6` | `0,255,198` |
| Psychedelics | `#A78BFA` | `167,139,250` |
| Opioids / Depressants | `#F0A030` | `240,160,48` |
| Cannabinoids | `#7EE482` | `126,228,130` |

### Step 4 — Fill the plate header section (`.arc-header`)

Replace all `<!-- SLOT: … -->` placeholders in this order:

1. **Breadcrumb** — `Archive / [Class plural] / [Plate ID]`
   - Both Archive and Class links point to `archive.html` (no filter routing)
   - Class label: plural form (Stimulants, Empathogens, Dissociatives, etc.)
   - Current: plate ID only (e.g. `ASA-ST-02`)

2. **Plate ID** — the `ASA-XX-00` format ID in `.arc-plate-id`

3. **Substance title** — `<h1>` in `.arc-title`; wrap only the first letter in `.arc-title-accent`

4. **System strip** — update CLASS name only; keep STATUS "Verified" (or "Emerging Research"), EDITION "Canonical Lock", RELEASE year, SOURCE fixed

5. **Status tags** — match `status` and `evidence_tier` values from the JSON entry you'll create in Step 6

### Step 5 — Fill the plate content sections

Complete each section in template order. Do not reorder sections.

| Section | Class | Content |
|---|---|---|
| Plate display | `.plate-display-section` | SVG diagram + plate strip label + caption |
| Scientific metadata | `.sci-meta-section` | Family tree (substance plates only) + metadata table |
| Harm reduction | `.hr-section` | Min 4 paired notes + Wingmate Protocol (full-width) |
| Research context | `.research-section` | Sidebar metadata + 3-paragraph body text |
| Related plates | `.related-section` | 4 × `.rel-card` blocks |
| Plate navigation | `.plate-nav` | Prev / back / next links |

**Section rules:**
- Scientific name: IUPAC or accepted systematic name
- Common names: dot-separated `·`
- Primary risks: use `.tag.alert` for critical (lethal/severe), `.tag.warn` for significant
- Interactions: lead with the most dangerous; explain the mechanism
- Harm reduction notes: evidence-first, no dosage as instruction, no scare language, no moralising
- Wingmate Protocol: always the last note, always `.hr-note.full`
- Status in metadata table: `<strong>[status]</strong> · Canonical Lock · [year]`
- Family tree: substance plates only — omit the block entirely for class plates

**SVG conventions:**
- `viewBox="0 0 900 675"` always
- Coord labels: A1–F1 columns, A2–A6 rows
- Classification marks: top-right, `SUBSTANCE PLATE` / `CLASS PLATE` + `[ID] · [CLASS]`
- Watermark: bottom-left, `[ID] · [SUBSTANCE] · [CLASS] · ALTERED STATE ARCHIVE · VICELAB RESEARCH INTELLIGENCE · CANONICAL LOCK · 2026`
- Vignette always last element

### Step 6 — Add the entry to `asa-index.json`

This is the canonical step. Do this before testing the archive page.

```json
{
  "id": "ASA-XX-00",
  "title": "Substance Name",
  "slug": "asa-xx-00-name",
  "filename": "asa-xx-00-name.html",
  "plate_type": "substance",
  "substance_name": "Substance Name",
  "class_name": "Class Name",
  "category": "xx",
  "status": "verified",
  "evidence_tier": "tier-1",
  "archive_summary": "One-sentence summary for archive card.",
  "tags": ["TAG1", "TAG2", "TAG3"],
  "family_tree": {
    "Chemical Family": "...",
    "Subclass": "...",
    "Functional Class": "...",
    "Substance": "Substance Name"
  },
  "published": true,
  "prev_plate": "ASA-XX-prev",
  "next_plate": null
}
```

For class plates: `"plate_type": "class"`, `"substance_name": null`, `"family_tree": null`.

**Also update** the previously last plate's `next_plate` field in `asa-index.json` to point to the new ID.

### Step 7 — Set plate navigation links

Update the `.plate-nav` section in the new plate HTML:

| Link | `href` | Label |
|---|---|---|
| `prev` | Previous plate filename, or `archive.html` if first | `Previous Plate` with sub-label `[ID] · [Title]`, or `Back to Archive` |
| Back | Always `archive.html` | `Back to Archive` |
| `next` | Next plate filename, or `archive.html` if last | `Next Plate` with sub-label `[ID] · [Title]`, or `Archive Index` |

Also update the previously last plate's `next` nav link to point to the new plate.

### Step 8 — Set related plate links

4 cards always. Rules:

- Link to the actual filename if the plate is published
- Link to `archive.html` if the plate is not yet published
- `data-accent` must match the class of the plate being linked, not the current plate
- Use the correct published plate ID (e.g. `ASA-EM-01` not `ASA-PL-01`)

Accent values: `stimulant` · `empathogen` · `dissociative` · `psychedelic` · `opioid` · `cannabinoid`

### Step 9 — Test before marking published

Run the QA checklist below before setting `"published": true` in `asa-index.json`.

---

## QA Checklist

### Filename and structure
- [ ] Filename follows `asa-[class]-[nn]-[name].html` pattern
- [ ] File uses `<link rel="stylesheet" href="asa-plate.css">` — no inline CSS
- [ ] File ends with `<script src="asa-plate.js"></script>` — no inline JS
- [ ] `data-cc-rgb` matches the class colour RGB
- [ ] `data-plate-tags` is set on `<html>`

### Archive integration
- [ ] `asa-index.json` entry added with all required fields
- [ ] `prev_plate` and `next_plate` set correctly in JSON
- [ ] Previously adjacent plate's `next_plate` updated in JSON
- [ ] Archive card renders correctly from JSON (open `archive.html`)
- [ ] Static HTML fallback card present in `archive.html`

### Navigation
- [ ] Breadcrumb renders `Archive / [Class] / [Plate ID]`
- [ ] Breadcrumb links work (both point to `archive.html`)
- [ ] `plate-nav` prev link works
- [ ] `plate-nav` next link works
- [ ] `plate-nav-back` links to `archive.html`
- [ ] Previously adjacent plate's nav link updated and working

### Content
- [ ] All `<!-- SLOT: … -->` placeholders replaced
- [ ] No placeholder text (`[Substance]`, `ASA-XX-00`, etc.) remaining
- [ ] Status tags match JSON `status` and `evidence_tier` fields
- [ ] Status row in metadata table: `<strong>[status]</strong> · Canonical Lock · [year]`
- [ ] Family tree present for substance plates; absent for class plates
- [ ] Wingmate Protocol is the final harm reduction note, marked `.hr-note.full`

### Related plates
- [ ] All 4 related cards present
- [ ] `data-accent` on each card matches the linked plate's class
- [ ] Published plates link to their filename, not `archive.html`
- [ ] Plate IDs in rel-body match the SVG watermark text

### Compatibility
- [ ] All links are relative — no `/` root-absolute paths
- [ ] No links to non-existent files
- [ ] Opens and renders correctly at `localhost` or GitHub Pages
- [ ] Matches the visual style of existing plates

---

## Status and Evidence Tier Values

| Field | Values | HTML class |
|---|---|---|
| `status` | `verified` | `.asa-tag.verified` |
| `status` | `limited` | `.asa-tag.limited` |
| `status` | `emerging` | `.asa-tag.emerging` |
| `evidence_tier` | `tier-1` | `.asa-tag.tier` — shows `Evidence · Tier 1` |
| `evidence_tier` | `tier-2` | `.asa-tag.tier` — shows `Evidence · Tier 2` |

---

## Archive Order

Current published plates (archive sequence):

| Order | ID | File | Chain |
|---|---|---|---|
| 1 | ASA-EM-01 | `asa-em-01-mdma.html` | prev: archive · next: ASA-ST-02 |
| 2 | ASA-ST-02 | `asa-st-02-cocaine.html` | prev: ASA-EM-01 · next: ASA-DS-01 |
| 3 | ASA-DS-01 | `asa-ds-01-ketamine.html` | prev: ASA-ST-02 · next: ASA-PL-02 |
| 4 | ASA-PL-02 | `asa-pl-02-stimulants.html` | prev: ASA-DS-01 · next: archive |

When adding a new plate, append to the end of this table and update the last plate's `next` links.

---

## Reusable Prompt for New ASA Plates

Use this prompt to generate a new plate via Claude:

```
Create a new Altered State Archive plate using the ASA template system.

Base files:
- _template.html (structural base)
- asa-plate.css (styling)
- asa-plate.js (runtime)
- asa-index.json (data entry)
- archive.html (hub — cards render from JSON)

Inputs:
Substance name: [NAME]
Class: [CLASS]
Class code: [CODE]
Entry number: [NN]
Filename: [FILENAME]
Primary mechanism: [MOA — receptor/transporter level]
Secondary mechanisms: [if applicable]
Half-life: [by route]
Onset: [by route]
Duration: [by route]
Primary risks (critical): [alert tier]
Primary risks (significant): [warn tier]
Interactions: [with mechanism]
Common names: [dot-separated]
Scientific name: [IUPAC]
Chemical family: [FAMILY]
Subclass or natural source: [SUBCLASS]
Functional class: [FUNCTIONAL CLASS]
Status: [verified / limited / emerging]
Evidence tier: [tier-1 / tier-2]
Prev plate ID: [ID or null]
Next plate ID: [ID or null]

Requirements:
1. Produce the full HTML file
2. Produce the asa-index.json entry object
3. List nav link updates required in the adjacent plate
4. Suggest 4 related plate cards
5. Use relative paths throughout (GitHub Pages compatible)
6. Follow the harm reduction standard: evidence-first, non-judgemental, no dosage as guidance
7. Do not redesign the plate system
```
