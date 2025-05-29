"use client";

import React, { useState } from "react";
import axios from "axios";
import { useFormik, FieldArray, FormikProvider } from "formik";
import { TextField } from "@mui/material";
import Link from "next/link";

import { Header } from "@/Components/Header/Header";
import { SidebarWrapper } from "@/Components/Layout/Sidebar/SidebarWrapper";
import { Button } from "@/Components/Button";
import { Modal } from "@/Components/Modal";
import { Title } from "@/Components/Texts/Title";

import { useAuth } from "@/Hooks/useAuth";
import { useFetchActivity } from "@/Hooks/Activity/getActivity";
import { useFetchClassSchedule } from "@/Hooks/Activity/getClassSchedule";

import { PocketBaseCollection } from "@/libs/pocketbase";
import { ActivityConfig } from "@/app/kalendar-aktivnosti/config";

import styles from "./page.module.scss";
import { ClassScheduleTable } from "@/Components/ClassSchedule/ClassSchedule";
import RequireAuth from "@/Components/RequireAuth/RequireAuth";
import TextEditorWithLabel from "@/Components/Texts/TextEditorWithLabel/TextEditorWithLabel";
import Preloader from "@/Components/Preloader/Preloader";

const MAX_SUBJECTS = 7;

const Calendar = () => {
  const { userData, isLoggedIn } = useAuth();

  const [isClassScheduleModalOpen, setIsClassScheduleModalOpen] =
    useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  const {
    activity,
    error: onError,
    loading: onLoading,
    refetch: refetchActivity,
  } = useFetchActivity(userData?.id);

  const {
    classSchedule,
    error: classScheduleError,
    loading: classScheduleLoading,
    refetch: refetchClassSchedule,
  } = useFetchClassSchedule(userData?.id);

  const breadCrumb = {
    level1: "Početak",
    level2: "Kalendar aktivnosti",
    level1url: "/",
    level2url: "/kalendar-aktivnosti",
  };

  const classScheduleFormik = useFormik({
    initialValues: {
      dayName: "",
      subject: [""],
    },
    validate: (values) => {
      const errors: { dayName?: string } = {};
      if (!values.dayName.trim()) {
        errors.dayName = "Naziv dana je obavezno polje";
      }
      return errors;
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        await axios.post(`${PocketBaseCollection}/class_schedule/records`, {
          ...values,
          user: userData.id,
          subject: values.subject.join(", "),
        });
        resetForm();
        setIsClassScheduleModalOpen(false);
        await refetchClassSchedule();
      } catch (error) {
        console.error("Error submitting activity:", error);
      }
    },
  });

  const activityFormik = useFormik({
    initialValues: {
      type_of_activity: "",
      title: "",
      description: "",
      date: "",
      place: "",
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        await axios.post(`${PocketBaseCollection}/activity/records`, {
          ...values,
          user: userData.id,
        });
        resetForm();
        setIsActivityModalOpen(false);
        await refetchActivity();
      } catch (error) {
        console.error("Error submitting activity:", error);
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
          title="Kalendar aktivnosti"
          imageUrl="/forum-1.jpg"
          breadcrumbItems={breadCrumb}
        />

        {isLoggedIn && (
          <div className={styles.addButtonWrapper}>
            <Button
              title="Dodaj raspored časova"
              themes={[
                "blue",
                "standardWide",
                "standardHeight",
                "noBorderRadius",
                "maxWidth",
              ]}
              onClick={() => setIsClassScheduleModalOpen(true)}
            />
            <Button
              title="Dodaj novu aktivnost"
              themes={[
                "blue",
                "standardWide",
                "standardHeight",
                "noBorderRadius",
                "maxWidth",
              ]}
              onClick={() => setIsActivityModalOpen(true)}
            />
          </div>
        )}

        <section className={styles.container}>
          <div className={styles.referencesWrap}>
            {classSchedule && classSchedule.length > 0 && (
              <>
                <Title
                  text="Raspored časova"
                  level={2}
                  className={styles.title}
                />
                <ClassScheduleTable classSchedule={classSchedule} />
              </>
            )}

            {activity && activity.length > 0 && (
              <>
                <Title text="Aktivnosti" level={2} className={styles.title} />
                <div className={styles.activityWrapper}>
                  {activity.map(
                    ({ id, type_of_activity, title, date, description }) => (
                      <Link
                        key={id}
                        href={{
                          pathname: `/kalendar-aktivnosti/${id}`,
                          query: { id, title },
                        }}
                        className={styles.link}
                      >
                        <strong>{type_of_activity}</strong> - {title} - {date}
                      </Link>
                    ),
                  )}
                </div>
              </>
            )}
          </div>

          <aside className={styles.sidebarWrap}>
            <SidebarWrapper />
          </aside>
        </section>

        <Modal
          title="Dodaj radni dan"
          isOpen={isClassScheduleModalOpen}
          setIsOpen={setIsClassScheduleModalOpen}
          description="Kreirajte raspored tako što ćete dodati radni dan i dodeliti mu predmete. Svakom danu možete pojedinačno dodavati predmete prema rasporedu."
          theme="halfScreen"
        >
          <FormikProvider value={classScheduleFormik}>
            <form
              onSubmit={classScheduleFormik.handleSubmit}
              className={styles.form}
            >
              <TextField
                fullWidth
                variant="outlined"
                label="Naziv dana"
                name="dayName"
                value={classScheduleFormik.values.dayName}
                onChange={classScheduleFormik.handleChange}
                onBlur={classScheduleFormik.handleBlur}
                error={
                  classScheduleFormik.touched.dayName &&
                  Boolean(classScheduleFormik.errors.dayName)
                }
                helperText={
                  classScheduleFormik.touched.dayName &&
                  classScheduleFormik.errors.dayName
                }
                margin="normal"
              />

              <FieldArray
                name="subject"
                render={(arrayHelpers) => (
                  <div style={{ marginBottom: "32px" }}>
                    {classScheduleFormik.values.subject.map((_, index) => (
                      <TextField
                        key={index}
                        fullWidth
                        variant="outlined"
                        label={`Čas ${index + 1}`}
                        name={`subject.${index}`}
                        value={classScheduleFormik.values.subject[index]}
                        onChange={classScheduleFormik.handleChange}
                        onBlur={classScheduleFormik.handleBlur}
                        margin="normal"
                      />
                    ))}

                    <Button
                      title="Dodaj čas"
                      themes={["standardWide", "blue", "noBorderRadius"]}
                      type="button"
                      onClick={() => {
                        if (
                          classScheduleFormik.values.subject.length <
                          MAX_SUBJECTS
                        ) {
                          arrayHelpers.push("");
                        }
                      }}
                    />

                    {classScheduleFormik.values.subject.length >=
                      MAX_SUBJECTS && (
                      <p style={{ color: "red", marginTop: "8px" }}>
                        Maksimalno {MAX_SUBJECTS} predmeta po danu.
                      </p>
                    )}
                  </div>
                )}
              />

              <Button
                title="Sačuvaj radni dan"
                themes={[
                  "blue",
                  "standardWide",
                  "standardHeight",
                  "noBorderRadius",
                  "maxWidth",
                ]}
                type="submit"
              />
            </form>
          </FormikProvider>
        </Modal>

        <Modal
          title="Dodaj novu aktivnost"
          isOpen={isActivityModalOpen}
          setIsOpen={setIsActivityModalOpen}
          description="Popunite polja i dodajte novu aktivnost svom rasporedu!"
          theme="halfScreen"
        >
          <form onSubmit={activityFormik.handleSubmit} className={styles.form}>
            {Object.entries(ActivityConfig).map(([key, config]) => {
              if (key === "description") {
                return (
                  <TextEditorWithLabel
                    key={key}
                    index={0}
                    task={activityFormik.values.description}
                    label={config.label}
                    onChange={(value) =>
                      activityFormik.setFieldValue("description", value)
                    }
                  />
                );
              }

              return (
                <TextField
                  key={key}
                  label={config.label}
                  placeholder={config.placeholder}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name={key}
                  value={
                    activityFormik.values[
                      key as keyof typeof activityFormik.values
                    ]
                  }
                  onChange={activityFormik.handleChange}
                />
              );
            })}

            <Button
              title="Dodaj aktivnost"
              themes={[
                "blue",
                "standardWide",
                "standardHeight",
                "noBorderRadius",
                "maxWidth",
              ]}
              type="submit"
            />
          </form>
        </Modal>
      </div>
      {!isLoggedIn && <RequireAuth />}
    </div>
  );
};

export default Calendar;
