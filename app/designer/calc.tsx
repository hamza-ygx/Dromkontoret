"use client";

import { kr, monthly } from "@/lib/home/price";

export interface CalcState {
  down: number;
  rate: number;
  amort: number;
}

export const CALC_START: CalcState = { down: 15, rate: 3.2, amort: 2 };

const pc = (v: number, d: number) => `${v.toFixed(d).replace(".", ",")} %`;

function Slider({ label, value, shown, min, max, step, onChange }: { label: string; value: number; shown: string; min: number; max: number; step: number; onChange: (v: number) => void }) {
  return (
    <label className="sl">
      <span>
        {label} <b>{shown}</b>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} style={{ "--p": `${((value - min) / (max - min)) * 100}%` } as React.CSSProperties} onChange={(e) => onChange(+e.target.value)} />
    </label>
  );
}

export function Calc({ price, fee, feeLabel, state, onChange }: { price: number; fee: number; feeLabel: string; state: CalcState; onChange: (s: CalcState) => void }) {
  const m = monthly(price, fee, state.down, state.rate, state.amort);
  const parts = [
    { label: "Räntekostnad", v: m.interest, c: "var(--ink)" },
    { label: "Amortering", v: m.amortization, c: "var(--gold)" },
    { label: feeLabel, v: m.fee, c: "#9fb3c8" },
  ];
  return (
    <div className="calc">
      <div className="ch">
        <div>
          <h3>Månadskostnad</h3>
          <p>Beräknat på uppskattat pris</p>
        </div>
        <div className="tot">
          <b>{kr(m.total)}</b>per månad
        </div>
      </div>
      <div className="bar3">
        {parts.map((p) => (
          <i key={p.label} style={{ width: `${(p.v / m.total) * 100}%`, background: p.c }} />
        ))}
      </div>
      <Slider label="Kontantinsats" value={state.down} shown={`${state.down} % · ${kr(m.down)}`} min={15} max={50} step={1} onChange={(down) => onChange({ ...state, down })} />
      <Slider label="Ränta" value={state.rate} shown={pc(state.rate, 2)} min={1} max={7} step={0.05} onChange={(rate) => onChange({ ...state, rate })} />
      <Slider label="Amortering" value={state.amort} shown={`${pc(state.amort, 1)} per år`} min={0} max={3} step={0.5} onChange={(amort) => onChange({ ...state, amort })} />
      <p className={`req${state.amort < m.required ? " warn" : ""}`}>
        Amorteringskrav vid {m.ltv} % belåning: {m.required} % per år{state.amort < m.required ? " – under kravet" : ""}
      </p>
      <dl className="rows">
        <dt>Bolån</dt>
        <dd>{kr(m.loan)}</dd>
        {parts.map((p) => (
          <div key={p.label} className="r" style={{ "--d": p.c } as React.CSSProperties}>
            <dt>
              <i />
              {p.label}
            </dt>
            <dd>{kr(p.v)}</dd>
          </div>
        ))}
        <dt className="sum">Totalt per månad</dt>
        <dd className="sum">{kr(m.total)}</dd>
      </dl>
    </div>
  );
}
