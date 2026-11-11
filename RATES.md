# Rates and sources – Drömkontoret

All figures used by Drömkontoret live in `lib/office/rates.ts`; the cost model in `lib/office/costs.ts` and the money machine in `lib/office/flows.ts` only combine them. This file lists where each one comes from. Raw research notes, with every search extract: `docs/research/rates-2026.md`. Furniture and equipment prices in `lib/office/equipment.ts` are approximate example prices (cirkapris, excluding VAT) from the named suppliers, not quotes.

Confidence: **high** = primary source (authority or statistics agency), **medium** = broker or industry source, **estimate** = set by us for the demo where no published figure exists.

## Space

| Key in `SPACE` | Value | Basis | Source | Confidence |
| --- | --- | --- | --- | --- |
| `officePerStaff` | 15 m² LOA per employee | Activity-based offices 10–15 m² per employee; new state leases target 12–15 m², current state average 22 m² | Riksrevisionen RiR 2025:17 "Kostsam kvadratjakt" – https://www.riksrevisionen.se/granskningar/granskningsrapporter/2025/kostsam-kvadratjakt---statens-anvandning-och-anskaffning-av-kontorslokaler.html · Lokalguiden – https://www.lokalguiden.se/magasinet/artikel/hur-m%C3%A5nga-kvm-per-anst%C3%A4lld | High / medium |
| `officeMin` | 40 m² | Smallest sensible office with WC and pentry | – | Estimate |
| `diningPerSeat` | 1.3 m² per seat | 1.0–1.5 m² per seat in a standard dining room | Helioneon – https://helioneon.com/se/blog/restauranginredning-steg-regler-rad/ · TheFork Manager – https://www.theforkmanager.com/sv/blog/organisation-restauranger-kapacitet | Medium |
| `kitchenShare` | 30 % of dining + kitchen area | Kitchen and dishwashing 25–35 % of the restaurant | Helioneon, as above | Medium |
| `seatsPerStaff` | 5.5 seats per employee | A 60-seat restaurant has about 10–12 employees | – | Estimate |
| `minSeats` | 12 | Smallest café | – | Estimate |
| `byggOfficeShare` | 20 % of a construction firm's staff have a desk (minimum 1) | Most staff work on site | – | Estimate |
| `storagePerTrade` | 10 m² store and workshop per tradesperson (minimum 24 m²) | 10–30 m² per tradesperson; split 55 % store, 45 % workshop from 4 staff | Research notes (no published norm) | Estimate |
| `vansPerStaff` | 1 van per 3 staff (1–8) | – | – | Estimate |
| `shopSalesBase`, `shopSalesExponent` | Sales area = 40 × staff^0.8 m² (min 40) | Specialty retail 40–100 m² sales area per FTE; larger stores have more staff per m² | No primary source found (HUI/Handelsfakta hold the data) | Estimate |
| `stockShare` | Stockroom 25 % of sales area | – | – | Estimate |
| `liftsPerStaff` | 0.5 lifts per employee (min 1) | Car workshops need 60–80 m² per work bay including circulation; the generator lands at about 60 m² per lift | startaenskildfirma.se – https://startaenskildfirma.se/bransch/bilmekaniker | Medium |

The generated floor plans follow these norms, but rooms have minimum widths and the dining room must fit whole tables, so small companies come out somewhat larger per employee than the norm.

## Personnel cost (`PAY`, `SALARY`)

| Key | Value | Basis | Source | Confidence |
| --- | --- | --- | --- | --- |
| `PAY.employerFee` | 31.42 % | Full arbetsgivaravgift 2026. The youth reduction (20.81 % for ages 19–23, Apr 2026 – Sep 2027) is not modelled. | Skatteverket, "Belopp och procent – inkomstår 2026" – https://www.skatteverket.se/privat/skatter/beloppochprocent/2026 | High |
| `PAY.personnelMultiplier` | 1.42 × gross salary | 31.42 % fees + ITP/avtalspension 4.5 % incl. särskild löneskatt (≈ 5.6 %) + semestertillägg (≈ 2 %) + collective insurances (≈ 0.5 %). Shown as löner, arbetsgivaravgifter and "pension, semestertillägg, försäkring". Confirmed by Hamza. | Avtalat 2026 premiums – https://www.avtalat.se/media/swdjxbd1/2026-premier_asl_22-12-2025.pdf · Fortnox employee cost calculator – https://www.fortnox.se/fortnox-foretagsguide/kalkylatorer/sa-mycket-kostar-en-anstalld | Medium-high |
| `SALARY.konsult` | 48 000 kr/month | Blend of redovisningsekonom (2025 median ≈ 43 000) and management consultant (2025 median 53 700), × 1.035 to 2026, weighted towards byrå | SCB lönestrukturstatistik 2025 via 8till5 – https://8till5.se/artiklar/vad-tjanar-en-redovisningsekonom/ and Konsultguiden – https://konsultguiden.se/vad-tjanar-en-konsult/ | Medium |
| `SALARY.restaurang` | 31 500 kr/month | Kock ≈ 32 200, servitör 29 500 (2024), restaurangbiträde 28 300; blend × 1.035 | SCB via Affärslivet – https://xn--affrslivet-s5a.com/rapporter/sveriges-lonerapport-2026/ · Alla Yrken – https://www.allayrken.se/yrke/servitorservitris/ | Medium |
| `SALARY.bygg` | 41 700 kr/month | Snickare private-sector median 40 300 (2025) × 1.035 | SCB via Kollalonen – https://www.kollalonen.se/yrken/snickare-lon/ · Byggföretagen lönerapport – https://byggforetagen.se/app/uploads/2025/02/Lonerapport-avtal-2025.pdf | Medium |
| `SALARY.butik` | 34 000 kr/month | Butikssäljare fackhandel median 33 000 (2025) × 1.035 | SCB via Gymnasieskolan.se – https://www.gymnasieskolan.se/yrken/butikssaljare-fackhandel/ | Medium |
| `SALARY.verkstad` | 36 000 kr/month | Bilmekaniker median 35 000, lagerpersonal ≈ 33 400 (2025); blend × 1.035 | SCB via Astaagency – https://www.astaagency.se/verktyg/lonekarta/bilmekaniker · Kollalonen – https://www.kollalonen.se/yrken/lagerarbetare-lon/ | Medium |
| Wage growth 2025 → 2026 | × 1.035 | Märket +3.0 % from Apr 2026; actual whole-economy growth ≈ 3.3–3.6 % | Medlingsinstitutet, Analysunderlag 2026M05 – https://www.mi.se/app/uploads/Analysunderlag_2026M05.pdf | High |

## Rent (`RENT`, `RENT_SEGMENT`)

Commercial rents are not published per kommun. Rents are derived from each kommun's price level V in `lib/home/places.ts` (villa tkr/m², the same scale Drömboendet uses) with formulas fitted to the Newsec/Objektvision 2026 city ranges (Stockholm, Göteborg, Malmö, Jönköping) plus a small-town anchor. Rents are kallhyra-level market rents excl. moms, rounded to 10 kr/m²/år, and applied to the whole generated floor area (LOA).

| Segment | Formula, kr/m²/år | Used for | Check | Source | Confidence |
| --- | --- | --- | --- | --- | --- |
| `office` | 900 + 1.1·V² | Konsult | Halmstad (V 31) 1 960 · Stockholm (65) 5 550 · Göteborg (45) 3 130 · small town (10) 1 010 | Objektvision/Newsec "Aktuella hyresnivåer" 2026 – https://objektvision.se/marknadsstatistik/hyresniv%C3%A5er · Fastighetsindex via fastighetsstatistik.se – https://fastighetsstatistik.se/lokaltyper/kontor | Medium (fit) |
| `street` | max(800, 0.55 × (max(900, 840·√V − 1 330))) | Restaurang, Butik (retail B / street level) | Halmstad 1 840 · Stockholm 2 990 · Göteborg 2 370 · small town 800 | As above; restaurants rented at retail B level (research note) | Medium-low |
| `industrial` | 450 + 15·V | Bygg, Verkstad | Halmstad 920 · Stockholm 1 430 · small town 600 | As above (industri/lager A) · Halmstad listings – https://www.verksamhetslokaler.se/hyra/kontorslokaler/halmstad | Medium |

Halmstad is not in Newsec's survey; asking rents found (offices 1 000–1 350, industrial 495–1 200) sit at or below the formula, so the formula errs on the high side there.

## Revenue (`REVENUE_PER_STAFF`) – the låg / normal / hög presets

Revenue is a preset per employee and year, excl. moms. It drives only the "Om omsättningen är …" result and the money machine; break-even does not depend on it.

| Industry | Låg / normal / hög, tkr per employee | Basis | Confidence |
| --- | --- | --- | --- |
| Konsult / byrå | 1 000 / 1 250 / 1 600 | Accounting firms ≈ 1 040 tkr per employee, personnel 57.4 % of revenue, EBITA 9.2 % (Oxceed via Tidningen Balans – https://tidningenbalans.se/nyheter/okade-personalkostnader-och-minskad-omsattningstillvaxt-for-redovisningsbyraer/); management consultants ≈ 1 300–2 500 (1 100–1 500 kr/h × 1 300–1 600 h) | Estimate |
| Restaurang / café | 850 / 1 150 / 1 500 | Small firms' 2024 accounts 1 150–1 250 tkr per employee; SCB average operating margin ≈ 2.5 % (https://www.scb.se/hitta-statistik/temaomraden/sveriges-ekonomi/fordjupningsartiklar_Sveriges_ekonomi/starkare-lonsamhet-inom-hotell--och-restaurangnaringen/) | Estimate |
| Bygg & hantverk | 1 200 / 1 600 / 2 200 | Directory median ≈ 1 400 tkr per employee for house builders | Estimate |
| Butik | 1 600 / 2 200 / 3 000 | All retail (SNI 47) 4 833 tkr per employee incl. grocery and chains (Affärslivet from SCB FEK 2024 – https://xn--affrslivet-s5a.com/bransch/detaljhandel-utom-med-motorfordon-och-motorcyklar/); specialty stores well below that | Estimate |
| Verkstad / lager | 1 100 / 1 500 / 2 000 | No published figure found | Estimate |

Calibration target: at "normal" the example company makes a modest profit in line with the sector (restaurants ≈ 3–8 %, construction and workshops ≈ 8–10 %, specialty retail ≈ 5 %, byrå ≈ 13 %), at "låg" a loss, at "hög" a strong year. Tiny companies come out weaker because of minimum room sizes.

## Goods, other costs, depreciation and tax

| Key | Value | Basis | Source | Confidence |
| --- | --- | --- | --- | --- |
| `GOODS_SHARE` (varuinköp och material, share of revenue) | Konsult 0 · Restaurang 32 % · Bygg 36 % · Butik 55 % · Verkstad 38 % | Restaurant food and drink 28–35 %; specialty retail 50–60 %; construction materials + subcontractors 35–50 %; workshop parts 30–45 % | Ekonomifakta "Vad kostar ett jobb?" – https://www.ekonomifakta.se/sakomraden/foretagande/vad-kostar-ett-jobb_1209975.html · startarestaurang.nu – https://startarestaurang.nu/handbok/ekonomi-i-drift/ | Medium (restaurant) / estimate |
| `OTHER_SHARE` (övriga kostnader) | Konsult 18 % · Restaurang 10 % · Bygg 8 % · Butik 10 % · Verkstad 8 % of normal revenue, as a fixed monthly cost | IT, telefon, försäkringar, el, marknadsföring, redovisning/revision; vehicle running costs for Bygg. Other external costs 10–20 % for service firms. Fixed, so it weighs more when revenue is low. | Research notes §6 | Estimate |
| `PAY.depreciationYears` | 5 years, straight line | Inventarier (furniture, equipment, vans) under räkenskapsenlig avskrivning: the kompletteringsregel (20-regeln) writes off 20 % of cost per year, i.e. 5 years straight line; the huvudregel (30-regeln) allows faster | Inkomstskattelagen 18 kap. 13–22 §§ via FAR – https://www.faronline.se/dokument/rs_rakenskapsenligavskrivning/ · Fortnox – https://www.fortnox.se/fortnox-foretagsguide/bokforing/avskrivningar-av-inventarier-guide | Medium-high |
| `PAY.corporateTax` | 20.6 % of profit, 0 when there is a loss | Flat rate for fiscal years from 2021, unchanged in 2026 | Skatteverket, "Aktiebolag" – https://www.skatteverket.se/foretag/drivaforetag/foretagsformer/aktiebolag.4.5c13cb6b1198121ee8580002546.html | High |

## How the numbers combine

- Lokalhyra per månad = floor area × rent per m² per year ÷ 12.
- Personalkostnad per månad = salary × staff × 1.42, shown as löner + arbetsgivaravgifter (31.42 %) + pension, semestertillägg och försäkring (10.58 %).
- Avskrivning = inredning total ÷ 5 ÷ 12.
- Kostnad per månad = lokalhyra + personalkostnad + avskrivning + övriga.
- Break-even omsättning = kostnad per månad ÷ (1 − varuinköpsandel).
- Money machine: every flow divided by the month's revenue × 100, rounded to whole kronor that sum to 100. Löner includes pension and semestertillägg. When costs exceed revenue the last tank shows what is missing ("Saknas").

## Drömsemestern (`lib/semester/rates.ts`)

Researched 6 Nov 2026; full tables, about 54 source references and caveats in `docs/research/semester-2026.md`. Every figure came from search-result extracts (source pages could not be opened from the sandbox), so treat them as indicative 2026 high-season levels in SEK.

| Key | Value | Basis | Source | Confidence |
| --- | --- | --- | --- | --- |
| `DEST_RATES[*].flight` | Round trip per adult from Arlanda/Landvetter, budget / mellan / lyx, per place | Budget = low end and mellan = middle of momondo's typical price range per route; lyx ≈ 3 × mellan in Europe (one SAS business data point), ≈ 2.2 × long-haul (premium economy) | momondo route pages (see research notes) | Medium (budget/mellan), estimate (lyx) |
| `DEST_RATES[*].night` | Per night for 2 adults sharing, budget (2★/simple) / mellan (3–4★) / lyx (5★ or villa) | momondo average price per star class, checked against CoStar ADR (US), Phuket market averages and HotelBank (Tokyo); obviously wrong extracts replaced by estimates | Research notes | Medium |
| `DEST_RATES[*].food` | Per adult per day eating out, mellan | Sweden ≈ 600–650 kr; other places ≈ 600 × price index plus a tourist-area markup | Eurostat price level indices for restaurants and hotels 2025; GlobalCostData outside the EU | Estimate |
| `DEST_RATES[*].index` | Price level vs Sweden (restaurants and hotels) | Eurostat 2025 PLI ÷ Sweden 124 (e.g. Greece 86.1 → 0.69, France 116 → 0.94); US, Japan, Thailand, Egypt from GlobalCostData | Research notes | Medium (EU) / low (non-EU) |
| `EXTRA.indexFloor` | 0.35 | Activities and local transport never priced below 35 % of Swedish levels (tourist prices); stops Egypt's 0.20 making trips nearly free | – | Estimate |
| `DEST_RATES[*].car` | Economy car per day | Rental price searches per place; city places reuse the country's figure; Egypt is an estimate | Research notes | Medium-low |
| `DEST_RATES[*].allInclusive` | Extra per adult per night vs room only (Spanien, Grekland, Turkiet, Egypten, Thailand beach places only) | No 2026 Ving/TUI/Apollo price lists found | – | Estimate |
| `EXTRA.cancellationShare` | 5 % of flight + boende | Market average 3–6 % | HelloSafe (via research notes) | Medium |
| `PARTY`, `KID`, `STANDARD_FACTOR`, `ACTIVITY_PER_DAY`, `EXTRA` (rest) | Room size factor per party, children's share of flight/food/activities, food and activity levels per standard, activities per style | Set for the demo | – | Estimate |
| `ULTRA` | Flight × 2.5 of lyx, night × 6 of lyx, private transport × 4, food × 3.2 and activities × 3.5 of mellan | Ultralyx = first/business, a staffed villa or palace suite, chauffeur and private guides. Staffed villas on Crete list at €2 600–5 000 per night for 10–12 guests, Mykonos €2 200–8 500 | Villanovo staffed villas – https://www.villanovo.com/villa-rentals/europe/greece/service:house-staff · Isleblue, Montessito – https://isleblue.co/villas/vacation-rentals/greece/mykonos/agia-sophia/villa-montessito | Estimate (anchored) |
| `JET` | Whole plane, round trip billed for both legs: flight hours per way × 2 × hourly rate × 1.10 (fees) × 11.15 SEK/EUR. Light €2 800/h (≤ 1 h), midsize €5 500/h (≤ 4.5 h), super-mid €9 000/h (≤ 6 h), heavy €15 000/h (long-haul) | European light jets ≈ €2 400–3 500/h; midsize ≈ £4 500/h, super-mid ≈ £8 000/h, heavy £15 000+/h (UK operator); US heavy jets $12 000–25 000/h intercontinental. Hours per way are approximate great-circle flight times from Stockholm | JETVIP pricing FAQ – https://jetvip.com/blog/arenda-chastnogo-samoleta-chasto-zadavaemye-voprosy-ceny-nyuansy-sovety-jetvip/ · Elysium Jet 2026 guide – https://elysiumjet.com/private-jet-charter-cost-2026-pricing-guide/ · Global Charter – https://www.globalcharter.com/post/private-jet-charter-costs | Low-medium (broker blogs) |

### Sights and stays on the photo cards (`lib/semester/spots.ts`)

Each place has four sights with a cirkapris per adult (0 = free). Prices were checked on 6 Nov 2026 against 2025–2026 ticket and tour prices; the full table with source links and confidence per row is in `docs/research/semester-sights-2026.md`. All figures came from search extracts; official sites could not be opened from the sandbox.

- Summer/high-season adult prices, converted at EUR 11.15, USD 9.96, THB 0.296, JPY 0.063, TRY 0.201, EGP 0.183 SEK.
- Tours (boat trips, food walks, safaris, day trips) use a typical mid-range bookable tour price per adult, e.g. Plitvice as a guided day trip incl. park entry (1 230 kr), Capri as a shared boat tour (1 450 kr).
- Notable 2026 changes: Trevi Fountain basin fee €2 since 2 Feb 2026; Grand Egyptian Museum EGP 1 830 from 1 Nov 2026; Vasa museum 240 kr in summer.
- Three sights were swapped after the price check because no usable free photos existed: Gotlands museum → Visby domkyrka (free), Coves del Drach → Cap de Formentor (free viewpoint), Musée Matisse → Cours Saleya market (free).
- Sight prices are shown for information and are not added to the trip total; activities in the cost panel come from `ACTIVITY_PER_DAY`.
- Stay cards show the trip's own price per night for the chosen level; they are generic photos of that type of stay, not named hotels.

### Photos (`public/photos`, credits in `lib/semester/photos.json`)

Photos are Creative Commons or public-domain images found through Openverse (https://openverse.org) and shipped inside the app (no third-party requests at runtime). Only CC BY, CC BY-SA, CC0 and public-domain images are used; each one is cropped to 1024 × 650 and credited with photographer, license and source link in the large view.

### Travellers, nights, departure and trip types (added 8 Nov 2026)

| Key | Value | Basis | Confidence |
| --- | --- | --- | --- |
| `ROOM` | Room factor = max(0.85, adults × 0.5) + children × 0.22 (2 adults = 1 room) | Reproduces the earlier fixed groups (1 adult 0.85, 2 + 2 ≈ 1.45, 4 adults 2.0) and scales to 10 adults + 6 children | Estimate |
| Transport | Taxis/transfers × 1.5 per started group of 4 above 2 people; one hire car per started 5 people | – | Estimate |
| `DEPARTURE` | Göteborg (Landvetter): Europe × 1.00, long-haul × 1.05; Köpenhamn (Kastrup): Europe × 0.92, long-haul × 1.00; domestic trips from Göteborg/Köpenhamn × 1.4 (connect via Arlanda) | Typical fares on sampled routes; Kastrup has more low-cost carriers to Europe, Landvetter few direct long-haul routes | Low (noisy data) |
| `LIFT_PASS` | Åre 800, Chamonix 1 150, Cortina 990, Niseko 850, Aspen 2 500 kr per adult per day (high season 2026/27) + rental `SKI_RENTAL` 350 × price index | SkiStar price increase announcement, Mont-Blanc Unlimited, Dolomiti Superski 2026/27 (€89), Niseko All Mountain peak (¥13 500), Aspen Snowmass date-based prices ($209–279) | Medium-high (Cortina, Niseko), medium (rest) |
| Ski places (`SPOTS[*].ski`, `DEST_RATES[*].ski`) | Åre, Chamonix, Cortina d'Ampezzo, Niseko, Aspen: flights to nearest airport, February nights (budget apartment / mellan 3–4★ / lyx 5★ or chalet), food, index | momondo route and star-class averages raised for February; Eurostat/GlobalCostData indices raised for resorts | Medium / estimate |
| `ACTIVITY_PER_DAY` | golf 2 200 (≈ 0.85 rounds per day: Spain ≈ €136, Portugal ≈ €116, Florida ≈ $258 green fees), spa 1 300 (one 50-min treatment, Yasuragi 1 290–1 390 kr), skidor 1 150 fallback | Resort green fees and spa price lists | Medium |

Full tables and 46 source references: `docs/research/semester-trip-types-2026.md`.

### New destinations, Zermatt and safari (added 8 Nov 2026)

| What | Values | Basis | Confidence |
| --- | --- | --- | --- |
| Maldiverna (Baa-atollen, Malé), Dubai (Jumeirah Beach, Downtown), Bali (Seminyak, Ubud), Mexiko (Tulum, Mexico City), Island (Vík, Reykjavik), Schweiz (Zermatt summer, Zürich), Sydafrika (Camps Bay, Kapstaden), Karibien (St Barth, Gustavia) | Flight, night, food, index, car and all-inclusive per place in `DEST_RATES`; 64 sights with cirkapris in `SPOTS`; private-jet hours in `JET.hours` | Same method as the first 12 countries: momondo route and star-class averages cross-checked with ADR figures; Eurostat price levels (Switzerland, Iceland), GlobalCostData (Mexico, South Africa, Indonesia). Flight prices include the necessary connection (seaplane/domestic flight to Baa, Winair to St Barth, train to Zermatt) | Medium; price levels for UAE, Maldives, Malé and St Barth and the all-inclusive extras for Dubai and Mexico are estimates |
| Maldiverna | No hire cars (`car: 0`), so the hire-car option is greyed out there | – | – |
| Zermatt (ski) | Lift pass 1 200 kr/day; February nights 2 200 / 5 000 / 14 000; index 1.38 | Matterhorn ski paradise date-based prices, Eurostat (Switzerland 171 vs Sweden 124) | Estimate (pass), medium (index) |
| Kruger (safari) | Flights 7 000 / 11 000 / 24 000; nights for two 1 300 (SANParks rest camp, self-catering) / 10 000 (lodge incl. full board and game drives) / 28 000 (Sabi Sand luxury lodge); conservation fee 380 kr per adult per day (R692 from 1 Nov 2026) | SANParks tariffs, lodge rate cards via search extracts | Medium-high (park fee), medium (lodges) |
| `SAFARI` | At mellan level and above food is only drinks and extras (15 %) and game drives are included; budget level pays food, 950 × index per day for drives, plus the park fee | Lodges sell full board with two game drives per day | – |
| `MOUNTAIN` | Iceland and Switzerland's nature places use mountain stay names (gästhus, hotell med utsikt, lyxlodge, privat lodge) and hotel photos instead of beach villas | – | – |

Sources: `docs/research/semester-new-destinations-2026.md`, `docs/research/semester-trip-types-2026.md`. Malé's fish market and national museum were replaced by two free sights (the city beach and Republic Square) because no usable free photos existed.
