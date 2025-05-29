import { useState, useEffect } from "react";
import axios from "axios";

import { ForumNewsItemType } from "@/Interfaces/BaseType";
import { PocketBaseCollection } from "@/libs/pocketbase";

export const useFetchForumNews = () => {
  const [forumNews, setForumNews] = useState<ForumNewsItemType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  async function fetchForumNews() {
    try {
      const response = await axios.get(
        `${PocketBaseCollection}/forum_news/records?expand=user,category`,
      );
      setForumNews(response.data.items || []);
      setError(null);
    } catch (error: any) {
      setError("Error fetching to-do items. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchForumNews();
  }, []);

  return { forumNews, error, loading };
};
