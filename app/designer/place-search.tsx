"use client";

import { useMemo, useRef, useState } from "react";
import { perM2, placeById, preposition, searchPlaces, type Place } from "@/lib/home/places";
import type { HomeType } from "@/lib/home/types";

const KIND: Record<HomeType, string> = { lagenhet: "bostadsrätt", radhus: "radhus", villa: "villa", stuga: "fritidshus" };

export interface PlaceFormat {
  hit: (p: Place) => string;
  info: (p: Place) => React.ReactNode;
}

const homeFormat = (type: HomeType): PlaceFormat => ({
  hit: (p) => `${Math.round(perM2(type, p) / 1000)} tkr/m²`,
  info: (p) => (
    <>
      Cirka <b>{Math.round(perM2(type, p) / 1000)} tkr/m²</b> för {KIND[type]} {preposition(p)} {p.name}
    </>
  ),
});

type Props = { value: string; onChange: (id: string) => void } & ({ type: HomeType } | { format: PlaceFormat });

export function PlaceSearch(props: Props) {
  const { value, onChange } = props;
  const fmt = "format" in props ? props.format : homeFormat(props.type);
  const selected = placeById(value);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const hits = useMemo(() => searchPlaces(query), [query]);

  const pick = (id: string) => {
    onChange(id);
    setOpen(false);
    setQuery("");
    input.current?.blur();
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => (hits.length ? (i + (e.key === "ArrowDown" ? 1 : -1) + hits.length) % hits.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (open && hits[active]) pick(hits[active].id);
    } else if (e.key === "Escape") {
      e.stopPropagation();
      setOpen(false);
      setQuery("");
      input.current?.blur();
    }
  };

  return (
    <div className={`place${open ? " open" : ""}`}>
      <div className="field">
        <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden>
          <circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="m13 13 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <input
          ref={input}
          role="combobox"
          aria-expanded={open}
          aria-controls="place-list"
          aria-activedescendant={open && hits[active] ? `pl-${hits[active].id}` : undefined}
          aria-label="Sök kommun"
          placeholder={open ? `Sök bland 290 kommuner…` : selected.name}
          value={open ? query : selected.name}
          onFocus={() => {
            setOpen(true);
            setQuery("");
            setActive(0);
          }}
          onBlur={() => setOpen(false)}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onKeyDown={onKey}
          autoComplete="off"
          spellCheck={false}
        />
        {!open && <span className="lan">{selected.lan}</span>}
      </div>
      <p className="placeinfo">{fmt.info(selected)}</p>
      {open && (
        <ul className="hits" id="place-list" role="listbox">
          {!query && <li className="cap">Populära</li>}
          {hits.length === 0 && <li className="none">Hittade ingen kommun som matchar ”{query}”</li>}
          {hits.map((p, i) => (
            <li
              key={p.id}
              id={`pl-${p.id}`}
              role="option"
              aria-selected={i === active}
              className={`${i === active ? "act" : ""}${p.id === value ? " cur" : ""}`}
              onMouseDown={(e) => {
                e.preventDefault();
                pick(p.id);
              }}
              onMouseEnter={() => setActive(i)}
            >
              <span>
                <b>{p.name}</b>
                <em>{p.lan}</em>
              </span>
              <small>{fmt.hit(p)}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
