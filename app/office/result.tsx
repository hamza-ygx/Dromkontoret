"use client";

import { kr } from "@/lib/home/price";
import { INDUSTRIES, STYLES } from "@/lib/office/catalog";
import type { OfficePlan } from "@/lib/office/types";
import { ItemList, RoomList, m2 } from "../designer/lists";

export type OfficeTab = "rum" | "inredning";

export function OfficeResult({
  plan,
  tab,
  onTab,
  selItem,
  selRoom,
  onSelectItem,
  onSelectRoom,
  listRef,
}: {
  plan: OfficePlan;
  tab: OfficeTab;
  onTab: (t: OfficeTab) => void;
  selItem: string | null;
  selRoom: string | null;
  onSelectItem: (id: string | null) => void;
  onSelectRoom: (id: string | null) => void;
  listRef: React.RefObject<HTMLDivElement | null>;
}) {
  const furniture = plan.items.reduce((a, i) => a + i.label.price, 0);
  const restaurant = plan.config.industry === "restaurang";
  return (
    <>
      <div className="head">
        <small>
          {INDUSTRIES.find((i) => i.id === plan.config.industry)!.label} · {STYLES.find((s) => s.id === plan.config.style)!.label}
        </small>
        <h2>{plan.title}</h2>
      </div>
      <div className="price">
        <small>Lokalens yta</small>
        <strong>{m2(plan.floorArea)}</strong>
        <div className="facts">
          <span>
            <b>{plan.staff}</b>
            {plan.staff === 1 ? "anställd" : "anställda"}
          </span>
          <span>
            <b>{restaurant ? plan.seats : plan.items.filter((i) => i.label.name.startsWith("Arbetsplats")).length}</b>
            {restaurant ? "sittplatser" : plan.staff === 1 ? "arbetsplats" : "arbetsplatser"}
          </span>
          <span>
            <b>{Math.round(plan.floorArea / plan.staff)} m²</b>per anställd
          </span>
        </div>
      </div>

      <div className="tabs">
        <button className={tab === "rum" ? "on" : ""} onClick={() => onTab("rum")}>
          Rum <span>{plan.rooms.filter((r) => r.kind !== "hall").length}</span>
        </button>
        <button className={tab === "inredning" ? "on" : ""} onClick={() => onTab("inredning")}>
          Inredning <span>{plan.items.length}</span>
        </button>
      </div>

      <div className="list" ref={listRef}>
        {tab === "rum" ? (
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
      <div className="total">
        <span>Inredning och utrustning</span>
        <strong>ca {kr(furniture)}</strong>
      </div>
      <p className="fine">Exempelföretag. Cirkapriser exkl. moms – inte rådgivning eller offert.</p>
    </>
  );
}
