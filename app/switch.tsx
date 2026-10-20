"use client";

import { usePathname } from "next/navigation";

export type AppId = "hem" | "kontor";

export const APPS: Record<AppId, { path: string; label: string; title: string }> = {
  hem: { path: "/", label: "Drömboendet", title: "Drömboendet – RKJH" },
  kontor: { path: "/kontor", label: "Drömkontoret", title: "Drömkontoret – RKJH" },
};

export const appFor = (pathname: string): AppId => (pathname.startsWith("/kontor") ? "kontor" : "hem");

export function AppSwitch() {
  const current = appFor(usePathname());
  return (
    <nav className="appswitch" aria-label="Välj app">
      {(Object.keys(APPS) as AppId[]).map((id) => (
        <a
          key={id}
          href={APPS[id].path}
          className={id === current ? "on" : ""}
          aria-current={id === current ? "page" : undefined}
          onClick={(e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
            e.preventDefault();
            if (id !== current) window.history.pushState(null, "", APPS[id].path);
          }}
        >
          {APPS[id].label}
        </a>
      ))}
    </nav>
  );
}
