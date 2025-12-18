import { useCallback, useEffect, useState } from "react";
import { OperativePlansItemType } from "@/Interfaces/BaseType";
import { operativePlanService } from "@/libs/api";

export const useFetchOperativePlans = (userId: string) => {
  const [operativePlans, setOperativePlans] = useState<
    OperativePlansItemType[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchOperativePlans = useCallback(async () => {
    if (!userId) return;

    setLoading(true);

    try {
      const response = await operativePlanService.getAll();
      setOperativePlans(response.items || []);
      setError(null);
    } catch (error: any) {
      setError(
        "Problem prilikom učitvanja operativnih planova. Molimo Vas da pokušate kasnije.",
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchOperativePlans();
  }, [fetchOperativePlans]);

  return {
    operativePlans,
    error,
    loading,
    refetch: fetchOperativePlans,
  };
};
