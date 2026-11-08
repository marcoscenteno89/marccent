# To do: marccent.com

The rules for this list are in [PRODUCT-LINE.md §8](https://github.com/marcoscenteno89/marccent-theme/blob/master/PRODUCT-LINE.md#8-work-lists-ticketsmd-and-each-projects-todomd):
work fixed here only; anything the theme fixes is a ticket in marccent-theme's
[TICKETS.md](https://github.com/marcoscenteno89/marccent-theme/blob/master/TICKETS.md), linked under Waiting on.

## Bugs

- [ ] **`next build` fails** — `Module not found: @marccent/theme/styles/components/clock.css` (`app/landing/parts.js:12`), since the move to 1.0.0-rc.16. (found 2026-11-08)

## Requests

- [ ] **Finish the move to the theme's current release** — the package is renamed (`@marccent/theme`, pinned to theme 1.0.0-rc.16's commit, every import and CSS `@import`, `transpilePackages`, `types/modules.d.ts`, the `dev:link` scripts) but the site was built on 0.3.2. `next build` fails: `app/landing/parts.js` imports `styles/components/clock.css`, removed in 1.0.0-rc.15. Then every markup and prop change since 0.3.2 (CHANGELOG.md). `next lint` and `tsc` pass, so CI stays green while the build is broken. (found 2026-11-08)

## Waiting on

- [ ] **[T-017](https://github.com/marcoscenteno89/marccent-theme/blob/master/TICKETS.md)** — the stock chart's own layout CSS around the theme's Graph (found 2026-11-08)
- [ ] **[T-018](https://github.com/marcoscenteno89/marccent-theme/blob/master/TICKETS.md)** — calendar, count-up, gauges, clocks and the card fan still live in `next/components/widgets/` (found 2026-11-08)
- [ ] **[T-029](https://github.com/marcoscenteno89/marccent-theme/blob/master/TICKETS.md)** — the components' settings from the theme's settings file (found 2026-11-08)
- [ ] **[P-002](https://github.com/marcoscenteno89/marccent-theme/blob/master/TICKETS.md)** — marccent-html and this site are two copies of the same site (found 2026-11-08)

## After 1.0

## Notes
