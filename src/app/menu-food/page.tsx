"use client";

import styles from "@/styles/menu.module.scss";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const foodImages = [
  "/assets/img/pasta.png",
  "/assets/img/burger.png",
  "/assets/img/dolci.png",
  "/assets/img/snack.png",
];

type MenuType = "food" | "drink";

type FoodDoc = {
  numericId?: number;
  name?: string;
  description?: string;
  category?: string;
  price?: number | null;
  prezzo?: number | null;
  allergens?: number[]; // se li metterai
  linkToNumericId?: number | null;
  disponibile?: boolean;
};

type DrinkDoc = {
  numericId?: number;
  name?: string;
  disponibile?: boolean;
};

type Food = {
  numericId: number;
  name: string;
  description: string;
  category: string;
  price: number | null;
  allergens: number[];
  linkToNumericId: number | null;
  disponibile: boolean;
};

type DrinkMin = {
  numericId: number;
  name: string;
};

type MenuBundle = {
  menu: Food[];
  drinks: DrinkMin[];
};

const SESSION_KEY = "sbajo:menuFoodBundle:v2";
const TTL_MS = 1000 * 60 * 10;

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
  } catch {}
}

function normalizeCategory(cat: string | undefined) {
  return (cat ?? "altro").toLowerCase().trim();
}

export default function MenuFoodPage() {
  const [menu, setMenu] = useState<Food[] | null>(null);
  const [drinks, setDrinks] = useState<DrinkMin[] | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadingMsg, setLoadingMsg] = useState("Sto caricando il menu…");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      setError(null);

      // 1) session cache
      const cached = readSession<MenuBundle>(SESSION_KEY, TTL_MS);
      if (cached) {
        setMenu(cached.menu);
        setDrinks(cached.drinks);
        setLoading(false);
        return;
      }

      // 2) fetch Firestore
      setLoading(true);
      setLoadingMsg("Sto caricando dal database…");
      setMenu(null);
      setDrinks(null);

      try {
        const [foodSnap, drinkSnap] = await Promise.all([
          getDocs(collection(db, "menu-food")),
          getDocs(collection(db, "menu-drink")),
        ]);

        if (!alive) return;

        const menuData: Food[] = foodSnap.docs
          .map((d) => {
            const x = d.data() as FoodDoc;
            const numericId = Number(x.numericId ?? d.id);
            return {
              numericId,
              name: String(x.name ?? ""),
              description: String(x.description ?? ""),
              category: String(x.category ?? "altro"),
              price: (x.price ?? x.prezzo ?? null) as number | null,
              allergens: Array.isArray(x.allergens) ? x.allergens : [],
              linkToNumericId: (x.linkToNumericId ?? null) as number | null,
              disponibile: x.disponibile !== false,
            };
          })
          .filter((x) => Number.isFinite(x.numericId) && x.name && x.disponibile);

        const drinksData: DrinkMin[] = drinkSnap.docs
          .map((d) => {
            const x = d.data() as DrinkDoc;
            const numericId = Number(x.numericId ?? d.id);
            return {
              numericId,
              name: String(x.name ?? ""),
              disponibile: x.disponibile !== false,
            };
          })
          .filter((x) => Number.isFinite(x.numericId) && x.name && (x as any).disponibile)
          .map(({ numericId, name }) => ({ numericId, name }));

        setMenu(menuData);
        setDrinks(drinksData);

        if (menuData.length || drinksData.length) {
          writeSession<MenuBundle>(SESSION_KEY, { menu: menuData, drinks: drinksData });
        }
      } catch (e) {
        console.error("Firestore load error:", e);
        if (!alive) return;
        setMenu([]);
        setDrinks([]);
        setError("Errore durante il caricamento del menu da Firebase.");
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

  // map drink per numericId
  const drinkById = useMemo(() => {
    const map = new Map<number, DrinkMin>();
    (drinks ?? []).forEach((d) => map.set(d.numericId, d));
    return map;
  }, [drinks]);

  // map food per numericId
  const foodById = useMemo(() => {
    const map = new Map<number, Food>();
    (menu ?? []).forEach((p) => map.set(p.numericId, p));
    return map;
  }, [menu]);

  // grouping per category
  const grouped = useMemo(() => {
    return (menu ?? []).reduce((acc, item) => {
      const cat = normalizeCategory(item.category);
      (acc[cat] ??= []).push(item);
      return acc;
    }, {} as Record<string, Food[]>);
  }, [menu]);

  return (
    <div className={styles.wrapper}>
      <HeroCarousel images={foodImages} />
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
          <p className={styles.empty}>Il menu non è disponibile al momento.</p>
        ) : (
          Object.entries(grouped).map(([tipologia, items]) => (
            <section key={tipologia} id={tipologia}>
              <h2 className={styles.heading}>
                {tipologia.charAt(0).toUpperCase() + tipologia.slice(1)}
              </h2>

              <ul className={styles.list}>
                {items.map((item) => {
                  const linkedFood =
                    item.linkToNumericId != null ? foodById.get(item.linkToNumericId) : undefined;

                  const linkedDrink =
                    item.linkToNumericId != null ? drinkById.get(item.linkToNumericId) : undefined;

                  return (
                    <li
                      key={item.numericId}
                      id={`food-${item.numericId}`}
                      className={styles.item}
                    >
                      <div className={styles.details}>
                        <h4 className={styles.nameItem}>
                          {item.name}
                          {item.allergens.length > 0 && (
                            <span className={styles.codes}>
                              {" ["}
                              {item.allergens.join(", ")}
                              {"]"}
                            </span>
                          )}
                        </h4>

                        {!!item.description && <p>{item.description}</p>}

                        {linkedFood && (
                          <div className={styles.pairing}>
                            <span className={styles.pairingLabel}>Provalo con:</span>
                            <a
                              href={`/menu-food#food-${linkedFood.numericId}`}
                              className={styles.pairingCard}
                              aria-label={`Vedi ${linkedFood.name} nel menu food`}
                            >
                              <span className={styles.pairingIcon}>🍴</span>
                              <span className={styles.pairingText}>{linkedFood.name}</span>
                              <span className={styles.pairingArrow}>›</span>
                            </a>
                          </div>
                        )}

                        {linkedDrink && (
                          <div className={styles.pairing}>
                            <span className={styles.pairingLabel}>Consigliato con</span>
                            <a
                              href={`/menu-drink#drink-${linkedDrink.numericId}`}
                              className={styles.pairingCard}
                              aria-label={`Vedi ${linkedDrink.name} nel menu drink`}
                            >
                              <span className={styles.pairingIcon}>🍸</span>
                              <span className={styles.pairingText}>{linkedDrink.name}</span>
                              <span className={styles.pairingArrow}>›</span>
                            </a>
                          </div>
                        )}
                      </div>

                      <span className={styles.price}>
                        {item.price != null ? `€${item.price}` : ""}
                      </span>
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
