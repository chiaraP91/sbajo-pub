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

type FoodDoc = {
  numericId?: number;
  name?: string;
  description?: string;
  category?: string;
  price?: number | null;
  prezzo?: number | null;
  allergens?: number[];
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

function normalizeCategory(cat: string | undefined) {
  return (cat ?? "altro").toLowerCase().trim();
}

function labelCategory(cat: string) {
  // se vuoi titoli più carini
  if (cat === "appetizer") return "Appetizer";
  if (cat === "burger") return "Burger";
  if (cat === "dolci") return "Dolci";
  if (cat === "altro") return "Altro";
  return cat.charAt(0).toUpperCase() + cat.slice(1);
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

  // ordine fisso macro-gruppi
  const GROUP_ORDER = ["appetizer", "burger", "dolci", "altro"] as const;

  const orderedSections = useMemo(() => {
    const keys = Object.keys(grouped);

    const known = GROUP_ORDER.filter((k) => keys.includes(k));
    const others = keys
      .filter((k) => !GROUP_ORDER.includes(k as any))
      .sort((a, b) => a.localeCompare(b));

    return [...known, ...others].map((k) => [k, grouped[k]] as const);
  }, [grouped]);

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
        ) : orderedSections.length === 0 ? (
          <p className={styles.empty}>Il menu non è disponibile al momento.</p>
        ) : (
          orderedSections.map(([tipologia, items]) => (
            <section key={tipologia} id={tipologia}>
              <h2 className={styles.heading}>{labelCategory(tipologia)}</h2>

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
