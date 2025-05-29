"use client";

import { Header } from "@/Components/Header/Header";
import { SidebarWrapper } from "@/Components/Layout/Sidebar/SidebarWrapper";
import { Button } from "@/Components/Button";
import React, { useState } from "react";
import { useAuth } from "@/Hooks/useAuth";
import { Modal } from "@/Components/Modal";
import styles from "./page.module.scss";
import { useFormik } from "formik";
import axios from "axios";
import { TextField } from "@mui/material";
import { PocketBaseCollection } from "@/libs/pocketbase";
import { Title } from "@/Components/Texts/Title";
import { homeworkSubjectConfig } from "@/app/resursi-za-nastavu/domaci-zadaci/config";
import { useFetchHomeworkSubjects } from "@/Hooks/Homework/getHomeworkSubjects";
import SubjectCard from "@/Components/SubjectCard/SubjectCard";
import RequireAuth from "@/Components/RequireAuth/RequireAuth";
import Preloader from "@/Components/Preloader/Preloader";

const HomeworkSubjects = () => {
  const breadCrumb = {
    level1: "Početak",
    level2: "Resursi za nastavu",
    level3: "Domaci zadaci",
    level1url: "/",
    level2url: "/resursi-za-nastavu",
    level3url: "/resursi-za-nastavu/domaci-zadaci",
  };

  const { userData, isLoggedIn } = useAuth();
  const [openHomeworkModal, setOpenHomeworkModal] = useState(false);

  const handleOpenOperativeModal = () => setOpenHomeworkModal(true);

  const {
    homeworkSubjects,
    error: onError,
    loading: onLoading,
    refetch: refetchOperative,
  } = useFetchHomeworkSubjects(userData?.id);

  const formikOperative = useFormik({
    initialValues: {
      subject: "",
      grade: "",
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        await axios.post(`${PocketBaseCollection}/homework_subjects/records`, {
          ...values,
          user: userData.id,
        });
        resetForm();
        setOpenHomeworkModal(false);
        await refetchOperative();
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
  });

  if (isLoggedIn && onLoading) {
    return <Preloader page />;
  }

  if (isLoggedIn && onError) return <div>Greška u učitavanju {onError}</div>;

  return (
    <div>
      <div className={!isLoggedIn ? styles.blurWrapper : ""}>
        <Header
          title={"Domaci zadaci"}
          imageUrl={"/forum-1.jpg"}
          breadcrumbItems={breadCrumb}
        />

        {isLoggedIn && (
          <div className={styles.addButtonWrapper}>
            <Button
              title={"Dodaj novi predmet i razred"}
              themes={[
                "blue",
                "standardWide",
                "standardHeight",
                "noBorderRadius",
                "maxWidth",
              ]}
              onClick={handleOpenOperativeModal}
            />
          </div>
        )}

        <section className={styles.container}>
          <div className={styles.referencesWrap}>
            {homeworkSubjects && homeworkSubjects.length > 0 && (
              <Title
                text={"Spisak predmeta"}
                level={2}
                className={styles.title}
              />
            )}
            <div className={styles.cardsWrapper}>
              {homeworkSubjects.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  subject={subject.subject}
                  grade={subject.grade}
                  link={"/resursi-za-nastavu/domaci-zadaci"}
                  id={subject.id}
                />
              ))}
            </div>
          </div>
          <aside className={styles.sidebarWrap}>
            <SidebarWrapper />
          </aside>
        </section>

        <Modal
          title="Dodaj nastavni predmet i razred"
          isOpen={openHomeworkModal}
          setIsOpen={setOpenHomeworkModal}
          description="Dodajte nastavni predmet i razred."
          theme={"halfScreen"}
        >
          <form onSubmit={formikOperative.handleSubmit} className={styles.form}>
            {Object.entries(homeworkSubjectConfig).map(([key, config]) => (
              <TextField
                key={key}
                label={config.label}
                placeholder={config.placeholder}
                variant="outlined"
                fullWidth
                margin="normal"
                name={key}
                value={
                  formikOperative.values[
                    key as keyof typeof formikOperative.values
                  ]
                }
                onChange={formikOperative.handleChange}
              />
            ))}

            <Button
              title={"Dodaj nastavni predmet"}
              themes={[
                "blue",
                "standardWide",
                "standardHeight",
                "noBorderRadius",
                "maxWidth",
              ]}
              type={"submit"}
            />
          </form>
        </Modal>
      </div>
      {!isLoggedIn && <RequireAuth />}
    </div>
  );
};

export default HomeworkSubjects;
