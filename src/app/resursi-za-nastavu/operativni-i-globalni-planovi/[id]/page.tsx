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
import {
  globalSubjectConfig,
  operativeClassConfig,
} from "@/app/resursi-za-nastavu/operativni-i-globalni-planovi/config";
import { TextField } from "@mui/material";
import { useFetchOperativePlansWithClass } from "@/Hooks/OperativeAndGlobalPlans/getOperativePlansWithClass";
import { useSearchParams } from "next/navigation";
import { useFetchGlobalPlansWithSubject } from "@/Hooks/OperativeAndGlobalPlans/getGlobalPlanForSubject";
import Preloader from "@/Components/Preloader/Preloader";
import { Footer } from "@/Components/Footer";
import { useExportCSV } from "@/Hooks/Download/useExportCSV";

const SingleOperativnePlan = () => {
  const searchParams = useSearchParams();
  const subject = searchParams.get("subject") || "";
  const type = searchParams.get("type") || "";
  const breadCrumb = {
    level1: "Početak",
    level2: "Resursi za nastavu",
    level3: "Operativni i globalni planovi",
    level1url: "/",
    level2url: "/resursi-za-nastavu",
    level3url: "/resursi-za-nastavu/operativni-i-globalni-planovi",
  };

  const {
    operativePlansForClass,
    error: operativeError,
    loading: operativeLoading,
    refetch: refetchOperative,
  } = useFetchOperativePlansWithClass();

  const {
    globalPlansForSubject,
    error: globalError,
    loading: globalLoading,
    refetch: refetchGlobal,
  } = useFetchGlobalPlansWithSubject();

  const { isLoggedIn } = useAuth();
  const [open, setOpen] = useState(false);
  const handleOpenModal = () => setOpen(true);

  const formikOperative = useFormik({
    initialValues: {
      teaching_topic: "",
      lesson_number: "",
      lesson_title: "",
      type_of_lesson: "",
      forms_of_work: "",
      teaching_methods: "",
      teaching_techniques: "",
      correlation: "",
      instructional_materials: "",
      subject: subject,
      educational_objects: "",
      literature: "",
      notes: "",
    },

    onSubmit: async (values, { resetForm }) => {
      try {
        await axios.post(
          `${PocketBaseCollection}/operative_plan_for_class/records`,
          values,
        );
        resetForm();
        setOpen(false);
        await refetchOperative();
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
  });

  const formikGlobal = useFormik({
    initialValues: {
      class_theme: "",
      learning_objectives: "",
      month: "",
      processing_class: 0,
      review_class: 0,
      evaluation_class: 0,
      subject: subject,
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        await axios.post(
          `${PocketBaseCollection}/global_plan_for_subject/records`,
          values,
        );
        resetForm();
        setOpen(false);
        await refetchGlobal();
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
  });

  const filteredOperativePlans = operativePlansForClass.filter(
    (plan) => plan.subject === subject,
  );

  const filteredGlobalPlans = globalPlansForSubject.filter(
    (plan) => plan.subject === subject,
  );

  if (operativeLoading || globalLoading) {
    return <Preloader page />;
  }

  if (operativeError || globalError)
    return <div>Greška u učitavanju {operativeError || globalError}</div>;

  const { downloadCSV } = useExportCSV();

  return (
    <div>
      <Header
        title={`${type === "operative" ? "Operativni" : "Globalni "} - ${subject}`}
        imageUrl={"/forum-1.jpg"}
        breadcrumbItems={breadCrumb}
      />
      {isLoggedIn && (
        <div className={styles.addButtonWrapper}>
          {(type === "operative" || type === "global") && (
            <>
              <Button
                title={
                  type === "operative" ? "Dodaj čas" : "Dodaj nastavnu temu"
                }
                themes={[
                  "orange",
                  "standardWide",
                  "standardHeight",
                  "noBorderRadius",
                  "maxWidth",
                ]}
                onClick={handleOpenModal}
              />
              <Button
                title="Preuzmi tabelu"
                themes={[
                  "blue",
                  "standardWide",
                  "standardHeight",
                  "noBorderRadius",
                  "maxWidth",
                ]}
                onClick={() =>
                  downloadCSV(
                    type as "operative" | "global",
                    filteredOperativePlans,
                    filteredGlobalPlans,
                    `${subject}-`,
                  )
                }
              />
            </>
          )}
        </div>
      )}

      <section className={styles.container}>
        <div className={styles.referencesWrap}>
          {type === "operative" ? (
            filteredOperativePlans &&
            filteredOperativePlans.length > 0 && (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Red. br.</th>
                      <th>Nastavna tema</th>
                      <th>Naslov nastavne jedinice</th>
                      <th>Tip časa</th>
                      <th>Modeli nastavnog rada</th>
                      <th>Oblici rada</th>
                      <th>Metode rada</th>
                      <th>Nastavni sredstva</th>
                      <th>Nastavni objekti</th>
                      <th>Korelacija</th>
                      <th>Literatura</th>
                      <th>Beleske</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOperativePlans.map((plan) => (
                      <tr key={plan.id}>
                        <td>{plan.lesson_number}</td>
                        <td>{plan.teaching_topic}</td>
                        <td>{plan.lesson_title}</td>
                        <td>{plan.type_of_lesson}</td>
                        <td>{plan.teaching_methods}</td>
                        <td>{plan.forms_of_work}</td>
                        <td>{plan.teaching_techniques}</td>
                        <td>{plan.instructional_materials}</td>
                        <td>{plan.educational_objects}</td>
                        <td>{plan.correlation}</td>
                        <td>{plan.literature}</td>
                        <td>{plan.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : type === "global" ? (
            filteredGlobalPlans &&
            filteredGlobalPlans.length > 0 && (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Naziv nastavne teme</th>
                      <th>Zadaci nastavne teme</th>
                      <th>Mesec</th>
                      <th>Obrada</th>
                      <th>Utvrdjivanje</th>
                      <th>Provera</th>
                      <th>Ukupan broj časova</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGlobalPlans.map((plan) => (
                      <tr key={plan.id}>
                        <td>{plan.class_theme}</td>
                        <td>{plan.learning_objectives}</td>
                        <td>{plan.month}</td>
                        <td>{plan.processing_class}</td>
                        <td>{plan.evaluation_class}</td>
                        <td>{plan.review_class}</td>
                        <td>
                          {plan.review_class +
                            plan.processing_class +
                            plan.evaluation_class}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            <p>Tip plana nije prepoznat.</p>
          )}
        </div>
        <aside className={styles.sidebarWrap}>
          <SidebarWrapper />
        </aside>
      </section>
      <Modal
        title="Dodaj novi čas"
        isOpen={open}
        setIsOpen={setOpen}
        description="Popunite polja da biste dodali novi čas."
        theme={"halfScreen"}
      >
        {type === "operative" ? (
          <form onSubmit={formikOperative.handleSubmit} className={styles.form}>
            {Object.entries(operativeClassConfig).map(([key, config]) => (
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
              />
            ))}

            <Button
              title="Dodaj čas"
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
        ) : (
          <form onSubmit={formikGlobal.handleSubmit} className={styles.form}>
            {Object.entries(globalSubjectConfig).map(([key, config]) => (
              <TextField
                key={key}
                label={config.label}
                placeholder={config.placeholder}
                variant="outlined"
                fullWidth
                margin="normal"
                name={key}
                value={
                  formikGlobal.values[key as keyof typeof formikGlobal.values]
                }
                onChange={formikGlobal.handleChange}
              />
            ))}

            <Button
              title="Dodaj globalni plan"
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
        )}
      </Modal>
      <Footer />
    </div>
  );
};

export default SingleOperativnePlan;
