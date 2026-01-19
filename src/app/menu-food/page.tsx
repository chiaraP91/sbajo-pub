import type { Metadata } from "next";
import styles from "@/styles/menu.module.scss";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import MenuFoodClient from "./MenuFoodClient";
import { headers } from "next/headers";

const foodImages = [
  "/assets/img/sbajo-29.jpg",
  "/assets/img/sbajo-19.jpg",
  "/assets/img/sbajo-16.jpg",
  "/assets/img/sbajo-30.jpg",
];

export const metadata: Metadata = {
  title: "Menu Food | Sbajo Cocktail Bar",
  description: "Cucina creativa, burger, dolci e appetizer. Scopri il menu food di Sbajo.",
  alternates: { canonical: "https://sbajococktailbar.it/menu-food" },
};

type Food = {
  numericId: number;
  name: string;
  description: string;
  category: string;
  price: number | null;
  allergens: number[];
  linkFoodId: number | null;
  linkDrinkId: number | null;
  disponibile: boolean;
};

type DrinkMin = { numericId: number; name: string };

async function getMenuFoodPageData(): Promise<{ menu: Food[]; drinks: DrinkMin[] }> {
  const h = await headers();
  const host = h.get("host");
  const proto = process.env.NODE_ENV === "development" ? "http" : "https";

  const url = `${proto}://${host}/api/menu-food-page`;

  const res = await fetch(url, { next: { revalidate: 3600 } });

  if (!res.ok) return { menu: [], drinks: [] };

  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    const t = await res.text();
    console.error("Expected JSON, got:", ct, t.slice(0, 200));
    return { menu: [], drinks: [] };
  }

  return res.json();
}


export default async function MenuFoodPage() {
  const { menu, drinks } = await getMenuFoodPageData();

  return (
    <div className={styles.wrapper}>
      <HeroCarousel images={foodImages} />
      <div className={styles.scrim} aria-hidden="true" />

      <Header />

      <main id="menu-scroll" className={styles.scrollArea}>
        <MenuFoodClient menu={menu} drinks={drinks} />
      </main>

      <Footer />
    </div>
  );
}
