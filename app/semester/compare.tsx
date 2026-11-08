"use client";

import { geoDistance, geoInterpolate } from "d3-geo";
import { useEffect, useRef } from "react";
import { kr } from "@/lib/home/price";
import { budgetById, originById, styleById } from "@/lib/semester/catalog";
import { spotFor } from "@/lib/semester/cards";
import { partyText, people, standardLabel } from "@/lib/semester/trip";
import type { TripPlan } from "@/lib/semester/types";
import { Photo } from "./cards";
import { fitCanvas, paintBase, paintDot, paintRoute, projection, type LonLat } from "./globe-paint";

const COLORS = ["#c8a45c", "#2c4a6e"];

function CompareGlobe({ plans }: { plans: TripPlan[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current!;
    const wrap = wrapRef.current!;
    const ctx = canvas.getContext("2d")!;
    const trips = plans.map((p) => {
      const o = originById(p.config.from);
      const s = spotFor(p);
      return { from: [o.lon, o.lat] as LonLat, to: [s.lon, s.lat] as LonLat, fromLabel: o.label, toLabel: p.place };
    });
    const pts = trips.flatMap((t) => [t.from, t.to]);
    const center = geoInterpolate(geoInterpolate(trips[0].to, trips[1].to)(0.5), trips[0].from)(0.35);
    const reach = Math.max(...pts.map((p) => geoDistance(p, center)));
    const draw = () => {
      const { w, h } = fitCanvas(canvas, wrap);
      if (!w || !h) return;
      const base = Math.min(w, h) * 0.45;
      const fitScale = (Math.min(w, h) * 0.42) / Math.max(0.12, Math.sin(Math.min(reach + 0.08, Math.PI / 2)));
      const proj = projection(center, Math.max(base, fitScale), w / 2, h / 2);
      const path = paintBase(ctx, proj, w, h, base, { sun: [center[0], -15] });
      trips.forEach((t, i) => {
        const route = geoInterpolate(t.from, t.to);
        paintRoute(ctx, path, route, 1, 1, COLORS[i]);
        paintDot(ctx, proj, center, t.to, COLORS[i], `${i + 1}. ${t.toLabel}`, true);
      });
      trips.forEach((t) => paintDot(ctx, proj, center, t.from, "#14213a", t.fromLabel, false));
    };
    const ro = new ResizeObserver(draw);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [plans]);
  return (
    <div className="cmp-globe" ref={wrapRef}>
      <canvas ref={canvasRef} aria-hidden />
    </div>
  );
}

export function Compare({ plans, onPick, onClose }: { plans: [TripPlan, TripPlan]; onPick: (i: 0 | 1) => void; onClose: () => void }) {
  const left = plans.map((p) => budgetById(p.config.budget).max - p.trip.total);
  const cheaper = plans[0].trip.total <= plans[1].trip.total ? 0 : 1;
  const perDay = plans.map((p) => p.trip.total / people(p.config) / p.config.nights);
  const cheaperDay = perDay[0] <= perDay[1] ? 0 : 1;
  const line = (p: TripPlan, id: string) => p.trip.lines.find((l) => l.id === id)?.amount ?? 0;
  return (
    <div className="cmp">
      <div className="cmp-head">
        <button className="act" onClick={onClose}>
          Avsluta jämförelse
        </button>
        <h3>Två drömresor sida vid sida</h3>
      </div>
      <CompareGlobe plans={plans} />
      <div className="cmp-cols">
        {plans.map((p, i) => (
          <section key={i} className="cmp-col" style={{ "--c": COLORS[i] } as React.CSSProperties}>
            <div className="cmp-photo">
              <Photo id={`hero-${p.config.dest}-${p.slot}`} alt={p.place} />
              <span>{i + 1}</span>
            </div>
            <small>
              {styleById(p.config.style).label} · {standardLabel(p.trip.standard)}
            </small>
            <h4>{p.title}</h4>
            <p className="cmp-meta">
              {partyText(p.config)} · {p.config.nights} nätter · från {originById(p.config.from).label}
            </p>
            <strong>{kr(p.trip.total)}</strong>
            <ul>
              <li className={cheaperDay === i ? "win" : ""}>
                <span>Per person och dag</span>
                <b>{kr(perDay[i])}</b>
              </li>
              <li>
                <span>Resa</span>
                <b>{kr(line(p, "flyg"))}</b>
              </li>
              <li>
                <span>Boende</span>
                <b>{kr(line(p, "boende"))}</b>
              </li>
              <li>
                <span>Mat och upplevelser</span>
                <b>{kr(line(p, "mat") + line(p, "aktiviteter"))}</b>
              </li>
              <li className={left[i] < 0 ? "neg" : "pos"}>
                <span>{Number.isFinite(left[i]) ? (left[i] < 0 ? "Över budgettaket" : "Kvar till budgettaket") : "Budget"}</span>
                <b>{Number.isFinite(left[i]) ? kr(Math.abs(left[i])) : "inom budget"}</b>
              </li>
            </ul>
            {cheaper === i && <em className="cmp-tag">Billigast</em>}
            <button className="build" onClick={() => onPick(i as 0 | 1)}>
              Välj resa {i + 1}
            </button>
          </section>
        ))}
      </div>
    </div>
  );
}
