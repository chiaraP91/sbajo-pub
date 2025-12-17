"use client";

import { useEffect, useState } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import s from "@/styles/adminMenuEditor.module.scss";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    // se già loggata, fuori dai piedi
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) router.replace("/admin/disponibilita");
    });
    return () => unsub();
  }, [router]);

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/admin/disponibilita");
    } catch (e: any) {
      const code = e?.code as string | undefined;

      if (code === "auth/invalid-credential" || code === "auth/wrong-password") {
        setErr("Credenziali non valide.");
      } else if (code === "auth/too-many-requests") {
        setErr("Troppi tentativi. Aspetta un attimo e riprova.");
      } else {
        setErr("Login fallito.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={s.page}>
      <div className={s.container}>
        <h1 className={s.title}>Login Admin</h1>
        <p className={s.subtitle}>Accesso riservato. Perché, sorprendentemente, non vuoi che chiunque cambi il menu.</p>

        {err && <div className={`${s.notice} ${s.noticeErr}`}>{err}</div>}

        <div className={s.card}>
          <form onSubmit={onLogin} className={s.formGrid}>
            <label className={`${s.field} ${s.full}`}>
              <span className={s.label}>Email</span>
              <input
                className={s.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
                placeholder="admin@sbajo.it"
                required
              />
            </label>

            <label className={`${s.field} ${s.full}`}>
              <span className={s.label}>Password</span>
              <input
                className={s.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                required
              />
            </label>

            <div className={s.actions}>
              <button className={`${s.btn} ${s.btnPrimary}`} type="submit" disabled={loading}>
                {loading ? "Accesso…" : "Entra"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
