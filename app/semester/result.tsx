"use client";

import { kr } from "@/lib/home/price";
import { TRIP_STYLES, budgetById, budgetText, destById } from "@/lib/semester/catalog";
import { partyText, standardLabel } from "@/lib/semester/trip";
import type { Standard, TripPlan } from "@/lib/semester/types";
import { ItemList, RoomList } from "../designer/lists";

export type TripTab = "kostnad" | "boende" | "spara";

const COLORS: Record<string, string> = { flyg: "var(--ink)", boende: "#2fa6c9", mat: "var(--gold)", aktiviteter: "#ff8a5c", transport: "#9fb3c8", skydd: "#c9ced6" };
const MONTHS = [3, 6, 12];

export function TripResult({
  plan,
  tab,
  onTab,
  onStandard,
  selItem,
  selRoom,
  onSelectItem,
  onSelectRoom,
  listRef,
}: {
  plan: TripPlan;
  tab: TripTab;
  onTab: (t: TripTab) => void;
  onStandard: (s: Standard) => void;
  selItem: string | null;
  selRoom: string | null;
  onSelectItem: (id: string | null) => void;
  onSelectRoom: (id: string | null) => void;
  listRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { config: cfg, trip } = plan;
  const cap = budgetById(cfg.budget).max;
  const left = cap - trip.total;
  const open = !Number.isFinite(cap);
  const people = cfg.party === "2+2" || cfg.party === "4" ? 4 : Number(cfg.party);
  return (
    <>
      <div className="head">
        <small>
          {TRIP_STYLES.find((s) => s.id === cfg.style)!.label} · {destById(cfg.dest).label}
        </small>
        <h2>{plan.title}</h2>
      </div>
      <div className="price">
        <small>Resans kostnad</small>
        <strong>{kr(trip.total)}</strong>
        <div className="budgetbar" aria-hidden>
          <i className={left < 0 ? "over" : ""} style={{ width: `${open ? 100 : Math.min(100, (trip.total / cap) * 100)}%` }} />
        </div>
        <div className="facts">
          <span>
            <b>{cfg.nights} nätter</b>
            {partyText(cfg)}
          </span>
          <span>
            <b>{kr(trip.total / people / cfg.nights)}</b>
            per person och dag
          </span>
          <span className={left < 0 ? "neg" : "pos"}>
            <b>{open ? "✓" : kr(Math.abs(left))}</b>
            {open ? "inom budget" : left < 0 ? "över budgettaket" : "kvar till budgettaket"}
          </span>
        </div>
      </div>

      <div className="stds" role="group" aria-label="Standard">
        {plan.options.map((o) => (
          <button key={o.standard} className={`${o.standard === trip.standard ? "on" : ""}${o.fits ? "" : " no"}`} onClick={() => onStandard(o.standard)}>
            {standardLabel(o.standard)}
            <small>
              {o.fits ? "✓ " : ""}
              {o.total >= 1e6 ? `${(o.total / 1e6).toFixed(1).replace(".", ",")} Mkr` : `${Math.round(o.total / 1000)} tkr`}
            </small>
          </button>
        ))}
      </div>

      <div className="tabs">
        <button className={tab === "kostnad" ? "on" : ""} onClick={() => onTab("kostnad")}>
          Kostnader
        </button>
        <button className={tab === "boende" ? "on" : ""} onClick={() => onTab("boende")}>
          Boendet <span>{plan.home.rooms.filter((r) => r.kind !== "hall").length}</span>
        </button>
        <button className={tab === "spara" ? "on" : ""} onClick={() => onTab("spara")}>
          Spara
        </button>
      </div>

      <div className="list" ref={listRef}>
        {tab === "kostnad" && (
          <div className="calc">
            <div className="bar3">
              {trip.lines.map((l) => (
                <i key={l.id} style={{ width: `${(l.amount / trip.total) * 100}%`, background: COLORS[l.id] }} />
              ))}
            </div>
            <dl className="rows">
              {trip.lines.map((l) => (
                <div key={l.id} className="r" style={{ "--d": COLORS[l.id] } as React.CSSProperties}>
                  <dt>
                    <i />
                    <span className="lt">
                      {l.label}
                      <small>{l.detail}</small>
                    </span>
                  </dt>
                  <dd>{kr(l.amount)}</dd>
                </div>
              ))}
              <dt className="sum">Totalt</dt>
              <dd className="sum">{kr(trip.total)}</dd>
              <dt>Din budget</dt>
              <dd>{budgetText(cfg.budget)}</dd>
              {!open && (
                <>
                  <dt className="sum">{left < 0 ? "Över budgettaket" : "Kvar till budgettaket"}</dt>
                  <dd className={`sum ${left < 0 ? "neg" : "pos"}`}>{kr(Math.abs(left))}</dd>
                </>
              )}
            </dl>
            {left < 0 && trip.standard === "budget" && <p className="req warn">Resan ryms inte i budgeten ens på budgetnivå – prova färre nätter, ett närmare resmål eller en större budget.</p>}
          </div>
        )}
        {tab === "boende" && (
          <>
            <RoomList
              rooms={plan.home.rooms}
              selected={selRoom}
              onSelect={(id) => {
                onSelectItem(null);
                onSelectRoom(id);
              }}
            />
            <ItemList items={plan.home.items} selected={selItem} onSelect={onSelectItem} />
          </>
        )}
        {tab === "spara" && (
          <div className="save">
            <p>Så mycket behöver ni lägga undan för att resan ska vara betald innan ni åker:</p>
            <ul>
              {MONTHS.map((m) => (
                <li key={m}>
                  <span>
                    Om {m} månader
                    <small>{kr(trip.total / (m * 4.33))} per vecka</small>
                  </span>
                  <b>
                    {kr(Math.ceil(trip.total / m / 100) * 100)}
                    <small>per månad</small>
                  </b>
                </li>
              ))}
            </ul>
            <p className="tip">Tips: ett separat sparkonto för resan gör det lättare att hålla budgeten – och pengarna gör ingen annan nytta under tiden på lönekontot.</p>
          </div>
        )}
      </div>
      <p className="fine">Exempelresa med schablonpriser för 2026 – inte en offert. Priserna varierar med säsong och hur tidigt ni bokar.</p>
    </>
  );
}
