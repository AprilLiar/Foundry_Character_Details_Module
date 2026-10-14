/**
 * Wuxia Sheet: an alternate character sheet for the DC20 system.
 *
 * The sheet reuses all logic of the system's own character sheet and only swaps in this
 * module's copy of the template, so the layout can be changed here without touching the system.
 *
 * The system does not export its sheet class, so it has to be found first. In order:
 *   1. during "init", by searching the registered actor sheets for the class by name,
 *   2. once the game is ready, from the sheet of a character actor (a temporary one if the world has none),
 *      which is how Foundry itself resolves the sheet class,
 *   3. when a character sheet of the system is first opened.
 * If none of that works, an error is shown on screen and the details are written to the browser console.
 */
const MODULE_ID = "wuxia-sheet";
const SYSTEM_ID = "dc20rpg";
const SYSTEM_SHEET_NAME = "DC20RpgActorSheet";
const TEMPLATE_PATH = `modules/${MODULE_ID}/templates/character.hbs`;

let registered = false;

Hooks.once("init", () => {
  register(findSheetClass(cls => cls.name === SYSTEM_SHEET_NAME), "init");
});

Hooks.once("ready", () => {
  if (!registered) register(sheetClassFromActor(), "ready");
  if (registered) return;

  console.error(`${MODULE_ID} | The DC20 character sheet class was not found. Registered actor sheets:\n${describe(CONFIG.Actor?.sheetClasses).join("\n")}`);
  ui.notifications.error("Wuxia Sheet could not be registered. Open the browser console (F12) and look for messages starting with 'wuxia-sheet'. It may still become available after a character sheet is opened.");
});

// Last resort: the first time a character sheet of the system is shown, its class is known for sure
Hooks.on("renderActorSheet", app => {
  if (!registered && isSystemCharacterSheet(app)) register(app.constructor, "first sheet render");
});

function register(SystemSheet, stage) {
  if (registered || !SystemSheet) return;
  try {
    registerWuxiaSheet(SystemSheet);
    registered = true;
    console.log(`${MODULE_ID} | Wuxia Sheet registered (${stage}), based on ${SystemSheet.name}.`);
  } catch (error) {
    console.error(`${MODULE_ID} | (${stage}) Could not register the Wuxia Sheet.`, error);
  }
}

function registerWuxiaSheet(SystemSheet) {
  class WuxiaActorSheet extends SystemSheet {

    /** @override */
    static get defaultOptions() {
      const options = super.defaultOptions;
      return foundry.utils.mergeObject(options, {
        classes: [...options.classes, "wuxia-sheet"] // css hook for the module styles
      });
    }

    /** @override */
    get template() {
      return TEMPLATE_PATH;
    }
  }

  foundry.documents.collections.Actors.registerSheet(MODULE_ID, WuxiaActorSheet, {
    types: ["character"],
    makeDefault: false,
    label: "Wuxia Sheet"
  });

  if (!findSheetClass(cls => cls === WuxiaActorSheet)) {
    console.warn(`${MODULE_ID} | The sheet was registered, but was not found in CONFIG.Actor.sheetClasses. Registered actor sheets:\n${describe(CONFIG.Actor?.sheetClasses).join("\n")}`);
  }
}

/** True for a sheet that belongs to the DC20 system and is showing a character. */
function isSystemCharacterSheet(sheet) {
  if (sheet?.actor?.type !== "character") return false;
  return sheet.constructor?.name === SYSTEM_SHEET_NAME || String(sheet.template ?? "").includes(`systems/${SYSTEM_ID}/`);
}

/**
 * The class of the sheet that Foundry uses for characters. Taken from a character of the world, or from
 * a temporary one that is never saved.
 */
function sheetClassFromActor() {
  try {
    const actor = game.actors?.find(a => a.type === "character")
      ?? new CONFIG.Actor.documentClass({ name: "Wuxia Sheet probe", type: "character" });
    const sheet = actor.sheet;
    if (isSystemCharacterSheet(sheet)) return sheet.constructor;
    console.warn(`${MODULE_ID} | The sheet of a character is ${sheet?.constructor?.name}, which does not look like the DC20 sheet.`);
  } catch (error) {
    console.warn(`${MODULE_ID} | Could not get the sheet class from a character.`, error);
  }
  return undefined;
}

/**
 * Searches the registered actor sheets for a class. The search does not depend on how the registry
 * is organised (by actor type, by sheet id, ...), it looks for entries that hold a sheet class as "cls".
 */
function findSheetClass(matches, node = CONFIG.Actor?.sheetClasses, depth = 0) {
  if (!node || typeof node !== "object" || depth > 4) return undefined;
  if (typeof node.cls === "function" && matches(node.cls)) return node.cls;

  const children = node instanceof Map ? [...node.values()] : Object.values(node);
  for (const child of children) {
    const found = findSheetClass(matches, child, depth + 1);
    if (found) return found;
  }
  return undefined;
}

/** A readable listing of the registered sheets, for the console. */
function describe(node, path = "sheetClasses", depth = 0, lines = []) {
  if (typeof node === "function") lines.push(`${path}: class ${node.name}`);
  else if (!node || typeof node !== "object") lines.push(`${path}: ${node === null || node === undefined ? node : typeof node}`);
  else if (depth > 3) lines.push(`${path}: object with keys ${Object.keys(node).join(", ") || "(none)"}`);
  else {
    const entries = node instanceof Map ? [...node.entries()] : Object.entries(node);
    if (!entries.length) lines.push(`${path}: (empty)`);
    for (const [key, value] of entries) describe(value, `${path} > ${key}`, depth + 1, lines);
  }
  return lines;
}
