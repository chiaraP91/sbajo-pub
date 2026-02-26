"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const MAIN_DOMAIN = "https://sbajococktailbar.it";

export default function CanonicalTag() {
  const pathname = usePathname();

  useEffect(() => {
    // Rimuovi il canonical tag esistente se presente
    let canonicalTag = document.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement | null;
    if (!canonicalTag) {
      canonicalTag = document.createElement("link") as HTMLLinkElement;
      canonicalTag.rel = "canonical";
      document.head.appendChild(canonicalTag);
    }

    // Imposta l'href al dominio principale con il pathname corrente
    canonicalTag.href = `${MAIN_DOMAIN}${pathname}`;
  }, [pathname]);

  return null;
}
