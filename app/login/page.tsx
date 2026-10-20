"use client";

import { useState } from "react";

export default function Login() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [shake, setShake] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!code || busy) return;
    setBusy(true);
    setError("");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode: code }),
    }).catch(() => null);
    if (res?.ok) {
      window.location.href = "/";
      return;
    }
    setBusy(false);
    setError(res ? "Fel kod" : "Ingen anslutning");
    setShake(true);
    setTimeout(() => setShake(false), 450);
  }

  return (
    <main className="login">
      <form onSubmit={submit} className={shake ? "shake" : ""}>
        <div className="mark">
          <span className="mono">RKJH</span>
          <span className="firm">
            Revisionskonsulterna
            <br />J Hägglund
          </span>
        </div>
        <h1>Drömboendet & Drömkontoret</h1>
        <p>Ange koden för att fortsätta</p>
        <input
          type="password"
          inputMode="numeric"
          autoComplete="current-password"
          autoFocus
          value={code}
          onChange={(e) => setCode(e.target.value)}
          aria-label="Kod"
        />
        <div className="err" role="alert">{error}</div>
        <button className="build" disabled={busy || !code}>
          {busy ? "Kontrollerar…" : "Fortsätt"}
        </button>
      </form>
    </main>
  );
}
