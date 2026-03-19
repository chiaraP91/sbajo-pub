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
  title: "Menu Food | Pub e Cocktail Bar a Pomezia | Sbajo",
  description:
    "Menu food di Sbajo a Pomezia: cucina creativa, burger gourmet, appetizer e dolci homemade per aperitivo e cena.",
  keywords:
    "menu food Pomezia, pub Pomezia con cucina, cocktail bar Pomezia, cucina creativa Pomezia, burger Pomezia, cena Pomezia",
  alternates: { canonical: "https://sbajococktailbar.it/menu-food" },
  openGraph: {
    title: "Menu Food | Sbajo Pub e Cocktail Bar a Pomezia",
    description:
      "Cucina creativa e piatti gourmet per aperitivo e cena da Sbajo a Pomezia.",
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
