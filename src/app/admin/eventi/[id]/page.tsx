/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState, use } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/admin-eventi.module.scss";

import { auth } from "@/lib/firebase";
import ImageUploader from "@/components/ImageUploader";

type FormState = {
  title: string;
  description: string;
  dateLocal: string;
  imageName: string;
  cta: string;
  href: string;
  disponibile: boolean;
};

const initialState: FormState = {
  title: "",
  description: "",
  dateLocal: "",
  imageName: "",
  cta: "Prenota il tuo posto",
  href: "/prenota",
  disponibile: true,
};

function toISOZ(local: string) {
  const d = new Date(local);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString();
}

function fromISO(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  // Format to datetime-local: YYYY-MM-DDTHH:mm
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default function ModificaEventoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [form, setForm] = useState<FormState>(initialState);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  const canSave = useMemo(() => {
    return form.title.trim().length >= 2 && form.description.trim().length >= 5;
  }, [form.title, form.description]);

  useEffect(() => {
    loadEvento();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function loadEvento() {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/eventi/${id}`);
      if (!res.ok) throw new Error("Evento non trovato");

      const data = await res.json();

      setForm({
        title: data.title || "",
        description: data.description || "",
        dateLocal: data.dateISO ? fromISO(data.dateISO) : "",
        imageName: data.imageUrl || "",
        cta: data.cta || "Prenota il tuo posto",
        href: data.href || "/prenota",
        disponibile: data.disponibile !== false,
      });
    } catch (err: any) {
      setError(err?.message || "Errore nel caricamento evento");
    } finally {
      setLoading(false);
    }
  }

  const onChange = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((p) => ({ ...p, [key]: value }));
  };

  async function ensureLoggedIn() {
    if (!auth) throw new Error("Firebase auth non disponibile nel browser.");
    if (auth.currentUser) return auth.currentUser;
    throw new Error("Non sei autenticata. Fai login prima.");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOkMsg(null);

    if (!canSave) {
      setError("Compila almeno titolo e descrizione.");
      return;
    }

    setSaving(true);
    try {
      const user = await ensureLoggedIn();
      const token = await user.getIdToken();

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        imageUrl: form.imageName.trim() || "/assets/img/locandina1.jpeg",
        cta: form.cta.trim() || undefined,
        href: form.href.trim() || undefined,
        disponibile: !!form.disponibile,
        dateISO: form.dateLocal ? toISOZ(form.dateLocal) : undefined,
      };

      const res = await fetch(`/api/admin/eventi/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || "Errore durante il salvataggio.");
      }

      setOkMsg("Evento aggiornato ✅");

      setTimeout(() => {
        router.push("/admin/eventi");
      }, 1500);
    } catch (err: any) {
      setError(err?.message || "Errore sconosciuto.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Caricamento evento...</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Modifica evento</h1>
          <p className={styles.sub}>Aggiorna i dettagli dell'evento</p>
        </div>
      </header>

      <form className={styles.form} onSubmit={onSubmit}>
        <label className={styles.field}>
          <span className={styles.label}>Titolo *</span>
          <input
            className={styles.input}
            value={form.title}
            onChange={(e) => onChange("title", e.target.value)}
            placeholder="Inaugurazione"
            required
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Descrizione *</span>
          <textarea
            className={styles.textarea}
            value={form.description}
            onChange={(e) => onChange("description", e.target.value)}
            placeholder="Un evento per gli appassionati delle serate sbajate…"
            rows={4}
            required
          />
        </label>

        <div className={styles.row}>
          <label className={styles.field}>
            <span className={styles.label}>Data e ora</span>
            <input
              className={styles.input}
              type="datetime-local"
              value={form.dateLocal}
              onChange={(e) => onChange("dateLocal", e.target.value)}
            />
            <span className={styles.hint}>
              (opzionale, ma utile per ordinare gli eventi)
            </span>
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Disponibile</span>
            <div className={styles.switchRow}>
              <input
                type="checkbox"
                checked={form.disponibile}
                onChange={(e) => onChange("disponibile", e.target.checked)}
              />
              <span className={styles.hint}>
                Se disattivo, l'evento non esce sul sito.
              </span>
            </div>
          </label>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Immagine Evento</span>
          <ImageUploader
            currentImageUrl={form.imageName}
            onImageUploaded={(url) => onChange("imageName", url)}
          />
          <div style={{ marginTop: 12 }}>
            <span className={styles.hint}>
              Oppure inserisci manualmente URL:
            </span>
            <input
              className={styles.input}
              value={form.imageName}
              onChange={(e) => onChange("imageName", e.target.value)}
              placeholder="https://... oppure /assets/img/locandina1.jpeg"
              style={{ marginTop: 4 }}
            />
          </div>
        </div>

        <div className={styles.row}>
          <label className={styles.field}>
            <span className={styles.label}>Testo bottone (CTA)</span>
            <input
              className={styles.input}
              value={form.cta}
              onChange={(e) => onChange("cta", e.target.value)}
              placeholder="Prenota il tuo posto"
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Link bottone</span>
            <input
              className={styles.input}
              value={form.href}
              onChange={(e) => onChange("href", e.target.value)}
              placeholder="/prenota"
            />
          </label>
        </div>

        {error && <div className={styles.alertError}>{error}</div>}
        {okMsg && <div className={styles.alertOk}>{okMsg}</div>}

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => router.push("/admin/eventi")}
            disabled={saving}
          >
            Annulla
          </button>

          <button
            type="submit"
            className={styles.primaryBtn}
            disabled={!canSave || saving}
          >
            {saving ? "Salvo..." : "Aggiorna evento"}
          </button>
        </div>
      </form>
    </div>
  );
}
