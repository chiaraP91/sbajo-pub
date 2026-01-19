import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://sbajococktailbar.it";
  const now = new Date();

  return [
    { url: `${baseUrl}/`, lastModified: now },
    { url: `${baseUrl}/menu-drink`, lastModified: now },
    { url: `${baseUrl}/menu-food`, lastModified: now },
    { url: `${baseUrl}/eventi`, lastModified: now },
    { url: `${baseUrl}/chi-siamo`, lastModified: now },
    { url: `${baseUrl}/prenota`, lastModified: now },
  ];
}
