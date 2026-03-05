import { useStorage } from "./useStorage";
import { PLAN_KEY, emptyPlan, DEFAULT_UNIVERSES } from "../constants";

/**
 * Manages the weekly plan (template rituals per weekday + universe definitions).
 *
 * @returns {{ plan, savePlan, loading, universes }}
 */
export function usePlan() {
  const { data: plan, save: savePlan, loading } = useStorage(PLAN_KEY, emptyPlan);

  const universes = plan?.universes || DEFAULT_UNIVERSES;

  return { plan, savePlan, loading, universes };
}
