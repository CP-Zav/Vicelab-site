# ASA Plate Creation Workflow
**Altered State Archive · ViceLab · 2026**

A repeatable process for generating new plate pages using `_template.html`
and the shared `asa-plate.css` / `asa-plate.js` system.

---

## 1 · System Reference

### 1.1 Class Codes and Colours

| Class Code | Class Name     | Hex       | RGB             | Accent Description |
|------------|---------------|-----------|-----------------|-------------------|
| `ST`       | Stimulant     | `#4DA3FF` | `77,163,255`    | Electric blue     |
| `PS`       | Psychedelic   | `#A78BFA` | `167,139,250`   | Violet            |
| `OP`       | Opioid        | `#F0A030` | `240,160,48`    | Amber             |
| `DS`       | Dissociative  | `#00FFC6` | `0,255,198`     | Teal              |
| `EM`       | Empathogen    | `#E43CFF` | `228,60,255`    | Magenta           |
| `CN`       | Cannabinoid   | `#7EE482` | `126,228,130`   | Soft green        |
| `EN`       | Entactogen    | `#A78BFA` | `167,139,250`   | Violet (shared)   |

### 1.2 Plate Types

| Plate Type       | Prefix | Covers                          | Example                       |
|-----------------|--------|---------------------------------|-------------------------------|
| Substance Plate | `[CC]` | Single substance                | `asa-em-01-mdma.html`         |
| Class Plate     | `pl`   | Full substance class overview   | `asa-pl-02-stimulants.html`   |
| Special Plate   | `sp`   | Cross-class or thematic content | `asa-sp-01-interactions.html` |

### 1.3 File Naming Convention

```
Substance:  asa-[classcode]-[nn]-[substanceslug].html
Class:      asa-pl-[nn]-[classslug].html
Special:    asa-sp-[nn]-[topicslug].html
```

- **`[classcode]`** — two-letter code from the table above (lowercase)
- **`[nn]`** — two-digit zero-padded number; sequential within the class
- **`[substanceslug]`** — lowercase, hyphenated, no special characters

**Examples:**
```
asa-em-01-mdma.html
asa-st-02-cocaine.html
asa-ps-01-lsd.html
asa-op-01-heroin.html
asa-pl-02-stimulants.html
```

### 1.4 Plate ID Format

```
ASA-[CLASSCODE]-[NN]        (substance or class)
```

The plate ID appears in: breadcrumb · `arc-plate-id` · `hr-panel-title-mark` ·
`research-sidebar-id` · plate strip · SVG watermark.

### 1.5 Breadcrumb Filter Slugs

Used in the breadcrumb `href="/archive?filter=[slug]"`:

```
stimulant · psychedelic · opioid · dissociative · empathogen · cannabinoid · entactogen
```

### 1.6 Current Plate Registry

| Plate ID    | File                          | Type      | Status         |
|-------------|-------------------------------|-----------|----------------|
| ASA-EM-01   | `asa-em-01-mdma.html`         | Substance | Canonical Lock |
| ASA-ST-02   | `asa-st-02-cocaine.html`      | Substance | Canonical Lock |
| ASA-PL-02   | `asa-pl-02-stimulants.html`   | Class     | Canonical Lock |
| ASA-PS-01   | `asa-ps-01-lsd.html`          | Substance | Canonical Lock |

> Update this table each time a plate is added.

---

## 2 · Five-Step Creation Process

### Step 1 — Choose Class Code and Plate Number

1. Identify the substance class. Use the Class Codes table (§1.1).
2. Check the Plate Registry (§1.6) for the next available number in that class.
3. Numbers are **per class**, not global. `asa-em-01` and `asa-ps-01` can coexist.
4. Decide plate type: Substance, Class, or Special.
5. Confirm the final file slug before creating anything.

### Step 2 — Duplicate `_template.html`

```bash
cp _template.html asa-[classcode]-[nn]-[slug].html
```

Do not modify `_template.html` itself. It is the canonical source of truth
for all future plates. If the template needs updating, version it — don't
patch it mid-production.

### Step 3 — Rename and Set Config Values

Open the new file and update the four CONFIG blocks at the top. These are the
only things that change between plates at the structural level.

| Config | Location | What to change |
|--------|----------|----------------|
| `①` Page title | `<title>` tag | `ASA-XX-00 · [Substance]` |
| `②` CSS colour tokens | `<style>` in `<head>` | All six `--cc-*` variables |
| `③` Particle colour | `data-cc-rgb` on `<html>` | RGB string matching `--cc` |
| `④` Floating tags | `data-plate-tags` on `<html>` | Comma-separated keyword list |

**CSS Token Formula** — replace `R,G,B` with the class colour values:

```css
:root {
  --cc:        #[HEX];
  --cc-dim:    rgba(R, G, B, 0.06);
  --cc-mid:    rgba(R, G, B, 0.13);
  --cc-border: rgba(R, G, B, 0.26);
  --cc-glow:   0 0 36px rgba(R,G,B,0.14), 0 0 80px rgba(R,G,B,0.06);
  --cc-pulse:  rgba(R, G, B, 0.28);
}
```

**Floating tag list** — 8–14 terms, comma-separated, no spaces around commas:

```html
data-plate-tags="ASA-PS-01,LSD,5-HT2A,PSYCHEDELIC,SEROTONIN,LYSERGAMIDE,HARM REDUCTION,VICELAB"
```

### Step 4 — Fill in Plate Sections

Work through the `<!-- SLOT: … -->` markers in the file, top to bottom.
Every slot must be replaced. No `[placeholder]` text should remain.

**Slot inventory:**

| Slot | Section | Notes |
|------|---------|-------|
| BREADCRUMB | ① Header | Update filter slug + current plate ID |
| PLATE ID | ① Header | `ASA-[CC]-[NN]` |
| SUBSTANCE TITLE | ① Header | First letter in `.arc-title-accent` only |
| SYSTEM STRIP | ① Header | Update CLASS name only; rest is fixed |
| PLATE SVG ART | ② Visual | Full replacement — see SVG Spec (§3.3) |
| PLATE STRIP LABEL | ② Visual | `[ID] · [Substance] · [Type] · ... · [Year]` |
| PLATE CAPTION | ② Visual | `Research-informed visual pharmacology plate. [Model] — [Description].` |
| METADATA TABLE | ③ Sci Record | All rows; see row order below |
| HR PANEL ID | ④ HR Notes | Update plate ID badge |
| HR NOTES GRID | ④ HR Notes | Min 4 paired notes + 1 full Wingmate note |
| SIDEBAR PLATE ID | ⑤ Context | Match plate ID |
| SIDEBAR METADATA | ⑤ Context | Update Type if Class Plate; rest fixed |
| RESEARCH BODY | ⑤ Context | Three paragraphs; see tone guide |
| RELATED PLATES | Related | 4 cards; see card spec (§5) |
| PREV / NEXT NAV | ⑥ Nav | Plate IDs and substance names |

**Metadata table row order:**
```
Class · Scientific Name · Common Names
[divider]
Primary Mechanism · [Secondary Mechanism — optional]
[divider]
Half-Life · Onset · Duration
[divider]
Primary Risks · Interactions
[divider]
Status (always: Verified · Canonical Lock · [year])
```

### Step 5 — Add the New Card to `archive.html`

See the Archive Card Spec in §5. Add the card to the correct class section
of the archive grid. Update any plate counts or index numbers if the archive
displays them.

---

## 3 · Plate Creation Checklist

Use this checklist for every new plate. Check off each item before marking
the plate as complete.

### Before creating
- [ ] Confirm class code
- [ ] Confirm next available number in that class
- [ ] Confirm final file slug

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
- [ ] Update breadcrumb links
- [ ] Update related plate links
- [ ] Add archive card entry
- [ ] Update archive counts if applicable

### Compatibility
- [ ] Keeps existing `asa-plate.css` classes
- [ ] Keeps existing `asa-plate.js` hooks
- [ ] Uses relative links compatible with GitHub Pages

### Final check
- [ ] Opens correctly in browser
- [ ] Matches archive visual style
- [ ] No dead links
- [ ] No placeholder text left behind

---

## 4 · Reusable Claude Prompt

Copy this prompt, fill in the bracketed fields, and paste into a new Claude session.
The session must have access to the repository so Claude can read `_template.html`,
`asa-plate.css`, and existing plate files before writing anything.

---

```
Create a new Altered State Archive substance plate using the existing ASA template system.

Use:
- _template.html as the structural base
- asa-plate.css for styling compatibility
- asa-plate.js for runtime compatibility
- archive.html for archive card insertion

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
3. Archive card snippet for archive.html
4. Any related-plate link suggestions
```

---

### Prompt Usage Notes

- Always read `_template.html`, `asa-plate.css`, and at least one existing plate
  (e.g. `asa-em-01-mdma.html`) before generating, so Claude has the full system
  context rather than reconstructing it from memory.
- The richer the inputs (especially mechanism of action and harm reduction notes),
  the higher-quality the generated content. Thin inputs produce generic output.
- If the SVG visual concept is not specified in the inputs, prompt Claude to
  propose a mechanistic model before generating — then confirm or redirect it.

---

## 5 · Archive Card Snippet Format

Each plate needs one card entry in `archive.html`. Add the card to the correct
class section of the archive grid.

### Card HTML Template

```html
<a href="asa-[cc]-[nn]-[slug].html" class="plate-card [cc] reveal">
  <div class="plate-card-head">
    <span class="plate-id">ASA-[CC]-[NN]</span>
    <span class="plate-class">[Class Name]</span>
  </div>
  <h3>[Substance Name]</h3>
  <p>[One-sentence archive summary for the substance plate.]</p>
</a>
```

### Field Reference

| Field | Format | Example |
|-------|--------|---------|
| `href` | `asa-[cc]-[nn]-[slug].html` | `asa-ps-01-lsd.html` |
| `.plate-card` class | `plate-card [cc] reveal` | `plate-card ps reveal` |
| `[cc]` modifier | Lowercase class code | `ps`, `st`, `em`, `op` |
| `.plate-id` | Plate ID, uppercase | `ASA-PS-01` |
| `.plate-class` | Class name, proper case | `Psychedelic` |
| `<h3>` | Substance name | `LSD` |
| `<p>` | One-sentence summary | Archive summary sentence |

### Class Modifier Reference

The class modifier on `.plate-card` applies the correct accent colour from `archive.html`'s
own CSS rules (distinct from the `data-accent` values used on individual plate pages).

| Class | Modifier | Example class string |
|-------|----------|---------------------|
| Stimulant | `st` | `plate-card st reveal` |
| Psychedelic | `ps` | `plate-card ps reveal` |
| Opioid | `op` | `plate-card op reveal` |
| Dissociative | `ds` | `plate-card ds reveal` |
| Empathogen | `em` | `plate-card em reveal` |
| Cannabinoid | `cn` | `plate-card cn reveal` |

### Summary Sentence Guide

The `<p>` summary should be one sentence, 15–25 words. It must:
- Name the primary mechanism or the defining pharmacological fact
- Be written in plain, accessible language
- Not duplicate the `<h3>` substance name

**Examples:**
```
LSD — "Classic serotonergic psychedelic with long duration, perceptual
alteration, and context-sensitive psychological risk."

MDMA — "Triple monoamine efflux agent producing empathogenic and prosocial
effects via SERT-mediated serotonin release."

Cocaine — "Monoamine reuptake inhibitor blocking DAT, NET, and SERT,
with significant cardiovascular risk at festival doses."
```

### Worked Example — ASA-PS-01 · LSD

```html
<a href="asa-ps-01-lsd.html" class="plate-card ps reveal">
  <div class="plate-card-head">
    <span class="plate-id">ASA-PS-01</span>
    <span class="plate-class">Psychedelic</span>
  </div>
  <h3>LSD</h3>
  <p>Classic serotonergic psychedelic with long duration, perceptual alteration, and context-sensitive psychological risk.</p>
</a>
```

### Related-Plate Cards (on individual plate pages)

When linking to the new plate from the `related-grid` of other plate pages,
use the `rel-card` component (different from the archive `plate-card`):

```html
<a href="/archive/plates/asa-[cc]-[nn]" class="rel-card" data-accent="[accentslug]">
  <div class="rel-thumb">
    <svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="200" fill="#04060D"/>
      <!-- 2–4 simplified visual elements from the full plate SVG -->
      <text x="8" y="193" font-family="IBM Plex Mono,monospace" font-size="5.5"
        fill="[#CLASSHEX]" fill-opacity="0.30" letter-spacing="1.5">
        [PLATEID] · [SUBSTANCE IN CAPS]
      </text>
    </svg>
  </div>
  <div class="rel-body">
    <div class="rel-id">[PLATE ID]</div>
    <div class="rel-title">[Substance Name]</div>
    <div class="rel-class">[Plate Type] <span class="rel-arrow">→</span></div>
  </div>
</a>
```

`data-accent` values for `rel-card`: `stimulant` · `psychedelic` · `opioid` ·
`dissociative` · `empathogen` · `cannabinoid` · `entactogen`

---

## 6 · Compatibility Notes

### asa-plate.css

- Do not override any selector defined in `asa-plate.css` in per-plate `<style>` blocks.
- The only per-plate CSS is the six `--cc-*` custom properties in `:root`.
- If a plate genuinely needs a new CSS rule, discuss adding it to `asa-plate.css`
  with a version comment rather than adding per-plate overrides.
- The READABILITY FLOOR block at the end of `asa-plate.css` applies `max(0.75rem, 1em)`
  to key text selectors. Do not fight this with per-plate overrides.

### asa-plate.js

- The script reads `data-cc-rgb` and `data-plate-tags` from `<html>` on load.
- Both attributes must be present. If `data-plate-tags` is missing, the floating
  tag layer renders a generic fallback — not a failure, but not useful.
- The starfield canvas `id="c-field"` and tag layer `id="tag-layer"` must be present
  in the body exactly as templated. Do not rename or duplicate.
- Scroll reveal requires `.reveal` and `.reveal-stagger` classes on the correct
  elements. All section-level reveal hooks are already in `_template.html`.

### Static Deployment

- All `href` and `src` attributes use root-relative paths (`/archive`, `/dashboard`).
- No server-side rendering or build step required.
- The font stack (Syne, IBM Plex Mono, Instrument Sans) loads from Google Fonts.
  For offline or air-gapped environments, self-host the fonts and update the `<link>`.

---

*ASA-PLATE-WORKFLOW.md · ViceLab Research Division · 2026*
