# Rates and sources – Drömkontoret

All figures used by Drömkontoret live in `lib/office/rates.ts`. This file lists where each one comes from. Furniture and equipment prices in `lib/office/equipment.ts` are approximate example prices (cirkapris, excluding VAT) from the named suppliers, not quotes.

Confidence: **high** = primary source (authority or statistics agency), **medium** = broker or industry source, **estimate** = set by us for the demo where no published figure exists.

## Space (phase 2)

| Key in `SPACE` | Value | Basis | Source | Confidence |
| --- | --- | --- | --- | --- |
| `officePerStaff` | 15 m² LOA per employee | Activity-based offices 10–15 m² per employee; new state leases target 12–15 m², current state average 22 m² | Riksrevisionen RiR 2025:17 "Kostsam kvadratjakt" – https://www.riksrevisionen.se/granskningar/granskningsrapporter/2025/kostsam-kvadratjakt---statens-anvandning-och-anskaffning-av-kontorslokaler.html · Lokalguiden – https://www.lokalguiden.se/magasinet/artikel/hur-m%C3%A5nga-kvm-per-anst%C3%A4lld | High / medium |
| `officeMin` | 40 m² | Smallest sensible office with WC and pentry | – | Estimate |
| `diningPerSeat` | 1.3 m² per seat | 1.0–1.5 m² per seat in a standard dining room | Helioneon – https://helioneon.com/se/blog/restauranginredning-steg-regler-rad/ · TheFork Manager – https://www.theforkmanager.com/sv/blog/organisation-restauranger-kapacitet | Medium |
| `kitchenShare` | 30 % of dining + kitchen area | Kitchen and dishwashing 25–35 % of the restaurant | Helioneon, as above | Medium |
| `seatsPerStaff` | 5.5 seats per employee | A 60-seat restaurant has about 10–12 employees | – | Estimate |
| `minSeats` | 12 | Smallest café | – | Estimate |

The generated floor plans follow these norms, but rooms have minimum widths and the dining room must fit whole tables, so small companies come out somewhat larger per employee than the norm.
