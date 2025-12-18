import { useEffect, useState } from "react";
import { ForumNewsItemType } from "@/Interfaces/BaseType";
import { forumService } from "@/libs/api";

export const useFetchForumNews = () => {
  const [forumNews, setForumNews] = useState<ForumNewsItemType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  async function fetchForumNews() {
    try {
      const response = await forumService.getAllNews("user,category");
      setForumNews(response.items || []);
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
