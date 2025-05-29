import { useState, useEffect, useCallback } from "react";
import axios from "axios";

import { HomeworkSubject } from "@/Interfaces/BaseType";
import { PocketBaseCollection } from "@/libs/pocketbase";

export const useFetchHomeworkSubjects = (userId: string) => {
  const [homeworkSubjects, setHomeworkSubjects] = useState<HomeworkSubject[]>(
    [],
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchHomeworkSubjects = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `${PocketBaseCollection}/homework_subjects/records`,
        {
          params: {
            filter: `user="${userId}"`,
          },
        },
      );
      setHomeworkSubjects(response.data.items || []);
      setError(null);
    } catch (error: any) {
      setError("Error fetching plans. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchHomeworkSubjects();
  }, [fetchHomeworkSubjects]);

  return {
    homeworkSubjects,
    error,
    loading,
    refetch: fetchHomeworkSubjects,
  };
};
