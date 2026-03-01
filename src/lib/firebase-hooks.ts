import { useQuery } from "react-query";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Hook per carica eventi con paginazione e caching
export function useEventi(pageSize = 10) {
  return useQuery(
    ["eventi"],
    async () => {
      const q = query(collection(db, "eventi"), limit(pageSize));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    },
    {
      staleTime: 5 * 60 * 1000, // Cache per 5 minuti
      cacheTime: 10 * 60 * 1000, // Mantieni in memoria per 10 minuti
    },
  );
}

// Hook per carica menu food con caching
export function useMenuFood() {
  return useQuery(
    ["menu-food"],
    async () => {
      const snapshot = await getDocs(collection(db, "menu-food"));
      return snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((item: any) => item.disponibile !== false);
    },
    {
      staleTime: 10 * 60 * 1000, // Cache per 10 minuti
      cacheTime: 30 * 60 * 1000, // Mantieni in memoria per 30 minuti
    },
  );
}

// Hook per carica menu drink con caching
export function useMenuDrink() {
  return useQuery(
    ["menu-drink"],
    async () => {
      const snapshot = await getDocs(collection(db, "menu-drink"));
      return snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((item: any) => item.disponibile !== false);
    },
    {
      staleTime: 10 * 60 * 1000, // Cache per 10 minuti
      cacheTime: 30 * 60 * 1000, // Mantieni in memoria per 30 minuti
    },
  );
}
