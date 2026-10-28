# Transparent banner assets

Created with the built-in image generation/editing tool from the existing project photos, using background-extraction edits. Original source files are retained. Converted to 512 px WebP with alpha preserved, quality 90 / alpha quality 100.

- `public/assets/promotions/oil-cutout.webp` — two oil bottles; source `public/assets/products/oil.jpg`.
- `public/assets/promotions/rice-cutout.webp` — rice bag; source `public/assets/products/rice.png`.
- `public/assets/promotions/tea-cutout.webp` — tea pouch; source `public/assets/products/tea.jpg`.

Prompt used separately for each asset: Produce an accurate cutout of the existing product photograph on a genuinely transparent alpha background. Remove only the white/checkerboard background, floor and cast shadow. Preserve product identity, count, colors, shape, packaging, artwork and printed text. Center the complete uncropped products with a small transparent margin. Clean antialiased edges; no added products, logos, border, glow, checkerboard, or scene.

The decoration circles are fixed CSS elements, colored by the banner palette, behind content. They are not part of the product images.

After publishing storefront assets, update only known old banner image URLs while preserving existing content/order/active status:

```sh
node frontend/deploy/seed-banners.cjs /opt/soodane/core /path/to/private/backup --refresh-images
```

The update backs up all existing placement data and uses the current version and configuration revision. Re-running it does not rewrite already upgraded placements.
