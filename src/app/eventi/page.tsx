import type { Metadata } from "next";

import styles from "@/styles/eventi.module.scss";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EventiClient from "./EventiClient";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Eventi a Pomezia | Sbajo Cocktail Bar e Pub",
  description:
    "Eventi, serate speciali e appuntamenti da Sbajo, cocktail bar e pub a Pomezia. Scopri le prossime serate in programma.",
  keywords:
    "eventi Pomezia, serate Pomezia, pub Pomezia, cocktail bar Pomezia, live music Pomezia, aperitivo Pomezia",
  alternates: { canonical: "https://sbajococktailbar.it/eventi" },
  openGraph: {
    title: "Eventi a Pomezia | Sbajo Cocktail Bar e Pub",
    description: "Serate speciali, appuntamenti ed eventi da Sbajo a Pomezia.",
    url: "https://sbajococktailbar.it/eventi",
    type: "website",
    locale: "it_IT",
  },
};

export default function EventiPage() {
  return (
    <section className={styles.events}>
      <Header />

      <div className={styles.eventsHeader}>
        <h1 className={styles.eventsTitle}>Eventi Sbajati</h1>
      </div>

      <EventiClient />

      <Footer />
    </section>
  );
}
