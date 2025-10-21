
# EmberMate Mock Data Kit (Drop‑in)

This kit only **adds** mock data to existing localStorage keys your template already expects. It does **not** change your HTML structure, IDs, or CSS classes.

## Files
- `js/app-enhanced.js` — generates realistic demo data and exposes `window.EmberMate.loadSampleData()`
- `assets/onboarding-styles.css` — optional minimal CSS (safe to include or ignore)

## Quick Install (no code changes)
1. Copy the `js` and `assets` folders into your project root.
2. In `index.html` add **before** your main `app.js`:
```html
<script src="./js/app-enhanced.js"></script>
<script src="./js/app.js"></script>
```
3. Open your app with `?demo=1` to auto-fill data, for example:
```
http://localhost:3000/index.html?demo=1
```
Or run in the browser console:
```js
window.EmberMate.loadSampleData();
```

### What gets populated
- `settings`, `medications`, `vitals`, `weight`, `symptoms`, `goals`, `medicationLogs`, `achievements`

If a key already exists, the script merges new items without overwriting your user's existing values.

## Removal
Just delete the script tag or remove the generated keys from `localStorage`.
