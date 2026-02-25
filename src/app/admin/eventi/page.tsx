/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import styles from "@/styles/admin-eventi.module.scss";
import ImageUploader from "@/components/ImageUploader";

type EventItem = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  disponibile: boolean;
  dateISO?: string;
  cta?: string;
  href?: string;
};

type EditingEvent = EventItem & {
  dateLocal: string;
  cta: string;
  href: string;
};

export default function AdminEventiPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<EditingEvent | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "eventi"));
      const eventData: EventItem[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as EventItem[];
      setEvents(eventData);
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

      await deleteDoc(doc(db, "eventi", id));
      loadEvents();
    } catch (err: any) {
      alert(err?.message || "Errore nell'eliminazione");
    }
  }

  function openEdit(event: EventItem) {
    const dateLocal = event.dateISO
      ? new Date(event.dateISO).toISOString().slice(0, 16)
      : "";

    setEditingEvent({
      ...event,
      dateLocal,
      cta: event.cta || "Prenota il tuo posto",
      href: event.href || "/prenota",
    });
  }

  async function handleSaveEdit() {
    if (!editingEvent) return;

    try {
      setUpdatingId(editingEvent.id);
      const user = auth.currentUser;
      if (!user) throw new Error("Non autenticata");

      const dateISO = editingEvent.dateLocal
        ? new Date(editingEvent.dateLocal).toISOString()
        : undefined;

      const updatePayload: any = {
        title: editingEvent.title,
        description: editingEvent.description,
        imageUrl: editingEvent.imageUrl,
        cta: editingEvent.cta,
        href: editingEvent.href,
        disponibile: editingEvent.disponibile,
      };

      if (dateISO) {
        updatePayload.dateISO = dateISO;
      }

      await updateDoc(doc(db, "eventi", editingEvent.id), updatePayload);

      setEditingEvent(null);
      loadEvents();
    } catch (err: any) {
      alert(err?.message || "Errore nell'aggiornamento");
    } finally {
      setUpdatingId(null);
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
                  onClick={() => openEdit(event)}
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

      {/* Edit Modal */}
      {editingEvent && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Modifica Evento</h2>

            <div className={styles.field}>
              <label className={styles.label}>Titolo</label>
              <input
                type="text"
                className={styles.input}
                value={editingEvent.title}
                onChange={(e) =>
                  setEditingEvent({ ...editingEvent, title: e.target.value })
                }
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Descrizione</label>
              <textarea
                className={styles.textarea}
                value={editingEvent.description}
                onChange={(e) =>
                  setEditingEvent({
                    ...editingEvent,
                    description: e.target.value,
                  })
                }
                rows={3}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Data e Ora</label>
              <input
                type="datetime-local"
                className={styles.input}
                value={editingEvent.dateLocal}
                onChange={(e) =>
                  setEditingEvent({
                    ...editingEvent,
                    dateLocal: e.target.value,
                  })
                }
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Immagine URL</label>
              <input
                type="text"
                className={styles.input}
                value={editingEvent.imageUrl}
                onChange={(e) =>
                  setEditingEvent({
                    ...editingEvent,
                    imageUrl: e.target.value,
                  })
                }
              />
              <p style={{ fontSize: "0.9em", marginTop: "8px", opacity: 0.7 }}>
                Oppure carica una nuova:
              </p>
              <ImageUploader
                currentImageUrl={editingEvent.imageUrl}
                onImageUploaded={(url) =>
                  setEditingEvent({ ...editingEvent, imageUrl: url })
                }
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Testo Bottone CTA</label>
              <input
                type="text"
                className={styles.input}
                value={editingEvent.cta}
                onChange={(e) =>
                  setEditingEvent({ ...editingEvent, cta: e.target.value })
                }
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>URL Bottone CTA</label>
              <input
                type="text"
                className={styles.input}
                value={editingEvent.href}
                onChange={(e) =>
                  setEditingEvent({ ...editingEvent, href: e.target.value })
                }
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                <input
                  type="checkbox"
                  checked={editingEvent.disponibile}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      disponibile: e.target.checked,
                    })
                  }
                  style={{ marginRight: "8px" }}
                />
                Evento disponibile
              </label>
            </div>

            <div className={styles.modalActions}>
              <button
                onClick={handleSaveEdit}
                disabled={updatingId === editingEvent.id}
                className={styles.primaryBtn}
              >
                {updatingId === editingEvent.id ? "Salvataggio..." : "Salva"}
              </button>
              <button
                onClick={() => setEditingEvent(null)}
                className={styles.secondaryBtn}
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
