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
  ref_id: string;
  nome: string;
  descrizione: string | null;
  prezzo: number;
  allergeni?: Allergene[];
  tipologia?: string;

  coll_food?: string | null;
  coll_drink?: string | null;
}

interface DrinkMin {
  id: number;
  ref_id: string;
  nome: string;
}

type MenuBundle = {
  menu: Piatto[];
  drinks: DrinkMin[];
};

const SESSION_KEY = "sbajo:menuFoodBundle:v1";
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
    // storage pieno / bloccato: amen
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

export default function MenuFoodPage() {
  const [menu, setMenu] = useState<Piatto[] | null>(null);
  const [drinks, setDrinks] = useState<DrinkMin[] | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadingMsg, setLoadingMsg] = useState("Sto caricando il menu…");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      setError(null);

      // 1) Prova sessione
      const cached = readSession<MenuBundle>(SESSION_KEY, TTL_MS);
      if (cached) {
        setMenu(cached.menu);
        setDrinks(cached.drinks);
        setLoading(false);
        return;
      }

      // 2) Niente cache: fetch + loader
      setLoading(true);
      setLoadingMsg("Sto aspettando il server del menu…");
      setMenu(null);
      setDrinks(null);

      try {
        const [foodRes, drinkRes] = await Promise.allSettled([
          fetchJson("https://supportive-flame-83924d0cf8.strapiapp.com/api/menus"),
          fetchJson("https://supportive-flame-83924d0cf8.strapiapp.com/api/menu-drinks"),
        ]);

        if (!alive) return;

        const menuData: Piatto[] =
          foodRes.status === "fulfilled" ? (foodRes.value?.data ?? []) : [];

        const drinksData: DrinkMin[] =
          drinkRes.status === "fulfilled" ? (drinkRes.value?.data ?? []) : [];

        setMenu(menuData);
        setDrinks(drinksData);

        // salva in sessione se ho qualcosa (altrimenti rischi di “cachare il vuoto”)
        if (menuData.length || drinksData.length) {
          writeSession<MenuBundle>(SESSION_KEY, { menu: menuData, drinks: drinksData });
        }

        if (foodRes.status === "rejected" && drinkRes.status === "rejected") {
          setError("Il server non risponde (o si sta svegliando). Riprova tra poco.");
        }
      } catch {
        if (!alive) return;
        setMenu([]);
        setDrinks([]);
        setError("Errore di rete durante il caricamento del menu.");
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

  // map drink per ref_id
  const drinkByDocumentId = useMemo(() => {
    const map = new Map<string, DrinkMin>();
    (drinks ?? []).forEach((d) => map.set(d.ref_id, d));
    return map;
  }, [drinks]);

  // map food per ref_id
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
                Si è lento... non è uno sbajo.
              </p>
            </div>
          </div>
        ) : error ? (
          <p className={styles.empty}>{error}</p>
        ) : Object.keys(grouped).length === 0 ? (
          <p className={styles.empty}>Il menu non è disponibile al momento.</p>
        ) : (
          Object.entries(grouped).map(([tipologia, items]) => (
            console.log(grouped),
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
                              [{" "}
                              {item.allergeni
                                .filter((a) => a?.nome)
                                .map((a) => a.nome)
                                .join(", ")}
                              {" ]"}
                            </span>
                          )}
                        </h4>

                        {item.descrizione && <p>{item.descrizione}</p>}

                        {linkedFood && (
                          <div className={styles.pairing}>
                            <span className={styles.pairingLabel}>Provalo con:</span>
                            <a
                              href={`/menu-food#food-${linkedFood.ref_id}`}
                              className={styles.pairingCard}
                              aria-label={`Vedi ${linkedFood.nome} nel menu food`}
                            >
                              <span className={styles.pairingIcon}>🍴</span>
                              <span className={styles.pairingText}>{linkedFood.nome}</span>
                              <span className={styles.pairingArrow}>›</span>
                            </a>
                          </div>
                        )}

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

      {/* keyframes inline, così non ti obbligo a toccare SCSS se non vuoi */}
      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
