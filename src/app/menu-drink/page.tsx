import styles from '@/styles/menu.module.scss';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import HeroCarousel from '@/components/HeroCarousel';

const foodImages = [
    '/assets/img/drink1.png',
    '/assets/img/drink2.png',
    '/assets/img/drink3.png',
    '/assets/img/drink4.png',
];



export default function MenuFoodPage() {
    return (
        <div className={styles.wrapper}>
            <HeroCarousel images={foodImages} />
            <div className={styles.scrim} aria-hidden="true" />

            <Header />
            <main className={styles.scrollArea}>

                <section id="alcolici">
                    <h2 className={styles.heading}>Alcolici</h2>
                    <ul className={styles.list}>
                        <li className={styles.item}>
                            <div className={styles.details}>
                                <h4 className={styles.nameItem}>Negroni <span className={styles.codes}>[12]</span></h4>
                                <p>Gin, vermouth rosso, bitter</p>
                            </div>
                            <span className={styles.price}>€8</span>
                        </li>
                        <li className={styles.item}>
                            <div className={styles.details}>
                                <h4 className={styles.nameItem}>Spritz <span className={styles.codes}>[12]</span></h4>
                                <p>Aperol, prosecco, soda</p>
                            </div>
                            <span className={styles.price}>€7</span>
                        </li>
                        <li className={styles.item}>
                            <div className={styles.details}>
                                <h4 className={styles.nameItem}>Moscow Mule <span className={styles.codes}>[12]</span></h4>
                                <p>Vodka, ginger beer, lime</p>
                            </div>
                            <span className={styles.price}>€9</span>
                        </li>
                        <li className={styles.item}>
                            <div className={styles.details}>
                                <h4 className={styles.nameItem}>Gin Tonic <span className={styles.codes}>[12]</span></h4>
                                <p>Gin premium, acqua tonica</p>
                            </div>
                            <span className={styles.price}>€8</span>
                        </li>
                        <li className={styles.item}>
                            <div className={styles.details}>
                                <h4 className={styles.nameItem}>Rum & Cola <span className={styles.codes}>[12]</span></h4>
                                <p>Rum scuro, cola</p>
                            </div>
                            <span className={styles.price}>€7</span>
                        </li>
                    </ul>
                </section>
                <section id="analcolici">
                    <h2 className={styles.heading}>Analcolici</h2>
                    <ul className={styles.list}>
                        <li className={styles.item}>
                            <div className={styles.details}>
                                <h4 className={styles.nameItem}>Mocktail Tropicale <span className={styles.codes}>[6]</span></h4>
                                <p>Succo d’ananas, lime, menta</p>
                            </div>
                            <span className={styles.price}>€6</span>
                        </li>
                        <li className={styles.item}>
                            <div className={styles.details}>
                                <h4 className={styles.nameItem}>Virgin Mojito <span className={styles.codes}>[6]</span></h4>
                                <p>Lime, menta, zucchero, soda</p>
                            </div>
                            <span className={styles.price}>€6</span>
                        </li>
                        <li className={styles.item}>
                            <div className={styles.details}>
                                <h4 className={styles.nameItem}>Frullato Mango <span className={styles.codes}>[7]</span></h4>
                                <p>Mango fresco, yogurt, miele</p>
                            </div>
                            <span className={styles.price}>€5</span>
                        </li>
                        <li className={styles.item}>
                            <div className={styles.details}>
                                <h4 className={styles.nameItem}>Succo ACE <span className={styles.codes}>-</span></h4>
                                <p>Arancia, carota, limone</p>
                            </div>
                            <span className={styles.price}>€4</span>
                        </li>
                        <li className={styles.item}>
                            <div className={styles.details}>
                                <h4 className={styles.nameItem}>Tè freddo alla pesca <span className={styles.codes}>-</span></h4>
                                <p>Infuso naturale, ghiaccio</p>
                            </div>
                            <span className={styles.price}>€4</span>
                        </li>
                    </ul>
                </section>
                <section id="soft">
                    <h2 className={styles.heading}>Soft Drink</h2>
                    <ul className={styles.list}>
                        <li className={styles.item}>
                            <div className={styles.details}>
                                <h4 className={styles.nameItem}>Coca-Cola <span className={styles.codes}>-</span></h4>
                                <p>Classica o Zero</p>
                            </div>
                            <span className={styles.price}>€3</span>
                        </li>
                        <li className={styles.item}>
                            <div className={styles.details}>
                                <h4 className={styles.nameItem}>Fanta <span className={styles.codes}>-</span></h4>
                                <p>Arancia o limone</p>
                            </div>
                            <span className={styles.price}>€3</span>
                        </li>
                        <li className={styles.item}>
                            <div className={styles.details}>
                                <h4 className={styles.nameItem}>Sprite <span className={styles.codes}>-</span></h4>
                                <p>Bevanda al limone</p>
                            </div>
                            <span className={styles.price}>€3</span>
                        </li>
                        <li className={styles.item}>
                            <div className={styles.details}>
                                <h4 className={styles.nameItem}>Acqua naturale <span className={styles.codes}>-</span></h4>
                                <p>Bottiglia 50cl</p>
                            </div>
                            <span className={styles.price}>€2</span>
                        </li>
                        <li className={styles.item}>
                            <div className={styles.details}>
                                <h4 className={styles.nameItem}>Acqua frizzante <span className={styles.codes}>-</span></h4>
                                <p>Bottiglia 50cl</p>
                            </div>
                            <span className={styles.price}>€2</span>
                        </li>
                    </ul>
                </section>
                <section id="vino">
                    <h2 className={styles.heading}>Vino</h2>
                    <ul className={styles.list}>
                        <li className={styles.item}>
                            <div className={styles.details}>
                                <h4 className={styles.nameItem}>Prosecco DOC <span className={styles.codes}>[12]</span></h4>
                                <p>Bollicine fresche, note fruttate</p>
                            </div>
                            <span className={styles.price}>€5</span>
                        </li>
                        <li className={styles.item}>
                            <div className={styles.details}>
                                <h4 className={styles.nameItem}>Chardonnay <span className={styles.codes}>[12]</span></h4>
                                <p>Bianco secco, aroma floreale</p>
                            </div>
                            <span className={styles.price}>€6</span>
                        </li>
                        <li className={styles.item}>
                            <div className={styles.details}>
                                <h4 className={styles.nameItem}>Rosso Montepulciano <span className={styles.codes}>[12]</span></h4>
                                <p>Corposo, note di frutti rossi</p>
                            </div>
                            <span className={styles.price}>€6</span>
                        </li>
                        <li className={styles.item}>
                            <div className={styles.details}>
                                <h4 className={styles.nameItem}>Rosé frizzante <span className={styles.codes}>[12]</span></h4>
                                <p>Delicato, fresco, leggermente dolce</p>
                            </div>
                            <span className={styles.price}>€5</span>
                        </li>
                        <li className={styles.item}>
                            <div className={styles.details}>
                                <h4 className={styles.nameItem}>Vino della casa <span className={styles.codes}>[12]</span></h4>
                                <p>Bianco o rosso, calice</p>
                            </div>
                            <span className={styles.price}>€4</span>
                        </li>
                    </ul>
                </section>
                <section id="birra">
                    <h2 className={styles.heading}>Birra</h2>
                    <ul className={styles.list}>
                        <li className={styles.item}>
                            <div className={styles.details}>
                                <h4 className={styles.nameItem}>Birra chiara <span className={styles.codes}>[1, 12]</span></h4>
                                <p>Leggera, bassa fermentazione, servita fredda</p>
                            </div>
                            <span className={styles.price}>€5</span>
                        </li>
                        <li className={styles.item}>
                            <div className={styles.details}>
                                <h4 className={styles.nameItem}>Birra ambrata <span className={styles.codes}>[1, 12]</span></h4>
                                <p>Note caramellate, corpo medio</p>
                            </div>
                            <span className={styles.price}>€6</span>
                        </li>
                        <li className={styles.item}>
                            <div className={styles.details}>
                                <h4 className={styles.nameItem}>Birra IPA <span className={styles.codes}>[1, 12]</span></h4>
                                <p>Amara, aromi agrumati e luppolo intenso</p>
                            </div>
                            <span className={styles.price}>€6</span>
                        </li>
                        <li className={styles.item}>
                            <div className={styles.details}>
                                <h4 className={styles.nameItem}>Birra rossa <span className={styles.codes}>[1, 12]</span></h4>
                                <p>Corposa, retrogusto tostato</p>
                            </div>
                            <span className={styles.price}>€6</span>
                        </li>
                        <li className={styles.item}>
                            <div className={styles.details}>
                                <h4 className={styles.nameItem}>Birra analcolica <span className={styles.codes}>[1]</span></h4>
                                <p>Gusto classico, zero alcol</p>
                            </div>
                            <span className={styles.price}>€4</span>
                        </li>
                    </ul>
                </section>


            </main>

            <nav className={styles.anchorNav}>
                <a href="#alcolici" title="Alcolici">🍸</a>
                <a href="#analcolici" title="Analcolici">🍺</a>
                <a href="#birra" title="Birra">🍺</a>
                <a href="#vino" title="Vino">🍷</a>
                <a href="#soft" title="Soft">🍺</a>
            </nav>

            <Footer />
        </div>
    );
}