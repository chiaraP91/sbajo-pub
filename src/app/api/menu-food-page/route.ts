/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

type Food = {
  numericId: number;
  name: string;
  description: string;
  category: string;
  price: number | null;
  allergens: number[];
  linkFoodId: number | null;
  linkDrinkId: number | null;
  disponibile: boolean;
};

type DrinkMin = { numericId: number; name: string };

export async function GET() {
  try {
    const [foodSnap, drinkSnap] = await Promise.all([
      adminDb.collection("menu-food").get(),
      adminDb.collection("menu-drink").get(),
    ]);

    const menu: Food[] = foodSnap.docs
      .map((d) => {
        const x = d.data() as any;
        const numericId = Number(x.numericId ?? d.id);
        const name = String(x.name ?? "").trim();
        const disponibile = x.disponibile !== false;

        if (!Number.isFinite(numericId) || !name || !disponibile) return null;

        return {
          numericId,
          name,
          description: String(x.description ?? ""),
          category: String(x.category ?? "altro"),
          price: (x.price ?? x.prezzo ?? null) as number | null,
          allergens: Array.isArray(x.allergens) ? x.allergens : [],
          linkFoodId: (x.linkFoodId ?? null) as number | null,
          linkDrinkId: (x.linkDrinkId ?? null) as number | null,
          disponibile,
        } satisfies Food;
      })
      .filter(Boolean) as Food[];

    const drinks: DrinkMin[] = drinkSnap.docs
      .map((d) => {
        const x = d.data() as any;
        const numericId = Number(x.numericId ?? d.id);
        const name = String(x.name ?? "").trim();
        const disponibile = x.disponibile !== false;

        if (!Number.isFinite(numericId) || !name || !disponibile) return null;
        return { numericId, name } satisfies DrinkMin;
      })
      .filter(Boolean) as DrinkMin[];

    return NextResponse.json(
      { menu, drinks },
      {
        headers: {
          // cache proxy/cdn: utile anche fuori da ISR
          "Cache-Control":
            "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (e) {
    return NextResponse.json(
      { menu: [], drinks: [], error: "Errore durante il caricamento del menu." },
      { status: 500 }
    );
  }
}
