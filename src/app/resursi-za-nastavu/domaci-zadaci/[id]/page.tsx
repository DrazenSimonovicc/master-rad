"use client";

import { Header } from "@/Components/Header/Header";

import { useAuth } from "@/Hooks/useAuth";
import React, { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { PocketBaseCollection } from "@/libs/pocketbase";
import styles from "./page.module.scss";
import { Button } from "@/Components/Button";
import { SidebarWrapper } from "@/Components/Layout/Sidebar/SidebarWrapper";
import { Modal } from "@/Components/Modal";
import { Pagination, TextField } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useFetchHomeworks } from "@/Hooks/Homework/getHomeworks";
import { homeworkConfig } from "@/app/resursi-za-nastavu/domaci-zadaci/config";
import TaskList from "@/Components/TaskList/TaskList";
import RequireAuth from "@/Components/RequireAuth/RequireAuth";
import TextEditorWithLabel from "@/Components/Texts/TextEditorWithLabel/TextEditorWithLabel";
import Preloader from "@/Components/Preloader/Preloader";
import { Footer } from "@/Components/Footer";

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
    refetch: refetchOperative,
  } = useFetchHomeworks();

  const { userData, isLoggedIn } = useAuth();
  const [open, setOpen] = useState(false);
  const handleOpenModal = () => setOpen(true);

  const formikHomework = useFormik({
    initialValues: {
      tasks: [""],
      subject: subject,
      teaching_unit: "",
    },
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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const filteredHomeworks = homework.filter((plan) => plan.subject === subject);

  const [expandedUnitId, setExpandedUnitId] = useState<string | null>(null);

  const toggleExpandedUnit = (id: string) => {
    setExpandedUnitId((prevId) => (prevId === id ? null : id));
  };

  if (onLoading) {
    return <Preloader page />;
  }

  if (onError) return <div>Greška u učitavanju {onError}</div>;

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
              title={"Dodaj domaci zadatak"}
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
            {filteredHomeworks
              .slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage,
              )
              .map((plan) => {
                const isExpanded = expandedUnitId === plan.id;

                return (
                  <div key={plan.id} className={styles.teachingUnitWrapper}>
                    <div
                      onClick={() => toggleExpandedUnit(plan.id)}
                      className={`${styles.teachingUnitTitle} ${isExpanded ? styles.expanded : ""}`}
                    >
                      {plan.teaching_unit}
                    </div>

                    {isExpanded && (
                      <div className={styles.taskListWrapper}>
                        <TaskList plan={plan} expandedUnitId={expandedUnitId} />
                      </div>
                    )}
                  </div>
                );
              })}
            {filteredHomeworks.length > itemsPerPage && (
              <div className={styles.paginationContainer}>
                <Pagination
                  count={Math.ceil(filteredHomeworks.length / itemsPerPage)}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  shape="rounded"
                />
              </div>
            )}
          </div>
          <aside className={styles.sidebarWrap}>
            <SidebarWrapper />
          </aside>
        </section>

        <Modal
          title="Dodaj domaci zadatak"
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
            />

            {formikHomework.values.tasks.map((task, index) => (
              <TextEditorWithLabel
                key={index}
                index={index}
                task={task}
                onChange={(val) =>
                  formikHomework.setFieldValue(`tasks[${index}]`, val)
                }
                label={`Zadatak ${index + 1}`}
              />
            ))}

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
                title="Dodaj domaci zadatak"
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
      </div>
      <Footer />
      {!isLoggedIn && <RequireAuth />}
    </div>
  );
};

export default Homework;
