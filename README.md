# DC20 Wuxia Sheet

An alternate character sheet for the [DC20 system](https://github.com/pazindorb/dc20rpg) on Foundry VTT.

**Phase 1 (this version):** a copy of the original DC20 character sheet, registered as a separate sheet named
"Wuxia Sheet". The only visual change is the background images. Layout and behaviour are identical to the
original sheet. Later phases will change the copy.

## Requirements

- Foundry VTT v14 (verified on 14.367)
- DC20 system 0.10.7.0 or newer

## Installing in Foundry

1. In Foundry's setup screen, open **Add-on Modules**, click **Install Module**, and paste this into the
   **Manifest URL** field at the bottom, then click **Install**:

   ```
   https://github.com/AprilLiar/Foundry_Character_Details_Module/releases/latest/download/module.json
   ```

2. Enable the module in your world.

Every push to the main branch publishes a new release automatically, so the newest change is available as
soon as the build finishes (about a minute). To get it, use **Check for Updates** on the module in Foundry
and update. The version is `<major>.<minor>.<number of commits>`, for example `0.1.7`. To start a new minor
or major version, edit `version` in `module.json`. The release process is in `.github/`.

## Using it

Open a character, use the sheet configuration (the Sheet button in the sheet's window header) and pick
"Wuxia Sheet". The module does not become the default sheet, so existing characters are not affected.

Only `character` actors can use it. NPCs, companions and storage actors keep the original sheet.

If "Wuxia Sheet" is missing from the list, reload the world after updating the module, then press F12 in the
browser, open the Console tab and look for messages starting with `wuxia-sheet`. A successful start logs
"Wuxia Sheet registered". A red message on screen when the world loads means registration failed.

## Color palette

`palettes/wuxia.json` is a color palette for the DC20 system. It replaces the standard purple with cinnabar red
and gold, to match the Wuxia Sheet backgrounds. It is a complete palette in the system's own export format:
18 of the 83 colors are changed, the rest are the system defaults. Changed: the primary colors, the table colors,
the highlight and action point colors, the character sheet colors (main colors, tables, and the tints over the
header, sidebar and class/ancestry bars). The NPC (blue) and storage (green) sheets and the resource and health
colors are unchanged.

To use it:

1. Open the file in your browser, select all and copy it. The address is your Foundry address followed by
   `/modules/wuxia-sheet/palettes/wuxia.json`, or use the
   [file on GitHub](https://github.com/AprilLiar/Foundry_Character_Details_Module/blob/claude/jolly-allen-w7wetn/palettes/wuxia.json).
2. As the GM, open Foundry's settings, then Configure Settings, System Settings, and click
   **Open Color Palette Selection** (Select Color Palette).
3. Click the import icon next to the palette list, paste the text and click **Import Palette**.
4. Choose `wuxia` in the list and click **Use Selected Palette**.

Imported palettes are shared by the whole world, but each user chooses their own palette in the same dialog, so
players have to do step 4 themselves. The system refuses to import a palette whose name already exists, so to
update it later, remove the old `wuxia` palette with the minus icon first. Unlike the built-in `default`
palette, you can edit its colors in the dialog and save them with **Update Color Palette**.

## How it works

| File | Purpose |
|---|---|
| `scripts/wuxia-sheet.mjs` | Registers `Wuxia Sheet`. It extends the system's own character sheet class, so all sheet logic is inherited live from the system, and only swaps the template. |
| `templates/character.hbs` | Unmodified copy of the system's character template (see `NOTICE.md`). This is the file to edit in later phases. |
| `styles/wuxia-sheet.css` | Background image overrides, scoped to the `wuxia-sheet` class so only this sheet is affected. |
| `images/` | The replacement backgrounds. |

### Background image map

| Slot | Original | Replacement |
|---|---|---|
| Header banner | `header_background.jpg` | `gold-bamboo.png` |
| Sidebar background | `parchment.jpg` (tiled) | `ink-landscape.png` |
| Sidebar top banner | `char_banner_v1.jpg` | `ink-landscape.png` |
| Class, subclass, ancestry, background bars | `*_baner.jpg` | `gold-bamboo.png` |

The system's colours and blend modes are left unchanged, so the images are tinted by the system's colour
palette. Size and position are reset to `cover` and `center` because the original values were tuned for the
original artwork.

## Known limitations

- The template is a snapshot of system version 0.10.7.0. Later changes to the system's own template are not
  picked up. Changes to the system's sheet code can still break the copy, since the two must stay compatible.
- Not yet tested inside a running Foundry. The template and styles were checked in a browser against the
  system's real CSS, outside of Foundry.
- The background images are 740x493 and 900x360 pixels and are stretched to larger areas, so they look soft.
  Check the licence of the images before distributing this module.
