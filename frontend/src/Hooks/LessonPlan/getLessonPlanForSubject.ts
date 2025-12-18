import { useCallback, useEffect, useState } from "react";
import { LessonPlanSubject } from "@/Interfaces/BaseType";
import { subjectService } from "@/libs/api";

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
      const response = await subjectService.getAll();
      setLessonPlanForSubjects(response.items || []);
      setError(null);
    } catch (error: any) {
      setError(
        "Problem prilikom učitvanja priprema za čas. Molimo Vas da pokušate kasnije.",
      );
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
