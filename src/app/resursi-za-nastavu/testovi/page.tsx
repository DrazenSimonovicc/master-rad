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
import { useFetchTestSubjects } from "@/Hooks/Tests/getTestsSubjects";
import { testsSubjectConfig } from "@/app/resursi-za-nastavu/testovi/config";
import SubjectCard from "@/Components/SubjectCard/SubjectCard";
import RequireAuth from "@/Components/RequireAuth/RequireAuth";
import Preloader from "@/Components/Preloader/Preloader";
import { Footer } from "@/Components/Footer";
import * as Yup from "yup";

const TestsSubjects = () => {
  const breadCrumb = {
    level1: "Početak",
    level2: "Resursi za nastavu",
    level3: "Testovi",
    level1url: "/",
    level2url: "/resursi-za-nastavu",
    level3url: "/resursi-za-nastavu/testovi",
  };

  const { userData, isLoggedIn } = useAuth();

  const {
    testSubjects,
    error: onError,
    loading: onLoading,
    refetch: refetchOperative,
  } = useFetchTestSubjects(userData?.id);

  const [openTestModal, setOpenTestModal] = useState(false);

  const handleOpenOperativeModal = () => setOpenTestModal(true);

  const ValidationSchema = Yup.object({
    subject: Yup.string()
      .required("Naziv predmeta je obavezan")
      .min(2, "Predmet mora imati bar 2 slova"),
    grade: Yup.string().required("Razred je obavezan"),
  });

  const formikOperative = useFormik({
    initialValues: {
      subject: "",
      grade: "",
    },
    validationSchema: ValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await axios.post(`${PocketBaseCollection}/test_subjects/records`, {
          ...values,
          user: userData.id,
        });
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
          title={"Testovi"}
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
            {testSubjects && testSubjects.length > 0 && (
              <Title
                text={"Spisak predmeta"}
                level={2}
                className={styles.title}
              />
            )}
            <div className={styles.cardsWrapper}>
              {testSubjects.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  subject={subject.subject}
                  grade={subject.grade}
                  link={"/resursi-za-nastavu/testovi"}
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
            {Object.entries(testsSubjectConfig).map(([key, config]) => (
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

export default TestsSubjects;
