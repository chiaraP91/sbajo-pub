import type { Metadata } from "next";
import styles from "@/styles/menu.module.scss";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import MenuFoodClient from "./MenuFoodClient";

export const dynamic = "force-static";

const foodImages = [
  "/assets/img/sbajo-29.jpg",
  "/assets/img/sbajo-19.jpg",
  "/assets/img/sbajo-16.jpg",
  "/assets/img/sbajo-30.jpg",
];

export const metadata: Metadata = {
  title: "Menu Food | Sbajo Cocktail Bar - Cucina Creativa, Burger, Dolci",
  description:
    "Menu food di Sbajo: piatti creativi, burger gourmet, dolci homemade e appetizer sfiziosissimi. Scopri la cucina creativa adAprilia.",
  keywords: "cucina creativa Aprilia, burger Aprilia, dolci, cena, menu, food",
  alternates: { canonical: "https://sbajococktailbar.it/menu-food" },
  openGraph: {
    title: "Menu Food | Sbajo Cocktail Bar",
    description:
      "Cucina creativa e piatti gourmet. Scopri il nostro menu food esclusivo.",
    url: "https://sbajococktailbar.it/menu-food",
    type: "website",
    locale: "it_IT",
  },
};

export default function MenuFoodPage() {
  return (
    <div className={styles.wrapper}>
      <HeroCarousel images={foodImages} />
      <div className={styles.scrim} aria-hidden="true" />

      <Header />

      <main id="menu-scroll" className={styles.scrollArea}>
        <MenuFoodClient />
      </main>

      <Footer />
    </div>
  );
}
