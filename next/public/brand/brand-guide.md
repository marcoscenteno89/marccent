# Marccent brand guide

The minimum for using the Marccent brand the same way everywhere.

## Logo

The logo is the icon plus the wordmark `marccent_`. The icon is a solid hexagon with an M opening through its base.

One gradient runs from the icon to the `_`, blue `#1f64cf` to cyan `#1ecbe1`. Only "marc" is outside it, in the text color: white on dark backgrounds, `#1a1a1a` on light ones.

| File | Use |
|---|---|
| `marccent-logo-on-dark.svg` | Dark backgrounds (default) |
| `marccent-logo-on-light.svg` | Light backgrounds |
| `marccent-logo-white.svg` | One color: photos, colored backgrounds, white print |
| `marccent-logo-dark.svg` | One color: dark print, faxes, stamps |
| `marccent-mark.svg` | The icon alone: avatars and square spaces (also the site favicon, `app/icon.svg`) |
| `marccent-mark-white.svg`, `marccent-mark-dark.svg` | The icon alone, in one color |
| `marccent-icon.svg` | App icon: the icon on a dark rounded tile |

The wordmark is outlined, so the files don't need the font installed. On the site the logo is the `Logo` component (`components/brand/logo.js`).

## Using the logo

- **Clear space:** keep at least half the icon's height clear on every side.
- **Minimum size:** the full logo at least 120px wide. The icon alone at least 24px; below 120px wide, use the icon alone.
- **Don't** stretch or squash the logo.
- **Don't** recolor it outside the brand colors.
- **Don't** put the color logo on a busy background; use a one-color version.
- **Don't** add shadows, outlines or effects.

## Colors

These are the site's default theme colors.

| Name | Hex | RGB | Use |
|---|---|---|---|
| Primary | `#1f64cf` | 31 100 207 | Links, buttons, the start of the gradient |
| Secondary | `#1ecbe1` | 30 203 225 | Accents, the end of the gradient |
| Dark | `#1a1a1a` | 26 26 26 | Dark backgrounds, text on light |
| Light | `#ffffff` | 255 255 255 | Light backgrounds, text on dark |

The gradient always runs primary to secondary. Use it sparingly, for what matters most.

## Typography

One family: **Plus Jakarta Sans** (free on Google Fonts; the site self-hosts it).

- **Headings:** bold (700) to extra bold (800).
- **Body:** regular (400), 16px.
- **Labels:** small, bold, uppercase.
- **Wordmark:** extra bold (800), lowercase, tight letter spacing.

## Style

- **Hexagons:** used for markers, icons and tiles.
- **Corners:** soft, with a 6px radius (0.375rem).
- **Backgrounds:** dark first, with bright blue and cyan accents.

## Folders

- **`archive/`:** the first logo and the old favicon.
- **`options/`:** SVGs of the earlier icon ideas.
- **`previews/`:** PNG comparison sheets of every idea explored.
