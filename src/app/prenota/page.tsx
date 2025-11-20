'use client';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import styles from '@/styles/prenota.module.scss';
import React, { useEffect, useState } from 'react';

function PrenotaPage() {
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    numeroPersone: '',
    data: '',
    orario: '',
    note: ''
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(true); // Stato per il pulsante disabilitato


  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

    // Funzione per abilitare/disabilitare il pulsante
  useEffect(() => {
    const { nome, numeroPersone, data, orario } = formData;
    if (nome && numeroPersone && data && orario) {
      setIsButtonDisabled(false); // Abilita il pulsante se i campi obbligatori sono compilati
    } else {
      setIsButtonDisabled(true); // Disabilita il pulsante se uno dei campi obbligatori è vuoto
    }
  }, [formData]); // Rilancia quando i dati del form cambiano

 // Helper per formattare la data in modo più umano
const formatDateIt = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('it-IT', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const buildWhatsappMessage = () => {
  const { nome, cognome, numeroPersone, data, orario, note } = formData;

  const personeLabel =
    numeroPersone === '1' ? 'persona' : 'persone';

  const dataFormattata = formatDateIt(data);

  const noteSection = note
    ? `\n\nNote (prometto che non sto esagerando):\n${note}`
    : '';

  const messaggio = `Ciao Sbajo! 🍻
sono ${nome}${cognome ? ` ${cognome}` : ''}.

Vorrei prenotare per ${numeroPersone} ${personeLabel} ${dataFormattata ? `per ${dataFormattata}` : `per il ${data}`} alle ${orario}.

Se c’è posto, mi piacerebbe un angolino carino dove godermi la serata e sbajare con classe. 😄
${noteSection}

Attendo conferma per la prenotazione! ✨`;

  return encodeURIComponent(messaggio);
};


  const handlePrenotaClick = () => {
    const numeroWhatsApp = '+393318831199';
    const messaggio = buildWhatsappMessage();
    const url = `https://wa.me/${numeroWhatsApp}?text=${messaggio}`;
    window.open(url, '_blank');
  };

  return (
    <div className={styles.wrapper}>
        <Header />
      <div className={styles.hero}>
        <img className={styles.bg} src="/path/to/your/background-image.jpg" alt="Background" />
        <div className={styles.scrim} aria-hidden="true" />
      </div>

      <main className={styles.scrollArea}>
        <h1 className={styles.heading}>Prenotazione</h1>
        <form onSubmit={(e) => e.preventDefault()} className={styles.prenotaForm}>
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
              required 
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

          <button type="button"  disabled={isButtonDisabled} 
            onClick={handlePrenotaClick} className={styles.prenotaButton}>
            Prenota
          </button>
        </form>

        <div>
          <p>* Campi obbligatori</p>
          <p>La prenotazione avviene tramite Whatsapp.Attendere il messaggio di conferma</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default PrenotaPage;
