"use client";

import { usePathname } from "next/navigation";

export type AppId = "hem" | "kontor" | "semester";

export const APPS: Record<AppId, { path: string; label: string; short: string; title: string }> = {
  hem: { path: "/", label: "Drömboendet", short: "Boende", title: "Drömboendet – RKJH" },
  kontor: { path: "/kontor", label: "Drömkontoret", short: "Kontor", title: "Drömkontoret – RKJH" },
  semester: { path: "/semester", label: "Drömsemestern", short: "Semester", title: "Drömsemestern – RKJH" },
};

export const appFor = (pathname: string): AppId => (pathname.startsWith("/kontor") ? "kontor" : pathname.startsWith("/semester") ? "semester" : "hem");

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
          <span className="lg">{APPS[id].label}</span>
          <span className="sm">{APPS[id].short}</span>
        </a>
      ))}
    </nav>
  );
}
