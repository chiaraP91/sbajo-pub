import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import BackgroundCarousel from "@/components/BackgroundCarousel";
import Footer from "@/components/Footer";
import styles from "@/styles/home.module.scss";

export const metadata: Metadata = {
  title: "Sbajo | Cocktail Bar e Pub a Pomezia",
  description:
    "Sbajo e un cocktail bar e pub a Pomezia dove trovare aperitivi, cocktail signature, birre, vini, cucina creativa ed eventi. Scopri menu e prenotazioni.",
  keywords:
    "cocktail bar Pomezia, pub Pomezia, aperitivo Pomezia, drink Pomezia, menu cocktail Pomezia, pub con cucina Pomezia",
  alternates: { canonical: "https://sbajococktailbar.it/" },
  openGraph: {
    title: "Sbajo | Cocktail Bar e Pub a Pomezia",
    description:
      "Cocktail bar e pub a Pomezia con aperitivi, cucina creativa ed eventi.",
    url: "https://sbajococktailbar.it/",
    siteName: "Sbajo Cocktail Bar",
    locale: "it_IT",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <div className={styles.wrapper}>
      <main className={styles.main}>
        <BackgroundCarousel />
        <div className={styles.scrim} aria-hidden="true" />

        <header className={styles.content}>
          <Image
            src="/assets/img/logo3.png"
            alt="Sbajo Cocktail Bar"
            className={styles.logo}
            width={520}
            height={520}
            priority
          />
          {/* SEO: h1 reale, ma invisibile se vuoi */}
          <h1 className={styles.srOnly}>Sbajo Cocktail Bar</h1>
        </header>

        <nav className={styles.actions} aria-label="Sezioni principali">
          <div className={styles.actionsPanel}>
            <Link href="/menu-drink" className={styles.actionBtn}>
              <span className={styles.actionText}>Cocktail</span>
              <span className={styles.actionArrow} aria-hidden="true">
                ›
              </span>
            </Link>

            <Link href="/menu-food" className={styles.actionBtn}>
              <span className={styles.actionText}>Cucina creativa</span>
              <span className={styles.actionArrow} aria-hidden="true">
                ›
              </span>
            </Link>

            <Link href="/eventi" className={styles.actionBtn}>
              <span className={styles.actionText}>Eventi</span>
              <span className={styles.actionArrow} aria-hidden="true">
                ›
              </span>
            </Link>

            <Link href="/chi-siamo" className={styles.actionBtn}>
              <span className={styles.actionText}>Chi siamo</span>
              <span className={styles.actionArrow} aria-hidden="true">
                ›
              </span>
            </Link>
          </div>
        </nav>
      </main>

      <Footer />
    </div>
  );
}
