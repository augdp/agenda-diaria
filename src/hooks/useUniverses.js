import { useState, useEffect, useCallback } from "react";
import { getUniverses, saveUniverses as apiSave } from "../api/storage";
import { DEFAULT_UNIVERSES } from "../constants";

export function useUniverses() {
  const [universes, setUniverses] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getUniverses();
        setUniverses(data || DEFAULT_UNIVERSES);
      } catch {
        setUniverses(DEFAULT_UNIVERSES);
      }
      setLoading(false);
    })();
  }, []);

  const save = useCallback(async (next) => {
    setUniverses(next);
    try { await apiSave(next); } catch (e) { console.error("saveUniverses failed:", e); }
  }, []);

  return { universes, saveUniverses: save, loading };
}
