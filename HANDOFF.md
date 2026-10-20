# HANDOFF – Drömkontoret

Second app next to Drömboendet for RKJH's client event on 15 November 2026. Branch `feat/dromkontoret`, cut from `claude/dreamy-pascal-0crwfz` (which Vercel auto-deploys; merge only after Hamza's OK).

## Ground rules

- Fully offline: no backend, no database, no analytics, no API keys. Guests only click; nothing is entered, stored or sent. The kommun search is the only text input and never leaves the browser.
- Drömboendet must behave exactly as before.
- Plain CSS in `app/globals.css`, Swedish UI, RKJH branding, no code comments, no tests unless asked.
- CSS-3D performance rules from Drömboendet apply unchanged (only the world root transform per frame, class toggles on quadrant change, keyframes not transitions, no opacity on preserve-3d parents, avoid `.top`/`.f` collisions).
- All rates and prices live in one data file (`lib/office/rates.ts`) with sources in `RATES.md`.

## Architecture

- `app/(apps)/layout.tsx` keeps both apps mounted in `app/apps.tsx`; `app/(apps)/page.tsx` (`/`) and `app/(apps)/kontor/page.tsx` (`/kontor`) render nothing. Drömkontoret mounts on first visit and then stays mounted, so each app keeps its own choices, built model and camera.
- `app/switch.tsx`: segmented toggle in the top bar. Switches with `history.pushState`, so it never hits the network (verified offline) and never replays a build. Back/forward work. A hidden app pauses its render loop (`active`) and ignores keyboard shortcuts (`visible`).
- `lib/office/` mirrors `lib/home/`: `types.ts`, `catalog.ts` (options now; furniture catalogue in phase 3), then `layout.ts`, `furnish.ts`, `rates.ts`, `cost.ts`.
- `app/office/`: `office-designer.tsx` (state, top bar, stage, result), `chooser.tsx`, `icons.tsx`.
- Shared with Drömboendet: `Mark`, `StageActions` (Starta om / Ändra), `PlaceSearch` (now takes an optional `format` for the per-kommun figure), `places.ts`, `Scene`.

## Phases

| # | Scope | Status |
| --- | --- | --- |
| 1 | Plan, route `/kontor`, top-bar toggle, office chooser (clicks only) | Done, awaiting OK |
| 2 | Office generator + 3D for Konsult and Restaurang | Next |
| 3 | All five industries + catalogue with Swedish suppliers per style | |
| 4 | Result panel + cost model (rent, salaries, arbetsgivaravgift, break-even) + RATES.md | |
| 5 | "Vart tar pengarna vägen?" money machine | |
| 6 | Polish, 1440 / 1280×720 / phone, performance check | |

## Plan for phase 2 onwards

- Scene reuse: `Scene` reads wall colours from `PALETTE[plan.config.vibe]`. Phase 2 adds a `walls` colour prop (Drömboendet passes the same palette entry) and a shared `Model3D` shape in `lib/home/types.ts` that `Plan` extends, so the office plan renders through the same component and choreography. `Room` gets a generic kind parameter defaulting to the home kinds.
- Office layout: same two-row + corridor idea, parameterised per industry. Konsult: open plan (one desk per employee), meeting rooms, reception, kitchen, WC. Restaurang: dining room, commercial kitchen, bar, WC, staff room. Bygg: office + yard with van and material racks (site boxes). Butik: shop floor with shelves + checkout, stockroom. Verkstad: one large hall with lifts/workbenches, office, staff room.
- Furniture: reuse the `place()` local-frame helper and the generic builders from `lib/home/furnish.ts` by exporting them (no behaviour change).
- Floor area from m² per employee per industry (sourced, in `rates.ts`).

## Risks

- DOM size: 35 desks plus chairs and screens is far more boxes than a home. Desks will be 2–3 boxes each and repeated seating capped; check style recalc and frame time while spinning in phase 6.
- `scene.tsx` (413 lines) and `globals.css` are already over the ~250-line guideline. Left as is to keep Drömboendet unchanged; office CSS goes in a clearly marked section.
- Money machine is a second 3D view; it will reuse the box primitives from `scene.tsx`, which means exporting them.
- Commercial rents are not published per kommun. They will be derived from the `places.ts` price level and calibrated against published city figures; the UI labels them as approximate.

## Verify

`npm run lint` (tsc), `npm run build`, then click through `/` and `/kontor` at 1440×900, 1280×720 and 390×844 with no console errors.
