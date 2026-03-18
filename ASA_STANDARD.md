# ASA Standard — Canonical Lock

**This file is the single source of truth for ASA plate structure and rules.**
Do not deviate from it. If a new plate diverges from this standard, it must be corrected before publishing.

---

## Filename Convention

| Type | Pattern | Example |
|---|---|---|
| Substance plate | `asa-[class]-[nn]-[name].html` | `asa-st-02-cocaine.html` |
| Class plate | `asa-pl-[nn]-[class].html` | `asa-pl-02-stimulants.html` |

- Class codes: `em` empathogen · `st` stimulant · `ps` psychedelic · `ds` dissociative · `op` opioid · `ca` cannabinoid
- `[nn]` is zero-padded and sequential within its class
- All lowercase, hyphens only, no spaces

---

## Mandatory Page Structure

The following sections must appear in this exact order. No additions. No reordering.

1. `arc-header` — breadcrumb, plate label, plate ID, h1, system strip, status tags
2. `plate-display-section` — SVG diagram, plate strip, caption
3. `sci-meta-section` — family tree (substance plates only), metadata table
4. `hr-section` — minimum 4 paired notes + Wingmate Protocol (`.hr-note.full`, always last)
5. `research-section` — sidebar metadata + 3-paragraph body
6. `related-section` — always exactly 4 × `.rel-card`
7. `plate-nav` — prev link, back-to-archive, next link
8. `<footer>` — footer-brand + footer-sys + footer-links
9. `<script src="asa-plate.js"></script>`

This order is non-negotiable.

---

## Navigation Rules

- All hrefs must use relative paths
- No leading-slash absolute URLs (e.g. `/archive.html` is wrong)
- Home → `index.html`
- Archive → `archive.html`
- Plate links → `asa-[class]-[nn]-[name].html`

---

## Breadcrumb Rule

```html
<a href="archive.html">Archive</a>
<span class="breadcrumb-sep">/</span>
<a href="archive.html">[Class plural]</a>
<span class="breadcrumb-sep">/</span>
<span class="breadcrumb-current">[Plate ID]</span>
```

- Both links point to `archive.html` — no class filtering or routing logic
- Class label is the plural form: Stimulants, Empathogens, Dissociatives, Psychedelics, Opioids, Cannabinoids
- Current segment is the plate ID only (e.g. `ASA-ST-02`), never the substance name

---

## Related Plate Rules

- Always exactly 4 `.rel-card` blocks
- `data-accent` must match the **linked plate's** class — not the current plate
- Use `archive.html` as `href` for any plate that is not yet published
- Plate ID displayed in `.rel-id` and SVG watermark must match the actual ID in `asa-index.json`

Accent values: `stimulant` · `empathogen` · `dissociative` · `psychedelic` · `opioid` · `cannabinoid`

---

## Archive Update Rule

When a new plate is published:

- Add an entry to `asa-index.json` (canonical source — archive hub renders from this)
- Add a static fallback card to `archive.html` (no-JS fallback)
- Update the hardcoded stat numbers in `archive.html` (plates, substances, class plates, classes)
- Update `prev_plate` / `next_plate` in `asa-index.json` for adjacent plates
- Update the plate nav links in adjacent plate HTML files
- Replace any `archive.html` placeholder links in existing plates that reference the new plate

---

## Shared Assets Rule

Every plate must include, in the `<head>`:

```html
<link rel="stylesheet" href="asa-plate.css">
```

And at the end of `<body>`, before `</body>`:

```html
<script src="asa-plate.js"></script>
```

The `<style>` block in `<head>` must contain **only** the six `--cc-*` accent token overrides. Nothing else.

- No inline CSS beyond the six accent tokens
- No inline JavaScript of any kind
- No duplication of asa-plate.css rules

---

## GitHub Pages Compatibility

- Static HTML only
- No server-side logic, no build step, no framework routing
- No root-absolute paths — all hrefs and src values must be relative
- All assets (CSS, JS, fonts) must be resolvable from the file's directory or an external CDN
- Deployable by `git push` with no pre-processing

---

## QA Checklist (Pre-Publish)

Run through this before setting `"published": true` in `asa-index.json`.

- [ ] Filename matches `asa-[class]-[nn]-[name].html` convention
- [ ] Entry added to `asa-index.json` with correct `prev_plate` / `next_plate`
- [ ] Static fallback card added to `archive.html`
- [ ] Archive stats updated in `archive.html`
- [ ] Plate nav links work (prev → previous plate, next → next or archive)
- [ ] Adjacent plate's nav updated to point to this plate
- [ ] Breadcrumbs correct (both links → `archive.html`)
- [ ] All 4 related cards present; published plates link to file, not `archive.html`
- [ ] `data-accent` on each related card matches the linked plate's class
- [ ] No absolute paths anywhere
- [ ] `<link rel="stylesheet" href="asa-plate.css">` present
- [ ] `<script src="asa-plate.js"></script>` at end of body
- [ ] No inline CSS beyond the six `--cc-*` tokens
- [ ] No inline JavaScript
- [ ] Page renders correctly in browser

---

## Reference Files

| File | Purpose |
|---|---|
| `_template.html` | Base for every new plate — copy, do not modify |
| `asa-plate.css` | Shared layout and components |
| `asa-plate.js` | Starfield, floating tags, scroll reveal |
| `asa-index.json` | Canonical data — archive hub renders from this |
| `archive.html` | Archive hub with JSON rendering + static fallback |
| `ASA_NEW_ENTRY.md` | Step-by-step workflow for adding a new plate |
