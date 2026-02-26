import type { Metadata } from "next";
import Image from "next/image";

import styles from "@/styles/chi-siamo.module.scss";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/HeroCarousel";

export const metadata: Metadata = {
  title: "Chi Siamo | Sbajo Cocktail Bar - La Nostra Storia e Atmosfera",
  description:
    "La storia di Sbajo: cocktail con carattere, cucina creativa ed eventi sbajati. Scopri l'atmosfera unica e chi c'è dietro questo locale ad Aprilia.",
  keywords: "chi siamo, sbajo, storia, cocktail bar, aprilia, atmosfera",
  alternates: { canonical: "https://sbajococktailbar.it/chi-siamo" },
  openGraph: {
    title: "Chi Siamo | Sbajo Cocktail Bar",
    description:
      "Scopri la storia di Sbajo: passione per cocktail, cucina creativa e serate indimenticabili.",
    url: "https://sbajococktailbar.it/chi-siamo",
    type: "website",
    locale: "it_IT",
  },
};

const aboutImages = [
  "/assets/img/about1.jpg",
  "/assets/img/about2.jpg",
  "/assets/img/about3.jpg",
  "/assets/img/about4.jpg",
];

const MAPS_URL = "https://maps.apple.com/?q=Sbajo"; // metti indirizzo vero

export default function ChiSiamoPage() {
  return (
    <div className={styles.wrapper}>
      <HeroCarousel images={aboutImages} />
      <div className={styles.scrim} aria-hidden="true" />

      <Header />

      <main className={styles.scrollArea}>
        <section className={styles.card}>
          <div className={styles.media}>
            <Image
              src="/assets/img/sbajo-50.jpg"
              alt="Silvio"
              className={styles.photo}
              width={720}
              height={900}
              priority
            />
          </div>

          <div className={styles.content}>
            <h1 className={styles.title}>Silvio</h1>
            <p className={styles.text}>
              Sbajo nasce da un’intuizione semplice ma potente: trasformare
              l’imprevisto, l’insolito, ciò che “non dovrebbe funzionare”, in
              quell’elemento che rende la serata indimenticabile. È il luogo
              dove i cocktail hanno personalità, la cucina osa, gli eventi
              sorprendono e l’atmosfera ti invita sempre a fermarti per “un
              ultimo giro”. Vogliamo creare uno spazio in cui chiunque possa
              sentirsi libero, accolto e a proprio agio, anche quando ci si
              sente uno Sbajo!
            </p>
          </div>
        </section>

        <section className={styles.hero}>
          <p className={styles.sub}>
            Chi siamo? Se non lo sai è un grande sbajo!
          </p>
          <p className={styles.discover}>Scoprilo qui</p>
          <span className={styles.arrowDown} aria-hidden="true">
            ↓
          </span>
        </section>
      </main>

      <Footer />
    </div>
  );
}
