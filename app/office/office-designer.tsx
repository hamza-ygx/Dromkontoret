"use client";

import { useCallback, useEffect, useState } from "react";
import { INDUSTRIES, staffFor } from "@/lib/office/catalog";
import { placeById, preposition } from "@/lib/home/places";
import type { OfficeConfig } from "@/lib/office/types";
import { Mark } from "../designer/designer";
import { StageActions } from "../designer/stage-actions";
import { AppSwitch } from "../switch";
import { OfficeChooser } from "./chooser";

const START: OfficeConfig = { industry: "konsult", size: "6-10", style: "skandi", area: "halmstad", addons: ["konferens"] };

export function OfficeDesigner({ version, visible }: { version: string; visible: boolean }) {
  const [cfg, setCfg] = useState<OfficeConfig>(START);
  const [built, setBuilt] = useState<OfficeConfig | null>(null);
  const [open, setOpen] = useState(true);

  const build = useCallback((c: OfficeConfig) => {
    setBuilt(c);
    setOpen(false);
  }, []);
  const restart = () => {
    setCfg(START);
    setBuilt(null);
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
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cfg, build, open, visible]);

  const title = built ? `${INDUSTRIES.find((i) => i.id === built.industry)!.company} ${preposition(placeById(built.area))} ${placeById(built.area).name}` : "";

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
          {built && (
            <>
              <StageActions onRestart={restart} onEdit={() => setOpen(true)} />
              <div className="pending">
                <b>{title}</b>
                <span>
                  {staffFor(built.size)} anställda · 3D-bygget kommer i fas 2
                </span>
              </div>
            </>
          )}
        </main>

        <aside className="result" />

        <OfficeChooser cfg={cfg} open={open} canReturn={!!built} onChange={(patch) => setCfg({ ...cfg, ...patch })} onBuild={() => build(cfg)} onReturn={() => setOpen(false)} />
      </div>
    </div>
  );
}
