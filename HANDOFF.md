# HANDOFF – Drömkontoret

Second app next to Drömboendet for RKJH's client event on 15 November 2026.

## Repositories and deployment

- `hamza-ygx/dromkontoret` holds the full app (Drömboendet + Drömkontoret) with Smedjan's history, on its default branch `claude/kind-euler-ip9j30`. This is the repo to import into Vercel; steps are in `README.md`.
- The same commits are on `hamza-ygx/smedjan` branch `feat/dromkontoret`, cut from `claude/dreamy-pascal-0crwfz` (which Vercel auto-deploys from Smedjan; merge only after Hamza's OK).
- Deployment config: plain Next.js on Vercel, no `vercel.json` needed. `next.config.ts` sets security headers (nosniff, frame deny, no-referrer, permissions policy, noindex). Set `APP_PASSCODE` (and optionally `SESSION_SECRET`) in Vercel for the event; verified in production mode that `/` and `/kontor` redirect to `/login` without a valid session.

## Ground rules

- Fully offline: no backend, no database, no analytics, no API keys. Guests only click; nothing is entered, stored or sent. The kommun search is the only text input and never leaves the browser.
- Drömboendet must behave exactly as before.
- Plain CSS in `app/globals.css`, Swedish UI, RKJH branding, no code comments, no tests unless asked.
- CSS-3D performance rules from Drömboendet apply unchanged (only the world root transform per frame, class toggles on quadrant change, keyframes not transitions, no opacity on preserve-3d parents, avoid `.top`/`.f` collisions).
- All rates and prices live in one data file (`lib/office/rates.ts`) with sources in `RATES.md`.

## Architecture

- `app/(apps)/layout.tsx` keeps both apps mounted in `app/apps.tsx`; `app/(apps)/page.tsx` (`/`) and `app/(apps)/kontor/page.tsx` (`/kontor`) render nothing. Drömkontoret mounts on first visit and then stays mounted, so each app keeps its own choices, built model and camera.
- `app/switch.tsx`: segmented toggle in the top bar. Switches with `history.pushState`, so it never hits the network (verified offline) and never replays a build. Back/forward work. A hidden app pauses its render loop (`active`) and ignores keyboard shortcuts (`visible`).
- `lib/office/` mirrors `lib/home/`:
  - `types.ts` config, room kinds, `OfficePlan` (extends the shared `Model3D`)
  - `catalog.ts` chooser options; `equipment.ts` furniture/equipment catalogue per style (cirkapris exkl. moms, Swedish suppliers)
  - `palette.ts` colours per style
  - `rates.ts` every adjustable figure (space now; rents, salaries, taxes in phase 4) – sources in `RATES.md`
  - `programs.ts` room programme per industry (which rooms, how big, which row); desk and table grids
  - `layout.ts` `generateOffice(config)`: balances rooms over two rows + corridor, walls with doors, shop windows and a glass entrance on the street side, pavement, trees, parking with chargers
  - `furnish.ts` places items per room kind (shop, stores, workshop hall in `furnish-trade.ts`); `parts.ts` / `parts-trade.ts` the box builders
  - `site.ts` lot, pavement, trees, builder's yard (fence, container, timber rack, vans), parking with chargers
- `app/office/`: `office-designer.tsx` (state, top bar, stage), `chooser.tsx`, `result.tsx` (result panel), `icons.tsx`.
- Shared with Drömboendet: `Mark`, `StageActions`, `RoomList`/`ItemList` (`app/designer/lists.tsx`), `PlaceSearch` (optional `format`), `places.ts`, `Scene` (now takes any `Model3D` plus a wall `palette`), and the `place()` helper and generic builders exported from `lib/home/furnish.ts`.

## Phases

| # | Scope | Status |
| --- | --- | --- |
| 1 | Plan, route `/kontor`, top-bar toggle, office chooser (clicks only) | Done, pushed |
| 2 | Office generator + 3D for Konsult and Restaurang | Done, pushed |
| 3 | All five industries + catalogue with Swedish suppliers per style | Done, pushed |
| 4 | Result panel + cost model (rent, salaries, arbetsgivaravgift, break-even) + RATES.md | Next |
| 5 | "Vart tar pengarna vägen?" money machine | |
| 6 | Polish, 1440 / 1280×720 / phone, performance check | |

## Phase 2 results (Konsult, Restaurang)

- Headcount bands build 1 / 4 / 8 / 18 / 35 staff (confirmed by Hamza).
- Konsult: open plan with one desk per employee (double rows from 11 staff), reception/entré, meeting rooms (1 per ~9 staff), pentry or lounge, copy room, toilets; 15 m² per employee from 6 staff, more for tiny firms.
- Restaurang: 5.5 seats per employee (12 minimum), dining room sized by seats and whole tables, bar with stools, kitchen, dish, cold rooms, staff room. Up to 30 seats it becomes a "Café" with a smaller kitchen kit and no separate dish room.
- Build to explorable in about 4.5–5.3 s. Every visible piece is clickable (name, size, cirkapris, store).
- Spin check (headless, software rendering): style recalc is one cheap recalc per frame from the root transform, same as Drömboendet. The 35-person scenes have about 3 700 DOM nodes against 2 100 for a 5-room villa; verify frame rate on the event machine in phase 6.

## Phase 3 results (Bygg, Butik, Verkstad)

- Bygg: street-side office (20 % of staff at desks), "Snickeri" with a street port, "Lager & verktyg" with a port to a fenced yard holding timber rack, container and 1–8 vans (clickable, priced). The result total is labelled "Inredning, utrustning och bilar".
- Butik: shop floor sized 40 × staff^0.8 m² with gondolas (priced per section), wall shelving, checkouts (1 per 8 staff), stockroom with a delivery port, office from 6 staff.
- Verkstad: customer reception, workshop hall with one port and lift per bay (0.5 lifts per employee; two rows above 8 lifts), customer cars (scenery, not priced), workbenches, compressor, tyre machine, diagnostic carts, parts store.
- Middle fact in the result panel is per industry: arbetsplatser, sittplatser, servicebilar, m² butiksyta, billyftar.
- Walls stay 2.6 m everywhere (Scene untouched); ports are wide openings.
- All 600 option combinations generate with every room furnished, unique ids and labelled items (checked with a script).

## Phase 4 decisions already made

- Personalkostnad = salary × 12 × 1.42 (arbetsgivaravgift 31.42 % + tjänstepension and semestertillägg), shown as separate lines (confirmed by Hamza).

## Risks

- DOM size: 35 desks plus chairs and screens is far more boxes than a home. Desks will be 2–3 boxes each and repeated seating capped; check style recalc and frame time while spinning in phase 6.
- `scene.tsx` (413 lines) and `globals.css` are already over the ~250-line guideline. Left as is to keep Drömboendet unchanged; office CSS goes in a clearly marked section.
- Money machine is a second 3D view; it will reuse the box primitives from `scene.tsx`, which means exporting them.
- Commercial rents are not published per kommun. They will be derived from the `places.ts` price level and calibrated against published city figures; the UI labels them as approximate.

## Verify

`npm run lint` (tsc), `npm run build`, then click through `/` and `/kontor` at 1440×900, 1280×720 and 390×844 with no console errors.
