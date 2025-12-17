"use client";

import styles from "@/styles/menu.module.scss";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const drinkImages = [
  "/assets/img/drink1.png",
  "/assets/img/drink2.png",
  "/assets/img/drink3.png",
  "/assets/img/drink4.png",
];

type DrinkDoc = {
  numericId?: number;
  name?: string;
  description?: string;
  category?: string;
  prezzo?: number | null;
  price?: number | null;
  linkToNumericId?: number | null;
  disponibile?: boolean;
};

type FoodDoc = {
  numericId?: number;
  name?: string;
  disponibile?: boolean;
};

type Drink = {
  numericId: number;
  name: string;
  description: string;
  category: string;
  price: number | null;
  linkToNumericId: number | null;
  disponibile: boolean;
};

type FoodMin = {
  numericId: number;
  name: string;
};

function normalizeCategory(cat: string | undefined) {
  return (cat ?? "altro").toLowerCase().trim();
}

function labelCategory(cat: string) {
  // se vuoi label più “belle” per l’h2
  if (cat === "soft drink") return "Soft drink";
  return cat.charAt(0).toUpperCase() + cat.slice(1);
}

function priceSort(a: Drink, b: Drink) {
  const ap = a.price;
  const bp = b.price;

  // null/undefined in fondo
  if (ap == null && bp == null) return a.name.localeCompare(b.name);
  if (ap == null) return 1;
  if (bp == null) return -1;

  if (ap !== bp) return ap - bp;
  return a.name.localeCompare(b.name);
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
      setLoading(true);
      setLoadingMsg("Sto caricando dal database…");
      setDrinks(null);
      setFood(null);

      try {
        const [drinkSnap, foodSnap] = await Promise.all([
          getDocs(collection(db, "menu-drink")),
          getDocs(collection(db, "menu-food")),
        ]);

        if (!alive) return;

        const drinksData: Drink[] = drinkSnap.docs
          .map((d) => {
            const x = d.data() as DrinkDoc;
            const numericId = Number(x.numericId ?? d.id);
            return {
              numericId,
              name: String(x.name ?? ""),
              description: String(x.description ?? ""),
              category: String(x.category ?? "altro"),
              price: (x.price ?? x.prezzo ?? null) as number | null,
              linkToNumericId: (x.linkToNumericId ?? null) as number | null,
              disponibile: x.disponibile !== false,
            };
          })
          .filter((x) => Number.isFinite(x.numericId) && x.name && x.disponibile);

        const foodData: FoodMin[] = foodSnap.docs
          .map((d) => {
            const x = d.data() as FoodDoc;
            const numericId = Number(x.numericId ?? d.id);
            return {
              numericId,
              name: String(x.name ?? ""),
              disponibile: x.disponibile !== false,
            };
          })
          .filter((x) => Number.isFinite(x.numericId) && x.name && (x as any).disponibile)
          .map(({ numericId, name }) => ({ numericId, name }));

        setDrinks(drinksData);
        setFood(foodData);
      } catch (e) {
        console.error("Firestore load error:", e);
        if (!alive) return;
        setDrinks([]);
        setFood([]);
        setError("Errore durante il caricamento del menu drink da Firebase.");
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

  const foodById = useMemo(() => {
    const map = new Map<number, FoodMin>();
    (food ?? []).forEach((p) => map.set(p.numericId, p));
    return map;
  }, [food]);

  // 1) raggruppa + 2) ordina gli item per prezzo dentro ogni gruppo
  const groupedSorted = useMemo(() => {
    const grouped = (drinks ?? []).reduce((acc, item) => {
      const cat = normalizeCategory(item.category);
      (acc[cat] ??= []).push(item);
      return acc;
    }, {} as Record<string, Drink[]>);

    for (const k of Object.keys(grouped)) {
      grouped[k] = [...grouped[k]].sort(priceSort);
    }

    return grouped;
  }, [drinks]);

  // ordine gruppi fisso
  const GROUP_ORDER = ["cocktail", "birre","vini" ,"soft drink", "altro" ] as const;

  const orderedSections = useMemo(() => {
    const keys = Object.keys(groupedSorted);

    const known = GROUP_ORDER.filter((k) => keys.includes(k));
    const others = keys
      .filter((k) => !GROUP_ORDER.includes(k as any))
      .sort((a, b) => a.localeCompare(b));

    return [...known, ...others].map((k) => [k, groupedSorted[k]] as const);
  }, [groupedSorted]);

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
        ) : orderedSections.length === 0 ? (
          <p className={styles.empty}>Il menu drink non è disponibile al momento.</p>
        ) : (
          orderedSections.map(([tipologia, items]) => (
            <section key={tipologia} id={tipologia}>
              <h2 className={styles.heading}>{labelCategory(tipologia)}</h2>

              <ul className={styles.list}>
                {items.map((item) => {
                  const piatto =
                    item.linkToNumericId != null ? foodById.get(item.linkToNumericId) : undefined;

                  return (
                    <li
                      key={item.numericId}
                      id={`drink-${item.numericId}`}
                      className={styles.item}
                    >
                      <div className={styles.details}>
                        <h4 className={styles.nameItem}>{item.name}</h4>
                        {!!item.description && <p>{item.description}</p>}

                        {piatto && (
                          <div className={styles.pairing}>
                            <span className={styles.pairingLabel}>Provalo con:</span>
                            <a
                              href={`/menu-food#food-${piatto.numericId}`}
                              className={styles.pairingCard}
                              aria-label={`Vedi ${piatto.name} nel menu food`}
                            >
                              <span className={styles.pairingIcon}>🍴</span>
                              <span className={styles.pairingText}>{piatto.name}</span>
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
