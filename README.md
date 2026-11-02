# LIMU Coffee

Mobile-first digital menu and demo coffee shop for LIMU Coffee. Plain HTML, CSS and JavaScript — no build step.

- `index.html` — the menu: search, filters, signature dishes, and a "my selection" order list to show the waiter
- `shop.html` — demo store for LIMU roasted coffee and mugs (no real payments)
- `js/data.js` — all menu items, prices (ETB) and shop products

## Run locally

```bash
python3 -m http.server
```

Then open http://localhost:8000.

## Deploy

Static site — deploy the folder as-is to Vercel (`npx vercel --prod`) or any static host.

Photo credits: see [CREDITS.md](CREDITS.md).
