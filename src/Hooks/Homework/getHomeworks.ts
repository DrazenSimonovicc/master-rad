import { useState, useEffect, useCallback } from "react";
import axios from "axios";

import { HomeworkItemType } from "@/Interfaces/BaseType";
import { PocketBaseCollection } from "@/libs/pocketbase";

export const useFetchHomeworks = () => {
  const [homework, setHomework] = useState<HomeworkItemType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchHomework = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${PocketBaseCollection}/homework/records`,
      );
      setHomework(response.data.items || []);
      setError(null);
    } catch (error: any) {
      setError("Error fetching plans. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomework();
  }, [fetchHomework]);

  return {
    homework,
    error,
    loading,
    refetch: fetchHomework,
  };
};
