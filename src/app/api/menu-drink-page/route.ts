/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

type DrinkMin = {
  numericId: number;
  name: string;
  description: string;
  category: string;
  price: number | null;
  allergens: string[];
  linkFoodId: number | null;
  linkDrinkId: number | null;
  disponibile: boolean;
};

type FoodMin = { numericId: number; name: string };

export async function GET() {
  try {
    const [drinkSnap, foodSnap] = await Promise.all([
      adminDb.collection("menu-drink").get(),
      adminDb.collection("menu-food").get(),
    ]);

    const drinks: DrinkMin[] = drinkSnap.docs
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
        } satisfies DrinkMin;
      })
      .filter(Boolean) as DrinkMin[];

    const food: FoodMin[] = foodSnap.docs
      .map((d) => {
        const x = d.data() as any;
        const numericId = Number(x.numericId ?? d.id);
        const name = String(x.name ?? "").trim();
        const disponibile = x.disponibile !== false;

        if (!Number.isFinite(numericId) || !name || !disponibile) return null;
        return { numericId, name } satisfies FoodMin;
      })
      .filter(Boolean) as FoodMin[];

    return NextResponse.json(
      { drinks, food },
      {
        headers: {
          "Cache-Control":
            "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (e) {
    return NextResponse.json(
      { drinks: [], food: [], error: "Errore durante il caricamento del menu drink." },
      { status: 500 }
    );
  }
}
