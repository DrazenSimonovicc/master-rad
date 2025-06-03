"use client";

import { Header } from "@/Components/Header/Header";
import { useFetchOperativePlans } from "@/Hooks/OperativeAndGlobalPlans/getOperativePlans";
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
import {
  globalFieldConfig,
  operativeFieldConfig,
} from "@/app/resursi-za-nastavu/operativni-i-globalni-planovi/config";
import { Title } from "@/Components/Texts/Title";
import { useFetchGlobalPlans } from "@/Hooks/OperativeAndGlobalPlans/getGlobalPlans";
import RequireAuth from "@/Components/RequireAuth/RequireAuth";
import Preloader from "@/Components/Preloader/Preloader";
import SubjectCard from "@/Components/SubjectCard/SubjectCard";
import { Footer } from "@/Components/Footer";

const OperativeAndGlobalPlans = () => {
  const breadCrumb = {
    level1: "Početak",
    level2: "Resursi za nastavu",
    level3: "Operativni i globalni planovi",
    level1url: "/",
    level2url: "/resursi-za-nastavu",
    level3url: "/resursi-za-nastavu/operativni-i-globalni-planovi",
  };

  const { userData, isLoggedIn } = useAuth();
  const [openOperative, setOpenOperative] = useState(false);
  const [openGlobal, setOpenGlobal] = useState(false);

  const {
    operativePlans,
    error: opError,
    loading: opLoading,
    refetch: refetchOperative,
  } = useFetchOperativePlans(userData?.id);

  const {
    globalPlans,
    error: glError,
    loading: glLoading,
    refetch: refetchGlobal,
  } = useFetchGlobalPlans(userData?.id);

  const handleOpenOperativeModal = () => setOpenOperative(true);
  const handleOpenGlobalModal = () => setOpenGlobal(true);

  const formikOperative = useFormik({
    initialValues: {
      subject: "",
      grade: "",
      month: "",
      school_year: "",
      teacher: "",
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        await axios.post(`${PocketBaseCollection}/operativni_planovi/records`, {
          ...values,
          user: userData.id,
        });
        resetForm();
        setOpenOperative(false);
        await refetchOperative();
        await refetchGlobal();
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
  });

  const formikGlobal = useFormik({
    initialValues: {
      subject: "",
      grade: "",
      school_year: "",
      teacher: "",
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        await axios.post(`${PocketBaseCollection}/globalni_planovi/records`, {
          ...values,
          user: userData.id,
        });
        resetForm();
        setOpenGlobal(false);
        await refetchOperative();
        await refetchGlobal();
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
  });

  if (isLoggedIn && (opLoading || glLoading)) {
    return <Preloader page />;
  }

  if (isLoggedIn && (opError || glError)) {
    return <div>Greška u učitavanju {opError || glError}</div>;
  }

  return (
    <div>
      <div className={!isLoggedIn ? styles.blurWrapper : ""}>
        <Header
          title={"Operativni i globalni planovi"}
          imageUrl={"/forum-1.jpg"}
          breadcrumbItems={breadCrumb}
        />
        {isLoggedIn && (
          <div className={styles.addButtonWrapper}>
            <Button
              title={"Dodaj novi operativni plan"}
              themes={[
                "blue",
                "standardWide",
                "standardHeight",
                "noBorderRadius",
                "maxWidth",
              ]}
              onClick={handleOpenOperativeModal}
            />

            <Button
              title={"Dodaj novi globalni plan"}
              themes={[
                "blue",
                "standardWide",
                "standardHeight",
                "noBorderRadius",
                "maxWidth",
              ]}
              onClick={handleOpenGlobalModal}
            />
          </div>
        )}
        <section className={styles.container}>
          <div className={styles.referencesWrap}>
            {operativePlans && operativePlans.length > 0 && (
              <Title
                text={"Operativni planovi"}
                level={2}
                className={styles.title}
              />
            )}
            {operativePlans.map((plan) => (
              <SubjectCard
                link={"/resursi-za-nastavu/operativni-i-globalni-planovi"}
                id={plan.id}
                key={plan.id}
                description={`${plan.subject} - ${plan.grade} - ${plan.month} - 
                ${plan.school_year} - ${plan.teacher}`}
                type={"operative"}
                subject={plan.subject}
              />
            ))}

            {globalPlans && globalPlans.length > 0 && (
              <Title
                text={"Globalni planovi"}
                level={2}
                className={styles.title}
              />
            )}
            {globalPlans.map((plan) => (
              <SubjectCard
                link={"/resursi-za-nastavu/operativni-i-globalni-planovi"}
                id={plan.id}
                key={plan.id}
                description={`${plan.subject} - ${plan.grade} - 
                ${plan.school_year} - ${plan.teacher}`}
                type={"global"}
                subject={plan.subject}
              />
            ))}
          </div>
          <aside className={styles.sidebarWrap}>
            <SidebarWrapper />
          </aside>
        </section>
        <Modal
          title="Dodaj novi operativni plan"
          isOpen={openOperative}
          setIsOpen={setOpenOperative}
          description="Popunite polja da biste dodali novu operativni plan."
          theme={"halfScreen"}
        >
          <form onSubmit={formikOperative.handleSubmit} className={styles.form}>
            {Object.entries(operativeFieldConfig).map(([key, config]) => (
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
              title={"Dodaj plan"}
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
        <Modal
          title="Dodaj novi globalni plan"
          isOpen={openGlobal}
          setIsOpen={setOpenGlobal}
          description="Popunite polja da biste dodali novu globalni plan."
          theme={"halfScreen"}
        >
          <form onSubmit={formikGlobal.handleSubmit} className={styles.form}>
            {Object.entries(globalFieldConfig).map(([key, config]) => (
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
              title={"Dodaj plan"}
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

export default OperativeAndGlobalPlans;
