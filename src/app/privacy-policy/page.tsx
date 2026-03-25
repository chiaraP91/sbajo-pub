import type { Metadata } from "next";
import Link from "next/link";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import styles from "@/styles/legal.module.scss";

export const metadata: Metadata = {
  title: "Privacy Policy | Sbajo Cocktail Bar",
  description:
    "Informativa privacy per il trattamento dei dati personali sul sito sbajococktailbar.it.",
  alternates: { canonical: "https://sbajococktailbar.it/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <div className={styles.wrapper}>
      <Header />
      <main className={styles.main}>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.updated}>Ultimo aggiornamento: 25/03/2026</p>

        <section className={styles.section}>
          <h2>Titolare del trattamento</h2>
          <p>
            Sbajo di Silvio Falcone - P. IVA 18271391007. Per informazioni sui
            dati personali puoi contattare il titolare all&apos;indirizzo email:
            sbajo2025@gmail.com.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Tipi di dati trattati</h2>
          <p>
            Tramite il modulo prenotazioni vengono trattati: nome, cognome,
            numero persone, data, orario e note inserite volontariamente.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Finalita e base giuridica</h2>
          <ul className={styles.list}>
            <li>
              Gestione richieste di prenotazione: esecuzione di misure
              precontrattuali richieste dall&apos;interessato.
            </li>
            <li>
              Eventuali adempimenti amministrativi e di sicurezza: obbligo di
              legge e legittimo interesse del titolare.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Modalita di trattamento</h2>
          <p>
            Il sito e l&apos;infrastruttura dati utilizzano Firebase (Google
            Cloud) per hosting e database delle funzionalita applicative. I dati
            della richiesta di prenotazione inseriti nel form non vengono
            salvati nel database del sito: sono inoltrati dall&apos;utente verso
            WhatsApp al momento dell&apos;invio.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Comunicazione dei dati e fornitori</h2>
          <p>
            Il titolare unico del trattamento per questo sito e Sbajo di Silvio
            Falcone. Fornitori principali: Firebase per hosting e servizi
            tecnici del sito; WhatsApp Ireland Ltd/Meta per la gestione delle
            richieste inviate dall&apos;utente tramite chat WhatsApp. Il
            trattamento da parte dei fornitori terzi avviene secondo le loro
            informative privacy.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Periodo di conservazione</h2>
          <p>
            I dati legati alle richieste di prenotazione sono conservati per un
            periodo massimo di 24 mesi dalla raccolta. Le richieste sono gestite
            su WhatsApp; eventuali tempi di permanenza su tale piattaforma
            possono dipendere anche dalle impostazioni dell&apos;account e dalle
            policy del fornitore.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Diritti dell&apos;interessato</h2>
          <p>
            Puoi esercitare i diritti previsti dagli articoli 15-22 GDPR
            (accesso, rettifica, cancellazione, limitazione, opposizione,
            portabilita), oltre al diritto di reclamo al Garante Privacy.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Cookie e tecnologie simili</h2>
          <p>
            Per informazioni dettagliate consulta la{" "}
            <Link href="/cookie-policy" className={styles.link}>
              Cookie Policy
            </Link>
            .
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
