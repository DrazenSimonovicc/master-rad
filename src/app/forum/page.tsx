"use client";

import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { Header } from "@/Components/Header/Header";
import { CategoryPicker } from "@/Components/CategoryPicker/CategoryPicker";
import { ForumNews } from "@/Components/ForumNews/ForumNews";
import { Footer } from "@/Components/Footer";
import { Title } from "@/Components/Texts/Title";
import { Modal } from "@/Components/Modal";
import { TextField, Input } from "@mui/material";

import styles from "./page.module.scss";
import { useFetchForumNews } from "@/Hooks/getForumNewsData";
import { useAuth } from "@/Hooks/useAuth";
import { Button } from "@/Components/Button";

import Preloader from "@/Components/Preloader/Preloader";
import { useFetchNewsCategories } from "@/Hooks/getForumCategories";
import TextEditorWithLabel from "@/Components/Texts/TextEditorWithLabel/TextEditorWithLabel";

export default function Page() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { userData, isLoggedIn, authLoading } = useAuth();

  const {
    forumNews,
    error: forumNewsError,
    loading: forumNewsLoading,
  } = useFetchForumNews();

  const {
    categories,
    error: categoriesError,
    loading: categoriesLoading,
  } = useFetchNewsCategories();

  const [newsList, setNewsList] = useState(forumNews);

  useEffect(() => {
    setNewsList(forumNews);
  }, [forumNews]);

  const formik = useFormik({
    initialValues: {
      title: "",
      text: "",
      image_description: "",
    },

    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("author_name", userData.name);
        formData.append("current_work", userData.current_work);
        formData.append("title", values.title);
        formData.append("text", values.text);
        formData.append("image_description", values.image_description);
        if (selectedCategoryId !== null) {
          formData.append("category", selectedCategoryId);
        }

        if (selectedFile) {
          formData.append("image_url", selectedFile);
        }

        const response = await axios.post(
          "http://127.0.0.1:8090/api/collections/forum_news/records?expand=user,category",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );

        setOpen(false);

        const updated = await axios.get(
          "http://127.0.0.1:8090/api/collections/forum_news/records?expand=user,category",
        );

        setNewsList(updated.data.items);
        formik.resetForm();
        setSelectedFile(null);
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleOpenModal = () => {
    setOpen(true);
  };

  const breadCrumb = {
    level1: "Početak",
    level2: "Forum",
    level1url: "/",
    level2url: "/forum",
  };

  const filteredNews = selectedCategoryId
    ? newsList.filter(
        (news) => news.expand?.category?.category_name === selectedCategoryId,
      )
    : newsList;

  if (forumNewsLoading || categoriesLoading) {
    return <Preloader page />;
  }

  if (forumNewsError || categoriesError) {
    return <div>Error: {forumNewsError || categoriesError}</div>;
  }

  return (
    <main>
      <Header
        title={"Forum"}
        imageUrl={"/try.jpg"}
        breadcrumbItems={breadCrumb}
      />

      {isLoggedIn && (
        <div className={styles.newNews}>
          <Button
            title={"Dodaj novu vest"}
            themes={[
              "orange",
              "standardWide",
              "standardHeight",
              "noBorderRadius",
              "maxWidth",
            ]}
            onClick={handleOpenModal}
          />
        </div>
      )}

      <div className={styles.mainNewsWrapper}>
        <div className={styles.mainNews}>
          <Title text={"Glavna vest"} level={2} />
          <ForumNews data={newsList.filter((a) => a.main_news)} />
        </div>
      </div>

      <div className={styles.categoryWrapper}>
        <CategoryPicker onCategorySelect={setSelectedCategoryId} />
      </div>

      <div className={styles.otherNewsWrapper}>
        <div className={styles.otherNews}>
          <Title text={"Ostale vesti"} level={2} />
          <ForumNews
            data={newsList
              .filter((a) => !a.main_news)
              .sort(
                (a, b) =>
                  new Date(b.created).getTime() - new Date(a.created).getTime(),
              )}
          />
        </div>
      </div>

      <Footer />

      <Modal
        title="Nova vest"
        isOpen={open}
        setIsOpen={setOpen}
        description="Popunite polja da biste podelili najnovije informacije sa zajednicom."
        theme={"halfScreen"}
      >
        <form onSubmit={formik.handleSubmit} className={styles.form}>
          <TextField
            label="Naslov vesti"
            placeholder={"Unesite naslov vesti"}
            variant="outlined"
            fullWidth
            value={formik.values.title}
            onChange={formik.handleChange}
            name="title"
          />

          <TextField
            select
            label="Kategorija"
            value={selectedCategoryId || ""}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            SelectProps={{ native: true }}
            fullWidth
          >
            <option value="" disabled hidden>
              Kategorija
            </option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.category_name}
              </option>
            ))}
          </TextField>

          <TextEditorWithLabel
            onChange={(html) => formik.setFieldValue("text", html)}
            task={formik.values.text}
            label={"Tekst vesti"}
          />

          <div className={styles.imageUploadWrapper}>
            <div className={styles.inputWrapper}>
              <label>Dodajte fotografiju koju želite da objavite.</label>
              <Input
                type="file"
                onChange={handleFileChange}
                inputProps={{ accept: "image/*" }}
              />
            </div>

            <TextField
              label="Opis fotografije"
              variant="outlined"
              fullWidth
              value={formik.values.image_description}
              onChange={formik.handleChange}
              name="image_description"
            />
          </div>

          <div>
            <Button
              title={"Dodaj vest"}
              themes={[
                "blue",
                "standardWide",
                "standardHeight",
                "noBorderRadius",
                "maxWidth",
              ]}
              type={"submit"}
            />
          </div>
        </form>
      </Modal>
    </main>
  );
}
