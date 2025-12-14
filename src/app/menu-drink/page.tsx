"use client";

import styles from "@/styles/menu.module.scss";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import { useEffect, useMemo, useState } from "react";

const drinkImages = [
  "/assets/img/drink1.png",
  "/assets/img/drink2.png",
  "/assets/img/drink3.png",
  "/assets/img/drink4.png",
];

interface Drink {
  id: number;
  documentId: string;
  nome: string;
  descrizione: string | null;
  prezzo: number;
  tipologia?: string;

  coll_food?: string | null; // documentId del food
}

interface FoodMin {
  id: number;
  documentId: string;
  nome: string;
}

type MenuBundle = {
  drinks: Drink[];
  food: FoodMin[];
};

const SESSION_KEY = "sbajo:menuDrinkBundle:v1";
const TTL_MS = 1000 * 60 * 10; // 10 minuti

function readSession<T>(key: string, ttlMs: number): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { ts: number; data: T };
    if (!parsed?.ts) return null;
    if (Date.now() - parsed.ts > ttlMs) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

function writeSession<T>(key: string, data: T) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ ts: Date.now(), data }));
  } catch {
    // storage pieno/bloccato: pace
  }
}

async function fetchJson(url: string, timeoutMs = 20000) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const r = await fetch(url, { signal: controller.signal, cache: "no-store" });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return await r.json();
  } finally {
    clearTimeout(t);
  }
}

export default function MenuDrinkPage() {
  const [drinks, setDrinks] = useState<Drink[] | null>(null);
  const [food, setFood] = useState<FoodMin[] | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadingMsg, setLoadingMsg] = useState("Sto caricando il menu drink…");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      setError(null);

      // 1) sessione
      const cached = readSession<MenuBundle>(SESSION_KEY, TTL_MS);
      if (cached) {
        setDrinks(cached.drinks);
        setFood(cached.food);
        setLoading(false);
        return;
      }

      // 2) fetch con loader
      setLoading(true);
      setLoadingMsg("Sto aspettando il server del menu drink…");
      setDrinks(null);
      setFood(null);

      try {
        const [drinkRes, foodRes] = await Promise.allSettled([
          fetchJson("https://supportive-flame-83924d0cf8.strapiapp.com/api/menu-drinks"),
          fetchJson("https://supportive-flame-83924d0cf8.strapiapp.com/api/menus"),
        ]);

        if (!alive) return;

        const drinksData: Drink[] =
          drinkRes.status === "fulfilled" ? (drinkRes.value?.data ?? []) : [];

        const foodData: FoodMin[] =
          foodRes.status === "fulfilled" ? (foodRes.value?.data ?? []) : [];

        setDrinks(drinksData);
        setFood(foodData);

        // salva solo se ho almeno qualcosa (evita cache “vuota” se server dorme)
        if (drinksData.length || foodData.length) {
          writeSession<MenuBundle>(SESSION_KEY, { drinks: drinksData, food: foodData });
        }

        if (drinkRes.status === "rejected" && foodRes.status === "rejected") {
          setError("Il server non risponde (o si sta svegliando). Riprova tra poco.");
        }
      } catch {
        if (!alive) return;
        setDrinks([]);
        setFood([]);
        setError("Errore di rete durante il caricamento del menu drink.");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    };

    load();

    return () => {
      alive = false;
    };
  }, []);

  // mappa documentId food -> food
  const foodByDocumentId = useMemo(() => {
    const map = new Map<string, FoodMin>();
    (food ?? []).forEach((p) => map.set(p.documentId, p));
    return map;
  }, [food]);

  // grouping per tipologia
  const grouped = useMemo(() => {
    return (drinks ?? []).reduce((acc, item) => {
      const cat = item.tipologia?.toLowerCase().trim() || "altro";
      (acc[cat] ??= []).push(item);
      return acc;
    }, {} as Record<string, Drink[]>);
  }, [drinks]);

  return (
    <div className={styles.wrapper}>
      <HeroCarousel images={drinkImages} />
      <div className={styles.scrim} aria-hidden="true" />

      <Header />

      <main className={styles.scrollArea}>
        {loading ? (
          <div className={styles.empty}>
            <div style={{ display: "grid", gap: 8, justifyItems: "center" }}>
              <div
                aria-hidden="true"
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  border: "2px solid rgba(221,187,121,.35)",
                  borderTopColor: "rgba(221,187,121,.95)",
                  animation: "spin 0.9s linear infinite",
                }}
              />
              <p style={{ margin: 0 }}>{loadingMsg}</p>
              <p style={{ margin: 0, opacity: 0.75, fontSize: 12 }}>
                Se è lento... non è uno sbajo.
              </p>
            </div>
          </div>
        ) : error ? (
          <p className={styles.empty}>{error}</p>
        ) : Object.keys(grouped).length === 0 ? (
          <p className={styles.empty}>Il menu drink non è disponibile al momento.</p>
        ) : (
          Object.entries(grouped).map(([tipologia, items]) => (
            <section key={tipologia} id={tipologia}>
              <h2 className={styles.heading}>
                {tipologia.charAt(0).toUpperCase() + tipologia.slice(1)}
              </h2>

              <ul className={styles.list}>
                {items.map((item) => {
                  const piatto = item.coll_food
                    ? foodByDocumentId.get(item.coll_food)
                    : undefined;

                  return (
                    <li
                      key={item.documentId}
                      id={`drink-${item.documentId}`}
                      className={styles.item}
                    >
                      <div className={styles.details}>
                        <h4 className={styles.nameItem}>{item.nome}</h4>
                        {item.descrizione && <p>{item.descrizione}</p>}

                        {piatto && (
                          <div className={styles.pairing}>
                            <span className={styles.pairingLabel}>Provalo con:</span>
                            <a
                              href={`/menu-food#food-${piatto.documentId}`}
                              className={styles.pairingCard}
                              aria-label={`Vedi ${piatto.nome} nel menu food`}
                            >
                              <span className={styles.pairingIcon}>🍴</span>
                              <span className={styles.pairingText}>{piatto.nome}</span>
                              <span className={styles.pairingArrow}>›</span>
                            </a>
                          </div>
                        )}
                      </div>

                      <span className={styles.price}>€{item.prezzo}</span>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))
        )}
      </main>

      <Footer />

      <style jsx global>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
