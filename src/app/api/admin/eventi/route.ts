/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

function getBearerToken(req: Request) {
  const h = req.headers.get("authorization") || "";
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m?.[1];
}

export async function POST(req: Request) {
  try {
    const token = getBearerToken(req);
    if (!token) {
      return NextResponse.json({ error: "Missing auth token." }, { status: 401 });
    }

    const decoded = await adminAuth.verifyIdToken(token);
    if (!decoded?.uid) {
      return NextResponse.json({ error: "Invalid auth token." }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const title = String(body.title ?? "").trim();
    const description = String(body.description ?? "").trim();

    if (title.length < 2 || description.length < 5) {
      return NextResponse.json({ error: "Titolo/descrizione non validi." }, { status: 400 });
    }

    const doc = {
      title,
      description,
      imageUrl: String(body.imageUrl ?? "/assets/img/locandina1.jpeg"),
      cta: body.cta ? String(body.cta) : undefined,
      href: body.href ? String(body.href) : undefined,
      disponibile: body.disponibile !== false,
      dateISO: body.dateISO ? String(body.dateISO) : undefined,
      createdAt: new Date().toISOString(),
      createdBy: decoded.uid,
    };

    const ref = await adminDb.collection("eventi").add(doc);

    return NextResponse.json({ ok: true, id: ref.id }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Server error" },
      { status: 500 }
    );
  }
}
