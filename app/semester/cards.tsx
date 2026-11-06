"use client";

import { useEffect } from "react";
import type { TripCard } from "@/lib/semester/cards";
import PHOTOS from "@/lib/semester/photos.json";

type Credit = { author: string; license: string; src: string };
const credit = (id: string) => (PHOTOS as Record<string, Credit>)[id];

export function Photo({ id, alt, eager }: { id: string; alt: string; eager?: boolean }) {
  if (!credit(id)) return <span className="ph-missing" aria-hidden />;
  return <img src={`/photos/${id}.webp`} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" draggable={false} />;
}

const SLOTS: [number, number][] = [
  [-0.33, -0.25],
  [0.33, -0.25],
  [-0.36, 0.04],
  [0.36, 0.04],
  [-0.2, 0.29],
  [0.2, 0.29],
];

export function CardFan({ cards, place, onOpen }: { cards: TripCard[]; place: string; onOpen: (id: string) => void }) {
  return (
    <>
      <div className="tpin" aria-hidden>
        <i />
        <b>{place}</b>
      </div>
      <div className="tcards">
        {cards.slice(0, SLOTS.length).map((c, i) => (
          <button
            key={c.id}
            className={`tcard ${c.kind}`}
            style={{ "--x": SLOTS[i][0], "--y": SLOTS[i][1], animationDelay: `${0.08 * i}s` } as React.CSSProperties}
            onClick={() => onOpen(c.id)}
          >
            <Photo id={c.id} alt={c.name} />
            <span className="tc-body">
              {c.kind !== "sight" && <em>{c.kind === "jet" ? "Resan" : "Ert boende"}</em>}
              <b>{c.name}</b>
              <small>{c.price}</small>
            </span>
          </button>
        ))}
      </div>
    </>
  );
}

export function Lightbox({ card, onClose }: { card: TripCard; onClose: () => void }) {
  const c = credit(card.id);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="tlight" onClick={onClose}>
      <figure onClick={(e) => e.stopPropagation()}>
        <button className="x" onClick={onClose} aria-label="Stäng">
          ×
        </button>
        <Photo id={card.id} alt={card.name} eager />
        <figcaption>
          <div>
            <b>{card.name}</b>
            <p>{card.line}</p>
          </div>
          <strong>{card.price}</strong>
          {c && (
            <small>
              Foto: {c.author} · {c.license} · {c.src.includes("flickr") ? "Flickr" : "Wikimedia Commons"}
            </small>
          )}
        </figcaption>
      </figure>
    </div>
  );
}
