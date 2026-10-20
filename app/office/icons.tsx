import type { Industry } from "@/lib/office/types";

const P = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

const PATHS: Record<Industry, string[]> = {
  konsult: ["M5 11h22v15H5z", "M12 11V7.5A1.5 1.5 0 0 1 13.5 6h5A1.5 1.5 0 0 1 20 7.5V11", "M5 17h22M14.5 17v2.5h3V17"],
  bygg: ["M7 27V6h3v21M10 8h17l-3 4M10 8l5 4", "M22 12v5M20 17h4v3h-4zM4 27h24"],
  restaurang: ["M9 5v8a3 3 0 0 0 6 0V5M12 5v22", "M22 27V5c-3 2-4 6-4 11h4"],
  butik: ["M5 13v14h22V13M4 13l2.5-7h19L28 13z", "M4 13c0 2 1.5 3 3 3s3-1 3-3c0 2 1.5 3 3 3s3-1 3-3c0 2 1.5 3 3 3s3-1 3-3c0 2 1.5 3 3 3s3-1 3-3", "M13 27v-6h6v6"],
  verkstad: ["M3 27V12l13-7 13 7v15", "M8 27V16h16v11M8 20h16M8 24h16"],
};

export function IndustryIcon({ i }: { i: Industry }) {
  return (
    <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden>
      <g {...P}>
        {PATHS[i].map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  );
}
