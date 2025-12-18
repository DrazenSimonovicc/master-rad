import { useCallback, useEffect, useState } from "react";
import { HomeworkItemType } from "@/Interfaces/BaseType";
import { homeworkService } from "@/libs/api";

export const useFetchHomeworks = () => {
  const [homework, setHomework] = useState<HomeworkItemType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchHomework = useCallback(async () => {
    setLoading(true);
    try {
      const response = await homeworkService.getAll();
      setHomework(response.items || []);
      setError(null);
    } catch (error: any) {
      setError(
        "Problem prilikom učitvanja domaćih zadataka. Molimo Vas da pokušate kasnije.",
      );
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
