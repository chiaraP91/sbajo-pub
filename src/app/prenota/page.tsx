"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Link from "next/link";
import styles from "@/styles/prenota.module.scss";
import React, { useState } from "react";

function PrenotaPage() {
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    numeroPersone: "",
    data: "",
    orario: "",
    note: "",
  });
  const [showLateModal, setShowLateModal] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const isButtonDisabled = !(
    formData.nome &&
    formData.numeroPersone &&
    formData.data &&
    formData.orario &&
    privacyAccepted
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Helper per formattare la data in modo più umano
  const formatDateIt = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("it-IT", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const buildWhatsappMessage = () => {
    const { nome, cognome, numeroPersone, data, orario, note } = formData;

    const personeLabel = numeroPersone === "1" ? "persona" : "persone";
    const dataFormattata = formatDateIt(data);

    const noteSection = note ? `\nNote: ${note}` : "";

    const messaggio = `nome: ${nome}${cognome ? ` ${cognome}` : ""}
data: ${dataFormattata || data}
ora: ${orario}
persone: ${numeroPersone} ${personeLabel}${noteSection}`;

    return encodeURIComponent(messaggio);
  };

  const handlePrenotaClick = () => {
    const now = new Date();
    const hour = now.getHours();
    const isLate = hour >= 21 || hour < 2;

    if (isLate) {
      setShowLateModal(true);
      return;
    }

    apriWhatsapp();
  };

  const apriWhatsapp = () => {
    const numeroWhatsApp = "+393333807934";
    const messaggio = buildWhatsappMessage();
    const url = `https://wa.me/${numeroWhatsApp}?text=${messaggio}`;
    window.open(url, "_blank");
  };

  return (
    <div className={styles.wrapper}>
      <Header />
      <div className={styles.hero}>
        <img
          className={styles.bg}
          src="/path/to/your/background-image.jpg"
          alt="Background"
        />
        <div className={styles.scrim} aria-hidden="true" />
      </div>

      <main className={styles.scrollArea}>
        {showLateModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h3>Risposta lenta in questo orario</h3>
              <p>
                Durante il servizio potremmo non leggere subito le prenotazioni
                su WhatsApp. Se ti serve una conferma rapida puoi chiamarci.
              </p>

              <div className={styles.modalButtons}>
                <button
                  className={styles.modalSecondary}
                  onClick={() => setShowLateModal(false)}
                >
                  Torna indietro
                </button>

                <a href="tel:+393318831199" className={styles.modalCall}>
                  Chiama
                </a>

                <button
                  className={styles.modalPrimary}
                  onClick={() => {
                    setShowLateModal(false);
                    apriWhatsapp();
                  }}
                >
                  Procedi su WhatsApp
                </button>
              </div>
            </div>
          </div>
        )}

        <h1 className={styles.heading}>Prenotazione</h1>
        <form
          onSubmit={(e) => e.preventDefault()}
          className={styles.prenotaForm}
        >
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Nome *</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Cognome</label>
            <input
              type="text"
              name="cognome"
              value={formData.cognome}
              onChange={handleChange}
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Numero di persone *</label>
            <input
              type="number"
              name="numeroPersone"
              value={formData.numeroPersone}
              onChange={handleChange}
              required
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Data *</label>
            <input
              type="date"
              name="data"
              value={formData.data}
              onChange={handleChange}
              required
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Orario *</label>
            <input
              type="time"
              name="orario"
              value={formData.orario}
              onChange={handleChange}
              required
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Note</label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              className={styles.formInput}
            />
          </div>

          <button
            type="button"
            disabled={isButtonDisabled}
            onClick={handlePrenotaClick}
            className={styles.prenotaButton}
          >
            Prenota
          </button>
        </form>

        <div className={styles.privacyBox}>
          <label className={styles.privacyCheck}>
            <input
              type="checkbox"
              checked={privacyAccepted}
              onChange={(e) => setPrivacyAccepted(e.target.checked)}
            />
            <span>
              Dichiaro di aver letto la{" "}
              <Link href="/privacy-policy">Privacy Policy</Link> e la{" "}
              <Link href="/cookie-policy">Cookie Policy</Link>.
            </span>
          </label>

          <p>
            Cliccando su Prenota verrai reindirizzato su WhatsApp per inviare la
            richiesta: il trattamento dei dati su quel canale dipende anche dal
            fornitore del servizio.
          </p>
        </div>

        <div className={styles.formNote}>
          <p>* Campi obbligatori</p>
          <p>
            La prenotazione avviene tramite WhatsApp. Attendere il messaggio di
            conferma.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default PrenotaPage;
