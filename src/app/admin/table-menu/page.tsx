"use client";

import AdminGate from "@/components/AdminGate";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import s from "@/styles/adminMenuEditor.module.scss";

type MenuType = "food" | "drink";

type MenuRow = {
  numericId: number;
  menuType: MenuType;
  name: string;
  category: string;
  description?: string;
  price?: number;
  disponibile?: boolean;
};

function collectionFor(type: MenuType) {
  return type === "food" ? "menu-food" : "menu-drink";
}

function safeNumber(v: any): number | null {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export default function TableMenuPage() {
  const router = useRouter();

  const [food, setFood] = useState<MenuRow[]>([]);
  const [drink, setDrink] = useState<MenuRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    setErr(null);
    setMsg(null);

    try {
      const [foodSnap, drinkSnap] = await Promise.all([
        getDocs(query(collection(db, "menu-food"), orderBy("numericId", "asc"))),
        getDocs(query(collection(db, "menu-drink"), orderBy("numericId", "asc"))),
      ]);

      const foodData: MenuRow[] = foodSnap.docs
        .map((d) => {
          const x = d.data() as any;
          const numericId = safeNumber(x.numericId ?? d.id);
          if (numericId == null) return null;
          return {
            numericId,
            menuType: "food",
            name: String(x.name ?? ""),
            category: String(x.category ?? "Altro"),
            description: x.description ? String(x.description) : "",
            price: safeNumber(x.price) ?? undefined,
            disponibile: typeof x.disponibile === "boolean" ? x.disponibile : undefined,
          } as MenuRow;
        })
        .filter(Boolean) as MenuRow[];

      const drinkData: MenuRow[] = drinkSnap.docs
        .map((d) => {
          const x = d.data() as any;
          const numericId = safeNumber(x.numericId ?? d.id);
          if (numericId == null) return null;
          return {
            numericId,
            menuType: "drink",
            name: String(x.name ?? ""),
            category: String(x.category ?? "Altro"),
            description: x.description ? String(x.description) : "",
            price: safeNumber(x.price) ?? undefined,
            disponibile: typeof x.disponibile === "boolean" ? x.disponibile : undefined,
          } as MenuRow;
        })
        .filter(Boolean) as MenuRow[];

      setFood(foodData);
      setDrink(drinkData);
    } catch (e) {
      console.error(e);
      setErr("Non riesco a leggere i dati da Firestore (menu-food / menu-drink).");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const all = useMemo(() => {
    return [...food, ...drink].sort((a, b) => a.numericId - b.numericId);
  }, [food, drink]);

  function goCreate(type: MenuType) {
    router.push(`/admin/menu-editor?type=${type}`);
  }

  function goEdit(row: MenuRow) {
    router.push(`/admin/menu-editor?type=${row.menuType}&id=${row.numericId}`);
  }

  function goDisponibilita() {
    router.push(`/admin/disponibilita`);
  }

  async function onDelete(row: MenuRow) {
    setErr(null);
    setMsg(null);

    if (!confirm(`Eliminare ${row.menuType} #${row.numericId} (${row.name})?`)) return;

    try {
      await deleteDoc(doc(db, collectionFor(row.menuType), String(row.numericId)));
      setMsg(`Eliminato: ${row.menuType} #${row.numericId}`);
      await refresh();
    } catch (e) {
      console.error(e);
      setErr("Errore durante l’eliminazione.");
    }
  }

  return (
    <AdminGate>
      <div className={s.page}>
        <div className={s.container}>
          <h1 className={s.title}>Table Menu</h1>
          <p className={s.subtitle}>
            Lista completa. Clicca “Modifica” per aprire il menu-editor in modalità edit.
          </p>

          {err && <div className={`${s.notice} ${s.noticeErr}`}>{err}</div>}
          {msg && <div className={`${s.notice} ${s.noticeOk}`}>{msg}</div>}

          <div className={s.card}>
            <div className={s.actions} style={{ marginTop: 0 }}>
              <button className={`${s.btn} ${s.btnPrimary}`} onClick={() => goCreate("food")}>
                + Nuovo
              </button>
              <button className={`${s.btn} ${s.btnPrimary}`} onClick={() => goDisponibilita()}>
                Disponibilità
              </button>
            </div>

            <hr className={s.hr} />

            {loading ? (
              <p className={s.subtitle}>Caricamento…</p>
            ) : all.length === 0 ? (
              <p className={s.subtitle}>Nessun elemento.</p>
            ) : (
              <>
                {/* FOOD SECTION */}
                <h2 className={s.title}>Food</h2>
                {food.length > 0 ? (
                  <div className={s.list}>
                    {food.map((row) => (
                      <div key={`${row.menuType}-${row.numericId}`} className={s.item}>
                        <div className={s.itemTop}>
                          <div style={{ minWidth: 0 }}>
                            <p className={s.itemTitle} style={{ marginBottom: 6 }}>
                              #{row.numericId} · {row.name}{" "}
                              <span style={{ opacity: 0.7 }}>
                                ({row.menuType} · {row.category})
                              </span>
                            </p>
                            <div className={s.badgeRow}>
                              {typeof row.price === "number" ? (
                                <span className={s.badge}>€ {row.price}</span>
                              ) : (
                                <span className={`${s.badge} ${s.badgeMuted}`}>€ -</span>
                              )}

                              {typeof row.disponibile === "boolean" ? (
                                <span
                                  className={`${s.badge} ${row.disponibile ? "" : s.badgeMuted}`}
                                >
                                  {row.disponibile ? "Disponibile" : "Non disponibile"}
                                </span>
                              ) : (
                                <span className={`${s.badge} ${s.badgeMuted}`}>Disponibilità: -</span>
                              )}
                            </div>
                            {row.description && <div className={s.descriptionRow}>{row.description}</div>}
                          </div>
                          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                            <button className={s.btn} onClick={() => goEdit(row)}>
                              Modifica
                            </button>
                            <button className={`${s.btn} ${s.btnDanger}`} onClick={() => onDelete(row)}>
                              Elimina
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={s.subtitle}>Nessun elemento nella sezione Food.</p>
                )}

                <hr className={s.hr} />

                {/* DRINK SECTION */}
                <h2 className={s.title}>Drink</h2>
                {drink.length > 0 ? (
                  <div className={s.list}>
                    {drink.map((row) => (
                      <div key={`${row.menuType}-${row.numericId}`} className={s.item}>
                        <div className={s.itemTop}>
                          <div style={{ minWidth: 0 }}>
                            <p className={s.itemTitle} style={{ marginBottom: 6 }}>
                              #{row.numericId} · {row.name}{" "}
                              <span style={{ opacity: 0.7 }}>
                                ({row.menuType} · {row.category})
                              </span>
                            </p>
                            <div className={s.badgeRow}>
                              {typeof row.price === "number" ? (
                                <span className={s.badge}>€ {row.price}</span>
                              ) : (
                                <span className={`${s.badge} ${s.badgeMuted}`}>€ -</span>
                              )}

                              {typeof row.disponibile === "boolean" ? (
                                <span
                                  className={`${s.badge} ${row.disponibile ? "" : s.badgeMuted}`}
                                >
                                  {row.disponibile ? "Disponibile" : "Non disponibile"}
                                </span>
                              ) : (
                                <span className={`${s.badge} ${s.badgeMuted}`}>Disponibilità: -</span>
                              )}
                            </div>
                            {row.description && <div className={s.descriptionRow}>{row.description}</div>}
                          </div>
                          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                            <button className={s.btn} onClick={() => goEdit(row)}>
                              Modifica
                            </button>
                            <button className={`${s.btn} ${s.btnDanger}`} onClick={() => onDelete(row)}>
                              Elimina
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={s.subtitle}>Nessun elemento nella sezione Drink.</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </AdminGate>
  );
}
