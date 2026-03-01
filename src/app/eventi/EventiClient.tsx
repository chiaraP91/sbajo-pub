/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import styles from "@/styles/eventi.module.scss";
import { getCachedData, setCachedData } from "@/lib/firebase-cache";

export type EventItem = {
  id: string;
  day?: string;
  month?: string;
  title: string;
  description: string;
  imageUrl: string;
  cta?: string;
  href?: string;
  dateISO?: string;
};

function monthLabel(monthNum?: number): string {
  if (monthNum == null) return "";
  const months = [
    "GEN",
    "FEB",
    "MAR",
    "APR",
    "MAG",
    "GIU",
    "LUG",
    "AGO",
    "SET",
    "OTT",
    "NOV",
    "DIC",
  ];
  return months[monthNum - 1] || "";
}

function isFutureEvent(dateISO?: string): boolean {
  if (!dateISO) return true; // Se non ha data, lo consideriamo futuro
  try {
    const eventDate = new Date(dateISO);
    const now = new Date();
    return eventDate > now;
  } catch (e) {
    return true;
  }
}

export default function EventiClient() {
  const [items, setItems] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPastEvents, setShowPastEvents] = useState(false);

  useEffect(() => {
    async function loadEvents() {
      try {
        // Controlla cache prima di fare richiesta a Firestore
        const cachedEvents = getCachedData<EventItem[]>("eventi");
        if (cachedEvents) {
          setItems(cachedEvents);
          setLoading(false);
          return;
        }

        const querySnapshot = await getDocs(collection(db, "eventi"));
        const events: EventItem[] = querySnapshot.docs
          .map((doc) => {
            const data = doc.data() as any;
            let day = "";
            let month = "";

            if (data.dateISO) {
              try {
                const d = new Date(data.dateISO);
                day = String(d.getDate()).padStart(2, "0");
                month = monthLabel(d.getMonth() + 1);
              } catch (e) {
                console.error("Date parsing error:", e);
              }
            }

            return {
              id: doc.id,
              day,
              month,
              title: data.title || "",
              description: data.description || "",
              imageUrl: data.imageUrl || "",
              cta: data.cta,
              href: data.href,
              dateISO: data.dateISO,
            };
          })
          .filter((e) => e.cta !== false && e.description !== false);
        // Filter out non-available events (where disponibile is false)
        const filtered = events.filter((e) => {
          // Get original doc data to check disponibile field
          return true; // For now, show all loaded events
        });

        // Salva in cache
        setCachedData("eventi", filtered);
        setItems(filtered);
      } catch (err) {
        console.error("Error loading events:", err);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  if (loading) {
    return (
      <div className={styles.eventsList}>
        <p className={styles.empty}>Sto caricando gli eventi…</p>
      </div>
    );
  }

  const futureItems = items.filter((e) => isFutureEvent(e.dateISO));
  const displayedItems = showPastEvents ? items : futureItems;

  if (items.length === 0) {
    return (
      <div className={styles.eventsList}>
        <p className={styles.empty}>Nessun evento disponibile al momento.</p>
      </div>
    );
  }

  return (
    <div>
      {futureItems.length === 0 && items.length > 0 && !showPastEvents && (
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <p style={{ marginBottom: "1rem" }}>
            Non ci sono eventi in programma al momento.
          </p>
          <button
            onClick={() => setShowPastEvents(true)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#a8774d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "600",
            }}
          >
            Vedi eventi passati
          </button>
        </div>
      )}

      {displayedItems.length === 0 && showPastEvents && (
        <div className={styles.eventsList}>
          <p className={styles.empty}>Nessun evento disponibile.</p>
        </div>
      )}

      {displayedItems.length > 0 && (
        <>
          {showPastEvents && items.length > futureItems.length && (
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <button
                onClick={() => setShowPastEvents(false)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#a8774d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: "600",
                }}
              >
                Nascondi eventi passati
              </button>
            </div>
          )}

          <div className={styles.eventsList}>
            {displayedItems.map((e) => (
              <article key={e.id} className={styles.eventCard}>
                <div className={styles.eventBorder} />

                {e.day && e.month && (
                  <div className={styles.eventDate}>
                    <span className={styles.eventDay}>{e.day}</span>
                    <span className={styles.eventMonth}>{e.month}</span>
                  </div>
                )}

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
            ))}
          </div>
        </>
      )}
    </div>
  );
}
