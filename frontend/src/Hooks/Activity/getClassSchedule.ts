import { useCallback, useEffect, useState } from "react";
import { ClassScheduleType } from "@/Interfaces/BaseType";
import { classScheduleService } from "@/libs/api";

export const useFetchClassSchedule = (userId: string) => {
  const [classSchedule, setClassSchedule] = useState<ClassScheduleType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchClassSchedule = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const response = await classScheduleService.getAll();
      setClassSchedule(response.items || []);
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Problem prilikom učitvanja rasporeda časova. Molimo Vas da pokušate kasnije.",
        );
      }
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchClassSchedule();
  }, [fetchClassSchedule]);

  return {
    classSchedule,
    error,
    loading,
    refetch: fetchClassSchedule,
  };
};
