import { useState, useEffect, useCallback } from "react";
import axios from "axios";

import { TestItemType } from "@/Interfaces/BaseType";
import { PocketBaseCollection } from "@/libs/pocketbase";

export const useFetchTest = () => {
  const [test, setTest] = useState<TestItemType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTest = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${PocketBaseCollection}/test/records`);
      setTest(response.data.items || []);
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
