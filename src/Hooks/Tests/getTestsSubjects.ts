import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { TestsSubject } from "@/Interfaces/BaseType";
import { PocketBaseCollection } from "@/libs/pocketbase";

export const useFetchTestSubjects = (userId: string) => {
  const [testSubjects, setTestSubjects] = useState<TestsSubject[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTestSubjects = useCallback(async () => {
    if (!userId) return;

    setLoading(true);

    try {
      const response = await axios.get(
        `${PocketBaseCollection}/test_subjects/records`,
        {
          params: {
            filter: `user="${userId}"`,
          },
        },
      );
      setTestSubjects(response.data.items || []);
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
