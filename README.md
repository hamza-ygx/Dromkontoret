# Drömboendet – RKJH

Stage demo for Revisionskonsulterna J Hägglund: pick a home type, number of rooms, style, area and extras, and watch the home build in 3D in about 5 seconds. Every change after that rebuilds live in about 1 second. Click any piece of furniture to see its approximate price, size and an example store.

Everything runs offline in the browser. There is no API key and no backend call.

## Run

```bash
npm install
npm run dev          # http://localhost:3000
```

Keys: **Enter** builds from scratch, **F** toggles fullscreen, **Esc** closes the furniture card.
Drag to rotate, scroll to zoom. Use 3D/2D, spin and reset in the stage corner.

## Optional passcode

Set `APP_PASSCODE` (and optionally `SESSION_SECRET`) in Vercel to put the app behind a code screen. Without it the app is open.

## Code map

| Path | What |
| --- | --- |
| `lib/home/catalog.ts` | Types, styles, areas (kr/m²), extras, palettes, furniture catalogue (names, sizes, approximate prices, stores) |
| `lib/home/layout.ts` | `generate(config)`: room programme → floor plan, walls with doors/windows, plot, garden, pool, lake |
| `lib/home/furnish.ts` | Furniture placement per room and style |
| `lib/home/price.ts` | Price estimate |
| `app/designer/scene.tsx` | CSS-3D renderer: build animation, camera, picking |
| `app/designer/designer.tsx` | Configurator UI and result panel |

Prices are rough estimates for the demo, not valuations.
