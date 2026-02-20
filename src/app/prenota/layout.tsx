import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prenota | Sbajo Cocktail Bar - Prenotazione Tavolo Online",
  description:
    "Prenota il tuo tavolo a Sbajo Cocktail Bar ad Aprilia. Semplice, veloce e online.",
  keywords: "prenota, prenotazione, tavolo, aprilia, cocktail bar",
  alternates: { canonical: "https://sbajococktailbar.it/prenota" },
  openGraph: {
    title: "Prenota | Sbajo Cocktail Bar",
    description: "Prenota il tuo tavolo online a Sbajo Cocktail Bar.",
    url: "https://sbajococktailbar.it/prenota",
    type: "website",
    locale: "it_IT",
  },
};

export default function PrenotaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
