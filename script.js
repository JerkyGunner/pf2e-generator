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

// ===============================
// DATA STORAGE
// ===============================
let ancestries = [];
let heritages = [];
let backgrounds = [];
let classes = [];
let subclasses = [];

const generateButton = document.getElementById("generateBtn");
const retryButton = document.getElementById("retryBtn");
const statusMessage = document.getElementById("statusMessage");

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
    ] = await Promise.all([
      loadCsvData(ancestryCsvUrl),
      loadCsvData(heritageCsvUrl),
      loadCsvData(backgroundCsvUrl),
      loadCsvData(classCsvUrl),
      loadCsvData(subclassCsvUrl),
    ]);

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
    .map(type => randomItem(subclassesByType[type]));
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

  const gateChoice = randomItem(type1Options);
  const results = [gateChoice];

  const gateName = gateChoice.name.toLowerCase().trim();

  if (gateName === "single gate") {
    if (type2Options.length > 0) {
      results.push(randomItem(type2Options));
    }
  } else if (gateName === "dual gate") {
    if (type2Options.length >= 2) {
      results.push(...randomItems(type2Options, 2));
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
    return randomItems(matchingSubclasses, 3);
  }

  const chosenWeapon = randomItem(weaponIkons);

  const remainingPool = matchingSubclasses.filter(
    subclass => subclass.name !== chosenWeapon.name
  );

  const additionalChoices = randomItems(remainingPool, 2);

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
        return randomItem(psychicOptions);
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
    return "Unknown";
  }

  // -------------------------------
  // Pick one final key ability from the valid options
  // -------------------------------
  return randomItem(keyAbilityOptions);
}

// ===============================
// MAIN CHARACTER GENERATION
// ===============================

function generateCharacter() {
  if (generateButton.disabled) {
    return;
  }

  // Pick ancestry
  const ancestry = randomItem(ancestries);

  // Pick matching heritage
  const matchingHeritages = heritages.filter(
    heritage => heritage.ancestry.toLowerCase() === ancestry.name.toLowerCase()
  );
  const heritage = matchingHeritages.length > 0 ? randomItem(matchingHeritages) : null;

  // Pick background
  const background = randomItem(backgrounds);

  // Pick class
  const chosenClass = randomItem(classes);

  // Pick subclass/subclasses
  const matchingSubclasses = subclasses.filter(
    subclass => subclass.class.toLowerCase() === chosenClass.name.toLowerCase()
  );
  const chosenSubclasses = chooseSubclassesForClass(chosenClass.name, matchingSubclasses);

  // Pick final key ability
  const chosenKeyAbility = chooseKeyAbility(chosenClass, chosenSubclasses);

  // Display simple results
  document.getElementById("ancestryResult").textContent = ancestry.name;
  document.getElementById("heritageResult").textContent = heritage ? heritage.name : "None";
  document.getElementById("backgroundResult").textContent = background.name;
  document.getElementById("classResult").textContent = chosenClass.name;
  document.getElementById("keyAbilityResult").textContent = chosenKeyAbility;

  // Display subclasses nicely as separate boxes
  const subclassResultElement = document.getElementById("subclassResult");
  subclassResultElement.replaceChildren();

  if (chosenSubclasses.length > 0) {
    chosenSubclasses.forEach(subclass => {
      const subclassItem = document.createElement("div");
      subclassItem.className = "subclass-item";
      subclassItem.textContent = subclass.subclass_label
        ? `${subclass.subclass_label}: ${subclass.name}`
        : subclass.name;
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
loadData();
