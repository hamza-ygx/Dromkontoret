# Semester sights: verified 2026 prices (per adult, SEK)

Researched 2026-11-06 for `lib/semester/spots.ts`. Nothing in `spots.ts` was changed.

**How this was checked.** The sandbox could not open the official sites directly. gotlandsmuseum.se, fotografiska.com and lokrum.hr all failed with DNS errors. So every price comes from web-search result extracts ("standard" mode, and "extended" once, for Fornsalen). Where an extract quoted an official page or an official news item, the confidence column says so. Prices from resellers and blogs are marked as such.

**Rules used.**
- Exchange rates: EUR 11.15, USD 9.96, THB 0.296, JPY 0.063, TRY 0.201, EGP 0.183.
- Rounding: to the nearest 5 kr, or to the nearest 10 kr above 500 kr.
- Season: where a price is seasonal, I used the summer/high-season adult price, because these are holiday trips.
- Tours: priced at a typical mid-range bookable group tour per adult.
- US prices are before sales tax.
- Swedes count as EU/EEA visitors, which matters for the Louvre and Versailles.

Confidence: **H** = official page or several consistent 2026 sources. **M** = consistent secondary sources. **L** = thin, conflicting or undated sources.

## Sverige – Gotland (beach)

| id | sight | my draft | verified SEK | basis (original currency price) | source URL | confidence |
|---|---|---|---|---|---|---|
| visby-mur | Visby ringmur | 0 | 0 | Free, public | – | H |
| faro-raukar | Fårös raukar | 0 | 0 | Free, public nature site (ferry to Fårö is free for foot passengers) | – | H |
| fornsalen | Gotlands museum | 160 | **190** | 190 SEK adults May–Sep; 140 SEK Oct–Apr; free under 19 | https://www.gotland.de/en/gotlands-museum/ ; https://whichmuseum.com/museum/fornsalen-visby-42756 (says 180) | M |
| tofta | Tofta strand | 0 | 0 | Free beach | – | H |

## Sverige – Stockholm (city)

| id | sight | my draft | verified SEK | basis (original currency price) | source URL | confidence |
|---|---|---|---|---|---|---|
| vasa | Vasamuseet | 230 | **240** | 240 SEK 1 May–30 Sep; 195 SEK rest of year (official 2026 price list) | https://www.vasamuseet.se/globalassets/vasamuseet/dokument/bransch/2026-info--priser/2026-prislistor-ratt/t_vasa-museum-2026-german.pdf | H |
| gamla-stan | Gamla stan | 0 | 0 | Free; the palace costs extra | – | H |
| vaxholm | Skärgårdsbåt till Vaxholm | 170 | **85** | Since 30 April (2025) SL tickets are valid year-round on Waxholmsbolaget boats from Strömkajen to Vaxholm. A single SL ticket is 43 SEK (2025 price; no 2026 figure found), so a return is about 86 SEK. Strömma tourist boats cost more, about 150–185 SEK one way. | https://www.mynewsdesk.com/se/sl/news/sl-biljetten-gaeller-till-vaxholm-fraan-30-april-aaret-runt-495974 | M (2026 SL fare not confirmed) |
| fotografiska | Fotografiska | 235 | 235 | Dynamic pricing: drop-in 210 SEK on weekdays, 235 SEK at weekends; cheaper online | https://stockholm.fotografiska.com/en/faq (via search extract) | M |

## Spanien – Mallorca (beach)

| id | sight | my draft | verified SEK | basis (original currency price) | source URL | confidence |
|---|---|---|---|---|---|---|
| la-seu | Katedralen La Seu | 110 | 110 | About €10 general (cathedral + museum). Resellers sell it from €11; with the terraces it is €25. | https://www.musement.com/uk/mallorca/entrada-a-la-catedral-de-palma-la-seu-390162/ ; https://planomato.com/es/palma-de-mallorca/p/visitas-guiadas-terrazas-catedral-mallorca | L |
| calo-moro | Caló des Moro | 0 | 0 | Free cove | – | H |
| soller | Tåget till Sóller | 450 | **335** | Palma–Sóller return €30, single €23. The €40 combined ticket adds the tram to Port de Sóller. | https://planomato.com/es/palma-de-mallorca/n/nuevos-horarios-tren-soller ; https://www.nomadotravel.app/es/attractions/soller-train | M |
| drach | Coves del Drach | 225 | **200** | €17.50 online / €18.50 at the ticket office | https://triptamba.pages.dev/spain/the-balearic-islands/coves-del-drach ; https://www.click-mallorca.com/blog/visitar/sitios/cuevas-del-drach | M |

## Spanien – Barcelona (city)

| id | sight | my draft | verified SEK | basis (original currency price) | source URL | confidence |
|---|---|---|---|---|---|---|
| sagrada | Sagrada Família | 290 | 290 | €26 basic, with audio app. A centenary surcharge of €2–5 in 2026 was reported but not confirmed. | https://www.artvisitguide.com/sagrada-familia-tickets-guide/ | M |
| guell | Park Güell | 200 | 200 | €18 general ticket (up from €10 on 1 Jan 2026) | https://parkguell.barcelona/en/planning-your-visit/prices-and-times | H |
| boqueria | La Boqueria | 0 | 0 | Free market | – | H |
| batllo | Casa Batlló | 390 | **355** | Blue ticket from €29 online with dynamic pricing; typically €32–35. The rooftop needs Silver (€34+). | https://www.sagradafamiliatickets.info/casa-batllo-tickets-2026 ; https://www.guruwalk.com/walks/p2082-casa-batllo-standard-entrance-ticket-blue-cGFub3B0ZXM | M |

## Grekland – Kreta (beach)

| id | sight | my draft | verified SEK | basis (original currency price) | source URL | confidence |
|---|---|---|---|---|---|---|
| knossos | Knossos | 225 | 225 | €20 official, year-round; winter discount dropped | https://crete.direct/articles/knossos-palace-guide | M |
| balos | Balos lagun | 335 | **390** | Day cruise from Kissamos (Gramvousa + Balos) €30–45. Kreta.com lists €45; budget operators start from €21–25. | https://www.kreta.com/en/booking-excursion-sightseeing/ticket-for-day-cruise-balos-lagoon.html ; https://www.checkyeti.com/en/boat-tours/greece/balos/boat-trips-along-the-coast | M |
| chania | Chanias gamla hamn | 0 | 0 | Free | – | H |
| samaria | Samariaravinen | 110 | 110 | €10 park entry (2025; older guides say €5). Bus and ferry back cost extra. | https://bookatrekking.com/en/blog/samaria-gorge/ ; https://crete.direct/articles/samaria-gorge-hiking-guide | M |

## Grekland – Aten (city)

| id | sight | my draft | verified SEK | basis (original currency price) | source URL | confidence |
|---|---|---|---|---|---|---|
| akropolis | Akropolis | 335 | 335 | €30 (since April 2025) | https://en.protothema.gr/2025/04/14/what-tourists-say-about-the-e30-ticket-for-the-acropolis-new-prices-for-museums-and-archaeological-sites/ | H |
| akropolismuseet | Akropolismuseet | 225 | 225 | €20 standard | https://grandpl.com/en/greece/article/acropolis-tickets-vs-museum-entry-2026-official-prices--booking-guide/ | M |
| plaka | Plaka | 0 | 0 | Free | – | H |
| sounion | Kap Sounion | 225 | 225 | €20 summer / €10 winter for site entry. Tours from Athens cost €39–48 extra. | https://thebettervacation.com/athens/temple-of-poseidon-cape-sounion/ | M |

## Italien – Amalfikusten (beach)

| id | sight | my draft | verified SEK | basis (original currency price) | source URL | confidence |
|---|---|---|---|---|---|---|
| positano | Positano | 0 | 0 | Free | – | H |
| gudarnas-stig | Gudarnas stig | 0 | 0 | Free trail | – | M |
| capri | Båt till Capri | 560 | **1 450** | Shared boat tour from Positano €120–156. Blue Grotto entry (about €18) is extra. A ferry alone is about €25–30 each way. | https://www.positano.com/en/l/budget-boat-tours ; https://www.positano.com/en/s/S9MG5 | M |
| ravello | Villa Rufolo | 110 | **90** | €8 ordinary ticket (one source; older pages say €5–6) | https://www.viaggiando-italia.it/come-visitare-villa-rufolo-e-i-suoi-giardini-a-ravello-sulla-costiera-amalfitana-costi-orari-e-come-arrivare/ | L |

## Italien – Rom (city)

| id | sight | my draft | verified SEK | basis (original currency price) | source URL | confidence |
|---|---|---|---|---|---|---|
| colosseum | Colosseum | 200 | 200 | €18 incl. €2 booking fee (Colosseum + Forum + Palatine, 24 h) | https://www.artvisitguide.com/colosseum-tickets-guide/ | M |
| vatikanen | Vatikanmuseerna | 225 | **280** | €20 + €5 online booking fee = €25 (raised from €17 in 2026) | https://www.artvisitguide.com/vatican-museums-tickets-guide/ ; https://thebettervacation.com/rome/vatican-museum-tickets/ | M |
| trevi | Fontana di Trevi | 25 | **20** | €2 ticket to enter the basin area since 2 Feb 2026 (non-residents); the piazza stays free | https://www.turismoroma.it/en/news/trevi-fountain-new-entry-fee-one-romes-symbols | H |
| trastevere | Matvandring i Trastevere | 780 | **1 000** | Group food tours €80–105 (Eating Europe Twilight Trastevere €104; Devour about CA$115) | https://artvisitguide.pages.dev/best-food-tours-rome-2026/ ; https://www.travelocity.ca/fr/things-to-do/trastevere-au-coucher-du-soleil-rome-food-et-wine-tour.a5184945.datails-des-activitas | M |

## Portugal – Algarve (beach)

| id | sight | my draft | verified SEK | basis (original currency price) | source URL | confidence |
|---|---|---|---|---|---|---|
| benagil | Benagilgrottan | 335 | 335 | Boat tour about €25–35 (US$23–47). Landing and swimming inside the cave are banned; small boats may enter. | https://theplanetd.com/benagil-cave/ ; https://theabroadguide.com/?p=3042662 | M |
| piedade | Ponta da Piedade | 0 | 0 | Free | – | H |
| lagos | Lagos gamla stan | 0 | 0 | Free | – | H |
| surf | Surflektion | 500 | **560** | 2 h group lesson on the west coast €45–65 (Algarve Watersport €65; Sagres/Arrifana from €65–70 via resellers; local schools often €40–50) | https://www.manawa.com/en/destinations/2387-sagres/1187-surfing/map ; https://expedia.ie/things-to-do/2-hour-surf-lesson-at-the-beautiful-algarvian-west-coast.a3354725.activity-details | M |

## Portugal – Lissabon (city)

| id | sight | my draft | verified SEK | basis (original currency price) | source URL | confidence |
|---|---|---|---|---|---|---|
| sparvagn-28 | Spårvagn 28 | 35 | 35 | €3.30 single bought on board (cash); €1.90 with a Navegante/Viva Viagem card | https://thebettervacation.com/lisbon/lisbon-tram-28-tickets/ | M |
| belem | Belémtornet | 135 | 135 | About €12 (MMP price; not confirmed after the reopening). The tower reopened 27 May 2026 after a year of restoration, with timed slots. | https://www.rtp.pt/noticias/pais/a-torre-de-belem-como-nunca-a-viu-reabre-apos-obras-de-um-milhao-de-euros_n1743350 | L (price) |
| jeronimos | Jerónimosklostret | 200 | 200 | €18 cloister (the church is free) | https://thebettervacation.com/pt/Lisboa/mosteiro-dos-jer%C3%B4nimos/ | M |
| sintra | Pena-palatset i Sintra | 225 | 225 | €20 palace + park (park only €10) | https://www.lisbontourism.org/?p=178 | M |

## Kroatien – Split (beach)

| id | sight | my draft | verified SEK | basis (original currency price) | source URL | confidence |
|---|---|---|---|---|---|---|
| diocletianus | Diocletianus palats | 0 | 0 | Free to walk; the cellars and cathedral cost extra | – | H |
| plitvice | Plitvicesjöarna | 450 | **1 230** | Group day tour from Split with park entry about €90–140 (Trip.com €113; Nomades €141). Park entry alone is about €40 in summer, which matches the old 450. | https://sg.trip.com/things-to-do/detail/106193966/ ; https://www.bookiscout.com/en/guides/plitvice-prices | M |
| hvar | Öhoppning till Hvar | 890 | 890 | Shared Hvar + Pakleni boat tour about €60–115 (catamaran from €58; speedboat tours about €80–100) | https://www.checkyeti.com/en/boat-tours/croatia/split-dalmatia-county/boat-trips-to-pakleni-islands | L |
| marjan | Marjankullen | 0 | 0 | Free | – | H |

## Kroatien – Dubrovnik (city)

| id | sight | my draft | verified SEK | basis (original currency price) | source URL | confidence |
|---|---|---|---|---|---|---|
| stadsmuren | Stadsmuren | 450 | 450 | €40 adult (up €5 from Jan 2026; includes Fort Lovrijenac) | https://kompas.hr/dubrovnik/attractions/city-walls | M |
| srd | Linbanan till Srđ | 300 | 300 | Return €27–30 | https://dubrovnik-tickets.co/cable-car/ | M |
| lokrum | Lokrum | 300 | **335** | Return boat + reserve entry €30 (2026 seller page); older guides say €27. The official 2026 price list exists (lokrum.hr PDF) but could not be opened. | https://dubrovnik-tickets.co/tickets/lokrum-island-tickets/ | L |
| stradun | Stradun | 0 | 0 | Free | – | H |

## Turkiet – Antalya (beach)

| id | sight | my draft | verified SEK | basis (original currency price) | source URL | confidence |
|---|---|---|---|---|---|---|
| kaleici | Kaleiçi | 0 | 0 | Free | – | H |
| duden | Düdenvattenfallen | 60 | **0** | The falls that drop into the sea are Lower Düden, in a free public park in Lara. Upper Düden (inland) charges about 70 TL (≈15 kr). | https://turkeytravelplanner.com/go/med/Antalya/excursions/duden_selalesi.html ; https://www.nomadotravel.app/en/attractions/upper-duden-waterfalls | M |
| aspendos | Aspendos | 200 | **165** | €15 for foreign visitors (Turkish ministry euro pricing; about ₺500) | https://www.yeniankara.com.tr/turkiye-haberleri/aspendos-antik-kenti-3-bin-yillik-tarihin-yasayan-tanigi-172308 ; https://myturkeyadventure.com/blog/aspendos-roman-theatre-visitor-guide-2026 | M |
| battur | Båttur längs kusten | 280 | **335** | Full-day boat trip with lunch €25–35, often with hotel transfer (Bookfromlocals €28–35) | https://bookfromlocals.com/?p=8589 | M |

## Turkiet – Istanbul (city)

| id | sight | my draft | verified SEK | basis (original currency price) | source URL | confidence |
|---|---|---|---|---|---|---|
| hagia-sofia | Hagia Sofia | 280 | 280 | €25 for foreigners (upper gallery, since Jan 2024) | https://blog.wego.com/hagia-sophia-visitor-guide/ | M |
| topkapi | Topkapıpalatset | 450 | **550** | 2,750 TL, incl. Harem and Hagia Irene according to most sources. One pass site says the Harem costs about 1,000 TL extra. | https://www.hemenhesap.com/en/istanbul-museum-ticket-prices ; https://www.guidedistanbultours.com/information-of-istanbul-museums/ | M |
| basaren | Stora basaren | 0 | 0 | Free | – | H |
| bosporen | Bosporenkryssning | 170 | 170 | Bookable sightseeing cruise about €15. Şehir Hatları public tours cost 340–700 TL (≈70–140 kr); Turyol about 250 TL. | https://www.nomadotravel.app/en/guides/bosphorus-cruise-guide ; https://istanbulclues.com/istanbul-bosphorus-cruise-tours/ | L |

## Frankrike – Nice (beach)

| id | sight | my draft | verified SEK | basis (original currency price) | source URL | confidence |
|---|---|---|---|---|---|---|
| promenaden | Promenade des Anglais | 0 | 0 | Free | – | H |
| chateau | Slottskullen | 0 | 0 | Free (the lift is free too) | – | H |
| monaco | Tåg till Monaco | 60 | 60 | TER/ZOU! single about €5–7 (Trainline from about €5; Omio from €7). The old 60 kr is one way; a return is about 120 kr. | https://everyrail.com/trains/nice-to-monaco/ ; https://www.thetrainline.com/train-times/nice-to-monaco-monte-carlo | L |
| matisse | Matissemuseet | 135 | 135 | €12 normal ticket (€10 outside exhibition periods) | https://www.nice.fr/fr/culture/musees-et-galeries/musee-matisse | H |

## Frankrike – Paris (city)

| id | sight | my draft | verified SEK | basis (original currency price) | source URL | confidence |
|---|---|---|---|---|---|---|
| eiffel | Eiffeltornet | 400 | **410** | €36.70 adult, lift to the summit | https://www.toureiffel.paris/en/preparing-your-visit/rates-and-visiting-conditions | H |
| louvren | Louvren | 245 | 245 | €22 for EU/EEA visitors. Non-EU visitors pay €32 since 14 Jan 2026. | https://abc7news.com/post/louvre-museum-paris-hikes-ticket-prices-most-european-tourists-what-know/18401055/ | H |
| seine | Seinekryssning | 190 | **210** | Bateaux-Mouches 1 h 10: €19 online / €20 on site | https://www.trvlogue.com/en/bateaux-mouches-paris-guide ; https://www.parisenunclic.fr/en/bateaux-mouches-sightseeing-cruise-paris/ | M |
| versailles | Versailles | 360 | 355 | Passport ticket for EEA visitors: €32 high season (Apr–Oct), €22 low. Non-EEA visitors pay €35/€25. | https://en.chateauversailles.fr/2026-ticketing | H |

## Thailand – Phuket (beach)

| id | sight | my draft | verified SEK | basis (original currency price) | source URL | confidence |
|---|---|---|---|---|---|---|
| phi-phi | Phi Phi-öarna | 600 | **680** | Speedboat day tour about ฿1,700–2,000 (US$44–60) plus the national park fee of ฿400 cash: about ฿2,300 in all. Maya Bay closes 1 Aug–1 Oct each year, and swimming in the bay is not allowed. | https://www.travelocity.com/things-to-do/phi-phi-island-by-premium-speedboat-with-lunch-from-phuket.a2142642.activity-details | M |
| big-buddha | Big Buddha | 0 | 0 | Free (donation) | – | H |
| phuket-town | Phuket Old Town | 0 | 0 | Free | – | H |
| massage | Thaimassage | 120 | 120 | About ฿350–400 for 1 h on the beach | – (local market price, not formally checked) | L |

## Thailand – Bangkok (city)

| id | sight | my draft | verified SEK | basis (original currency price) | source URL | confidence |
|---|---|---|---|---|---|---|
| grand-palace | Stora palatset | 150 | 150 | ฿500 | https://yourthaiguide.com/the-grand-palace-and-wat-phra-keaw/ | M |
| wat-arun | Wat Arun | 60 | 60 | ฿200 | https://yourthaiguide.com/bangkok-big-list-of-entry-fees | M |
| flytande | Flytande marknad | 300 | **385** | Shared tour from Bangkok with paddle boat about ฿1,300–1,500 (Expedia TH ฿1,500; US$35–46) | https://www.expedia.co.th/things-to-do/a.a602135.activity-details | M |
| chinatown | Street food i Chinatown | 90 | **530** | Guided group evening food walk about ฿1,500–2,300. Eating on your own is about ฿300 (≈90 kr), which is what the draft assumed. | https://ticket2attraction.com/discount-tickets/yaowarat-chinatown-street-food-tour-bangkok ; https://travjoy.com/blog/yaowarat-street-food-tour-a-complete-guide-to-eating-bangkok-s-chinatown-soi-by-soi | M |

## USA – Florida (beach)

| id | sight | my draft | verified SEK | basis (original currency price) | source URL | confidence |
|---|---|---|---|---|---|---|
| kennedy | Kennedy Space Center | 750 | **770** | US$77 adult, 1 day, plus tax (≈820 kr with tax). About 3.5 h drive from Miami. | https://www.floridareview.co.uk/blog/buying-kennedy-space-center-tickets | M |
| everglades | Everglades | 500 | **400** | Airboat ride with admission: Gator Park US$37, Sawgrass US$29. Packages with hotel pickup from Miami cost US$55–62. | https://thebettervacation.com/everglades-national-park ; https://www.tripster.com/detail/everglades-tour-weston.md | M |
| south-beach | South Beach | 0 | 0 | Free | – | H |
| disney | Walt Disney World | 1 600 | **1 690** | Magic Kingdom 1-day ticket US$139–209 by date in 2026 (about $170 typical), plus tax | https://www.wdwmagic.com/other/magic-your-way-ticket/news/08oct2025-walt-disney-world-1-day-ticket-prices-top-200-for-the-first-time-in-2026.htm ; https://touringplans.com/blog/every-regular-disney-world-ticket-price-in-2026/ | H |

## USA – New York (city)

| id | sight | my draft | verified SEK | basis (original currency price) | source URL | confidence |
|---|---|---|---|---|---|---|
| frihetsgudinnan | Frihetsgudinnan | 250 | 255 | Statue City Cruises reserve ticket US$25.50 (both islands) | https://thebettervacation.com/new-york/statue-of-liberty-ferry/ | M |
| top-rock | Top of the Rock | 450 | 450 | About US$45 general admission (dynamic; sunset slots up to about $73) | https://decks-nyc.com/top-of-the-rock/totr-tickets/ | M |
| central-park | Central Park | 0 | 0 | Free; the rink costs extra | – | H |
| broadway | Broadwayshow | 1 500 | 1 500 | Season average US$131 (musicals $129). A mid-range musical seat is about $150. | https://www.broadwayworld.com/industry/article/Broadway-Set-Another-Box-Office-Record-in-2025-2026-Crossing-191-Billion-20260528 | M |

## Egypten – Hurghada (beach)

| id | sight | my draft | verified SEK | basis (original currency price) | source URL | confidence |
|---|---|---|---|---|---|---|
| giftun | Giftunöarna | 400 | **350** | Group snorkel day trip US$25–45 plus a park fee of about $5–10 | https://www.expedia.com/things-to-do/giftun-island-snorkeling-tour.a597633.activity-details ; https://pureniletours.com/?p=18319 | M |
| oken | Ökensafari | 350 | 350 | Quad + Bedouin dinner US$30–45 (€32–36) | https://routri.com/travel-inspiration/hurghada-desert-safari-tours-quad-bikes-stargazing-bedouin-dinner | M |
| dykning | Dykning | 600 | 600 | 2-dive boat day with guide and gear €40–60, plus a coast-guard fee of about €5 | https://divingaround.com/diving-hurghada-prices-for-one-day ; https://egyptdivers.com/hurghada/diving-programs/diving-packages-certified-divers/ | M |
| el-gouna | El Gouna | 0 | 0 | No visitor fee found | – | L |

## Egypten – Kairo (city)

| id | sight | my draft | verified SEK | basis (original currency price) | source URL | confidence |
|---|---|---|---|---|---|---|
| giza | Pyramiderna i Giza | 130 | 130 | EGP 700 plateau ticket for foreigners; going inside the Khufu pyramid costs extra | https://emotours.com/how-much-does-a-giza-pyramids-entry-ticket-cost-in-2026/ | M |
| gem | Stora egyptiska museet | 220 | **335** | EGP 1,830 for foreign adults from 1 Nov 2026 (up from 1,570) | https://www.egypttoday.com/Article/4/150275/Grand-Egyptian-Museum-Announces-New-Ticket-Prices-Starting-November-1 | H |
| khan | Khan el-Khalili | 0 | 0 | Free (founded 1382) | – | H |
| felucca | Feluccatur på Nilen | 40 | **250** | Bookable 1–2 h sunset felucca about US$25–35 per person. Hiring a boat yourself costs a few hundred EGP per boat per hour (≈50 kr each). | https://theabroadguide.com/2-hour-felucca-ride-on-the-river-nile-from-cairo-sunset-or-sunrise-options/ ; https://sg.trip.com/things-to-do/detail/103237574/ | M |

## Japan – Okinawa (beach)

| id | sight | my draft | verified SEK | basis (original currency price) | source URL | confidence |
|---|---|---|---|---|---|---|
| churaumi | Churaumi-akvariet | 140 | 135 | ¥2,180 adult (official) | https://churaumi.okinawa/en/guide/info/ | H |
| shuri | Shurislottet | 25 | 25 | ¥400 (paid area). The Seiden main hall is being rebuilt after the 2019 fire. | – (search extract only) | L |
| kerama | Keramaöarna | 950 | **790** | Full-day boat snorkel trip from Naha (sea turtle spots, lunch) ¥11,980–12,900 | https://www.cerulean-blue.co.jp/en/tours/46870 | M |
| kokusai | Kokusai-dori | 0 | 0 | Free | – | H |

## Japan – Tokyo (city)

| id | sight | my draft | verified SEK | basis (original currency price) | source URL | confidence |
|---|---|---|---|---|---|---|
| sensoji | Sensō-ji | 0 | 0 | Free | – | H |
| shibuya-sky | Shibuya Sky | 160 | **170** | ¥2,700 online before 15:00; ¥3,400 from 15:00 (sunset slots, ≈215 kr) | https://www.trvlogue.com/en/shibuya-sky-tokyo-tickets-guide | M |
| teamlab | teamLab Planets | 240 | 240 | Dynamic ¥3,600–4,200 (about ¥3,800 typical) | https://mileasia.com/japan/teamlab-planets/ | M |
| tsukiji | Matvandring i Tsukiji | 300 | **690** | 2–3 h guided food tour about ¥9,500–13,000. Short 1 h tasting walks cost ¥4,800–5,500. | https://alva-japan-tours-www.pages.dev/en/tours/tokyo-tsukiji-market-foodie-tour-with-5-tastings ; https://www.machupicchu.org/tokyo-food-tours-2026-tsukiji-ramen-izakaya.htm | M |

## Changes

Prices (the draft value is kept wherever the difference was under 10 kr):

- fornsalen → 190
- vasa → 240
- vaxholm → 85 (SL ticket, return)
- soller → 335
- drach → 200
- batllo → 355
- balos → 390
- capri → 1 450
- ravello → 90
- vatikanen → 280
- trevi → 20
- trastevere → 1 000
- surf → 560
- plitvice → 1 230 (day tour incl. park entry; use 450 if it should mean entry only)
- lokrum → 335
- duden → 0
- aspendos → 165
- battur → 335
- topkapi → 550
- eiffel → 410
- seine → 210
- phi-phi → 680
- flytande → 385
- chinatown → 530 (guided food walk; 90 if self-guided)
- kennedy → 770
- everglades → 400
- disney → 1 690
- giftun → 350
- gem → 335
- felucca → 250 (bookable tour; about 50 if you hire a boat yourself)
- kerama → 790
- shibuya-sky → 170
- tsukiji → 690

Descriptions:

- stradun → "Huvudgatan i blanknött kalksten". Stradun is paved with limestone, not marble.
- akropolismuseet (optional) → "Parthenonfrisen och skulpturer från Akropolis". Many of the Parthenon originals are in the British Museum.

All the other lines checked out: ages, dates, places, the 16 Plitvice lakes, the 16 km Samaria route and Khan el-Khalili's 1300s founding.
