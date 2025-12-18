import { useCallback, useEffect, useState } from "react";
import { TestsSubject } from "@/Interfaces/BaseType";
import { subjectService } from "@/libs/api";

export const useFetchTestSubjects = (userId: string) => {
  const [testSubjects, setTestSubjects] = useState<TestsSubject[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTestSubjects = useCallback(async () => {
    if (!userId) return;

    setLoading(true);

    try {
      const response = await subjectService.getAll();
      setTestSubjects(response.items || []);
      setError(null);
    } catch (error: any) {
      setError(
        "Problem prilikom učitvanja podataka koji se nalaze u testovima. Molimo Vas da pokušate kasnije.",
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchTestSubjects();
  }, [fetchTestSubjects]);

  return {
    testSubjects,
    error,
    loading,
    refetch: fetchTestSubjects,
  };
};
