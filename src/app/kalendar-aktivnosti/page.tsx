"use client";

import React, { useState } from "react";
import axios from "axios";
import { FieldArray, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import { TextField } from "@mui/material";
import { Button } from "@/Components/Button";
import { ActivityCard } from "@/Components/Card/ActivityCard/ActivityCard";
import { ClassScheduleTable } from "@/Components/ClassSchedule/ClassSchedule";
import { Header } from "@/Components/Header/Header";
import SearchToggleInput from "@/Components/Inputs/SearchInput/SearchInput";
import { SidebarWrapper } from "@/Components/Layout/Sidebar/SidebarWrapper";
import { Modal } from "@/Components/Modal";
import DeleteConfirmationModal from "@/Components/Modal/DeleteConfirmationModal/DeleteConfirmationModal";
import Preloader from "@/Components/Preloader/Preloader";
import RequireAuth from "@/Components/RequireAuth/RequireAuth";
import TextEditorWithLabel from "@/Components/Texts/TextEditorWithLabel/TextEditorWithLabel";
import { Title } from "@/Components/Texts/Title";
import { useFetchActivity } from "@/Hooks/Activity/getActivity";
import { useFetchClassSchedule } from "@/Hooks/Activity/getClassSchedule";
import { useDownloadClassScheduleCsv } from "@/Hooks/Download/useDownloadClassScheduleCsv";
import { useAuth } from "@/Hooks/useAuth";
import { ClassScheduleType } from "@/Interfaces/BaseType";
import { PocketBaseCollection } from "@/libs/pocketbase";
import {
  activityValidationSchema,
  classScheduleValidationSchema,
} from "@/app/kalendar-aktivnosti/Validation";
import { ActivityConfig } from "@/app/kalendar-aktivnosti/config";
import styles from "./page.module.scss";

const MAX_SUBJECTS = 7;

const Calendar = () => {
  const breadCrumb = {
    level1: "Početak",
    level2: "Kalendar aktivnosti",
    level1url: "/",
    level2url: "/kalendar-aktivnosti",
  };

  const { userData, isLoggedIn } = useAuth();

  const [isClassScheduleModalOpen, setIsClassScheduleModalOpen] =
    useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isChangeable, setIsChangeable] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editClassData, setEditClassData] = useState<ClassScheduleType | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");

  const handleChangeable = () => {
    setIsChangeable(!isChangeable);
  };

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

  const { downloadCsv } = useDownloadClassScheduleCsv(classSchedule || []);

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      await axios.delete(
        `${PocketBaseCollection}/class_schedule/records/${deleteId}`,
      );
      await refetchClassSchedule();
    } catch (error) {
      console.error("Greška prilikom brisanja:", error);
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    }
  };

  const handleEditSchedule = (id: string) => {
    const scheduleToEdit = classSchedule?.find((item) => item.id === id);
    if (scheduleToEdit) {
      setEditClassData(scheduleToEdit);
      classScheduleFormik.setValues({
        dayName: scheduleToEdit.dayName,
        subject:
          typeof scheduleToEdit.subject === "string"
            ? scheduleToEdit.subject.split(",").map((s) => s.trim())
            : scheduleToEdit.subject,
      });
      setIsClassScheduleModalOpen(true);
    }
  };

  const classScheduleFormik = useFormik({
    initialValues: {
      dayName: "",
      subject: [""],
    },
    validationSchema: classScheduleValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const payload = {
          ...values,
          user: userData.id,
          subject: values.subject.join(", "),
        };

        if (editClassData) {
          await axios.patch(
            `${PocketBaseCollection}/class_schedule/records/${editClassData.id}`,
            payload,
          );
        } else {
          await axios.post(
            `${PocketBaseCollection}/class_schedule/records`,
            payload,
          );
        }

        resetForm();
        setEditClassData(null);
        setIsClassScheduleModalOpen(false);
        await refetchClassSchedule();
      } catch (error) {
        console.error("Error submitting class schedule:", error);
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
    validationSchema: activityValidationSchema,
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

  if (isLoggedIn && classScheduleLoading) {
    return <Preloader page />;
  }

  if (isLoggedIn && onError) return <div>Greška u učitavanju {onError}</div>;

  if (isLoggedIn && classScheduleError)
    return <div>Greška u učitavanju {onError}</div>;

  return (
    <div>
      <div className={!isLoggedIn ? styles.blurWrapper : ""}>
        <Header
          title="Kalendar aktivnosti"
          imageUrl="/cal1.jpg"
          breadcrumbItems={breadCrumb}
        />

        {isLoggedIn && (
          <div className={styles.addButtonWrapper}>
            <Button
              title="Dodaj raspored časova"
              themes={[
                "orange",
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
                "orange",
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
                <div className={styles.titleWithButton}>
                  <Title
                    text="Raspored časova"
                    level={2}
                    className={styles.title}
                  />
                  <div className={styles.iconsWrapper}>
                    <DownloadIcon
                      onClick={downloadCsv}
                      className={styles.icon}
                    />
                    <EditIcon
                      className={styles.icon}
                      onClick={handleChangeable}
                    />
                  </div>
                </div>
                <ClassScheduleTable
                  classSchedule={classSchedule}
                  onEdit={handleEditSchedule}
                  onDelete={handleDelete}
                  changable={isChangeable}
                />
              </>
            )}

            {activity && activity.length > 0 && (
              <>
                <div className={styles.titleWithSearch}>
                  <Title text="Aktivnosti" level={2} className={styles.title} />
                  <SearchToggleInput
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className={styles.activityWrapper}>
                  {activity
                    .filter((a) => {
                      const target =
                        `${a.title} ${a.type_of_activity} ${a.date}`.toLowerCase();
                      return target.includes(searchQuery.toLowerCase());
                    })
                    .map(({ id, type_of_activity, title, date }) => (
                      <ActivityCard
                        key={id}
                        href={{
                          pathname: `/kalendar-aktivnosti/${id}`,
                          query: { id, title },
                        }}
                        type_of_activity={type_of_activity}
                        title={title}
                        date={date}
                      />
                    ))}
                </div>
              </>
            )}
          </div>

          <aside className={styles.sidebarWrap}>
            <SidebarWrapper />
          </aside>
        </section>

        <Modal
          title={editClassData ? "Izmeni raspored dana" : "Dodaj radni dan"}
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
                    {classScheduleFormik.values.subject.map((_, index) => {
                      const touchedSubjects = classScheduleFormik.touched
                        .subject as string[] | undefined;
                      const errorSubjects = classScheduleFormik.errors
                        .subject as string[] | undefined;

                      return (
                        <TextField
                          key={index}
                          fullWidth
                          variant="outlined"
                          label={`Čas ${index + 1}`}
                          name={`subject.${index}`}
                          value={classScheduleFormik.values.subject[index]}
                          onChange={classScheduleFormik.handleChange}
                          onBlur={classScheduleFormik.handleBlur}
                          error={
                            !!(
                              touchedSubjects?.[index] && errorSubjects?.[index]
                            )
                          }
                          helperText={
                            touchedSubjects?.[index] && errorSubjects?.[index]
                          }
                          margin="normal"
                        />
                      );
                    })}

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
                  onBlur={activityFormik.handleBlur}
                  error={
                    activityFormik.touched[
                      key as keyof typeof activityFormik.touched
                    ] &&
                    Boolean(
                      activityFormik.errors[
                        key as keyof typeof activityFormik.errors
                      ],
                    )
                  }
                  helperText={
                    activityFormik.touched[
                      key as keyof typeof activityFormik.touched
                    ] &&
                    activityFormik.errors[
                      key as keyof typeof activityFormik.errors
                    ]
                  }
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

        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          setIsOpen={setIsDeleteModalOpen}
          onConfirm={confirmDelete}
          title="Brisanje dana iz rasporeda časova"
          description="Da li ste sigurni da želite da obrišete ovaj dan iz rasporeda?"
        />
      </div>
      {!isLoggedIn && <RequireAuth />}
    </div>
  );
};

export default Calendar;
