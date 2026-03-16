# ASA New Entry Workflow

## Purpose
This file defines the standard workflow for creating new Altered State Archive (ASA) entries so the archive can scale consistently without breaking structure, naming, styling, or navigation.

---

## Core Files
The ASA system currently relies on:

- `_template.html`
- `asa-plate.css`
- `asa-plate.js`
- `asa-index.json` ← canonical data index (added v2)
- `archive.html`

All new entries must remain compatible with these files unless the system is intentionally refactored.

---

## Naming Convention

### Substance plates
`asa-{class}-{nn}-{name}.html`

Examples:
- `asa-em-01-mdma.html`
- `asa-st-02-cocaine.html`
- `asa-ps-01-lsd.html`

### Class plates
`asa-pl-{nn}-{class}.html`

Example:
- `asa-pl-02-stimulants.html`

### Class codes
- `em` = empathogen / entactogen
- `st` = stimulant
- `ps` = psychedelic
- `di` = dissociative
- `op` = opioid / depressant
- `ca` = cannabinoid

---

## Standard Workflow

### Step 1 — Choose class code and number
- Identify the correct class code
- Check existing files so numbering remains sequential within that class
- Confirm the final filename

Example:
- LSD → psychedelic → `ps` → `asa-ps-01-lsd.html`

### Step 2 — Duplicate the template
- Copy `_template.html`
- Rename the duplicate using the correct ASA naming convention

### Step 3 — Update metadata
Replace template placeholders with the new entry details:
- page title
- substance name
- class label
- plate ID
- subtitle / strapline
- breadcrumb path
- status tags (match `status` and `evidence_tier` values you'll set in the JSON)
- family tree block (substance plates only — omit for class plates)
- related plate links
- footer links if needed

### Step 4 — Fill the standard plate sections
Each substance plate should contain:

- substance name
- class identification
- simplified mechanism of action
- typical effects
- duration / pharmacokinetics overview
- key risk factors
- interaction considerations
- harm-reduction insights

Optional additions when relevant:
- onset profile
- after-effects
- adulteration / variability notes
- nightlife / festival context notes

### Step 5 — Preserve CSS / JS compatibility
- Reuse existing classes and layout patterns from `_template.html`
- Keep references to `asa-plate.css` and `asa-plate.js`
- Do not redesign the plate structure unless intentionally refactoring the system

### Step 6 — Add the entry to `asa-index.json`
This is the canonical step. `archive.html` renders cards from this file.

Add a new object to the array with all required fields:

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
  "archive_summary": "One-sentence summary for the archive card.",
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

For class plates, set `"plate_type": "class"`, `"substance_name": null`, and `"family_tree": null`.

Set `prev_plate` to the `id` of the plate before this one in archive order.
Set `next_plate` to the `id` of the plate after this one, or `null` if it's last.

**Also update** the previously last plate's `next_plate` field to point to the new entry's `id`.

### Step 7 — Set plate navigation links
Update the `.plate-nav` section in the new plate HTML:
- `prev` href: filename from the `prev_plate` entry in JSON (or `archive.html` if null)
- `next` href: filename from the `next_plate` entry in JSON (or `archive.html` if null)
- Sub-labels: `[ID] · [Title]` matching JSON `id` + `title` fields

Also update the previously last plate's `next` nav link to point to the new plate.

### Step 8 — Test the entry
Check that:
- the new file opens correctly
- archive card renders from JSON (and static fallback exists)
- breadcrumbs work
- status tags display correctly
- family tree block shows correct taxonomy (substance plates only)
- navigation ribbon links forward and back correctly
- related plate links work
- styling matches the existing ASA system
- all links remain relative-path compatible for GitHub Pages

---

## ASA New Entry Checklist

### Before creating
- [ ] Confirm class code
- [ ] Confirm next available number
- [ ] Confirm final filename slug

### Create file
- [ ] Duplicate `_template.html`
- [ ] Rename file correctly
- [ ] Update page title
- [ ] Update plate ID
- [ ] Update substance name and class label
- [ ] Update status tags (`.asa-tag.verified` / `.asa-tag.tier`)
- [ ] Fill family tree block with correct taxonomy (substance plates)
- [ ] Remove family tree block if this is a class plate

### Content
- [ ] Add simplified mechanism of action
- [ ] Add typical effects
- [ ] Add duration / pharmacokinetics overview
- [ ] Add key risk factors
- [ ] Add interaction considerations
- [ ] Add harm-reduction insights

### JSON + linking
- [ ] Add plate object to `asa-index.json`
- [ ] Set `prev_plate` and `next_plate` in JSON
- [ ] Update previous last plate's `next_plate` in JSON
- [ ] Update breadcrumbs in HTML
- [ ] Update nav ribbon prev/next links in HTML
- [ ] Update previously last plate's nav `next` link in HTML
- [ ] Update related plate links

### Compatibility
- [ ] Uses existing `asa-plate.css` classes
- [ ] Uses existing `asa-plate.js` hooks
- [ ] Uses relative links for GitHub Pages
- [ ] No absolute root paths introduced

### Final check
- [ ] Opens correctly in browser
- [ ] Matches archive visual style
- [ ] No dead links
- [ ] No placeholder text remains

---

## Reusable Prompt for New ASA Plates

Use the following prompt when generating a new archive plate:

### Prompt
Create a new Altered State Archive substance plate using the existing ASA template system.

Use:
- `_template.html` as the structural base
- `asa-plate.css` for styling compatibility
- `asa-plate.js` for runtime compatibility
- `asa-index.json` for the data index entry
- `archive.html` (cards render from JSON automatically)

Inputs

Substance name: [INSERT NAME]
Class: [INSERT CLASS]
Class code: [INSERT CODE]
Entry number: [INSERT NUMBER]
Filename: [INSERT FINAL FILENAME]
Mechanism of action: [INSERT SIMPLIFIED MOA]
Typical effects: [INSERT EFFECTS]
Duration / pharmacokinetics: [INSERT DURATION]
Key risks: [INSERT RISKS]
Interaction notes: [INSERT INTERACTIONS]
Harm-reduction insights: [INSERT HARM REDUCTION NOTES]
Chemical family: [INSERT CHEMICAL FAMILY]
Subclass or natural source: [INSERT SUBCLASS]
Functional class: [INSERT FUNCTIONAL CLASS]
Status: [verified / limited / emerging]
Evidence tier: [tier-1 / tier-2]
Prev plate ID: [INSERT PREV ID or null]
Next plate ID: [INSERT NEXT ID or null]

Requirements
1. Generate the full HTML file for the new plate
2. Generate the `asa-index.json` entry object for this plate
3. Preserve compatibility with the existing ASA template structure
4. Use relative internal paths suitable for GitHub Pages
5. Keep the tone educational, evidence-focused, and non-sensational
6. Do not redesign the plate system
7. Reuse existing classes and layout patterns wherever possible

Output
1. Final HTML file content
2. `asa-index.json` entry object
3. Nav link updates needed in the previously adjacent plate
4. Any related-plate link suggestions

---

## asa-index.json Entry Format

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

## Status and Evidence Tier Values

| field          | values                          | display tag        |
|----------------|---------------------------------|--------------------|
| `status`       | `verified`                      | `.asa-tag.verified` |
| `status`       | `limited`                       | `.asa-tag.limited`  |
| `status`       | `emerging`                      | `.asa-tag.emerging` |
| `evidence_tier`| `tier-1`                        | `.asa-tag.tier`     |
| `evidence_tier`| `tier-2`                        | `.asa-tag.tier`     |
