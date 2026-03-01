/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import styles from "@/styles/menu.module.scss";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { getCachedData, setCachedData } from "@/lib/firebase-cache";

type Food = {
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

type DrinkMin = { numericId: number; name: string };

function normalizeCategory(cat: string | undefined) {
  return (cat ?? "altro").toLowerCase().trim();
}

function labelCategory(cat: string) {
  if (cat === "appetizer") return "Appetizer";
  if (cat === "burger") return "Burger";
  if (cat === "dolci") return "Dolci";
  if (cat === "altro") return "Altro";
  return cat.charAt(0).toUpperCase() + cat.slice(1);
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

export default function MenuFoodClient({
  menu: initialMenu = [],
  drinks: initialDrinks = [],
}: {
  menu?: any[];
  drinks?: DrinkMin[];
} = {}) {
  const [menu, setMenu] = useState(initialMenu);
  const [drinks, setDrinks] = useState(initialDrinks);
  const [loading, setLoading] = useState(!initialMenu.length);
  const [hash, setHash] = useState<string>("");

  useEffect(() => {
    if (initialMenu.length > 0) return;

    async function loadFromFirestore() {
      try {
        setLoading(true);

        // Controlla cache prima di fare richiesta a Firestore
        const cachedMenu = getCachedData<any[]>("menu-food");
        if (cachedMenu) {
          setMenu(cachedMenu);
          setLoading(false);
          return;
        }

        const querySnapshot = await getDocs(collection(db, "menu-food"));
        const items: any[] = querySnapshot.docs
          .map((doc) => {
            const data = doc.data();
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
          .filter((f) => f.disponibile);

        // Salva in cache
        setCachedData("menu-food", items);
        setMenu(items);
      } catch (err) {
        console.error("Error loading food from Firestore:", err);
      } finally {
        setLoading(false);
      }
    }

    loadFromFirestore();
  }, [initialMenu.length]);

  const [hashState, setHashState] = useState<string>("");

  useEffect(() => {
    const onHash = () => setHashState(window.location.hash || "");
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

      const HEADER_OFFSET = 72;
      const cTop = scrollContainer.getBoundingClientRect().top;
      const tTop = target.getBoundingClientRect().top;

      const nextTop = scrollContainer.scrollTop + (tTop - cTop) - HEADER_OFFSET;
      scrollContainer.scrollTo({ top: nextTop, behavior: "smooth" });

      if (++tries < 6) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    const h = hashState;
    if (!h) return;
    scrollToHash(h);
  }, [hashState, menu, scrollToHash]);

  const drinkById = useMemo(() => {
    const map = new Map<number, DrinkMin>();
    (drinks ?? []).forEach((d) => map.set(d.numericId, d));
    return map;
  }, [drinks]);

  const foodById = useMemo(() => {
    const map = new Map<number, Food>();
    (menu ?? []).forEach((p) => map.set(p.numericId, p));
    return map;
  }, [menu]);

  const grouped = useMemo(() => {
    return (menu ?? []).reduce(
      (acc, item) => {
        const cat = normalizeCategory(item.category);
        (acc[cat] ??= []).push(item);
        return acc;
      },
      {} as Record<string, Food[]>,
    );
  }, [menu]);

  const GROUP_ORDER = ["appetizer", "burger", "dolci", "altro"] as const;

  const orderedSections = useMemo(() => {
    const keys = Object.keys(grouped);
    const known = GROUP_ORDER.filter((k) => keys.includes(k));
    const others = keys
      .filter((k) => !GROUP_ORDER.includes(k as any))
      .sort((a, b) => a.localeCompare(b));

    return [...known, ...others].map((k) => [k, grouped[k]] as const);
  }, [grouped]);

  if (loading) {
    return <p className={styles.empty}>Sto caricando il menu…</p>;
  }

  if (!orderedSections.length) {
    return (
      <p className={styles.empty}>Il menu non è disponibile al momento.</p>
    );
  }

  return (
    <>
      {orderedSections.map(([tipologia, items]) => (
        <section key={tipologia} id={tipologia}>
          <h2 className={styles.heading}>{labelCategory(tipologia)}</h2>

          <ul className={styles.list}>
            {items.map((item: any) => {
              const linkedFood =
                item.linkFoodId != null
                  ? foodById.get(item.linkFoodId)
                  : undefined;

              const linkedDrink =
                item.linkDrinkId != null
                  ? drinkById.get(item.linkDrinkId)
                  : undefined;

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
                        <span className={styles.pairingLabel}>
                          Provalo con:
                        </span>

                        <a
                          href={`#food-${linkedFood.numericId}`}
                          className={styles.pairingCard}
                          aria-label={`Vedi ${linkedFood.name} nel menu food`}
                          onClick={(e) => {
                            e.preventDefault();
                            const newHash = `#food-${linkedFood.numericId}`;
                            history.pushState(null, "", newHash);
                            scrollToHash(newHash);
                            setHash(newHash);
                          }}
                        >
                          <span className={styles.pairingIcon}>🍴</span>
                          <span className={styles.pairingText}>
                            {linkedFood.name}
                          </span>
                          <span className={styles.pairingArrow}>›</span>
                        </a>
                      </div>
                    )}

                    {linkedDrink && (
                      <div className={styles.pairing}>
                        <span className={styles.pairingLabel}>
                          Consigliato con
                        </span>
                        <Link
                          href={`/menu-drink#drink-${linkedDrink.numericId}`}
                          className={styles.pairingCard}
                          aria-label={`Vedi ${linkedDrink.name} nel menu drink`}
                        >
                          <span className={styles.pairingIcon}>🍸</span>
                          <span className={styles.pairingText}>
                            {linkedDrink.name}
                          </span>
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
          Per informazioni su ingredienti e possibili contaminazioni crociate
          rivolgiti al personale.
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
