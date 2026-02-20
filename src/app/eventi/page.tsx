import type { Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";

import styles from "@/styles/eventi.module.scss";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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

export type EventItem = {
  id: string;
  day: string;
  month: string;
  title: string;
  description: string;
  imageUrl: string;
  cta?: string;
  href?: string;
};

async function getEvents(): Promise<EventItem[]> {
  const h = await headers();
  const host = h.get("host");
  const proto = process.env.NODE_ENV === "development" ? "http" : "https";

  const url = `${proto}://${host}/api/eventi`;

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return [];

  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) return [];

  return res.json();
}

export default async function EventiPage() {
  const items = await getEvents();

  return (
    <section className={styles.events}>
      <Header />

      <div className={styles.eventsHeader}>
        <h1 className={styles.eventsTitle}>Eventi Sbajati</h1>
      </div>

      <div className={styles.eventsList}>
        {items.length === 0 ? (
          <p className={styles.empty}>Nessun evento disponibile al momento.</p>
        ) : (
          items.map((e) => (
            <article key={e.id} className={styles.eventCard}>
              <div className={styles.eventBorder} />

              <div className={styles.eventDate}>
                <span className={styles.eventDay}>{e.day}</span>
                <span className={styles.eventMonth}>{e.month}</span>
              </div>

              <div className={styles.eventImageWrapper}>
                <Image
                  src={e.imageUrl}
                  className={styles.eventImage}
                  alt={e.title}
                  width={1200}
                  height={1600}
                  sizes="(max-width: 768px) 90vw, 520px"
                />
              </div>

              <div className={styles.eventContent}>
                <h2 className={styles.eventTitle}>{e.title}</h2>
                <p className={styles.eventDescription}>{e.description}</p>

                {e.cta &&
                  (e.href ? (
                    <Link className={styles.eventButton} href={e.href}>
                      {e.cta}
                    </Link>
                  ) : (
                    <span className={styles.eventButton} aria-disabled="true">
                      {e.cta}
                    </span>
                  ))}
              </div>
            </article>
          ))
        )}
      </div>

      <Footer />
    </section>
  );
}
