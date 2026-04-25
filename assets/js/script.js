// ===============================
// LOCAL WORKBOOK
// ===============================
const workbookUrl = "assets/data/generatordata.xlsx";

const workbookSheets = {
  ancestries: "Ancestries",
  heritages: "Heritages",
  backgrounds: "Backgrounds",
  classes: "Classes",
  subclasses: "Subclasses",
  archetypes: "Archetypes",
  regions: "Regions",
  deities: "Deities",
  weapons: "Weapons",
  sources: "Sources",
};

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
const classChoiceSelect = document.getElementById("classChoice");
const startingContinentSelect = document.getElementById("startingContinent");
const regionModeGroup = document.getElementById("regionModeGroup");
const regionModeSelect = document.getElementById("regionMode");
const rarityCommonWeightInput = document.getElementById("rarityCommonWeight");
const rarityUncommonWeightInput = document.getElementById("rarityUncommonWeight");
const rarityRareWeightInput = document.getElementById("rarityRareWeight");
const regionInnerSeaWeightInput = document.getElementById("regionInnerSeaWeight");
const regionOtherWeightInput = document.getElementById("regionOtherWeight");
const deityInnerSeaWeightInput = document.getElementById("deityInnerSeaWeight");
const deityRegionalWeightInput = document.getElementById("deityRegionalWeight");
const deityAncestralWeightInput = document.getElementById("deityAncestralWeight");
const deityPantheonWeightInput = document.getElementById("deityPantheonWeight");
const deityFaithWeightInput = document.getElementById("deityFaithWeight");
const deityOtherWeightInput = document.getElementById("deityOtherWeight");
const deityRemainingWeightInput = document.getElementById("deityRemainingWeight");
const deityNoneWeightInput = document.getElementById("deityNoneWeight");
const archetypeClassWeightInput = document.getElementById("archetypeClassWeight");
const archetypeOtherWeightInput = document.getElementById("archetypeOtherWeight");
const weaponGroupMultiplierInput = document.getElementById("weaponGroupMultiplier");
const weaponSpecificMultiplierInput = document.getElementById("weaponSpecificMultiplier");
const deityWeaponChanceInput = document.getElementById("deityWeaponChance");
const sourcePresetSelect = document.getElementById("sourcePreset");
const sourceCheckboxGroups = document.getElementById("sourceCheckboxGroups");
const customRegionGroup = document.getElementById("customRegionGroup");
const regionCheckboxGroups = document.getElementById("regionCheckboxGroups");
const themeToggle = document.getElementById("themeToggle");
const rememberSettingsCheckbox = document.getElementById("rememberSettings");
const resetDefaultsButton = document.getElementById("resetDefaultsBtn");
const regionModeHint = document.getElementById("regionModeHint");
const rarityWeightingGuide = document.getElementById("rarityWeightingGuide");
const startingContinentWeightingGuide = document.getElementById("startingContinentWeightingGuide");
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
const settingsStorageKey = "pf2e-generator-settings";
const rememberSettingsStorageKey = "pf2e-generator-remember-settings";
let pendingSettingsToApply = null;

const defaultGeneratorSettings = {
  rarityFilter: "all",
  rarityMode: "strong",
  rarityCommonWeight: 10,
  rarityUncommonWeight: 3,
  rarityRareWeight: 1,
  accessFilter: "standard-only",
  regionToggle: "on",
  archetypeToggle: "on",
  deityToggle: "on",
  classChoice: "",
  startingContinent: "",
  regionMode: "inner-sea",
  regionInnerSeaWeight: 3,
  regionOtherWeight: 1,
  deityInnerSeaWeight: 10,
  deityRegionalWeight: 10,
  deityAncestralWeight: 8,
  deityPantheonWeight: 3,
  deityFaithWeight: 2,
  deityOtherWeight: 3,
  deityRemainingWeight: 1,
  deityNoneWeight: 5,
  archetypeClassWeight: 1,
  archetypeOtherWeight: 1,
  weaponGroupMultiplier: 3,
  weaponSpecificMultiplier: 5,
  deityWeaponChance: 90,
  sourcePreset: "core-rulebooks-lost-omens",
};

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

function applyRarityPresetWeights() {
  const rarityFilter = rarityFilterSelect.value;
  const rarityMode = rarityModeSelect.value;

  if (rarityMode === "off") {
    rarityCommonWeightInput.value = 1;
    rarityUncommonWeightInput.value = 1;
    rarityRareWeightInput.value = 1;
    return;
  }

  if (rarityMode === "light") {
    rarityCommonWeightInput.value = 4;
    rarityUncommonWeightInput.value = 3;
    rarityRareWeightInput.value = rarityFilter === "all" ? 2 : 1;
    return;
  }

  rarityCommonWeightInput.value = rarityFilter === "common-uncommon" ? 6 : 10;
  rarityUncommonWeightInput.value = 3;
  rarityRareWeightInput.value = 1;
}

function applyRegionPresetWeights() {
  if (regionModeSelect.value === "explore") {
    regionInnerSeaWeightInput.value = 1;
    regionOtherWeightInput.value = 3;
    return;
  }

  if (regionModeSelect.value === "balanced") {
    regionInnerSeaWeightInput.value = 1;
    regionOtherWeightInput.value = 1;
    return;
  }

  if (regionModeSelect.value === "inner-sea") {
    regionInnerSeaWeightInput.value = 3;
    regionOtherWeightInput.value = 1;
  }
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

function getDefaultGeneratorSettings() {
  return {
    ...defaultGeneratorSettings,
    selectedSources: null,
    selectedContinents: null,
  };
}

function numberInputValue(input, fallback) {
  const parsedValue = Number(input.value);

  if (!Number.isFinite(parsedValue)) {
    return fallback;
  }

  return Math.max(0, parsedValue);
}

function integerInputValue(input, fallback) {
  return Math.round(numberInputValue(input, fallback));
}

function rarityWeights() {
  return {
    common: integerInputValue(rarityCommonWeightInput, defaultGeneratorSettings.rarityCommonWeight),
    uncommon: integerInputValue(rarityUncommonWeightInput, defaultGeneratorSettings.rarityUncommonWeight),
    rare: integerInputValue(rarityRareWeightInput, defaultGeneratorSettings.rarityRareWeight),
  };
}

function regionWeights() {
  return {
    innerSea: integerInputValue(regionInnerSeaWeightInput, defaultGeneratorSettings.regionInnerSeaWeight),
    other: integerInputValue(regionOtherWeightInput, defaultGeneratorSettings.regionOtherWeight),
  };
}

function deityWeights() {
  return {
    innerSea: integerInputValue(deityInnerSeaWeightInput, defaultGeneratorSettings.deityInnerSeaWeight),
    regional: integerInputValue(deityRegionalWeightInput, defaultGeneratorSettings.deityRegionalWeight),
    ancestral: integerInputValue(deityAncestralWeightInput, defaultGeneratorSettings.deityAncestralWeight),
    pantheon: integerInputValue(deityPantheonWeightInput, defaultGeneratorSettings.deityPantheonWeight),
    faith: integerInputValue(deityFaithWeightInput, defaultGeneratorSettings.deityFaithWeight),
    other: integerInputValue(deityOtherWeightInput, defaultGeneratorSettings.deityOtherWeight),
    remaining: integerInputValue(deityRemainingWeightInput, defaultGeneratorSettings.deityRemainingWeight),
    none: integerInputValue(deityNoneWeightInput, defaultGeneratorSettings.deityNoneWeight),
  };
}

function archetypeWeights() {
  return {
    classWeight: integerInputValue(archetypeClassWeightInput, defaultGeneratorSettings.archetypeClassWeight),
    otherWeight: integerInputValue(archetypeOtherWeightInput, defaultGeneratorSettings.archetypeOtherWeight),
  };
}

function weaponWeights() {
  return {
    groupMultiplier: integerInputValue(weaponGroupMultiplierInput, defaultGeneratorSettings.weaponGroupMultiplier),
    specificMultiplier: integerInputValue(weaponSpecificMultiplierInput, defaultGeneratorSettings.weaponSpecificMultiplier),
    deityChance: numberInputValue(deityWeaponChanceInput, defaultGeneratorSettings.deityWeaponChance),
  };
}

function isRememberSettingsEnabled() {
  return rememberSettingsCheckbox.checked;
}

function setRememberSettingsEnabled(enabled, persist = true) {
  rememberSettingsCheckbox.checked = enabled;

  if (persist) {
    localStorage.setItem(rememberSettingsStorageKey, String(enabled));
  }

  if (!enabled) {
    localStorage.removeItem(settingsStorageKey);
  }
}

function initializeRememberSettingsPreference() {
  const savedPreference = localStorage.getItem(rememberSettingsStorageKey);
  setRememberSettingsEnabled(savedPreference !== "false", false);
}

function getSavedGeneratorSettings() {
  const savedSettings = localStorage.getItem(settingsStorageKey);

  if (!savedSettings) {
    return null;
  }

  try {
    return JSON.parse(savedSettings);
  } catch (error) {
    console.error("Could not read saved generator settings.", error);
    return null;
  }
}

function collectCurrentSettings() {
  const sourceInputs = sourceCheckboxGroups.querySelectorAll("input[type=\"checkbox\"]");
  const regionInputs = regionCheckboxGroups.querySelectorAll("input[type=\"checkbox\"]");
  const currentRarityWeights = rarityWeights();
  const currentRegionWeights = regionWeights();
  const currentDeityWeights = deityWeights();
  const currentArchetypeWeights = archetypeWeights();
  const currentWeaponWeights = weaponWeights();

  return {
    rarityFilter: rarityFilterSelect.value,
    rarityMode: rarityModeSelect.value,
    rarityCommonWeight: currentRarityWeights.common,
    rarityUncommonWeight: currentRarityWeights.uncommon,
    rarityRareWeight: currentRarityWeights.rare,
    accessFilter: accessFilterSelect.value,
    regionToggle: regionToggleSelect.value,
    archetypeToggle: archetypeToggleSelect.value,
    deityToggle: deityToggleSelect.value,
    classChoice: classChoiceSelect.value,
    startingContinent: startingContinentSelect.value,
    regionMode: regionModeSelect.value,
    regionInnerSeaWeight: currentRegionWeights.innerSea,
    regionOtherWeight: currentRegionWeights.other,
    deityInnerSeaWeight: currentDeityWeights.innerSea,
    deityRegionalWeight: currentDeityWeights.regional,
    deityAncestralWeight: currentDeityWeights.ancestral,
    deityPantheonWeight: currentDeityWeights.pantheon,
    deityFaithWeight: currentDeityWeights.faith,
    deityOtherWeight: currentDeityWeights.other,
    deityRemainingWeight: currentDeityWeights.remaining,
    deityNoneWeight: currentDeityWeights.none,
    archetypeClassWeight: currentArchetypeWeights.classWeight,
    archetypeOtherWeight: currentArchetypeWeights.otherWeight,
    weaponGroupMultiplier: currentWeaponWeights.groupMultiplier,
    weaponSpecificMultiplier: currentWeaponWeights.specificMultiplier,
    deityWeaponChance: currentWeaponWeights.deityChance,
    sourcePreset: sourcePresetSelect.value,
    selectedSources: sourceInputs.length > 0
      ? [...sourceInputs].filter(input => input.checked).map(input => input.value)
      : null,
    selectedContinents: regionInputs.length > 0
      ? [...regionInputs].filter(input => input.checked).map(input => input.value)
      : null,
  };
}

function applySelectedCheckboxValues(container, selectedValues) {
  const selectedValueSet = new Set(selectedValues || []);

  container.querySelectorAll("input[type=\"checkbox\"]").forEach(input => {
    input.checked = selectedValueSet.has(input.value);
  });
}

function applyGeneratorSettings(settings = {}) {
  const resolvedSettings = {
    ...getDefaultGeneratorSettings(),
    ...settings,
  };

  rarityFilterSelect.value = resolvedSettings.rarityFilter;
  updateRarityModeControl();
  rarityModeSelect.value = resolvedSettings.rarityMode;
  rarityCommonWeightInput.value = resolvedSettings.rarityCommonWeight;
  rarityUncommonWeightInput.value = resolvedSettings.rarityUncommonWeight;
  rarityRareWeightInput.value = resolvedSettings.rarityRareWeight;
  accessFilterSelect.value = resolvedSettings.accessFilter;
  regionToggleSelect.value = resolvedSettings.regionToggle;
  archetypeToggleSelect.value = resolvedSettings.archetypeToggle;
  deityToggleSelect.value = resolvedSettings.deityToggle;
  renderClassChoiceOptions(resolvedSettings.classChoice);
  renderStartingContinentOptions(resolvedSettings.startingContinent);
  regionModeSelect.value = resolvedSettings.regionMode;
  regionInnerSeaWeightInput.value = resolvedSettings.regionInnerSeaWeight;
  regionOtherWeightInput.value = resolvedSettings.regionOtherWeight;
  deityInnerSeaWeightInput.value = resolvedSettings.deityInnerSeaWeight;
  deityRegionalWeightInput.value = resolvedSettings.deityRegionalWeight;
  deityAncestralWeightInput.value = resolvedSettings.deityAncestralWeight;
  deityPantheonWeightInput.value = resolvedSettings.deityPantheonWeight;
  deityFaithWeightInput.value = resolvedSettings.deityFaithWeight;
  deityOtherWeightInput.value = resolvedSettings.deityOtherWeight;
  deityRemainingWeightInput.value = resolvedSettings.deityRemainingWeight;
  deityNoneWeightInput.value = resolvedSettings.deityNoneWeight;
  archetypeClassWeightInput.value = resolvedSettings.archetypeClassWeight;
  archetypeOtherWeightInput.value = resolvedSettings.archetypeOtherWeight;
  weaponGroupMultiplierInput.value = resolvedSettings.weaponGroupMultiplier;
  weaponSpecificMultiplierInput.value = resolvedSettings.weaponSpecificMultiplier;
  deityWeaponChanceInput.value = resolvedSettings.deityWeaponChance;
  sourcePresetSelect.value = resolvedSettings.sourcePreset;

  updateRegionModeControl();
  updateSecondaryResultsVisibility();
  updateWeightingGuide();

  if (sourceCheckboxGroups.children.length > 0) {
    if (Array.isArray(resolvedSettings.selectedSources)) {
      applySelectedCheckboxValues(sourceCheckboxGroups, resolvedSettings.selectedSources);
    } else {
      applySourcePreset();
    }
  }

  if (regionCheckboxGroups.children.length > 0) {
    if (Array.isArray(resolvedSettings.selectedContinents)) {
      applySelectedCheckboxValues(regionCheckboxGroups, resolvedSettings.selectedContinents);
    } else {
      regionCheckboxGroups.querySelectorAll("input[type=\"checkbox\"]").forEach(input => {
        input.checked = true;
      });
    }
  }

  updateWeightingGuide();
}

function saveGeneratorSettings() {
  if (!isRememberSettingsEnabled()) {
    return;
  }

  localStorage.setItem(settingsStorageKey, JSON.stringify(collectCurrentSettings()));
}

function resetLockedSelections() {
  Object.keys(lockedSelections).forEach(key => {
    lockedSelections[key] = null;
  });
  updateLockButtons();
}

function resetGeneratorDefaults() {
  const defaultSettings = getDefaultGeneratorSettings();
  setRememberSettingsEnabled(true);
  resetLockedSelections();
  applyGeneratorSettings(defaultSettings);
  saveGeneratorSettings();
  setStatusMessageText("");
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

function selectedStartingContinent() {
  return normalizeContinentName(startingContinentSelect.value);
}

function selectedAncestryRarityColumn() {
  const continent = selectedStartingContinent().toLowerCase();

  if (continent === "avistan") {
    return "rarity_avistan";
  }

  if (continent === "garund") {
    return "rarity_garund";
  }

  if (continent === "tian xia") {
    return "rarity_tianxia";
  }

  if (continent === "casmaron") {
    return "rarity_casmaron";
  }

  if (continent === "arcadia") {
    return "rarity_arcadia";
  }

  return "";
}

function normalizeRarity(item) {
  const ancestryRarityColumn = selectedAncestryRarityColumn();
  const ancestryOverride = ancestryRarityColumn
    ? String(item[ancestryRarityColumn] || "").toLowerCase().trim()
    : "";
  const baseRarity = String(item.rarity || "common").toLowerCase().trim();

  return ancestryOverride || baseRarity;
}

function baseRarity(item) {
  return String(item.rarity || "common").toLowerCase().trim();
}

function continentOverrideRarity(item, continent) {
  const normalizedContinent = normalizeContinentName(continent).toLowerCase();

  if (!normalizedContinent) {
    return "";
  }

  const columnMap = {
    avistan: "rarity_avistan",
    garund: "rarity_garund",
    "tian xia": "rarity_tianxia",
    casmaron: "rarity_casmaron",
    arcadia: "rarity_arcadia",
  };

  const columnName = columnMap[normalizedContinent];
  return columnName ? String(item[columnName] || "").toLowerCase().trim() : "";
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

function renderStartingContinentOptions(preferredValue = startingContinentSelect.value) {
  const normalizedPreferredValue = normalizeContinentName(preferredValue).toLowerCase();

  startingContinentSelect.replaceChildren();

  const noneOption = document.createElement("option");
  noneOption.value = "";
  noneOption.textContent = "No Preference";
  startingContinentSelect.appendChild(noneOption);

  getAvailableContinents().forEach(continent => {
    const optionElement = document.createElement("option");
    optionElement.value = continent;
    optionElement.textContent = continent;
    startingContinentSelect.appendChild(optionElement);
  });

  const hasPreferredValue = [...startingContinentSelect.options].some(
    option => normalizeContinentName(option.value).toLowerCase() === normalizedPreferredValue
  );

  startingContinentSelect.value = hasPreferredValue ? preferredValue : "";
}

function updateArchetypeVisibility() {
  archetypeSection.hidden = !isArchetypeEnabled();
}

function updateDeityVisibility() {
  deitySection.hidden = !(isDeityEnabled() || characterNeedsDeity(
    currentCharacter?.class,
    currentCharacter?.background,
    currentCharacter?.subclasses
  ));
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
  const currentArchetypeWeights = archetypeWeights();
  const bucketWeights = [
    { name: "class", weight: currentArchetypeWeights.classWeight, pool: classArchetypes },
    { name: "other", weight: currentArchetypeWeights.otherWeight, pool: otherArchetypes },
  ];
  const availableBuckets = bucketWeights.filter(bucket => bucket.pool.length > 0);
  const totalBucketWeight = availableBuckets.reduce((sum, bucket) => sum + bucket.weight, 0);
  let preferredBucket = null;

  if (totalBucketWeight <= 0) {
    preferredBucket = randomItem(availableBuckets) || null;
  } else {
    let remainingWeight = Math.random() * totalBucketWeight;

    for (const bucket of availableBuckets) {
      remainingWeight -= bucket.weight;

      if (remainingWeight < 0) {
        preferredBucket = bucket;
        break;
      }
    }
  }

  const preferredPool = preferredBucket?.pool || [];
  const fallbackPool = preferredBucket?.name === "class" ? otherArchetypes : classArchetypes;
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
  const currentWeights = rarityWeights();
  const startingContinent = selectedStartingContinent();

  if (allowedRarities.length === 1) {
    return [
      "Only common entries can be rolled.",
      "This applies to ancestries, heritages, backgrounds, classes, subclasses, and archetypes.",
    ];
  }

  return [
    `Allowed rarities: ${allowedRarities.join(", ")}.`,
    allowedRarities.includes("rare")
      ? `Current weights: Common ${currentWeights.common}, Uncommon ${currentWeights.uncommon}, Rare ${currentWeights.rare}.`
      : `Current weights: Common ${currentWeights.common}, Uncommon ${currentWeights.uncommon}.`,
    startingContinent
      ? `Ancestries also use continent-specific rarity overrides for ${startingContinent} when those ancestry columns are filled in.`
      : "Ancestries currently use their normal rarity values.",
  ];
}

function getCurrentStartingContinentWeightingItems() {
  const startingContinent = selectedStartingContinent();

  if (!startingContinent) {
    return [
      "No starting continent is selected.",
      "Ancestries use their normal rarity unless another filter changes the pool.",
    ];
  }

  const changedAncestries = filterBySource(filterByAccess(ancestries))
    .map(ancestry => {
      const overrideRarity = continentOverrideRarity(ancestry, startingContinent);

      if (!overrideRarity) {
        return null;
      }

      return `${ancestry.name}: ${baseRarity(ancestry)} -> ${overrideRarity}`;
    })
    .filter(item => item !== null);

  if (changedAncestries.length === 0) {
    return [
      `Starting continent is ${startingContinent}.`,
      "No ancestry entries currently have a special rarity override for that continent.",
    ];
  }

  return [
    `Starting continent is ${startingContinent}.`,
    "These ancestries currently change rarity for that continent:",
    ...changedAncestries,
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
  const currentRegionWeights = regionWeights();
  const startingContinent = selectedStartingContinent();

  if (startingContinent) {
    items.push(`Starting Continent is set to ${startingContinent}, so free region rolls use that continent directly.`);
  }

  if (regionModeSelect.value === "inner-sea") {
    items.push(`Current continent weights: Avistan ${currentRegionWeights.innerSea}, Garund ${currentRegionWeights.innerSea}, all other continents ${currentRegionWeights.other}.`);
  } else if (regionModeSelect.value === "explore") {
    items.push(`Current continent weights: Avistan ${currentRegionWeights.innerSea}, Garund ${currentRegionWeights.innerSea}, all other continents ${currentRegionWeights.other}.`);
  } else if (regionModeSelect.value === "balanced") {
    items.push(`Current continent weights: all continents use the current numbers, which are Inner Sea ${currentRegionWeights.innerSea} and Other ${currentRegionWeights.other}.`);
  } else {
    const selectedContinents = [...getSelectedCustomContinents()];
    items.push(
      selectedContinents.length > 0
        ? `Custom mode: only these continents can be rolled. Inner Sea continents use weight ${currentRegionWeights.innerSea}; other continents use weight ${currentRegionWeights.other}. Selected continents: ${selectedContinents.join(", ")}.`
        : "Custom mode: no continents are currently selected."
    );
  }

  return items;
}

function getCurrentDeityWeightingItems() {
  if (!isDeityEnabled() && !characterNeedsDeity(
    currentCharacter?.class,
    currentCharacter?.background,
    currentCharacter?.subclasses
  )) {
    return ["Deity rolling is currently turned off."];
  }

  const items = [
    "The generator rolls a deity bucket first, then rolls a deity inside that bucket.",
    `Current bucket weights: Gods of the Inner Sea ${deityWeights().innerSea}, Regional ${deityWeights().regional}, Ancestral ${deityWeights().ancestral}, Pantheon ${deityWeights().pantheon}, Faiths & Philosophies ${deityWeights().faith}, Other Gods ${deityWeights().other}, Remaining Gods ${deityWeights().remaining}, None ${deityWeights().none}.`,
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
    `The generator first tries a weighted split between Class archetypes (${archetypeWeights().classWeight}) and Other archetypes (${archetypeWeights().otherWeight}).`,
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

    const subclassGroups = subclassWeaponGroups(currentCharacter.subclasses || []);
    const subclassSpecifics = subclassSpecificWeapons(currentCharacter.subclasses || []);
    const subclassTraits = subclassWeaponTraits(currentCharacter.subclasses || []);
    const favoredTraits = splitCsvValues(currentCharacter.class.favored_weapon_traits);
    const favoredGroups = splitCsvValues(currentCharacter.class.favored_weapon_groups);
    const favoredSpecificWeapons = splitCsvValues(currentCharacter.class.favored_specific_weapons);

    if (subclassSpecifics.length > 0) {
      items.push(`Current subclass specific-weapon requirement: ${subclassSpecifics.join(", ")}.`);
    } else if (subclassGroups.length > 0) {
      items.push(`Current subclass weapon-group requirement: ${subclassGroups.join(", ")}.`);
    } else if (subclassTraits.includes("any")) {
      items.push("Current subclass overrides trait filtering and allows any weapon the class normally allows.");
    } else if (subclassTraits.length > 0) {
      items.push(`Current subclass weapon trait requirement: ${subclassTraits.join(", ")}.`);
    } else if (favoredTraits.length > 0) {
      items.push(`Class weapon traits required: ${favoredTraits.join(", ")}.`);
    }

    if (favoredGroups.length > 0) {
      items.push(`Class group preference: ${favoredGroups.join(", ")} (multiplier ${weaponWeights().groupMultiplier}).`);
    }

    if (favoredSpecificWeapons.length > 0) {
      items.push(`Class specific-weapon preference: ${favoredSpecificWeapons.join(", ")} (multiplier ${weaponWeights().specificMultiplier}).`);
    }
  } else {
    items.push("Class preferences are applied after a class has been rolled.");
  }

  items.push("If the character must have a deity and the deity's favored weapon is legal for the class, it is strongly favored.");
  items.push(`For required-deity characters, there is currently a ${weaponWeights().deityChance}% chance to use the legal deity-favored weapon before the normal weapon roll happens.`);
  return items;
}

function updateWeightingGuide() {
  renderWeightingItems(rarityWeightingGuide, getCurrentRarityWeightingItems());
  renderWeightingItems(startingContinentWeightingGuide, getCurrentStartingContinentWeightingItems());
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
  const currentRegionWeights = regionWeights();

  // Region weighting is separate from normal rarity weighting because the
  // Regions sheet does not use rarity. Instead, continent choice is weighted.
  return isInnerSeaContinent ? currentRegionWeights.innerSea : currentRegionWeights.other;
}

function weightedRandomContinent(continents) {
  if (continents.length === 0) {
    return null;
  }

  const totalWeight = continents.reduce((sum, continent) => sum + continentWeight(continent), 0);

  if (totalWeight <= 0) {
    return randomItem(continents);
  }

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
  const startingContinent = selectedStartingContinent();

  if (startingContinent && regionsByContinent.has(startingContinent)) {
    continentPool = [startingContinent];
  }

  if (!startingContinent && regionModeSelect.value === "custom") {
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

function renderClassChoiceOptions(preferredValue = classChoiceSelect.value) {
  const normalizedPreferredValue = String(preferredValue || "").trim().toLowerCase();
  const availableClasses = applyActiveFilters(classes)
    .slice()
    .sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));

  classChoiceSelect.replaceChildren();

  const randomOption = document.createElement("option");
  randomOption.value = "";
  randomOption.textContent = "Random Class";
  classChoiceSelect.appendChild(randomOption);

  availableClasses.forEach(characterClass => {
    const optionElement = document.createElement("option");
    optionElement.value = characterClass.name;
    optionElement.textContent = characterClass.name;
    classChoiceSelect.appendChild(optionElement);
  });

  const hasPreferredValue = [...classChoiceSelect.options].some(
    option => String(option.value).trim().toLowerCase() === normalizedPreferredValue
  );

  classChoiceSelect.value = hasPreferredValue ? preferredValue : "";
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
  const rarity = normalizeRarity(item);
  const currentWeights = rarityWeights();

  if (rarity === "rare") {
    return currentWeights.rare;
  }

  if (rarity === "uncommon") {
    return currentWeights.uncommon;
  }

  return currentWeights.common;
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

  if (totalWeight <= 0) {
    return randomItem(array);
  }

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

function workbookSheetToRows(workbook, sheetName) {
  const worksheet = workbook.Sheets[sheetName];

  if (!worksheet) {
    throw new Error(`Workbook is missing the "${sheetName}" sheet.`);
  }

  return XLSX.utils.sheet_to_json(worksheet, {
    defval: "",
    raw: false,
  });
}

async function loadWorkbookData() {
  if (typeof XLSX === "undefined") {
    throw new Error("The Excel parser did not load.");
  }

  const response = await fetch(workbookUrl);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const workbookBuffer = await response.arrayBuffer();
  const workbook = XLSX.read(workbookBuffer, { type: "array" });

  return {
    ancestries: workbookSheetToRows(workbook, workbookSheets.ancestries),
    heritages: workbookSheetToRows(workbook, workbookSheets.heritages),
    backgrounds: workbookSheetToRows(workbook, workbookSheets.backgrounds),
    regions: workbookSheetToRows(workbook, workbookSheets.regions),
    deities: workbookSheetToRows(workbook, workbookSheets.deities),
    weapons: workbookSheetToRows(workbook, workbookSheets.weapons),
    classes: workbookSheetToRows(workbook, workbookSheets.classes),
    subclasses: workbookSheetToRows(workbook, workbookSheets.subclasses),
    archetypes: workbookSheetToRows(workbook, workbookSheets.archetypes),
    sourceDefinitions: workbookSheetToRows(workbook, workbookSheets.sources),
  };
}

// ===============================
// DATA LOADING
// ===============================

async function loadData() {
  if (sourceCheckboxGroups.children.length > 0 || regionCheckboxGroups.children.length > 0) {
    pendingSettingsToApply = collectCurrentSettings();
  }

  setStatusMessageText("Loading character data...");
  generateButton.disabled = true;
  retryButton.hidden = true;

  try {
    // Load the workbook once up front so the app can keep using the same
    // in-memory arrays as before, just without depending on Google Sheets.
    ({
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
    } = await loadWorkbookData());

    renderSourceCheckboxes();
    renderRegionCheckboxes();
    renderStartingContinentOptions();
    applyGeneratorSettings(pendingSettingsToApply || getSavedGeneratorSettings() || getDefaultGeneratorSettings());
    pendingSettingsToApply = null;
    saveGeneratorSettings();

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

function characterNeedsDeity(chosenClass, chosenBackground, chosenSubclasses = []) {
  return isTrueValue(chosenClass?.needs_deity)
    || isTrueValue(chosenBackground?.needs_deity)
    || chosenSubclasses.some(subclass => isTrueValue(subclass?.needs_deity));
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
    return deityWeights().innerSea;
  }

  if (bucketName === "Regional") {
    return deityWeights().regional;
  }

  if (bucketName === "Ancestral") {
    return deityWeights().ancestral;
  }

  if (bucketName === "Pantheon") {
    return deityWeights().pantheon;
  }

  if (bucketName === "Faiths & Philosophies") {
    return deityWeights().faith;
  }

  if (bucketName === "Other Gods") {
    return deityWeights().other;
  }

  if (bucketName === "None") {
    return deityWeights().none;
  }

  return deityWeights().remaining;
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

  if (totalWeight <= 0) {
    return randomItem(bucketEntries)?.name || null;
  }

  let remainingWeight = Math.random() * totalWeight;

  for (const bucket of bucketEntries) {
    remainingWeight -= bucket.weight;

    if (remainingWeight < 0) {
      return bucket.name;
    }
  }

  return bucketEntries[bucketEntries.length - 1].name;
}

function chooseDeity(chosenAncestry, chosenRegion, chosenClass, chosenBackground, chosenSubclasses) {
  const requiresDeity = characterNeedsDeity(chosenClass, chosenBackground, chosenSubclasses);

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

function weaponType(weapon) {
  return String(weapon.type || "").trim().toLowerCase();
}

function weaponIsFinesse(weapon) {
  return isTrueValue(weapon.finesse);
}

function weaponHasTrait(weapon, traitName) {
  const normalizedTraitName = String(traitName || "").trim().toLowerCase();

  if (!normalizedTraitName) {
    return true;
  }

  return isTrueValue(weapon[normalizedTraitName]);
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

function classFavoredWeaponTraits(chosenClass) {
  return splitCsvValues(chosenClass.favored_weapon_traits);
}

function subclassWeaponTraits(chosenSubclasses) {
  return chosenSubclasses.flatMap(subclass => splitCsvValues(subclass.weapon_trait));
}

function subclassWeaponGroups(chosenSubclasses) {
  return chosenSubclasses.flatMap(subclass => splitCsvValues(subclass.weapon_group));
}

function subclassSpecificWeapons(chosenSubclasses) {
  return chosenSubclasses.flatMap(subclass => splitCsvValues(subclass.specific_weapon));
}

function deityFavoredWeapons(chosenDeity) {
  return splitCsvValues(chosenDeity?.favoredWeapon);
}

function weaponIsDeityFavored(weapon, chosenDeity) {
  const weaponName = String(weapon.name || "").trim().toLowerCase();
  return deityFavoredWeapons(chosenDeity).includes(weaponName);
}

function weaponMatchesSubclassRequirements(weapon, chosenSubclasses = []) {
  const requiredSpecificWeapons = subclassSpecificWeapons(chosenSubclasses);
  const requiredWeaponGroups = subclassWeaponGroups(chosenSubclasses);
  const requiredWeaponTraits = subclassWeaponTraits(chosenSubclasses).filter(trait => trait !== "any");
  const weaponName = String(weapon.name || "").trim().toLowerCase();

  if (requiredSpecificWeapons.length > 0) {
    return requiredSpecificWeapons.includes(weaponName);
  }

  if (requiredWeaponGroups.length > 0) {
    return requiredWeaponGroups.some(group => weaponGroups(weapon).includes(group));
  }

  if (requiredWeaponTraits.length > 0) {
    return requiredWeaponTraits.some(trait => {
      if (trait === "ranged") {
        const type = weaponType(weapon);
        return type === "ranged" || type === "both";
      }

      if (trait === "melee") {
        const type = weaponType(weapon);
        return type === "melee" || type === "both";
      }

      return weaponHasTrait(weapon, trait);
    });
  }

  return true;
}

function weaponMatchesKeyAbility(weapon, chosenKeyAbility) {
  const keyAbility = String(chosenKeyAbility?.value || chosenKeyAbility || "").trim().toLowerCase();
  const type = weaponType(weapon);

  if (keyAbility === "strength") {
    return type !== "ranged";
  }

  if (keyAbility === "dexterity") {
    return type === "ranged" || type === "both" || weaponIsFinesse(weapon);
  }

  return true;
}

function weaponMatchesClassTraits(weapon, chosenClass, chosenSubclasses = [], chosenDeity = null, requiresDeity = false) {
  if (requiresDeity && weaponIsDeityFavored(weapon, chosenDeity)) {
    return true;
  }

  const subclassTraits = subclassWeaponTraits(chosenSubclasses);

  if (subclassTraits.includes("any")) {
    return true;
  }

  if (subclassTraits.length > 0) {
    return subclassTraits.some(trait => weaponHasTrait(weapon, trait));
  }

  const favoredTraits = classFavoredWeaponTraits(chosenClass);

  if (favoredTraits.length === 0) {
    return true;
  }

  return favoredTraits.some(trait => weaponHasTrait(weapon, trait));
}

function classRequiresFavoredWeaponGroup(chosenClass) {
  return String(chosenClass?.name || "").trim().toLowerCase() === "gunslinger";
}

function findLegalDeityFavoredWeapon(weaponPool, chosenDeity) {
  if (!chosenDeity) {
    return null;
  }

  return weaponPool.find(weapon =>
    weaponIsDeityFavored(weapon, chosenDeity)
  ) || null;
}

function weaponPreferenceMultiplier(weapon, chosenClass, chosenDeity, requiresDeity) {
  let multiplier = 1;
  const weaponName = String(weapon.name || "").trim().toLowerCase();
  const favoredGroups = classFavoredWeaponGroups(chosenClass);
  const favoredWeapons = classFavoredSpecificWeapons(chosenClass);
  const currentWeaponWeights = weaponWeights();

  if (favoredGroups.some(group => weaponGroups(weapon).includes(group))) {
    multiplier *= currentWeaponWeights.groupMultiplier;
  }

  if (favoredWeapons.includes(weaponName)) {
    multiplier *= currentWeaponWeights.specificMultiplier;
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

  if (totalWeight <= 0) {
    return randomItem(weaponPool);
  }

  let remainingWeight = Math.random() * totalWeight;

  for (const weapon of weaponPool) {
    remainingWeight -= rarityWeight(weapon) * weaponPreferenceMultiplier(weapon, chosenClass, chosenDeity, requiresDeity);

    if (remainingWeight < 0) {
      return weapon;
    }
  }

  return weaponPool[weaponPool.length - 1];
}

function chooseWeapon(chosenClass, chosenDeity, chosenBackground, chosenKeyAbility, chosenSubclasses) {
  const requiresDeity = characterNeedsDeity(chosenClass, chosenBackground, chosenSubclasses);
  let availableWeapons = applyActiveFilters(weapons).filter(weapon =>
    weaponMatchesAllowedCategories(weapon, chosenClass, chosenDeity, requiresDeity)
  );

  availableWeapons = availableWeapons.filter(weapon =>
    (requiresDeity && weaponIsDeityFavored(weapon, chosenDeity))
      || weaponMatchesSubclassRequirements(weapon, chosenSubclasses)
  );

  availableWeapons = availableWeapons.filter(weapon =>
    weaponMatchesClassTraits(weapon, chosenClass, chosenSubclasses, chosenDeity, requiresDeity)
  );

  availableWeapons = availableWeapons.filter(weapon =>
    (requiresDeity && weaponIsDeityFavored(weapon, chosenDeity))
      || weaponMatchesKeyAbility(weapon, chosenKeyAbility)
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
    const deityWeaponChance = weaponWeights().deityChance / 100;

    if (legalFavoredWeapon && Math.random() < deityWeaponChance) {
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
  const chosenClassName = String(classChoiceSelect.value || "").trim();

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

  if (chosenClassName) {
    const manuallyChosenClass = availableClasses.find(
      characterClass => String(characterClass.name).trim().toLowerCase() === chosenClassName.toLowerCase()
    );

    if (!manuallyChosenClass) {
      setStatusMessageText(
        "The manually chosen class is not available under the current filters. Adjust the filters or choose Random Class.",
        true
      );
      return;
    }

    if (
      chosenClass
      && String(chosenClass.name).trim().toLowerCase() !== chosenClassName.toLowerCase()
    ) {
      setStatusMessageText(
        "The manually chosen class conflicts with another locked or required choice. Unlock the conflicting result or choose Random Class.",
        true
      );
      return;
    }

    chosenClass = manuallyChosenClass;
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
    chosenDeity = chooseDeity(ancestry, chosenRegion, chosenClass, background, chosenSubclasses);
  }

  if (characterNeedsDeity(chosenClass, background, chosenSubclasses) && !chosenDeity) {
    setStatusMessageText(
      "The current filters do not allow a valid deity for this class or background.",
      true
    );
    return;
  }

  if (!chosenWeapon) {
    chosenWeapon = chooseWeapon(chosenClass, chosenDeity, background, chosenKeyAbility, chosenSubclasses);
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
  applyRarityPresetWeights();
  renderClassChoiceOptions();
  updateWeightingGuide();
  saveGeneratorSettings();
});
rarityModeSelect.addEventListener("change", () => {
  applyRarityPresetWeights();
  updateWeightingGuide();
  saveGeneratorSettings();
});
accessFilterSelect.addEventListener("change", () => {
  renderClassChoiceOptions();
  saveGeneratorSettings();
});
startingContinentSelect.addEventListener("change", () => {
  updateWeightingGuide();
  saveGeneratorSettings();
});
regionToggleSelect.addEventListener("change", () => {
  if (!isRegionEnabled()) {
    lockedSelections.region = null;
    updateLockButtons();
  }

  updateRegionModeControl();
  updateSecondaryResultsVisibility();
  updateWeightingGuide();
  saveGeneratorSettings();
});
regionModeSelect.addEventListener("change", () => {
  applyRegionPresetWeights();
  updateRegionModeControl();
  updateWeightingGuide();
  saveGeneratorSettings();
});
regionCheckboxGroups.addEventListener("change", () => {
  updateWeightingGuide();
  saveGeneratorSettings();
});
sourcePresetSelect.addEventListener("change", () => {
  applySourcePreset();
  renderClassChoiceOptions();
  saveGeneratorSettings();
});
sourceCheckboxGroups.addEventListener("change", () => {
  renderClassChoiceOptions();
  saveGeneratorSettings();
});
classChoiceSelect.addEventListener("change", saveGeneratorSettings);
archetypeToggleSelect.addEventListener("change", () => {
  if (!isArchetypeEnabled()) {
    lockedSelections.archetype = null;
    updateLockButtons();
  }

  updateSecondaryResultsVisibility();
  updateWeightingGuide();
  saveGeneratorSettings();
});
deityToggleSelect.addEventListener("change", () => {
  if (!isDeityEnabled()) {
    lockedSelections.deity = null;
    updateLockButtons();
  }

  updateSecondaryResultsVisibility();
  updateWeightingGuide();
  saveGeneratorSettings();
});
rememberSettingsCheckbox.addEventListener("change", () => {
  const shouldRememberSettings = rememberSettingsCheckbox.checked;
  setRememberSettingsEnabled(shouldRememberSettings);

  if (shouldRememberSettings) {
    saveGeneratorSettings();
  }
});
resetDefaultsButton.addEventListener("click", resetGeneratorDefaults);
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
document.querySelectorAll(".weight-input").forEach(input => {
  input.addEventListener("input", () => {
    updateWeightingGuide();
    saveGeneratorSettings();
  });
});
updateLockButtons();
initializeRememberSettingsPreference();
pendingSettingsToApply = isRememberSettingsEnabled()
  ? (getSavedGeneratorSettings() || getDefaultGeneratorSettings())
  : getDefaultGeneratorSettings();
applyGeneratorSettings(pendingSettingsToApply);
initializeTheme();
loadData();
