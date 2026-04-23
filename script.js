// ===============================
// GOOGLE SHEETS CSV LINKS
// ===============================
const ancestryCsvUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQLfWHlGnr19xt1pKXr38f43Bl6174deFGFTM9promg4lR9DNoY-NQb0PxTgh44mhSqSzc53xmnCDih/pub?gid=0&single=true&output=csv";

const heritageCsvUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQLfWHlGnr19xt1pKXr38f43Bl6174deFGFTM9promg4lR9DNoY-NQb0PxTgh44mhSqSzc53xmnCDih/pub?gid=653560487&single=true&output=csv";

const backgroundCsvUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQLfWHlGnr19xt1pKXr38f43Bl6174deFGFTM9promg4lR9DNoY-NQb0PxTgh44mhSqSzc53xmnCDih/pub?gid=59254066&single=true&output=csv";

const regionCsvUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQLfWHlGnr19xt1pKXr38f43Bl6174deFGFTM9promg4lR9DNoY-NQb0PxTgh44mhSqSzc53xmnCDih/pub?gid=1217750278&single=true&output=csv";

const deityCsvUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQLfWHlGnr19xt1pKXr38f43Bl6174deFGFTM9promg4lR9DNoY-NQb0PxTgh44mhSqSzc53xmnCDih/pub?gid=1202849080&single=true&output=csv";

const weaponCsvUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQLfWHlGnr19xt1pKXr38f43Bl6174deFGFTM9promg4lR9DNoY-NQb0PxTgh44mhSqSzc53xmnCDih/pub?gid=338604730&single=true&output=csv";

const classCsvUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQLfWHlGnr19xt1pKXr38f43Bl6174deFGFTM9promg4lR9DNoY-NQb0PxTgh44mhSqSzc53xmnCDih/pub?gid=982187207&single=true&output=csv";

const subclassCsvUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQLfWHlGnr19xt1pKXr38f43Bl6174deFGFTM9promg4lR9DNoY-NQb0PxTgh44mhSqSzc53xmnCDih/pub?gid=1804749066&single=true&output=csv";

const archetypeCsvUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQLfWHlGnr19xt1pKXr38f43Bl6174deFGFTM9promg4lR9DNoY-NQb0PxTgh44mhSqSzc53xmnCDih/pub?gid=1990304273&single=true&output=csv";

const sourceCsvUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQLfWHlGnr19xt1pKXr38f43Bl6174deFGFTM9promg4lR9DNoY-NQb0PxTgh44mhSqSzc53xmnCDih/pub?gid=546607334&single=true&output=csv";

// ===============================
// DATA STORAGE
// ===============================
let ancestries = [];
let heritages = [];
let backgrounds = [];
let regions = [];
let deities = [];
let weapons = [];
let classes = [];
let subclasses = [];
let archetypes = [];
let sourceDefinitions = [];
let currentCharacter = null;

const lockedSelections = {
  ancestry: null,
  heritage: null,
  background: null,
  region: null,
  class: null,
  keyAbility: null,
  deity: null,
  weapon: null,
  archetype: null,
  subclasses: null,
};

const generateButton = document.getElementById("generateBtn");
const retryButton = document.getElementById("retryBtn");
const rarityFilterSelect = document.getElementById("rarityFilter");
const rarityModeGroup = document.getElementById("rarityModeGroup");
const rarityModeSelect = document.getElementById("rarityMode");
const accessFilterSelect = document.getElementById("accessFilter");
const regionToggleSelect = document.getElementById("regionToggle");
const archetypeToggleSelect = document.getElementById("archetypeToggle");
const deityToggleSelect = document.getElementById("deityToggle");
const regionModeGroup = document.getElementById("regionModeGroup");
const regionModeSelect = document.getElementById("regionMode");
const sourcePresetSelect = document.getElementById("sourcePreset");
const sourceCheckboxGroups = document.getElementById("sourceCheckboxGroups");
const customRegionGroup = document.getElementById("customRegionGroup");
const regionCheckboxGroups = document.getElementById("regionCheckboxGroups");
const themeToggle = document.getElementById("themeToggle");
const regionModeHint = document.getElementById("regionModeHint");
const rarityWeightingGuide = document.getElementById("rarityWeightingGuide");
const regionWeightingGuide = document.getElementById("regionWeightingGuide");
const deityWeightingGuide = document.getElementById("deityWeightingGuide");
const archetypeWeightingGuide = document.getElementById("archetypeWeightingGuide");
const weaponWeightingGuide = document.getElementById("weaponWeightingGuide");
const statusMessage = document.getElementById("statusMessage");
const secondaryResultsSection = document.getElementById("secondaryResultsSection");
const regionSection = document.getElementById("regionSection");
const deitySection = document.getElementById("deitySection");
const weaponSection = document.getElementById("weaponSection");
const archetypeSection = document.getElementById("archetypeSection");
const lockButtons = {
  ancestry: document.getElementById("lockAncestryBtn"),
  heritage: document.getElementById("lockHeritageBtn"),
  background: document.getElementById("lockBackgroundBtn"),
  region: document.getElementById("lockRegionBtn"),
  class: document.getElementById("lockClassBtn"),
  keyAbility: document.getElementById("lockKeyAbilityBtn"),
  deity: document.getElementById("lockDeityBtn"),
  weapon: document.getElementById("lockWeaponBtn"),
  archetype: document.getElementById("lockArchetypeBtn"),
  subclasses: document.getElementById("lockSubclassesBtn"),
};

const rarityModeOptions = {
  all: [
    { value: "strong", label: "Common Favored (Common 10, Uncommon 3, Rare 1)" },
    { value: "light", label: "Balanced (Common 4, Uncommon 3, Rare 2)" },
    { value: "off", label: "Pure Random (All rarities 1)" },
  ],
  "common-uncommon": [
    { value: "strong", label: "Common Favored (Common 6, Uncommon 3)" },
    { value: "light", label: "Balanced (Common 4, Uncommon 3)" },
    { value: "off", label: "Pure Random (Common 1, Uncommon 1)" },
  ],
};

const regionModeOptions = {
  "inner-sea": "Avistan and Garund are favored over the other continents.",
  explore: "Non-Inner Sea continents are favored over Avistan and Garund.",
  balanced: "All continents are treated equally.",
  custom: "Choose exactly which continents can be rolled, then treat them equally.",
};

const sourcePresetCategories = {
  "core-only": ["Core"],
  "core-rulebooks": ["Core", "Rulebook"],
  "core-rulebooks-lost-omens": ["Core", "Rulebook", "Lost Omens"],
  all: ["Core", "Rulebook", "Lost Omens", "Adventure Path", "Adventure Module"],
};

const themeStorageKey = "pf2e-generator-theme";

// ===============================
// HELPER FUNCTIONS
// ===============================

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomItems(array, count) {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function cloneValue(value) {
  if (Array.isArray(value)) {
    return value.map(item => ({ ...item }));
  }

  if (value && typeof value === "object") {
    return { ...value };
  }

  return value;
}

function getCurrentThemeOptionLabel() {
  return rarityModeSelect.options[rarityModeSelect.selectedIndex]?.textContent || "";
}

function updateRegionModeHint() {
  regionModeHint.textContent = regionModeOptions[regionModeSelect.value] || "";
}

function applyTheme(theme) {
  if (theme === "dark" || theme === "light") {
    document.body.dataset.theme = theme;
    updateThemeToggle(theme);
    return;
  }

  document.body.removeAttribute("data-theme");
  updateThemeToggle(getSystemTheme());
}

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function updateThemeToggle(theme) {
  const isDarkTheme = theme === "dark";
  themeToggle.innerHTML = isDarkTheme ? "&#9790;" : "&#9728;";
  themeToggle.setAttribute("aria-label", isDarkTheme ? "Switch to light theme" : "Switch to dark theme");
}

function initializeTheme() {
  // Save the user's explicit light/dark choice, but if they never picked one,
  // fall back to whatever their device theme is using.
  const savedTheme = localStorage.getItem(themeStorageKey);
  applyTheme(savedTheme || getSystemTheme());
}

function setStatusMessageText(message, isError = false) {
  statusMessage.textContent = message;
  statusMessage.classList.toggle("error", isError);
}

function createSourceButton(sourceText) {
  const normalizedSourceText = String(sourceText || "").trim();

  if (!normalizedSourceText) {
    return null;
  }

  const sourcePopover = document.createElement("span");
  sourcePopover.className = "source-popover";

  const sourceButton = document.createElement("button");
  sourceButton.type = "button";
  sourceButton.className = "source-button";
  sourceButton.textContent = "i";
  sourceButton.setAttribute("aria-label", `Source: ${normalizedSourceText}`);
  sourceButton.setAttribute("aria-expanded", "false");

  const sourceTooltip = document.createElement("span");
  sourceTooltip.className = "source-tooltip";
  sourceTooltip.textContent = normalizedSourceText;

  sourceButton.addEventListener("click", event => {
    event.stopPropagation();
    const willOpen = !sourcePopover.classList.contains("is-open");
    document.querySelectorAll(".source-popover.is-open").forEach(popover => {
      popover.classList.remove("is-open");
      const button = popover.querySelector(".source-button");
      if (button) {
        button.setAttribute("aria-expanded", "false");
      }
    });
    sourcePopover.classList.toggle("is-open", willOpen);
    sourceButton.setAttribute("aria-expanded", String(willOpen));
  });

  sourcePopover.appendChild(sourceButton);
  sourcePopover.appendChild(sourceTooltip);
  return sourcePopover;
}

function setValueAndSource(resultId, sourceId, valueText, sourceText) {
  const resultElement = document.getElementById(resultId);
  const sourceElement = document.getElementById(sourceId);

  resultElement.textContent = valueText;
  sourceElement.replaceChildren();

  const sourceButton = createSourceButton(sourceText);

  if (sourceButton) {
    sourceElement.appendChild(sourceButton);
  }
}

function normalizeSourceName(value) {
  return String(value || "").trim();
}

function splitSourceValues(value) {
  return String(value || "")
    .split(",")
    .map(source => normalizeSourceName(source))
    .filter(source => source !== "");
}

function normalizeContinentName(value) {
  return String(value || "").trim();
}

function normalizeRarity(item) {
  return String(item.rarity || "common").toLowerCase().trim();
}

function isTrueValue(value) {
  return String(value || "").trim().toLowerCase() === "true";
}

function isArchetypeEnabled() {
  return archetypeToggleSelect.value === "on";
}

function isDeityEnabled() {
  return deityToggleSelect.value === "on";
}

function isRegionEnabled() {
  return regionToggleSelect.value === "on";
}

function splitCsvValues(value) {
  return String(value || "")
    .split(",")
    .map(item => item.trim().toLowerCase())
    .filter(item => item !== "");
}

function getAvailableRegions() {
  return regions.filter(region => String(region.name || "").trim() !== "");
}

function findRegionByName(name) {
  return regions.find(
    region => String(region.name).trim().toLowerCase() === String(name).trim().toLowerCase()
  ) || null;
}

function getAvailableContinents() {
  // Regions are rolled from continents first, so we keep a clean list of
  // unique continent names pulled straight from the Regions sheet.
  return [...new Set(
    getAvailableRegions()
      .map(region => normalizeContinentName(region.continent))
      .filter(continent => continent !== "")
  )].sort((a, b) => a.localeCompare(b));
}

function updateArchetypeVisibility() {
  archetypeSection.hidden = !isArchetypeEnabled();
}

function updateDeityVisibility() {
  deitySection.hidden = !(isDeityEnabled() || characterNeedsDeity(currentCharacter?.class, currentCharacter?.background));
}

function updateWeaponVisibility() {
  weaponSection.hidden = false;
}

function updateSecondaryResultsVisibility() {
  regionSection.hidden = !isRegionEnabled();
  updateDeityVisibility();
  updateWeaponVisibility();
  updateArchetypeVisibility();

  const hasLeftColumnContent = isRegionEnabled() || isDeityEnabled();
  const hasRightColumnContent = true;

  deitySection.classList.toggle("is-first-visible", !isRegionEnabled() && isDeityEnabled());
  secondaryResultsSection.hidden = !hasLeftColumnContent && !hasRightColumnContent;
}

function getAllowedRarities() {
  const rarityFilter = rarityFilterSelect.value;

  if (rarityFilter === "common-only") {
    return ["common"];
  }

  if (rarityFilter === "common-uncommon") {
    return ["common", "uncommon"];
  }

  return ["common", "uncommon", "rare"];
}

function filterByAllowedRarities(array) {
  const allowedRarities = getAllowedRarities();
  return array.filter(item => allowedRarities.includes(normalizeRarity(item)));
}

function normalizeAccess(item) {
  return String(item.access || "").toLowerCase().trim();
}

function filterByAccess(array) {
  const accessFilter = accessFilterSelect.value;

  // Adventure material often has Society flags that we still want to allow
  // when the user has explicitly included Adventure Path or Module sources.
  if (accessFilter === "all" || hasAdventureSourcesSelected()) {
    return array;
  }

  return array.filter(item => {
    const access = normalizeAccess(item);

    if (accessFilter === "hide-restricted") {
      return access !== "society restricted";
    }

    return access !== "society limited" && access !== "society restricted";
  });
}

function applyAccessAndSourceFilters(array) {
  return filterBySource(filterByAccess(array));
}

function applyActiveFilters(array) {
  // Most sheet-backed data goes through the same three filters:
  // 1. rarity
  // 2. Society access
  // 3. selected sources
  return filterBySource(filterByAccess(filterByAllowedRarities(array)));
}

function getSelectedSourceNames() {
  const checkedInputs = sourceCheckboxGroups.querySelectorAll("input[type=\"checkbox\"]:checked");
  return new Set([...checkedInputs].map(input => input.value));
}

function hasAdventureSourcesSelected() {
  const selectedSourceNames = getSelectedSourceNames();

  return sourceDefinitions.some(source =>
    selectedSourceNames.has(source.source_name) &&
    (source.category === "Adventure Path" || source.category === "Adventure Module")
  );
}

function filterBySource(array) {
  const selectedSourceNames = getSelectedSourceNames();

  if (selectedSourceNames.size === 0) {
    return [];
  }

  return array.filter(item => {
    const itemSources = splitSourceValues(item.source);

    if (itemSources.length === 0) {
      return false;
    }

    return itemSources.some(source => selectedSourceNames.has(source));
  });
}

function matchesOptionalRequirement(requiredValue, actualValue) {
  const normalizedRequiredValue = String(requiredValue || "").trim().toLowerCase();

  if (!normalizedRequiredValue) {
    return true;
  }

  return normalizedRequiredValue === String(actualValue || "").trim().toLowerCase();
}

function matchesOptionalListRequirement(requiredValue, actualValue) {
  const allowedValues = splitCsvValues(requiredValue);

  if (allowedValues.length === 0) {
    return true;
  }

  return allowedValues.includes(String(actualValue || "").trim().toLowerCase());
}

function getSpellcastingProfile(chosenClass, chosenSubclasses) {
  // Some classes define their tradition directly, while others leave it to
  // subclasses. We combine both so archetype checks can use one simple profile.
  const classTraditions = splitCsvValues(chosenClass.base_tradition);
  const subclassTraditions = chosenSubclasses.flatMap(subclass =>
    splitCsvValues(subclass.tradition)
  );
  const allTraditions = [...new Set([...classTraditions, ...subclassTraditions])];

  return {
    isSpellcaster: isTrueValue(chosenClass.is_spellcaster),
    traditions: allTraditions,
    style: String(chosenClass.spellcasting_style || "").trim().toLowerCase(),
  };
}

function getClassFeatureProfile(chosenClass) {
  return {
    hasFocusSpells: isTrueValue(chosenClass.focus_spells),
  };
}

function archetypeAllowsTradition(archetype, spellcastingProfile) {
  const allowedTraditions = splitCsvValues(archetype.allowed_traditions);

  if (allowedTraditions.length === 0) {
    return true;
  }

  return allowedTraditions.some(tradition => spellcastingProfile.traditions.includes(tradition));
}

function filterArchetypesForCharacter(chosenClass, chosenSubclasses, chosenAncestry) {
  const spellcastingProfile = getSpellcastingProfile(chosenClass, chosenSubclasses);
  const classFeatureProfile = getClassFeatureProfile(chosenClass);

  // This is the "can this archetype legally fit this character?" gate.
  // Every requirement column on the Archetypes sheet is checked here.
  return applyActiveFilters(archetypes).filter(archetype => {
    if (String(archetype.name).trim().toLowerCase() === String(chosenClass.name).trim().toLowerCase()) {
      return false;
    }

    if (isTrueValue(archetype.requires_spellcasting) && !spellcastingProfile.isSpellcaster) {
      return false;
    }

    if (!archetypeAllowsTradition(archetype, spellcastingProfile)) {
      return false;
    }

    if (
      archetype.required_spellcasting_style &&
      String(archetype.required_spellcasting_style).trim().toLowerCase() !== spellcastingProfile.style
    ) {
      return false;
    }

    if (!matchesOptionalRequirement(archetype.required_class, chosenClass.name)) {
      return false;
    }

    if (!matchesOptionalListRequirement(archetype.required_ancestry, chosenAncestry.name)) {
      return false;
    }

    if (isTrueValue(archetype.requires_focus_spells) && !classFeatureProfile.hasFocusSpells) {
      return false;
    }

    return true;
  });
}

function chooseArchetype(chosenClass, chosenSubclasses, chosenAncestry) {
  if (!isArchetypeEnabled()) {
    return null;
  }

  const matchingArchetypes = filterArchetypesForCharacter(chosenClass, chosenSubclasses, chosenAncestry);

  if (matchingArchetypes.length === 0) {
    return null;
  }

  const classArchetypes = matchingArchetypes.filter(
    archetype => String(archetype.type).trim().toLowerCase() === "class"
  );
  const otherArchetypes = matchingArchetypes.filter(
    archetype => String(archetype.type).trim().toLowerCase() === "other"
  );
  // The user wanted Class vs Other to be a 50/50 split first, and only then
  // should rarity weighting decide which archetype wins inside that bucket.
  const chooseClassArchetype = Math.random() < 0.5;
  const preferredPool = chooseClassArchetype ? classArchetypes : otherArchetypes;
  const fallbackPool = chooseClassArchetype ? otherArchetypes : classArchetypes;
  const finalPool = preferredPool.length > 0 ? preferredPool : fallbackPool;

  return weightedRandomItem(finalPool);
}

function filterClassesForLockedArchetype(classOptions, chosenArchetype) {
  if (!chosenArchetype) {
    return classOptions;
  }

  const lockedArchetypeName = String(chosenArchetype.name).trim().toLowerCase();

  return classOptions.filter(characterClass =>
    String(characterClass.name).trim().toLowerCase() !== lockedArchetypeName
  );
}

function syncSelectionsFromLockedArchetype(chosenArchetype, chosenClass, chosenAncestry) {
  if (!chosenArchetype) {
    return {
      chosenClass,
      chosenAncestry,
    };
  }

  if (!chosenAncestry && chosenArchetype.required_ancestry) {
    const allowedAncestries = applyActiveFilters(ancestries).filter(ancestryOption =>
      matchesOptionalListRequirement(chosenArchetype.required_ancestry, ancestryOption.name)
    );

    if (allowedAncestries.length > 0) {
      chosenAncestry = weightedRandomItem(allowedAncestries);
    } else {
      const firstRequiredAncestry = String(chosenArchetype.required_ancestry).split(",")[0].trim();
      chosenAncestry =
        findAncestryByName(firstRequiredAncestry) || { name: firstRequiredAncestry };
    }
  }

  if (!chosenClass) {
    if (chosenArchetype.required_class) {
      chosenClass =
        findClassByName(chosenArchetype.required_class) || { name: chosenArchetype.required_class };
    } else if (isTrueValue(chosenArchetype.requires_spellcasting)) {
      const spellcastingClasses = applyActiveFilters(classes).filter(characterClass =>
        isTrueValue(characterClass.is_spellcaster)
      );

      if (spellcastingClasses.length > 0) {
        chosenClass = weightedRandomItem(spellcastingClasses);
      }
    } else if (isTrueValue(chosenArchetype.requires_focus_spells)) {
      const focusSpellClasses = applyActiveFilters(classes).filter(characterClass =>
        isTrueValue(characterClass.focus_spells)
      );

      if (focusSpellClasses.length > 0) {
        chosenClass = weightedRandomItem(focusSpellClasses);
      }
    }
  }

  return {
    chosenClass,
    chosenAncestry,
  };
}

function getSourceCategoryDefinitions() {
  return [
    {
      category: "Core",
      groups: [
        {
          title: "Core",
          sources: sourceDefinitions.filter(source => source.category === "Core"),
        },
      ],
    },
    {
      category: "Rulebook",
      groups: [
        {
          title: "Rulebook",
          sources: sourceDefinitions.filter(source => source.category === "Rulebook"),
        },
      ],
    },
    {
      category: "Lost Omens",
      groups: [
        {
          title: "Lost Omens",
          sources: sourceDefinitions.filter(source => source.category === "Lost Omens"),
        },
      ],
    },
    {
      category: "Adventure",
      groups: [
        {
          title: "Adventure Path",
          sources: sourceDefinitions.filter(source => source.category === "Adventure Path"),
        },
        {
          title: "Adventure Module",
          sources: sourceDefinitions.filter(source => source.category === "Adventure Module"),
        },
      ],
    },
  ];
}

function renderRegionCheckboxes() {
  regionCheckboxGroups.replaceChildren();

  getAvailableContinents().forEach(continent => {
    const optionLabel = document.createElement("label");
    optionLabel.className = "region-option";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = continent;
    checkbox.checked = true;

    const text = document.createElement("span");
    text.textContent = continent;

    optionLabel.appendChild(checkbox);
    optionLabel.appendChild(text);
    regionCheckboxGroups.appendChild(optionLabel);
  });
}

function updateRegionModeControl() {
  const regionEnabled = isRegionEnabled();
  // Only show continent checkboxes when the user has chosen the fully manual
  // region mode. The other presets decide the weights automatically.
  const isCustomMode = regionEnabled && regionModeSelect.value === "custom";
  regionModeGroup.hidden = !regionEnabled;
  regionModeSelect.disabled = !regionEnabled;
  customRegionGroup.hidden = !isCustomMode;
  updateRegionModeHint();
}

function renderWeightingItems(container, items) {
  container.replaceChildren();

  items.forEach(text => {
    const item = document.createElement("div");
    item.className = "weighting-item";
    item.textContent = text;
    container.appendChild(item);
  });
}

function getCurrentRarityWeightingItems() {
  const allowedRarities = getAllowedRarities();

  if (allowedRarities.length === 1) {
    return [
      "Only common entries can be rolled.",
      "This applies to ancestries, heritages, backgrounds, classes, subclasses, and archetypes.",
    ];
  }

  if (rarityModeSelect.value === "off") {
    return [
      `Allowed rarities: ${allowedRarities.join(", ")}.`,
      "Every allowed rarity is treated equally.",
    ];
  }

  if (rarityModeSelect.value === "light") {
    return [
      `Allowed rarities: ${allowedRarities.join(", ")}.`,
      allowedRarities.includes("rare")
        ? "Current weights: Common 4, Uncommon 3, Rare 2."
        : "Current weights: Common 4, Uncommon 3.",
    ];
  }

  return [
    `Allowed rarities: ${allowedRarities.join(", ")}.`,
    allowedRarities.includes("rare")
      ? "Current weights: Common 10, Uncommon 3, Rare 1."
      : "Current weights: Common 6, Uncommon 3.",
  ];
}

function getCurrentRegionWeightingItems() {
  if (!isRegionEnabled()) {
    return [
      "Region is turned off, so no Region card is rolled or shown.",
      "If Deities are still on, they do not get any regional deity bonus.",
    ];
  }

  const items = [
    "If a background already has a region, that region is used directly.",
    "If a background only has a continent, the generator keeps that continent and rolls a region inside it.",
    "If a background has neither, the generator rolls a continent first and then a region inside it.",
  ];

  if (regionModeSelect.value === "inner-sea") {
    items.push("Current continent weights: Avistan 3, Garund 3, all other continents 1.");
  } else if (regionModeSelect.value === "explore") {
    items.push("Current continent weights: Avistan 1, Garund 1, all other continents 3.");
  } else if (regionModeSelect.value === "balanced") {
    items.push("Current continent weights: all continents 1.");
  } else {
    const selectedContinents = [...getSelectedCustomContinents()];
    items.push(
      selectedContinents.length > 0
        ? `Custom mode: only these continents can be rolled, all equally: ${selectedContinents.join(", ")}.`
        : "Custom mode: no continents are currently selected."
    );
  }

  return items;
}

function getCurrentDeityWeightingItems() {
  if (!isDeityEnabled() && !characterNeedsDeity(currentCharacter?.class, currentCharacter?.background)) {
    return ["Deity rolling is currently turned off."];
  }

  const items = [
    "The generator rolls a deity bucket first, then rolls a deity inside that bucket.",
    "Current bucket weights: Gods of the Inner Sea 10, Regional 10, Ancestral 8, Pantheon 3, Faiths & Philosophies 2, Other Gods 3, Remaining Gods 1, None 5.",
  ];

  if (!isRegionEnabled()) {
    items.push("Region is turned off, so deity rolls get no regional deity bonus.");
  } else {
    items.push("Regional bucket means Mwangi Gods for Garund regions and Tian Gods for Tian Xia regions.");
  }
  items.push("Ancestral bucket means Dwarven Gods for Dwarves, Elven Gods for Elves, Goblin Gods for Goblins, and Orc Gods for Orcs.");

  return items;
}

function getCurrentArchetypeWeightingItems() {
  if (!isArchetypeEnabled()) {
    return ["Archetype rolling is currently turned off."];
  }

  return [
    "The generator first tries a 50/50 split between Class archetypes and Other archetypes.",
    "If the chosen side has no valid archetypes, it falls back to the other side.",
    "Inside the final side, the current rarity weighting is used to choose the archetype.",
  ];
}

function getCurrentWeaponWeightingItems() {
  const items = [
    "Weapons must come from the chosen class's allowed weapon categories.",
    "Inside those categories, normal rarity weighting still applies.",
  ];

  if (currentCharacter?.class) {
    const allowedCategories = splitCsvValues(currentCharacter.class.allowed_weapon_categories);
    items.push(`Current class categories: ${allowedCategories.join(", ")}.`);

    const favoredGroups = splitCsvValues(currentCharacter.class.favored_weapon_groups);
    const favoredSpecificWeapons = splitCsvValues(currentCharacter.class.favored_specific_weapons);

    if (favoredGroups.length > 0) {
      items.push(`Class group preference: ${favoredGroups.join(", ")}.`);
    }

    if (favoredSpecificWeapons.length > 0) {
      items.push(`Class specific-weapon preference: ${favoredSpecificWeapons.join(", ")}.`);
    }
  } else {
    items.push("Class preferences are applied after a class has been rolled.");
  }

  items.push("If the character must have a deity and the deity's favored weapon is legal for the class, it is weighted very strongly.");
  items.push("For required-deity characters, there is now a 90% chance to use the legal deity-favored weapon before the normal weapon roll happens.");
  return items;
}

function updateWeightingGuide() {
  renderWeightingItems(rarityWeightingGuide, getCurrentRarityWeightingItems());
  renderWeightingItems(regionWeightingGuide, getCurrentRegionWeightingItems());
  renderWeightingItems(deityWeightingGuide, getCurrentDeityWeightingItems());
  renderWeightingItems(archetypeWeightingGuide, getCurrentArchetypeWeightingItems());
  renderWeightingItems(weaponWeightingGuide, getCurrentWeaponWeightingItems());
}

function getSelectedCustomContinents() {
  return new Set(
    [...regionCheckboxGroups.querySelectorAll("input[type=\"checkbox\"]:checked")]
      .map(input => input.value)
  );
}

function continentWeight(continent) {
  const normalizedContinent = normalizeContinentName(continent);
  const innerSeaContinents = new Set(["Avistan", "Garund"]);
  const isInnerSeaContinent = innerSeaContinents.has(normalizedContinent);

  // Region weighting is separate from normal rarity weighting because the
  // Regions sheet does not use rarity. Instead, continent choice is weighted.
  if (regionModeSelect.value === "balanced" || regionModeSelect.value === "custom") {
    return 1;
  }

  if (regionModeSelect.value === "explore") {
    return isInnerSeaContinent ? 1 : 3;
  }

  return isInnerSeaContinent ? 3 : 1;
}

function weightedRandomContinent(continents) {
  if (continents.length === 0) {
    return null;
  }

  const totalWeight = continents.reduce((sum, continent) => sum + continentWeight(continent), 0);
  let remainingWeight = Math.random() * totalWeight;

  for (const continent of continents) {
    remainingWeight -= continentWeight(continent);

    if (remainingWeight < 0) {
      return continent;
    }
  }

  return continents[continents.length - 1];
}

function getRegionsByContinentMap() {
  return getAvailableRegions().reduce((map, region) => {
    const continent = normalizeContinentName(region.continent);

    if (!continent) {
      return map;
    }

    if (!map.has(continent)) {
      map.set(continent, []);
    }

    map.get(continent).push(region);
    return map;
  }, new Map());
}

function chooseRegionFromContinent(continent, sourceText) {
  const normalizedContinent = normalizeContinentName(continent);

  if (!normalizedContinent) {
    return null;
  }

  const regionsByContinent = getRegionsByContinentMap();
  const matchingRegions = regionsByContinent.get(normalizedContinent) || [];

  if (matchingRegions.length === 0) {
    return null;
  }

  const chosenRegion = randomItem(matchingRegions);

  return {
    name: chosenRegion.name,
    continent: normalizedContinent,
    sourceText,
  };
}

function chooseRegionFromTab() {
  const regionsByContinent = getRegionsByContinentMap();
  let continentPool = [...regionsByContinent.keys()];

  if (regionModeSelect.value === "custom") {
    const selectedContinents = getSelectedCustomContinents();
    continentPool = continentPool.filter(continent => selectedContinents.has(continent));
  }

  if (continentPool.length === 0) {
    return null;
  }

  // Region selection happens in two steps:
  // 1. choose a continent using the current region preset
  // 2. choose any region inside that continent equally
  const chosenContinent = weightedRandomContinent(continentPool);
  const chosenRegion = randomItem(regionsByContinent.get(chosenContinent) || []);

  if (!chosenRegion) {
    return null;
  }

  return {
    name: chosenRegion.name,
    continent: chosenContinent,
    sourceText: `Continent: ${chosenContinent}`,
  };
}

function applySourcePreset() {
  const allowedCategories = sourcePresetCategories[sourcePresetSelect.value] || [];
  const sourceCheckboxes = sourceCheckboxGroups.querySelectorAll("input[type=\"checkbox\"]");

  sourceCheckboxes.forEach(checkbox => {
    checkbox.checked = allowedCategories.includes(checkbox.dataset.category);
  });
}

function renderSourceCheckboxes() {
  sourceCheckboxGroups.replaceChildren();

  const categoryDefinitions = getSourceCategoryDefinitions();

  categoryDefinitions.forEach(({ category, groups }) => {
    const groupsWithSources = groups.filter(group => group.sources.length > 0);

    if (groupsWithSources.length === 0) {
      return;
    }

    const groupElement = document.createElement("details");
    groupElement.className = "source-group";

    const titleElement = document.createElement("summary");
    titleElement.className = "source-group-summary";
    titleElement.textContent = category;
    groupElement.appendChild(titleElement);

    const optionsWrapper = document.createElement("div");
    optionsWrapper.className = "source-group-options";

    groupsWithSources.forEach(group => {
      if (groupsWithSources.length === 1 && group.title === category) {
        group.sources.forEach(source => {
          const optionLabel = document.createElement("label");
          optionLabel.className = "source-option";

          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.value = source.source_name;
          checkbox.dataset.category = source.category;

          const text = document.createElement("span");
          text.textContent = source.source_name;

          optionLabel.appendChild(checkbox);
          optionLabel.appendChild(text);
          optionsWrapper.appendChild(optionLabel);
        });

        return;
      }

      const subgroupElement = document.createElement("details");
      subgroupElement.className = "source-subgroup";

      const subgroupSummary = document.createElement("summary");
      subgroupSummary.className = "source-subgroup-summary";
      subgroupSummary.textContent = group.title;
      subgroupElement.appendChild(subgroupSummary);

      const subgroupOptions = document.createElement("div");
      subgroupOptions.className = "source-subgroup-options";

      group.sources.forEach(source => {
        const optionLabel = document.createElement("label");
        optionLabel.className = "source-option";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = source.source_name;
        checkbox.dataset.category = source.category;

        const text = document.createElement("span");
        text.textContent = source.source_name;

        optionLabel.appendChild(checkbox);
        optionLabel.appendChild(text);
        subgroupOptions.appendChild(optionLabel);
      });

      subgroupElement.appendChild(subgroupOptions);
      optionsWrapper.appendChild(subgroupElement);
    });

    groupElement.appendChild(optionsWrapper);
    sourceCheckboxGroups.appendChild(groupElement);
  });

  applySourcePreset();
}

function findAncestryByName(name) {
  return ancestries.find(
    ancestry => ancestry.name.toLowerCase() === String(name).toLowerCase()
  ) || null;
}

function findClassByName(name) {
  return classes.find(
    characterClass => characterClass.name.toLowerCase() === String(name).toLowerCase()
  ) || null;
}

function updateLockButtons() {
  Object.entries(lockButtons).forEach(([key, button]) => {
    const isLocked = lockedSelections[key] !== null;
    button.textContent = isLocked ? "Unlock" : "Lock";
    button.classList.toggle("locked", isLocked);
    button.setAttribute("aria-pressed", String(isLocked));
  });
}

function toggleLock(key) {
  if (lockedSelections[key] !== null) {
    lockedSelections[key] = null;
    updateLockButtons();
    return;
  }

  if (!currentCharacter) {
    return;
  }

  const currentValue = currentCharacter[key];

  if (currentValue === null || currentValue === undefined) {
    return;
  }

  lockedSelections[key] = cloneValue(currentValue);
  updateLockButtons();
}

function updateRarityModeControl() {
  const rarityFilter = rarityFilterSelect.value;
  const currentMode = rarityModeSelect.value;

  if (rarityFilter === "common-only") {
    rarityModeGroup.hidden = true;
    rarityModeSelect.disabled = true;
    return;
  }

  const optionSet = rarityModeOptions[rarityFilter] || rarityModeOptions.all;

  rarityModeGroup.hidden = false;
  rarityModeSelect.disabled = false;
  rarityModeSelect.replaceChildren();

  optionSet.forEach(option => {
    const optionElement = document.createElement("option");
    optionElement.value = option.value;
    optionElement.textContent = option.label;
    rarityModeSelect.appendChild(optionElement);
  });

  rarityModeSelect.value = optionSet.some(option => option.value === currentMode)
    ? currentMode
    : optionSet[0].value;
}

function rarityWeight(item) {
  const rarityMode = rarityModeSelect.value;
  const rarity = normalizeRarity(item);

  if (rarityMode === "off") {
    return 1;
  }

  if (rarityMode === "light") {
    if (rarity === "rare") {
      return 2;
    }

    if (rarity === "uncommon") {
      return 3;
    }

    return 4;
  }

  if (rarity === "rare") {
    return 1;
  }

  if (rarity === "uncommon") {
    return 3;
  }

  return 10;
}

function weightedRandomItem(array) {
  if (array.length === 0) {
    return null;
  }

  // Build a "weighted lottery" so common options appear more often without
  // completely removing uncommon or rare ones from the pool.
  const totalWeight = array.reduce(
    (sum, item) => sum + rarityWeight(item),
    0
  );

  let remainingWeight = Math.random() * totalWeight;

  for (const item of array) {
    remainingWeight -= rarityWeight(item);

    if (remainingWeight < 0) {
      return item;
    }
  }

  return array[array.length - 1];
}

function weightedRandomItems(array, count) {
  const pool = [...array];
  const results = [];

  while (pool.length > 0 && results.length < count) {
    const chosenItem = weightedRandomItem(pool);

    if (!chosenItem) {
      break;
    }

    results.push(chosenItem);

    const chosenIndex = pool.indexOf(chosenItem);
    pool.splice(chosenIndex, 1);
  }

  return results;
}

function parseCsv(csvText) {
  const rows = [];
  let currentRow = [];
  let currentValue = "";
  let insideQuotes = false;

  for (let index = 0; index < csvText.length; index += 1) {
    const character = csvText[index];
    const nextCharacter = csvText[index + 1];

    // CSV uses double quotes to wrap values that may contain commas or line breaks.
    if (character === "\"") {
      // Two quote marks in a row mean the value contains a literal quote character.
      if (insideQuotes && nextCharacter === "\"") {
        currentValue += "\"";
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (character === "," && !insideQuotes) {
      currentRow.push(currentValue.trim());
      currentValue = "";
    } else if ((character === "\n" || character === "\r") && !insideQuotes) {
      // A line break only ends the row when we are not inside a quoted value.
      if (character === "\r" && nextCharacter === "\n") {
        index += 1;
      }

      currentRow.push(currentValue.trim());
      currentValue = "";

      if (currentRow.some(value => value !== "")) {
        rows.push(currentRow);
      }

      currentRow = [];
    } else {
      currentValue += character;
    }
  }

  if (currentValue !== "" || currentRow.length > 0) {
    currentRow.push(currentValue.trim());
    rows.push(currentRow);
  }

  if (rows.length === 0) {
    return [];
  }

  const [headers, ...dataRows] = rows;

  return dataRows.map(values => {
    const row = {};

    headers.forEach((header, index) => {
      row[header] = values[index] || "";
    });

    return row;
  });
}

async function loadCsvData(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const csvText = await response.text();
  return parseCsv(csvText);
}

// ===============================
// DATA LOADING
// ===============================

async function loadData() {
  setStatusMessageText("Loading character data...");
  generateButton.disabled = true;
  retryButton.hidden = true;

  try {
    // Load every sheet up front so one button click can generate everything
    // without making more network requests in the middle of a roll.
    [
      ancestries,
      heritages,
      backgrounds,
      regions,
      deities,
      weapons,
      classes,
      subclasses,
      archetypes,
      sourceDefinitions,
    ] = await Promise.all([
      loadCsvData(ancestryCsvUrl),
      loadCsvData(heritageCsvUrl),
      loadCsvData(backgroundCsvUrl),
      loadCsvData(regionCsvUrl),
      loadCsvData(deityCsvUrl),
      loadCsvData(weaponCsvUrl),
      loadCsvData(classCsvUrl),
      loadCsvData(subclassCsvUrl),
      loadCsvData(archetypeCsvUrl),
      loadCsvData(sourceCsvUrl),
    ]);

    renderSourceCheckboxes();
    renderRegionCheckboxes();
    updateRegionModeControl();
    updateWeightingGuide();

    setStatusMessageText("");
    generateButton.disabled = false;
  } catch (error) {
    console.error("Failed to load character data.", error);
    setStatusMessageText(
      "Could not load character data. Please refresh the page and try again.",
      true
    );
    generateButton.disabled = true;
    retryButton.hidden = false;
  }
}

function chooseRegion(chosenBackground) {
  if (!isRegionEnabled()) {
    return null;
  }

  const backgroundRegion = String(chosenBackground.region || "").trim();
  const backgroundContinent = String(chosenBackground.continent || "").trim();

  // A background-specific region wins over random rolling. Only blank
  // backgrounds need a fallback region from the Regions tab.
  if (backgroundRegion) {
    const matchingRegion = findRegionByName(backgroundRegion);

    return {
      name: backgroundRegion,
      continent: matchingRegion ? normalizeContinentName(matchingRegion.continent) : "",
      sourceText: chosenBackground.source
        ? `From background (${chosenBackground.source})`
        : "From background",
    };
  }

  // Some backgrounds now point to a whole continent instead of one exact
  // region. In that case we keep the continent fixed and only randomize the
  // final region inside it.
  if (backgroundContinent) {
    const chosenRegionFromContinent = chooseRegionFromContinent(
      backgroundContinent,
      chosenBackground.source
        ? `From background continent (${chosenBackground.source})`
        : "From background continent"
    );

    if (chosenRegionFromContinent) {
      return chosenRegionFromContinent;
    }
  }

  return chooseRegionFromTab();
}

function characterNeedsDeity(chosenClass, chosenBackground) {
  return isTrueValue(chosenClass?.needs_deity) || isTrueValue(chosenBackground?.needs_deity);
}

function isBackgroundCompatibleWithRegion(backgroundOption, chosenRegion) {
  if (!chosenRegion) {
    return true;
  }

  const backgroundRegion = String(backgroundOption.region || "").trim();
  const backgroundContinent = String(backgroundOption.continent || "").trim();
  const chosenRegionName = String(chosenRegion.name || "").trim().toLowerCase();
  const chosenContinentName = normalizeContinentName(chosenRegion.continent).toLowerCase();

  if (backgroundRegion) {
    return backgroundRegion.toLowerCase() === chosenRegionName;
  }

  if (backgroundContinent) {
    return backgroundContinent.toLowerCase() === chosenContinentName;
  }

  return true;
}

// ===============================
// DEITY LOGIC
// ===============================

function splitDeityCategories(value) {
  return String(value || "")
    .split(",")
    .map(category => category.trim())
    .filter(category => category !== "");
}

function getRegionalDeityCategory(chosenRegion) {
  const regionContinent = normalizeContinentName(chosenRegion?.continent);

  if (regionContinent === "Garund") {
    return "Mwangi Gods";
  }

  if (regionContinent === "Tian Xia") {
    return "Tian Gods";
  }

  return "";
}

function getAncestralDeityCategory(chosenAncestry) {
  const ancestryName = String(chosenAncestry?.name || "").trim().toLowerCase();

  if (ancestryName === "dwarf") {
    return "Dwarven Gods";
  }

  if (ancestryName === "elf") {
    return "Elven Gods";
  }

  if (ancestryName === "goblin") {
    return "Goblin Gods";
  }

  if (ancestryName === "orc") {
    return "Orc Gods";
  }

  return "";
}

function getDeityBucketName(category, chosenRegion, chosenAncestry) {
  const regionalCategory = getRegionalDeityCategory(chosenRegion);
  const ancestralCategory = getAncestralDeityCategory(chosenAncestry);

  if (category === "Gods of the Inner Sea") {
    return "Gods of the Inner Sea";
  }

  if (regionalCategory && category === regionalCategory) {
    return "Regional";
  }

  if (ancestralCategory && category === ancestralCategory) {
    return "Ancestral";
  }

  if (category === "Pantheon") {
    return "Pantheon";
  }

  if (category === "Faiths & Philosophies") {
    return "Faiths & Philosophies";
  }

  if (category === "Other Gods") {
    return "Other Gods";
  }

  return "Remaining Gods";
}

function getDeityBucketWeight(bucketName) {
  if (bucketName === "Gods of the Inner Sea") {
    return 10;
  }

  if (bucketName === "Regional") {
    return 10;
  }

  if (bucketName === "Ancestral") {
    return 8;
  }

  if (bucketName === "Pantheon") {
    return 3;
  }

  if (bucketName === "Faiths & Philosophies") {
    return 2;
  }

  if (bucketName === "Other Gods") {
    return 3;
  }

  if (bucketName === "None") {
    return 5;
  }

  return 1;
}

function getDeityBuckets(availableDeities, chosenRegion, chosenAncestry) {
  const buckets = new Map();

  availableDeities.forEach(deity => {
    const categories = splitDeityCategories(deity.category);
    const bucketNames = categories.length > 0
      ? [...new Set(categories.map(category => getDeityBucketName(category, chosenRegion, chosenAncestry)))]
      : ["Remaining Gods"];

    bucketNames.forEach(bucketName => {
      if (!buckets.has(bucketName)) {
        buckets.set(bucketName, []);
      }

      buckets.get(bucketName).push(deity);
    });
  });

  return buckets;
}

function chooseWeightedDeityBucket(buckets, requiresDeity = false) {
  const bucketEntries = [...buckets.entries()]
    .filter(([, deityList]) => deityList.length > 0)
    .map(([bucketName]) => ({
      name: bucketName,
      weight: getDeityBucketWeight(bucketName),
    }));

  if (!requiresDeity) {
    bucketEntries.push({
      name: "None",
      weight: getDeityBucketWeight("None"),
    });
  }

  const totalWeight = bucketEntries.reduce((sum, bucket) => sum + bucket.weight, 0);
  let remainingWeight = Math.random() * totalWeight;

  for (const bucket of bucketEntries) {
    remainingWeight -= bucket.weight;

    if (remainingWeight < 0) {
      return bucket.name;
    }
  }

  return bucketEntries[bucketEntries.length - 1].name;
}

function chooseDeity(chosenAncestry, chosenRegion, chosenClass, chosenBackground) {
  const requiresDeity = characterNeedsDeity(chosenClass, chosenBackground);

  if (!isDeityEnabled() && !requiresDeity) {
    return null;
  }

  const availableDeities = applyAccessAndSourceFilters(deities).filter(deity => {
    if (!requiresDeity) {
      return true;
    }

    return !splitDeityCategories(deity.category).includes("Faiths & Philosophies");
  });

  if (availableDeities.length === 0) {
    return requiresDeity ? null : {
      name: "None",
      sourceText: "",
      category: "",
      favoredWeapon: "",
    };
  }

  // Roll the deity bucket first so large categories do not become more common
  // just because they contain more entries. After that, pick one deity from
  // inside the chosen bucket.
  const deityBuckets = getDeityBuckets(availableDeities, chosenRegion, chosenAncestry);
  const chosenBucket = chooseWeightedDeityBucket(deityBuckets, requiresDeity);

  if (chosenBucket === "None") {
    return {
      name: "None",
      sourceText: "",
      category: "",
      favoredWeapon: "",
    };
  }

  const deityPool = deityBuckets.get(chosenBucket) || [];
  const deityChoice = randomItem(deityPool);

  if (!deityChoice) {
    return {
      name: "None",
      sourceText: "",
      category: "",
      favoredWeapon: "",
    };
  }

  return {
    name: deityChoice.name,
    sourceText: deityChoice.source,
    category: deityChoice.category,
    favoredWeapon: deityChoice.favored_weapon,
  };
}

// ===============================
// WEAPON LOGIC
// ===============================

function weaponGroups(weapon) {
  return [
    String(weapon.group || "").trim().toLowerCase(),
    String(weapon.secondary_group || "").trim().toLowerCase(),
  ].filter(group => group !== "");
}

function weaponMatchesAllowedCategories(weapon, chosenClass, chosenDeity = null, requiresDeity = false) {
  const allowedCategories = splitCsvValues(chosenClass.allowed_weapon_categories);
  const favoredWeapons = classFavoredSpecificWeapons(chosenClass);
  const deityWeapons = deityFavoredWeapons(chosenDeity);
  const weaponCategory = String(weapon.category || "").trim().toLowerCase();
  const weaponName = String(weapon.name || "").trim().toLowerCase();

  if (favoredWeapons.includes(weaponName)) {
    return true;
  }

  if (requiresDeity && deityWeapons.includes(weaponName)) {
    return true;
  }

  return allowedCategories.includes(weaponCategory);
}

function classFavoredWeaponGroups(chosenClass) {
  return splitCsvValues(chosenClass.favored_weapon_groups);
}

function classFavoredSpecificWeapons(chosenClass) {
  return splitCsvValues(chosenClass.favored_specific_weapons);
}

function deityFavoredWeapons(chosenDeity) {
  return splitCsvValues(chosenDeity?.favoredWeapon);
}

function classRequiresFavoredWeaponGroup(chosenClass) {
  return String(chosenClass?.name || "").trim().toLowerCase() === "gunslinger";
}

function findLegalDeityFavoredWeapon(weaponPool, chosenDeity) {
  const favoredWeapons = deityFavoredWeapons(chosenDeity);

  if (favoredWeapons.length === 0) {
    return null;
  }

  return weaponPool.find(weapon =>
    favoredWeapons.includes(String(weapon.name || "").trim().toLowerCase())
  ) || null;
}

function weaponPreferenceMultiplier(weapon, chosenClass, chosenDeity, requiresDeity) {
  let multiplier = 1;
  const weaponName = String(weapon.name || "").trim().toLowerCase();
  const favoredGroups = classFavoredWeaponGroups(chosenClass);
  const favoredWeapons = classFavoredSpecificWeapons(chosenClass);

  if (favoredGroups.some(group => weaponGroups(weapon).includes(group))) {
    multiplier *= 3;
  }

  if (favoredWeapons.includes(weaponName)) {
    multiplier *= 5;
  }

  return multiplier;
}

function weightedRandomWeapon(weaponPool, chosenClass, chosenDeity, requiresDeity) {
  if (weaponPool.length === 0) {
    return null;
  }

  const totalWeight = weaponPool.reduce(
    (sum, weapon) => sum + (rarityWeight(weapon) * weaponPreferenceMultiplier(weapon, chosenClass, chosenDeity, requiresDeity)),
    0
  );
  let remainingWeight = Math.random() * totalWeight;

  for (const weapon of weaponPool) {
    remainingWeight -= rarityWeight(weapon) * weaponPreferenceMultiplier(weapon, chosenClass, chosenDeity, requiresDeity);

    if (remainingWeight < 0) {
      return weapon;
    }
  }

  return weaponPool[weaponPool.length - 1];
}

function chooseWeapon(chosenClass, chosenDeity, chosenBackground) {
  const requiresDeity = characterNeedsDeity(chosenClass, chosenBackground);
  let availableWeapons = applyActiveFilters(weapons).filter(weapon =>
    weaponMatchesAllowedCategories(weapon, chosenClass, chosenDeity, requiresDeity)
  );

  if (availableWeapons.length === 0) {
    return null;
  }

  if (classRequiresFavoredWeaponGroup(chosenClass)) {
    const favoredGroups = classFavoredWeaponGroups(chosenClass);
    const favoredGroupWeapons = availableWeapons.filter(weapon =>
      favoredGroups.some(group => weaponGroups(weapon).includes(group))
    );

    if (favoredGroupWeapons.length > 0) {
      availableWeapons = favoredGroupWeapons;
    }
  }

  // Required-deity characters should almost always carry their deity's favored
  // weapon when it is legal for their class. We only fall back to the normal
  // weighted weapon roll about 1 time in 10.
  if (requiresDeity) {
    const legalFavoredWeapon = findLegalDeityFavoredWeapon(availableWeapons, chosenDeity);

    if (legalFavoredWeapon && Math.random() < 0.9) {
      return {
        name: legalFavoredWeapon.name,
        sourceText: legalFavoredWeapon.source,
      };
    }
  }

  const chosenWeapon = weightedRandomWeapon(availableWeapons, chosenClass, chosenDeity, requiresDeity);

  if (!chosenWeapon) {
    return null;
  }

  return {
    name: chosenWeapon.name,
    sourceText: chosenWeapon.source,
  };
}

// ===============================
// SUBCLASS LOGIC
// ===============================

function chooseSubclassesForClass(className, matchingSubclasses) {
  const normalizedClassName = className.toLowerCase().trim();

  if (normalizedClassName === "kineticist") {
    return chooseKineticistSubclasses(matchingSubclasses);
  }

  if (normalizedClassName === "exemplar") {
    return chooseExemplarSubclasses(matchingSubclasses);
  }

  return chooseStandardSubclasses(matchingSubclasses);
}

function chooseStandardSubclasses(matchingSubclasses) {
  const subclassesByType = {};

  matchingSubclasses.forEach(subclass => {
    const type = String(subclass.subclass_type).trim();

    if (!subclassesByType[type]) {
      subclassesByType[type] = [];
    }

    subclassesByType[type].push(subclass);
  });

  return Object.keys(subclassesByType)
    .sort((a, b) => Number(a) - Number(b))
    .map(type => weightedRandomItem(subclassesByType[type]))
    .filter(subclass => subclass !== null);
}

function chooseKineticistSubclasses(matchingSubclasses) {
  const type1Options = matchingSubclasses.filter(
    subclass => String(subclass.subclass_type).trim() === "1"
  );

  const type2Options = matchingSubclasses.filter(
    subclass => String(subclass.subclass_type).trim() === "2"
  );

  if (type1Options.length === 0) {
    return [];
  }

  const gateChoice = weightedRandomItem(type1Options);
  const results = [gateChoice];

  const gateName = gateChoice.name.toLowerCase().trim();

  if (gateName === "single gate") {
    if (type2Options.length > 0) {
      results.push(weightedRandomItem(type2Options));
    }
  } else if (gateName === "dual gate") {
    if (type2Options.length >= 2) {
      results.push(...weightedRandomItems(type2Options, 2));
    } else if (type2Options.length === 1) {
      results.push(type2Options[0]);
    }
  }

  return results;
}

function chooseExemplarSubclasses(matchingSubclasses) {
  const weaponIkons = matchingSubclasses.filter(
    subclass => String(subclass.notes).trim().toLowerCase() === "weapon"
  );

  if (matchingSubclasses.length < 3) {
    return [...matchingSubclasses];
  }

  if (weaponIkons.length === 0) {
    return weightedRandomItems(matchingSubclasses, 3);
  }

  const chosenWeapon = weightedRandomItem(weaponIkons);

  const remainingPool = matchingSubclasses.filter(
    subclass => subclass.name !== chosenWeapon.name
  );

  const additionalChoices = weightedRandomItems(remainingPool, 2);

  return [chosenWeapon, ...additionalChoices];
}

// ===============================
// KEY ABILITY LOGIC
// ===============================

/**
 * Turn a key ability string into separate options.
 *
 * Examples:
 * "Strength or Dexterity" => ["Strength", "Dexterity"]
 * "STR or DEX" => ["STR", "DEX"]
 * "Dexterity, Charisma" => ["Dexterity", "Charisma"]
 */
function parseKeyAbilityOptions(keyAbilityText) {
  if (!keyAbilityText) {
    return [];
  }

  return keyAbilityText
    .split(/\s+or\s+|,/i)
    .map(option => option.trim())
    .filter(option => option !== "");
}

/**
 * Remove duplicates from an array.
 */
function uniqueValues(array) {
  return [...new Set(array)];
}

/**
 * Find a chosen subclass by subclass_type.
 * Useful for classes like Psychic.
 */
function findChosenSubclassByType(chosenSubclasses, subclassType) {
  return chosenSubclasses.find(
    subclass => String(subclass.subclass_type).trim() === String(subclassType)
  );
}

/**
 * Decide the final key ability for the character.
 */
function chooseKeyAbility(chosenClass, chosenSubclasses) {
  const className = chosenClass.name.toLowerCase().trim();

  // -------------------------------
  // Special rule: Psychic
  // Key ability depends on Subconscious Mind (type 2)
  // -------------------------------
  if (className === "psychic") {
    const subconsciousMind = findChosenSubclassByType(chosenSubclasses, "2");

    if (subconsciousMind && subconsciousMind.key_ability) {
      const psychicOptions = parseKeyAbilityOptions(subconsciousMind.key_ability);
      if (psychicOptions.length > 0) {
        return {
          value: randomItem(psychicOptions),
          sourceText: `${subconsciousMind.name} (${subconsciousMind.source})`,
        };
      }
    }
  }

  // -------------------------------
  // Start with the class default options
  // -------------------------------
  let keyAbilityOptions = parseKeyAbilityOptions(chosenClass.key_ability);

  // -------------------------------
  // Special rule: Rogue
  // Rogue starts with Dexterity, but subclass may add another valid option
  // -------------------------------
  if (className === "rogue") {
    const subclassOptions = chosenSubclasses.flatMap(subclass =>
      parseKeyAbilityOptions(subclass.key_ability)
    );

    keyAbilityOptions = uniqueValues([...keyAbilityOptions, ...subclassOptions]);
  }

  // -------------------------------
  // If the class has no usable key ability data
  // -------------------------------
  if (keyAbilityOptions.length === 0) {
    return {
      value: "Unknown",
      sourceText: "",
    };
  }

  // -------------------------------
  // Pick one final key ability from the valid options
  // -------------------------------
  const chosenValue = randomItem(keyAbilityOptions);
  const matchingSources = [];

  if (parseKeyAbilityOptions(chosenClass.key_ability).includes(chosenValue) && chosenClass.source) {
    matchingSources.push(chosenClass.source);
  }

  chosenSubclasses.forEach(subclass => {
    if (parseKeyAbilityOptions(subclass.key_ability).includes(chosenValue) && subclass.source) {
      matchingSources.push(`${subclass.name} (${subclass.source})`);
    }
  });

  return {
    value: chosenValue,
    sourceText: uniqueValues(matchingSources).join(" | "),
  };
}

// ===============================
// MAIN CHARACTER GENERATION
// ===============================

function generateCharacter() {
  if (generateButton.disabled) {
    return;
  }

  // Start by building the legal pools under the current filters. From here on,
  // every roll should come from these filtered lists or from data tied to them.
  const availableAncestries = applyActiveFilters(ancestries);
  const availableBackgrounds = applyActiveFilters(backgrounds);
  const availableClasses = filterClassesForLockedArchetype(
    applyActiveFilters(classes),
    isArchetypeEnabled() ? lockedSelections.archetype : null
  );

  if (
    availableAncestries.length === 0 ||
    availableBackgrounds.length === 0 ||
    availableClasses.length === 0
  ) {
    setStatusMessageText(
      "No options match the current filters. Try allowing more rarities or access entries.",
      true
    );
    return;
  }

  setStatusMessageText("");

  let ancestry = lockedSelections.ancestry;
  let heritage = lockedSelections.heritage;
  let background = lockedSelections.background;
  let chosenRegion = isRegionEnabled() ? lockedSelections.region : null;
  let chosenClass = lockedSelections.class;
  let chosenSubclasses = lockedSelections.subclasses;
  let chosenKeyAbility = lockedSelections.keyAbility;
  let chosenDeity = isDeityEnabled() ? lockedSelections.deity : null;
  let chosenWeapon = lockedSelections.weapon;
  let chosenArchetype = isArchetypeEnabled() ? lockedSelections.archetype : null;

  // A locked archetype can imply extra rules, like needing a spellcaster or a
  // specific ancestry. This helper lines those dependencies up before rolling.
  ({
    chosenClass,
    chosenAncestry: ancestry,
  } = {
    chosenClass,
    chosenAncestry: ancestry,
    ...syncSelectionsFromLockedArchetype(chosenArchetype, chosenClass, ancestry),
  });

  if (!ancestry && heritage) {
    ancestry = findAncestryByName(heritage.ancestry) || { name: heritage.ancestry };
  }

  if (!chosenClass && chosenSubclasses && chosenSubclasses.length > 0) {
    chosenClass =
      findClassByName(chosenSubclasses[0].class) || { name: chosenSubclasses[0].class };
  }

  if (background && chosenRegion && !isBackgroundCompatibleWithRegion(background, chosenRegion)) {
    setStatusMessageText(
      "The locked Background and locked Region do not match. Unlock one of them to continue.",
      true
    );
    return;
  }

  // Pick the main character pieces in dependency order so later choices have
  // the information they need: heritage needs ancestry, subclasses need class,
  // and key ability may depend on subclass details.
  if (!ancestry) {
    ancestry = weightedRandomItem(availableAncestries);
  }

  // Pick matching heritage
  const matchingHeritages = applyActiveFilters(heritages).filter(
    heritageOption => heritageOption.ancestry.toLowerCase() === ancestry.name.toLowerCase()
  );
  if (!heritage) {
    heritage = matchingHeritages.length > 0
      ? weightedRandomItem(matchingHeritages)
      : null;
  }

  // Pick background
  if (!background) {
    const compatibleBackgrounds = chosenRegion
      ? availableBackgrounds.filter(backgroundOption =>
          isBackgroundCompatibleWithRegion(backgroundOption, chosenRegion)
        )
      : availableBackgrounds;

    if (compatibleBackgrounds.length === 0) {
      setStatusMessageText(
        "No backgrounds match the locked Region and current filters. Unlock Region or allow more options.",
        true
      );
      return;
    }

    background = weightedRandomItem(compatibleBackgrounds);
  }

  // Pick class
  if (!chosenClass) {
    chosenClass = weightedRandomItem(availableClasses);
  }

  // Pick subclass/subclasses
  const matchingSubclasses = applyActiveFilters(subclasses).filter(
    subclass => subclass.class.toLowerCase() === chosenClass.name.toLowerCase()
  );
  if (!chosenSubclasses) {
    chosenSubclasses = chooseSubclassesForClass(chosenClass.name, matchingSubclasses);
  }

  // Pick final key ability
  if (!chosenKeyAbility) {
    chosenKeyAbility = chooseKeyAbility(chosenClass, chosenSubclasses);
  }

  if (!chosenArchetype) {
    chosenArchetype = chooseArchetype(chosenClass, chosenSubclasses, ancestry);
  }

  if (!chosenRegion) {
    chosenRegion = chooseRegion(background);
  }

  if (isRegionEnabled() && !chosenRegion) {
    setStatusMessageText(
      regionModeSelect.value === "custom"
        ? "No continents are selected for custom region rolling. Choose at least one continent."
        : "No regions are available for the current region settings.",
      true
    );
    return;
  }

  if (!chosenDeity) {
    chosenDeity = chooseDeity(ancestry, chosenRegion, chosenClass, background);
  }

  if (characterNeedsDeity(chosenClass, background) && !chosenDeity) {
    setStatusMessageText(
      "The current filters do not allow a valid deity for this class or background.",
      true
    );
    return;
  }

  if (!chosenWeapon) {
    chosenWeapon = chooseWeapon(chosenClass, chosenDeity, background);
  }

  if (!chosenWeapon) {
    setStatusMessageText(
      "No weapons match the current class, filters, and source settings.",
      true
    );
    return;
  }

  currentCharacter = {
    ancestry: cloneValue(ancestry),
    heritage: cloneValue(heritage),
    background: cloneValue(background),
    region: cloneValue(chosenRegion),
    class: cloneValue(chosenClass),
    keyAbility: cloneValue(chosenKeyAbility),
    deity: cloneValue(chosenDeity),
    weapon: cloneValue(chosenWeapon),
    archetype: cloneValue(chosenArchetype),
    subclasses: cloneValue(chosenSubclasses),
  };

  updateSecondaryResultsVisibility();

  // Display simple results
  setValueAndSource("ancestryResult", "ancestrySource", ancestry.name, ancestry.source);
  setValueAndSource(
    "heritageResult",
    "heritageSource",
    heritage ? heritage.name : "None",
    heritage ? heritage.source : ""
  );
  setValueAndSource("backgroundResult", "backgroundSource", background.name, background.source);
  setValueAndSource(
    "regionResult",
    "regionSource",
    chosenRegion ? chosenRegion.name : "Off",
    chosenRegion ? chosenRegion.sourceText : ""
  );
  setValueAndSource("classResult", "classSource", chosenClass.name, chosenClass.source);
  document.getElementById("keyAbilityResult").textContent = chosenKeyAbility.value;
  setValueAndSource(
    "deityResult",
    "deitySource",
    chosenDeity
      ? chosenDeity.name
      : (isDeityEnabled() ? "None" : "Off"),
    chosenDeity ? chosenDeity.sourceText : ""
  );
  setValueAndSource("weaponResult", "weaponSource", chosenWeapon.name, chosenWeapon.sourceText);
  setValueAndSource(
    "archetypeResult",
    "archetypeSource",
    isArchetypeEnabled()
      ? (chosenArchetype ? chosenArchetype.name : "None")
      : "Off",
    isArchetypeEnabled() && chosenArchetype ? chosenArchetype.source : ""
  );

  // Display subclasses nicely as separate boxes
  const subclassResultElement = document.getElementById("subclassResult");
  subclassResultElement.replaceChildren();

  if (chosenSubclasses.length > 0) {
    chosenSubclasses.forEach(subclass => {
      const subclassItem = document.createElement("div");
      subclassItem.className = "subclass-item";
      const subclassText = document.createElement("span");
      subclassText.textContent = subclass.subclass_label
        ? `${subclass.subclass_label}: ${subclass.name}`
        : subclass.name;

      subclassItem.appendChild(subclassText);

      const sourceButton = createSourceButton(subclass.source);
      if (sourceButton) {
        subclassItem.appendChild(sourceButton);
      }

      subclassResultElement.appendChild(subclassItem);
    });
  } else {
    const subclassItem = document.createElement("div");
    subclassItem.className = "subclass-item";
    subclassItem.textContent = "None";
    subclassResultElement.appendChild(subclassItem);
  }

  updateWeightingGuide();
}

// ===============================
// PAGE SETUP
// ===============================

generateButton.addEventListener("click", generateCharacter);
retryButton.addEventListener("click", loadData);
rarityFilterSelect.addEventListener("change", () => {
  updateRarityModeControl();
  updateWeightingGuide();
});
rarityModeSelect.addEventListener("change", () => {
  updateWeightingGuide();
});
regionToggleSelect.addEventListener("change", () => {
  if (!isRegionEnabled()) {
    lockedSelections.region = null;
    updateLockButtons();
  }

  updateRegionModeControl();
  updateSecondaryResultsVisibility();
  updateWeightingGuide();
});
regionModeSelect.addEventListener("change", () => {
  updateRegionModeControl();
  updateWeightingGuide();
});
regionCheckboxGroups.addEventListener("change", updateWeightingGuide);
sourcePresetSelect.addEventListener("change", applySourcePreset);
archetypeToggleSelect.addEventListener("change", () => {
  if (!isArchetypeEnabled()) {
    lockedSelections.archetype = null;
    updateLockButtons();
  }

  updateSecondaryResultsVisibility();
  updateWeightingGuide();
});
deityToggleSelect.addEventListener("change", () => {
  if (!isDeityEnabled()) {
    lockedSelections.deity = null;
    updateLockButtons();
  }

  updateSecondaryResultsVisibility();
  updateWeightingGuide();
});
themeToggle.addEventListener("click", () => {
  const theme = document.body.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem(themeStorageKey, theme);
  applyTheme(theme);
});
document.addEventListener("click", event => {
  if (event.target.closest(".source-popover")) {
    return;
  }

  document.querySelectorAll(".source-popover.is-open").forEach(popover => {
    popover.classList.remove("is-open");
    const button = popover.querySelector(".source-button");
    if (button) {
      button.setAttribute("aria-expanded", "false");
    }
  });
});
lockButtons.ancestry.addEventListener("click", () => toggleLock("ancestry"));
lockButtons.heritage.addEventListener("click", () => toggleLock("heritage"));
lockButtons.background.addEventListener("click", () => toggleLock("background"));
lockButtons.region.addEventListener("click", () => toggleLock("region"));
lockButtons.class.addEventListener("click", () => toggleLock("class"));
lockButtons.keyAbility.addEventListener("click", () => toggleLock("keyAbility"));
lockButtons.deity.addEventListener("click", () => toggleLock("deity"));
lockButtons.weapon.addEventListener("click", () => toggleLock("weapon"));
lockButtons.archetype.addEventListener("click", () => toggleLock("archetype"));
lockButtons.subclasses.addEventListener("click", () => toggleLock("subclasses"));
updateLockButtons();
initializeTheme();
updateRarityModeControl();
updateRegionModeControl();
updateSecondaryResultsVisibility();
updateWeightingGuide();
loadData();
