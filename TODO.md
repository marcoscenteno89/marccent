# To do: marccent

Open items for this project, by type. One line each: `- [ ] **What** — details (found YYYY-MM-DD)`; tick it when done.
Something marccent-theme can't do (missing or broken) goes in `marccent-theme/TICKETS.md` instead, naming this project.

## Requests

- [ ] **Images that follow the theme's colors (the demo site)** — on this site the photos show off the palette, so when the palette changes each image slot swaps to the closest-colored image from its own set (hero images for the hero, card images for cards): each image's main colors (hue, lightness, how saturated) stored once when it's added, matched by hue in OKLCH, the others loaded after the page settles and crossfaded on change. Images from a small curated library or fetched once at build time by color (Unsplash's search filters by color), never live. A cheaper first step for backgrounds: a duotone / tint in the theme's colors (a marccent-theme component, then every site gets it). (found 2026-11-05)
- [ ] **Thought to keep, not to build: "everything starts with field groups"** — not only content: the theme's settings, API keys and the rest would be field groups too, so anything can be added at any moment with the same tool. Workflows would follow the same idea: a code editor field where you write a flow, so the site stores data in fields and a flow you wrote sends it on (an entry to Brevo, say). A philosophy to come back to, not a plan. (found 2026-11-05)

## Bugs
