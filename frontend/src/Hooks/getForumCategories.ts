import { useEffect, useState } from "react";
import { NewsCategoriesItemType } from "@/Interfaces/BaseType";
import { forumService } from "@/libs/api";

export const useFetchNewsCategories = () => {
  const [categories, setCategories] = useState<NewsCategoriesItemType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  async function fetchNewsCategories() {
    try {
      const response = await forumService.getCategories();
      setCategories(response.items || []);
      setError(null);
    } catch (error: any) {
      setError(
        "Problem prilikom učitvanja kategorija. Molimo Vas da pokušate kasnije.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNewsCategories();
  }, []);

  return { categories, error, loading };
};
