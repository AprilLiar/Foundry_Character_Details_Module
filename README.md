# DC20 Wuxia Sheet

An alternate character sheet for the [DC20 system](https://github.com/pazindorb/dc20rpg) on Foundry VTT.

**Phase 1 (this version):** a copy of the original DC20 character sheet, registered as a separate sheet named
"Wuxia Sheet". The only visual change is the background images. Layout and behaviour are identical to the
original sheet. Later phases will change the copy.

## Requirements

- Foundry VTT v14 (verified on 14.367)
- DC20 system 0.10.7.0 or newer

## Using it

1. Put this folder in your Foundry `Data/modules/` directory as `wuxia-sheet`, then enable the module in your world.
2. Open a character, use the sheet configuration (the Sheet button in the sheet's window header) and pick
   "Wuxia Sheet". The module does not become the default sheet, so existing characters are not affected.

Only `character` actors can use it. NPCs, companions and storage actors keep the original sheet.

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
