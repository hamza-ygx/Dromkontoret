import { gateEnabled } from "@/lib/auth";
import { Studio } from "./studio";

export const dynamic = "force-dynamic";

export default function Page() {
  // Live builds need a key, and in production also a passcode (the API route refuses otherwise).
  const live = !!process.env.ANTHROPIC_API_KEY && (process.env.NODE_ENV !== "production" || gateEnabled());
  const version = (process.env.VERCEL_GIT_COMMIT_SHA || "lokal").slice(0, 7);
  return <Studio gate={gateEnabled()} live={live} version={version} />;
}
