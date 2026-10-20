# Drömboendet & Drömkontoret – RKJH

Stage demos for Revisionskonsulterna J Hägglund, shown on a big screen at the client event on 15 November 2026. Guests only click.

- **Drömboendet** (`/`): pick a home type, number of rooms, style, kommun and extras, and watch the home build in 3D in about 5 seconds, with an estimated price, monthly cost and a shopping list.
- **Drömkontoret** (`/kontor`): pick an industry, number of employees, style, kommun and extras, and watch the company's premises build in 3D with every desk, table, shelf, lift and van priced. Cost model and the "Vart tar pengarna vägen?" money machine are being added (see `HANDOFF.md`).

Switch between the two with the toggle in the top bar; each keeps its own state.

Everything runs offline in the browser. There is no API key, no database, no analytics and no backend call besides the optional passcode check. Guests enter no personal or company data.

## Run locally

```bash
npm ci
npm run dev          # http://localhost:3000
npm run lint         # TypeScript check
npm run build        # production build
```

Keys: **Enter** builds, **F** toggles fullscreen, **Esc** closes the item card. Drag to rotate, scroll to zoom. Use 3D/2D, spin and reset in the stage corner.

## Deploy on Vercel

1. Vercel → **Add New → Project** → import `hamza-ygx/dromkontoret`. Framework preset **Next.js** is detected; keep the default build command (`next build`) and output.
2. Node.js version: 20 or newer (Vercel's default is fine).
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
| `app/office/` | Drömkontoret UI: chooser, result panel |
| `lib/home/` | Home generator, catalogue, 290 kommuner (`places.ts`), price |
| `lib/office/` | Office generator: room programmes per industry, layout, furnishing, site, equipment catalogue, palettes |
| `lib/office/rates.ts` + `RATES.md` | Every adjustable figure, with sources |
| `HANDOFF.md` | Status, architecture, decisions, next steps |

Prices are approximate examples (cirkapris), not valuations or quotes.
