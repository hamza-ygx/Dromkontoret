"use client";

import { kr } from "@/lib/home/price";
import { BUDGETS, DESTS, NIGHTS, PARTIES, TRIP_ADDONS, TRIP_STYLES, destById } from "@/lib/semester/catalog";
import { DEST_RATES } from "@/lib/semester/rates";
import { partyText } from "@/lib/semester/trip";
import type { TripAddon, TripConfig } from "@/lib/semester/types";

export function TripChooser({
  cfg,
  open,
  canReturn,
  onChange,
  onBuild,
  onReturn,
}: {
  cfg: TripConfig;
  open: boolean;
  canReturn: boolean;
  onChange: (patch: Partial<TripConfig>) => void;
  onBuild: () => void;
  onReturn: () => void;
}) {
  const toggle = (a: TripAddon) => onChange({ addons: cfg.addons.includes(a) ? cfg.addons.filter((x) => x !== a) : [...cfg.addons, a] });
  const dest = destById(cfg.dest);
  const style = TRIP_STYLES.find((s) => s.id === cfg.style)!;
  const spot = style.beach ? dest.beach : dest.city;
  const allIncOk = DEST_RATES[cfg.dest].allInclusive !== null;

  return (
    <section className={`chooser semester${open ? " open" : ""}`} aria-hidden={!open}>
      <div className="inner">
        <div className="intro">
          <span className="eyebrow">Revisionskonsulterna J Hägglund presenterar</span>
          <h2>Vart räcker semesterkassan?</h2>
        </div>

        <div className="blk b-type">
          <h3>
            <i>1</i>Resmål
          </h3>
          <div className="dests">
            {DESTS.map((d) => (
              <button key={d.id} className={`dest${cfg.dest === d.id ? " on" : ""}`} onClick={() => onChange({ dest: d.id })}>
                <span className="stamp" style={{ background: d.walls.wallTop }}>
                  {d.code}
                </span>
                <b>{d.label}</b>
                <small>
                  {d.beach.name} · {d.city.name}
                </small>
              </button>
            ))}
          </div>
        </div>

        <div className="blk s-budget">
          <h3>
            <i>2</i>Budget för hela resan
          </h3>
          <div className="seg">
            {BUDGETS.map((b) => (
              <button key={b.id} className={cfg.budget === b.id ? "on" : ""} onClick={() => onChange({ budget: b.id })}>
                <b>{b.label}</b>
                <small>kr</small>
              </button>
            ))}
          </div>
        </div>

        <div className="blk s-party">
          <h3>
            <i>3</i>Resenärer
          </h3>
          <div className="seg four">
            {PARTIES.map((p) => (
              <button key={p.id} className={cfg.party === p.id ? "on" : ""} onClick={() => onChange({ party: p.id })}>
                <b>{p.label}</b>
                <small>{p.hint}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="blk s-nights">
          <h3>
            <i>4</i>Nätter
          </h3>
          <div className="seg four">
            {NIGHTS.map((n) => (
              <button key={n.id} className={cfg.nights === n.id ? "on" : ""} onClick={() => onChange({ nights: n.id })}>
                <b>{n.label}</b>
                <small>{n.hint}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="blk s-style">
          <h3>
            <i>5</i>Typ av resa
          </h3>
          <div className="vibes">
            {TRIP_STYLES.map((v) => (
              <button key={v.id} className={`vibe${cfg.style === v.id ? " on" : ""}`} onClick={() => onChange({ style: v.id })}>
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

        <div className="blk s-extras">
          <h3>
            <i>6</i>Tillval
          </h3>
          <div className="extras">
            {TRIP_ADDONS.map((e) => {
              const off = e.id === "allinc" && !allIncOk;
              const on = cfg.addons.includes(e.id) && !off;
              return (
                <button key={e.id} className={on ? "on" : ""} disabled={off} title={off ? `Allt inkluderat är ovanligt i ${dest.label}` : undefined} onClick={() => toggle(e.id)}>
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
              {partyText(cfg)} · budget {kr(cfg.budget)}
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
