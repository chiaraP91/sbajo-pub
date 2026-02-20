import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sbajo Cocktail Bar | Cocktail, Cucina Creativa, Eventi ad Aprilia",
  description:
    "Sbajo Cocktail Bar ad Aprilia: cocktail con carattere, cucina creativa, eventi sbajati e atmosfera unica. Scopri il nostro menu e prenota online.",
  keywords:
    "cocktail bar Aprilia, aperitivo Aprilia, cena Aprilia, eventi Aprilia, cucina creativa, cocktail, birra",
  openGraph: {
    title: "Sbajo Cocktail Bar | Aprilia",
    description:
      "Cocktail con personalità, cucina creativa e serate indimenticabili. Sbajo Cocktail Bar ad Aprilia.",
    url: "https://sbajococktailbar.it",
    type: "website",
    locale: "it_IT",
    siteName: "Sbajo Cocktail Bar",
    images: [
      {
        url: "https://sbajococktailbar.it/assets/img/logo3.png",
        width: 520,
        height: 520,
        alt: "Sbajo Cocktail Bar Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sbajo Cocktail Bar",
    description: "Cocktail, cucina creativa ed eventi sbajati ad Aprilia",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://sbajococktailbar.it",
    name: "Sbajo Cocktail Bar",
    description: "Cocktail bar con cucina creativa e eventi sbajati ad Aprilia",
    url: "https://sbajococktailbar.it",
    telephone: "+393333807934",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Aprilia",
      addressLocality: "Aprilia",
      addressRegion: "Lazio",
      addressCountry: "IT",
    },
    sameAs: [
      "https://www.instagram.com/sbajococktailbar",
      "https://www.facebook.com/sbajococktailbar",
    ],
  };

  return (
    <html lang="it">
      <head>
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
