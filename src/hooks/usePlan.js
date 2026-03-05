import { useState, useEffect, useCallback } from "react";
import { getPlan, savePlan as apiSave } from "../api/storage";
import { emptyPlan } from "../constants";

/**
 * Weekly plan: plan.days[dow] is an array of slots.
 * Each slot: { id, templateId, startTime }
 */
export function usePlan() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getPlan();
        setPlan(data || emptyPlan());
      } catch {
        setPlan(emptyPlan());
      }
      setLoading(false);
    })();
  }, []);

  const save = useCallback(async (next) => {
    setPlan(next);
    try { await apiSave(next); } catch (e) { console.error("savePlan failed:", e); }
  }, []);

  return { plan, savePlan: save, loading };
}
