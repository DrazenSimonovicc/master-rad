import { useState, useEffect, useCallback } from "react";
import axios from "axios";

import { LessonPlanSubject } from "@/Interfaces/BaseType";
import { PocketBaseCollection } from "@/libs/pocketbase";

export const useFetchLessonPlansForSubject = (userId: string) => {
  const [lessonPlanForSubjects, setLessonPlanForSubjects] = useState<
    LessonPlanSubject[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchLessonPlanForSubjects = useCallback(async () => {
    if (!userId) return;

    setLoading(true);

    try {
      const response = await axios.get(
        `${PocketBaseCollection}/lesson_plan_for_subject/records`,
        {
          params: {
            filter: `user="${userId}"`,
          },
        },
      );
      setLessonPlanForSubjects(response.data.items || []);
      setError(null);
    } catch (error: any) {
      setError("Error fetching plans. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchLessonPlanForSubjects();
  }, [fetchLessonPlanForSubjects]);

  return {
    lessonPlanForSubjects,
    error,
    loading,
    refetch: fetchLessonPlanForSubjects,
  };
};
