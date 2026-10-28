import { placeById, preposition } from "../home/places";
import { outcome, pct, type OfficeCosts } from "./costs";
import { PAY } from "./rates";
import type { OfficePlan, RevenueLevel } from "./types";

export type FlowId = "hyra" | "loner" | "avgifter" | "varor" | "inredning" | "ovrigt" | "skatt" | "kvar";

export interface Flow {
  id: FlowId;
  label: string;
  per100: number;
  month: number;
  color: string;
  text: string;
}

const n = (v: number) => Math.round(v).toLocaleString("sv-SE");

function whole(values: number[], total: number) {
  const floors = values.map(Math.floor);
  let left = total - floors.reduce((a, b) => a + b, 0);
  const order = values.map((v, i) => [v - Math.floor(v), i] as const).sort((a, b) => b[0] - a[0]);
  for (const [, i] of order) {
    if (left <= 0) break;
    floors[i]++;
    left--;
  }
  return floors;
}

export function flows(plan: OfficePlan, c: OfficeCosts, level: RevenueLevel): { list: Flow[]; revenue: number; loss: boolean } {
  const o = outcome(plan, c, level);
  const place = placeById(plan.config.area);
  const raw: Omit<Flow, "per100">[] = [
    { id: "hyra", label: "Hyra", month: c.rent, color: "#7f9bb8", text: `Lokalhyran för ${c.area} m² ${preposition(place)} ${place.name}, ca ${n(c.rentPerM2)} kr per m² och år.` },
    { id: "loner", label: "Löner", month: c.wages + c.pension, color: "#1f3a63", text: `Bruttolön till ${plan.staff} ${plan.staff === 1 ? "anställd" : "anställda"} plus tjänstepension och semestertillägg.` },
    { id: "avgifter", label: "Arbetsgivaravgifter", month: c.employerFees, color: "#4d6a92", text: `${pct(PAY.employerFee)} ovanpå varje lön som går till Skatteverket – finansierar pension, sjukförsäkring och föräldraförsäkring.` },
    { id: "varor", label: "Varor & material", month: o.goods, color: "#b5523b", text: `Varor, råvaror och material som köps in för att kunna sälja – ca ${pct(c.goodsShare)} av försäljningen.` },
    { id: "inredning", label: "Inredning", month: c.depreciation, color: "#c8a45c", text: `Möbler och utrustning för ca ${n(c.furnishing)} kr kostnadsförs (skrivs av) över ${PAY.depreciationYears} år.` },
    { id: "ovrigt", label: "Övriga kostnader", month: c.other, color: "#8d96a3", text: "IT, telefon, försäkringar, el, marknadsföring, redovisning och revision." },
    { id: "skatt", label: "Bolagsskatt", month: o.tax, color: "#5d687a", text: `${pct(PAY.corporateTax)} av vinsten går till staten.${o.tax ? "" : " Ingen vinst – ingen bolagsskatt."}` },
  ];
  const loss = o.kept < 0;
  raw.push(
    loss
      ? { id: "kvar", label: "Saknas", month: o.kept, color: "#c43d3d", text: "Intäkterna räcker inte – mellanskillnaden måste tas från sparade pengar i bolaget eller lånas." }
      : { id: "kvar", label: "Kvar i bolaget", month: o.kept, color: "#2f8f5b", text: "Det som blir kvar efter skatt – kan sparas i bolaget, investeras eller delas ut till ägarna." },
  );
  const shown = raw.filter((f) => f.month !== 0 || f.id === "skatt" || f.id === "kvar");
  const costs = shown.filter((f) => f.id !== "kvar");
  const costTotal = costs.reduce((a, f) => a + f.month, 0);
  const scale = 100 / o.revenue;
  const per = whole(
    costs.map((f) => f.month * scale),
    loss ? Math.round(costTotal * scale) : Math.min(100, Math.round(costTotal * scale)),
  );
  const list = shown.map((f) => {
    if (f.id !== "kvar") return { ...f, per100: per[costs.indexOf(f)] };
    const spent = per.reduce((a, b) => a + b, 0);
    return { ...f, per100: 100 - spent };
  });
  return { list, revenue: o.revenue, loss };
}
