/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metadata } from "next";
import styles from "@/styles/menu.module.scss";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import MenuDrinkClient from "./MenuDrinkClient";
import { headers } from "next/headers";

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
  title: "Menu Drink | Sbajo Cocktail Bar",
  description: "Cocktail, birre, vini e soft drink. Scopri il menu drink di Sbajo.",
 alternates: { canonical: "https://sbajococktailbar.it/menu-drink" },
};

type FoodMin = { numericId: number; name: string };

type DrinkMin = {
  numericId: number;
  name: string;
  description: string;
  category: string;
  price: number | null;
  allergens: string[];
  linkFoodId: number | null;
  linkDrinkId: number | null;
  disponibile: boolean;
};

async function getMenuDrinkPageData(): Promise<{ drinks: DrinkMin[]; food: FoodMin[] }> {
  const h = await headers();
  const host = h.get("host");
  const proto =
    process.env.NODE_ENV === "development" ? "http" : "https";

  const url = `${proto}://${host}/api/menu-drink-page`;

  const res = await fetch(url, { next: { revalidate: 3600 } });

  if (!res.ok) return { drinks: [], food: [] };

  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    const t = await res.text();
    console.error("Expected JSON, got:", ct, t.slice(0, 200));
    return { drinks: [], food: [] };
  }

  return res.json();
}


export default async function MenuDrinkPage() {
  const { drinks, food } = await getMenuDrinkPageData();

  return (
    <div className={styles.wrapper}>
      <HeroCarousel images={drinkImages} />
      <div className={styles.scrim} aria-hidden="true" />
      <Header />

      <main id="menu-scroll" className={styles.scrollArea}>
        <MenuDrinkClient drinks={drinks} food={food} />
      </main>

      <Footer />
    </div>
  );
}
