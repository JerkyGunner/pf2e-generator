// ===============================
// GOOGLE SHEETS CSV LINKS
// ===============================
const ancestryCsvUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQLfWHlGnr19xt1pKXr38f43Bl6174deFGFTM9promg4lR9DNoY-NQb0PxTgh44mhSqSzc53xmnCDih/pub?gid=0&single=true&output=csv";

const heritageCsvUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQLfWHlGnr19xt1pKXr38f43Bl6174deFGFTM9promg4lR9DNoY-NQb0PxTgh44mhSqSzc53xmnCDih/pub?gid=653560487&single=true&output=csv";

const backgroundCsvUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQLfWHlGnr19xt1pKXr38f43Bl6174deFGFTM9promg4lR9DNoY-NQb0PxTgh44mhSqSzc53xmnCDih/pub?gid=59254066&single=true&output=csv";

const classCsvUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQLfWHlGnr19xt1pKXr38f43Bl6174deFGFTM9promg4lR9DNoY-NQb0PxTgh44mhSqSzc53xmnCDih/pub?gid=982187207&single=true&output=csv";

const subclassCsvUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQLfWHlGnr19xt1pKXr38f43Bl6174deFGFTM9promg4lR9DNoY-NQb0PxTgh44mhSqSzc53xmnCDih/pub?gid=1804749066&single=true&output=csv";

const sourceCsvUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQLfWHlGnr19xt1pKXr38f43Bl6174deFGFTM9promg4lR9DNoY-NQb0PxTgh44mhSqSzc53xmnCDih/pub?gid=546607334&single=true&output=csv";

// ===============================
// DATA STORAGE
// ===============================
let ancestries = [];
let heritages = [];
let backgrounds = [];
let classes = [];
let subclasses = [];
let sourceDefinitions = [];
let currentCharacter = null;

const lockedSelections = {
  ancestry: null,
  heritage: null,
  background: null,
  class: null,
  keyAbility: null,
  subclasses: null,
};

const generateButton = document.getElementById("generateBtn");
const retryButton = document.getElementById("retryBtn");
const rarityFilterSelect = document.getElementById("rarityFilter");
const rarityModeGroup = document.getElementById("rarityModeGroup");
const rarityModeSelect = document.getElementById("rarityMode");
const accessFilterSelect = document.getElementById("accessFilter");
const sourcePresetSelect = document.getElementById("sourcePreset");
const sourceCheckboxGroups = document.getElementById("sourceCheckboxGroups");
const themeSelect = document.getElementById("themeSelect");
const rarityModeHint = document.getElementById("rarityModeHint");
const statusMessage = document.getElementById("statusMessage");
const lockButtons = {
  ancestry: document.getElementById("lockAncestryBtn"),
  heritage: document.getElementById("lockHeritageBtn"),
  background: document.getElementById("lockBackgroundBtn"),
  class: document.getElementById("lockClassBtn"),
  keyAbility: document.getElementById("lockKeyAbilityBtn"),
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

function updateRarityModeHint() {
  rarityModeHint.textContent = getCurrentThemeOptionLabel();
}

function applyTheme(theme) {
  if (theme === "dark" || theme === "light") {
    document.body.dataset.theme = theme;
    return;
  }

  document.body.removeAttribute("data-theme");
}

function initializeTheme() {
  const savedTheme = localStorage.getItem(themeStorageKey) || "system";
  themeSelect.value = savedTheme;
  applyTheme(savedTheme);
}

function createSourceButton(sourceText) {
  const normalizedSourceText = String(sourceText || "").trim();

  if (!normalizedSourceText) {
    return null;
  }

  const sourceButton = document.createElement("button");
  sourceButton.type = "button";
  sourceButton.className = "source-button";
  sourceButton.textContent = "i";
  sourceButton.title = normalizedSourceText;
  sourceButton.setAttribute("aria-label", `Source: ${normalizedSourceText}`);
  return sourceButton;
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

function normalizeRarity(item) {
  return String(item.rarity || "common").toLowerCase().trim();
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

  if (accessFilter === "all") {
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

function applyActiveFilters(array) {
  return filterBySource(filterByAccess(filterByAllowedRarities(array)));
}

function getSelectedSourceNames() {
  const checkedInputs = sourceCheckboxGroups.querySelectorAll("input[type=\"checkbox\"]:checked");
  return new Set([...checkedInputs].map(input => input.value));
}

function filterBySource(array) {
  const selectedSourceNames = getSelectedSourceNames();

  if (selectedSourceNames.size === 0) {
    return [];
  }

  return array.filter(item => selectedSourceNames.has(normalizeSourceName(item.source)));
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
    rarityModeHint.textContent = "";
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
  updateRarityModeHint();
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
  statusMessage.textContent = "Loading character data...";
  statusMessage.classList.remove("error");
  generateButton.disabled = true;
  retryButton.hidden = true;

  try {
    [
      ancestries,
      heritages,
      backgrounds,
      classes,
      subclasses,
      sourceDefinitions,
    ] = await Promise.all([
      loadCsvData(ancestryCsvUrl),
      loadCsvData(heritageCsvUrl),
      loadCsvData(backgroundCsvUrl),
      loadCsvData(classCsvUrl),
      loadCsvData(subclassCsvUrl),
      loadCsvData(sourceCsvUrl),
    ]);

    renderSourceCheckboxes();

    statusMessage.textContent = "Character data loaded. You can generate a character now.";
    generateButton.disabled = false;
  } catch (error) {
    console.error("Failed to load character data.", error);
    statusMessage.textContent =
      "Could not load character data. Please refresh the page and try again.";
    statusMessage.classList.add("error");
    generateButton.disabled = true;
    retryButton.hidden = false;
  }
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

  const availableAncestries = applyActiveFilters(ancestries);
  const availableBackgrounds = applyActiveFilters(backgrounds);
  const availableClasses = applyActiveFilters(classes);

  if (
    availableAncestries.length === 0 ||
    availableBackgrounds.length === 0 ||
    availableClasses.length === 0
  ) {
    statusMessage.textContent =
      "No options match the current filters. Try allowing more rarities or access entries.";
    statusMessage.classList.add("error");
    return;
  }

  statusMessage.textContent = "Character data loaded. You can generate a character now.";
  statusMessage.classList.remove("error");

  let ancestry = lockedSelections.ancestry;
  let heritage = lockedSelections.heritage;
  let background = lockedSelections.background;
  let chosenClass = lockedSelections.class;
  let chosenSubclasses = lockedSelections.subclasses;
  let chosenKeyAbility = lockedSelections.keyAbility;

  if (!ancestry && heritage) {
    ancestry = findAncestryByName(heritage.ancestry) || { name: heritage.ancestry };
  }

  if (!chosenClass && chosenSubclasses && chosenSubclasses.length > 0) {
    chosenClass =
      findClassByName(chosenSubclasses[0].class) || { name: chosenSubclasses[0].class };
  }

  // Pick ancestry
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
    background = weightedRandomItem(availableBackgrounds);
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

  currentCharacter = {
    ancestry: cloneValue(ancestry),
    heritage: cloneValue(heritage),
    background: cloneValue(background),
    class: cloneValue(chosenClass),
    keyAbility: cloneValue(chosenKeyAbility),
    subclasses: cloneValue(chosenSubclasses),
  };

  // Display simple results
  setValueAndSource("ancestryResult", "ancestrySource", ancestry.name, ancestry.source);
  setValueAndSource(
    "heritageResult",
    "heritageSource",
    heritage ? heritage.name : "None",
    heritage ? heritage.source : ""
  );
  setValueAndSource("backgroundResult", "backgroundSource", background.name, background.source);
  setValueAndSource("classResult", "classSource", chosenClass.name, chosenClass.source);
  setValueAndSource(
    "keyAbilityResult",
    "keyAbilitySource",
    chosenKeyAbility.value,
    chosenKeyAbility.sourceText
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
}

// ===============================
// PAGE SETUP
// ===============================

generateButton.addEventListener("click", generateCharacter);
retryButton.addEventListener("click", loadData);
rarityFilterSelect.addEventListener("change", updateRarityModeControl);
rarityModeSelect.addEventListener("change", updateRarityModeHint);
sourcePresetSelect.addEventListener("change", applySourcePreset);
themeSelect.addEventListener("change", event => {
  const theme = event.target.value;
  localStorage.setItem(themeStorageKey, theme);
  applyTheme(theme);
});
lockButtons.ancestry.addEventListener("click", () => toggleLock("ancestry"));
lockButtons.heritage.addEventListener("click", () => toggleLock("heritage"));
lockButtons.background.addEventListener("click", () => toggleLock("background"));
lockButtons.class.addEventListener("click", () => toggleLock("class"));
lockButtons.keyAbility.addEventListener("click", () => toggleLock("keyAbility"));
lockButtons.subclasses.addEventListener("click", () => toggleLock("subclasses"));
updateLockButtons();
initializeTheme();
updateRarityModeControl();
loadData();
