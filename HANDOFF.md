# HANDOFF – Drömkontoret

Second app next to Drömboendet for RKJH's client event on 15 November 2026.

## Repositories and deployment

- `hamza-ygx/dromkontoret` holds the full app (Drömboendet + Drömkontoret) with Smedjan's history, on its default branch `claude/kind-euler-ip9j30`. This is the repo to import into Vercel; steps are in `README.md`.
- The same commits are on `hamza-ygx/smedjan` branch `feat/dromkontoret`, cut from `claude/dreamy-pascal-0crwfz` (which Vercel auto-deploys from Smedjan; merge only after Hamza's OK).
- Deployment config: `vercel.json` pins the framework to Next.js (the project was created with no framework preset, which broke the first build) and `package.json` pins Node 22.x. `next.config.ts` sets security headers (nosniff, frame deny, no-referrer, permissions policy, noindex). Set `APP_PASSCODE` (and optionally `SESSION_SECRET`) in Vercel for the event; verified in production mode that `/` and `/kontor` redirect to `/login` without a valid session.

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
  - `rates.ts` every adjustable figure (space, salaries, fees, rents, revenue presets, goods and other costs, tax) – sources in `RATES.md`
  - `costs.ts` monthly cost (rent, personnel, depreciation, other), break-even, result per revenue level; `flows.ts` splits 100 kr of revenue into the machine's pipes
  - `programs.ts` room programme per industry (which rooms, how big, which row); desk and table grids
  - `layout.ts` `generateOffice(config)`: balances rooms over two rows + corridor, walls with doors, shop windows and a glass entrance on the street side, pavement, trees, parking with chargers
  - `furnish.ts` places items per room kind (shop, stores, workshop hall in `furnish-trade.ts`); `parts.ts` / `parts-trade.ts` the box builders
  - `site.ts` lot, pavement, trees, builder's yard (fence, container, timber rack, vans), parking with chargers
- `app/office/`: `office-designer.tsx` (state, top bar, stage), `chooser.tsx`, `result.tsx` (result panel), `kalkyl.tsx` (Kalkyl tab, revenue level picker), `money-machine.tsx`, `icons.tsx`.
- Shared with Drömboendet: `Mark`, `StageActions`, `RoomList`/`ItemList` (`app/designer/lists.tsx`), `PlaceSearch` (optional `format`), `places.ts`, `Scene` (now takes any `Model3D` plus a wall `palette`), and the `place()` helper and generic builders exported from `lib/home/furnish.ts`.

## Phases

| # | Scope | Status |
| --- | --- | --- |
| 1 | Plan, route `/kontor`, top-bar toggle, office chooser (clicks only) | Done, pushed |
| 2 | Office generator + 3D for Konsult and Restaurang | Done, pushed |
| 3 | All five industries + catalogue with Swedish suppliers per style | Done, pushed |
| 4 | Result panel + cost model (rent, salaries, arbetsgivaravgift, break-even) + RATES.md | Done |
| 5 | "Vart tar pengarna vägen?" money machine | Done |
| 6 | Polish, 1440 / 1280×720 / phone, performance check | Done (verify on the event machine, see below) |

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

## Phase 4 results (cost model)

- Result panel: "Kostnad per månad" headline with yta, the industry metric and break-even; tabs Kalkyl (default) / Rum / Inredning.
- Kalkyl: lokalhyra (m² × kr/m²/år for the kommun), personalkostnad split into löner, arbetsgivaravgifter 31.42 % and pension/semestertillägg/försäkring (multiplier 1.42, confirmed by Hamza), avskrivning of inredning over 5 years, övriga kostnader, total, break-even (costs ÷ (1 − varuinköpsandel)), and the result at låg / normal / hög revenue down to bolagsskatt 20.6 % and "Kvar i bolaget" or "Förlust".
- Decisions taken without a reply (change in `rates.ts` if RKJH wants other figures): revenue presets are the researched estimates, calibrated so "normal" gives a sector-typical margin and "låg" a loss; inredning is written off over 5 years (20-regeln).
- Rents: office / street (retail B, used for restaurants and shops) / industrial formulas over the `places.ts` price level; see `RATES.md`.
- A 1-person konsult now gets a small meeting room, and slack width goes to the reception last, so the Entré is never larger than the office.

## Phase 5 results (money machine)

- "Vart tar pengarna vägen?" (stage button and Kalkyl tab) shrinks the office away and builds a CSS-3D machine: a hopper takes 100 kr, a manifold splits it into pipes (width by amount) that fill glass tanks (height by amount), with coins flowing continuously.
- Pipes: hyra, löner (incl. pension and semestertillägg), arbetsgivaravgifter, varor & material (industries with goods), inredning (avskrivning), övriga kostnader, bolagsskatt, kvar i bolaget. At a loss the last tank turns red ("Saknas") and tax is 0.
- Whole kronor always sum to 100 (checked for 600 cases). Click a pipe, tank, amount or legend chip for a one-line explanation with the monthly amount. Låg / normal / hög presets rebuild the machine. Labelled "Illustrativt exempelföretag". Esc or "Tillbaka till kontoret" returns; the office keeps its camera.

## Phase 6 results (polish and verification)

- Verified with headless Chromium on a production build: 1440×900, 1280×720 and 390×844 for all five industries, office and machine; no horizontal scroll, no console errors or warnings; switching apps and building both apps works with the network cut.
- Build to explorable ≈ 5 s. Style work while the office spins: ≈ 5 recalcs/s, < 1 ms/s (35-person konsult, ≈ 3 600 nodes). Machine running: ≈ 20 recalcs/s, ≈ 10 ms/s, no layouts. The office's render loop pauses while the machine is open.
- On phone width the office's Starta om / Ändra become icon buttons so the gold machine button fits; machine labels scale up as the machine shrinks.
- Drömboendet: only additive changes (`BoxEl`/`M` exported, optional `children` on `StageActions`); screens and behaviour unchanged.

## Drömsemestern v1 (added 6 Nov 2026)

- Third app at `/semester`, third segment in the top-bar toggle (short labels Boende / Kontor / Semester on phones).
- Chooser (clicks only): 12 destinations (each with a beach and a city place), budget as a range for the whole trip (50–100, 100–250, 250–500, 500–1 000, 1 000+ tkr), travellers (1, 2, 2+2, 4), nights (4/7/10/14), type of trip (sol, storstad, äventyr, mat & kultur), extras (hyrbil, allt inkluderat where common, guidade utflykter, avbeställningsskydd).
- `lib/semester/trip.ts` prices the trip at budget / mellan / lyx / ultralyx (staffed villa, first class, chauffeur) / privatjet (charter by flight hours) (flight, boende, mat, aktiviteter, transport, avbeställningsskydd) and picks the highest standard under the range's ceiling; the result panel lets guests switch standard and shows kvar/över budget and a savings plan (3/6/12 months).
- Stage (since 6 Nov 2026, replacing the 3D accommodation): `app/semester/globe.tsx` draws an orthographic globe on a canvas with d3-geo and the public-domain Natural Earth land data from `world-atlas` (110 m while flying, 50 m loaded lazily for the zoom). A plane flies the great-circle route from Stockholm (jet icon at the Privatjet level), the camera zooms in and `CardFan` (`app/semester/cards.tsx`) fans out photo cards: the stay for the chosen level (plus the jet), and four sights with cirkapris. Cards open a large photo view with credits. Nothing redraws once the flight has landed; "Flyg igen" replays it. On phones the cards become a swipeable strip under the globe.
- Kiosk (self-service at the event): `app/semester/kiosk.tsx`. Drömsemestern opens on an attract screen (globe with planes flying to random destinations, "Tryck för att börja"). After 75 s without touch a 10 s "Är du kvar?" countdown resets everything back to the attract screen (straight back if nothing was chosen). The large photo view has arrows and swipe; tap targets are ≥ 44 px, pinch-zoom/overscroll are blocked inside Drömsemestern and hover effects only apply on mouse devices. Globe painting is shared in `globe-paint.ts`.
- Content: `lib/semester/spots.ts` (coordinates, hero and four sights per place, generic stay cards per level); `lib/semester/cards.ts` builds the cards for a plan. Sight prices were verified against 2025–2026 prices (`docs/research/semester-sights-2026.md`).
- Photos: about 130 CC BY / CC BY-SA / CC0 / public-domain photos found through Openverse (Flickr and Wikimedia), cropped to 1024 × 650 WebP in `public/photos`, credits in `lib/semester/photos.json`. Shipped inside the app, so it works offline and guests' browsers make no third-party requests. Wikimedia's own API rate-limits the build sandbox's shared IP, which is why Openverse was used.
- Prices in `lib/semester/rates.ts` are per place (beach and city), researched 6 Nov 2026 from search extracts (`docs/research/semester-2026.md`, sources in `RATES.md`); all-inclusive extras, the Ultralyx factors and the private-jet hourly rates are estimates.

## Event checklist

- Set `APP_PASSCODE` in Vercel and promote/assign the production deployment (needs Hamza's OK).
- Check frame rate on the actual event machine and screen (software rendering in CI says nothing about GPU frame times); full screen with **F**.
- `*.vercel.app` URLs sit behind Vercel SSO for the team; use a custom domain or turn protection off for the event device, or sign that device in.

## Risks

- DOM size: a 35-person office is ≈ 3 600 nodes against ≈ 2 100 for a villa. Style recalc while spinning is measured and cheap; GPU frame time still needs a check on the event machine.
- `scene.tsx` (413 lines) and `globals.css` are already over the ~250-line guideline. Left as is to keep Drömboendet unchanged; office CSS goes in a clearly marked section.
- Commercial rents are not published per kommun. They are derived from the `places.ts` price level and calibrated against published city figures; Halmstad comes out at or slightly above asking rents found online.
- Revenue presets and the other-cost shares are estimates (marked so in `RATES.md`). A 1-person restaurant shows a loss at normal revenue because a café needs 12 seats and a kitchen whatever the staff.

## Verify

`npm run lint` (tsc), `npm run build`, then click through `/` and `/kontor` at 1440×900, 1280×720 and 390×844 with no console errors.
