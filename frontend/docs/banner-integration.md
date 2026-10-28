# Storefront banners and catalog

The storefront reads `home.hero`, `shop.hero`, and `header.promo` through the public banners API with no browser caching. Empty, disabled, or unavailable placements render no section. A single item has no slider controls. Multiple items follow the backend autoplay, dots, and interval configuration. Hover, keyboard focus, a hidden tab, dragging, and reduced-motion preferences stop automatic movement. Text is rendered as text, with separate whole-banner links or action buttons.

Category chips and the advanced filter use the backend category list and its Persian names. Parent selections include descendants. Home category photos fill their square cards. Catalog and recommended products share the same card and quantity control.

## Initial content

`deploy/banner-content.json` contains three home slides, three shop slides, and one header banner. Images belong to the storefront public assets; publish the storefront before seeding. The content avoids claiming discounts or rewards that are not configured.

On the deployment host, run:

```sh
node /opt/soodane/frontend/deploy/seed-banners.cjs /opt/soodane/core /path/to/private/backup-directory
```

The script uses a five-minute administrator token in memory, writes a private backup of placement contents, and saves through the admin API with its current version and configRevision. It fills empty placements and preserves existing items. No token or backend secrets are printed or stored in the repository.

Checks: `node --test testing/catalog-categories.test.cjs`, `pnpm exec tsc --noEmit`, `pnpm build`, and mobile browser checks of categories, filtering, cart quantity, slider controls, and empty placements.
