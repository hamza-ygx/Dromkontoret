"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Designer } from "./designer/designer";
import { OfficeDesigner } from "./office/office-designer";
import { APPS, appFor } from "./switch";

export function Apps({ version }: { version: string }) {
  const current = appFor(usePathname());
  const [seen, setSeen] = useState({ hem: current === "hem", kontor: current === "kontor" });

  useEffect(() => {
    setSeen((s) => (s[current] ? s : { ...s, [current]: true }));
    document.title = APPS[current].title;
  }, [current]);

  return (
    <>
      <div className="appwrap" hidden={current !== "hem"}>
        {seen.hem && <Designer version={version} visible={current === "hem"} />}
      </div>
      <div className="appwrap" hidden={current !== "kontor"}>
        {seen.kontor && <OfficeDesigner version={version} visible={current === "kontor"} />}
      </div>
    </>
  );
}
