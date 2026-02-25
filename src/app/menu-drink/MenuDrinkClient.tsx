/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import styles from "@/styles/menu.module.scss";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

type FoodMin = { numericId: number; name: string };

type Drink = {
  numericId?: number;
  name: string;
  description?: string;
  category?: string;
  price?: number | null;
  allergens?: string[];
  linkFoodId?: number | null;
  linkDrinkId?: number | null;
  disponibile?: boolean;
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
  if (cat === "soft drink") return "Soft drink";
  return cat.charAt(0).toUpperCase() + cat.slice(1);
}

function priceSort(a: DrinkMin, b: DrinkMin) {
  const ap = a.price;
  const bp = b.price;

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

export default function MenuDrinkClient({
  drinks: initialDrinks = [],
  food: initialFood = [],
}: {
  drinks?: DrinkMin[];
  food?: FoodMin[];
} = {}) {
  const [drinks, setDrinks] = useState<DrinkMin[]>(initialDrinks);
  const [food, setFood] = useState<FoodMin[]>(initialFood);
  const [loading, setLoading] = useState(!initialDrinks.length);
  const [hash, setHash] = useState<string>("");

  useEffect(() => {
    if (initialDrinks.length > 0) return;

    async function loadFromFirestore() {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "menu-drink"));
        const items: DrinkMin[] = querySnapshot.docs
          .map((doc) => {
            const data = doc.data() as Drink;
            return {
              numericId: data.numericId || 0,
              name: data.name || "",
              description: data.description || "",
              category: data.category || "altro",
              price: data.price || null,
              allergens: data.allergens || [],
              linkFoodId: data.linkFoodId || null,
              linkDrinkId: data.linkDrinkId || null,
              disponibile: data.disponibile !== false,
            };
          })
          .filter((d) => d.disponibile);
        setDrinks(items);
      } catch (err) {
        console.error("Error loading drinks from Firestore:", err);
      } finally {
        setLoading(false);
      }
    }

    loadFromFirestore();
  }, [initialDrinks.length]);

  useEffect(() => {
    const onHash = () => setHash(window.location.hash || "");
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const scrollToHash = useCallback((h: string) => {
    const scrollContainer = document.getElementById("menu-scroll");
    if (!scrollContainer) return;

    const id = h.startsWith("#") ? h.slice(1) : h;
    if (!id) return;

    let tries = 0;
    const tick = () => {
      const target = document.getElementById(id);
      if (!target) {
        if (++tries < 30) requestAnimationFrame(tick);
        return;
      }

      requestAnimationFrame(() => {
        const cRect = scrollContainer.getBoundingClientRect();
        const tRect = target.getBoundingClientRect();
        const top = tRect.top - cRect.top + scrollContainer.scrollTop - 12;
        scrollContainer.scrollTo({ top, behavior: "smooth" });
      });
    };

    tick();
  }, []);

  useEffect(() => {
    if (!hash) return;
    scrollToHash(hash);
  }, [hash, drinks, scrollToHash]);

  const foodById = useMemo(() => {
    const map = new Map<number, FoodMin>();
    (food ?? []).forEach((p) => map.set(p.numericId, p));
    return map;
  }, [food]);

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

  const GROUP_ORDER = ["cocktail", "birre", "vini", "soft drink", "altro"] as const;

  const orderedSections = useMemo(() => {
    const keys = Object.keys(groupedSorted);
    const known = GROUP_ORDER.filter((k) => keys.includes(k));
    const others = keys
      .filter((k) => !GROUP_ORDER.includes(k as any))
      .sort((a, b) => a.localeCompare(b));

    return [...known, ...others].map((k) => [k, groupedSorted[k]] as const);
  }, [groupedSorted]);

  if (loading) {
    return <p className={styles.empty}>Sto caricando il menu drink…</p>;
  }

  if (!orderedSections.length) {
    return <p className={styles.empty}>Il menu drink non è disponibile al momento.</p>;
  }

  return (
    <>
      {orderedSections.map(([tipologia, items]) => (
        <section key={tipologia} id={tipologia}>
          <h2 className={styles.heading}>{labelCategory(tipologia)}</h2>

          <ul className={styles.list}>
            {items.map((item) => {
              const piatto =
                item.linkFoodId != null ? foodById.get(item.linkFoodId) : undefined;

              return (
                <li key={item.numericId} id={`drink-${item.numericId}`} className={styles.item}>
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
                          scroll={false}
                        >
                          <span className={styles.pairingIcon}>🍴</span>
                          <span className={styles.pairingText}>{piatto.name}</span>
                          <span className={styles.pairingArrow}>›</span>
                        </Link>
                      </div>
                    )}
                  </div>

                  <span className={styles.price}>{item.price != null ? `€${item.price}` : ""}</span>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

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
          Per informazioni su ingredienti e possibili contaminazioni crociate rivolgiti al personale.
        </p>
      </section>

      <style jsx global>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}
