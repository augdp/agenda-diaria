import { useState, useEffect, useCallback } from "react";

/**
 * Reads a JSON value from persistent storage, and provides a setter that
 * writes back to storage automatically.
 *
 * @param {string}   key          Storage key
 * @param {Function} fallback     Factory that returns the default value
 * @returns {{ data, save, loading }}
 */
export function useStorage(key, fallback) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Read
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const result = await window.storage.get(key);
        if (!cancelled) {
          setData(result ? JSON.parse(result.value) : fallback());
        }
      } catch {
        if (!cancelled) setData(fallback());
      }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  // Write
  const save = useCallback(
    async (next) => {
      setData(next);
      try {
        await window.storage.set(key, JSON.stringify(next));
      } catch (e) {
        console.error("useStorage – save failed:", e);
      }
    },
    [key],
  );

  return { data, save, loading };
}
