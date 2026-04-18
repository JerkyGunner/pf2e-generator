# PF2E Character Generator

A browser-based Pathfinder 2e random character generator that pulls its data from published Google Sheets CSV tabs.

This project is designed to generate:

- Ancestry
- Heritage
- Background
- Region
- Class
- Key Ability
- Subclasses
- Archetype

It also includes filters for rarity, source, Society access, archetypes, and regions, plus lock buttons so you can keep parts of a character while rerolling the rest.

## What This Project Uses

This is a simple static web app:

- `index.html` contains the page structure
- `style.css` contains the visual styling
- `script.js` contains all generator logic

The app does not need a backend or database. It reads published CSV data directly from Google Sheets.

## Running It Locally

Do not open `index.html` by double-clicking it, because browsers can block the Google Sheets requests when the page is loaded as a `file://` URL.

Instead, run it through a tiny local web server.

### Easiest option

Double-click:

- [Start Local Site.bat](C:\Users\mthak\Desktop\pf2e-generator\Start%20Local%20Site.bat)

That starts a local server and opens the site in your browser.

### Manual option with Python

```powershell
cd C:\Users\mthak\Desktop\pf2e-generator
python -m http.server 8000
```

Then open:

- [http://localhost:8000](http://localhost:8000)

## Hosting

This project can be hosted as a static site because it only needs HTML, CSS, and JavaScript.

Good hosting options:

- GitHub Pages
- Cloudflare Pages

## Data Source Tabs

The generator currently expects data from these published Google Sheets tabs:

- `Ancestries`
- `Heritages`
- `Backgrounds`
- `Regions`
- `Classes`
- `Subclasses`
- `Archetypes`
- `Sources`

The app fetches each tab as CSV when the page loads.

## Main Generator Features

### Rarity filtering

Users can limit what rarities are allowed:

- `Common Only`
- `Common and Uncommon Only`
- `All Rarities`

### Rarity weighting

If more than one rarity is allowed, users can choose how strongly common options are favored:

- `Common Favored`
- `Balanced`
- `Pure Random`

The weighting affects:

- ancestries
- heritages
- backgrounds
- classes
- subclasses
- archetypes

### Society access filtering

Users can choose whether to:

- hide both `Society Limited` and `Society Restricted`
- hide only `Society Restricted`
- include everything

Special rule:

- if any active source belongs to `Adventure Path` or `Adventure Module`, the app ignores Society access restrictions and allows those entries

### Source selection

Users can limit what books and products the generator is allowed to use.

There are presets for:

- `Core Only`
- `Core and Rulebooks`
- `Core, Rulebooks and Lost Omens`
- `All Sources`

Users can also manually check or uncheck individual sources. Manual source selection is the final rule the generator follows.

### Region weighting

If the chosen background already has a region filled in, that region is used directly.

If the background does not have a region, the generator rolls one from the `Regions` tab by:

- rolling a continent first
- then rolling a region from within that continent

Available presets:

- `Default (Inner Sea)`
- `Explore (Non-Inner Sea Favored)`
- `Balanced`
- `Custom`

In `Custom`, users can manually choose which continents are allowed, and the selected continents are treated equally.

### Locking

Each result area has a lock button so users can keep one part of the character while rerolling the rest.

Current lockable sections:

- ancestry
- heritage
- background
- class
- key ability
- subclasses
- archetype

## Special Generation Rules

### Heritage rules

Heritages are only chosen from the selected ancestry.

### Key ability rules

Some classes use special logic instead of only reading the class row directly.

Current examples:

- `Psychic` key ability can come from the chosen subconscious mind
- `Rogue` can gain additional valid key ability options from its racket

### Subclass rules

Some classes have custom subclass rules.

Current examples:

- `Kineticist`
- `Exemplar`

### Archetype rules

Archetypes are rolled by default, but users can turn them off.

When archetypes are enabled:

- there is a 50/50 split between trying `Class` archetypes and `Other` archetypes
- after that split, the actual archetype choice still uses the current rarity weighting

Important archetype rules currently supported:

- archetype cannot have the same name as the generated class
- `required_class`
- `required_ancestry`
- `requires_spellcasting`
- `allowed_traditions`
- `required_spellcasting_style`
- `requires_focus_spells`

### Spellcasting rules for archetypes

Some archetypes depend on spellcasting details.

The generator checks:

- whether the class is a spellcaster
- the class spellcasting style
- the spellcasting tradition

Tradition can come from either:

- the class itself
- the chosen subclass, if the class leaves tradition blank and the subclass defines it instead

### Focus spell rules for archetypes

Some archetypes require focus spells.

That is checked using the `focus_spells` field on the `Classes` tab.

## UI Features

### Theme toggle

There is a small theme icon in the top-right corner:

- sun icon for light theme
- moon icon for dark theme

### Source info buttons

Most generated results include a small source info button.

Those buttons work on:

- hover
- click
- tap on mobile

### Archetype section

The lower section of the results is visually separated from the main build with a divider.

That lower section contains:

- `Region` on the left
- `Archetype` on the right

If archetypes are turned off:

- the archetype section is hidden

## Current Data Columns Used

The code currently reads and uses columns such as:

- `name`
- `rarity`
- `access`
- `source`
- `region`
- `continent`
- `ancestry`
- `class`
- `key_ability`
- `subclass_type`
- `subclass_label`
- `tradition`
- `is_spellcaster`
- `base_tradition`
- `spellcasting_style`
- `focus_spells`
- `type`
- `required_class`
- `required_ancestry`
- `requires_spellcasting`
- `allowed_traditions`
- `required_spellcasting_style`
- `requires_focus_spells`
- `source_name`
- `category`

## Notes For Future Updates

If you change the Google Sheet structure later, the code may need to be updated to match any new or renamed columns.

The safest rule is:

- adding new rows is usually fine
- changing column names usually requires code changes
- adding entirely new concepts often means updating `script.js`

## Keeping This README Updated

This README is meant to describe the current state of the project.

As new features are added, it should be updated to reflect:

- new controls
- new data columns
- new special-case generation rules
- deployment changes

If you want, I can keep maintaining this README as part of future changes so the documentation stays in sync with the project.
