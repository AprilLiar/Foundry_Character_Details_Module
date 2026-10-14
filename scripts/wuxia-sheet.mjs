/**
 * Wuxia Sheet: an alternate character sheet for the DC20 system.
 *
 * The sheet reuses all logic of the system's own character sheet and only swaps in this
 * module's copy of the template, so the layout can be changed here without touching the system.
 *
 * The system does not export its sheet class, so it has to be found first. This is tried during
 * "init", and again during "setup" (when every package has run its init hook). If it still cannot be
 * found, an error is shown on screen and written to the browser console.
 */
const MODULE_ID = "wuxia-sheet";
const SYSTEM_ID = "dc20rpg";
const SYSTEM_SHEET_NAME = "DC20RpgActorSheet";
const SYSTEM_SHEET_FILE = `systems/${SYSTEM_ID}/module/sheets/actor-sheet.mjs`;
const TEMPLATE_PATH = `modules/${MODULE_ID}/templates/character.hbs`;

let registered = false;
let setupAttempt = Promise.resolve();

Hooks.once("init", () => { register("init"); });
Hooks.once("setup", () => { setupAttempt = register("setup"); });
Hooks.once("ready", async () => {
  await setupAttempt;
  if (registered) return;
  ui.notifications.error("Wuxia Sheet could not be registered. Open the browser console (F12) and look for messages starting with 'wuxia-sheet'.");
});

async function register(stage) {
  if (registered) return;
  try {
    let SystemSheet = findSheetClass(cls => cls.name === SYSTEM_SHEET_NAME);
    if (!SystemSheet && stage === "setup") SystemSheet = await importSystemSheet();
    if (!SystemSheet) {
      console.warn(`${MODULE_ID} | (${stage}) The DC20 character sheet class was not found.`, CONFIG.Actor?.sheetClasses);
      return;
    }

    registerWuxiaSheet(SystemSheet);
    registered = true;
    console.log(`${MODULE_ID} | Wuxia Sheet registered (${stage}).`);
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
    console.warn(`${MODULE_ID} | The sheet was registered but is not listed in CONFIG.Actor.sheetClasses.`, CONFIG.Actor?.sheetClasses);
  }
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

/**
 * Fallback: load the class from the system's own file. The system loads that same file, so this normally
 * gives the very same class, not a copy.
 */
async function importSystemSheet() {
  const url = foundry.utils.getRoute(SYSTEM_SHEET_FILE);
  const systemFile = await import(url);
  console.warn(`${MODULE_ID} | The DC20 sheet class was not in the sheet registry, using the one imported from ${url}.`);
  return systemFile[SYSTEM_SHEET_NAME];
}
