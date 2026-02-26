import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import CanonicalTag from "@/components/CanonicalTag";
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
  metadataBase: new URL("https://sbajococktailbar.it"),
  title: "Sbajo Cocktail Bar | Cocktail, Cucina Creativa, Eventi ad Aprilia",
  description:
    "Sbajo Cocktail Bar ad Aprilia: cocktail con carattere, cucina creativa, eventi sbajati e atmosfera unica. Scopri il nostro menu e prenota online.",
  keywords:
    "cocktail bar Aprilia, aperitivo Aprilia, cena Aprilia, eventi Aprilia, cucina creativa, cocktail, birra",
  authors: [{ name: "Sbajo Cocktail Bar" }],
  creator: "Sbajo Cocktail Bar",
  publisher: "Sbajo Cocktail Bar",
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: "https://sbajococktailbar.it",
  },
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
    "@type": "Restaurant",
    "@id": "https://sbajococktailbar.it",
    name: "Sbajo Cocktail Bar",
    description: "Cocktail bar con cucina creativa e eventi sbajati ad Aprilia",
    url: "https://sbajococktailbar.it",
    telephone: "+393333807934",
    priceRange: "€€",
    servesCuisine: ["Italian", "Creative Cuisine", "Cocktails"],
    acceptsReservations: true,
    image: "https://sbajococktailbar.it/assets/img/logo3.png",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Via Roma",
      addressLocality: "Aprilia",
      addressRegion: "Lazio",
      postalCode: "04011",
      addressCountry: "IT",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "41.5954",
      longitude: "12.6535",
    },
    sameAs: [
      "https://www.instagram.com/sbajococktailbar",
      "https://www.facebook.com/sbajococktailbar",
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "18:00",
        closes: "02:00",
      },
    ],
  };

  return (
    <html lang="it">
      <head>
        {/* Preconnect per Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Schema.org JSON-LD */}
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Canonical Tag per multi-dominio SEO - Client Component */}
        <CanonicalTag />
        {children}
      </body>
    </html>
  );
}
