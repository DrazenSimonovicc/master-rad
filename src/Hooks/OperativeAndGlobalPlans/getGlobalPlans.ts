import { useCallback, useEffect, useState } from "react";
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
        `${PocketBaseCollection}/global_plan/records`,
        {
          params: {
            filter: `user="${userId}"`,
          },
        },
      );
      setGlobalPlans(response.data.items || []);
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
