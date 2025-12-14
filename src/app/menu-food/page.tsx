"use client";

import styles from "@/styles/menu.module.scss";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import { useEffect, useMemo, useState } from "react";

const foodImages = [
  "/assets/img/pasta.png",
  "/assets/img/burger.png",
  "/assets/img/dolci.png",
  "/assets/img/snack.png",
];

interface Allergene {
  id: number;
  nome: string | null;
  codice: string | number | null;
}

interface Piatto {
  id: number;
  ref_id: string;            // ✅ necessario
  nome: string;
  descrizione: string | null;
  prezzo: number;
  allergeni?: Allergene[];
  tipologia?: string;

  coll_food?: string | null;     // ✅ ref_id del food collegato
  coll_drink?: string | null;    // ✅ ref_id del drink collegato
}

interface DrinkMin {
  id: number;
  ref_id: string;            // ✅ necessario
  nome: string;
}

export default function MenuFoodPage() {
  const [menu, setMenu] = useState<Piatto[] | null>(null);
  const [drinks, setDrinks] = useState<DrinkMin[] | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("https://supportive-flame-83924d0cf8.strapiapp.com/api/menus").then((r) => r.json()),
      fetch("https://supportive-flame-83924d0cf8.strapiapp.com/api/menu-drinks").then((r) => r.json()),
    ])
      .then(([foodRes, drinkRes]) => {
        setMenu(foodRes?.data ?? []);
        setDrinks(drinkRes?.data ?? []);
      })
      .catch(() => {
        setMenu([]);
        setDrinks([]);
      });
  }, []);

  // ✅ map drink per ref_id
  const drinkByDocumentId = useMemo(() => {
    const map = new Map<string, DrinkMin>();
    (drinks ?? []).forEach((d) => map.set(d.ref_id, d));
    return map;
  }, [drinks]);

  // ✅ map food per ref_id
  const foodByDocumentId = useMemo(() => {
    const map = new Map<string, Piatto>();
    (menu ?? []).forEach((p) => map.set(p.ref_id, p));
    return map;
  }, [menu]);

  // grouping per tipologia
  const grouped: Record<string, Piatto[]> = useMemo(() => {
    return (menu ?? []).reduce((acc, item) => {
      const cat = item.tipologia?.toLowerCase().trim() || "altro";
      (acc[cat] ??= []).push(item);
      return acc;
    }, {} as Record<string, Piatto[]>);
  }, [menu]);

  return (
    <div className={styles.wrapper}>
      <HeroCarousel images={foodImages} />
      <div className={styles.scrim} aria-hidden="true" />

      <Header />

      <main className={styles.scrollArea}>
        {Object.keys(grouped).length === 0 ? (
          <p className={styles.empty}>Il menu non è disponibile al momento.</p>
        ) : (
          Object.entries(grouped).map(([tipologia, items]) => (
            <section key={tipologia} id={tipologia}>
              <h2 className={styles.heading}>
                {tipologia.charAt(0).toUpperCase() + tipologia.slice(1)}
              </h2>

              <ul className={styles.list}>
                {items.map((item) => {
                  const linkedFood = item.coll_food
                    ? foodByDocumentId.get(item.coll_food)
                    : undefined;

                  const linkedDrink = item.coll_drink
                    ? drinkByDocumentId.get(item.coll_drink)
                    : undefined;

                  return (
                    <li
                      key={item.ref_id}
                      id={`food-${item.ref_id}`}
                      className={styles.item}
                    >
                      <div className={styles.details}>
                        <h4 className={styles.nameItem}>
                          {item.nome}
                          {item.allergeni && item.allergeni.length > 0 && (
                            <span className={styles.codes}>
                              [
                              {item.allergeni
                                .filter((a) => a?.nome)
                                .map((a) => a.nome)
                                .join(", ")}
                              ]
                            </span>
                          )}
                        </h4>

                        {item.descrizione && <p>{item.descrizione}</p>}

                        {/* CONSIGLIATO CON: FOOD */}
                        {linkedFood && (
                          <div className={styles.pairing}>
                            <span className={styles.pairingLabel}>Provalo con:</span>
                            <a
                              href={`/menu-food#food-${linkedFood.ref_id}`}
                              className={styles.pairingCard}
                              aria-label={`Vedi ${linkedFood.nome} nel menu food`}
                            >
                              <span className={styles.pairingIcon}> 🍴</span>

                              <span className={styles.pairingText}>{linkedFood.nome}</span>
                              <span className={styles.pairingArrow}>›</span>
                            </a>
                          </div>
                        )}

                        {/* CONSIGLIATO CON: DRINK */}
                        {linkedDrink && (
                          <div className={styles.pairing}>
                            <span className={styles.pairingLabel}>Consigliato con</span>
                            <a
                              href={`/menu-drink#drink-${linkedDrink.ref_id}`}
                              className={styles.pairingCard}
                              aria-label={`Vedi ${linkedDrink.nome} nel menu drink`}
                            >
                              <span className={styles.pairingIcon}>🍸</span>
                              <span className={styles.pairingText}>{linkedDrink.nome}</span>
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
    </div>
  );
}
