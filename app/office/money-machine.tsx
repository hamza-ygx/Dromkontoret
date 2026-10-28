"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Box } from "@/lib/home/types";
import { kr } from "@/lib/home/price";
import type { OfficeCosts } from "@/lib/office/costs";
import { flows, type FlowId } from "@/lib/office/flows";
import type { OfficePlan, RevenueLevel } from "@/lib/office/types";
import { BoxEl, M } from "../designer/scene";
import { Levels, mkr } from "./kalkyl";

const GAP = 2.6;
const TANK_Y = 3.4;
const HOPPER_Y = -3.4;
const PIPE_Z = 2.75;
const PIPE_H = 0.45;
const TANK_H = 2.5;
const RX = 58;
const RZ = -12;
const STEEL = "#b4bcc8";
const LOOP = 5.6;

const pxm = (m: number) => `${(m * M).toFixed(1)}px`;
const pipeW = (per100: number) => Math.min(0.75, 0.16 + Math.abs(per100) * 0.013);
const fillH = (per100: number) => Math.max(0.06, Math.min(TANK_H - 0.15, Math.abs(per100) * 0.045));

export function MoneyMachine({
  plan,
  costs,
  level,
  onLevel,
  onClose,
}: {
  plan: OfficePlan;
  costs: OfficeCosts;
  level: RevenueLevel;
  onLevel: (l: RevenueLevel) => void;
  onClose: () => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState(1);
  const [sel, setSel] = useState<FlowId | null>(null);
  const { list, revenue, loss } = useMemo(() => flows(plan, costs, level), [plan, costs, level]);
  const N = list.length;
  const xs = list.map((_, i) => (i - (N - 1) / 2) * GAP);
  const selected = list.find((f) => f.id === sel);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const { width, height } = el.getBoundingClientRect();
      const w = ((N - 1) * GAP + 3.4) * M;
      const h = (9.6 * Math.cos((RX * Math.PI) / 180) + 5.6 * Math.sin((RX * Math.PI) / 180)) * M;
      setFit(Math.max(0.3, Math.min(1.1, (width * 0.76) / w, (height * 0.62) / h)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [N]);

  const frame = useMemo(() => {
    const half = ((N - 1) * GAP) / 2;
    const b: Box[] = [
      { x: -half - 1.7, y: HOPPER_Y - 1.4, z: -0.3, w: 2 * half + 3.4, d: TANK_Y - HOPPER_Y + 2.6, h: 0.3, color: "#e3e7ed" },
      { x: -0.18, y: HOPPER_Y - 0.18, z: 0, w: 0.36, d: 0.36, h: PIPE_Z, color: STEEL },
      { x: -0.3, y: HOPPER_Y - 0.3, z: PIPE_Z, w: 0.6, d: 0.6, h: 0.9, color: STEEL },
      { x: -0.3, y: HOPPER_Y, z: PIPE_Z, w: 0.6, d: -HOPPER_Y, h: PIPE_H, color: STEEL },
      { x: -half - 0.35, y: -0.3, z: PIPE_Z, w: 2 * half + 0.7, d: 0.6, h: PIPE_H, color: STEEL },
      { x: -half - 0.15, y: -0.15, z: 0, w: 0.3, d: 0.3, h: PIPE_Z, color: STEEL },
      { x: half - 0.15, y: -0.15, z: 0, w: 0.3, d: 0.3, h: PIPE_Z, color: STEEL },
    ];
    const hopper: Box[] = [
      { x: -1, y: HOPPER_Y - 1, z: PIPE_Z + 0.9, w: 2, d: 2, h: 0.25, color: "#a5822f" },
      { x: -1.1, y: HOPPER_Y - 1.1, z: PIPE_Z + 1.15, w: 2.2, d: 2.2, h: 0.75, color: "#c8a45c" },
    ];
    return { b, hopper };
  }, [N]);

  const coins = useMemo(() => {
    const out: { key: string; x: number; z: number; color: string }[] = [];
    list.forEach((f, i) => {
      if (f.per100 <= 0) return;
      const count = Math.max(1, Math.round(f.per100 / 5));
      for (let k = 0; k < count; k++) out.push({ key: `${f.id}${k}`, x: xs[i], z: fillH(f.per100) + 0.05, color: f.color });
    });
    const sorted = out.map((c, i) => ({ c, r: (i * 0.618034) % 1 })).sort((a, b) => a.r - b.r).map((e) => e.c);
    return sorted.map((c, i) => ({ ...c, delay: -(i / sorted.length) * LOOP }));
  }, [list, xs]);

  const pick = (e: React.MouseEvent) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>("[data-flow]");
    setSel(el ? (el.dataset.flow as FlowId) : null);
  };

  return (
    <div className={`mm${sel ? " sel" : ""}`} onClick={pick}>
      <div className="mm-head">
        <button className="act" onClick={onClose}>
          <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden>
            <path d="M12.5 4 6.5 10l6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Tillbaka till kontoret
        </button>
        <div className="mm-title">
          <h3>Vart tar pengarna vägen?</h3>
          <p>
            Så fördelas varje 100-lapp i omsättning · {mkr(revenue * 12)} per år
          </p>
        </div>
        <Levels level={level} onLevel={onLevel} />
      </div>

      <div className="mm-stage" ref={stageRef}>
        <div className="mm-world" style={{ transform: `scale3d(${fit},${fit},${fit}) rotateX(${RX}deg) rotateZ(${RZ}deg)` }}>
          <div className="mm-plan" key={`${level}-${N}`}>
            {frame.b.map((b, i) => (
              <div key={`f${i}`} className="mm-grow">
                <BoxEl b={b} delay={0.05 * i} />
              </div>
            ))}
            {frame.hopper.map((b, i) => (
              <div key={`h${i}`} className="mm-grow">
                <BoxEl b={b} delay={0.3 + 0.08 * i} />
              </div>
            ))}
            <Billboard fit={fit} x={0} y={HOPPER_Y} z={PIPE_Z + 2.2} className="mm-in">
              <b>100 kr</b>
              <span>in i kassan</span>
            </Billboard>
            {list.map((f, i) => {
              const w = pipeW(f.per100), x = xs[i], on = sel === f.id;
              const parts: Box[] = [
                { x: x - w / 2, y: 0.3, z: PIPE_Z + PIPE_H - w, w, d: TANK_Y - 0.3, h: w, color: f.color },
                { x: x - w / 2, y: TANK_Y - w / 2, z: TANK_H, w, d: w, h: PIPE_Z + PIPE_H - TANK_H - w, color: f.color },
              ];
              return (
                <div key={f.id} className={`mm-flow${on ? " on" : ""}${f.per100 < 0 ? " neg" : ""}`} data-flow={f.id}>
                  {parts.map((b, j) => (
                    <div key={j} className="mm-grow">
                      <BoxEl b={b} delay={0.6 + i * 0.07 + j * 0.1} />
                    </div>
                  ))}
                  <div className="mm-grow">
                    <BoxEl b={{ x: x - 0.85, y: TANK_Y - 0.85, z: 0, w: 1.7, d: 1.7, h: 0.12, color: "#c9cfd8", round: true }} delay={0.4 + i * 0.05} />
                  </div>
                  <div className="mm-rise">
                    <BoxEl b={{ x: x - 0.62, y: TANK_Y - 0.62, z: 0.12, w: 1.24, d: 1.24, h: fillH(f.per100), color: f.color, round: true }} delay={1.1 + i * 0.07} />
                  </div>
                  <div className="mm-grow">
                    <BoxEl b={{ x: x - 0.75, y: TANK_Y - 0.75, z: 0.12, w: 1.5, d: 1.5, h: TANK_H - 0.12, color: "#bcd7e6", glass: true, round: true }} delay={0.5 + i * 0.05} />
                  </div>
                  <Billboard fit={fit} x={x} y={TANK_Y} z={TANK_H + 2.1} className={`mm-amt${on ? " on" : ""}`} flow={f.id}>
                    <b>{f.per100 < 0 ? `−${-f.per100}` : f.per100} kr</b>
                  </Billboard>
                </div>
              );
            })}
            <div className="mm-coins">
              {coins.map((c) => (
                <i
                  key={c.key}
                  className="coin"
                  style={{ "--x": pxm(c.x), "--hy": pxm(HOPPER_Y), "--ty": pxm(TANK_Y), "--pz": pxm(PIPE_Z + PIPE_H + 0.22), "--sz": pxm(PIPE_Z + 2.05), "--fz": pxm(c.z), animationDelay: `${c.delay.toFixed(2)}s`, borderColor: c.color } as React.CSSProperties}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mm-foot">
        {selected ? (
          <div className="mm-info" key={selected.id}>
            <i style={{ background: selected.color }} />
            <div>
              <b>
                {selected.label} · {selected.per100 < 0 ? `−${-selected.per100}` : selected.per100} kr av 100
                <span>{kr(Math.abs(selected.month))} per månad</span>
              </b>
              <p>{selected.text}</p>
            </div>
          </div>
        ) : (
          <p className="mm-hint">{loss ? "Intäkterna räcker inte till alla kostnader – klicka på ett rör för att se varför." : "Klicka på ett rör eller en tank för att se vad pengarna går till."}</p>
        )}
        <ul className="mm-legend">
          {list.map((f) => (
            <li key={f.id}>
              <button className={sel === f.id ? "on" : ""} data-flow={f.id}>
                <i style={{ background: f.color }} />
                {f.label}
                <b>{f.per100 < 0 ? `−${-f.per100}` : f.per100} kr</b>
              </button>
            </li>
          ))}
        </ul>
        <p className="fine">Illustrativt exempelföretag med schablonvärden för branschen – inte rådgivning.</p>
      </div>
    </div>
  );
}

function Billboard({ x, y, z, fit, className, flow, children }: { x: number; y: number; z: number; fit: number; className: string; flow?: FlowId; children: React.ReactNode }) {
  const k = Math.max(1, 0.72 / fit).toFixed(2);
  return (
    <div className={`mm-lbl ${className}`} data-flow={flow} style={{ left: pxm(x), top: pxm(y), transform: `translateZ(${pxm(z)}) rotateZ(${-RZ}deg) rotateX(${-RX}deg) scale(${k}) translate(-50%, -100%)`, transformOrigin: "0 0" }}>
      {children}
    </div>
  );
}
