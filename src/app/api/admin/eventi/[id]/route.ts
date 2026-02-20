/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

function getBearerToken(req: Request) {
  const h = req.headers.get("authorization") || "";
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m?.[1];
}

// DELETE - Elimina evento
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const token = getBearerToken(req);
    if (!token) {
      return NextResponse.json(
        { error: "Missing auth token." },
        { status: 401 },
      );
    }

    const decoded = await adminAuth.verifyIdToken(token);
    if (!decoded?.uid) {
      return NextResponse.json(
        { error: "Invalid auth token." },
        { status: 401 },
      );
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "ID evento mancante." },
        { status: 400 },
      );
    }

    await adminDb.collection("eventi").doc(id).delete();

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Server error" },
      { status: 500 },
    );
  }
}

// PUT - Modifica evento
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const token = getBearerToken(req);
    if (!token) {
      return NextResponse.json(
        { error: "Missing auth token." },
        { status: 401 },
      );
    }

    const decoded = await adminAuth.verifyIdToken(token);
    if (!decoded?.uid) {
      return NextResponse.json(
        { error: "Invalid auth token." },
        { status: 401 },
      );
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "ID evento mancante." },
        { status: 400 },
      );
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Invalid JSON body." },
        { status: 400 },
      );
    }

    const title = String(body.title ?? "").trim();
    const description = String(body.description ?? "").trim();

    if (title.length < 2 || description.length < 5) {
      return NextResponse.json(
        { error: "Titolo/descrizione non validi." },
        { status: 400 },
      );
    }

    const updateDoc = {
      title,
      description,
      imageUrl: String(body.imageUrl ?? "/assets/img/locandina1.jpeg"),
      cta: body.cta ? String(body.cta) : undefined,
      href: body.href ? String(body.href) : undefined,
      disponibile: body.disponibile !== false,
      dateISO: body.dateISO ? String(body.dateISO) : undefined,
      updatedAt: new Date().toISOString(),
      updatedBy: decoded.uid,
    };

    await adminDb.collection("eventi").doc(id).update(updateDoc);

    return NextResponse.json({ ok: true, id }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Server error" },
      { status: 500 },
    );
  }
}

// GET - Ottieni singolo evento
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "ID evento mancante." },
        { status: 400 },
      );
    }

    const doc = await adminDb.collection("eventi").doc(id).get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: "Evento non trovato." },
        { status: 404 },
      );
    }

    const data = doc.data();
    return NextResponse.json({ id: doc.id, ...data }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Server error" },
      { status: 500 },
    );
  }
}
