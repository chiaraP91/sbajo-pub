import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import CanonicalTag from "@/components/CanonicalTag";
import CookieBanner from "@/components/CookieBanner";
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
  title: "Sbajo | Cocktail Bar a Pomezia",
  description:
    "Sbajo e il tuo cocktail bar e pub a Pomezia: aperitivi, cocktail signature, birre, vini, cucina creativa ed eventi. Guarda il menu e prenota il tuo tavolo.",
  keywords:
    "cocktail bar Pomezia, pub Pomezia, aperitivo Pomezia, drink Pomezia, cena Pomezia, eventi Pomezia, birre Pomezia, cucina creativa",
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
    title: "Sbajo | Cocktail Bar a Pomezia",
    description:
      "Cocktail bar e pub a Pomezia con aperitivi, cucina creativa, drink signature ed eventi. Scopri Sbajo.",
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
    title: "Sbajo | Cocktail Bar a Pomezia",
    description:
      "Aperitivi, cocktail signature, cucina creativa ed eventi a Pomezia.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": ["BarOrPub", "Restaurant"],
    "@id": "https://sbajococktailbar.it/#localbusiness",
    name: "Sbajo Cocktail Bar",
    description:
      "Cocktail bar e pub a Pomezia con aperitivi, cocktail signature, birre, vini, cucina creativa ed eventi.",
    url: "https://sbajococktailbar.it",
    telephone: "+393333807934",
    priceRange: "€€",
    keywords: [
      "cocktail bar Pomezia",
      "pub Pomezia",
      "aperitivo Pomezia",
      "menu drink Pomezia",
    ],
    servesCuisine: ["Italian", "Creative Cuisine"],
    acceptsReservations: true,
    image: "https://sbajococktailbar.it/assets/img/logo3.png",
    hasMap: "https://www.google.com/maps/search/?api=1&query=SbaJo+Pomezia",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Via Roma",
      addressLocality: "Pomezia",
      addressRegion: "Lazio",
      postalCode: "04011",
      addressCountry: "IT",
    },
    areaServed: {
      "@type": "City",
      name: "Pomezia",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "41.5954",
      longitude: "12.6535",
    },
    sameAs: [
      "https://www.instagram.com/sbajo_cocktail_bar?igsh=ZWs1bTJhN2F0amcz",
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
        <CookieBanner />
      </body>
    </html>
  );
}
