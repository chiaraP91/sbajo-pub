/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AdminGate from "@/components/AdminGate";
import { useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import s from "@/styles/adminMenuEditor.module.scss";
import Link from "next/link";

type MenuType = "food" | "drink";

type Row = {
  menuType: MenuType;
  numericId: number;
  name: string;
  category?: string;
  disponibile: boolean;
};

function collectionFor(type: MenuType) {
  return type === "food" ? "menu-food" : "menu-drink";
}

function safeNumber(v: any): number | null {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export default function AvailabilityPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  // per disabilitare checkbox mentre aggiorna una riga
  const [savingKey, setSavingKey] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    setMsg(null);

    try {
      const [foodSnap, drinkSnap] = await Promise.all([
        getDocs(
          query(collection(db, "menu-food"), orderBy("numericId", "asc")),
        ),
        getDocs(
          query(collection(db, "menu-drink"), orderBy("numericId", "asc")),
        ),
      ]);

      const foodRows: Row[] = foodSnap.docs
        .map((d) => {
          const x = d.data() as any;
          const id = safeNumber(x.numericId ?? d.id);
          if (id == null) return null;

          return {
            menuType: "food",
            numericId: id,
            name: String(x.name ?? ""),
            category: x.category ? String(x.category) : undefined,
            disponibile:
              typeof x.disponibile === "boolean" ? x.disponibile : true,
          } as Row;
        })
        .filter(Boolean) as Row[];

      const drinkRows: Row[] = drinkSnap.docs
        .map((d) => {
          const x = d.data() as any;
          const id = safeNumber(x.numericId ?? d.id);
          if (id == null) return null;

          return {
            menuType: "drink",
            numericId: id,
            name: String(x.name ?? ""),
            category: x.category ? String(x.category) : undefined,
            disponibile:
              typeof x.disponibile === "boolean" ? x.disponibile : true,
          } as Row;
        })
        .filter(Boolean) as Row[];

      setRows(
        [...foodRows, ...drinkRows].sort((a, b) => a.numericId - b.numericId),
      );
    } catch (e) {
      console.error(e);
      setErr("Non riesco a leggere i dati da Firestore.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const grouped = useMemo(() => {
    return rows.reduce(
      (acc, r) => {
        acc[r.menuType].push(r);
        return acc;
      },
      { food: [] as Row[], drink: [] as Row[] },
    );
  }, [rows]);

  async function toggleDisponibile(row: Row, value: boolean) {
    setErr(null);
    setMsg(null);

    const key = `${row.menuType}-${row.numericId}`;
    setSavingKey(key);

    // optimistic UI
    setRows((prev) =>
      prev.map((r) =>
        r.menuType === row.menuType && r.numericId === row.numericId
          ? { ...r, disponibile: value }
          : r,
      ),
    );

    try {
      const ref = doc(db, collectionFor(row.menuType), String(row.numericId));
      await updateDoc(ref, { disponibile: value });
      setMsg(
        `Salvato: ${row.name} → ${value ? "Disponibile" : "Non disponibile"}`,
      );
    } catch (e) {
      console.error(e);

      // rollback
      setRows((prev) =>
        prev.map((r) =>
          r.menuType === row.menuType && r.numericId === row.numericId
            ? { ...r, disponibile: !value }
            : r,
        ),
      );

      setErr("Errore durante l’aggiornamento della disponibilità.");
    } finally {
      setSavingKey(null);
    }
  }

  return (
    <AdminGate>
      <div className={s.page}>
        <div className={s.container}>
          <h1 className={s.title}>Disponibilità menu</h1>
          <div className={s.actions}>
            <Link href="/admin/nuovo" className={s.addButton}>
              + Aggiungi evento
            </Link>
          </div>

          {err && <div className={`${s.notice} ${s.noticeErr}`}>{err}</div>}
          {msg && <div className={`${s.notice} ${s.noticeOk}`}>{msg}</div>}

          <div className={s.card}>
            <div className={s.actions} style={{ marginTop: 0 }}>
              <button className={s.btn} onClick={load} disabled={loading}>
                {loading ? "Carico…" : "Aggiorna"}
              </button>

              <a
                href="/admin/table-menu"
                className={`${s.btn} ${s.btnPrimary}`}
              >
                Vai a gestione menu
              </a>
            </div>

            <hr className={s.hr} />

            {loading ? (
              <p className={s.subtitle}>Caricamento…</p>
            ) : rows.length === 0 ? (
              <p className={s.subtitle}>Nessun elemento.</p>
            ) : (
              <>
                {/* FOOD */}
                <h2 className={s.title} style={{ fontSize: 18, marginTop: 0 }}>
                  Food
                </h2>

                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ textAlign: "left", opacity: 0.85 }}>
                        <th style={{ padding: "10px 8px" }}>ID</th>
                        <th style={{ padding: "10px 8px" }}>Nome</th>
                        <th style={{ padding: "10px 8px" }}>Tipologia</th>
                        <th style={{ padding: "10px 8px" }}>Disponibile</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grouped.food.map((r) => {
                        const k = `food-${r.numericId}`;
                        const disabled = savingKey === k;
                        return (
                          <tr
                            key={k}
                            style={{
                              borderTop: "1px solid rgba(255,255,255,0.10)",
                            }}
                          >
                            <td style={{ padding: "10px 8px", opacity: 0.8 }}>
                              {r.numericId}
                            </td>
                            <td style={{ padding: "10px 8px" }}>{r.name}</td>
                            <td style={{ padding: "10px 8px", opacity: 0.8 }}>
                              {r.category ?? "-"}
                            </td>
                            <td style={{ padding: "10px 8px" }}>
                              <label
                                style={{
                                  display: "inline-flex",
                                  gap: 8,
                                  alignItems: "center",
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={!!r.disponibile}
                                  disabled={disabled}
                                  onChange={(e) =>
                                    toggleDisponibile(r, e.target.checked)
                                  }
                                />
                                <span style={{ opacity: 0.8 }}>
                                  {r.disponibile ? "Sì" : "No"}
                                </span>
                              </label>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <hr className={s.hr} />

                {/* DRINK */}
                <h2 className={s.title} style={{ fontSize: 18, marginTop: 0 }}>
                  Drink
                </h2>

                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ textAlign: "left", opacity: 0.85 }}>
                        <th style={{ padding: "10px 8px" }}>ID</th>
                        <th style={{ padding: "10px 8px" }}>Nome</th>
                        <th style={{ padding: "10px 8px" }}>Tipologia</th>
                        <th style={{ padding: "10px 8px" }}>Disponibile</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grouped.drink.map((r) => {
                        const k = `drink-${r.numericId}`;
                        const disabled = savingKey === k;
                        return (
                          <tr
                            key={k}
                            style={{
                              borderTop: "1px solid rgba(255,255,255,0.10)",
                            }}
                          >
                            <td style={{ padding: "10px 8px", opacity: 0.8 }}>
                              {r.numericId}
                            </td>
                            <td style={{ padding: "10px 8px" }}>{r.name}</td>
                            <td style={{ padding: "10px 8px", opacity: 0.8 }}>
                              {r.category ?? "-"}
                            </td>
                            <td style={{ padding: "10px 8px" }}>
                              <label
                                style={{
                                  display: "inline-flex",
                                  gap: 8,
                                  alignItems: "center",
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={!!r.disponibile}
                                  disabled={disabled}
                                  onChange={(e) =>
                                    toggleDisponibile(r, e.target.checked)
                                  }
                                />
                                <span style={{ opacity: 0.8 }}>
                                  {r.disponibile ? "Sì" : "No"}
                                </span>
                              </label>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AdminGate>
  );
}
