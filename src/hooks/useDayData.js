import { useState, useEffect, useCallback } from "react";
import { STORAGE_PREFIX } from "../constants";
import { dateKey } from "../constants/dates";
import { uid, deepClone } from "../utils/helpers";

/**
 * Loads day-level data. If the day has no saved data yet, it bootstraps
 * from the plan template for the matching weekday.
 *
 * @param {Date}   date   The calendar date
 * @param {Object} plan   The full plan object (from usePlan)
 * @returns {{ dayData, saveDay, loading }}
 */
export function useDayData(date, plan) {
  const [dayData, setDayData] = useState(null);
  const [loading, setLoading] = useState(true);

  const dk = dateKey(date);
  const storageKey = `${STORAGE_PREFIX}:${dk}`;
  const dow = date.getDay(); // 0-6

  useEffect(() => {
    if (!plan) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const result = await window.storage.get(storageKey);
        if (cancelled) return;

        if (result) {
          setDayData(JSON.parse(result.value));
        } else {
          // Bootstrap from plan template
          const template = (plan.days[dow] || []).map((rit) => ({
            ...deepClone(rit),
            id: uid(),
            notes: "",
            activities: rit.activities.map((a) => ({ ...a, id: uid(), done: false })),
          }));
          template.sort((a, b) => a.startTime.localeCompare(b.startTime));

          const fresh = { rituals: template, bootstrapped: true };
          setDayData(fresh);
          await window.storage.set(storageKey, JSON.stringify(fresh));
        }
      } catch {
        if (!cancelled) setDayData({ rituals: [], bootstrapped: false });
      }
      if (!cancelled) setLoading(false);
    })();

    return () => { cancelled = true; };
  }, [storageKey, plan, dow]);

  const saveDay = useCallback(
    async (next) => {
      setDayData(next);
      try {
        await window.storage.set(storageKey, JSON.stringify(next));
      } catch (e) {
        console.error("useDayData – save failed:", e);
      }
    },
    [storageKey],
  );

  return { dayData, saveDay, loading };
}
