import { useState, useEffect, useCallback } from "react";
import axios from "axios";

import { ClassBasicInfo } from "@/Interfaces/BaseType";
import { PocketBaseCollection } from "@/libs/pocketbase";

export const useFetchOperativePlansWithClass = () => {
  const [operativePlansForClass, setOperativePlansForClass] = useState<
    ClassBasicInfo[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchOperativePlansForClass = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${PocketBaseCollection}/operative_plan_for_class/records`,
      );
      setOperativePlansForClass(response.data.items || []);
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
