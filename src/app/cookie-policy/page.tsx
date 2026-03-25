import type { Metadata } from "next";
import Link from "next/link";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import styles from "@/styles/legal.module.scss";

export const metadata: Metadata = {
  title: "Cookie Policy | Sbajo Cocktail Bar",
  description:
    "Informativa sull'uso dei cookie e delle tecnologie simili su sbajococktailbar.it.",
  alternates: { canonical: "https://sbajococktailbar.it/cookie-policy" },
};

export default function CookiePolicyPage() {
  return (
    <div className={styles.wrapper}>
      <Header />
      <main className={styles.main}>
        <h1 className={styles.title}>Cookie Policy</h1>
        <p className={styles.updated}>Ultimo aggiornamento: 25/03/2026</p>

        <section className={styles.section}>
          <h2>Cosa sono i cookie</h2>
          <p>
            I cookie sono piccoli file di testo inviati al dispositivo
            dell&apos;utente per permettere il corretto funzionamento del sito
            e, quando previsti, analisi statistiche o finalita di marketing.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Cookie utilizzati da questo sito</h2>
          <p>
            Il sito utilizza principalmente cookie tecnici necessari al
            funzionamento e alla sicurezza delle pagine.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Cookie analytics (Google Analytics)</h2>
          <p>
            Google Analytics viene attivato solo dopo consenso esplicito tramite
            banner cookie. In assenza di consenso, i cookie analytics restano
            bloccati.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Cookie di terze parti</h2>
          <p>
            L&apos;apertura di servizi esterni (ad esempio WhatsApp, Instagram o
            Google Maps tramite link) puo comportare trattamenti svolti da
            soggetti terzi, secondo le loro informative.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Fornitori tecnici principali</h2>
          <p>
            Il sito utilizza Firebase (Google Cloud) come fornitore tecnico per
            hosting e servizi applicativi. Le richieste di prenotazione vengono
            inviate dall&apos;utente su WhatsApp.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Gestione preferenze</h2>
          <p>
            Puoi modificare la scelta dal pulsante &quot;Preferenze cookie&quot;
            presente sul sito oppure gestire/cancellare i cookie dalle
            impostazioni del browser. La disattivazione dei cookie tecnici puo
            limitare alcune funzioni del sito.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Contatti</h2>
          <p>
            Per domande su privacy e cookie consulta la{" "}
            <Link href="/privacy-policy" className={styles.link}>
              Privacy Policy
            </Link>{" "}
            o scrivi a sbajo2025@gmail.com.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
