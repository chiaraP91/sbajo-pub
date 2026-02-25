/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/admin-eventi.module.scss";

import { auth, db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import ImageUploader from "@/components/ImageUploader";

type FormState = {
  title: string;
  description: string;
  dateLocal: string; // "2026-12-20T21:00" (datetime-local)
  imageName: string; // "/assets/img/locandina1.jpeg" oppure URL assoluto
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

export default function NuovoEventoPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>(initialState);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  const canSave = useMemo(() => {
    return form.title.trim().length >= 2 && form.description.trim().length >= 5;
  }, [form.title, form.description]);

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
      setError("Compila almeno titolo e descrizione (non due lettere a caso).");
      return;
    }

    setSaving(true);
    try {
      const user = await ensureLoggedIn();

      const payload: any = {
        title: form.title.trim(),
        description: form.description.trim(),
        imageUrl: form.imageName.trim() || "/assets/img/locandina1.jpeg",
        disponibile: !!form.disponibile,
      };

      if (form.cta.trim()) {
        payload.cta = form.cta.trim();
      }
      if (form.href.trim()) {
        payload.href = form.href.trim();
      }
      if (form.dateLocal) {
        payload.dateISO = toISOZ(form.dateLocal);
      }

      await addDoc(collection(db, "eventi"), payload);

      setOkMsg("Evento creato ✅");
      setForm(initialState);

      router.push("/admin/eventi");
    } catch (err: any) {
      setError(err?.message || "Errore sconosciuto (il classico).");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Aggiungi evento</h1>
        <p className={styles.sub}>
          Inserisci i dati dell’evento. Sì, anche l’immagine. No, non è
          telepatia.
        </p>
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
                Se disattivo, l’evento non esce sul sito.
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
              readOnly={true}
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
            {saving ? "Salvo..." : "Salva evento"}
          </button>
        </div>
      </form>
    </div>
  );
}
