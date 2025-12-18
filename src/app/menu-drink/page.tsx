"use client";

import styles from "@/styles/menu.module.scss";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import { useCallback, useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

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
  allergens?: string[];
  linkFoodId: number | null;
  linkDrinkId: number | null;
  disponibile?: boolean;
};

type FoodDoc = {
  numericId?: number;
  name?: string;
  description?: string;
  category?: string;
  price?: number | null;
  prezzo?: number | null;
  allergens?: number[];
  linkFoodId?: number | null;
  linkDrinkId?: number | null;
  disponibile?: boolean;
};

type Food = {
  numericId: number;
  name: string;
};


type DrinkMin = {
  numericId: number;
  name: string;
  description: string;
  category: string;
  price: number | null;
  allergens: string[];
  linkFoodId: number | null;
  linkDrinkId: number | null;
  disponibile: boolean;
};



function normalizeCategory(cat: string | undefined) {
  return (cat ?? "altro").toLowerCase().trim();
}

function labelCategory(cat: string) {
  // se vuoi label più “belle” per l’h2
  if (cat === "soft drink") return "Soft drink";
  return cat.charAt(0).toUpperCase() + cat.slice(1);
}

function priceSort(a: DrinkMin, b: DrinkMin) {
  const ap = a.price;
  const bp = b.price;

  // null/undefined in fondo
  if (ap == null && bp == null) return a.name.localeCompare(b.name);
  if (ap == null) return 1;
  if (bp == null) return -1;

  if (ap !== bp) return ap - bp;
  return a.name.localeCompare(b.name);
}

export const ALLERGENS = [
  { code: 1, label: "Glutine" },
  { code: 2, label: "Crostacei" },
  { code: 3, label: "Uova" },
  { code: 4, label: "Pesce" },
  { code: 5, label: "Arachidi" },
  { code: 6, label: "Soia" },
  { code: 7, label: "Latte" },
  { code: 8, label: "Frutta a guscio" },
  { code: 9, label: "Sedano" },
  { code: 10, label: "Senape" },
  { code: 11, label: "Sesamo" },
  { code: 12, label: "Solfiti" },
  { code: 13, label: "Lupini" },
  { code: 14, label: "Molluschi" },
] as const;

export const allergenLabelByCode = new Map<number, string>(
  ALLERGENS.map(a => [a.code, a.label])
);


export default function MenuDrinkPage() {
  const [drinks, setDrinks] = useState<DrinkMin[] | null>(null);
  const [food, setFood] = useState<Food[] | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadingMsg, setLoadingMsg] = useState("Sto caricando il menu drink…");
  const [error, setError] = useState<string | null>(null);
const [hash, setHash] = useState<string>("");
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

        const drinksData: DrinkMin[] = drinkSnap.docs
          .map((d) => {
            const x = d.data() as DrinkDoc;
            const numericId = Number(x.numericId ?? d.id);
            return {
              numericId,
              name: String(x.name ?? ""),
              description: String(x.description ?? ""),
              category: String(x.category ?? "altro"),
              price: (x.price ?? x.prezzo ?? null) as number | null,
              allergens: Array.isArray(x.allergens) ? x.allergens : [],
              linkFoodId: (x.linkFoodId ?? null) as number | null,
              linkDrinkId: (x.linkDrinkId ?? null) as number | null,
              disponibile: x.disponibile !== false,
            };
          })
          .filter((x) => Number.isFinite(x.numericId) && x.name && x.disponibile);

        const foodData: Food[] = foodSnap.docs
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

  
  useEffect(() => {
    const onHash = () => setHash(window.location.hash || "");
    onHash(); // inizializza
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const scrollToHash = useCallback((h: string) => {
    const scrollContainer = document.getElementById("menu-scroll");
    if (!scrollContainer) return;

    const id = h.startsWith("#") ? h.slice(1) : h;
    if (!id) return;

    const target = document.getElementById(id);
    if (!target) return;

    requestAnimationFrame(() => {
      const cRect = scrollContainer.getBoundingClientRect();
      const tRect = target.getBoundingClientRect();
      const top = (tRect.top - cRect.top) + scrollContainer.scrollTop - 12;
      scrollContainer.scrollTo({ top, behavior: "smooth" });
    });
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!hash) return;
    scrollToHash(hash);
  }, [loading, drinks, hash, scrollToHash]);

  useEffect(() => {
    if (loading) return;

    const scrollContainer = document.getElementById("menu-scroll");
    if (!scrollContainer) return;

    const hash = window.location.hash;
    if (!hash) return;

    const target = document.getElementById(hash.slice(1));
    if (!target) return;

    requestAnimationFrame(() => {
      const cRect = scrollContainer.getBoundingClientRect();
      const tRect = target.getBoundingClientRect();
      const top = (tRect.top - cRect.top) + scrollContainer.scrollTop - 12;

      scrollContainer.scrollTo({ top, behavior: "smooth" });
    });
  }, [loading, drinks]);



  const foodById = useMemo(() => {
    const map = new Map<number, Food>();
    (food ?? []).forEach((p) => map.set(p.numericId, p));
    return map;
  }, [food]);

  // 1) raggruppa + 2) ordina gli item per prezzo dentro ogni gruppo
  const groupedSorted = useMemo(() => {
    const grouped = (drinks ?? []).reduce((acc, item) => {
      const cat = normalizeCategory(item.category);
      (acc[cat] ??= []).push(item);
      return acc;
    }, {} as Record<string, DrinkMin[]>);

    for (const k of Object.keys(grouped)) {
      grouped[k] = [...grouped[k]].sort(priceSort);
    }

    return grouped;
  }, [drinks]);

  // ordine gruppi fisso
  const GROUP_ORDER = ["cocktail", "birre", "vini", "soft drink", "altro"] as const;

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

      <main id="menu-scroll" className={styles.scrollArea}>

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
                S è lento... non è uno sbajo.
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
                    item.linkFoodId != null ? foodById.get(item.linkFoodId) : undefined;

                  return (
                    <li
                      key={item.numericId}
                      id={`drink-${item.numericId}`}
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

                        {piatto && (
                          <div className={styles.pairing}>
                            <span className={styles.pairingLabel}>Provalo con:</span>
                            <Link
                              href={`/menu-food#food-${piatto.numericId}`}
                              className={styles.pairingCard}
                              aria-label={`Vedi ${piatto.name} nel menu food`}
                              scroll={false}  // importantissimo: non far scrollare la window
                            >
                              <span className={styles.pairingIcon}>🍴</span>
                              <span className={styles.pairingText}>{piatto.name}</span>
                              <span className={styles.pairingArrow}>›</span>
                            </Link>
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
        <section className={styles.allergensLegend}>
          <h3 className={styles.allergensTitle}>Allergeni</h3>

          <ul className={styles.allergensList}>
            {ALLERGENS.map((a) => (
              <li key={a.code} className={styles.allergenItem}>
                <span className={styles.allergenCode}>{a.code}</span>
                <span className={styles.allergenText}>{a.label}</span>
              </li>
            ))}
          </ul>

          <p className={styles.allergensNote}>
            Per informazioni su ingredienti e possibili contaminazioni crociate
            rivolgiti al personale.
          </p>
        </section>
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
