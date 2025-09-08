import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { ActivityType } from "@/Interfaces/BaseType";
import { PocketBaseCollection } from "@/libs/pocketbase";

export const useFetchActivity = (userId?: string) => {
  const [activity, setActivity] = useState<ActivityType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchActivity = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `${PocketBaseCollection}/activity/records`,
        {
          params: {
            filter: `user="${userId}"`,
          },
        },
      );
      setActivity(response.data.items || []);
      setError(null);
    } catch (error: any) {
      setError(
        "Problem prilikom učitvanja podataka koji se nalaze u aktivnostima. Molimo Vas da pokušate kasnije.",
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  return {
    activity,
    error,
    loading,
    refetch: fetchActivity,
  };
};
