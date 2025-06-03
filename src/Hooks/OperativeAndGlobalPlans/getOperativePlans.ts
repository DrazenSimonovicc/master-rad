import { useState, useEffect, useCallback } from "react";
import axios from "axios";

import { OperativePlansItemType } from "@/Interfaces/BaseType";
import { PocketBaseCollection } from "@/libs/pocketbase";

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
      const response = await axios.get(
        `${PocketBaseCollection}/operativni_planovi/records`,
        {
          params: {
            filter: `user="${userId}"`,
          },
        },
      );
      setOperativePlans(response.data.items || []);
      setError(null);
    } catch (error: any) {
      setError("Error fetching plans. Please try again later.");
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
