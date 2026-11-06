# Drömboendet & Drömkontoret – RKJH

Stage demos for Revisionskonsulterna J Hägglund, shown on a big screen at the client event on 15 November 2026. Guests only click.

- **Drömboendet** (`/`): pick a home type, number of rooms, style, kommun and extras, and watch the home build in 3D in about 5 seconds, with an estimated price, monthly cost and a shopping list.
- **Drömkontoret** (`/kontor`): pick an industry, number of employees, style, kommun and extras, and watch the company's premises build in 3D with every desk, table, shelf, lift and van priced. The result panel shows rent, personnel cost, monthly cost and break-even; "Vart tar pengarna vägen?" zooms out to a money machine that shows where each 100 kronor of revenue goes.

- **Drömsemestern** (`/semester`): pick a destination, budget range (50 tkr to 1 Mkr+), travellers, nights, type of trip and extras; a plane flies from Stockholm across a globe, zooms in on the place and fans out photo cards of the stay and the sights, next to the trip's cost, the best level that fits the budget and a savings plan.

Switch between the apps with the toggle in the top bar; each keeps its own state.

Everything runs offline in the browser. There is no API key, no database, no analytics and no backend call besides the optional passcode check. Guests enter no personal or company data.

## Run locally

```bash
npm ci
npm run dev          # http://localhost:3000
npm run lint         # TypeScript check
npm run build        # production build
```

Keys: **Enter** builds, **F** toggles fullscreen, **Esc** closes the item card (and the money machine). Drag to rotate, scroll to zoom. Use 3D/2D, spin and reset in the stage corner.

## Deploy on Vercel

1. Vercel → **Add New → Project** → import `hamza-ygx/dromkontoret`. `vercel.json` pins the framework to Next.js, so no build or output settings are needed.
2. Node.js 22 (pinned in `package.json`).
3. Environment variables (Production and Preview):
   - `APP_PASSCODE` – code for the login screen. Leave unset to keep the app open. **Set it for the event deployment.**
   - `SESSION_SECRET` – optional long random string for signing the session cookie (defaults to `APP_PASSCODE`). Changing either logs everyone out.
4. Deploy. The production branch is the repository's default branch.

The passcode gate is enforced server-side in `proxy.ts` for every page and API route except `/login` and `/api/auth`.

## Code map

| Path | What |
| --- | --- |
| `app/(apps)/layout.tsx`, `app/apps.tsx`, `app/switch.tsx` | Keeps both apps mounted; top-bar toggle (`history.pushState`, works offline) |
| `app/designer/` | Drömboendet UI and the shared CSS-3D `Scene`, lists, place search |
| `app/office/` | Drömkontoret UI: chooser, result panel, Kalkyl tab, money machine |
| `app/semester/`, `lib/semester/` | Drömsemestern: chooser, globe (`globe.tsx`), photo cards and large view (`cards.tsx`), result panel; destinations, price data (`rates.ts`), trip cost and level pick (`trip.ts`), places and sights (`spots.ts`), photo credits (`photos.json`) |
| `public/photos/` | Bundled CC/public-domain photos for Drömsemestern |
| `lib/home/` | Home generator, catalogue, 290 kommuner (`places.ts`), price |
| `lib/office/` | Office generator: room programmes per industry, layout, furnishing, site, equipment catalogue, palettes |
| `lib/office/rates.ts` + `RATES.md` | Every adjustable figure (space, salaries, fees, rents, revenue presets, tax), with sources |
| `lib/office/costs.ts`, `lib/office/flows.ts` | Monthly cost, break-even, result per revenue level; the money machine's split of 100 kr |
| `HANDOFF.md` | Status, architecture, decisions, next steps |

Prices are approximate examples (cirkapris), not valuations or quotes.
