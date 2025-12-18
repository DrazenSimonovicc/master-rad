import { useCallback, useEffect, useState } from "react";
import { GlobalPlansItemType } from "@/Interfaces/BaseType";
import { globalPlanService } from "@/libs/api";

export const useFetchGlobalPlans = (userId: string) => {
  const [globalPlans, setGlobalPlans] = useState<GlobalPlansItemType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchGlobalPlans = useCallback(async () => {
    if (!userId) return;

    setLoading(true);

    try {
      const response = await globalPlanService.getAll();
      setGlobalPlans(response.items || []);
      setError(null);
    } catch (error: any) {
      setError(
        "Problem prilikom učitvanja globalnih planova. Molimo Vas da pokušate kasnije.",
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchGlobalPlans();
  }, [fetchGlobalPlans]);

  return {
    globalPlans,
    error,
    loading,
    refetch: fetchGlobalPlans,
  };
};
