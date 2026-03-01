// Firebase Firestore Cache per ridurre read operations
// Salva in memoria le collezioni con un TTL (time-to-live)

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minuti
const cache = new Map<string, CacheEntry<any>>();

export function getCachedData<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;

  // Se cache è scaduto, rimuovilo
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }

  return entry.data;
}

export function setCachedData<T>(key: string, data: T): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

export function clearCache(pattern?: string): void {
  if (!pattern) {
    cache.clear();
    return;
  }

  for (const key of cache.keys()) {
    if (key.includes(pattern)) {
      cache.delete(key);
    }
  }
}

// Invalidate cache quando i dati cambiano
export function invalidateMenuCache(): void {
  clearCache("menu-");
}

export function invalidateEventiCache(): void {
  clearCache("eventi");
}
