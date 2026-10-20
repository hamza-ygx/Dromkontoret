"use client";

import { ADDONS, HEADCOUNTS, INDUSTRIES, STYLES, addonLabel, staffFor } from "@/lib/office/catalog";
import { placeById, preposition } from "@/lib/home/places";
import type { Addon, OfficeConfig } from "@/lib/office/types";
import { PlaceSearch, type PlaceFormat } from "../designer/place-search";
import { IndustryIcon } from "./icons";

const PLACE_FORMAT: PlaceFormat = {
  hit: () => "",
  info: (p) => (
    <>
      Lokal {preposition(p)} <b>{p.name}</b>, {p.lan}
    </>
  ),
};

export function OfficeChooser({
  cfg,
  open,
  canReturn,
  onChange,
  onBuild,
  onReturn,
}: {
  cfg: OfficeConfig;
  open: boolean;
  canReturn: boolean;
  onChange: (patch: Partial<OfficeConfig>) => void;
  onBuild: () => void;
  onReturn: () => void;
}) {
  const toggle = (a: Addon) => onChange({ addons: cfg.addons.includes(a) ? cfg.addons.filter((x) => x !== a) : [...cfg.addons, a] });
  const industry = INDUSTRIES.find((i) => i.id === cfg.industry)!;
  const style = STYLES.find((s) => s.id === cfg.style)!;
  const staff = staffFor(cfg.size);

  return (
    <section className={`chooser kontor${open ? " open" : ""}`} aria-hidden={!open}>
      <div className="inner">
        <div className="intro">
          <span className="eyebrow">Revisionskonsulterna J Hägglund presenterar</span>
          <h2>Hur skulle ditt drömkontor se ut?</h2>
        </div>

        <div className="blk b-type">
          <h3>
            <i>1</i>Bransch
          </h3>
          <div className="types">
            {INDUSTRIES.map((t) => (
              <button key={t.id} className={`card${cfg.industry === t.id ? " on" : ""}`} onClick={() => onChange({ industry: t.id })}>
                <IndustryIcon i={t.id} />
                <b>{t.label}</b>
                <small>{t.hint}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="blk b-rooms">
          <h3>
            <i>2</i>Antal anställda
          </h3>
          <div className="seg">
            {HEADCOUNTS.map((h) => (
              <button key={h.id} className={cfg.size === h.id ? "on" : ""} onClick={() => onChange({ size: h.id })}>
                <b>{h.label}</b>
                <small>pers</small>
              </button>
            ))}
          </div>
        </div>

        <div className="blk b-vibe">
          <h3>
            <i>3</i>Stil
          </h3>
          <div className="vibes">
            {STYLES.map((v) => (
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

        <div className="blk b-area">
          <h3>
            <i>4</i>Kommun
          </h3>
          <PlaceSearch format={PLACE_FORMAT} value={cfg.area} onChange={(area) => onChange({ area })} />
        </div>

        <div className="blk b-extras">
          <h3>
            <i>5</i>Tillval
          </h3>
          <div className="extras">
            {ADDONS.map((e) => {
              const on = cfg.addons.includes(e.id);
              return (
                <button key={e.id} className={on ? "on" : ""} onClick={() => toggle(e.id)}>
                  <span className="tick">{on ? "✓" : "+"}</span>
                  {addonLabel(e.id, cfg.industry)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="go">
          <p className="summary">
            <b>
              {industry.company} · {staff} {staff === 1 ? "anställd" : "anställda"}
            </b>
            <span>
              {style.label} · {preposition(placeById(cfg.area))} {placeById(cfg.area).name}
            </span>
          </p>
          {canReturn && (
            <button className="ghostbtn" onClick={onReturn}>
              Tillbaka till kontoret
            </button>
          )}
          <button className="build" onClick={onBuild}>
            Bygg drömkontoret
            <kbd>Enter</kbd>
          </button>
        </div>
      </div>
    </section>
  );
}
