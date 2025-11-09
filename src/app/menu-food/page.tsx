import styles from '@/styles/menu.module.scss';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import HeroCarousel from '@/components/HeroCarousel';

const foodImages = [
  '/assets/img/pasta.png',
  '/assets/img/burger.png',
  '/assets/img/dolci.png',
  '/assets/img/snack.png',
];



export default function MenuFoodPage() {
  return (
    <div className={styles.wrapper}>
       <HeroCarousel images={foodImages} />
      <div className={styles.scrim} aria-hidden="true" />

      <Header />
      <main className={styles.scrollArea}>

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