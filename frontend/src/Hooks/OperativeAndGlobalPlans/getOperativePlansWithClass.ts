import { useCallback, useEffect, useState } from "react";
import { ClassBasicInfo } from "@/Interfaces/BaseType";
import { subjectService } from "@/libs/api";

export const useFetchOperativePlansWithClass = () => {
  const [operativePlansForClass, setOperativePlansForClass] = useState<
    ClassBasicInfo[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchOperativePlansForClass = useCallback(async () => {
    setLoading(true);
    try {
      const response = await subjectService.getAll();
      setOperativePlansForClass(response.items || []);
      setError(null);
    } catch (error: any) {
      setError(
        "Problem prilikom učitvanja operativnih planova. Molimo Vas da pokušate kasnije.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOperativePlansForClass();
  }, [fetchOperativePlansForClass]);

  return {
    operativePlansForClass,
    error,
    loading,
    refetch: fetchOperativePlansForClass,
  };
};
