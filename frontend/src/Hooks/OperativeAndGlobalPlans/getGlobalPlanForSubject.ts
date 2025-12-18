import { useCallback, useEffect, useState } from "react";
import { GlobalPlansSubjectType } from "@/Interfaces/BaseType";
import { globalPlanService } from "@/libs/api";

export const useFetchGlobalPlansWithSubject = () => {
  const [globalPlansForSubject, setGlobalPlansForSubject] = useState<
    GlobalPlansSubjectType[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchGlobalPlans = useCallback(async () => {
    setLoading(true);

    try {
      const response = await globalPlanService.getAllSubjects();
      if (response && response.items) {
        setGlobalPlansForSubject(response.items);
      } else {
        setGlobalPlansForSubject([]);
      }
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(
        "Greška pri preuzimanju globalnih planova. Pokušajte ponovo kasnije.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGlobalPlans();
  }, [fetchGlobalPlans]);

  return {
    globalPlansForSubject,
    error,
    loading,
    refetch: fetchGlobalPlans,
  };
};
