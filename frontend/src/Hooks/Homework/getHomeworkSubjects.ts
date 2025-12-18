import { useCallback, useEffect, useState } from "react";
import { HomeworkSubject } from "@/Interfaces/BaseType";
import { subjectService } from "@/libs/api";

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
      const response = await subjectService.getAll();
      setHomeworkSubjects(response.items || []);
      setError(null);
    } catch (error: any) {
      setError(
        "Problem prilikom učitvanja domaćih zadataka. Molimo Vas da pokušate kasnije.",
      );
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
