"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/Components/Header/Header";
import { ForumNewsItemType } from "@/Interfaces/BaseType";
import { useFetchForumNews } from "@/Hooks/getForumNewsData";
import { Footer } from "@/Components/Footer";
import { useAuth } from "@/Hooks/useAuth";
import { SidebarWrapper } from "@/Components/Layout/Sidebar/SidebarWrapper";

import styles from "./page.module.scss";
import { Title } from "@/Components/Texts/Title";
import axios from "axios";
import { IconButton } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import Preloader from "@/Components/Preloader/Preloader";

const NewsArticle = () => {
  const { forumNews, error, loading } = useFetchForumNews();

  const [newsItem, setNewsItem] = useState<ForumNewsItemType | null>(null);
  const params = useParams();
  const { userData } = useAuth();

  const [likes, setLikes] = useState<number>(0);
  const [dislikes, setDislikes] = useState<number>(0);

  useEffect(() => {
    if (forumNews.length > 0 && params.id) {
      const item = forumNews.find((item) => item.id === params.id);
      setNewsItem(item || null);
      if (item) {
        setLikes(Number(item.likes) || 0);
        setDislikes(Number(item.dislikes) || 0);
      }
    }
  }, [forumNews, params.id]);

  if (loading)
    return (
      <div>
        <Preloader page />
      </div>
    );
  if (error) return <div>Greška u učitavanju vesti: {error}</div>;

  if (!newsItem) {
    return <p>News article not found.</p>;
  }

  const breadCrumb = {
    level1: "Početak",
    level2: "Forum",
    level3: newsItem.title || "News Title",
    level1url: "/",
    level2url: "/forum",
    level3url: `/forum/${newsItem.id}`,
  };

  const updateLikeDislikeCount = async (
    id: string,
    likes: number,
    dislikes: number,
  ) => {
    try {
      const response = await axios.patch(
        `http://127.0.0.1:8090/api/collections/forum_news/records/${id}?expand=user,category`,
        {
          likes,
          dislikes,
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error updating like/dislike count:", error);
      throw error;
    }
  };

  const handleLike = async () => {
    const newLikes = likes + 1;
    setLikes(newLikes);

    try {
      await updateLikeDislikeCount(newsItem.id, newLikes, dislikes);
    } catch (error) {
      console.error("Failed to update likes:", error);
      setLikes(likes);
    }
  };

  const handleUnlike = async () => {
    const newDislikes = dislikes + 1;
    setDislikes(newDislikes);

    try {
      await updateLikeDislikeCount(newsItem.id, likes, newDislikes);
    } catch (error) {
      console.error("Failed to update dislikes:", error);
      setDislikes(dislikes);
    }
  };

  return (
    <div>
      <Header
        title={"Forum"}
        imageUrl={"/try.jpg"}
        breadcrumbItems={breadCrumb}
      />

      <section className={styles.container}>
        <div className={styles.referencesWrap}>
          <Title text={newsItem.title} level={2} className={styles.title} />

          <div className={styles.infoWrap}>
            <div className={styles.name}>
              Autor:
              <span>
                {" "}
                {newsItem.expand?.user?.name || newsItem.author_name} |
              </span>
              <span> {new Date(newsItem.created).toLocaleDateString()}</span>
              {newsItem.expand?.category?.category_name && (
                <span> | {newsItem.expand.category.category_name}</span>
              )}
            </div>
            <div className={styles.bottomInfo}>
              {newsItem.expand?.user?.current_work && (
                <span>{newsItem.expand.user.current_work}</span>
              )}
            </div>
            <div className={styles.likesSection}>
              <IconButton aria-label="like" onClick={handleLike}>
                <ThumbUpIcon />
              </IconButton>
              <span className={styles.likesSpan}>{likes}</span>

              <IconButton aria-label="unlike" onClick={handleUnlike}>
                <ThumbDownIcon />
              </IconButton>
              <span className={styles.likesSpan}>{dislikes}</span>
            </div>
          </div>

          {newsItem.image_url && (
            <picture>
              <img
                alt={newsItem.image_description}
                src={`http://127.0.0.1:8090/api/files/pbc_1315766310/${newsItem.id}/${newsItem.image_url}`}
              />
            </picture>
          )}

          <div
            dangerouslySetInnerHTML={{
              __html: (newsItem.text || "").replace(/\n/g, "<br />"),
            }}
          ></div>
        </div>
        <aside className={styles.sidebarWrap}>
          <SidebarWrapper />
        </aside>
      </section>
      <Footer />
    </div>
  );
};

export default NewsArticle;
