import { useState, useEffect, useCallback } from "react";
import axios from "axios";

import { GlobalPlansItemType } from "@/Interfaces/BaseType";
import { PocketBaseCollection } from "@/libs/pocketbase";

export const useFetchGlobalPlans = (userId: string) => {
  const [globalPlans, setGlobalPlans] = useState<GlobalPlansItemType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchGlobalPlans = useCallback(async () => {
    if (!userId) return;

    setLoading(true);

    try {
      const response = await axios.get(
        `${PocketBaseCollection}/globalni_planovi/records`,
        {
          params: {
            filter: `user="${userId}"`,
          },
        },
      );
      setGlobalPlans(response.data.items || []);
      setError(null);
    } catch (error: any) {
      setError("Error fetching plans. Please try again later.");
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
