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
import { useFetchTest } from "@/Hooks/Tests/getTest";
import { testConfig } from "@/app/resursi-za-nastavu/testovi/config";
import TaskList from "@/Components/TaskList/TaskList";
import RequireAuth from "@/Components/RequireAuth/RequireAuth";
import TextEditorWithLabel from "@/Components/Texts/TextEditorWithLabel/TextEditorWithLabel";
import Preloader from "@/Components/Preloader/Preloader";
import { Footer } from "@/Components/Footer";
import { Title } from "@/Components/Texts/Title";
import * as Yup from "yup";

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

  const [myCurrentPage, setMyCurrentPage] = useState(1);
  const [otherCurrentPage, setOtherCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const {
    test,
    error: onError,
    loading: onLoading,
    refetch: refetchOperative,
  } = useFetchTest();

  const { userData, isLoggedIn } = useAuth();
  const [open, setOpen] = useState(false);
  const handleOpenModal = () => setOpen(true);

  const testValidationSchema = Yup.object().shape({
    teaching_unit: Yup.string()
      .trim()
      .required("Naziv nastavne oblasti je obavezno polje"),
    date: Yup.string().trim().required("Datum održavanja testa je obavezan"),
    tasks: Yup.array()
      .of(Yup.string().trim().required("Zadatak ne može biti prazan"))
      .min(1, "Potrebno je uneti bar jedan zadatak"),
  });

  const formikTest = useFormik({
    initialValues: {
      tasks: [""],
      subject: subject,
      teaching_unit: "",
      date: "",
    },
    validationSchema: testValidationSchema,
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
        await axios.post(`${PocketBaseCollection}/test/records`, dataToSend);
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

  const myTests = test.filter(
    (t) =>
      t.subject.toLowerCase() === subject.toLowerCase() &&
      t.user === userData?.id,
  );

  const otherTests = test.filter(
    (t) =>
      t.subject.toLowerCase() === subject.toLowerCase() &&
      t.user !== userData?.id,
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
              title={"Dodaj test"}
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
                        <div
                          onClick={() => toggleExpandedUnit(t.id)}
                          className={`${styles.teachingUnitTitle} ${
                            isExpanded ? styles.expanded : ""
                          }`}
                        >
                          {t.teaching_unit} - {t.date}
                        </div>
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
                    text={"Dodati od strane drugih"}
                    className={styles.title}
                  />
                  {paginatedOtherTests.map((t) => {
                    const isExpanded = expandedUnitId === t.id;
                    return (
                      <div key={t.id} className={styles.teachingUnitWrapper}>
                        <div
                          onClick={() => toggleExpandedUnit(t.id)}
                          className={`${styles.teachingUnitTitle} ${
                            isExpanded ? styles.expanded : ""
                          }`}
                        >
                          {t.teaching_unit} - {t.date}
                        </div>
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
          title="Dodaj test"
          isOpen={open}
          setIsOpen={setOpen}
          description="Dodajte jedan ili više zadataka koje učenici treba da urade."
          theme={"halfScreen"}
        >
          <form onSubmit={formikTest.handleSubmit} className={styles.form}>
            <TextField
              label={testConfig.teaching_unit.label}
              placeholder={testConfig.teaching_unit.placeholder}
              variant="outlined"
              fullWidth
              margin="normal"
              name="teaching_unit"
              value={formikTest.values.teaching_unit}
              onChange={formikTest.handleChange}
              onBlur={formikTest.handleBlur}
              error={
                formikTest.touched.teaching_unit &&
                Boolean(formikTest.errors.teaching_unit)
              }
              helperText={
                formikTest.touched.teaching_unit &&
                formikTest.errors.teaching_unit
              }
            />
            <TextField
              label={testConfig.date.label}
              placeholder={testConfig.date.placeholder}
              variant="outlined"
              fullWidth
              margin="normal"
              name="date"
              value={formikTest.values.date}
              onChange={formikTest.handleChange}
              onBlur={formikTest.handleBlur}
              error={formikTest.touched.date && Boolean(formikTest.errors.date)}
              helperText={formikTest.touched.date && formikTest.errors.date}
            />
            {formikTest.values.tasks.map((task, index) => {
              const taskError = (
                formikTest.errors.tasks as string[] | undefined
              )?.[index];
              const taskTouched = (
                formikTest.touched.tasks as boolean[] | undefined
              )?.[index];

              return (
                <TextEditorWithLabel
                  key={index}
                  index={index}
                  task={task}
                  onChange={(val) =>
                    formikTest.setFieldValue(`tasks[${index}]`, val)
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
                  formikTest.setFieldValue("tasks", [
                    ...formikTest.values.tasks,
                    "",
                  ]);
                }}
              />
            </div>
            <div style={{ marginTop: "60px" }}>
              <Button
                title="Dodaj test"
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

export default Test;
