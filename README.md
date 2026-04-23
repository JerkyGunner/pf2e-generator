# PF2E Character Generator Rules Guide

This file explains how the generator decides each card, what the different filters do, and how the cards affect each other.

It is written as a plain-English guide to the current rules in the app.

## Big Picture

When you click `Generate Character`, the app does not simply roll every card independently.

It first applies your active filters, then rolls the character in an order that keeps later choices compatible with earlier ones.

The main order is:

1. Ancestry
2. Heritage
3. Background
4. Class
5. Subclasses
6. Key Ability
7. Archetype
8. Region
9. Deity
10. Favored Weapon

If a card is locked, the generator tries to keep it and roll the rest around it.

## Global Filters

Most sheet-based content goes through the same three filters before it can be chosen:

1. Rarity filter
2. Society access filter
3. Source filter

This applies to:

- ancestries
- heritages
- backgrounds
- classes
- subclasses
- archetypes
- weapons

Deities are different:

- they use source and Society access
- they do not use rarity
- they use deity category weighting instead

Regions are also different:

- they do not use rarity
- they do use source and Society access
- they are weighted by continent instead

## Rarity Rules

The rarity filter decides what rarities are allowed at all:

- `Common Only`
- `Common and Uncommon Only`
- `All Rarities`

Then the `Rarity Weighting` setting decides how strongly common results are favored inside the allowed pool.

Current rarity weights:

- `Common Favored` with all rarities: Common 10, Uncommon 3, Rare 1
- `Balanced` with all rarities: Common 4, Uncommon 3, Rare 2
- `Pure Random` with all rarities: Common 1, Uncommon 1, Rare 1
- `Common Favored` with only common and uncommon allowed: Common 6, Uncommon 3
- `Balanced` with only common and uncommon allowed: Common 4, Uncommon 3
- `Pure Random` with only common and uncommon allowed: Common 1, Uncommon 1

## Society Access Rules

The Society filter can:

- hide `Society Limited` and `Society Restricted`
- hide only `Society Restricted`
- include everything

There is one special rule here:

- if any active source is an `Adventure Path` or `Adventure Module`, the generator ignores Society Limited and Society Restricted flags entirely

## Source Rules

The `Source Preset` is a quick way to turn source checkboxes on.

After that, the checkboxes are the real final rule.

That means manual checkbox changes override the preset.

A row is allowed if at least one of its listed sources is currently checked.

This matters because some rows can now list more than one source in the sheet.

## Lock Rules

Locking a card means the next roll tries to keep that result and build a valid character around it.

Current lockable cards:

- Ancestry
- Heritage
- Background
- Region
- Class
- Key Ability
- Subclasses
- Deity
- Favored Weapon
- Archetype

Some locks are simple. Some are "smart".

Smart lock examples:

- locking `Heritage` also fixes the ancestry it belongs to
- locking `Subclasses` also fixes the class they belong to
- locking `Region` restricts new background rolls to ones that fit that region or its continent
- locking `Archetype` can force the generator to use a class, ancestry, spellcaster, or focus-spell class that fits it

If two locks directly conflict, the app stops and shows an error instead of making an invalid character.

## Card-by-Card Rules

### Ancestry

Ancestry is rolled from the currently allowed ancestry pool using the active rarity, Society access, and source rules.

If Heritage is locked first, ancestry is pulled from that locked heritage.

### Heritage

Heritage is always chosen from heritages that match the chosen ancestry.

It still follows the usual rarity, Society access, and source filters.

### Background

Background is rolled from the filtered background pool.

If Region is locked, the background pool is narrowed to backgrounds that fit that region.

A background is treated as compatible with a locked region if:

- it names that exact region
- or it names that region's continent
- or it has no region/continent restriction at all

### Class

Class is rolled from the filtered class pool.

If a locked archetype would conflict with a class of the same name, that class is removed from the pool.

If a locked archetype has requirements, it can also force the class pool toward:

- a specific class
- spellcasting classes
- classes with focus spells

### Subclasses

Subclasses are chosen from the filtered subclass pool for the chosen class.

Standard classes:

- one subclass is chosen for each subclass type

Special cases:

- `Kineticist`
  - first roll Gate type
  - `Single Gate` gives one element
  - `Dual Gate` gives two elements
- `Exemplar`
  - tries to include one weapon ikon if available
  - then fills the remaining slots from the rest of the pool

### Key Ability

Key Ability is based on class and sometimes subclass.

Special cases:

- `Psychic`
  - key ability is taken from the chosen `Subconscious Mind` subclass
- `Rogue`
  - class options are combined with subclass key-ability options

The final key ability is chosen randomly from the valid options.

### Region

Region can be turned on or off.

If it is off:

- no region is rolled
- deity regional weighting cannot use a region bonus

If it is on, region is decided like this:

1. If the background has a specific `region`, use that exact region.
2. Otherwise, if the background has a `continent`, choose a region from inside that continent.
3. Otherwise, use the normal region weighting system.

Normal region weighting works in two steps:

1. Roll a continent.
2. Roll a region within that continent equally.

Region modes:

- `Default (Inner Sea)`
  - Avistan and Garund are favored
- `Explore (Non-Inner Sea Favored)`
  - continents outside Avistan and Garund are favored
- `Balanced`
  - all continents are equal
- `Custom`
  - only checked continents are available, and they are treated equally

The continent weighting used by the presets is:

- favored continent = 3
- unfavored continent = 1

### Archetype

Archetype can be turned on or off.

If it is on, the generator first filters the archetype list down to archetypes the character can legally take.

Current checks include:

- archetype cannot have the same name as the main class
- required class
- required ancestry
- requires spellcasting
- allowed traditions
- required spellcasting style
- requires focus spells

Then the archetype roll works in two stages:

1. 50% chance to try `Class` archetypes
2. 50% chance to try `Other` archetypes

If the chosen side is empty, it falls back to the other side.

After that, rarity weighting decides the final archetype within that bucket.

### Deity

Deity can be turned on or off, but some characters are required to have one.

The generator always forces a deity for characters whose class or background has `needs_deity = TRUE`.

At the moment that includes:

- Cleric
- Champion
- Raised by Belief

For required-deity characters:

- `None` is not allowed
- `Faiths & Philosophies` are not allowed
- the deity card still appears even if the Deity toggle is off

Deities do not use rarity. They use category buckets instead.

The app first sorts each deity into one or more buckets, then rolls the bucket, then rolls a deity inside that bucket.

This prevents large categories from becoming too common just because they contain more gods.

Deity bucket weights:

- `Gods of the Inner Sea` = 10
- `Regional` = 10
- `Ancestral` = 8
- `Pantheon` = 3
- `Faiths & Philosophies` = 2
- `Other Gods` = 3
- `Remaining Gods` = 1
- `None` = 5

Regional deity rules:

- if the character’s region is in `Garund`, `Mwangi Gods` count as `Regional`
- if the character’s region is in `Tian Xia`, `Tian Gods` count as `Regional`
- other regions do not get a regional deity category bonus

Ancestral deity rules:

- Dwarf -> `Dwarven Gods`
- Elf -> `Elven Gods`
- Goblin -> `Goblin Gods`
- Orc -> `Orc Gods`

All other deity categories that are not one of the named special buckets are treated as `Remaining Gods`.

### Favored Weapon

Favored Weapon is always rolled and shown.

The weapon pool is first filtered to weapons the class can legally use.

Normally, legality comes from the class’s `allowed_weapon_categories`.

There are two important exceptions:

- a class’s `favored_specific_weapons` are always allowed
- for required-deity characters, the deity’s favored weapon is always allowed

After legality is decided, weapons use rarity weighting plus class preferences.

Weapon preference bonuses:

- matching a favored weapon group: x3
- matching a favored specific weapon: x5

Special weapon rules:

- `Gunslinger`
  - the final weapon pool is forced to its favored weapon groups if any are available
- required-deity characters
  - if the deity’s favored weapon is in the legal pool, there is a 90% chance to choose it immediately
  - only the remaining 10% goes to the normal weighted weapon roll

## How Cards Influence Each Other

The main links between cards are:

- Heritage depends on Ancestry
- Background can depend on locked Region
- Region can come from Background
- Subclasses depend on Class
- Key Ability can depend on Class and Subclasses
- Archetype depends on Class, Subclasses, and Ancestry
- Locked Archetype can force Class or Ancestry constraints
- Deity can depend on Region and Ancestry for category weighting
- Deity can be forced by Class or Background
- Favored Weapon depends on Class
- Favored Weapon can be strongly influenced by Deity for required-deity characters

## Weighting Summary

The generator does not use one single weighting system for everything.

It uses three main systems:

### Standard rarity weighting

Used for:

- ancestries
- heritages
- backgrounds
- classes
- subclasses
- archetypes
- weapons

### Region weighting

Used only for:

- continent choice before region rolling

### Deity bucket weighting

Used only for:

- deity category buckets
- optional `None`

## Notes on “Off” Cards

If a card is turned off, that usually means the app does not roll it and shows `Off`.

The main exception is Deity:

- if a character requires a deity, the app still rolls and shows one even if the Deity toggle is off

This is done to avoid invalid results for classes and backgrounds that must have a deity.
