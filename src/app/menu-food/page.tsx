<<<<<<< HEAD
=======
"use client";

>>>>>>> master
import styles from '@/styles/menu.module.scss';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import HeroCarousel from '@/components/HeroCarousel';
<<<<<<< HEAD
=======
import { useEffect, useState } from 'react';
>>>>>>> master

const foodImages = [
  '/assets/img/pasta.png',
  '/assets/img/burger.png',
  '/assets/img/dolci.png',
  '/assets/img/snack.png',
];

<<<<<<< HEAD


export default function MenuFoodPage() {
  return (
    <div className={styles.wrapper}>
       <HeroCarousel images={foodImages} />
=======
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
    fetch("https://impressive-crown-9f9b0c2b2cb2b.strapiapp.com/api/menus")
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
>>>>>>> master
      <div className={styles.scrim} aria-hidden="true" />

      <Header />
      <main className={styles.scrollArea}>
<<<<<<< HEAD

        <section id="appetizer">
          <h2 className={styles.heading}>Appetizer</h2>
          <ul className={styles.list}>
            <li className={styles.item}>
              <div className={styles.details}>
                <h4 className={styles.nameItem}>Bruschetta Classica <span className={styles.codes}>[1]</span></h4>
                <p>Pane tostato, pomodoro, basilico, olio EVO</p>
              </div>
              <span className={styles.price}>€5</span>
            </li>
            <li className={styles.item}>
              <div className={styles.details}>
                <h4 className={styles.nameItem}>Mini Caprese <span className={styles.codes}>[7]</span></h4>
                <p>Mozzarella di bufala, pomodoro, pesto</p>
              </div>
              <span className={styles.price}>€6</span>
            </li>
            <li className={styles.item}>
              <div className={styles.details}>
                <h4 className={styles.nameItem}>Olive marinate <span className={styles.codes}>-</span></h4>
                <p>Olive verdi e nere, erbe aromatiche</p>
              </div>
              <span className={styles.price}>€4</span>
            </li>
            <li className={styles.item}>
              <div className={styles.details}>
                <h4 className={styles.nameItem}>Hummus & Pita <span className={styles.codes}>[1, 11]</span></h4>
                <p>Crema di ceci, paprika affumicata, pane pita</p>
              </div>
              <span className={styles.price}>€6</span>
            </li>
            <li className={styles.item}>
              <div className={styles.details}>
                <h4 className={styles.nameItem}>Frittelle di zucchine <span className={styles.codes}>[1, 3]</span></h4>
                <p>Zucchine, uova, farina, menta</p>
              </div>
              <span className={styles.price}>€5</span>
            </li>
          </ul>
        </section>

        <section id="burger">
          <h2 className={styles.heading}>Burger</h2>
          <ul className={styles.list}>
            <li className={styles.item}>
              <div className={styles.details}>
                <h4 className={styles.nameItem}>SbaJo Burger <span className={styles.codes}>[1, 3, 7]</span></h4>
                <p>Manzo, cheddar, cipolla caramellata, salsa BBQ</p>
              </div>
              <span className={styles.price}>€12</span>
            </li>
            <li className={styles.item}>
              <div className={styles.details}>
                <h4 className={styles.nameItem}>Veggie Burger <span className={styles.codes}>[1, 11]</span></h4>
                <p>Falafel, hummus, lattuga, pomodoro</p>
              </div>
              <span className={styles.price}>€11</span>
            </li>
            <li className={styles.item}>
              <div className={styles.details}>
                <h4 className={styles.nameItem}>Chicken Burger <span className={styles.codes}>[1, 3]</span></h4>
                <p>Pollo croccante, maionese, insalata</p>
              </div>
              <span className={styles.price}>€11</span>
            </li>
            <li className={styles.item}>
              <div className={styles.details}>
                <h4 className={styles.nameItem}>Double Cheese <span className={styles.codes}>[1, 7]</span></h4>
                <p>Manzo doppio, cheddar, salsa senape</p>
              </div>
              <span className={styles.price}>€13</span>
            </li>
            <li className={styles.item}>
              <div className={styles.details}>
                <h4 className={styles.nameItem}>Truffle Burger <span className={styles.codes}>[1, 7]</span></h4>
                <p>Manzo, crema al tartufo, rucola</p>
              </div>
              <span className={styles.price}>€14</span>
            </li>
          </ul>
        </section>

        <section id="dolci">
          <h2 className={styles.heading}>Dolci</h2>
          <ul className={styles.list}>
            <li className={styles.item}>
              <div className={styles.details}>
                <h4 className={styles.nameItem}>Tiramisù <span className={styles.codes}>[1, 3, 7]</span></h4>
                <p>Mascarpone, savoiardi, caffè</p>
              </div>
              <span className={styles.price}>€6</span>
            </li>
            <li className={styles.item}>
              <div className={styles.details}>
                <h4 className={styles.nameItem}>Brownie <span className={styles.codes}>[1, 3, 8]</span></h4>
                <p>Cioccolato fondente, noci, burro</p>
              </div>
              <span className={styles.price}>€5</span>
            </li>
            <li className={styles.item}>
              <div className={styles.details}>
                <h4 className={styles.nameItem}>Panna cotta <span className={styles.codes}>[7]</span></h4>
                <p>Panna fresca, vaniglia, frutti di bosco</p>
              </div>
              <span className={styles.price}>€5</span>
            </li>
            <li className={styles.item}>
              <div className={styles.details}>
                <h4 className={styles.nameItem}>Cheesecake <span className={styles.codes}>[1, 7]</span></h4>
                <p>Formaggio cremoso, biscotto, frutta</p>
              </div>
              <span className={styles.price}>€6</span>
            </li>
            <li className={styles.item}>
              <div className={styles.details}>
                <h4 className={styles.nameItem}>Gelato artigianale <span className={styles.codes}>[7]</span></h4>
                <p>Gusti assortiti: vaniglia, cioccolato, pistacchio</p>
              </div>
              <span className={styles.price}>€4</span>
            </li>
          </ul>
        </section>

        <section id="snack">
          <h2 className={styles.heading}>Snack</h2>
          <ul className={styles.list}>
            <li className={styles.item}>
              <div className={styles.details}>
                <h4 className={styles.nameItem}>Patatine fritte <span className={styles.codes}>-</span></h4>
                <p>Patate fresche, sale, olio</p>
              </div>
              <span className={styles.price}>€4</span>
            </li>
            <li className={styles.item}>
              <div className={styles.details}>
                <h4 className={styles.nameItem}>Nuggets <span className={styles.codes}>[1, 3]</span></h4>
                <p>Bocconcini di pollo impanati</p>
              </div>
              <span className={styles.price}>€5</span>
            </li>
            <li className={styles.item}>
              <div className={styles.details}>
                <h4 className={styles.nameItem}>Onion Rings <span className={styles.codes}>[1]</span></h4>
                <p>Anelli di cipolla fritti</p>
              </div>
              <span className={styles.price}>€4</span>
            </li>
            <li className={styles.item}>
              <div className={styles.details}>
                <h4 className={styles.nameItem}>Nachos <span className={styles.codes}>[1, 7]</span></h4>
                <p>Formaggio fuso, jalapeño, salsa</p>
              </div>
              <span className={styles.price}>€6</span>
            </li>
            <li className={styles.item}>
              <div className={styles.details}>
                <h4 className={styles.nameItem}>Popcorn speziati <span className={styles.codes}>-</span></h4>
                <p>Mais, paprika, sale</p>
              </div>
              <span className={styles.price}>€3</span>
            </li>
          </ul>
        </section>
=======
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
>>>>>>> master
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