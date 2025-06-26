"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Pagination, TextField } from "@mui/material";
import { Button } from "@/Components/Button";
import { Footer } from "@/Components/Footer";
import { Header } from "@/Components/Header/Header";
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
import { homeworkConfig } from "@/app/resursi-za-nastavu/domaci-zadaci/config";
import styles from "./page.module.scss";

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

  const [myCurrentPage, setMyCurrentPage] = useState(1);
  const [otherCurrentPage, setOtherCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingHomework, setEditingHomework] =
    useState<HomeworkItemType | null>(null);

  const handleEdit = (homeworkItem: HomeworkItemType) => {
    setEditingHomework(homeworkItem);
    setOpenEditModal(true);
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

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
      await refetchOperative();
    } catch (error) {
      console.error("Greška prilikom brisanja:", error);
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    }
  };

  const {
    homework,
    error: onError,
    loading: onLoading,
    refetch: refetchOperative,
  } = useFetchHomeworks();

  const { userData, isLoggedIn } = useAuth();
  const [open, setOpen] = useState(false);
  const handleOpenModal = () => setOpen(true);

  const HomeworkValidationSchema = Yup.object().shape({
    teaching_unit: Yup.string().required("Naziv nastavne jedinice je obavezan"),
    tasks: Yup.array()
      .of(Yup.string().required("Zadatak ne sme biti prazan"))
      .min(1, "Potrebno je uneti bar jedan zadatak"),
  });

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

  const formikEdit = useFormik({
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
    onSubmit: async (values) => {
      try {
        const dataToSend = {
          teaching_unit: values.teaching_unit,
          subject: values.subject,
          ...values.tasks.reduce(
            (acc, task, i) => {
              acc[`task${i + 1}`] = task;
              return acc;
            },
            {} as Record<string, string>,
          ),
        };
        if (editingHomework) {
          await axios.patch(
            `${PocketBaseCollection}/homework/records/${editingHomework.id}`,
            dataToSend,
          );
          setOpenEditModal(false);
          await refetchOperative();
        }
      } catch (error) {
        console.error("Greška prilikom izmene:", error);
      }
    },
  });

  const formikHomework = useFormik({
    initialValues: {
      tasks: [""],
      subject: subject,
      teaching_unit: "",
    },
    validationSchema: HomeworkValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      const dataToSend = {
        ...values,
        ...values.tasks.reduce(
          (acc, task, i) => {
            acc[`task${i + 1}`] = task;
            return acc;
          },
          {} as Record<string, string>,
        ),
        user: userData?.id,
      };

      try {
        await axios.post(
          `${PocketBaseCollection}/homework/records`,
          dataToSend,
        );
        resetForm();
        setOpen(false);
        await refetchOperative();
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
  });

  const [expandedUnitId, setExpandedUnitId] = useState<string | null>(null);

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
      t.user === userData?.id,
  );

  const otherHomeworks = homework.filter(
    (t) =>
      t.subject.toLowerCase() === subject.toLowerCase() &&
      t.user !== userData?.id,
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
              onClick={handleOpenModal}
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
          title="Izmeni domaći zadatak"
          isOpen={openEditModal}
          setIsOpen={setOpenEditModal}
          description="Izmenite podatke o domaćem zadatku."
          theme="halfScreen"
        >
          <form onSubmit={formikEdit.handleSubmit} className={styles.form}>
            <TextField
              label={homeworkConfig.teaching_unit.label}
              placeholder={homeworkConfig.teaching_unit.placeholder}
              variant="outlined"
              fullWidth
              margin="normal"
              name="teaching_unit"
              value={formikEdit.values.teaching_unit}
              onChange={formikEdit.handleChange}
              error={
                formikEdit.touched.teaching_unit &&
                Boolean(formikEdit.errors.teaching_unit)
              }
              helperText={
                formikEdit.touched.teaching_unit &&
                formikEdit.errors.teaching_unit
              }
            />

            {formikEdit.values.tasks.map((task, index) => {
              const taskError = (
                formikEdit.errors.tasks as string[] | undefined
              )?.[index];
              const taskTouched = (
                formikEdit.touched.tasks as boolean[] | undefined
              )?.[index];

              return (
                <TextEditorWithLabel
                  key={index}
                  index={index}
                  task={task}
                  onChange={(val) =>
                    formikEdit.setFieldValue(`tasks[${index}]`, val)
                  }
                  label={`Zadatak ${index + 1}`}
                  error={taskTouched && taskError ? taskError : undefined}
                />
              );
            })}

            <div style={{ marginTop: "32px" }}>
              <Button
                themes={["standardWide", "blue", "noBorderRadius"]}
                title={"Dodaj zadatak"}
                type={"button"}
                onClick={() => {
                  formikEdit.setFieldValue("tasks", [
                    ...formikEdit.values.tasks,
                    "",
                  ]);
                }}
              />
            </div>

            <div style={{ marginTop: "60px" }}>
              <Button
                title="Sačuvaj izmene"
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

        <Modal
          title="Dodaj domaći zadatak"
          isOpen={open}
          setIsOpen={setOpen}
          description="Dodajte jedan ili više zadataka koje učenici treba da urade."
          theme={"halfScreen"}
        >
          <form onSubmit={formikHomework.handleSubmit} className={styles.form}>
            <TextField
              label={homeworkConfig.teaching_unit.label}
              placeholder={homeworkConfig.teaching_unit.placeholder}
              variant="outlined"
              fullWidth
              margin="normal"
              name="teaching_unit"
              value={formikHomework.values.teaching_unit}
              onChange={formikHomework.handleChange}
              error={
                formikHomework.touched.teaching_unit &&
                Boolean(formikHomework.errors.teaching_unit)
              }
              helperText={
                formikHomework.touched.teaching_unit &&
                formikHomework.errors.teaching_unit
              }
            />

            {formikHomework.values.tasks.map((task, index) => {
              const taskError = (
                formikHomework.errors.tasks as string[] | undefined
              )?.[index];
              const taskTouched = (
                formikHomework.touched.tasks as boolean[] | undefined
              )?.[index];

              return (
                <TextEditorWithLabel
                  key={index}
                  index={index}
                  task={task}
                  onChange={(val) =>
                    formikHomework.setFieldValue(`tasks[${index}]`, val)
                  }
                  label={`Zadatak ${index + 1}`}
                  error={taskTouched && taskError ? taskError : undefined}
                />
              );
            })}

            <div style={{ marginTop: "32px" }}>
              <Button
                themes={["standardWide", "blue", "noBorderRadius"]}
                title={"Dodaj zadatak"}
                type={"button"}
                onClick={() => {
                  formikHomework.setFieldValue("tasks", [
                    ...formikHomework.values.tasks,
                    "",
                  ]);
                }}
              />
            </div>

            <div style={{ marginTop: "60px" }}>
              <Button
                title="Dodaj domaći zadatak"
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
