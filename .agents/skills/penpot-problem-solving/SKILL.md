# Penpot MCP Problem-Solving Guide

## Purpose

This document captures hard-won lessons from building the AstroVille Design System on Penpot via the MCP server. The goal is to **avoid re-discovering these Penpot quirks** in future projects. Many of these behaviors are undocumented and only show up at runtime when elements are exported or grouped.

The most critical lesson: **always wrap section content in a Group**, then position everything inside the Group using simple `(x, y)` coordinates relative to the group's origin. This dramatically reduces positioning errors.

---

## TL;DR — The "Group-First" Rule

For each top-level section of a Penpot design (e.g., a board representing "Colors", "Typography", "Spacing"):

1. Create the board.
2. **Wrap all of its children in a Group** (Penpot auto-creates this when you call `penpot.group([...children])`).
3. Position the Group itself at the desired top-left of your content area, e.g. `penpotUtils.setParentXY(group, 64, 40)`.
4. Inside the Group, all child positions are use simple `(0, 0)`-based coordinates relative to the group origin.
5. **Always position children FIRST at `(0, 0)`-relative coords, THEN group them**, not the other way around.

This pattern is what makes positioning predictable and export work correctly.

---

## Problem 1 — Children of a Card get negative `parentX` / `parentY` after grouping

### Symptom

After calling `penpot.group([...children])` to wrap the content of a section, the **nested children inside cards** end up with negative `parentX` / `parentY` values. For example, a Rectangle that should be at `(0, 0)` relative to its card ends up at `(-64, -210)` — drawn outside the card's bounds.

Visually, the card backgrounds (the colored swatches) appear empty because the actual fill Rectangle is positioned outside.

### Root cause

When you group shapes that were already laid out at absolute positions on a parent board, Penpot computes the group's bounding box. The group itself is positioned at `(minX, minY)` of its members. Then for each child, its `parentX` / `parentY` is recomputed relative to the group's new origin.

If any child's absolute position was, say, `(64, 218)` and the group ends up at `(64, 218)`, the child's `parentX`/`parentY` becomes `(0, 0)`. But if the card containing the child was at `(64, 218)` and the group ends up at, say, `(64, 40)`, then **everything inside the card** gets a negative `parentY` because the card is "higher" than the group's origin.

### Fix

Always position children at coordinates **relative to the eventual group's origin (0, 0)** BEFORE calling `penpot.group()`. After grouping, the group's origin becomes `(0, 0)` for its children.

If you've already grouped and the children are misaligned, the recovery is:

1. `penpot.ungroup(group)` — flatten back.
2. Subtract the intended group offset from every child's `y` (or `x`) position.
3. `penpot.group(children)` again.
4. `penpotUtils.setParentXY(group, desiredParentX, desiredParentY)`.

Concretely (the pattern that worked):

```js
// 1. Save the original absolute positions you want to preserve.
const originalPositions = children.map(c => ({ c, x: c.x, y: c.y }));

// 2. Shift each child by -groupOffset (so they're relative to the group's origin).
for (const child of children) {
  child.y -= GROUP_OFFSET_Y;   // e.g. 40
}

// 3. Group them.
const group = penpot.group(children);

// 4. Position the group itself.
if (group) {
  penpotUtils.setParentXY(group, group.parentX, GROUP_OFFSET_Y);
}
```

---

## Problem 2 — Text shapes with fixed `lineHeight` (pixel value) render at huge height

### Symptom

A text shape with `fontSize: 48` and `lineHeight: 56` (a pixel value) ends up with `bounds.height: 2689` (or similar absurd value). The text wraps vertically — the actual rendered text appears far below where you placed it (often at `y: 1313` in absolute terms), so the text is invisible.

### Root cause

Penpot's `lineHeight` accepts a numeric multiplier string like `"1.2"`, but **rejects some values like `"56"` or any non-numeric, non-multiplier value**. When an invalid value is passed, Penpot silently uses a default line height that can be enormous, causing wrapping. SVG export confirms the bug — the `<text>` element's `y` attribute reports a huge value like `1386.44`.

Also, even when an apparently-valid pixel `lineHeight` is accepted, the bounds calculation for `auto-width` text can produce weird values like `width: 338` but `height: 2689`, because the text engine wraps inside the bounds the text thinks it has at creation time.

### Fix

**Always use `lineHeight: "1.2"` (a string multiplier)** instead of pixel values. The Text shape will then have correct, predictable bounds:

```js
const t = penpot.createText("ASTROGENESIS");
parent.appendChild(t);
t.resize(800, 80);                  // resize BEFORE setting fontSize
t.x = 64;
t.y = 100;
t.fontFamily = "Space Grotesk";
t.fontWeight = "700";
t.fontSize = 48;
t.lineHeight = "1.2";               // ← use "1.2", not "56"
t.fills = [{ fillColor: "#F8FAFC", fillOpacity: 1 }];
```

This works whether the fontSize is set before or after appending, as long as **resize() is called BEFORE fontSize** and **lineHeight is a multiplier string**.

---

## Problem 3 — `fontSize` change after appending gives 1×1 dimensions if `resize()` not called first

### Symptom

A text element created with `penpot.createText()`, appended to a parent, and then given `fontSize: 32` ends up with `width: 1, height: 1` initially. After some delay, the bounds recover, but the text may render at unexpected positions.

### Root cause

Penpot measures text dimensions eagerly using the **current bounds**. If the text is created and has 1×1 dimensions at the moment the font engine measures, it treats the text as constrained to 1 pixel wide and wraps aggressively.

### Fix

Always **`resize(width, height)` BEFORE setting `fontSize`**. This gives the text a known bounding box. The simplest helper:

```js
function makeText(parent, chars, opts) {
  const t = penpot.createText(chars);
  parent.appendChild(t);
  t.resize(opts.w || 400, opts.h || 60);  // resize first
  t.x = opts.x;
  t.y = opts.y;
  t.fontFamily = opts.fontFamily || "Inter Tight";
  t.fontWeight = opts.fontWeight || "400";
  t.fontSize = opts.fontSize || 14;
  t.lineHeight = opts.lineHeight || "1.2";  // multiplier, NOT pixels
  t.fills = [{ fillColor: opts.color || "#F8FAFC", fillOpacity: 1 }];
  if (opts.transform === "uppercase") t.textTransform = "uppercase";
  return t;
}
```

---

## Problem 4 — Letterspacing with `em` units gets rejected

### Symptom

Setting `text.letterSpacing = "0.08em"` fails with `Value not valid: 0.08em. Code: :letterSpacing`.

### Fix

Penpot's `letterSpacing` only accepts numeric values (interpreted as 1/100 em, or similar), not em-suffixed strings. Use `"1"` (or `0`, `"2"`, etc.) instead of `"0.08em"`. For tighter control use a small number like `"1"` or `"2"`.

---

## Problem 5 — `penpot.generateMarkup()` returns content that the PNG export doesn't render

### Symptom

You build shapes, the SVG markup shows them correctly (`<rect>`, `<text>`, gradient `<stop>`s, etc.), but `export_shape` returns a blank PNG or one missing the expected content. There are no error messages.

### Root cause

Two main causes observed:

1. **Nested boards with `clipContent: true` and small dimensions** can crop the visible area. Penpot exports using the bounding box, but the inner content lives beyond it.
2. **Group wrappers with shifted content** (Problem 1 above) cause Penpot's export to use stale textBounds. SVG markup may show the elements, but the export doesn't honor the offsets.

### Fix

- Trust the SVG markup (`penpot.generateMarkup`) as ground truth when something isn't rendering.
- After fixing Problem 1 (children at correct relative positions), exports work correctly.
- Verify by exporting small individual boards first to isolate which one is failing.

---

## Problem 6 — A section board's children disappear after grouping

### Symptom

After grouping, the section's swatches / cards / labels are gone from the visible export, but they still exist in the data structure. The card **containers** appear (their borders, fills) but their **content** (Rectangle, Text children) is drawn off-card.

### Root cause

This is the same as Problem 1 — the children of the cards have negative `parentX` / `parentY` and are drawn outside their card's bounds.

### Fix

After grouping, walk through the cards and **explicitly reset the position of every nested child** to its intended location relative to its card. For example, in a color card with a Rectangle swatch at `(0, 0)` and three Text labels at `(16, 132)`, `(16, 154)`, `(16, 174)`:

```js
const cards = group.children.filter(c => c.name && c.name.startsWith("Color Card"));
for (const card of cards) {
  const ch = card.children;
  if (ch.length < 4) continue;
  penpotUtils.setParentXY(ch[0], 0,   0);    // Rectangle at top-left of card
  penpotUtils.setParentXY(ch[1], 16,  132);  // label
  penpotUtils.setParentXY(ch[2], 16,  154);  // token name
  penpotUtils.setParentXY(ch[3], 16,  174);  // hex value
}
```

---

## Problem 7 — Page root (`page.root`) has fixed tiny dimensions, so wide boards can break exports

### Symptom

The Penpot page root board is **always `0.01 × 0.01`** in size — its dimensions cannot be resized. Anything you add to it lives in absolute coordinates outside the root's bounding box.

### Root cause

Penpot treats the page root as a placeholder; all real content lives in user-created boards placed at absolute positions on the page.

### Fix

This is fine if you keep things in **named boards** with their own absolute coordinates (as you do normally). Just don't try to use `page.root.resize()`. If you need a master container, place the children boards directly on `page.root` rather than nesting them in a master board.

---

## Problem 8 — Shadows: `color` must be `{ color: "#hex", opacity: 0..1 }`, not `{ r, g, b, a }`

### Symptom

Setting a shadow like:

```js
shape.shadows = [{
  color: { r: 139/255, g: 92/255, b: 246/255, a: 0.25 },
  offsetX: 0, offsetY: 0, blur: 24, spread: 0,
  style: "drop-shadow", visible: true
}];
```

Renders as **black with low opacity** instead of violet. The shape's `.shadows` reads back as:

```js
{ color: { color: "#000000", opacity: 0.2 }, ... }
```

### Root cause

`Shadow.color` is a Penpot `Color` object shaped as `{ color: "#hex", opacity: 0..1 }` — **not** an `{r, g, b, a}` object. The wrong shape is silently ignored and Penpot falls back to a default black drop shadow.

### Fix

Use the `Color` object shape with a hex string and a separate `opacity` field:

```js
shape.shadows = [{
  color: { color: "#8B5CF6", opacity: 0.25 },
  offsetX: 0, offsetY: 0, blur: 24, spread: 0,
  style: "drop-shadow", visible: true
}];
```

Or use `penpot.shapesColors([shape])` to get a `Color` instance and inspect its fields before applying.

---

## Problem 9 — Gradient `startX` / `startY` / `endX` / `endY` are normalized, not pixels

### Symptom

Setting a gradient with pixel coordinates:

```js
shape.fills = [{
  fillColorGradient: {
    type: "linear",
    startX: 0, startY: 0, endX: 320, endY: 160,
    stops: [...]
  },
  fillOpacity: 1
}];
```

Reads back with `endX: ~1.0`, `endY: ~1.0` — Penpot silently normalized the vector. The `width` field keeps the original scale, but the direction vector is now in [0, 1] space.

### Root cause

Penpot stores gradient direction as a **normalized 0–1 vector**. Pixel values get divided by `width`. If the resulting vector wasn't strictly in [0, 1] (e.g. `endX: 320 / 320 = 1.0` exactly, or `endY: 160 / 320 = 0.5`), Penpot appears to clip and round.

In AstroVille the user dragged the second color point in the Penpot UI to place it at the rectangle's right-bottom corner. The values afterward were `endX: ~1.0, endY: ~1.0`. Pixel-perfect gradient positioning is **not** exposed as a writable property — the UI is the source of truth for the gradient handle positions.

### Fix

- For a **horizontal** gradient (left → right): `endX: 1, endY: 0`
- For **diagonal** (top-left → bottom-right): `endX: 1, endY: 1`
- For **vertical** (top → bottom): `endX: 0, endY: 1`
- For precise gradient **stop positions** along the direction, use `offset` (0–1) per stop.
- If exact gradient handle positions matter, do them in the Penpot UI and read back to confirm.

---

## Recommended Pattern: The AstroVille "Foundations" Page Template

The structure that worked for AstroVille's "00 — Design System" page:

```
page.root
├── "00 — Design System / Header" (board, 0, 0, 1440×120)
│   └── Group at (64, 40)
│       ├── "Design System"  text at (0, 0)   → renders at (64, 40)
│       └── "AstroVille — Foundations" text at (0, 52) → (64, 92)
│
├── "01 — Colors" (board, 0, 200, 1440×1460)
│   └── Group at (64, 40)
│       ├── Title + Description texts at (0, 0), (0, 48)
│       ├── "Background" label at (0, 100)
│       ├── 3 Color Cards in a row at (0, 178), (264, 178), (528, 178)
│       │   Each card has its own children at (0, 0), (16, 132), (16, 154), (16, 174)
│       └── ... 3 more groups (Brand, Feedback, Text) at (0, 498), (0, 818), (0, 1138)
│
└── ... other sections with the same structure
```

### Section y-offsets (relative to group's `(0, 0)`):

| Section type | Layout |
| --- | --- |
| Header | Title (0, 0), Subtitle (0, 52) |
| Title block | Title (0, 0), Description (0, 48) |
| Group header | Label (0, 100), Description (0, 130) |
| Card row | 3 cards at (0, 178), (264, 178), (528, 178) |
| Next row | 320px below previous: (0, 498), (0, 818), (0, 1138) |

### Verified-working helper for creating boards and texts:

```js
function makeText(parent, chars, opts) {
  const t = penpot.createText(chars);
  parent.appendChild(t);
  t.resize(opts.w || 400, opts.h || 60);
  t.x = opts.x;
  t.y = opts.y;
  t.fontFamily = opts.fontFamily || "Inter Tight";
  t.fontWeight = opts.fontWeight || "400";
  t.fontSize = opts.fontSize || 14;
  t.lineHeight = opts.lineHeight || "1.2";   // multiplier, NOT pixels
  t.fills = [{ fillColor: opts.color || "#F8FAFC", fillOpacity: 1 }];
  if (opts.transform === "uppercase") t.textTransform = "uppercase";
  return t;
}

function makeBoard(parent, name, x, y, w, h, opts) {
  opts = opts || {};
  const b = penpot.createBoard();
  b.name = name;
  parent.appendChild(b);
  b.resize(w, h);
  b.x = x;
  b.y = y;
  b.fills = opts.fills !== undefined ? opts.fills : [{ fillColor: "#090B1A", fillOpacity: 1 }];
  b.strokes = opts.strokes !== undefined ? opts.strokes : [];
  if (opts.borderRadius !== undefined) b.borderRadius = opts.borderRadius;
  if (opts.clipContent !== undefined) b.clipContent = opts.clipContent;
  if (opts.showInViewMode !== undefined) b.showInViewMode = opts.showInViewMode;
  return b;
}
```

### Section wrapping snippet (used to convert an existing layout to the Group pattern):

```js
const GROUP_OFFSET_Y = 40;

const children = [...sectionBoard.children];

// Shift children so they're relative to (0, 0).
for (const child of children) {
  child.y -= GROUP_OFFSET_Y;
}

// Wrap them in a single Group.
const group = penpot.group(children);

// Position the group itself.
if (group) {
  penpotUtils.setParentXY(group, group.parentX, GROUP_OFFSET_Y);
}
```

---

## Quick diagnostic checklist

When something "doesn't render":

1. **Check `penpot.generateMarkup([shape], { type: "svg" })`** — does the SVG actually contain the element? If yes, the issue is layout/export. If no, the issue is the shape itself.
2. **For text: check `text.textBounds`** — if it returns `null`, the text engine hasn't measured yet. Wait and re-check. If it stays `null`, the bounds are broken (use Problem 2 fix).
3. **For grouped content: walk descendants and check `parentX`/`parentY`** — if any are negative, the children got misaligned during the group operation (Problem 1 fix).
4. **For cards: verify `card.children[0].parentX === 0`** — children should always be relative to `(0, 0)` of their card.
5. **For absent content after exporting: try ungrouping and re-grouping** — sometimes Penpot's internal state is inconsistent.
6. **For shadows that render black instead of the intended color**: check that `color` is `{ color: "#hex", opacity: 0..1 }`, not `{r, g, b, a}` (Problem 8).
7. **For gradients that don't go where expected**: Penpot normalizes direction vectors. Use [0, 1] values for `startX/Y` and `endX/Y` (Problem 9).
8. **For text missing inside a component instance**: the text has stale `textBounds`. Set `text.x = inst.x; text.y = inst.y` and re-apply styling (Problem 10).
9. **For a variant showing the wrong children** (e.g., Indicator on Disabled instead of Selected): the variants were created in the wrong order. Pass them in the desired child-index order, not alphabetical (Problem 11).
10. **For a variant component that won't remove from the library**: remove the variant container from the page first via `oldContainer.remove()` (Problem 12).

---

## Creating Library Components (with Variants)

When the user asks to "create an asset", "make this a component", or "save to the library", follow the AstroVille Button workflow.

### The full workflow

1. **Build staging main-instance boards** off-page (e.g. at `x=2000`).
2. **Convert each to a `LibraryComponent`** via `penpot.library.local.createComponent([board])`.
3. **Combine them into a `VariantContainer`** via `penpotUtils.createVariantContainer([{shape, properties}, ...])`.
4. **Remove the auto-added "Property 3"** with `variants.removeProperty(...)` if you only have 2 axes.
5. **Replace old in-page shapes** with `component.instance()`, set variants via `inst.switchVariant(pos, value)`, and override text.
6. **Set `text.x = inst.x; text.y = inst.y`** to fix the inherited bounds issue (Problem 10 below).

### Example: building a Button (Type × State)

```js
// 1. Build 4 staging boards (236×52 each) at x=2000, y=2000
const violetToken = set.tokens.find(t => t.name === "color.brand.violet");

function makeStagingBoard(name, x, y, opts) {
  const board = penpot.createBoard();
  page.root.appendChild(board);
  board.resize(236, 52);
  board.x = x; board.y = y;
  board.fills = opts.fills;
  board.strokes = opts.strokes;
  board.borderRadius = 12;
  board.showInViewMode = true;
  board.clipContent = true;
  if (opts.opacity !== undefined) board.opacity = opts.opacity;

  const text = penpot.createText("Button");
  board.appendChild(text);
  text.resize(236, 52);
  text.x = 0; text.y = 0;
  text.fontFamily = "Inter Tight";
  text.fontWeight = "600";
  text.fontSize = 16;
  text.lineHeight = "1.2";
  text.fills = [{ fillColor: opts.textColor, fillOpacity: 1 }];
  text.align = "center";
  text.verticalAlign = "center";
  return board;
}

const staging1 = makeStagingBoard("Button / Primary / Default",   2000, 2000, { fills: [{ fillColor: violetToken.resolvedValue, fillOpacity: 1 }], strokes: [], textColor: "#F8FAFC" });
const staging2 = makeStagingBoard("Button / Primary / Disabled",  2296, 2000, { fills: [{ fillColor: violetToken.resolvedValue, fillOpacity: 1 }], strokes: [], textColor: "#F8FAFC", opacity: 0.4 });
const staging3 = makeStagingBoard("Button / Secondary / Default", 2000, 2112, { fills: [], strokes: [{ strokeColor: "#FFFFFF", strokeOpacity: 0.12, strokeWidth: 1 }], textColor: "#F8FAFC" });
const staging4 = makeStagingBoard("Button / Secondary / Disabled",2296, 2112, { fills: [], strokes: [{ strokeColor: "#FFFFFF", strokeOpacity: 0.12, strokeWidth: 1 }], textColor: "#F8FAFC", opacity: 0.4 });

// 2. Convert each to a LibraryComponent
const c1 = penpot.library.local.createComponent([staging1]);
const c2 = penpot.library.local.createComponent([staging2]);
const c3 = penpot.library.local.createComponent([staging3]);
const c4 = penpot.library.local.createComponent([staging4]);

// 3. Combine into a VariantContainer
const variantContainer = penpotUtils.createVariantContainer([
  { shape: c1.mainInstance(), properties: { Type: "Primary",   State: "Default"  } },
  { shape: c2.mainInstance(), properties: { Type: "Primary",   State: "Disabled" } },
  { shape: c3.mainInstance(), properties: { Type: "Secondary", State: "Default"  } },
  { shape: c4.mainInstance(), properties: { Type: "Secondary", State: "Disabled" } }
]);
variantContainer.name = "Button";
variantContainer.x = 2000;
variantContainer.y = 2200;

// 4. Remove the auto-added "Property 3"
const variants = variantContainer.variants;
const prop3Idx = variants.properties.indexOf("Property 3");
if (prop3Idx > -1) variants.removeProperty(prop3Idx);
```

### Instantiating and customizing

```js
// Get a fresh instance
const inst = buttonComponent.instance();
someParent.appendChild(inst);
inst.resize(236, 52);
inst.x = 0; inst.y = 0;

// Set the variant values (by property position)
inst.switchVariant(0, "Primary");   // Type
inst.switchVariant(1, "Default");   // State

// Override the text label
inst.children[0].characters = "CONFIRMAR ESCOLHA →";
```

### Staging boards become the component's source

After `createComponent`, the staging board **becomes** the component's main instance. **Do not delete it** — it's the source of truth that the library entry points to. If you want to hide it, move it off-page (e.g. `x=2000`).

### `createVariantContainer` auto-adds a "Property 3"

When called with 2 properties, Penpot still adds a 3rd `"Property 3"` (with all variants set to `"Value 1"`). Call `variants.removeProperty(2)` (or by name lookup) to remove it.

### Token application on `borderRadius` is broken

`radiusToken.applyToShapes([shape], ["borderRadius"])` fails with `Field 1 is invalid: should be a set of strings`. Just set `shape.borderRadius = 12` directly. The same problem may affect other token properties that expect string sets. Stick to the per-corner properties: `borderRadiusTopLeft`, `borderRadiusTopRight`, `borderRadiusBottomLeft`, `borderRadiusBottomRight`.

---

## Problem 10 — Text inside component instances has stale bounds

### Symptom

After instantiating a component (e.g. `Button` via `component.instance()`) and placing it inside a card, the inner text element does not render. The text's `textBounds.y` is some huge number like `1386` while `bounds.y` is correct. The text is at world `(0, 0)` instead of inside the instance.

### Root cause

The instance's text child is created at world origin `(0, 0)` and inherits its bounds state from the original staging board. When the instance is later moved to its final position via `inst.x` / `inst.y`, the text child's absolute position does not update, leaving it at world `(0, 0)` and relative `(−inst.x, −inst.y)`.

### Fix

After appending the instance to its parent and setting its position, force the text child to match the instance's world position:

```js
inst.x = finalX;
inst.y = finalY;
inst.resize(w, h);

const text = inst.children[0];
text.x = inst.x;
text.y = inst.y;
text.resize(w, h);
text.fills = [{ fillColor: "#F8FAFC", fillOpacity: 1 }];
text.fontFamily = "Inter Tight";
text.fontWeight = "600";
text.fontSize = 16;
text.lineHeight = "1.2";
text.align = "center";
text.verticalAlign = "center";
```

After this, `text.parentX` / `text.parentY` become 0,0 and `textBounds` becomes populated correctly. The text will render.

---

## Problem 11 — Variant children get reassigned to the wrong variant

### Symptom

When creating a variant component with variants that have **different child structures** (e.g., one variant has 2 children, another has 3 children with an extra "Indicator" element), the extra child may end up on the wrong variant.

Example observed in the AstroVille Zodiac Card component:
- Created 4 staging boards with different children counts
- After `createVariantContainer`, the "Disabled" variant had the Indicator child (3 children) instead of "Selected"

### Root cause

`createVariantFromComponents` (called internally by `penpotUtils.createVariantContainer`) processes variants in the order they're provided AND re-organizes the children based on the **maximum children count** across all variants. The child matching is by index, not semantic.

If you pass the variants in alphabetical order (Default, Disabled, Hover, Selected), the extra Indicator child may end up on "Disabled" because the order doesn't match your intent.

### Fix

**Pass the variants in the order you want them indexed** — typically matching the visual order on screen — **not** alphabetical. For example, if you want the Indicator on Selected:

```js
const variantContainer = penpotUtils.createVariantContainer([
  { shape: componentDefault.mainInstance(),  properties: { State: "Default"  } },
  { shape: componentHover.mainInstance(),    properties: { State: "Hover"    } },
  { shape: componentSelected.mainInstance(), properties: { State: "Selected" } },
  { shape: componentDisabled.mainInstance(), properties: { State: "Disabled" } }
]);
```

Then verify by inspecting the result:

```js
const variants = variantContainer.variants.variantComponents();
for (const v of variants) {
  const main = v.mainInstance();
  console.log(`${v.variantProps.State}: ${main.children.length} children`);
}
```

If the children counts are wrong, you can fix it by:
1. Re-creating the variant container (after deleting the old one via `oldContainer.remove()` from the page)
2. Or manually moving the extra child from the wrong variant to the correct one via `parent.appendChild(child)` / `parent.removeChild(child)`

---

## Problem 12 — `component.remove()` does not work for variant containers

### Symptom

Calling `localLib.components.find(c => c.name === "Button").remove()` succeeds silently — no error — but the component still appears in `localLib.components` after.

### Root cause

Variant containers are not detached the same way as simple components. They must be removed **from the page first** (which detaches the variant from the canvas), then the library entry can be cleaned.

### Fix

Remove the variant container from the page that holds it:

```js
const oldContainer = page.root.children.find(c => c.name === "Zodiac Card");
if (oldContainer) {
  oldContainer.remove();
}
```

This will also remove the component from the library. After this, `localLib.components` no longer contains the variant.

To re-create a clean component after a failed build:
1. `oldContainer.remove()` (cleans up the page)
2. `localLib.components.filter(c => c.name === "Default" || c.name === "Selected" ...).forEach(c => c.remove())` — cleans up any orphan individual components
3. Rebuild staging boards and re-run `createVariantContainer`

---

## Problem 13 — Component names get truncated to the last path segment

### Symptom

When you create a component with `penpot.library.local.createComponent([board])` where the board is named "Zodiac Card / Default", the resulting component is named just "Default", not "Zodiac Card / Default".

### Root cause

Penpot extracts the component name from the **last segment** of the main instance's name path (after the last `/`).

### Fix

This is fine for the library's display, but it means you **cannot find a component by its full staging board name**. Instead, look up components by:
- `library.components.filter(c => c.isVariant() && c.name === "Zodiac Card")` — for the variant container
- The variant components have short names like "Default", "Hover", "Selected", "Disabled"

When removing individual variant components after merging into a container:

```js
const orphans = localLib.components.filter(c =>
  ["Default", "Disabled", "Hover", "Selected"].includes(c.name) && !c.isVariant()
);
for (const c of orphans) c.remove();
```

These are the leftover individual components that get auto-generated alongside the variant container during `createVariantFromComponents`. They're typically safe to remove after the variant container is in place.

---

## References

- `penpot.group(shapes)` — groups the given shapes into a single Group; returns the Group or `null`.
- `penpot.ungroup(group)` — flattens a Group back into individual shapes.
- `penpotUtils.setParentXY(shape, parentX, parentY)` — sets position relative to a shape's parent.
- `penpotUtils.findShape(predicate, root?)` — find a shape by predicate.
- `penpot.generateMarkup(shapes, { type: "svg" })` — generate SVG markup; useful for debugging what's actually in the design.
- `penpot.export_shape({ shapeId, format: "png" })` — export a shape as PNG; useful for visual verification.
- `penpot.library.local.createComponent(shapes)` — create a LibraryComponent from a list of shapes.
- `penpotUtils.createVariantContainer([{shape, properties}, ...])` — combine multiple main-instance boards into a VariantContainer.
