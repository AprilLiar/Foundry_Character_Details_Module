/**
 * Wuxia Sheet: an alternate character sheet for the DC20 system.
 *
 * The sheet reuses all logic of the system's own character sheet and only swaps in this
 * module's copy of the template, so the layout can be changed here without touching the system.
 */
const MODULE_ID = "wuxia-sheet";
const SYSTEM_ID = "dc20rpg";
const TEMPLATE_PATH = `modules/${MODULE_ID}/templates/character.hbs`;

Hooks.once("init", () => {
  const SystemActorSheet = findSystemActorSheet();
  if (!SystemActorSheet) {
    console.error(`${MODULE_ID} | Could not find the DC20 character sheet class, the Wuxia Sheet was not registered.`);
    return;
  }

  class WuxiaActorSheet extends SystemActorSheet {

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
});

/**
 * The system does not export its sheet class, so it is looked up from the registered sheets.
 * Sheets are registered under the key "<scope>.<class name>".
 */
function findSystemActorSheet() {
  for (const sheets of Object.values(CONFIG.Actor.sheetClasses ?? {})) {
    const entry = Object.entries(sheets).find(([key]) => key.startsWith(`${SYSTEM_ID}.`));
    if (entry) return entry[1].cls;
  }
}
