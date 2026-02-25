/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metadata } from "next";
import styles from "@/styles/menu.module.scss";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import MenuDrinkClient from "./MenuDrinkClient";

export const dynamic = "force-static";

const drinkImages = [
  "/assets/img/sbajo-57.jpg",
  "/assets/img/sbajo-45.jpg",
  "/assets/img/sbajo-41.jpg",
  "/assets/img/sbajo-37.jpg",
  "/assets/img/sbajo-28.jpg",
  "/assets/img/sbajo-23.jpg",
  "/assets/img/sbajo-20.jpg",
  "/assets/img/sbajo-11.jpg",
  "/assets/img/sbajo-48.jpg",
];

export const metadata: Metadata = {
  title: "Menu Drink | Sbajo Cocktail Bar - Cocktail, Birre, Vini",
  description:
    "Menu drink esclusivo di Sbajo: cocktail signature, birre artigianali, vini selezionati e soft drink. Scopri le nostre creazioni uniche.",
  keywords:
    "cocktail Aprilia, birre Aprilia, vini, aperitivo, drink, menu cocktail",
  alternates: { canonical: "https://sbajococktailbar.it/menu-drink" },
  openGraph: {
    title: "Menu Drink | Sbajo Cocktail Bar",
    description:
      "Cocktail signature, birre e vini selezionati. Il nostro menu drink esclusivo.",
    url: "https://sbajococktailbar.it/menu-drink",
    type: "website",
    locale: "it_IT",
  },
};

export default function MenuDrinkPage() {
  return (
    <div className={styles.wrapper}>
      <HeroCarousel images={drinkImages} />
      <div className={styles.scrim} aria-hidden="true" />
      <Header />

      <main id="menu-scroll" className={styles.scrollArea}>
        <MenuDrinkClient />
      </main>

      <Footer />
    </div>
  );
}
