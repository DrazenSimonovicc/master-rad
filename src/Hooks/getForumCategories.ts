import { useState, useEffect } from "react";
import axios from "axios";

import { NewsCategoriesItemType } from "@/Interfaces/BaseType";
import { PocketBaseCollection } from "@/libs/pocketbase";

export const useFetchNewsCategories = () => {
  const [categories, setCategories] = useState<NewsCategoriesItemType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  async function fetchNewsCategories() {
    try {
      const response = await axios.get(
        `${PocketBaseCollection}/news_category/records`,
      );
      setCategories(response.data.items || []);
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
