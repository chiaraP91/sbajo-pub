import styles from "@/styles/chi-siamo.module.scss";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/HeroCarousel";

const aboutImages = [
  "/assets/img/about1.jpg",
  "/assets/img/about2.jpg",
  "/assets/img/about3.jpg",
  "/assets/img/about4.jpg",
];

// Metti qui il link “Maps” che usi nel footer (stesso identico)
const MAPS_URL =
  "https://maps.apple.com/?q=Sbajo"; // <-- sostituisci con indirizzo/coordinate reali

export default function ChiSiamoPage() {
  return (
    <div className={styles.wrapper}>
      <HeroCarousel images={aboutImages} />
      <div className={styles.scrim} aria-hidden="true" />

      <Header />

      <main className={styles.scrollArea}>
        <section className={styles.hero}>
          <div className={styles.brandMark}>SBAJO</div>
          <p className={styles.sub}>
           Chi siamo non lo sai? un grande sbajo...
          </p>

          <a className={styles.cta} href={MAPS_URL} target="_blank" rel="noreferrer">
            Apri Maps e vieni a trovarci!
          </a>
        </section>

        <section className={styles.card}>
          <div className={styles.media}>
            {/* Metti la foto di Silvio qui */}
            <img
              src="/assets/img/silvio.jpg"
              alt="Silvio"
              className={styles.photo}
            />
          </div>

          <div className={styles.content}>
            <h2 className={styles.title}>Silvio</h2>
            <p className={styles.text}>
              Sbajo nasce da un’idea semplice: prendere ciò che “non dovrebbe funzionare”
              e farlo diventare la cosa più giusta della serata. Cocktail con carattere,
              cucina creativa, eventi, e quell’atmosfera che ti fa restare “solo un altro giro”.
            </p>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
