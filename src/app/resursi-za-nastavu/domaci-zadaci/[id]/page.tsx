"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useFormik } from "formik";
import { Pagination, TextField } from "@mui/material";
import { Button } from "@/Components/Button";
import { Footer } from "@/Components/Footer";
import { Header } from "@/Components/Header/Header";
import SearchToggleInput from "@/Components/Inputs/SearchInput/SearchInput";
import { SidebarWrapper } from "@/Components/Layout/Sidebar/SidebarWrapper";
import { Modal } from "@/Components/Modal";
import DeleteConfirmationModal from "@/Components/Modal/DeleteConfirmationModal/DeleteConfirmationModal";
import Preloader from "@/Components/Preloader/Preloader";
import RequireAuth from "@/Components/RequireAuth/RequireAuth";
import TaskList from "@/Components/TaskList/TaskList";
import TeachingUnitTitle from "@/Components/TeachingUnitTitle/TeachingUnitTitle";
import TextEditorWithLabel from "@/Components/Texts/TextEditorWithLabel/TextEditorWithLabel";
import { Title } from "@/Components/Texts/Title";
import { useFetchHomeworks } from "@/Hooks/Homework/getHomeworks";
import { useAuth } from "@/Hooks/useAuth";
import { HomeworkItemType } from "@/Interfaces/BaseType";
import { PocketBaseCollection } from "@/libs/pocketbase";
import { HomeworkValidationSchema } from "@/app/resursi-za-nastavu/domaci-zadaci/[id]/Validation";
import { homeworkConfig } from "@/app/resursi-za-nastavu/domaci-zadaci/config";
import styles from "./page.module.scss";

const taskKeys = [
  "task1",
  "task2",
  "task3",
  "task4",
  "task5",
  "task6",
  "task7",
  "task8",
  "task9",
  "task10",
] as const;

const Homework = () => {
  const searchParams = useSearchParams();
  const subject = searchParams.get("subject") || "";
  const breadCrumb = {
    level1: "Početak",
    level2: "Resursi za nastavu",
    level3: "Domaći zadaci",
    level1url: "/",
    level2url: "/resursi-za-nastavu",
    level3url: "/resursi-za-nastavu/domaci-zadaci",
  };

  const {
    homework,
    error: onError,
    loading: onLoading,
    refetch: refetch,
  } = useFetchHomeworks();

  const { userData, isLoggedIn } = useAuth();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingHomework, setEditingHomework] =
    useState<HomeworkItemType | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [expandedUnitId, setExpandedUnitId] = useState<string | null>(null);
  const [myCurrentPage, setMyCurrentPage] = useState(1);
  const [otherCurrentPage, setOtherCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMyCurrentPage(1);
    setOtherCurrentPage(1);
  }, [searchQuery]);

  const matchesSearch = (homework: HomeworkItemType, query: string) => {
    const searchString = [
      homework.teaching_unit,
      taskKeys.map((key) => homework[key]).join(" "),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchString.includes(query.toLowerCase());
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: editingHomework
      ? {
          teaching_unit: editingHomework.teaching_unit,
          tasks: taskKeys
            .map((key) => editingHomework[key] || "")
            .filter((task) => task !== ""),
          subject: editingHomework.subject,
        }
      : {
          teaching_unit: "",
          tasks: [""],
          subject: subject,
        },
    validationSchema: HomeworkValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const dataToSend: Record<string, string | undefined> = {
          teaching_unit: values.teaching_unit,
          subject: values.subject,
          user: userData?.id,
        };

        for (let i = 0; i < taskKeys.length; i++) {
          dataToSend[`task${i + 1}`] = values.tasks[i] || "";
        }

        if (editingHomework) {
          await axios.patch(
            `${PocketBaseCollection}/homework/records/${editingHomework.id}`,
            dataToSend,
          );
        } else {
          await axios.post(
            `${PocketBaseCollection}/homework/records`,
            dataToSend,
          );
        }

        resetForm();
        setModalOpen(false);
        setEditingHomework(null);
        await refetch();
      } catch (error) {
        console.error("Greška prilikom čuvanja:", error);
      }
    },
  });

  const handleEdit = (homeworkItem: HomeworkItemType) => {
    setEditingHomework(homeworkItem);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      await axios.delete(
        `${PocketBaseCollection}/homework/records/${deleteId}`,
      );
      await refetch();
    } catch (error) {
      console.error("Greška prilikom brisanja:", error);
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    }
  };

  const toggleExpandedUnit = (id: string) => {
    setExpandedUnitId((prevId) => (prevId === id ? null : id));
  };

  if (onLoading) {
    return <Preloader page />;
  }

  if (onError) return <div>Greška u učitavanju {onError}</div>;

  const myHomeworks = homework.filter(
    (t) =>
      t.subject.toLowerCase() === subject.toLowerCase() &&
      t.user === userData?.id &&
      matchesSearch(t, searchQuery),
  );

  const otherHomeworks = homework.filter(
    (t) =>
      t.subject.toLowerCase() === subject.toLowerCase() &&
      t.user !== userData?.id &&
      matchesSearch(t, searchQuery),
  );

  const paginatedMyTests = myHomeworks.slice(
    (myCurrentPage - 1) * itemsPerPage,
    myCurrentPage * itemsPerPage,
  );

  const paginatedOtherTests = otherHomeworks.slice(
    (otherCurrentPage - 1) * itemsPerPage,
    otherCurrentPage * itemsPerPage,
  );

  return (
    <div>
      <div className={!isLoggedIn ? styles.blurWrapper : ""}>
        <Header
          title={`Domaći zadaci - ${subject}`}
          imageUrl={"/forum-1.jpg"}
          breadcrumbItems={breadCrumb}
        />

        {isLoggedIn && (
          <div className={styles.addButtonWrapper}>
            <Button
              title={"Dodaj domaći zadatak"}
              themes={[
                "orange",
                "standardWide",
                "standardHeight",
                "noBorderRadius",
                "maxWidth",
              ]}
              onClick={() => {
                setEditingHomework(null);
                setModalOpen(true);
              }}
            />
            <SearchToggleInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        <section className={styles.container}>
          <div className={styles.referencesWrap}>
            <div className={styles.testsWrap}>
              {myHomeworks.length > 0 && (
                <>
                  <Title
                    level={3}
                    text={"Moji domaći zadaci"}
                    className={styles.title}
                  />
                  {paginatedMyTests.map((t) => {
                    const isExpanded = expandedUnitId === t.id;
                    return (
                      <div key={t.id} className={styles.teachingUnitWrapper}>
                        <TeachingUnitTitle
                          title={t.teaching_unit}
                          isExpanded={isExpanded}
                          onToggle={() => toggleExpandedUnit(t.id)}
                          onEdit={() => handleEdit(t)}
                          onDelete={() => handleDelete(t.id)}
                          canEdit={t.user === userData?.id}
                          plan={t}
                          type={"homework"}
                        />
                        {isExpanded && (
                          <div className={styles.taskListWrapper}>
                            <TaskList
                              plan={t}
                              expandedUnitId={expandedUnitId}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {myHomeworks.length > itemsPerPage && (
                    <div className={styles.paginationContainer}>
                      <Pagination
                        count={Math.ceil(myHomeworks.length / itemsPerPage)}
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
              {otherHomeworks.length > 0 && (
                <>
                  <Title
                    level={3}
                    text={"Domaći zadaci dodati od drugih"}
                    className={styles.title}
                  />
                  {paginatedOtherTests.map((t) => {
                    const isExpanded = expandedUnitId === t.id;
                    return (
                      <div key={t.id} className={styles.teachingUnitWrapper}>
                        <TeachingUnitTitle
                          title={t.teaching_unit}
                          isExpanded={isExpanded}
                          onToggle={() => toggleExpandedUnit(t.id)}
                          onEdit={() => handleEdit(t)}
                          onDelete={() => handleDelete(t.id)}
                          canEdit={t.user === userData?.id}
                          plan={t}
                          type={"homework"}
                        />
                        {isExpanded && (
                          <div className={styles.taskListWrapper}>
                            <TaskList
                              plan={t}
                              expandedUnitId={expandedUnitId}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {otherHomeworks.length > itemsPerPage && (
                    <div className={styles.paginationContainer}>
                      <Pagination
                        count={Math.ceil(otherHomeworks.length / itemsPerPage)}
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
          title={
            editingHomework ? "Izmeni domaći zadatak" : "Dodaj domaći zadatak"
          }
          isOpen={modalOpen}
          setIsOpen={setModalOpen}
          description={
            editingHomework
              ? "Izmenite podatke o domaćem zadatku."
              : "Dodajte jedan ili više zadataka koje učenici treba da urade."
          }
          theme="halfScreen"
        >
          <form onSubmit={formik.handleSubmit} className={styles.form}>
            <TextField
              label={homeworkConfig.teaching_unit.label}
              placeholder={homeworkConfig.teaching_unit.placeholder}
              variant="outlined"
              fullWidth
              margin="normal"
              name="teaching_unit"
              value={formik.values.teaching_unit}
              onChange={formik.handleChange}
              error={
                formik.touched.teaching_unit &&
                Boolean(formik.errors.teaching_unit)
              }
              helperText={
                formik.touched.teaching_unit && formik.errors.teaching_unit
              }
            />

            {formik.values.tasks.map((task, index) => {
              const taskError = (formik.errors.tasks as string[] | undefined)?.[
                index
              ];
              const taskTouched = (
                formik.touched.tasks as boolean[] | undefined
              )?.[index];

              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "flex-start",
                    marginBottom: "24px",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <TextEditorWithLabel
                      key={`task-${index}`}
                      task={task}
                      onChange={(val) =>
                        formik.setFieldValue(`tasks[${index}]`, val)
                      }
                      onDelete={() => {
                        const updatedTasks = [...formik.values.tasks];
                        updatedTasks.splice(index, 1);
                        formik.setFieldValue("tasks", updatedTasks);
                      }}
                      onAdd={() => {
                        formik.setFieldValue("tasks", [
                          ...formik.values.tasks,
                          "",
                        ]);
                      }}
                      canDelete={formik.values.tasks.length > 1}
                      label={`Zadatak ${index + 1}`}
                      error={taskTouched && taskError ? taskError : undefined}
                    />
                  </div>
                </div>
              );
            })}

            <div style={{ marginTop: "60px" }}>
              <Button
                title={
                  editingHomework ? "Sačuvaj izmene" : "Dodaj domaći zadatak"
                }
                themes={[
                  "blue",
                  "standardWide",
                  "standardHeight",
                  "noBorderRadius",
                  "maxWidth",
                ]}
                type="submit"
              />
            </div>
          </form>
        </Modal>

        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          setIsOpen={setIsDeleteModalOpen}
          onConfirm={confirmDelete}
          title="Potvrda brisanja domaćeg zadatka"
          description="Da li ste sigurni da želite da obrišete ovaj domaći zadatak?"
        />
      </div>
      <Footer />
      {!isLoggedIn && <RequireAuth />}
    </div>
  );
};

export default Homework;
