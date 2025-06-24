import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { GlobalPlansSubjectType } from "@/Interfaces/BaseType";
import { PocketBaseCollection } from "@/libs/pocketbase";

export const useFetchGlobalPlansWithSubject = () => {
  const [globalPlansForSubject, setGlobalPlansForSubject] = useState<
    GlobalPlansSubjectType[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchGlobalPlans = useCallback(async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        `${PocketBaseCollection}/global_plan_for_subject/records`,
      );
      if (response.data && response.data.items) {
        setGlobalPlansForSubject(response.data.items);
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
