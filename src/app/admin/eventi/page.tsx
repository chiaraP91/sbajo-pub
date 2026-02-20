/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import styles from "@/styles/admin-eventi.module.scss";

type EventItem = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  disponibile: boolean;
  dateISO?: string;
  day?: string;
  month?: string;
};

export default function AdminEventiPage() {
  const router = useRouter();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    try {
      setLoading(true);
      const res = await fetch("/api/eventi");
      if (!res.ok) throw new Error("Errore nel caricamento eventi");

      const data = await res.json();
      setEvents(data);
    } catch (err: any) {
      setError(err?.message || "Errore nel caricamento eventi");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Sei sicura di voler eliminare questo evento?")) return;

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Non autenticata");

      const token = await user.getIdToken();

      const res = await fetch(`/api/admin/eventi/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Errore nell'eliminazione");

      // Ricarica lista
      loadEvents();
    } catch (err: any) {
      alert(err?.message || "Errore nell'eliminazione");
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Gestione Eventi</h1>
        <Link href="/admin/nuovo" className={styles.primaryBtn}>
          + Nuovo Evento
        </Link>
        <Link href="/admin/disponibilita" className={styles.secondaryBtn}>
          Torna al menu
        </Link>
      </header>

      {loading && <div className={styles.loading}>Caricamento eventi...</div>}

      {error && <div className={styles.alertError}>{error}</div>}

      {!loading && !error && events.length === 0 && (
        <div className={styles.empty}>
          <p>Nessun evento presente.</p>
          <Link href="/admin/nuovo" className={styles.primaryBtn}>
            Crea il primo evento
          </Link>
        </div>
      )}

      {!loading && events.length > 0 && (
        <div className={styles.eventsList}>
          {events.map((event) => (
            <article key={event.id} className={styles.eventCard}>
              <div className={styles.eventImage}>
                <img src={event.imageUrl} alt={event.title} />
                {!event.disponibile && (
                  <div className={styles.badge}>Non disponibile</div>
                )}
              </div>

              <div className={styles.eventInfo}>
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                {event.dateISO && (
                  <small>
                    {new Date(event.dateISO).toLocaleDateString("it-IT", {
                      weekday: "long",
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </small>
                )}
              </div>

              <div className={styles.eventActions}>
                <button
                  onClick={() => router.push(`/admin/eventi/${event.id}`)}
                  className={styles.secondaryBtn}
                >
                  Modifica
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className={styles.dangerBtn}
                >
                  Elimina
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
