# Bookshelf

A small full-stack React application for browsing a shared collection of books. The API returns owners and their books; the client groups books into adult and children categories and sorts each list alphabetically.

## Requirements

- Node.js 20 or later
- npm 10 or later

## Run locally

From the repository root:

```sh
npm install
npm run dev
```

The React app is available at `http://localhost:5173` and the API at `http://localhost:3001/api/books`. Vite proxies `/api` requests to the local server.

## Verify and build

```sh
npm test
npm run build
```

The production server can be started with `npm start` after building. It listens on `PORT` (default `3001`).

## Configuration and assumptions

- Owners aged 18 or older are adults; owners aged 17 or younger are children.
- Each owned copy is listed separately, including duplicate titles belonging to different owners.
- Sorting is case-insensitive by title within each age category; ties are sorted by owner name.
- “Hardcover only” filters by the book's `type` and changes both category headings to the requested hardcover-specific wording.
- The API serves the provided sample collection as in-memory data. Replace `server/src/data.ts` with a persistent data source when one is available.
- The browser calls `/api/books` on the same origin by default. Set `VITE_API_URL` at client build time when the API is hosted at another origin, and set `CLIENT_ORIGINS` on the API server to a comma-separated allowlist containing the deployed client origin. Local development allows `http://localhost:5173` by default.