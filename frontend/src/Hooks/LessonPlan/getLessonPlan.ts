import { useCallback, useEffect, useState } from "react";
import { LessonPlanType } from "@/Interfaces/BaseType";
import { lessonPlanService } from "@/libs/api";

export const useFetchLessonPlan = () => {
  const [lessonPlan, setLessonPlan] = useState<LessonPlanType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchLessonPlan = useCallback(async () => {
    setLoading(true);
    try {
      const response = await lessonPlanService.getAll();
      setLessonPlan(response.items || []);
      setError(null);
    } catch (error: any) {
      setError(
        "Problem prilikom učitvanja priprema za čas. Molimo Vas da pokušate kasnije.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLessonPlan();
  }, [fetchLessonPlan]);

  return {
    lessonPlan,
    error,
    loading,
    refetch: fetchLessonPlan,
  };
};
