import type { DestId, Slot, Standard } from "./types";

export interface Sight {
  id: string;
  name: string;
  line: string;
  price: number;
  query: string;
}

export interface Spot {
  lat: number;
  lon: number;
  hero: string;
  sights: Sight[];
}

const s = (id: string, name: string, line: string, price: number, query: string): Sight => ({ id, name, line, price, query });

export const SPOTS: Record<DestId, Partial<Record<Slot, Spot>> & { beach: Spot; city: Spot }> = {
  sverige: {
    beach: { lat: 57.64, lon: 18.29, hero: "Visby Gotland", sights: [s("visby-mur", "Visby ringmur", "Nordens bäst bevarade medeltida stadsmur", 0, "Visby ringmur"), s("faro-raukar", "Fårös raukar", "Kalkstenspelare vid havet på Langhammars", 0, "Langhammars raukar Fårö"), s("domkyrkan", "Visby domkyrka", "Sankta Maria – 1200-talskyrkan mitt i Visby", 0, "Visby Cathedral"), s("tofta", "Tofta strand", "Kilometerlång sandstrand söder om Visby", 0, "Tofta strand Gotland")] },
    city: { lat: 59.33, lon: 18.07, hero: "Stockholm Gamla stan", sights: [s("vasa", "Vasamuseet", "Regalskeppet från 1628 – nästan helt intakt", 240, "Vasa ship museum Stockholm"), s("gamla-stan", "Gamla stan", "Gränder, Stortorget och Kungliga slottet", 0, "Stortorget Stockholm"), s("vaxholm", "Skärgårdsbåt till Vaxholm", "En timme bland öarna – SL-biljett gäller", 85, "Vaxholm skärgård"), s("fotografiska", "Fotografiska", "Fotomuseum med utsikt över Saltsjön", 235, "Fotografiska Stockholm")] },
    ski: { lat: 63.4, lon: 13.08, hero: "Åre ski slopes winter", sights: [ s("are-kabinbanan", "Kabinbanan", "Gondolen upp på Åreskutan – ingår i liftkortet", 0, "Åre gondola Åreskutan"), s("are-tannforsen", "Tännforsen", "Ett av Sveriges största vattenfall, isklätt vintertid", 0, "Tännforsen frozen waterfall"), s("are-hundspann", "Hundspann", "Draghundar genom fjällbjörkskogen, ett par timmar", 1_900, "dog sledding Sweden mountains"), s("are-duved", "Duved", "Lugnare grannby med egna backar och fjällutsikt", 0, "Duved Sweden"), ] },
  },
  spanien: {
    beach: { lat: 39.57, lon: 2.65, hero: "Mallorca coast", sights: [s("la-seu", "Katedralen La Seu", "Gotisk katedral vid havet i Palma", 110, "Palma Cathedral La Seu"), s("calo-moro", "Caló des Moro", "Turkos vik på sydöstra Mallorca", 0, "Caló des Moro"), s("soller", "Tåget till Sóller", "Trätåg från 1912 genom bergen", 335, "Ferrocarril de Sóller"), s("formentor", "Cap de Formentor", "Fyr och klippor längst ut på norra Mallorca", 0, "Cap de Formentor")] },
    city: { lat: 41.39, lon: 2.17, hero: "Barcelona skyline", sights: [s("sagrada", "Sagrada Família", "Gaudís basilika – byggd sedan 1882", 290, "Sagrada Familia interior"), s("guell", "Park Güell", "Mosaiker och utsikt över staden", 200, "Park Güell"), s("boqueria", "La Boqueria", "Saluhallen vid La Rambla", 0, "La Boqueria market"), s("batllo", "Casa Batlló", "Gaudís drömlika hus på Passeig de Gràcia", 355, "Casa Batlló")] },
  },
  grekland: {
    beach: { lat: 35.34, lon: 25.13, hero: "Crete beach", sights: [s("knossos", "Knossos", "Minoiskt palats, 3 500 år gammalt", 225, "Knossos palace"), s("balos", "Balos lagun", "Båttur till lagunen med rosa sand", 390, "Balos lagoon"), s("chania", "Chanias gamla hamn", "Venetiansk hamn med fyr och tavernor", 0, "Chania old harbour"), s("samaria", "Samariaravinen", "16 km vandring ner till Libyska havet", 110, "Samaria Gorge")] },
    city: { lat: 37.98, lon: 23.73, hero: "Athens Acropolis", sights: [s("akropolis", "Akropolis", "Parthenon på klippan mitt i staden", 335, "Parthenon Acropolis"), s("akropolismuseet", "Akropolismuseet", "Parthenonfrisen och skulpturer från Akropolis", 225, "Acropolis Museum"), s("plaka", "Plaka", "Gamla kvarter under Akropolis", 0, "Plaka Athens"), s("sounion", "Kap Sounion", "Poseidons tempel i solnedgången", 225, "Temple of Poseidon Sounion")] },
  },
  italien: {
    beach: { lat: 40.63, lon: 14.6, hero: "Amalfi coast", sights: [s("positano", "Positano", "Pastellfärgade hus ner mot havet", 0, "Positano"), s("gudarnas-stig", "Gudarnas stig", "Klippvandring högt över Amalfikusten", 0, "Sentiero degli Dei"), s("capri", "Båt till Capri", "Båttur runt Capri och Faraglioni-klipporna", 1_450, "Faraglioni Capri"), s("ravello", "Villa Rufolo", "Trädgårdar med utsikt i Ravello", 90, "Villa Rufolo Ravello")] },
    city: { lat: 41.9, lon: 12.5, hero: "Rome Colosseum", sights: [s("colosseum", "Colosseum", "Antikens största amfiteater", 200, "Colosseum Rome"), s("vatikanen", "Vatikanmuseerna", "Sixtinska kapellet och Rafaels rum", 280, "Sistine Chapel ceiling"), s("trevi", "Fontana di Trevi", "Kasta ett mynt så kommer du tillbaka", 20, "Trevi Fountain"), s("trastevere", "Matvandring i Trastevere", "Pasta, supplì och gelato med guide", 1_000, "Trastevere")] },
    ski: { lat: 46.54, lon: 12.14, hero: "Cortina d'Ampezzo Dolomites winter", sights: [ s("cortina-sella-ronda", "Sella Ronda", "Klassisk skidrunda runt Sellamassivet", 0, "Sella Ronda Dolomites skiing"), s("cortina-lagazuoi", "Lagazuoi", "Linbana upp, sedan Hidden Valley-nedfarten", 0, "Lagazuoi cable car winter"), s("cortina-corso", "Corso Italia", "Bilfri gågata med butiker och aperitivo", 0, "Corso Italia Cortina d'Ampezzo"), s("cortina-rifugio", "Lunch på rifugio", "Pasta och vin i en bergshydda vid Cinque Torri", 450, "Cinque Torri rifugio winter"), ] },
  },
  portugal: {
    beach: { lat: 37.1, lon: -8.67, hero: "Algarve coast", sights: [s("benagil", "Benagilgrottan", "Båttur in i den berömda havsgrottan", 335, "Benagil cave"), s("piedade", "Ponta da Piedade", "Gyllene klippformationer vid Lagos", 0, "Ponta da Piedade"), s("lagos", "Lagos gamla stan", "Vita hus, kullersten och fiskerestauranger", 0, "Lagos Portugal old town"), s("surf", "Surflektion", "Två timmar med instruktör på västkusten", 560, "Surfing Algarve")] },
    city: { lat: 38.72, lon: -9.14, hero: "Lisbon Alfama", sights: [s("sparvagn-28", "Spårvagn 28", "Gula spårvagnen genom Alfama", 35, "Lisbon tram 28"), s("belem", "Belémtornet", "Upptäcktsresornas torn vid Tejo", 135, "Belém Tower"), s("jeronimos", "Jerónimosklostret", "Manuelinsk arkitektur i världsklass", 200, "Jerónimos Monastery"), s("sintra", "Pena-palatset i Sintra", "Sagoslott på en bergstopp", 225, "Pena Palace Sintra")] },
  },
  kroatien: {
    beach: { lat: 43.51, lon: 16.44, hero: "Split Croatia", sights: [s("diocletianus", "Diocletianus palats", "Romerskt kejsarpalats där folk fortfarande bor", 0, "Diocletian's Palace Split"), s("plitvice", "Plitvicesjöarna", "Dagstur till 16 terrasserade sjöar", 1_230, "Plitvice Lakes"), s("hvar", "Öhoppning till Hvar", "Båt till Hvar och Pakleniöarna", 890, "Hvar town"), s("marjan", "Marjankullen", "Skog, stränder och utsikt över Split", 0, "Marjan hill Split")] },
    city: { lat: 42.65, lon: 18.09, hero: "Dubrovnik old town", sights: [s("stadsmuren", "Stadsmuren", "Två kilometer på murarna runt gamla stan", 450, "Dubrovnik city walls"), s("srd", "Linbanan till Srđ", "Hela staden och Adriatiska havet under dig", 300, "Dubrovnik cable car"), s("lokrum", "Lokrum", "Ö med påfåglar och klippbad", 335, "Lokrum island"), s("stradun", "Stradun", "Huvudgatan i blanknött kalksten", 0, "Stradun Dubrovnik")] },
  },
  turkiet: {
    beach: { lat: 36.89, lon: 30.7, hero: "Antalya coast", sights: [s("kaleici", "Kaleiçi", "Gamla stan med hamn och osmanska hus", 0, "Kaleiçi Antalya"), s("duden", "Düdenvattenfallen", "Vattenfall som störtar rakt ner i havet", 0, "Düden Waterfalls"), s("aspendos", "Aspendos", "Bäst bevarade romerska teatern i världen", 165, "Aspendos theatre"), s("battur", "Båttur längs kusten", "Heldag med bad i vikar och lunch ombord", 335, "Antalya boat tour")] },
    city: { lat: 41.01, lon: 28.98, hero: "Istanbul skyline", sights: [s("hagia-sofia", "Hagia Sofia", "1 500 år gammal kupol över Istanbul", 280, "Hagia Sophia interior"), s("topkapi", "Topkapıpalatset", "Sultanernas palats och haremet", 550, "Topkapı Palace"), s("basaren", "Stora basaren", "4 000 butiker under tak", 0, "Grand Bazaar Istanbul"), s("bosporen", "Bosporenkryssning", "Mellan Europa och Asien på en eftermiddag", 170, "Bosphorus")] },
  },
  frankrike: {
    beach: { lat: 43.7, lon: 7.27, hero: "Nice Promenade des Anglais", sights: [s("promenaden", "Promenade des Anglais", "Sju kilometer strandpromenad", 0, "Promenade des Anglais"), s("chateau", "Slottskullen", "Utsikt över Baie des Anges", 0, "Colline du Château Nice"), s("monaco", "Tåg till Monaco", "Kasinot och hamnen på 20 minuter", 60, "Monaco harbour"), s("saleya", "Cours Saleya", "Blom- och matmarknad i gamla stan", 0, "Cours Saleya market Nice")] },
    city: { lat: 48.86, lon: 2.35, hero: "Paris Eiffel Tower", sights: [s("eiffel", "Eiffeltornet", "Hiss hela vägen upp till toppen", 410, "Eiffel Tower"), s("louvren", "Louvren", "Mona Lisa och 35 000 andra verk", 245, "Louvre Pyramid"), s("seine", "Seinekryssning", "Paris broar och kajer från vattnet", 210, "Seine river cruise Paris"), s("versailles", "Versailles", "Spegelsalen och slottsträdgårdarna", 360, "Hall of Mirrors Versailles")] },
    ski: { lat: 45.92, lon: 6.87, hero: "Chamonix Mont Blanc winter", sights: [ s("chamonix-aiguille", "Aiguille du Midi", "Linbana till 3 842 meter, mitt emot Mont Blanc", 925, "Aiguille du Midi"), s("chamonix-vallee-blanche", "Vallée Blanche med guide", "20 km offpist ner över glaciären Mer de Glace", 1_300, "Vallée Blanche skiing"), s("chamonix-montenvers", "Montenvers-tåget", "Kuggstångståg upp till glaciären Mer de Glace", 450, "Montenvers train Mer de Glace"), s("chamonix-centrum", "Chamonix centrum", "Alpbyn med Mont Blanc rakt ovanför torget", 0, "Chamonix town Mont Blanc"), ] },
  },
  thailand: {
    beach: { lat: 7.88, lon: 98.39, hero: "Phuket beach", sights: [s("phi-phi", "Phi Phi-öarna", "Speedbåt till Maya Bay och snorkling", 680, "Phi Phi islands"), s("big-buddha", "Big Buddha", "45 meter marmor på en bergstopp", 0, "Big Buddha Phuket"), s("phuket-town", "Phuket Old Town", "Sino-portugisiska hus och nattmarknad", 0, "Phuket Old Town"), s("massage", "Thaimassage", "En timme på stranden", 120, "Thai massage")] },
    city: { lat: 13.75, lon: 100.5, hero: "Bangkok skyline", sights: [s("grand-palace", "Stora palatset", "Kungapalatset och Smaragdbuddhan", 150, "Grand Palace Bangkok"), s("wat-arun", "Wat Arun", "Gryningens tempel vid floden", 60, "Wat Arun"), s("flytande", "Flytande marknad", "Handla från båtar i Damnoen Saduak", 385, "Damnoen Saduak floating market"), s("chinatown", "Matvandring i Chinatown", "Guidad matvandring längs Yaowarat Road", 530, "Yaowarat Road")] },
  },
  usa: {
    beach: { lat: 25.79, lon: -80.13, hero: "Miami Beach", sights: [s("kennedy", "Kennedy Space Center", "Rymdfärjan Atlantis och raketparken", 770, "Kennedy Space Center"), s("everglades", "Everglades", "Propellerbåt bland alligatorer", 400, "Everglades airboat"), s("south-beach", "South Beach", "Art déco och livvaktstorn", 0, "South Beach Miami lifeguard tower"), s("disney", "Walt Disney World", "En dag i Magic Kingdom", 1_690, "Cinderella Castle Magic Kingdom")] },
    city: { lat: 40.71, lon: -74.0, hero: "New York Manhattan skyline", sights: [s("frihetsgudinnan", "Frihetsgudinnan", "Båt till Liberty Island och Ellis Island", 250, "Statue of Liberty"), s("top-rock", "Top of the Rock", "Utsikt över Central Park och Empire State", 450, "Top of the Rock view"), s("central-park", "Central Park", "Bow Bridge, Bethesda och skridskobanan", 0, "Bow Bridge Central Park"), s("broadway", "Broadwayshow", "En musikal på Broadway", 1_500, "Times Square Broadway")] },
    ski: { lat: 39.19, lon: -106.82, hero: "Aspen Colorado ski mountain", sights: [ s("aspen-highland-bowl", "Highland Bowl", "Vandra till toppen och åk ner i expertbranten", 0, "Highland Bowl Aspen"), s("aspen-gondola", "Silver Queen-gondolen", "Från stan till toppen av Aspen Mountain", 0, "Silver Queen Gondola Aspen"), s("aspen-art-museum", "Aspen Art Museum", "Samtidskonst och takterrass, fri entré", 0, "Aspen Art Museum"), s("aspen-ajax-tavern", "Après-ski på Ajax Tavern", "Champagne och tryffelpommes vid gondolen", 1_000, "Aspen apres ski"), ] },
  },
  egypten: {
    beach: { lat: 27.26, lon: 33.81, hero: "Hurghada Red Sea", sights: [s("giftun", "Giftunöarna", "Snorkling bland korallrev i Röda havet", 350, "Giftun island"), s("oken", "Ökensafari", "Fyrhjuling och beduinmiddag i öknen", 350, "Eastern Desert Egypt"), s("dykning", "Dykning", "Två dyk med guide vid revet", 600, "Red Sea coral reef"), s("el-gouna", "El Gouna", "Lagunstad med marina och restauranger", 0, "El Gouna marina")] },
    city: { lat: 30.04, lon: 31.24, hero: "Giza pyramids", sights: [s("giza", "Pyramiderna i Giza", "Världens sista bevarade underverk", 130, "Giza pyramid complex"), s("gem", "Stora egyptiska museet", "Tutankhamuns skatter i det nya museet", 335, "Grand Egyptian Museum"), s("khan", "Khan el-Khalili", "Basar sedan 1300-talet", 0, "Khan el-Khalili"), s("felucca", "Feluccatur på Nilen", "Segla i solnedgången", 250, "Felucca Nile Cairo")] },
  },
  japan: {
    beach: { lat: 26.21, lon: 127.68, hero: "Okinawa beach", sights: [s("churaumi", "Churaumi-akvariet", "Valhajar i ett av världens största akvarier", 140, "Okinawa Churaumi Aquarium"), s("shuri", "Shurislottet", "Ryukyurikets kungliga slott", 25, "Shuri Castle"), s("kerama", "Keramaöarna", "Båt och snorkling med havssköldpaddor", 790, "Kerama Islands"), s("kokusai", "Kokusai-dori", "Huvudgatan i Naha", 0, "Kokusai Street Naha")] },
    city: { lat: 35.68, lon: 139.76, hero: "Tokyo skyline", sights: [s("sensoji", "Sensō-ji", "Tokyos äldsta tempel i Asakusa", 0, "Sensō-ji"), s("shibuya-sky", "Shibuya Sky", "Takterrass över världens mest kända korsning", 170, "Shibuya Crossing"), s("teamlab", "teamLab Planets", "Digital konst du går rakt in i", 240, "teamLab Planets"), s("tsukiji", "Matvandring i Tsukiji", "Sushi och street food vid gamla fiskmarknaden", 690, "Tsukiji outer market")] },
    ski: { lat: 42.86, lon: 140.7, hero: "Niseko Mount Yotei powder snow", sights: [ s("niseko-nattskidakning", "Nattskidåkning", "Pudersnö i strålkastarljus – ingår i liftkortet", 0, "Niseko night skiing"), s("niseko-onsen", "Onsen", "Varma källor utomhus medan snön faller", 100, "Japanese onsen snow"), s("niseko-yotei", "Mount Yōtei", "Hokkaidos Fuji tornar upp sig över backarna", 0, "Mount Yotei winter"), s("niseko-otaru", "Dagstur till Otaru", "Kanalstad med glasblåsare och färsk sushi", 200, "Otaru canal winter"), ] },
  },
  maldiverna: {
    beach: { lat: 5.17, lon: 73.05, hero: "Baa Atoll Maldives overwater villas aerial", sights: [s("hanifaru", "Hanifaru Bay", "Snorkla bland mantor i UNESCO-biosfärreservatet", 1_850, "Hanifaru Bay manta rays"), s("husrevet", "Husrevet", "Korallrev och sköldpaddor direkt från stranden", 0, "Maldives house reef snorkeling sea turtle"), s("delfinkryssning", "Delfinkryssning", "Dhoni i solnedgången bland spinnardelfiner", 900, "Maldives dhoni boat sunset dolphins"), s("sandbank", "Sandbankspicknick", "Lunch på en egen sandbank mitt i lagunen", 1_500, "Maldives sandbank picnic")] },
    city: { lat: 4.18, lon: 73.51, hero: "Malé Maldives aerial city", sights: [s("hukuru-miskiy", "Fredagsmoskén", "Hukuru Miskiy från 1658, byggd av korallsten", 0, "Hukuru Miskiy Old Friday Mosque Malé"), s("male-strand", "Konstgjorda stranden", "Malés badstrand med surfare vid vågbrytaren", 0, "Male Maldives beach"), s("male-torget", "Hulhumalé", "Grannön med strandpromenad och solnedgångar", 0, "Hulhumale sunset"), s("whale-submarine", "Ubåtstur", "Ner till korallrevet i en turistubåt utanför Malé", 850, "Whale Submarine Maldives")] },
  },
  dubai: {
    beach: { lat: 25.14, lon: 55.19, hero: "Jumeirah Beach Burj Al Arab sunset", sights: [s("burj-al-arab", "Burj Al Arab", "Guidad tur inne i det segelformade hotellet", 675, "Burj Al Arab Jumeirah"), s("aquaventure", "Aquaventure", "Vattenpark med rutschbanor på Palm Jumeirah", 870, "Aquaventure waterpark Atlantis The Palm"), s("dubai-oken", "Ökensafari", "Dynåkning, kameler och middag i öknen", 650, "Dubai desert safari red dunes"), s("kite-beach", "Kite Beach", "Strand och promenad med Burj Al Arab i bakgrunden", 0, "Kite Beach Dubai")] },
    city: { lat: 25.2, lon: 55.27, hero: "Downtown Dubai Burj Khalifa skyline", sights: [s("burj-khalifa", "Burj Khalifa", "Utsikt från våning 124 i världens högsta byggnad", 510, "Burj Khalifa observation deck view"), s("dubai-fountain", "Dubai Fountain", "Fontänshow vid Burj Khalifa varje kväll", 0, "Dubai Fountain show night"), s("dubai-frame", "Dubai Frame", "150 meter hög ram med glasgolv högst upp", 135, "Dubai Frame Zabeel Park"), s("dubai-creek", "Abra över Dubai Creek", "Träbåt till guld- och kryddsoukerna i Deira", 3, "Dubai Creek abra boat")] },
  },
  bali: {
    beach: { lat: -8.69, lon: 115.16, hero: "Seminyak beach sunset Bali", sights: [s("tanah-lot", "Tanah Lot", "Havstempel på en klippa – bäst i solnedgången", 60, "Tanah Lot temple sunset"), s("uluwatu", "Uluwatu och kecakdans", "Klipptempel högt över havet och kecak i skymningen", 120, "Uluwatu temple kecak dance"), s("surf-bali", "Surflektion", "Två timmar med instruktör på stranden", 300, "Surfing lesson Kuta beach Bali"), s("bali-massage", "Balinesisk massage", "En timme på spa i Seminyak", 150, "Balinese massage spa")] },
    city: { lat: -8.51, lon: 115.26, hero: "Ubud Bali rice fields jungle", sights: [s("tegallalang", "Tegallalang", "Risterrasser i dalen norr om Ubud", 30, "Tegallalang rice terraces"), s("apskogen", "Apskogen", "Makaker bland tempel och banyanträd", 60, "Sacred Monkey Forest Ubud"), s("tirta-empul", "Tirta Empul", "Heliga källor där balineser renar sig", 45, "Tirta Empul temple"), s("batur", "Soluppgång på Batur", "Nattvandring upp på en aktiv vulkan", 430, "Mount Batur sunrise")] },
  },
  mexiko: {
    beach: { lat: 20.21, lon: -87.47, hero: "Tulum beach Mayan ruins Caribbean", sights: [s("tulum-ruiner", "Tulums ruiner", "Mayastad på klippan över Karibiska havet", 190, "Tulum ruins El Castillo"), s("gran-cenote", "Gran Cenote", "Simma i klart vatten i en kalkstensgrotta", 260, "Gran Cenote Tulum"), s("chichen-itza", "Chichén Itzá", "Dagstur till Kukulcánpyramiden", 1_400, "Chichen Itza El Castillo pyramid"), s("sian-kaan", "Sian Ka'an", "Båttur i UNESCO-reservatets laguner och kanaler", 1_500, "Sian Ka'an biosphere reserve lagoon")] },
    city: { lat: 19.43, lon: -99.13, hero: "Mexico City Palacio de Bellas Artes", sights: [s("teotihuacan", "Teotihuacán", "Sol- och månpyramiderna med guide", 700, "Teotihuacan Pyramid of the Sun"), s("antropologi", "Antropologiska museet", "Aztekernas solsten och mayaskatter", 110, "National Museum of Anthropology Mexico City"), s("frida-kahlo", "Frida Kahlo-museet", "Casa Azul – Fridas blå hus i Coyoacán", 170, "Casa Azul Frida Kahlo Museum"), s("xochimilco", "Xochimilco", "Färgglada trajineras på aztekiska kanaler", 300, "Xochimilco trajineras")] },
  },
  island: {
    beach: { lat: 63.42, lon: -19.01, hero: "Vík í Mýrdal church south Iceland", sights: [s("reynisfjara", "Reynisfjara", "Svart sandstrand med basaltpelare", 0, "Reynisfjara black sand beach"), s("dyrholaey", "Dyrhólaey", "Klippvalv och lunnefåglar på sommaren", 0, "Dyrhólaey arch puffins"), s("skogafoss", "Skógafoss", "60 meter högt vattenfall vid ringvägen", 0, "Skógafoss waterfall"), s("solheimajokull", "Glaciärvandring", "Stegjärn och isyxa på Sólheimajökull med guide", 1_200, "Sólheimajökull glacier hike")] },
    city: { lat: 64.15, lon: -21.94, hero: "Reykjavik colorful rooftops Hallgrímskirkja", sights: [s("hallgrimskirkja", "Hallgrímskirkja", "Kyrktornet med utsikt över hela staden", 120, "Hallgrímskirkja Reykjavik"), s("bla-lagunen", "Blå lagunen", "Mjölkblått geotermiskt bad i lavafältet", 1_100, "Blue Lagoon Iceland"), s("gyllene-cirkeln", "Gyllene cirkeln", "Þingvellir, Geysir och Gullfoss på en dag", 1_000, "Gullfoss waterfall Golden Circle"), s("valsafari", "Valsafari", "Båt ut på Faxaflóibukten från gamla hamnen", 1_150, "whale watching Reykjavik Faxaflói")] },
  },
  schweiz: {
    ski: { lat: 46.02, lon: 7.75, hero: "Zermatt Matterhorn winter", sights: [ s("zermatt-glacier-paradise", "Matterhorn Glacier Paradise", "Europas högsta linbana, 3 883 m – ingår i liftkortet", 0, "Matterhorn Glacier Paradise"), s("zermatt-gornergrat", "Gornergratbanan", "Kuggstångsbana till 3 089 m – ingår i liftkortet", 0, "Gornergrat railway winter"), s("zermatt-hinterdorf", "Hinterdorf", "Gamla timmerlador på stolpar mitt i byn", 0, "Zermatt Hinterdorf old village"), s("zermatt-findeln", "Lunch i Findeln", "Fondue med Matterhornutsikt på en bergskrog", 950, "Findeln Zermatt restaurant Matterhorn"), ] },
    beach: { lat: 46.02, lon: 7.75, hero: "Zermatt Matterhorn summer", sights: [s("gornergrat", "Gornergratbanan", "Kuggstångsbana till 3 089 m mitt emot Matterhorn", 1_570, "Gornergrat railway Matterhorn"), s("glacier-paradise", "Matterhorn Glacier Paradise", "Linbana till 3 883 m – Europas högsta station", 1_570, "Matterhorn Glacier Paradise"), s("fem-sjoar", "Fem sjöar-leden", "Vandring förbi sjöar där Matterhorn speglas", 700, "Stellisee Matterhorn reflection"), s("hinterdorf", "Hinterdorf", "Gamla lador av lärkträ på stenpelare", 0, "Zermatt Hinterdorf old village")] },
    city: { lat: 47.37, lon: 8.54, hero: "Zurich Limmat river old town", sights: [s("zurich-altstadt", "Gamla stan och Grossmünster", "Kullerstensgator på båda sidor om Limmat", 0, "Grossmünster Zurich"), s("kunsthaus", "Kunsthaus Zürich", "Munch, Giacometti och franska impressionister", 285, "Kunsthaus Zurich"), s("lindt", "Lindt Home of Chocolate", "Chokladmuseum med nio meter hög chokladfontän", 200, "Lindt Home of Chocolate fountain"), s("zurichsjon", "Båttur på Zürichsjön", "Rundtur från Bürkliplatz ut på sjön", 110, "Lake Zurich boat")] },
  },
  sydafrika: {
    safari: { lat: -24.85, lon: 31.5, hero: "Kruger National Park safari elephants", sights: [ s("kruger-gamedrive", "Game drive i gryningen", "Leta efter de fem stora från öppen safaribil", 450, "safari game drive leopard"), s("kruger-bushwalk", "Bushwalk med ranger", "Spåra djur till fots med beväpnad guide", 650, "walking safari Kruger"), s("kruger-nattsafari", "Nattsafari", "Leoparder och hyenor i strålkastarljus", 480, "night safari Africa"), s("kruger-panorama", "Panoramavägen", "Blyde River Canyon och utsikten från God's Window", 100, "Blyde River Canyon"), ] },
    beach: { lat: -33.95, lon: 18.38, hero: "Camps Bay beach Twelve Apostles", sights: [s("taffelberget", "Taffelberget", "Roterande linbana upp till platån", 260, "Table Mountain cableway"), s("lions-head", "Lion's Head", "Vandring till toppen i solnedgången", 0, "Lion's Head Cape Town"), s("boulders", "Boulders Beach", "Strand med en koloni afrikanska pingviner", 155, "Boulders Beach penguins"), s("godahoppsudden", "Godahoppsudden", "Fyren och klipporna vid Cape Point", 325, "Cape Point lighthouse")] },
    city: { lat: -33.9, lon: 18.42, hero: "Cape Town V&A Waterfront Table Mountain", sights: [s("robben-island", "Robben Island", "Ön där Mandela satt fängslad i 18 år", 550, "Robben Island prison"), s("kirstenbosch", "Kirstenbosch", "Botanisk trädgård med gångbro i trädtopparna", 150, "Kirstenbosch Boomslang walkway"), s("zeitz-mocaa", "Zeitz MOCAA", "Afrikansk samtidskonst i en gammal spannmålssilo", 145, "Zeitz MOCAA atrium"), s("stellenbosch", "Vinprovning i Stellenbosch", "Dagstur till vingårdarna i Winelands", 1_100, "Stellenbosch vineyards")] },
  },
  karibien: {
    beach: { lat: 17.9, lon: -62.83, hero: "St Barthélemy beach turquoise aerial", sights: [s("stbarth-snorkel", "Snorkling i reservatet", "Sköldpaddor och rev i St Barths marina naturreservat", 0, "snorkeling turtle Caribbean"), s("colombier", "Colombier", "Vik som bara nås till fots eller med båt", 0, "Colombier beach St Barth"), s("katamaran-stbarth", "Katamarandag", "Segling, snorkling vid Colombier och lunch ombord", 1_900, "catamaran St Barth"), s("st-jean", "Lunch i Saint-Jean", "Beach club vid flygfältets korta landningsbana", 1_100, "Saint-Jean beach St Barth airplane")] },
    city: { lat: 17.9, lon: -62.85, hero: "Gustavia harbour St Barth", sights: [s("gustavia-hamn", "Gustavias hamn", "Superyachter längs kajen i den gamla svenska hamnen", 0, "Gustavia harbour yachts"), s("shell-beach", "Shell Beach", "Snäckstrand fem minuters promenad från hamnen", 0, "Shell Beach Gustavia"), s("svenska-klocktornet", "Svenska klocktornet", "Gustavias landmärke från svensktiden", 0, "Swedish clock tower Gustavia"), s("solnedgangssegling", "Solnedgångssegling", "Kvällstur med katamaran ut från Gustavia", 1_100, "St Barth sunset sail catamaran")] },
  },
};

export interface StayCard {
  id: string;
  name: string;
  line: string;
  query: string;
}

export const STAYS: Record<Standard, Record<Slot, StayCard>> = {
  budget: {
    beach: { id: "stay-budget-beach", name: "Enkelt hotell nära stranden", line: "Rent rum med balkong, några minuter till stranden", query: "hotel room balcony sea" },
    city: { id: "stay-budget-city", name: "Enkelt hotell centralt", line: "Litet rum nära tunnelbanan", query: "hotel room double bed" },
    ski: { id: "stay-budget-ski", name: "Lägenhet i byn", line: "Liten lägenhet med skidförråd, buss till liften", query: "ski apartment alps" },
    safari: { id: "stay-budget-safari", name: "Rest camp i parken", line: "Enkel stuga innanför stängslet, egen grill", query: "Kruger rest camp" },
  },
  mellan: {
    beach: { id: "stay-mellan-beach", name: "Lägenhet med havsutsikt", line: "Två rum, kök och terrass", query: "apartment terrace sea view" },
    city: { id: "stay-mellan-city", name: "Lägenhet i innerstaden", line: "Ljus lägenhet i ett gammalt stenhus", query: "apartment living room" },
    ski: { id: "stay-mellan-ski", name: "Hotell vid backen", line: "Ski in, ski out och bastu efter åket", query: "ski hotel slope" },
    safari: { id: "stay-mellan-safari", name: "Safarilodge", line: "Helpension och två gamedrives om dagen", query: "safari lodge South Africa" },
  },
  lyx: {
    beach: { id: "stay-lyx-beach", name: "Villa med pool", line: "Egen pool, tre sovrum och utsikt över havet", query: "villa swimming pool Mediterranean" },
    city: { id: "stay-lyx-city", name: "Femstjärnigt hotell", line: "Takbar, spa och rumsservice dygnet runt", query: "luxury hotel lobby" },
    ski: { id: "stay-lyx-ski", name: "Lyxchalet", line: "Öppen spis, jacuzzi och utsikt över topparna", query: "luxury chalet snow" },
    safari: { id: "stay-lyx-safari", name: "Lyxlodge i Sabi Sand", line: "Egen pool vid vattenhålet", query: "luxury safari lodge pool" },
  },
  ultra: {
    beach: { id: "stay-ultra-beach", name: "Privat villa med personal", line: "Egen kock, butler och infinitypool", query: "infinity pool villa" },
    city: { id: "stay-ultra-city", name: "Presidentsvit", line: "Svit på översta våningen med egen butler", query: "luxury hotel suite" },
    ski: { id: "stay-ultra-ski", name: "Chalet med personal", line: "Egen kock, chaufför och skidguide", query: "chalet interior fireplace" },
    safari: { id: "stay-ultra-safari", name: "Privat lodge med ranger", line: "Hela lodgen, egen ranger och spårare", query: "safari tent luxury" },
  },
  jet: {
    beach: { id: "stay-ultra-beach", name: "Privat villa med personal", line: "Egen kock, butler och infinitypool", query: "infinity pool villa" },
    city: { id: "stay-ultra-city", name: "Presidentsvit", line: "Svit på översta våningen med egen butler", query: "luxury hotel suite" },
    ski: { id: "stay-ultra-ski", name: "Chalet med personal", line: "Egen kock, chaufför och skidguide", query: "chalet interior fireplace" },
    safari: { id: "stay-ultra-safari", name: "Privat lodge med ranger", line: "Hela lodgen, egen ranger och spårare", query: "safari tent luxury" },
  },
};

export const JET_CARD: StayCard = { id: "privatjet", name: "Privatjet", line: "Ert eget plan – ingen kö, ingen säkerhetskontroll i terminalen", query: "business jet cabin interior" };
