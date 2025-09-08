"use client";

import { motion } from "framer-motion";
import React, { FC, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { IconButton, Pagination } from "@mui/material";
import { Title } from "@/Components/Texts/Title";
import { useFormattedSerbianDate } from "@/Hooks/useFormattedSerbianDate";
import { ForumNewsItemType } from "@/Interfaces/BaseType";
import clsx from "clsx";
import styles from "./ForumNews.module.scss";

interface ServicesBoxProps {
  data: ForumNewsItemType[];
  className?: string;
  triggerOnView?: boolean;
}

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

const containerVariants = {
  hidden: { opacity: 0, x: -100 },
  visible: () => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 1.5,
      ease: "easeOut",
    },
  }),
};

export const ForumNews: FC<ServicesBoxProps> = ({
  data,
  className,
  triggerOnView,
}) => {
  const [likes, setLikes] = useState<number[]>(data.map((item) => item.likes));
  const [unlikes, setUnlikes] = useState<number[]>(
    data.map((item) => item.dislikes),
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  const handleLike = async (index: number) => {
    const globalIndex = startIndex + index;
    const newLikes = [...likes];
    newLikes[globalIndex] += 1;
    setLikes(newLikes);

    const newsItem = data[globalIndex];
    try {
      await updateLikeDislikeCount(
        newsItem.id,
        newLikes[globalIndex],
        unlikes[globalIndex],
      );
    } catch (error) {
      console.error("Failed to update likes:", error);
    }
  };

  const handleUnlike = async (index: number) => {
    const globalIndex = startIndex + index;
    const newUnlikes = [...unlikes];
    newUnlikes[globalIndex] += 1;
    setUnlikes(newUnlikes);

    const newsItem = data[globalIndex];
    try {
      await updateLikeDislikeCount(
        newsItem.id,
        likes[globalIndex],
        newUnlikes[globalIndex],
      );
    } catch (error) {
      console.error("Failed to update dislikes:", error);
    }
  };

  useEffect(() => {
    setLikes(data.map((item) => item.likes));
    setUnlikes(data.map((item) => item.dislikes));
  }, [data]);

  const stripHtmlButKeepFormatting = (html: string): string => {
    if (typeof window !== "undefined") {
      const doc = new DOMParser().parseFromString(html, "text/html");
      const allowedTags = ["B", "STRONG", "I", "EM"];

      const walk = (node: Node): string => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent || "";
        }
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          allowedTags.includes((node as Element).tagName)
        ) {
          const tag = (node as Element).tagName.toLowerCase();
          const content = Array.from(node.childNodes).map(walk).join("");
          return `<${tag}>${content}</${tag}>`;
        }
        return Array.from(node.childNodes).map(walk).join("");
      };

      return walk(doc.body);
    }
    return html;
  };

  const truncateText = (html: string, wordLimit: number): string => {
    const textWithFormatting = stripHtmlButKeepFormatting(html);
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = textWithFormatting;
    const plainText = tempDiv.textContent || "";

    const words = plainText.split(" ");
    if (words.length > wordLimit) {
      const truncatedWords = words.slice(0, wordLimit).join(" ");
      const truncatedHtml = textWithFormatting
        .replace(plainText, truncatedWords)
        .trim();
      return truncatedHtml + "...";
    }

    return textWithFormatting;
  };

  return (
    <div>
      {paginatedData.map((d, index) => (
        <motion.div
          className={clsx(
            styles.servicesBox,
            { [styles.background]: d.main_news },
            className,
          )}
          key={d.id}
          custom={index}
          initial="hidden"
          animate={triggerOnView ? undefined : "visible"}
          whileInView={triggerOnView ? "visible" : undefined}
          viewport={triggerOnView ? { once: true, amount: 0.1 } : undefined}
          variants={containerVariants}
        >
          {d.image_url && (
            <div
              className={`${!d.main_news ? styles.smallImage : ""} ${styles.imageContainer}`}
            >
              <Image
                src={`http://127.0.0.1:8090/api/files/pbc_1315766310/${d.id}/${d.image_url}`}
                alt={d.image_description}
                fill
                className={styles.image}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 510px"
              />
            </div>
          )}
          <div className={styles.textContainer}>
            <div className={styles.personInfo}>
              <div
                className={clsx(styles.personName, {
                  [styles.mainPersonName]: d.main_news,
                })}
              >
                {d.author_name || d.expand?.user?.name || "Nepoznato"}
              </div>
              <div
                className={clsx(styles.schoolName, {
                  [styles.mainSchoolName]: d.main_news,
                })}
              >
                {d.current_work || d.expand?.user?.current_work
                  ? d.current_work || d.expand?.user?.current_work
                  : ""}
              </div>
              <div
                className={clsx(styles.dateAndLikes, {
                  [styles.mainDateAndLikes]: d.main_news,
                })}
              >
                <p>Objavljeno: {useFormattedSerbianDate(d.created)}</p>
                <div className={styles.likesSection}>
                  <IconButton
                    aria-label="like"
                    onClick={() => handleLike(index)}
                  >
                    <ThumbUpIcon />
                  </IconButton>
                  <span className={styles.likesSpan}>
                    {likes[startIndex + index]}
                  </span>

                  <IconButton
                    aria-label="unlike"
                    onClick={() => handleUnlike(index)}
                  >
                    <ThumbDownIcon />
                  </IconButton>
                  <span className={styles.likesSpan}>
                    {unlikes[startIndex + index]}
                  </span>
                </div>
              </div>
              <Title
                text={d.title}
                themes={["bold"]}
                className={clsx(styles.title, {
                  [styles.mainTitle]: d.main_news,
                })}
                level={d.main_news ? 2 : 3}
              />
              <div>
                <div
                  className={clsx(styles.text, {
                    [styles.mainText]: d.main_news,
                  })}
                  dangerouslySetInnerHTML={{ __html: truncateText(d.text, 40) }}
                />
                {d.additional_text && (
                  <p
                    className={clsx(styles.text, {
                      [styles.mainText]: d.main_news,
                    })}
                  >
                    {d.additional_text}
                  </p>
                )}
              </div>
              <Link href={`/forum/${d.id}`} className={styles.button}>
                Pročitaj vest
              </Link>
            </div>
          </div>
        </motion.div>
      ))}

      {data.length > itemsPerPage && (
        <div className={styles.paginationContainer}>
          <Pagination
            count={Math.ceil(data.length / itemsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
          />
        </div>
      )}
    </div>
  );
};
