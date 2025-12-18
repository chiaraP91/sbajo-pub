"use client";

import AdminGate from "@/components/AdminGate";
import s from "@/styles/adminMenuEditor.module.scss";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  Transaction,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type MenuType = "food" | "drink";

type MenuItem = {
  numericId: number;
  menuType: MenuType;
  name: string;
  description: string;
  allergens: number[];
  price: number;
  category: string;
  disponibile: boolean;

  linkFoodId: number | null;
  linkDrinkId: number | null;

  createdAt?: any;
  updatedAt?: any;
};

type LinkItem = {
  numericId: number;
  menuType: MenuType;
  name: string;
};

const ALLERGENS: Array<{ code: number; label: string }> = [
  { code: 1, label: "Glutine" },
  { code: 2, label: "Crostacei" },
  { code: 3, label: "Uova" },
  { code: 4, label: "Pesce" },
  { code: 5, label: "Arachidi" },
  { code: 6, label: "Soia" },
  { code: 7, label: "Latte" },
  { code: 8, label: "Frutta a guscio" },
  { code: 9, label: "Sedano" },
  { code: 10, label: "Senape" },
  { code: 11, label: "Sesamo" },
  { code: 12, label: "Solfiti" },
  { code: 13, label: "Lupini" },
  { code: 14, label: "Molluschi" },
];

const FOOD_CATEGORIES =  ["Appetizer", "Burger", "Dolci", "Altro"] as const;
const DRINK_CATEGORIES =  ["Cocktail", "Birre","Vini" ,"Soft drink", "Altro" ] as const;

function toNumberOrNull(v: string): number | null {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function collectionFor(type: MenuType) {
  return type === "food" ? "menu-food" : "menu-drink";
}

export default function MenuEditorInner() {
  const sp = useSearchParams();
  const router = useRouter();

  const editType = sp.get("type") as MenuType | null;
  const editIdRaw = sp.get("id");
  const editId = editIdRaw ? Number(editIdRaw) : null;

  const isEdit = !!editType && Number.isFinite(editId);

  const [loadingEdit, setLoadingEdit] = useState(false);

  // form state
  const [menuType, setMenuType] = useState<MenuType>("drink");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<string>("");

  const [category, setCategory] = useState<string>("Cocktail");
  const [allergens, setAllergens] = useState<number[]>([]);

  const [linkFoodId, setLinkFoodId] = useState<string>("");
  const [linkDrinkId, setLinkDrinkId] = useState<string>("");

  // link options
  const [foodItems, setFoodItems] = useState<LinkItem[]>([]);
  const [drinkItems, setDrinkItems] = useState<LinkItem[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  // ui
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const categories = useMemo(
    () => (menuType === "food" ? [...FOOD_CATEGORIES] : [...DRINK_CATEGORIES]),
    [menuType]
  );

  // Se NON sono in edit, quando cambio tipo resetto category/link
  useEffect(() => {
    if (isEdit) return;
    setCategory(menuType === "food" ? FOOD_CATEGORIES[0] : DRINK_CATEGORIES[0]);
    setLinkFoodId("");
    setLinkDrinkId("");
  }, [menuType, isEdit]);

  async function refreshLinkLists() {
    setLoadingList(true);
    setErr(null);

    try {
      const [foodSnap, drinkSnap] = await Promise.all([
        getDocs(query(collection(db, "menu-food"), orderBy("numericId", "asc"))),
        getDocs(query(collection(db, "menu-drink"), orderBy("numericId", "asc"))),
      ]);

      const foodData: LinkItem[] = foodSnap.docs
        .map((d) => {
          const x = d.data() as any;
          const numericId = Number(x.numericId ?? d.id);
          return { numericId, menuType: "food" as const, name: String(x.name ?? "") };
        })
        .filter((x) => Number.isFinite(x.numericId) && x.name);

      const drinkData: LinkItem[] = drinkSnap.docs
        .map((d) => {
          const x = d.data() as any;
          const numericId = Number(x.numericId ?? d.id);
          return { numericId, menuType: "drink" as const, name: String(x.name ?? "") };
        })
        .filter((x) => Number.isFinite(x.numericId) && x.name);

      setFoodItems(foodData);
      setDrinkItems(drinkData);
    } catch (e) {
      console.error(e);
      setErr("Non riesco a leggere i dati da Firestore (menu-food / menu-drink).");
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    refreshLinkLists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Carico l'elemento in modalità edit
  useEffect(() => {
    const loadEdit = async () => {
      if (!isEdit || !editType || editId == null) return;

      setLoadingEdit(true);
      setErr(null);
      setMsg(null);

      try {
        const ref = doc(db, collectionFor(editType), String(editId));
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          setErr(`Elemento non trovato: ${editType} #${editId}`);
          return;
        }

        const x = snap.data() as any;

        setMenuType(editType);
        setName(String(x.name ?? ""));
        setDescription(String(x.description ?? ""));
        setPrice(String(x.price ?? ""));

        setCategory(String(x.category ?? (editType === "food" ? "Panini" : "Cocktail")));
        setAllergens(Array.isArray(x.allergens) ? x.allergens : []);

        setLinkFoodId(x.linkFoodId != null ? String(x.linkFoodId) : "");
        setLinkDrinkId(x.linkDrinkId != null ? String(x.linkDrinkId) : "");
      } catch (e) {
        console.error(e);
        setErr("Errore durante il caricamento dell’elemento da modificare.");
      } finally {
        setLoadingEdit(false);
      }
    };

    loadEdit();
  }, [isEdit, editType, editId]);

  function onAllergensChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selected = Array.from(e.target.selectedOptions).map((o) => Number(o.value));
    setAllergens(selected.filter((n) => Number.isFinite(n)));
  }

  const foodOptions = useMemo(
    () =>
      foodItems.map((it) => ({
        value: String(it.numericId),
        label: `#${it.numericId} · ${it.name}`,
        key: `food-${it.numericId}`,
      })),
    [foodItems]
  );

  const drinkOptions = useMemo(
    () =>
      drinkItems.map((it) => ({
        value: String(it.numericId),
        label: `#${it.numericId} · ${it.name}`,
        key: `drink-${it.numericId}`,
      })),
    [drinkItems]
  );

  async function saveItem() {
    setErr(null);
    setMsg(null);

    const trimmedName = name.trim();
    const trimmedDesc = description.trim();
    if (!trimmedName) return setErr("Il nome è obbligatorio.");
    if (!trimmedDesc) return setErr("La descrizione è obbligatoria.");

    const priceNum = Number(price.replace(",", ".").trim());
    if (!Number.isFinite(priceNum)) return setErr("Prezzo non valido (es: 8.50).");
    if (priceNum < 0) return setErr("Prezzo non può essere negativo.");

    const linkFoodNum = linkFoodId ? toNumberOrNull(linkFoodId) : null;
    const linkDrinkNum = linkDrinkId ? toNumberOrNull(linkDrinkId) : null;

    setSaving(true);

    try {
      // EDIT
      if (isEdit && editType && editId != null) {
        const itemRef = doc(db, collectionFor(editType), String(editId));

        await setDoc(
          itemRef,
          {
            numericId: editId,
            menuType: editType,
            name: trimmedName,
            description: trimmedDesc,
            allergens,
            price: Math.round(priceNum * 100) / 100,
            category,
            linkFoodId: linkFoodNum ?? null,
            linkDrinkId: linkDrinkNum ?? null,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );

        setMsg(`Aggiornato ✅ (${editType} #${editId})`);
        await refreshLinkLists();
        return;
      }

      // CREATE
      const counterRef = doc(db, "meta", "menuItemCounter");
      const targetCollection = collectionFor(menuType);

      const newNumericId = await runTransaction(db, async (tx: Transaction) => {
        const counterSnap = await tx.get(counterRef);
        const current = counterSnap.exists() ? Number(counterSnap.data()?.value ?? 0) : 0;
        const next = current + 1;

        tx.set(counterRef, { value: next }, { merge: true });

        const itemRef = doc(db, targetCollection, String(next));

        const payload: MenuItem = {
          numericId: next,
          menuType,
          name: trimmedName,
          description: trimmedDesc,
          allergens,
          price: Math.round(priceNum * 100) / 100,
          category,
          disponibile: true,
          linkFoodId: linkFoodNum ?? null,
          linkDrinkId: linkDrinkNum ?? null,
          createdAt: serverTimestamp(),
        };

        tx.set(itemRef, payload);
        return next;
      });

      setMsg(`Salvato ✅ (ID #${newNumericId})`);

      setName("");
      setDescription("");
      setPrice("");
      setAllergens([]);
      setLinkFoodId("");
      setLinkDrinkId("");

      await refreshLinkLists();
    } catch (e: any) {
      console.error(e);
      setErr(
        e?.message?.includes("permission")
          ? "Permesso negato: devi essere autenticata per scrivere su Firestore."
          : "Errore durante il salvataggio su Firestore."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminGate>
      <div className={s.page}>
        <div className={s.container}>
          <h1 className={s.title}>Admin Menu</h1>
          <p className={s.subtitle}>Crea o modifica elementi Food/Drink.</p>

          {err && <div className={`${s.notice} ${s.noticeErr}`}>{err}</div>}
          {msg && <div className={`${s.notice} ${s.noticeOk}`}>{msg}</div>}

          {isEdit && (
            <div className={`${s.notice} ${s.noticeOk}`}>
              Modalità modifica: {editType} #{editId}
            </div>
          )}

          <div className={s.card}>
            <div className={s.formGrid}>
              <label className={s.field}>
                <span className={s.label}>Tipo menu</span>
                <select
                  className={s.select}
                  value={menuType}
                  onChange={(e) => setMenuType(e.target.value as MenuType)}
                  disabled={isEdit} // in edit non cambiare tipo, evita pasticci
                >
                  <option value="food">Food</option>
                  <option value="drink">Drink</option>
                </select>
                {isEdit && <p className={s.hint}>In modifica il tipo è bloccato.</p>}
              </label>

              <label className={s.field}>
                <span className={s.label}>Tipologia elemento</span>
                <select className={s.select} value={category} onChange={(e) => setCategory(e.target.value)}>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>

              <label className={`${s.field} ${s.full}`}>
                <span className={s.label}>Nome</span>
                <input className={s.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Es: Negroni Sbajo" />
              </label>

              <label className={`${s.field} ${s.full}`}>
                <span className={s.label}>Descrizione / ingredienti</span>
                <textarea className={s.textarea} value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Ingredienti, note, ecc…" />
              </label>

              <label className={s.field}>
                <span className={s.label}>Allergeni (multi-selezione)</span>
                <select className={s.select} multiple value={allergens.map(String)} onChange={onAllergensChange} size={6}>
                  {ALLERGENS.map((a) => (
                    <option key={a.code} value={a.code}>
                      {a.code} · {a.label}
                    </option>
                  ))}
                </select>
                <p className={s.hint}>Tip: Ctrl/Cmd per selezionare più voci.</p>
              </label>

              <label className={s.field}>
                <span className={s.label}>Prezzo</span>
                <input className={s.input} value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Es: 8.50" inputMode="decimal" />
              </label>

              <label className={`${s.field} ${s.full}`}>
                <span className={s.label}>Collegamento Food (opzionale)</span>
                <select className={s.select} value={linkFoodId} onChange={(e) => setLinkFoodId(e.target.value)} disabled={loadingList}>
                  <option value="">Nessuno</option>
                  {foodOptions.map((o) => (
                    <option key={o.key} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <p className={s.hint}>ID numerico del piatto collegato.</p>
              </label>

              <label className={`${s.field} ${s.full}`}>
                <span className={s.label}>Collegamento Drink (opzionale)</span>
                <select className={s.select} value={linkDrinkId} onChange={(e) => setLinkDrinkId(e.target.value)} disabled={loadingList}>
                  <option value="">Nessuno</option>
                  {drinkOptions.map((o) => (
                    <option key={o.key} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <p className={s.hint}>ID numerico del drink collegato.</p>
              </label>

              <div className={s.actions}>
                <button type="button" className={`${s.btn} ${s.btnPrimary}`} onClick={saveItem} disabled={saving || loadingEdit}>
                  {saving ? "Salvataggio…" : isEdit ? "Salva modifiche" : "Salva su Firestore"}
                </button>

                <button type="button" className={s.btn} onClick={() => router.push("/admin/table-menu")}>
                  Vai a table-menu
                </button>
              </div>
            </div>
          </div>

          <hr className={s.hr} />
        </div>
      </div>
    </AdminGate>
  );
}
