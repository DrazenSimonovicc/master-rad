import { useCallback, useEffect, useState } from "react";
import { TestItemType } from "@/Interfaces/BaseType";
import { testService } from "@/libs/api";

export const useFetchTest = () => {
  const [test, setTest] = useState<TestItemType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTest = useCallback(async () => {
    setLoading(true);
    try {
      const response = await testService.getAll();
      setTest(response.items || []);
      setError(null);
    } catch (error: any) {
      setError(
        "Problem prilikom učitvanja podataka koji se nalaze u testovima. Molimo Vas da pokušate kasnije.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTest();
  }, [fetchTest]);

  return {
    test,
    error,
    loading,
    refetch: fetchTest,
  };
};
