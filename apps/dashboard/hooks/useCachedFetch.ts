import { useState, useEffect, useCallback } from "react";
import { useGlobalCache } from "../components/providers/CacheProvider";

interface CachedFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isRefreshing: boolean;
}

export function useCachedFetch<T>(url: string, defaultData: T | null = null): CachedFetchResult<T> {
  const { get, set } = useGlobalCache();
  const [data, setData] = useState<T | null>(() => get(url) ?? defaultData);
  const [loading, setLoading] = useState<boolean>(!get(url));
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = useCallback(async (forceRefresh = false) => {
    if (!forceRefresh) {
      const cached = get(url);
      if (cached) {
        setData(cached);
        setLoading(false);
        return;
      }
    } else {
      setIsRefreshing(true);
    }

    try {
      if (!forceRefresh) setLoading(true);
      setError(null);
      
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(url, { headers });
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      
      set(url, json);
      setData(json);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load data");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [url, get, set]);

  useEffect(() => {
    fetchData(false);
  }, [fetchData]);

  const refetch = () => fetchData(true);

  return { data, loading, error, refetch, isRefreshing };
}
