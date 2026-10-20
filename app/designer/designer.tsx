"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EXTRAS, TYPES, VIBES, extraAvailable } from "@/lib/home/catalog";
import { placeById } from "@/lib/home/places";
import { generate } from "@/lib/home/layout";
import { estimate, kr, monthly, monthlyFee } from "@/lib/home/price";
import type { Config, Extra, HomeType, Item } from "@/lib/home/types";
import { AppSwitch } from "../switch";
import { CALC_START, Calc, type CalcState } from "./calc";
import { PlaceSearch } from "./place-search";
import { Scene } from "./scene";
import { StageActions } from "./stage-actions";

const ROOM_WORD = ["Etta", "Tvåa", "Trea", "Fyra", "Femma"];
const START: Config = { type: "lagenhet", rooms: 2, vibe: "ungdom", area: "stockholm", extras: ["balkong"] };

const m2 = (v: number) => `${v.toFixed(1).replace(".", ",").replace(",0", "")} m²`;
const short = (v: number) => (v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1).replace(".", ",")} mkr` : kr(v));

function TypeIcon({ t }: { t: HomeType }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  return (
    <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden>
      {t === "lagenhet" && (
        <g {...p}>
          <rect x="7" y="4" width="18" height="24" rx="1" />
          <path d="M11 9h3M18 9h3M11 14h3M18 14h3M11 19h3M18 19h3M14 28v-4h4v4" />
        </g>
      )}
      {t === "radhus" && (
        <g {...p}>
          <path d="M2 16l6-6 6 6M10 16l6-6 6 6M18 16l6-6 6 6M4 15v12h24V15" />
          <path d="M7 27v-5h3v5M15 27v-5h3v5M23 27v-5h3v5" />
        </g>
      )}
      {t === "villa" && (
        <g {...p}>
          <path d="M4 15L16 5l12 10M7 13v14h18V13" />
          <path d="M13 27v-7h6v7M21 8V5h3v5.5" />
        </g>
      )}
      {t === "stuga" && (
        <g {...p}>
          <path d="M5 17l9-8 9 8M7 15v8h14v-8M12 23v-4h4v4" />
          <path d="M2 27c2-1.4 4-1.4 6 0s4 1.4 6 0 4-1.4 6 0 4 1.4 6 0 3-1.2 4-.6" />
        </g>
      )}
    </svg>
  );
}

export function Mark() {
  return (
    <div className="mark" aria-label="Revisionskonsulterna J Hägglund">
      <span className="mono">RKJH</span>
      <span className="firm">
        Revisionskonsulterna
        <br />J Hägglund
      </span>
    </div>
  );
}

export function Designer({ version, visible = true }: { version: string; visible?: boolean }) {
  const [cfg, setCfg] = useState<Config>(START);
  const [built, setBuilt] = useState<Config | null>(null);
  const [buildId, setBuildId] = useState(0);
  const [open, setOpen] = useState(true);
  const [selItem, setSelItem] = useState<string | null>(null);
  const [selRoom, setSelRoom] = useState<string | null>(null);
  const [tab, setTab] = useState<"rum" | "inredning" | "kalkyl">("rum");
  const [calc, setCalc] = useState<CalcState>(CALC_START);
  const listRef = useRef<HTMLDivElement>(null);

  const plan = useMemo(() => (built ? generate(built) : null), [built]);
  const est = useMemo(() => (plan ? estimate(plan) : null), [plan]);
  const fee = useMemo(() => (plan ? monthlyFee(plan) : null), [plan]);
  const draftArea = useMemo(() => generate(cfg).livingArea, [cfg]);

  const build = useCallback((c: Config) => {
    setBuilt(c);
    setBuildId((n) => n + 1);
    setSelItem(null);
    setSelRoom(null);
    setTab("rum");
    setOpen(false);
  }, []);
  const edit = () => {
    setSelItem(null);
    setOpen(true);
  };
  const restart = () => {
    setCfg(START);
    setBuilt(null);
    setSelItem(null);
    setSelRoom(null);
    setOpen(true);
  };

  const update = (patch: Partial<Config>) => {
    const next = { ...cfg, ...patch };
    next.extras = next.extras.filter((e) => extraAvailable(e, next.type));
    setCfg(next);
  };
  const toggleExtra = (e: Extra) => update({ extras: cfg.extras.includes(e) ? cfg.extras.filter((x) => x !== e) : [...cfg.extras, e] });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!visible || e.target instanceof HTMLInputElement) return;
      if (e.key === "Enter" && open && !(e.target instanceof HTMLButtonElement)) build(cfg);
      if (e.key === "f" || e.key === "F") {
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen?.().catch(() => {});
      }
      if (e.key === "Escape") setSelItem(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cfg, build, open, visible]);

  // Keep the shopping list in sync with what's clicked in 3D.
  useEffect(() => {
    if (!selItem) return;
    setTab("inredning");
    requestAnimationFrame(() => listRef.current?.querySelector(`[data-li="${selItem}"]`)?.scrollIntoView({ block: "nearest", behavior: "smooth" }));
  }, [selItem]);

  const groups = useMemo(() => {
    if (!plan) return [];
    const g = new Map<string, Item[]>();
    for (const it of plan.items) {
      if (!g.has(it.room)) g.set(it.room, []);
      g.get(it.room)!.push(it);
    }
    return [...g.entries()];
  }, [plan]);

  const typeLabel = TYPES.find((t) => t.id === cfg.type)!.label;
  const areaLabel = placeById(cfg.area).name;
  const vibeLabel = VIBES.find((v) => v.id === cfg.vibe)!.label;

  return (
    <div className="app">
      <header className="topbar">
        <Mark />
        <div className="brand">
          <h1>Drömboendet</h1>
          <p>Välj, bygg och se vad det kostar – på några sekunder.</p>
        </div>
        <AppSwitch />
        <span className="ver" title="Version">v {version}</span>
      </header>

      <div className="body">
        <main className="stage">
          {plan && (
            <Scene
              plan={plan}
              buildId={buildId}
              quick={false}
              active={!open && visible}
              selectedItem={selItem}
              selectedRoom={selRoom}
              onSelectItem={(id) => {
                setSelItem(id);
                if (id) setSelRoom(null);
              }}
              onSelectRoom={setSelRoom}
            />
          )}
          {plan && <StageActions onRestart={restart} onEdit={edit} />}
          {plan && <div className="hint">Dra för att snurra · scrolla för att zooma · klicka på en möbel</div>}
        </main>

        <aside className="result">
          {plan && est && (
            <>
              <div className="head">
                <small>
                  {TYPES.find((t) => t.id === plan.config.type)!.label} · {VIBES.find((v) => v.id === plan.config.vibe)!.label}
                </small>
                <h2>{plan.title}</h2>
              </div>
              <div className="price">
                <small>Uppskattat pris</small>
                <strong>{short(est.price)}</strong>
                <div className="facts">
                  <span>
                    <b>{m2(plan.livingArea)}</b>boarea
                  </span>
                  <span>
                    <b>{plan.config.rooms} rok</b>
                    {ROOM_WORD[plan.config.rooms - 1].toLowerCase()}
                  </span>
                  <span>
                    <b>{Math.round(est.perM2 / 1000)} tkr</b>per m²
                  </span>
                </div>
                {est.extras > 0 && <p className="dim">Varav tillval ca {short(est.extras)}</p>}
                {fee && (
                  <button className="permonth" onClick={() => setTab("kalkyl")}>
                    ≈ <b>{kr(monthly(est.price, fee.amount, calc.down, calc.rate, calc.amort).total)}</b> per månad
                    <span>Räkna →</span>
                  </button>
                )}
              </div>

              <div className="tabs">
                <button className={tab === "rum" ? "on" : ""} onClick={() => setTab("rum")}>
                  Rum <span>{plan.rooms.filter((r) => r.kind !== "hall").length}</span>
                </button>
                <button className={tab === "inredning" ? "on" : ""} onClick={() => setTab("inredning")}>
                  Inredning <span>{plan.items.length}</span>
                </button>
                <button className={tab === "kalkyl" ? "on" : ""} onClick={() => setTab("kalkyl")}>
                  Kalkyl
                </button>
              </div>

              <div className="list" ref={listRef}>
                {tab === "kalkyl" && fee ? (
                  <Calc price={est.price} fee={fee.amount} feeLabel={fee.label} state={calc} onChange={setCalc} />
                ) : tab === "rum" ? (
                  <ul className="rooms">
                    {plan.rooms
                      .filter((r) => r.kind !== "hall")
                      .map((r) => (
                        <li key={r.id}>
                          <button
                            className={selRoom === r.id ? "on" : ""}
                            onClick={() => {
                              setSelItem(null);
                              setSelRoom(selRoom === r.id ? null : r.id);
                            }}
                          >
                            <span>{r.name}</span>
                            <em>
                              {r.w.toFixed(1).replace(".", ",")} × {r.d.toFixed(1).replace(".", ",")} m
                            </em>
                            <b>{m2(r.w * r.d)}</b>
                          </button>
                        </li>
                      ))}
                  </ul>
                ) : (
                  groups.map(([room, items]) => (
                    <div key={room} className="grp">
                      <h3>{room}</h3>
                      <ul>
                        {items.map((it) => (
                          <li key={it.id} data-li={it.id}>
                            <button className={selItem === it.id ? "on" : ""} onClick={() => setSelItem(selItem === it.id ? null : it.id)}>
                              <span>
                                <b>{it.label.name}</b>
                                <em>
                                  {it.label.store}
                                  {it.label.size !== "–" ? ` · ${it.label.size}` : ""}
                                </em>
                              </span>
                              <strong>{it.label.price ? `ca ${it.label.price.toLocaleString("sv-SE")} kr` : "Ingår"}</strong>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                )}
              </div>
              {tab !== "kalkyl" && (
                <div className="total">
                  <span>Inredning totalt</span>
                  <strong>ca {kr(est.furniture)}</strong>
                </div>
              )}
              <p className="fine">Cirkapriser och uppskattningar, inte rådgivning eller offert.</p>
            </>
          )}
        </aside>

        <section className={`chooser${open ? " open" : ""}`} aria-hidden={!open}>
          <div className="inner">
            <div className="intro">
              <span className="eyebrow">Revisionskonsulterna J Hägglund presenterar</span>
              <h2>Hur skulle ditt drömboende se ut?</h2>
            </div>

            <div className="blk b-type">
              <h3>
                <i>1</i>Typ av boende
              </h3>
              <div className="types">
                {TYPES.map((t) => (
                  <button key={t.id} className={`card${cfg.type === t.id ? " on" : ""}`} onClick={() => update({ type: t.id })}>
                    <TypeIcon t={t.id} />
                    <b>{t.label}</b>
                    <small>{t.hint}</small>
                  </button>
                ))}
              </div>
            </div>

            <div className="blk b-rooms">
              <h3>
                <i>2</i>Antal rum <em>{m2(draftArea)}</em>
              </h3>
              <div className="seg">
                {([1, 2, 3, 4, 5] as const).map((n) => (
                  <button key={n} className={cfg.rooms === n ? "on" : ""} onClick={() => update({ rooms: n })}>
                    <b>{n}</b>
                    <small>rok</small>
                  </button>
                ))}
              </div>
            </div>

            <div className="blk b-vibe">
              <h3>
                <i>3</i>Stil
              </h3>
              <div className="vibes">
                {VIBES.map((v) => (
                  <button key={v.id} className={`vibe${cfg.vibe === v.id ? " on" : ""}`} onClick={() => update({ vibe: v.id })}>
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
                <i>4</i>Område
              </h3>
              <PlaceSearch type={cfg.type} value={cfg.area} onChange={(area) => update({ area })} />
            </div>

            <div className="blk b-extras">
              <h3>
                <i>5</i>Tillval
              </h3>
              <div className="extras">
                {EXTRAS.map((e) => {
                  const label = e.byType[cfg.type];
                  const on = cfg.extras.includes(e.id);
                  return (
                    <button key={e.id} disabled={!label} className={on ? "on" : ""} onClick={() => toggleExtra(e.id)} title={label ? undefined : "Finns inte för lägenhet"}>
                      <span className="tick">{on ? "✓" : "+"}</span>
                      {label ?? e.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="go">
              <p className="summary">
                <b>
                  {ROOM_WORD[cfg.rooms - 1]} · {typeLabel}
                </b>
                <span>
                  {vibeLabel} · {areaLabel} · {m2(draftArea)}
                </span>
              </p>
              {built && (
                <button className="ghostbtn" onClick={() => setOpen(false)}>
                  Tillbaka till huset
                </button>
              )}
              <button className="build" onClick={() => build(cfg)}>
                Bygg drömboendet
                <kbd>Enter</kbd>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
