"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { destById } from "@/lib/semester/catalog";
import { planTrip } from "@/lib/semester/trip";
import type { Standard, TripConfig } from "@/lib/semester/types";
import { Mark } from "../designer/designer";
import { Scene } from "../designer/scene";
import { StageActions } from "../designer/stage-actions";
import { AppSwitch } from "../switch";
import { TripChooser } from "./chooser";
import { TripResult, type TripTab } from "./result";

const START: TripConfig = { dest: "grekland", budget: "100-250", party: "2", nights: 7, style: "sol", addons: [] };

export function TripDesigner({ version, visible }: { version: string; visible: boolean }) {
  const [cfg, setCfg] = useState<TripConfig>(START);
  const [built, setBuilt] = useState<TripConfig | null>(null);
  const [pick, setPick] = useState<Standard | undefined>(undefined);
  const [buildId, setBuildId] = useState(0);
  const [quick, setQuick] = useState(false);
  const [open, setOpen] = useState(true);
  const [selItem, setSelItem] = useState<string | null>(null);
  const [selRoom, setSelRoom] = useState<string | null>(null);
  const [tab, setTab] = useState<TripTab>("kostnad");
  const listRef = useRef<HTMLDivElement>(null);

  const plan = useMemo(() => (built ? planTrip(built, pick) : null), [built, pick]);

  const build = useCallback((c: TripConfig) => {
    setBuilt(c);
    setPick(undefined);
    setQuick(false);
    setBuildId((n) => n + 1);
    setSelItem(null);
    setSelRoom(null);
    setTab("kostnad");
    setOpen(false);
  }, []);
  const restart = () => {
    setCfg(START);
    setBuilt(null);
    setPick(undefined);
    setSelItem(null);
    setSelRoom(null);
    setOpen(true);
  };
  const choose = (s: Standard) => {
    if (!plan || s === plan.trip.standard) return;
    setPick(s);
    setQuick(true);
    setBuildId((n) => n + 1);
    setSelItem(null);
    setSelRoom(null);
  };

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

  useEffect(() => {
    if (!selItem) return;
    setTab("boende");
    requestAnimationFrame(() => listRef.current?.querySelector(`[data-li="${selItem}"]`)?.scrollIntoView({ block: "nearest", behavior: "smooth" }));
  }, [selItem]);

  return (
    <div className="app">
      <header className="topbar">
        <Mark />
        <div className="brand">
          <h1>Drömsemestern</h1>
          <p>Välj resmål och budget – se vad pengarna räcker till.</p>
        </div>
        <AppSwitch />
        <span className="ver" title="Version">v {version}</span>
      </header>

      <div className="body">
        <main className="stage tstage">
          {plan && (
            <Scene
              plan={plan.home}
              palette={destById(plan.config.dest).walls}
              buildId={buildId}
              quick={quick}
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
          {plan && <StageActions onRestart={restart} onEdit={() => setOpen(true)} />}
          {plan && <div className="hint">Dra för att snurra · scrolla för att zooma · klicka på en möbel</div>}
        </main>

        <aside className="result">
          {plan && (
            <TripResult
              plan={plan}
              tab={tab}
              onTab={setTab}
              onStandard={choose}
              selItem={selItem}
              selRoom={selRoom}
              onSelectItem={setSelItem}
              onSelectRoom={setSelRoom}
              listRef={listRef}
            />
          )}
        </aside>

        <TripChooser cfg={cfg} open={open} canReturn={!!built} onChange={(patch) => setCfg({ ...cfg, ...patch })} onBuild={() => build(cfg)} onReturn={() => setOpen(false)} />
      </div>
    </div>
  );
}
