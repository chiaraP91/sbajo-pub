import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import styles from "@/styles/eventi.module.scss";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EventiClient from "./EventiClient";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Eventi | Sbajo Cocktail Bar - Serate Speciali e Appuntamenti",
  description:
    "Eventi sbajati, serate speciali, live music e appuntamenti imperdibili. Scopri gli eventi di Sbajo Cocktail Bar ad Aprilia.",
  keywords: "eventi Aprilia, serate Aprilia, live music, aperitivo, festa",
  alternates: { canonical: "https://sbajococktailbar.it/eventi" },
  openGraph: {
    title: "Eventi | Sbajo Cocktail Bar",
    description: "Serate speciali e appuntamenti sbajati. Gli eventi di Sbajo.",
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
