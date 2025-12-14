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
    documentId: string;            // ✅ serve per anchor stabile
    nome: string;
    descrizione: string | null;
    prezzo: number;
    tipologia?: string;

    coll_food?: string | null;     // ✅ documentId del food
}

interface FoodMin {
    id: number;
    documentId: string;            // ✅
    nome: string;
}

export default function MenuDrinkPage() {
    const [drinks, setDrinks] = useState<Drink[] | null>(null);
    const [food, setFood] = useState<FoodMin[] | null>(null);

    useEffect(() => {
        Promise.all([
            fetch("https://supportive-flame-83924d0cf8.strapiapp.com/api/menu-drinks").then((r) => r.json()),
            fetch("https://supportive-flame-83924d0cf8.strapiapp.com/api/menus").then((r) => r.json()),
        ])
            .then(([drinkRes, foodRes]) => {
                setDrinks(drinkRes?.data ?? []);
                setFood(foodRes?.data ?? []);
            })
            .catch(() => {
                setDrinks([]);
                setFood([]);
            });
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
                {Object.keys(grouped).length === 0 ? (
                    <p className={styles.empty}>Il menu drink non è disponibile al momento.</p>
                ) : (
                    Object.entries(grouped).map(([tipologia, items]) => (
                        <section key={tipologia} id={tipologia}>
                            <h2 className={styles.heading}>
                                {tipologia.charAt(0).toUpperCase() + tipologia.slice(1)}
                            </h2>

                            <ul className={styles.list}>
                                {items.map((item) => {
                                    const piatto = item.coll_food ? foodByDocumentId.get(item.coll_food) : undefined;

                                    return (
                                        <li
                                            key={item.documentId}
                                            id={`drink-${item.documentId}`}
                                            className={styles.item}
                                        >
                                            <div className={styles.details}>
                                                <h4 className={styles.nameItem}>{item.nome}</h4>
                                                {item.descrizione && <p>{item.descrizione}</p>}

                                                {/* CONSIGLIATO CON (Food) */}
                                                {piatto && (
                                                    <div className={styles.pairing}>
                                                        <span className={styles.pairingLabel}>Provalo con:</span>

                                                        <a
                                                            href={`/menu-food#food-${piatto.documentId}`}
                                                            className={styles.pairingCard}
                                                            aria-label={`Vedi ${piatto.nome} nel menu food`}
                                                        >
                                                            <span className={styles.pairingIcon}>🍴 </span>
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
        </div>
    );
}
