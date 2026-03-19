import { useEffect, useState, type DependencyList } from "react";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

type FirestoreDoc = {
  id: string;
  disponibile?: boolean;
  [key: string]: unknown;
};

type QueryResult = {
  data: FirestoreDoc[];
  isLoading: boolean;
  error: Error | null;
};

function useFirestoreCollection(
  load: () => Promise<FirestoreDoc[]>,
  deps: DependencyList,
): QueryResult {
  const [data, setData] = useState<FirestoreDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const result = await load();
        if (!cancelled) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err : new Error("Errore caricamento dati"),
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, deps);

  return { data, isLoading, error };
}

// Hook per carica eventi con paginazione e caching
export function useEventi(pageSize = 10) {
  return useFirestoreCollection(async () => {
    const q = query(collection(db, "eventi"), limit(pageSize));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc): FirestoreDoc => ({
        id: doc.id,
        ...(doc.data() as Record<string, unknown>),
      }),
    );
  }, [pageSize]);
}

// Hook per carica menu food con caching
export function useMenuFood() {
  return useFirestoreCollection(async () => {
    const snapshot = await getDocs(collection(db, "menu-food"));
    return snapshot.docs
      .map(
        (doc): FirestoreDoc => ({
          id: doc.id,
          ...(doc.data() as Record<string, unknown>),
        }),
      )
      .filter((item) => item.disponibile !== false);
  }, []);
}

// Hook per carica menu drink con caching
export function useMenuDrink() {
  return useFirestoreCollection(async () => {
    const snapshot = await getDocs(collection(db, "menu-drink"));
    return snapshot.docs
      .map(
        (doc): FirestoreDoc => ({
          id: doc.id,
          ...(doc.data() as Record<string, unknown>),
        }),
      )
      .filter((item) => item.disponibile !== false);
  }, []);
}
