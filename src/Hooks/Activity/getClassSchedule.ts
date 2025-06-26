import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { ClassScheduleType } from "@/Interfaces/BaseType";
import { PocketBaseCollection } from "@/libs/pocketbase";

export const useFetchClassSchedule = (userId: string) => {
  const [classSchedule, setClassSchedule] = useState<ClassScheduleType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchClassSchedule = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const response = await axios.get<{ items: ClassScheduleType[] }>(
        `${PocketBaseCollection}/class_schedule/records`,
        {
          params: {
            filter: `user="${userId}"`,
          },
        },
      );
      setClassSchedule(response.data.items || []);
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
