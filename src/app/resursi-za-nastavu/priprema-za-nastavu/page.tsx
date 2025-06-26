"use client";

import React, { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import { TextField } from "@mui/material";
import { Button } from "@/Components/Button";
import { Footer } from "@/Components/Footer";
import { Header } from "@/Components/Header/Header";
import { SidebarWrapper } from "@/Components/Layout/Sidebar/SidebarWrapper";
import { Modal } from "@/Components/Modal";
import Preloader from "@/Components/Preloader/Preloader";
import RequireAuth from "@/Components/RequireAuth/RequireAuth";
import SubjectCard from "@/Components/SubjectCard/SubjectCard";
import { Title } from "@/Components/Texts/Title";
import { useFetchLessonPlansForSubject } from "@/Hooks/LessonPlan/getLessonPlanForSubject";
import { useAuth } from "@/Hooks/useAuth";
import { PocketBaseCollection } from "@/libs/pocketbase";
import { LessonSubjectValidationSchema } from "@/app/resursi-za-nastavu/priprema-za-nastavu/Validation";
import { lessonPlanSubjectConfig } from "@/app/resursi-za-nastavu/priprema-za-nastavu/config";
import styles from "./page.module.scss";

const LessonPlanSubjects = () => {
  const breadCrumb = {
    level1: "Početak",
    level2: "Resursi za nastavu",
    level3: "Priprema za nastavu",
    level1url: "/",
    level2url: "/resursi-za-nastavu",
    level3url: "/resursi-za-nastavu/priprema-za-nastavu",
  };

  const { userData, isLoggedIn } = useAuth();
  const {
    lessonPlanForSubjects,
    error: onError,
    loading: onLoading,
    refetch: refetchOperative,
  } = useFetchLessonPlansForSubject(userData?.id);

  const [openTestModal, setOpenTestModal] = useState(false);

  const handleOpenOperativeModal = () => setOpenTestModal(true);

  const formikOperative = useFormik({
    initialValues: {
      subject: "",
      grade: "",
    },
    validationSchema: LessonSubjectValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await axios.post(
          `${PocketBaseCollection}/lesson_plan_for_subject/records`,
          {
            ...values,
            user: userData.id,
          },
        );
        resetForm();
        setOpenTestModal(false);
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
          title={"Priprema za nastavu"}
          imageUrl={"/forum-1.jpg"}
          breadcrumbItems={breadCrumb}
        />

        {isLoggedIn && (
          <div className={styles.addButtonWrapper}>
            <Button
              title={"Dodaj novi predmet i razred"}
              themes={[
                "orange",
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
            {lessonPlanForSubjects && lessonPlanForSubjects.length > 0 && (
              <Title
                text={"Spisak predmeta"}
                level={2}
                className={styles.title}
              />
            )}
            <div className={styles.cardsWrapper}>
              {lessonPlanForSubjects.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  subject={subject.subject}
                  grade={subject.grade}
                  link={"/resursi-za-nastavu/priprema-za-nastavu"}
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
          isOpen={openTestModal}
          setIsOpen={setOpenTestModal}
          description="Dodajte nastavni predmet i razred."
          theme={"halfScreen"}
        >
          <form onSubmit={formikOperative.handleSubmit} className={styles.form}>
            {Object.entries(lessonPlanSubjectConfig).map(([key, config]) => (
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
                error={
                  !!formikOperative.touched[
                    key as keyof typeof formikOperative.touched
                  ] &&
                  !!formikOperative.errors[
                    key as keyof typeof formikOperative.errors
                  ]
                }
                helperText={
                  formikOperative.touched[
                    key as keyof typeof formikOperative.touched
                  ] &&
                  formikOperative.errors[
                    key as keyof typeof formikOperative.errors
                  ]
                }
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
      <Footer />

      {!isLoggedIn && <RequireAuth />}
    </div>
  );
};

export default LessonPlanSubjects;
