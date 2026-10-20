"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { generateOffice } from "@/lib/office/layout";
import { OFFICE_PALETTE } from "@/lib/office/palette";
import type { OfficeConfig } from "@/lib/office/types";
import { Mark } from "../designer/designer";
import { Scene } from "../designer/scene";
import { StageActions } from "../designer/stage-actions";
import { AppSwitch } from "../switch";
import { OfficeChooser } from "./chooser";
import { OfficeResult, type OfficeTab } from "./result";

const START: OfficeConfig = { industry: "konsult", size: "6-10", style: "skandi", area: "halmstad", addons: ["konferens"] };

export function OfficeDesigner({ version, visible }: { version: string; visible: boolean }) {
  const [cfg, setCfg] = useState<OfficeConfig>(START);
  const [built, setBuilt] = useState<OfficeConfig | null>(null);
  const [buildId, setBuildId] = useState(0);
  const [open, setOpen] = useState(true);
  const [selItem, setSelItem] = useState<string | null>(null);
  const [selRoom, setSelRoom] = useState<string | null>(null);
  const [tab, setTab] = useState<OfficeTab>("rum");
  const listRef = useRef<HTMLDivElement>(null);

  const plan = useMemo(() => (built ? generateOffice(built) : null), [built]);

  const build = useCallback((c: OfficeConfig) => {
    setBuilt(c);
    setBuildId((n) => n + 1);
    setSelItem(null);
    setSelRoom(null);
    setTab("rum");
    setOpen(false);
  }, []);
  const restart = () => {
    setCfg(START);
    setBuilt(null);
    setSelItem(null);
    setSelRoom(null);
    setOpen(true);
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
    setTab("inredning");
    requestAnimationFrame(() => listRef.current?.querySelector(`[data-li="${selItem}"]`)?.scrollIntoView({ block: "nearest", behavior: "smooth" }));
  }, [selItem]);

  return (
    <div className="app">
      <header className="topbar">
        <Mark />
        <div className="brand">
          <h1>Drömkontoret</h1>
          <p>Bygg företaget – och se vart pengarna tar vägen.</p>
        </div>
        <AppSwitch />
        <span className="ver" title="Version">v {version}</span>
      </header>

      <div className="body">
        <main className="stage">
          {plan && (
            <Scene
              plan={plan}
              palette={OFFICE_PALETTE[plan.config.style]}
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
          {plan && <StageActions onRestart={restart} onEdit={() => setOpen(true)} />}
          {plan && <div className="hint">Dra för att snurra · scrolla för att zooma · klicka på en möbel</div>}
        </main>

        <aside className="result">
          {plan && (
            <OfficeResult
              plan={plan}
              tab={tab}
              onTab={setTab}
              selItem={selItem}
              selRoom={selRoom}
              onSelectItem={setSelItem}
              onSelectRoom={setSelRoom}
              listRef={listRef}
            />
          )}
        </aside>

        <OfficeChooser cfg={cfg} open={open} canReturn={!!built} onChange={(patch) => setCfg({ ...cfg, ...patch })} onBuild={() => build(cfg)} onReturn={() => setOpen(false)} />
      </div>
    </div>
  );
}
