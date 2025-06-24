"use client";

import { Header } from "@/Components/Header/Header";

import { useAuth } from "@/Hooks/useAuth";
import React, { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { PocketBaseCollection } from "@/libs/pocketbase";
import styles from "./page.module.scss";
import { Button } from "@/Components/Button";
import { SidebarWrapper } from "@/Components/Layout/Sidebar/SidebarWrapper";
import { Modal } from "@/Components/Modal";
import { Pagination, TextField } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useFetchLessonPlan } from "@/Hooks/LessonPlan/getLessonPlan";

import RequireAuth from "@/Components/RequireAuth/RequireAuth";
import { testConfig } from "@/app/resursi-za-nastavu/testovi/config";
import { LessonConfig } from "@/app/resursi-za-nastavu/priprema-za-nastavu/config";
import TextEditorWithLabel from "@/Components/Texts/TextEditorWithLabel/TextEditorWithLabel";
import Preloader from "@/Components/Preloader/Preloader";
import { Footer } from "@/Components/Footer";
import { Title } from "@/Components/Texts/Title";
import clsx from "clsx";
import * as Yup from "yup";

const LessonPlan = () => {
  const searchParams = useSearchParams();
  const subject = searchParams.get("subject") || "";
  const breadCrumb = {
    level1: "Početak",
    level2: "Resursi za nastavu",
    level3: "Pripreme za čas",
    level1url: "/",
    level2url: "/resursi-za-nastavu",
    level3url: "/resursi-za-nastavu/priprema-za-nastavu",
  };

  const [myCurrentPage, setMyCurrentPage] = useState(1);
  const [otherCurrentPage, setOtherCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [view, setView] = useState<"form" | "upload">("form");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      formikLessonPlan.setFieldValue("file", file);
      console.log("Selected file:", file);
    }
  };

  const handleSubmitFile = async () => {
    const { file, class_number, date, teaching_topic, lesson_name } =
      formikLessonPlan.values;

    if (!file) {
      alert("Niste izabrali fajl.");
      return;
    }

    if (!class_number || !date || !teaching_topic || !lesson_name) {
      alert("Molimo popunite sve podatke o času pre slanja fajla.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("user", userData?.id || "");
    formData.append("subject", subject);

    formData.append("class_number", class_number);
    formData.append("date", date);
    formData.append("teaching_topic", teaching_topic);
    formData.append("lesson_name", lesson_name);

    try {
      await axios.post(
        `http://127.0.0.1:8090/api/collections/lesson_plan/records`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      await refetchOperative();
      handleCloseModal();
      formikLessonPlan.resetForm();
      alert("Fajl uspešno otpremljen.");
    } catch (error) {
      console.error("Greška prilikom slanja fajla:", error);
      alert("Došlo je do greške prilikom slanja fajla.");
    }
  };

  const {
    lessonPlan,
    error: onError,
    loading: onLoading,
    refetch: refetchOperative,
  } = useFetchLessonPlan();

  const { userData, isLoggedIn } = useAuth();
  const [open, setOpen] = useState(false);
  const [expandedUnitId, setExpandedUnitId] = useState<string | null>(null);

  useEffect(() => {
    if (view === "form") {
      formikLessonPlan.resetForm();
    }
  }, [view]);

  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);

  const toggleExpandedUnit = (id: string) => {
    setExpandedUnitId((prev) => (prev === id ? null : id));
  };

  const otherLessonPlan = useMemo(() => {
    if (!lessonPlan.length || !userData?.id) return [];
    return lessonPlan.filter(
      (t) =>
        t.subject.toLowerCase() === subject.toLowerCase() &&
        t.user !== userData.id,
    );
  }, [lessonPlan, subject, userData?.id]);

  const lessonPlanValidationSchema = Yup.object().shape({
    date: Yup.string().required("Datum je obavezan"),
    class_number: Yup.string().required("Broj časa je obavezan"),
    grade_and_class: Yup.string().required("Razred i odeljenje su obavezni"),
    teaching_topic: Yup.string().required("Tema časa je obavezna"),
    lesson_name: Yup.string().required("Naziv časa je obavezan"),
    previous_lesson: Yup.string().required("Prethodni čas je obavezan"),
    next_lesson: Yup.string().required("Sledeći čas je obavezan"),
    type_of_lesson: Yup.string().required("Tip časa je obavezan"),
    educational_objectives: Yup.string().required(
      "Obrazovni ciljevi su obavezni",
    ),
    social_objectives: Yup.string().required("Socijalni ciljevi su obavezni"),
    functional_objectives: Yup.string().required(
      "Funkcionalni ciljevi su obavezni",
    ),
    teaching_methods: Yup.string().required("Metode nastave su obavezne"),
    forms_of_work: Yup.string().required("Oblici rada su obavezni"),
    instructional_materials: Yup.string().required(
      "Nastavna sredstva su obavezna",
    ),
    correlation: Yup.string().required("Korelacija je obavezna"),
    literature: Yup.string().required("Literatura je obavezna"),
    introduction_small: Yup.string().required("Uvod (kratak) je obavezan"),
    main_activity_small: Yup.string().required(
      "Glavna aktivnost (kratko) je obavezna",
    ),
    conclusion_small: Yup.string().required("Zaključak (kratko) je obavezan"),
    introduction: Yup.string().required("Uvod je obavezan"),
    main: Yup.string().required("Glavni deo je obavezan"),
    conclusion: Yup.string().required("Zaključak je obavezan"),
    subject: Yup.string().required("Predmet je obavezan"),
    user: Yup.string().required("Korisnik nije validan"),
  });

  const formikLessonPlan = useFormik({
    enableReinitialize: true,
    initialValues: {
      date: "",
      class_number: "",
      grade_and_class: "",
      teaching_topic: "",
      lesson_name: "",
      previous_lesson: "",
      next_lesson: "",
      type_of_lesson: "",
      educational_objectives: "",
      social_objectives: "",
      functional_objectives: "",
      teaching_methods: "",
      forms_of_work: "",
      instructional_materials: "",
      correlation: "",
      literature: "",
      introduction_small: "",
      main_activity_small: "",
      conclusion_small: "",
      introduction: "",
      main: "",
      conclusion: "",
      subject: subject,
      user: userData?.id,
      file: null,
    },
    validationSchema: lessonPlanValidationSchema,
    onSubmit: async (values) => {
      try {
        const finalValues = {
          ...values,
          user: userData?.id,
        };

        await axios.post(
          `${PocketBaseCollection}/lesson_plan/records`,
          finalValues,
        );
        await refetchOperative();
        handleCloseModal();
        formikLessonPlan.resetForm();
      } catch (error) {
        console.error("Error submitting lesson plan", error);
      }
    },
  });

  type LessonField = keyof typeof LessonConfig;

  if (onLoading) {
    return <Preloader page />;
  }

  if (onError) return <div>Greška u učitavanju {onError}</div>;

  const myLessonPlan = lessonPlan.filter(
    (t) =>
      t.subject.toLowerCase() === subject.toLowerCase() &&
      t.user === userData?.id,
  );

  const paginatedLessonPlan = myLessonPlan.slice(
    (myCurrentPage - 1) * itemsPerPage,
    myCurrentPage * itemsPerPage,
  );

  const paginatedOtherLessonPlan = otherLessonPlan.slice(
    (otherCurrentPage - 1) * itemsPerPage,
    otherCurrentPage * itemsPerPage,
  );

  return (
    <div>
      <div className={!isLoggedIn ? styles.blurWrapper : ""}>
        <Header
          title={`Pripreme za čas - ${subject}`}
          imageUrl={"/forum-1.jpg"}
          breadcrumbItems={breadCrumb}
        />

        {isLoggedIn && (
          <div className={styles.addButtonWrapper}>
            <Button
              title={"Dodaj pripremu za čas"}
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

        <section className={styles.container}>
          <div className={styles.referencesWrap}>
            <div className={styles.testsWrap}>
              {paginatedLessonPlan && paginatedLessonPlan.length > 0 && (
                <>
                  <Title
                    level={3}
                    text={"Moje pripreme za čas"}
                    className={styles.title}
                  />

                  {paginatedLessonPlan.map((lesson, index) => {
                    const isExpanded = expandedUnitId === lesson.id;
                    const isFile =
                      lesson.file?.length && lesson.file?.length > 0;

                    return (
                      <div
                        key={lesson.id || index}
                        className={styles.lessonCard}
                      >
                        <div
                          className={clsx(
                            styles.teachingUnitTitle,
                            isExpanded && !isFile && styles.expanded,
                            isFile && styles.file,
                          )}
                          onClick={(e) => {
                            if (isFile) {
                              e.stopPropagation();
                              const fileUrl = `http://127.0.0.1:8090/api/files/lesson_plan/${lesson.id}/${lesson.file}`;
                              window.open(fileUrl, "_blank");
                            } else {
                              toggleExpandedUnit(lesson.id);
                            }
                          }}
                        >
                          {lesson.class_number} - {lesson.teaching_topic} -{" "}
                          {lesson.lesson_name} - {lesson.date}
                        </div>

                        {isExpanded && !isFile && (
                          <div className={styles.lessonDetails}>
                            {[
                              {
                                title: "Opšti podaci",
                                fields: [
                                  "date",
                                  "class_number",
                                  "grade_and_class",
                                ],
                              },
                              {
                                title: "Opšti metodički podaci",
                                fields: [
                                  "subject",
                                  "teaching_topic",
                                  "lesson_name",
                                  "previous_lesson",
                                  "next_lesson",
                                  "type_of_lesson",
                                ],
                              },
                              {
                                title: "Operativni zadaci",
                                fields: [
                                  "educational_objectives",
                                  "social_objectives",
                                  "functional_objectives",
                                  "teaching_methods",
                                  "forms_of_work",
                                  "instructional_materials",
                                  "correlation",
                                  "literature",
                                ],
                              },
                              {
                                title: "Struktura časa",
                                fields: [
                                  "introduction_small",
                                  "main_activity_small",
                                  "conclusion_small",
                                ],
                              },
                              {
                                title: "Razrada toka časa",
                                fields: ["introduction", "main", "conclusion"],
                              },
                            ].map(({ title, fields }) => (
                              <div
                                key={title}
                                className={styles.lessonPartGroup}
                              >
                                <table className={styles.lessonTable}>
                                  <thead>
                                    <tr>
                                      <th
                                        colSpan={2}
                                        className={styles.lessonTableHeading}
                                      >
                                        <h3>{title}</h3>
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {fields.map((field) => (
                                      <tr key={field}>
                                        <th>
                                          {LessonConfig[
                                            field as keyof typeof LessonConfig
                                          ]?.label || field}
                                        </th>
                                        <td>
                                          {lesson[
                                            field as keyof typeof lesson
                                          ] ? (
                                            <span
                                              dangerouslySetInnerHTML={{
                                                __html:
                                                  lesson[
                                                    field as keyof typeof lesson
                                                  ] || "",
                                              }}
                                            />
                                          ) : (
                                            "-"
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {myLessonPlan.length > itemsPerPage && (
                    <div className={styles.paginationContainer}>
                      <Pagination
                        count={Math.ceil(myLessonPlan.length / itemsPerPage)}
                        page={myCurrentPage}
                        onChange={(_, value) => setMyCurrentPage(value)}
                        color="primary"
                        shape="rounded"
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            <div className={styles.testsWrap}>
              {paginatedOtherLessonPlan &&
                paginatedOtherLessonPlan.length > 0 && (
                  <>
                    <Title
                      level={3}
                      text={"Pripreme za čas drugih autora"}
                      className={styles.title}
                    />

                    {paginatedOtherLessonPlan.map((lesson, index) => {
                      const isExpanded = expandedUnitId === lesson.id;
                      const isFile =
                        lesson.file?.length && lesson.file?.length > 0;
                      return (
                        <div
                          key={lesson.id || index}
                          className={styles.lessonCard}
                        >
                          <div
                            className={clsx(
                              styles.teachingUnitTitle,
                              isExpanded && !isFile && styles.expanded,
                              isFile && styles.file,
                            )}
                            onClick={(e) => {
                              if (isFile) {
                                e.stopPropagation();
                                const fileUrl = `http://127.0.0.1:8090/api/files/lesson_plan/${lesson.id}/${lesson.file}`;
                                window.open(fileUrl, "_blank");
                              } else {
                                toggleExpandedUnit(lesson.id);
                              }
                            }}
                          >
                            {lesson.class_number} - {lesson.teaching_topic} -{" "}
                            {lesson.lesson_name} - {lesson.date}
                          </div>

                          {isExpanded && (
                            <div className={styles.lessonDetails}>
                              {[
                                {
                                  title: "Opšti podaci",
                                  fields: [
                                    "date",
                                    "class_number",
                                    "grade_and_class",
                                  ],
                                },
                                {
                                  title: "Opšti metodički podaci",
                                  fields: [
                                    "subject",
                                    "teaching_topic",
                                    "lesson_name",
                                    "previous_lesson",
                                    "next_lesson",
                                    "type_of_lesson",
                                  ],
                                },
                                {
                                  title: "Operativni zadaci",
                                  fields: [
                                    "educational_objectives",
                                    "social_objectives",
                                    "functional_objectives",
                                    "teaching_methods",
                                    "forms_of_work",
                                    "instructional_materials",
                                    "correlation",
                                    "literature",
                                  ],
                                },
                                {
                                  title: "Struktura časa",
                                  fields: [
                                    "introduction_small",
                                    "main_activity_small",
                                    "conclusion_small",
                                  ],
                                },
                                {
                                  title: "Razrada toka časa",
                                  fields: [
                                    "introduction",
                                    "main",
                                    "conclusion",
                                  ],
                                },
                              ].map(({ title, fields }) => (
                                <div
                                  key={title}
                                  className={styles.lessonPartGroup}
                                >
                                  <table className={styles.lessonTable}>
                                    <thead>
                                      <tr>
                                        <th
                                          colSpan={2}
                                          className={styles.lessonTableHeading}
                                        >
                                          <h3>{title}</h3>
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {fields.map((field) => (
                                        <tr key={field}>
                                          <th>
                                            {LessonConfig[field as LessonField]
                                              ?.label || field}
                                          </th>
                                          <td>
                                            {lesson[field as LessonField] ? (
                                              <span
                                                dangerouslySetInnerHTML={{
                                                  __html:
                                                    lesson[
                                                      field as LessonField
                                                    ],
                                                }}
                                              />
                                            ) : (
                                              "-"
                                            )}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {otherLessonPlan.length > itemsPerPage && (
                      <div className={styles.paginationContainer}>
                        <Pagination
                          count={Math.ceil(
                            otherLessonPlan.length / itemsPerPage,
                          )}
                          page={otherCurrentPage}
                          onChange={(_, value) => setOtherCurrentPage(value)}
                          color="primary"
                          shape="rounded"
                        />
                      </div>
                    )}
                  </>
                )}
            </div>
          </div>

          <aside className={styles.sidebarWrap}>
            <SidebarWrapper />
          </aside>
        </section>

        <Modal
          title="Dodaj nastavnu jedinicu"
          isOpen={open}
          setIsOpen={setOpen}
          description="Unesite naziv i detalje nastavne jedinice koju želite da dodate."
          theme={"halfScreen"}
        >
          <div className={styles.modalButtonWrapper}>
            <Button
              title="Unesi ručno"
              themes={[
                "blue",
                "standardWide",
                "standardHeight",
                "noBorderRadius",
                "maxWidth",
              ]}
              type="button"
              onClick={() => setView("form")}
            />
            <Button
              title="Dodaj fajl"
              themes={[
                "blue",
                "standardWide",
                "standardHeight",
                "noBorderRadius",
                "maxWidth",
              ]}
              type="button"
              onClick={() => setView("upload")}
            />
          </div>

          {view === "form" && (
            <form
              onSubmit={formikLessonPlan.handleSubmit}
              className={styles.form}
            >
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "20px",
                  marginTop: "20px",
                }}
              >
                Opšti podaci
              </span>
              <TextField
                label={LessonConfig.date.label}
                placeholder={testConfig.date.placeholder}
                variant="outlined"
                fullWidth
                margin="normal"
                name="date"
                value={formikLessonPlan.values.date}
                onChange={formikLessonPlan.handleChange}
                error={
                  formikLessonPlan.touched.date &&
                  Boolean(formikLessonPlan.errors.date)
                }
                helperText={
                  formikLessonPlan.touched.date && formikLessonPlan.errors.date
                }
              />

              <TextField
                label={LessonConfig.class_number.label}
                placeholder={LessonConfig.class_number.placeholder}
                variant="outlined"
                fullWidth
                margin="normal"
                name="class_number"
                value={formikLessonPlan.values.class_number}
                onChange={formikLessonPlan.handleChange}
                error={
                  formikLessonPlan.touched.class_number &&
                  Boolean(formikLessonPlan.errors.class_number)
                }
                helperText={
                  formikLessonPlan.touched.class_number &&
                  formikLessonPlan.errors.class_number
                }
              />
              <TextField
                label={LessonConfig.grade_and_class.label}
                placeholder={LessonConfig.grade_and_class.placeholder}
                variant="outlined"
                fullWidth
                margin="normal"
                name="grade_and_class"
                value={formikLessonPlan.values.grade_and_class}
                onChange={formikLessonPlan.handleChange}
                error={
                  formikLessonPlan.touched.grade_and_class &&
                  Boolean(formikLessonPlan.errors.grade_and_class)
                }
                helperText={
                  formikLessonPlan.touched.grade_and_class &&
                  formikLessonPlan.errors.grade_and_class
                }
              />
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "20px",
                  marginTop: "20px",
                }}
              >
                Opšti metodički podaci
              </span>
              <TextField
                label={LessonConfig.subject.label}
                placeholder={LessonConfig.subject.placeholder}
                variant="outlined"
                fullWidth
                margin="normal"
                name="subject"
                value={formikLessonPlan.values.subject}
                onChange={formikLessonPlan.handleChange}
                error={
                  formikLessonPlan.touched.subject &&
                  Boolean(formikLessonPlan.errors.subject)
                }
                helperText={
                  formikLessonPlan.touched.subject &&
                  formikLessonPlan.errors.subject
                }
              />
              <TextField
                label={LessonConfig.teaching_topic.label}
                placeholder={LessonConfig.teaching_topic.placeholder}
                variant="outlined"
                fullWidth
                margin="normal"
                name="teaching_topic"
                value={formikLessonPlan.values.teaching_topic}
                onChange={formikLessonPlan.handleChange}
                error={
                  formikLessonPlan.touched.teaching_topic &&
                  Boolean(formikLessonPlan.errors.teaching_topic)
                }
                helperText={
                  formikLessonPlan.touched.teaching_topic &&
                  formikLessonPlan.errors.teaching_topic
                }
              />
              <TextField
                label={LessonConfig.lesson_name.label}
                placeholder={LessonConfig.lesson_name.placeholder}
                variant="outlined"
                fullWidth
                margin="normal"
                name="lesson_name"
                value={formikLessonPlan.values.lesson_name}
                onChange={formikLessonPlan.handleChange}
                error={
                  formikLessonPlan.touched.lesson_name &&
                  Boolean(formikLessonPlan.errors.lesson_name)
                }
                helperText={
                  formikLessonPlan.touched.lesson_name &&
                  formikLessonPlan.errors.lesson_name
                }
              />
              <TextField
                label={LessonConfig.previous_lesson.label}
                placeholder={LessonConfig.previous_lesson.placeholder}
                variant="outlined"
                fullWidth
                margin="normal"
                name="previous_lesson"
                value={formikLessonPlan.values.previous_lesson}
                onChange={formikLessonPlan.handleChange}
                error={
                  formikLessonPlan.touched.previous_lesson &&
                  Boolean(formikLessonPlan.errors.previous_lesson)
                }
                helperText={
                  formikLessonPlan.touched.previous_lesson &&
                  formikLessonPlan.errors.previous_lesson
                }
              />

              <TextField
                label={LessonConfig.next_lesson.label}
                placeholder={LessonConfig.next_lesson.placeholder}
                variant="outlined"
                fullWidth
                margin="normal"
                name="next_lesson"
                value={formikLessonPlan.values.next_lesson}
                onChange={formikLessonPlan.handleChange}
                error={
                  formikLessonPlan.touched.next_lesson &&
                  Boolean(formikLessonPlan.errors.next_lesson)
                }
                helperText={
                  formikLessonPlan.touched.next_lesson &&
                  formikLessonPlan.errors.next_lesson
                }
              />
              <TextField
                label={LessonConfig.type_of_lesson.label}
                placeholder={LessonConfig.type_of_lesson.placeholder}
                variant="outlined"
                fullWidth
                margin="normal"
                name="type_of_lesson"
                value={formikLessonPlan.values.type_of_lesson}
                onChange={formikLessonPlan.handleChange}
                error={
                  formikLessonPlan.touched.type_of_lesson &&
                  Boolean(formikLessonPlan.errors.type_of_lesson)
                }
                helperText={
                  formikLessonPlan.touched.type_of_lesson &&
                  formikLessonPlan.errors.type_of_lesson
                }
              />
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "20px",
                  marginTop: "20px",
                }}
              >
                Operativni zadaci
              </span>
              <TextField
                label={LessonConfig.educational_objectives.label}
                placeholder={LessonConfig.educational_objectives.placeholder}
                variant="outlined"
                fullWidth
                margin="normal"
                name="educational_objectives"
                value={formikLessonPlan.values.educational_objectives}
                onChange={formikLessonPlan.handleChange}
                error={
                  formikLessonPlan.touched.educational_objectives &&
                  Boolean(formikLessonPlan.errors.educational_objectives)
                }
                helperText={
                  formikLessonPlan.touched.educational_objectives &&
                  formikLessonPlan.errors.educational_objectives
                }
              />
              <TextField
                label={LessonConfig.social_objectives.label}
                placeholder={LessonConfig.social_objectives.placeholder}
                variant="outlined"
                fullWidth
                margin="normal"
                name="social_objectives"
                value={formikLessonPlan.values.social_objectives}
                onChange={formikLessonPlan.handleChange}
                error={
                  formikLessonPlan.touched.social_objectives &&
                  Boolean(formikLessonPlan.errors.social_objectives)
                }
                helperText={
                  formikLessonPlan.touched.social_objectives &&
                  formikLessonPlan.errors.social_objectives
                }
              />
              <TextField
                label={LessonConfig.functional_objectives.label}
                placeholder={LessonConfig.functional_objectives.placeholder}
                variant="outlined"
                fullWidth
                margin="normal"
                name="functional_objectives"
                value={formikLessonPlan.values.functional_objectives}
                onChange={formikLessonPlan.handleChange}
                error={
                  formikLessonPlan.touched.functional_objectives &&
                  Boolean(formikLessonPlan.errors.functional_objectives)
                }
                helperText={
                  formikLessonPlan.touched.functional_objectives &&
                  formikLessonPlan.errors.functional_objectives
                }
              />
              <TextField
                label={LessonConfig.teaching_methods.label}
                placeholder={LessonConfig.teaching_methods.placeholder}
                variant="outlined"
                fullWidth
                margin="normal"
                name="teaching_methods"
                value={formikLessonPlan.values.teaching_methods}
                onChange={formikLessonPlan.handleChange}
                error={
                  formikLessonPlan.touched.teaching_methods &&
                  Boolean(formikLessonPlan.errors.teaching_methods)
                }
                helperText={
                  formikLessonPlan.touched.teaching_methods &&
                  formikLessonPlan.errors.teaching_methods
                }
              />
              <TextField
                label={LessonConfig.forms_of_work.label}
                placeholder={LessonConfig.forms_of_work.placeholder}
                variant="outlined"
                fullWidth
                margin="normal"
                name="forms_of_work"
                value={formikLessonPlan.values.forms_of_work}
                onChange={formikLessonPlan.handleChange}
                error={
                  formikLessonPlan.touched.forms_of_work &&
                  Boolean(formikLessonPlan.errors.forms_of_work)
                }
                helperText={
                  formikLessonPlan.touched.forms_of_work &&
                  formikLessonPlan.errors.forms_of_work
                }
              />
              <TextField
                label={LessonConfig.instructional_materials.label}
                placeholder={LessonConfig.instructional_materials.placeholder}
                variant="outlined"
                fullWidth
                margin="normal"
                name="instructional_materials"
                value={formikLessonPlan.values.instructional_materials}
                onChange={formikLessonPlan.handleChange}
                error={
                  formikLessonPlan.touched.instructional_materials &&
                  Boolean(formikLessonPlan.errors.instructional_materials)
                }
                helperText={
                  formikLessonPlan.touched.instructional_materials &&
                  formikLessonPlan.errors.instructional_materials
                }
              />
              <TextField
                label={LessonConfig.correlation.label}
                placeholder={LessonConfig.correlation.placeholder}
                variant="outlined"
                fullWidth
                margin="normal"
                name="correlation"
                value={formikLessonPlan.values.correlation}
                onChange={formikLessonPlan.handleChange}
                error={
                  formikLessonPlan.touched.correlation &&
                  Boolean(formikLessonPlan.errors.correlation)
                }
                helperText={
                  formikLessonPlan.touched.correlation &&
                  formikLessonPlan.errors.correlation
                }
              />
              <TextField
                label={LessonConfig.literature.label}
                placeholder={LessonConfig.literature.placeholder}
                variant="outlined"
                fullWidth
                margin="normal"
                name="literature"
                value={formikLessonPlan.values.literature}
                onChange={formikLessonPlan.handleChange}
                error={
                  formikLessonPlan.touched.literature &&
                  Boolean(formikLessonPlan.errors.literature)
                }
                helperText={
                  formikLessonPlan.touched.literature &&
                  formikLessonPlan.errors.literature
                }
              />
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "20px",
                  marginTop: "20px",
                }}
              >
                Struktura časa
              </span>
              <TextField
                label={LessonConfig.introduction_small.label}
                placeholder={LessonConfig.introduction_small.placeholder}
                variant="outlined"
                fullWidth
                margin="normal"
                name="introduction_small"
                value={formikLessonPlan.values.introduction_small}
                onChange={formikLessonPlan.handleChange}
                error={
                  formikLessonPlan.touched.introduction_small &&
                  Boolean(formikLessonPlan.errors.introduction_small)
                }
                helperText={
                  formikLessonPlan.touched.introduction_small &&
                  formikLessonPlan.errors.introduction_small
                }
              />
              <TextField
                label={LessonConfig.main_activity_small.label}
                placeholder={LessonConfig.main_activity_small.placeholder}
                variant="outlined"
                fullWidth
                margin="normal"
                name="main_activity_small"
                value={formikLessonPlan.values.main_activity_small}
                onChange={formikLessonPlan.handleChange}
                error={
                  formikLessonPlan.touched.main_activity_small &&
                  Boolean(formikLessonPlan.errors.main_activity_small)
                }
                helperText={
                  formikLessonPlan.touched.main_activity_small &&
                  formikLessonPlan.errors.main_activity_small
                }
              />
              <TextField
                label={LessonConfig.conclusion_small.label}
                placeholder={LessonConfig.conclusion_small.placeholder}
                variant="outlined"
                fullWidth
                margin="normal"
                name="conclusion_small"
                value={formikLessonPlan.values.conclusion_small}
                onChange={formikLessonPlan.handleChange}
                error={
                  formikLessonPlan.touched.conclusion_small &&
                  Boolean(formikLessonPlan.errors.conclusion_small)
                }
                helperText={
                  formikLessonPlan.touched.conclusion_small &&
                  formikLessonPlan.errors.conclusion_small
                }
              />
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "20px",
                  margin: "20px 0",
                }}
              >
                Razrada toka časa
              </span>
              <TextEditorWithLabel
                index={0}
                task={formikLessonPlan.values.introduction}
                onChange={(value) =>
                  formikLessonPlan.setFieldValue("introduction", value)
                }
                label={LessonConfig.introduction.label}
                error={
                  formikLessonPlan.touched.introduction &&
                  formikLessonPlan.errors.introduction
                    ? formikLessonPlan.errors.introduction
                    : undefined
                }
              />

              <TextEditorWithLabel
                index={1}
                task={formikLessonPlan.values.main}
                onChange={(value) =>
                  formikLessonPlan.setFieldValue("main", value)
                }
                label={LessonConfig.main.label}
                error={
                  formikLessonPlan.touched.main && formikLessonPlan.errors.main
                    ? formikLessonPlan.errors.main
                    : undefined
                }
              />

              <TextEditorWithLabel
                index={2}
                task={formikLessonPlan.values.conclusion}
                onChange={(value) =>
                  formikLessonPlan.setFieldValue("conclusion", value)
                }
                label={LessonConfig.conclusion.label}
                error={
                  formikLessonPlan.touched.conclusion &&
                  formikLessonPlan.errors.conclusion
                    ? formikLessonPlan.errors.conclusion
                    : undefined
                }
              />

              <div style={{ marginTop: "60px" }}>
                <Button
                  title="Dodaj pripremu za čas"
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
          )}

          {view === "upload" && (
            <form>
              <label
                htmlFor="lessonFile"
                style={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: "10px",
                }}
              >
                Dodajte fajl (.pdf, .docx, .txt)
              </label>
              <input
                type="file"
                id="lessonFile"
                name="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
              />
              <TextField
                label={LessonConfig.class_number.label}
                placeholder={LessonConfig.class_number.placeholder}
                variant="outlined"
                fullWidth
                margin="normal"
                name="class_number"
                value={formikLessonPlan.values.class_number}
                onChange={formikLessonPlan.handleChange}
                error={
                  formikLessonPlan.touched.class_number &&
                  Boolean(formikLessonPlan.errors.class_number)
                }
                helperText={
                  formikLessonPlan.touched.class_number &&
                  formikLessonPlan.errors.class_number
                }
              />
              <TextField
                label={LessonConfig.date.label}
                placeholder={testConfig.date.placeholder}
                variant="outlined"
                fullWidth
                margin="normal"
                name="date"
                value={formikLessonPlan.values.date}
                onChange={formikLessonPlan.handleChange}
                error={
                  formikLessonPlan.touched.date &&
                  Boolean(formikLessonPlan.errors.date)
                }
                helperText={
                  formikLessonPlan.touched.date && formikLessonPlan.errors.date
                }
              />
              <TextField
                label={LessonConfig.teaching_topic.label}
                placeholder={LessonConfig.teaching_topic.placeholder}
                variant="outlined"
                fullWidth
                margin="normal"
                name="teaching_topic"
                value={formikLessonPlan.values.teaching_topic}
                onChange={formikLessonPlan.handleChange}
                error={
                  formikLessonPlan.touched.teaching_topic &&
                  Boolean(formikLessonPlan.errors.teaching_topic)
                }
                helperText={
                  formikLessonPlan.touched.teaching_topic &&
                  formikLessonPlan.errors.teaching_topic
                }
              />
              <TextField
                label={LessonConfig.lesson_name.label}
                placeholder={LessonConfig.lesson_name.placeholder}
                variant="outlined"
                fullWidth
                margin="normal"
                name="lesson_name"
                value={formikLessonPlan.values.lesson_name}
                onChange={formikLessonPlan.handleChange}
                error={
                  formikLessonPlan.touched.lesson_name &&
                  Boolean(formikLessonPlan.errors.lesson_name)
                }
                helperText={
                  formikLessonPlan.touched.lesson_name &&
                  formikLessonPlan.errors.lesson_name
                }
              />

              <div style={{ marginTop: "60px" }}>
                <Button
                  title="Dodaj pripremu za čas"
                  themes={[
                    "blue",
                    "standardWide",
                    "standardHeight",
                    "noBorderRadius",
                    "maxWidth",
                  ]}
                  type="button"
                  onClick={handleSubmitFile}
                />
              </div>
            </form>
          )}
        </Modal>
      </div>
      <Footer />

      {!isLoggedIn && <RequireAuth />}
    </div>
  );
};

export default LessonPlan;
