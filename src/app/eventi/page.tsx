import React from "react";
import styles from '@/styles/eventi.module.scss';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export type EventItem = {
  id: string | number;
  day: string;      // "10"
  month: string;    // "MAGGIO"
  title: string;
  description: string;
  imageUrl: string;
  cta?: string;
  href?: string;
};

type EventsSectionProps = {
  events?: EventItem[];
};

const DEFAULT_EVENTS: EventItem[] = [
  {
    id: 1,
    day: "10",
    month: "MAGGIO",
    title: "Gin Tonic & Vinyl Night",
    description: "Una serata per appassionati di gin, vinili e serate sbajate.",
    imageUrl: "/assets/img/drink1.png",
    cta: "Prenota il tuo posto",
    href: "/prenota"
  },
  {
    id: 2,
    day: "26",
    month: "APRILE",
    title: "Aperitivo Swing",
    description: "Live band, swing e cocktail old fashioned fino a tardi.",
    imageUrl: "/assets/img/drink2.png",
    cta: "Scopri di più",
    href: "/eventi/aperitivo-swing"
  }
];

const EventiPage: React.FC<EventsSectionProps> = ({ events }) => {
  const items = events ?? DEFAULT_EVENTS;

  return (
    <section className={styles.events}>
      <Header />
      <div className={styles.eventsHeader}>
        <h2 className={styles.eventsTitle}>Eventi Sbajati</h2>
        <p className={styles.eventsSubtitle}>
          Dove anche la serata prende una piega diversa.
          <br />
          Cocktail speciali, musica dal vivo e cose che non ti aspetti.
        </p>
      </div>

      <div className={styles.eventsList}>
        {items.map((e) => (
          <article key={e.id} className={styles.eventCard}>
            <div className={styles.eventBorder} />

            <div className={styles.eventDate}>
              <span className={styles.eventDay}>{e.day}</span>
              <span className={styles.eventMonth}>{e.month}</span>
            </div>

            <div className={styles.eventImageWrapper}>
              <img
                src={e.imageUrl}
                className={styles.eventImage}
                alt={e.title}
              />
            </div>

            <div className={styles.eventContent}>
              <h3 className={styles.eventTitle}>{e.title}</h3>
              <p className={styles.eventDescription}>{e.description}</p>

              {e.cta && (
                <a className={styles.eventButton} href={e.href ?? "#"}>
                  {e.cta}
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
      <Footer />
    </section>
  );
};

export default EventiPage;
