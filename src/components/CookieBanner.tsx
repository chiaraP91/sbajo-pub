"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import styles from "@/styles/cookie-banner.module.scss";

type ConsentState = "granted" | "denied";

const CONSENT_KEY = "sbajo_cookie_consent_v1";

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

function getSavedConsent(): ConsentState | null {
  const saved = localStorage.getItem(CONSENT_KEY);
  if (saved === "granted" || saved === "denied") {
    return saved;
  }
  return null;
}

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

function ensureGtagLayer() {
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtagProxy(...args: unknown[]) {
      window.dataLayer.push(args);
    };
}

function updateConsent(consent: ConsentState) {
  ensureGtagLayer();
  window.gtag("consent", "update", {
    analytics_storage: consent,
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

function setDefaultDeniedConsent() {
  ensureGtagLayer();
  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    wait_for_update: 500,
  });
}

function loadGoogleAnalytics(id: string) {
  if (document.querySelector(`script[data-ga-id=\"${id}\"]`)) {
    return;
  }

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  script.dataset.gaId = id;
  script.onload = () => {
    ensureGtagLayer();
    window.gtag("js", new Date());
    window.gtag("config", id, {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
  };
  document.head.appendChild(script);
}

export default function CookieBanner() {
  const [consent, setConsent] = useState<ConsentState | null>(getSavedConsent);
  const [isVisible, setIsVisible] = useState(consent === null);

  useEffect(() => {
    setDefaultDeniedConsent();

    if (consent === "granted") {
      updateConsent("granted");
      if (measurementId) {
        loadGoogleAnalytics(measurementId);
      }
      return;
    }

    if (consent === "denied") {
      updateConsent("denied");
      return;
    }

    if (measurementId) {
      // Keep GA script unloaded until explicit consent.
    }
  }, [consent]);

  const acceptAnalytics = () => {
    localStorage.setItem(CONSENT_KEY, "granted");
    setConsent("granted");
    updateConsent("granted");
    if (measurementId) {
      loadGoogleAnalytics(measurementId);
    }
    setIsVisible(false);
  };

  const rejectAnalytics = () => {
    localStorage.setItem(CONSENT_KEY, "denied");
    setConsent("denied");
    updateConsent("denied");
    setIsVisible(false);
  };

  if (!isVisible && consent) {
    return (
      <div className={styles.manageWrap}>
        <button className={styles.manage} onClick={() => setIsVisible(true)}>
          Preferenze cookie
        </button>
      </div>
    );
  }

  if (!isVisible) {
    return null;
  }

  return (
    <div className={styles.wrapper} role="dialog" aria-live="polite">
      <div className={styles.banner}>
        <h2 className={styles.title}>Preferenze cookie</h2>
        <p className={styles.text}>
          Usiamo cookie tecnici e, con il tuo consenso, cookie analytics (Google
          Analytics) per analizzare il traffico del sito. Puoi accettare o
          rifiutare i cookie analytics. Maggiori dettagli nella{" "}
          <Link href="/cookie-policy">Cookie Policy</Link>.
        </p>

        <div className={styles.actions}>
          <button className={styles.accept} onClick={acceptAnalytics}>
            Accetta analytics
          </button>
          <button className={styles.reject} onClick={rejectAnalytics}>
            Rifiuta analytics
          </button>
        </div>

        {!measurementId && (
          <p className={styles.note}>
            Configurazione mancante: imposta NEXT_PUBLIC_GA_MEASUREMENT_ID per
            attivare Google Analytics dopo il consenso.
          </p>
        )}
      </div>
    </div>
  );
}
