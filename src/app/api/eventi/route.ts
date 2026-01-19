/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export type EventItem = {
  id: string;
  day: string;
  month: string;
  title: string;
  description: string;
  imageUrl: string;
  cta?: string;
  href?: string;
  disponibile?: boolean;
  dateISO?: string; // opzionale, utile per ordinare
};

function monthLabel(d: Date) {
  const months = [
    "GENNAIO","FEBBRAIO","MARZO","APRILE","MAGGIO","GIUGNO",
    "LUGLIO","AGOSTO","SETTEMBRE","OTTOBRE","NOVEMBRE","DICEMBRE"
  ];
  return months[d.getMonth()];
}

export async function GET() {
  try {
    const snap = await adminDb.collection("eventi").get();

    const items: EventItem[] = snap.docs
      .map((doc) => {
        const x = doc.data() as any;
        const disponibile = x.disponibile !== false;

        const title = String(x.title ?? "").trim();
        if (!title || !disponibile) return null;

        // supporta vari formati: dateISO oppure day/month già salvati
        const dateISO = x.dateISO ? String(x.dateISO) : undefined;
        let day = String(x.day ?? "").trim();
        let month = String(x.month ?? "").trim();

        if (dateISO && (!day || !month)) {
          const d = new Date(dateISO);
          if (!isNaN(d.getTime())) {
            day = String(d.getDate()).padStart(2, "0");
            month = monthLabel(d);
          }
        }

        return {
          id: doc.id,
          day: day || "--",
          month: month || "",
          title,
          description: String(x.description ?? ""),
          imageUrl: String(x.imageUrl ?? "/assets/img/logo3.png"),
          cta: x.cta ? String(x.cta) : undefined,
          href: x.href ? String(x.href) : undefined,
          disponibile,
          dateISO,
        } satisfies EventItem;
      })
      .filter(Boolean) as EventItem[];

    // ordina per data se presente, altrimenti lascia com’è
    items.sort((a, b) => {
      const da = a.dateISO ? Date.parse(a.dateISO) : NaN;
      const db = b.dateISO ? Date.parse(b.dateISO) : NaN;
      if (isNaN(da) && isNaN(db)) return 0;
      if (isNaN(da)) return 1;
      if (isNaN(db)) return -1;
      return da - db;
    });

    return NextResponse.json(items, {
      headers: {
        "Cache-Control":
          "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (e) {
    return NextResponse.json([], { status: 200 });
  }
}
