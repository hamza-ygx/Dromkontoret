"use client";

import { kr } from "@/lib/home/price";
import { LEVELS, outcome, pct as pc, revenueFor, type OfficeCosts } from "@/lib/office/costs";
import { PAY } from "@/lib/office/rates";
import type { OfficePlan, RevenueLevel } from "@/lib/office/types";

export const mkr = (v: number) => (v >= 1e6 ? `${(v / 1e6).toFixed(1).replace(".", ",")} Mkr` : `${Math.round(v / 1000)} tkr`);
const n = (v: number) => Math.round(v).toLocaleString("sv-SE");

export const COST_COLORS = {
  rent: "#9fb3c8",
  personnel: "var(--ink)",
  depreciation: "var(--gold)",
  other: "#c9ced6",
};

export function Levels({ level, onLevel, plan }: { level: RevenueLevel; onLevel: (l: RevenueLevel) => void; plan?: OfficePlan }) {
  return (
    <div className="levels" role="group" aria-label="Omsättning">
      {LEVELS.map((l) => (
        <button key={l.id} className={level === l.id ? "on" : ""} onClick={() => onLevel(l.id)}>
          {l.label}
          {plan && <small>{mkr(revenueFor(plan, l.id) * 12)}/år</small>}
        </button>
      ))}
    </div>
  );
}

export function Kalkyl({ plan, costs: c, level, onLevel, onMachine }: { plan: OfficePlan; costs: OfficeCosts; level: RevenueLevel; onLevel: (l: RevenueLevel) => void; onMachine: () => void }) {
  const o = outcome(plan, c, level);
  const parts = [
    { label: "Lokalhyra", v: c.rent, c: COST_COLORS.rent },
    { label: "Personalkostnad", v: c.personnel, c: COST_COLORS.personnel },
    { label: "Avskrivning inredning", v: c.depreciation, c: COST_COLORS.depreciation },
    { label: "Övriga kostnader", v: c.other, c: COST_COLORS.other },
  ];
  return (
    <div className="calc kalkyl">
      <div className="ch">
        <div>
          <h3>Kostnad per månad</h3>
          <p>Fasta kostnader, exkl. moms</p>
        </div>
        <div className="tot">
          <b>{kr(c.total)}</b>per månad
        </div>
      </div>
      <div className="bar3">
        {parts.map((p) => (
          <i key={p.label} style={{ width: `${(p.v / c.total) * 100}%`, background: p.c }} />
        ))}
      </div>
      <dl className="rows">
        <div className="r" style={{ "--d": COST_COLORS.rent } as React.CSSProperties}>
          <dt>
            <i />
            Lokalhyra
          </dt>
          <dd>{kr(c.rent)}</dd>
        </div>
        <dt className="sub">
          {c.area} m² à {n(c.rentPerM2)} kr/m²/år
        </dt>
        <dd className="sub" />
        <div className="r" style={{ "--d": COST_COLORS.personnel } as React.CSSProperties}>
          <dt>
            <i />
            Personalkostnad
          </dt>
          <dd>{kr(c.personnel)}</dd>
        </div>
        <dt className="sub">
          Löner, {plan.staff} × {n(c.salary)} kr
        </dt>
        <dd className="sub">{kr(c.wages)}</dd>
        <dt className="sub">Arbetsgivaravgifter {pc(PAY.employerFee)}</dt>
        <dd className="sub">{kr(c.employerFees)}</dd>
        <dt className="sub">Pension, semestertillägg, försäkring</dt>
        <dd className="sub">{kr(c.pension)}</dd>
        <div className="r" style={{ "--d": COST_COLORS.depreciation } as React.CSSProperties}>
          <dt>
            <i />
            Avskrivning inredning
          </dt>
          <dd>{kr(c.depreciation)}</dd>
        </div>
        <dt className="sub">
          {kr(c.furnishing)} över {PAY.depreciationYears} år
        </dt>
        <dd className="sub" />
        <div className="r" style={{ "--d": COST_COLORS.other } as React.CSSProperties}>
          <dt>
            <i />
            Övriga kostnader
          </dt>
          <dd>{kr(c.other)}</dd>
        </div>
        <dt className="sub">IT, försäkring, el, marknadsföring, redovisning</dt>
        <dd className="sub" />
        <dt className="sum">Totalt per månad</dt>
        <dd className="sum">{kr(c.total)}</dd>
      </dl>

      <div className="be">
        <span>
          Break-even
          <small>{c.goodsShare ? `omsättning som täcker kostnaderna och varuinköp (${pc(c.goodsShare)})` : "omsättning som täcker kostnaderna"}</small>
        </span>
        <b>
          {kr(c.breakEven)}
          <small>per månad</small>
        </b>
      </div>

      <div className="pl">
        <h4>Om omsättningen är …</h4>
        <Levels level={level} onLevel={onLevel} plan={plan} />
        <dl className="rows">
          <dt>Omsättning</dt>
          <dd>{kr(o.revenue)}</dd>
          {o.goods > 0 && (
            <>
              <dt>Varuinköp och material</dt>
              <dd>−{kr(o.goods)}</dd>
            </>
          )}
          <dt>Kostnader</dt>
          <dd>−{kr(c.total)}</dd>
          <dt>Bolagsskatt {pc(PAY.corporateTax)}</dt>
          <dd>{o.tax ? `−${kr(o.tax)}` : "0 kr"}</dd>
          <dt className="sum">{o.kept >= 0 ? "Kvar i bolaget" : "Förlust"}</dt>
          <dd className={`sum${o.kept < 0 ? " neg" : ""}`}>{kr(o.kept)}</dd>
        </dl>
        <button className="machine-btn" onClick={onMachine}>
          <Coin />
          Vart tar pengarna vägen?
        </button>
      </div>
    </div>
  );
}

export function Coin() {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden>
      <circle cx="10" cy="10" r="8" fill="var(--gold-hi)" stroke="var(--gold-ink)" strokeWidth="1.4" />
      <text x="10" y="13.6" textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--gold-ink)">
        kr
      </text>
    </svg>
  );
}
