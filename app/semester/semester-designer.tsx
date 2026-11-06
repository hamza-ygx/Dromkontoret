"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { cardsFor, spotFor } from "@/lib/semester/cards";
import { ORIGIN } from "@/lib/semester/spots";
import { planTrip } from "@/lib/semester/trip";
import type { Standard, TripConfig } from "@/lib/semester/types";
import { Mark } from "../designer/designer";
import { StageActions } from "../designer/stage-actions";
import { AppSwitch } from "../switch";
import { CardFan, Lightbox } from "./cards";
import { TripChooser } from "./chooser";
import { Globe } from "./globe";
import { TripResult, type TripTab } from "./result";

const START: TripConfig = { dest: "grekland", budget: "100-250", party: "2", nights: 7, style: "sol", addons: [] };

export function TripDesigner({ version, visible }: { version: string; visible: boolean }) {
  const [cfg, setCfg] = useState<TripConfig>(START);
  const [built, setBuilt] = useState<TripConfig | null>(null);
  const [pick, setPick] = useState<Standard | undefined>(undefined);
  const [buildId, setBuildId] = useState(0);
  const [open, setOpen] = useState(true);
  const [arrived, setArrived] = useState(false);
  const [card, setCard] = useState<string | null>(null);
  const [tab, setTab] = useState<TripTab>("kostnad");

  const plan = useMemo(() => (built ? planTrip(built, pick) : null), [built, pick]);
  const cards = useMemo(() => (plan ? cardsFor(plan) : []), [plan]);
  const spot = plan ? spotFor(plan) : null;
  const opened = cards.find((c) => c.id === card);

  const build = useCallback((c: TripConfig) => {
    setBuilt(c);
    setPick(undefined);
    setBuildId((n) => n + 1);
    setArrived(false);
    setCard(null);
    setTab("kostnad");
    setOpen(false);
  }, []);
  const restart = () => {
    setCfg(START);
    setBuilt(null);
    setPick(undefined);
    setCard(null);
    setOpen(true);
  };
  const choose = (s: Standard) => {
    if (!plan || s === plan.trip.standard) return;
    setPick(s);
    setCard(null);
  };
  const replay = () => {
    setArrived(false);
    setCard(null);
    setBuildId((n) => n + 1);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!visible || e.target instanceof HTMLInputElement) return;
      if (e.key === "Enter" && open && !(e.target instanceof HTMLButtonElement)) build(cfg);
      if (e.key === "f" || e.key === "F") {
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen?.().catch(() => {});
      }
      if (e.key === "Escape") setCard(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cfg, build, open, visible]);

  return (
    <div className="app">
      <header className="topbar">
        <Mark />
        <div className="brand">
          <h1>Drömsemestern</h1>
          <p>Välj resmål och budget – se vart pengarna tar er.</p>
        </div>
        <AppSwitch />
        <span className="ver" title="Version">v {version}</span>
      </header>

      <div className="body">
        <main className="stage tstage">
          {plan && spot && (
            <Globe
              from={[ORIGIN.lon, ORIGIN.lat]}
              to={[spot.lon, spot.lat]}
              fromLabel={ORIGIN.name}
              toLabel={plan.place}
              jet={plan.trip.standard === "jet"}
              buildId={buildId}
              onArrive={() => setArrived(true)}
            />
          )}
          {plan && arrived && <CardFan key={`${buildId}-${plan.trip.standard}`} cards={cards} place={plan.place} onOpen={setCard} />}
          {plan && (
            <StageActions onRestart={restart} onEdit={() => setOpen(true)}>
              <button className="act" onClick={replay}>
                <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden>
                  <path d="M3 11.5 17 5l-3.5 13-3.2-5.3zM10.3 12.7 17 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                </svg>
                Flyg igen
              </button>
            </StageActions>
          )}
          {opened && <Lightbox card={opened} onClose={() => setCard(null)} />}
        </main>

        <aside className="result">
          {plan && (
            <TripResult
              plan={plan}
              tab={tab}
              onTab={setTab}
              onStandard={choose}
              onOpen={setCard}
            />
          )}
        </aside>

        <TripChooser cfg={cfg} open={open} canReturn={!!built} onChange={(patch) => setCfg({ ...cfg, ...patch })} onBuild={() => build(cfg)} onReturn={() => setOpen(false)} />
      </div>
    </div>
  );
}
