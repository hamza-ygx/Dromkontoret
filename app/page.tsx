import { Designer } from "./designer/designer";

export default function Page() {
  const version = (process.env.VERCEL_GIT_COMMIT_SHA || "lokal").slice(0, 7);
  return <Designer version={version} />;
}
