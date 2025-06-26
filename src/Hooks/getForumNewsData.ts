import { useEffect, useState } from "react";
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
      setError(
        "Problem prilikom učitvanja forumskih vesti. Molimo Vas da pokušate kasnije.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchForumNews();
  }, []);

  return { forumNews, error, loading };
};
