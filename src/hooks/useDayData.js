import { useState, useEffect, useCallback } from "react";
import { getDay, saveDay as apiSave } from "../api/storage";
import { dateKey } from "../constants/dates";
import { uid, deepClone } from "../utils/helpers";

/**
 * Loads the execution data for a specific date.
 * If the day has no saved data, it materializes rituals from the
 * weekly plan by resolving each slot's templateId.
 *
 * @param {Date}   date       Calendar date
 * @param {Object} plan       From usePlan()
 * @param {Array}  templates  From useTemplates()
 */
export function useDayData(date, plan, templates) {
  const [dayData, setDayData] = useState(null);
  const [loading, setLoading] = useState(true);

  const dk = dateKey(date);
  const dow = date.getDay();

  const loadDay = useCallback(async () => {
    setLoading(true);
    try {
      const existing = await getDay(dk);

      if (existing) {
        setDayData(existing);
      } else {
        const slots = plan?.days?.[dow] || [];

        const rituals = slots
          .map((slot) => {
            const tpl = templates.find((t) => t.id === slot.templateId);
            if (!tpl) return null;

            return {
              id: uid(),
              templateId: tpl.id,
              name: tpl.name,
              startTime: slot.startTime,
              notes: "",
              activities: tpl.activities.map((a) => ({
                ...deepClone(a),
                id: uid(),
                done: false,
              })),
            };
          })
          .filter(Boolean)
          .sort((a, b) => a.startTime.localeCompare(b.startTime));

        const fresh = { rituals };
        setDayData(fresh);
        await apiSave(dk, fresh);
      }
    } catch {
      setDayData({ rituals: [] });
    }

    setLoading(false);
  }, [dk, plan, templates, dow]);

  useEffect(() => {
    if (!plan || !templates) return;
    loadDay();
  }, [plan, templates, loadDay]);

  const save = useCallback(
    async (next) => {
      setDayData(next);
      try { await apiSave(dk, next); } catch (e) { console.error("saveDay failed:", e); }
    },
    [dk],
  );

  return { dayData, saveDay: save, loadDay, loading };
}
