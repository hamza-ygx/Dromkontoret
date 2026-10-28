"use client";

import { kr } from "@/lib/home/price";
import { INDUSTRIES, STYLES } from "@/lib/office/catalog";
import type { OfficeCosts } from "@/lib/office/costs";
import type { OfficePlan, RevenueLevel } from "@/lib/office/types";
import { ItemList, RoomList, m2 } from "../designer/lists";
import { Kalkyl } from "./kalkyl";

export type OfficeTab = "kalkyl" | "rum" | "inredning";

export function OfficeResult({
  plan,
  costs,
  level,
  onLevel,
  onMachine,
  tab,
  onTab,
  selItem,
  selRoom,
  onSelectItem,
  onSelectRoom,
  listRef,
}: {
  plan: OfficePlan;
  costs: OfficeCosts;
  level: RevenueLevel;
  onLevel: (l: RevenueLevel) => void;
  onMachine: () => void;
  tab: OfficeTab;
  onTab: (t: OfficeTab) => void;
  selItem: string | null;
  selRoom: string | null;
  onSelectItem: (id: string | null) => void;
  onSelectRoom: (id: string | null) => void;
  listRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <>
      <div className="head">
        <small>
          {INDUSTRIES.find((i) => i.id === plan.config.industry)!.label} · {STYLES.find((s) => s.id === plan.config.style)!.label}
        </small>
        <h2>{plan.title}</h2>
      </div>
      <div className="price">
        <small>Kostnad per månad</small>
        <strong>{kr(costs.total)}</strong>
        <div className="facts">
          <span>
            <b>{m2(plan.floorArea)}</b>
            {plan.staff} {plan.staff === 1 ? "anställd" : "anställda"}
          </span>
          <span>
            <b>{plan.metric.value}</b>
            {plan.metric.label}
          </span>
          <span>
            <b>{Math.round(costs.breakEven / 1000).toLocaleString("sv-SE")} tkr</b>
            break-even/mån
          </span>
        </div>
      </div>

      <div className="tabs">
        <button className={tab === "kalkyl" ? "on" : ""} onClick={() => onTab("kalkyl")}>
          Kalkyl
        </button>
        <button className={tab === "rum" ? "on" : ""} onClick={() => onTab("rum")}>
          Rum <span>{plan.rooms.filter((r) => r.kind !== "hall").length}</span>
        </button>
        <button className={tab === "inredning" ? "on" : ""} onClick={() => onTab("inredning")}>
          Inredning <span>{plan.items.length}</span>
        </button>
      </div>

      <div className="list" ref={listRef}>
        {tab === "kalkyl" ? (
          <Kalkyl plan={plan} costs={costs} level={level} onLevel={onLevel} onMachine={onMachine} />
        ) : tab === "rum" ? (
          <RoomList
            rooms={plan.rooms}
            selected={selRoom}
            onSelect={(id) => {
              onSelectItem(null);
              onSelectRoom(id);
            }}
          />
        ) : (
          <ItemList items={plan.items} selected={selItem} onSelect={onSelectItem} />
        )}
      </div>
      {tab !== "kalkyl" && (
        <div className="total">
          <span>{plan.config.industry === "bygg" ? "Inredning, utrustning och bilar" : "Inredning och utrustning"}</span>
          <strong>ca {kr(costs.furnishing)}</strong>
        </div>
      )}
      <p className="fine">Exempelföretag med schablonvärden. Cirkapriser exkl. moms – inte rådgivning eller offert.</p>
    </>
  );
}
