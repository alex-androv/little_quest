# Little Quest Paywall

A mobile-first demo paywall built with Nuxt 4, TypeScript, Tailwind CSS and Neon Postgres. Purchases are simulated; no payment SDK or real charges are involved.

## Run locally

1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Create a Neon project and copy its pooled connection string.
4. Copy `.env.example` to `.env` and set `DATABASE_URL`.
5. Run `npm run dev`.

The `purchases` table is created automatically on the first purchase or restore request. Each purchase stores its offer ID, timestamp and browser-generated device ID.

## Project structure

- `app/pages/index.vue` — paywall UI, plan selection, loading/error/success states and restore flow.
- `app/assets/css/main.css` and `tailwind.config.js` — global styles and design tokens.
- `server/api/offers.get.ts` — `GET /api/offers`.
- `server/api/purchase.post.ts` — validates and records a simulated purchase.
- `server/api/restore.post.ts` — finds purchases associated with the current browser's device ID.
- `server/utils/db.ts` — Neon connection and table initialization.

## Deployment

Deploy the repository to Vercel as a Nuxt project and add `DATABASE_URL` in the project's Environment Variables for Preview and Production. Redeploy after setting the variable. Neon provides managed Postgres; Vercel runs the Nuxt server routes, so this is not a static-only deployment.

## AI tools and manual checks

AI assistance was used to scaffold and implement the UI and server routes. Before submission, manually verify mobile layouts at 360 px and 430 px, plan selection, loading/error states, successful purchase persistence, and restore behavior in the deployed environment. Run `npm run build` before deployment.

## If I had two more hours

I would add automated API/component tests, improve accessibility and keyboard focus states, add basic request rate limiting, and verify the complete purchase/restore flow on a real mobile browser.
