import { useMemo } from "react";
import type { Item, Room } from "@/lib/home/types";

export const m2 = (v: number) => `${v.toFixed(1).replace(".", ",").replace(",0", "")} m²`;

export function RoomList({ rooms, selected, onSelect }: { rooms: Room<string>[]; selected: string | null; onSelect: (id: string | null) => void }) {
  return (
    <ul className="rooms">
      {rooms
        .filter((r) => r.kind !== "hall")
        .map((r) => (
          <li key={r.id}>
            <button className={selected === r.id ? "on" : ""} onClick={() => onSelect(selected === r.id ? null : r.id)}>
              <span>{r.name}</span>
              <em>
                {r.w.toFixed(1).replace(".", ",")} × {r.d.toFixed(1).replace(".", ",")} m
              </em>
              <b>{m2(r.w * r.d)}</b>
            </button>
          </li>
        ))}
    </ul>
  );
}

export function ItemList({ items, selected, onSelect }: { items: Item[]; selected: string | null; onSelect: (id: string | null) => void }) {
  const groups = useMemo(() => {
    const g = new Map<string, Item[]>();
    for (const it of items) {
      if (!g.has(it.room)) g.set(it.room, []);
      g.get(it.room)!.push(it);
    }
    return [...g.entries()];
  }, [items]);
  return groups.map(([room, list]) => (
    <div key={room} className="grp">
      <h3>{room}</h3>
      <ul>
        {list.map((it) => (
          <li key={it.id} data-li={it.id}>
            <button className={selected === it.id ? "on" : ""} onClick={() => onSelect(selected === it.id ? null : it.id)}>
              <span>
                <b>{it.label.name}</b>
                <em>
                  {it.label.store}
                  {it.label.size !== "–" ? ` · ${it.label.size}` : ""}
                </em>
              </span>
              <strong>{it.label.price ? `ca ${it.label.price.toLocaleString("sv-SE")} kr` : "Ingår"}</strong>
            </button>
          </li>
        ))}
      </ul>
    </div>
  ));
}
