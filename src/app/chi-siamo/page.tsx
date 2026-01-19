import type { Metadata } from "next";
import Image from "next/image";

import styles from "@/styles/chi-siamo.module.scss";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/HeroCarousel";

export const metadata: Metadata = {
  title: "Chi siamo | Sbajo Cocktail Bar",
  description:
    "La storia di Sbajo: cocktail con carattere, cucina creativa ed eventi. Scopri l’atmosfera e chi c’è dietro.",
  alternates: { canonical: "https://sbajococktailbar.it/chi-siamo" },
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
              Sbajo nasce da un’intuizione semplice ma potente: trasformare l’imprevisto, l’insolito, ciò che “non dovrebbe funzionare”, in quell’elemento che rende la serata indimenticabile. È il luogo dove i cocktail hanno personalità, la cucina osa, gli eventi sorprendono e l’atmosfera ti invita sempre a fermarti per “un ultimo giro”.
Vogliamo creare uno spazio in cui chiunque possa sentirsi libero accolto e a proprio agio, anche quando ci Si sente uno Sbajo!
            </p>

            <a className={styles.mapBtn} href={MAPS_URL} target="_blank" rel="noreferrer">
              Dove siamo
            </a>
          </div>
        </section>

        <section className={styles.hero}>
          <p className={styles.sub}>Chi siamo? Se non lo sai è un grande sbajo!</p>
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
