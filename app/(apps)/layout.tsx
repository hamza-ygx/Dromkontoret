import { Apps } from "../apps";

export default function AppsLayout({ children }: { children: React.ReactNode }) {
  const version = (process.env.VERCEL_GIT_COMMIT_SHA || "lokal").slice(0, 7);
  return (
    <>
      <Apps version={version} />
      {children}
    </>
  );
}
