import { useState, useEffect, useCallback } from "react";
import { getTemplates, saveTemplates as apiSave } from "../api/storage";

/**
 * Manages the list of reusable ritual templates.
 *
 * A template is: { id, name, activities: [{ id, name, duration, universe }] }
 *
 * @returns {{ templates, saveTemplates, loading, getTemplate }}
 */
export function useTemplates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getTemplates();
        setTemplates(data || []);
      } catch {
        setTemplates([]);
      }
      setLoading(false);
    })();
  }, []);

  const save = useCallback(async (next) => {
    setTemplates(next);
    try { await apiSave(next); } catch (e) { console.error("saveTemplates failed:", e); }
  }, []);

  /** Look up a single template by ID. */
  const getTemplate = useCallback(
    (id) => templates.find((t) => t.id === id) || null,
    [templates],
  );

  return { templates, saveTemplates: save, loading, getTemplate };
}
