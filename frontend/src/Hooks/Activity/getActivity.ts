import { useCallback, useEffect, useState } from "react";
import { ActivityType } from "@/Interfaces/BaseType";
import { activityService } from "@/libs/api";

export const useFetchActivity = (userId?: string) => {
  const [activity, setActivity] = useState<ActivityType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchActivity = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const response = await activityService.getAll(`user="${userId}"`);
      setActivity(response.items || []);
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
