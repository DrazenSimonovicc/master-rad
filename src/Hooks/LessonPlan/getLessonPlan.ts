import { useState, useEffect, useCallback } from "react";
import axios from "axios";

import { LessonPlanType } from "@/Interfaces/BaseType";
import { PocketBaseCollection } from "@/libs/pocketbase";

export const useFetchLessonPlan = () => {
  const [lessonPlan, setLessonPlan] = useState<LessonPlanType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchLessonPlan = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${PocketBaseCollection}/lesson_plan/records`,
      );
      setLessonPlan(response.data.items || []);
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
