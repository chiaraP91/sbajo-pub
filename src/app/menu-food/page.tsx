"use client";

import styles from '@/styles/menu.module.scss';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import HeroCarousel from '@/components/HeroCarousel';
import { useEffect, useState } from 'react';

const foodImages = [
  '/assets/img/pasta.png',
  '/assets/img/burger.png',
  '/assets/img/dolci.png',
  '/assets/img/snack.png',
];

interface Piatto {
  id: number;
  nome: string;
  descrizione: string;
  prezzo: number;
  allergeni?: string;
  tipologia?: string;
  attivo: boolean;
}

export default function MenuFoodPage() {
  const [menu, setMenu] = useState<Piatto[] | null>(null);

  useEffect(() => {
     fetch("https://supportive-flame-83924d0cf8.strapiapp.com/api/menus?populate=*")
      .then(res => res.json())
      .then(data => setMenu(data.data))
      .catch(() => setMenu([])); // fallback in caso di errore
  }, []);

  const piattiAttivi = menu?.filter(item => item.attivo) ?? [];

  const grouped: Record<string, Piatto[]> = piattiAttivi.reduce((acc, item) => {
    const cat = item.tipologia?.toLowerCase() || "altro";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, Piatto[]>);

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
                {items.map(item => (
                  <li key={item.id} className={styles.item}>
                    <div className={styles.details}>
                      <h4 className={styles.nameItem}>
                        {item.nome}
                        {item.allergeni && (
                          <span className={styles.codes}>
                            [{item.allergeni}]
                          </span>
                        )}
                      </h4>
                      <p>{item.descrizione}</p>
                    </div>
                    <span className={styles.price}>€{item.prezzo}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </main>

      <nav className={styles.anchorNav}>
        <a href="#appetizer" title="Appetizer">🥗</a>
        <a href="#burger" title="Burger">🍔</a>
        <a href="#dolci" title="Dolci">🍰</a>
        <a href="#snack" title="Snack">🍟</a>
      </nav>

      <Footer />
    </div>
  );
}