# ASA New Entry Workflow

## Purpose
This file defines the standard workflow for creating new Altered State Archive (ASA) entries so the archive can scale consistently without breaking structure, naming, styling, or navigation.

---

## Core Files
The ASA system currently relies on:

- `_template.html`
- `asa-plate.css`
- `asa-plate.js`
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

### Step 6 — Add the new entry to `archive.html`
- Add a new plate card block in the relevant archive section
- Use the correct class code on the card
- Update visible counts if the archive page displays totals

### Step 7 — Test the entry
Check that:
- the new file opens correctly
- archive card links to the new plate
- breadcrumbs work
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

### Content
- [ ] Add simplified mechanism of action
- [ ] Add typical effects
- [ ] Add duration / pharmacokinetics overview
- [ ] Add key risk factors
- [ ] Add interaction considerations
- [ ] Add harm-reduction insights

### Linking
- [ ] Update breadcrumbs
- [ ] Update related plate links
- [ ] Add archive card entry
- [ ] Update archive counts if used

### Compatibility
- [ ] Uses existing `asa-plate.css` classes
- [ ] Uses existing `asa-plate.js` hooks
- [ ] Uses relative links for GitHub Pages

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
- `archive.html` for archive card insertion

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

Requirements
1. Generate the full HTML file for the new plate
2. Preserve compatibility with the existing ASA template structure
3. Use relative internal paths suitable for GitHub Pages
4. Keep the tone educational, evidence-focused, and non-sensational
5. Do not redesign the plate system
6. Reuse existing classes and layout patterns wherever possible

Output
1. Final HTML file content
2. Suggested page title
3. Archive card snippet for `archive.html`
4. Any related-plate link suggestions

---

## archive.html Card Snippet Format

```html
<a href="asa-xx-00-name.html" class="plate-card xx reveal">
  <div class="plate-card-head">
    <span class="plate-id">ASA-XX-00</span>
    <span class="plate-class">Class Name</span>
  </div>
  <h3>Substance Name</h3>
  <p>One-sentence archive summary for the substance plate.</p>
</a>