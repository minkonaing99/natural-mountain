# Natural Mountain (v2.0)

Natural Mountain is a lightweight ordering demo for dairy products with:

- Customer storefront (`public/index.html`)
- Admin inbox (`public/admin.html`)
- External JSON catalog data (`public/data/stores.json`, `public/data/products.json`)
- Local JSON order persistence via API (`public/data/orders.json`)

## Project Structure

- `public/` - HTML pages and data files
- `public/data/` - editable JSON content
  - `stores.json`
  - `products.json`
  - `orders.json`
- `src/` - styles and page scripts
- `server.js` - local HTTP server + `/api/orders`

## Run Locally

```bash
node server.js
```

Open in browser:

- Customer: `http://localhost:4173/public/index.html`
- Admin: `http://localhost:4173/public/admin.html`

## Content Management

You can update stores and products without code changes:

- Edit `public/data/stores.json`
- Edit `public/data/products.json`

Orders are written to `public/data/orders.json` when customer submits a request.

## Notes

- This setup is intended for local/demo use.
- For production, replace JSON file writes with a database-backed API (e.g. MongoDB).
