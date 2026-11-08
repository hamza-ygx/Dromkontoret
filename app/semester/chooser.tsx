"use client";

import { BUDGETS, DESTS, LIMITS, NIGHT_PRESETS, ORIGINS, TRIP_ADDONS, TRIP_STYLES, budgetText, destById, styleById } from "@/lib/semester/catalog";
import { canGo, firstDest, partyText, slotFor, spotRates } from "@/lib/semester/trip";
import type { TripAddon, TripConfig, TripStyle } from "@/lib/semester/types";

function Stepper({ label, hint, value, min, max, onChange }: { label: string; hint: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div className="stepper">
      <button onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`Minska ${label}`}>
        −
      </button>
      <span>
        <b>{value}</b>
        <small>{value === 1 ? label : hint}</small>
      </span>
      <button onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`Öka ${label}`}>
        +
      </button>
    </div>
  );
}

export function TripChooser({
  cfg,
  open,
  note,
  canReturn,
  onChange,
  onBuild,
  onReturn,
}: {
  cfg: TripConfig;
  open: boolean;
  note?: string;
  canReturn: boolean;
  onChange: (patch: Partial<TripConfig>) => void;
  onBuild: () => void;
  onReturn: () => void;
}) {
  const toggle = (a: TripAddon) => onChange({ addons: cfg.addons.includes(a) ? cfg.addons.filter((x) => x !== a) : [...cfg.addons, a] });
  const setStyle = (style: TripStyle) => onChange(canGo(cfg.dest, style) ? { style } : { style, dest: firstDest(style) });
  const slot = slotFor(cfg.style);
  const spot = destById(cfg.dest)[slot]!;
  const allIncOk = spotRates(cfg).allInclusive !== null;
  const from = ORIGINS.find((o) => o.id === cfg.from)!;

  return (
    <section className={`chooser semester${open ? " open" : ""}`} aria-hidden={!open}>
      <div className="inner">
        <div className="intro">
          <span className="eyebrow">Revisionskonsulterna J Hägglund presenterar</span>
          <h2>{note ? "Planera resa 2" : "Vart räcker semesterkassan?"}</h2>
          {note && <p className="cmp-note">{note}</p>}
        </div>

        <div className="blk s-style">
          <h3>
            <i>1</i>Typ av resa
          </h3>
          <div className="vibes eight">
            {TRIP_STYLES.filter((v) => DESTS.some((d) => canGo(d.id, v.id))).map((v) => (
              <button key={v.id} className={`vibe${cfg.style === v.id ? " on" : ""}`} onClick={() => setStyle(v.id)}>
                <span className="sw">
                  {v.swatch.map((c) => (
                    <i key={c} style={{ background: c }} />
                  ))}
                </span>
                <b>{v.label}</b>
                <small>{v.hint}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="blk b-type">
          <h3>
            <i>2</i>Resmål
            <em>{styleById(cfg.style).dests || slot === "ski" || slot === "safari" ? `Resmål för ${styleById(cfg.style).label.toLowerCase()}` : ""}</em>
          </h3>
          <div className="dests">
            {DESTS.map((d) => {
              const ok = canGo(d.id, cfg.style);
              return (
                <button key={d.id} className={`dest${cfg.dest === d.id ? " on" : ""}`} disabled={!ok} onClick={() => onChange({ dest: d.id })}>
                  <span className="stamp" style={{ background: d.walls.wallTop }}>
                    {d.code}
                  </span>
                  <b>{d.label}</b>
                  <small>{ok ? d[slot]!.name : "Passar inte resan"}</small>
                </button>
              );
            })}
          </div>
        </div>

        <div className="blk s-budget">
          <h3>
            <i>3</i>Budget för hela resan
          </h3>
          <div className="seg">
            {BUDGETS.map((b) => (
              <button key={b.id} className={cfg.budget === b.id ? "on" : ""} onClick={() => onChange({ budget: b.id })}>
                <b>{b.label}</b>
                <small>tkr</small>
              </button>
            ))}
          </div>
        </div>

        <div className="blk s-party">
          <h3>
            <i>4</i>Resenärer
          </h3>
          <div className="steppers">
            <Stepper label="vuxen" hint="vuxna" value={cfg.adults} min={LIMITS.adults[0]} max={LIMITS.adults[1]} onChange={(adults) => onChange({ adults })} />
            <Stepper label="barn" hint="barn" value={cfg.kids} min={LIMITS.kids[0]} max={LIMITS.kids[1]} onChange={(kids) => onChange({ kids })} />
          </div>
        </div>

        <div className="blk s-nights">
          <h3>
            <i>5</i>Nätter
          </h3>
          <div className="nights">
            <Stepper label="natt" hint="nätter" value={cfg.nights} min={LIMITS.nights[0]} max={LIMITS.nights[1]} onChange={(nights) => onChange({ nights })} />
            <div className="chips">
              {NIGHT_PRESETS.map((p) => (
                <button key={p.nights} className={cfg.nights === p.nights ? "on" : ""} onClick={() => onChange({ nights: p.nights })}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="blk s-from">
          <h3>
            <i>6</i>Avresa från
          </h3>
          <div className="seg three">
            {ORIGINS.map((o) => (
              <button key={o.id} className={cfg.from === o.id ? "on" : ""} onClick={() => onChange({ from: o.id })}>
                <b>{o.label}</b>
                <small>{o.airport}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="blk s-extras">
          <h3>
            <i>7</i>Tillval
          </h3>
          <div className="extras">
            {TRIP_ADDONS.map((e) => {
              const off = (e.id === "allinc" && !allIncOk) || (e.id === "bil" && !spotRates(cfg).car);
              const on = cfg.addons.includes(e.id) && !off;
              return (
                <button key={e.id} className={on ? "on" : ""} disabled={off} title={off ? `${e.label} finns inte ${spot.prep} ${spot.name}` : undefined} onClick={() => toggle(e.id)}>
                  <span className="tick">{on ? "✓" : "+"}</span>
                  {e.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="go">
          <p className="summary">
            <b>
              {spot.name} · {cfg.nights} nätter
            </b>
            <span>
              {partyText(cfg)} · från {from.label} · budget {budgetText(cfg.budget)}
            </span>
          </p>
          {canReturn && (
            <button className="ghostbtn" onClick={onReturn}>
              Tillbaka till resan
            </button>
          )}
          <button className="build" onClick={onBuild}>
            Planera drömsemestern
            <kbd>Enter</kbd>
          </button>
        </div>
      </div>
    </section>
  );
}
