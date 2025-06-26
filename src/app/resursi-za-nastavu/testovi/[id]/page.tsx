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
import { useFetchTest } from "@/Hooks/Tests/getTest";
import { useAuth } from "@/Hooks/useAuth";
import { HomeworkItemType, TestItemType } from "@/Interfaces/BaseType";
import { PocketBaseCollection } from "@/libs/pocketbase";
import { testValidationSchema } from "@/app/resursi-za-nastavu/testovi/[id]/Validation";
import { testConfig } from "@/app/resursi-za-nastavu/testovi/config";
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

const Test = () => {
  const searchParams = useSearchParams();
  const subject = searchParams.get("subject") || "";
  const breadCrumb = {
    level1: "Početak",
    level2: "Resursi za nastavu",
    level3: "Testovi",
    level1url: "/",
    level2url: "/resursi-za-nastavu",
    level3url: "/resursi-za-nastavu/testovi",
  };

  const itemsPerPage = 12;

  const [myCurrentPage, setMyCurrentPage] = useState(1);
  const [otherCurrentPage, setOtherCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [editingTest, setEditingTest] = useState<TestItemType | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

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

  const {
    test,
    error: onError,
    loading: onLoading,
    refetch: refetchOperative,
  } = useFetchTest();

  const { userData, isLoggedIn } = useAuth();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: editingTest
      ? {
          teaching_unit: editingTest.teaching_unit,
          date: editingTest.date,
          tasks: taskKeys
            .map((key) => editingTest[key] || "")
            .filter((task) => task !== ""),
          subject: editingTest.subject,
        }
      : {
          teaching_unit: "",
          date: "",
          tasks: [""],
          subject: subject,
        },
    validationSchema: testValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      const dataToSend: Record<string, any> = {
        teaching_unit: values.teaching_unit,
        date: values.date,
        subject: values.subject,
        ...values.tasks.reduce(
          (acc, task, i) => {
            acc[`task${i + 1}`] = task;
            return acc;
          },
          {} as Record<string, string>,
        ),
        user: userData?.id,
      };

      taskKeys.forEach((key, i) => {
        dataToSend[key] = values.tasks[i] || "";
      });

      try {
        if (editingTest) {
          await axios.patch(
            `${PocketBaseCollection}/test/records/${editingTest.id}`,
            dataToSend,
          );
        } else {
          await axios.post(`${PocketBaseCollection}/test/records`, dataToSend);
        }

        resetForm();
        setOpenModal(false);
        setEditingTest(null);
        await refetchOperative();
      } catch (error) {
        console.error("Greška prilikom čuvanja:", error);
      }
    },
  });

  const handleOpenAddModal = () => {
    setEditingTest(null);
    formik.resetForm();
    setOpenModal(true);
  };

  const handleEdit = (testItem: TestItemType) => {
    setEditingTest(testItem);
    setOpenModal(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`${PocketBaseCollection}/test/records/${deleteId}`);
      await refetchOperative();
    } catch (error) {
      console.error("Greška prilikom brisanja:", error);
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    }
  };

  const [expandedUnitId, setExpandedUnitId] = useState<string | null>(null);

  const toggleExpandedUnit = (id: string) => {
    setExpandedUnitId((prevId) => (prevId === id ? null : id));
  };

  if (onLoading) {
    return <Preloader page />;
  }

  if (onError) return <div>Greška u učitavanju {onError}</div>;

  const myTests = test.filter(
    (t) =>
      t.subject.toLowerCase() === subject.toLowerCase() &&
      t.user === userData?.id &&
      matchesSearch(t, searchQuery),
  );

  const otherTests = test.filter(
    (t) =>
      t.subject.toLowerCase() === subject.toLowerCase() &&
      t.user !== userData?.id &&
      matchesSearch(t, searchQuery),
  );

  const paginatedMyTests = myTests.slice(
    (myCurrentPage - 1) * itemsPerPage,
    myCurrentPage * itemsPerPage,
  );

  const paginatedOtherTests = otherTests.slice(
    (otherCurrentPage - 1) * itemsPerPage,
    otherCurrentPage * itemsPerPage,
  );

  return (
    <div>
      <div className={!isLoggedIn ? styles.blurWrapper : ""}>
        <Header
          title={`Testovi - ${subject}`}
          imageUrl={"/forum-1.jpg"}
          breadcrumbItems={breadCrumb}
        />

        {isLoggedIn && (
          <div className={styles.addButtonWrapper}>
            <Button
              title={editingTest ? "Izmeni test" : "Dodaj test"}
              themes={[
                "orange",
                "standardWide",
                "standardHeight",
                "noBorderRadius",
                "maxWidth",
              ]}
              onClick={handleOpenAddModal}
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
              {myTests.length > 0 && (
                <>
                  <Title
                    level={3}
                    text={"Moji testovi"}
                    className={styles.title}
                  />
                  {paginatedMyTests.map((t) => {
                    const isExpanded = expandedUnitId === t.id;
                    return (
                      <div key={t.id} className={styles.teachingUnitWrapper}>
                        <TeachingUnitTitle
                          title={` ${t.teaching_unit} - ${t.date}`}
                          isExpanded={isExpanded}
                          onToggle={() => toggleExpandedUnit(t.id)}
                          onEdit={() => handleEdit(t)}
                          onDelete={() => handleDelete(t.id)}
                          canEdit={t.user === userData?.id}
                          plan={t}
                          type={"test"}
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
                  {myTests.length > itemsPerPage && (
                    <div className={styles.paginationContainer}>
                      <Pagination
                        count={Math.ceil(myTests.length / itemsPerPage)}
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
              {otherTests.length > 0 && (
                <>
                  <Title
                    level={3}
                    text={"Testovi dodati od drugih"}
                    className={styles.title}
                  />
                  {paginatedOtherTests.map((t) => {
                    const isExpanded = expandedUnitId === t.id;
                    return (
                      <div key={t.id} className={styles.teachingUnitWrapper}>
                        <TeachingUnitTitle
                          title={` ${t.teaching_unit} - ${t.date}`}
                          isExpanded={isExpanded}
                          onToggle={() => toggleExpandedUnit(t.id)}
                          onEdit={() => handleEdit(t)}
                          onDelete={() => handleDelete(t.id)}
                          canEdit={t.user === userData?.id}
                          plan={t}
                          type={"test"}
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
                  {otherTests.length > itemsPerPage && (
                    <div className={styles.paginationContainer}>
                      <Pagination
                        count={Math.ceil(otherTests.length / itemsPerPage)}
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
          title={editingTest ? "Izmeni test" : "Dodaj test"}
          isOpen={openModal}
          setIsOpen={setOpenModal}
          description={
            editingTest
              ? "Izmenite podatke o testu."
              : "Dodajte jedan ili više zadataka koje učenici treba da urade."
          }
          theme={"halfScreen"}
        >
          <form onSubmit={formik.handleSubmit} className={styles.form}>
            <TextField
              label={testConfig.teaching_unit.label}
              placeholder={testConfig.teaching_unit.placeholder}
              variant="outlined"
              fullWidth
              margin="normal"
              name="teaching_unit"
              value={formik.values.teaching_unit}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.teaching_unit &&
                Boolean(formik.errors.teaching_unit)
              }
              helperText={
                formik.touched.teaching_unit && formik.errors.teaching_unit
              }
            />

            <TextField
              label={testConfig.date.label}
              placeholder={testConfig.date.placeholder}
              variant="outlined"
              fullWidth
              margin="normal"
              name="date"
              value={formik.values.date}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.date && Boolean(formik.errors.date)}
              helperText={formik.touched.date && formik.errors.date}
            />

            {formik.values.tasks.map((task, index) => {
              const taskError = (formik.errors.tasks as string[] | undefined)?.[
                index
              ];
              const taskTouched = (
                formik.touched.tasks as boolean[] | undefined
              )?.[index];

              return (
                <TextEditorWithLabel
                  key={index}
                  index={index}
                  task={task}
                  onChange={(val) =>
                    formik.setFieldValue(`tasks[${index}]`, val)
                  }
                  label={`Zadatak ${index + 1}`}
                  error={taskTouched && taskError ? taskError : undefined}
                  canDelete={formik.values.tasks.length > 1}
                  onAdd={() =>
                    formik.setFieldValue("tasks", [...formik.values.tasks, ""])
                  }
                  onDelete={() => {
                    const updatedTasks = [...formik.values.tasks];
                    updatedTasks.splice(index, 1);
                    formik.setFieldValue("tasks", updatedTasks);
                  }}
                />
              );
            })}

            <div style={{ marginTop: "60px" }}>
              <Button
                title={editingTest ? "Sačuvaj izmene" : "Dodaj test"}
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
          title="Potvrda brisanja testa"
          description="Da li ste sigurni da želite da obrišete ovaj test?"
        />
      </div>
      <Footer />
      {!isLoggedIn && <RequireAuth />}
    </div>
  );
};

export default Test;
