"use client";

import React, { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { TextField } from "@mui/material";
import { Button } from "@/Components/Button";
import { Footer } from "@/Components/Footer";
import { Header } from "@/Components/Header/Header";
import { SidebarWrapper } from "@/Components/Layout/Sidebar/SidebarWrapper";
import { Modal } from "@/Components/Modal";
import DeleteConfirmationModal from "@/Components/Modal/DeleteConfirmationModal/DeleteConfirmationModal";
import Preloader from "@/Components/Preloader/Preloader";
import RequireAuth from "@/Components/RequireAuth/RequireAuth";
import SubjectCard from "@/Components/SubjectCard/SubjectCard";
import { Title } from "@/Components/Texts/Title";
import { useFetchGlobalPlans } from "@/Hooks/OperativeAndGlobalPlans/getGlobalPlans";
import { useFetchOperativePlans } from "@/Hooks/OperativeAndGlobalPlans/getOperativePlans";
import { useAuth } from "@/Hooks/useAuth";
import {
  GlobalPlansItemType,
  OperativePlansItemType,
} from "@/Interfaces/BaseType";
import { PocketBaseCollection } from "@/libs/pocketbase";
import {
  globalFieldConfig,
  operativeFieldConfig,
} from "@/app/resursi-za-nastavu/operativni-i-globalni-planovi/config";
import styles from "./page.module.scss";

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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<"operative" | "global" | null>(
    null,
  );

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

  // State for editing plans
  const [editingOperative, setEditingOperative] =
    useState<OperativePlansItemType | null>(null);
  const [editingGlobal, setEditingGlobal] =
    useState<GlobalPlansItemType | null>(null);

  // Open modals & prepare for editing or creating new
  const handleOpenOperativeModal = () => {
    setEditingOperative(null);
    setOpenOperative(true);
  };
  const handleOpenGlobalModal = () => {
    setEditingGlobal(null);
    setOpenGlobal(true);
  };

  const handleEditOperative = (plan: OperativePlansItemType) => {
    setEditingOperative(plan);
    setOpenOperative(true);
  };

  const handleEditGlobal = (plan: GlobalPlansItemType) => {
    setEditingGlobal(plan);
    setOpenGlobal(true);
  };

  // Validation schemas
  const OperativeValidationSchema = Yup.object({
    subject: Yup.string()
      .required("Naziv predmeta je obavezan.")
      .min(2, "Predmet mora imati bar 2 slova."),
    grade: Yup.string().required("Razred je obavezan."),
    month: Yup.string().required("Mesec je obavezan."),
    school_year: Yup.string().required("Školska godina je obavezna."),
  });

  const GlobalValidationSchema = Yup.object({
    subject: Yup.string()
      .required("Naziv predmeta je obavezan.")
      .min(2, "Predmet mora imati bar 2 slova."),
    grade: Yup.string().required("Razred je obavezan."),
    school_year: Yup.string().required("Školska godina je obavezna."),
  });

  // Formik for Operative Plan with dynamic initial values based on editingOperative
  const formikOperative = useFormik({
    enableReinitialize: true,
    initialValues: {
      subject: editingOperative?.subject || "",
      grade: editingOperative?.grade || "",
      month: editingOperative?.month || "",
      school_year: editingOperative?.school_year || "",
      teacher: editingOperative?.teacher || "",
    },
    validationSchema: OperativeValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (editingOperative) {
          // Update existing
          await axios.patch(
            `${PocketBaseCollection}/operative_plan/records/${editingOperative.id}`,
            {
              ...values,
              user: userData.id,
            },
          );
        } else {
          // Create new
          await axios.post(`${PocketBaseCollection}/operative_plan/records`, {
            ...values,
            user: userData.id,
          });
        }
        resetForm();
        setOpenOperative(false);
        setEditingOperative(null);
        await refetchOperative();
        await refetchGlobal();
      } catch (error) {
        console.error("Error submitting operative plan:", error);
      }
    },
  });

  // Formik for Global Plan with dynamic initial values based on editingGlobal
  const formikGlobal = useFormik({
    enableReinitialize: true,
    initialValues: {
      subject: editingGlobal?.subject || "",
      grade: editingGlobal?.grade || "",
      school_year: editingGlobal?.school_year || "",
      teacher: editingGlobal?.teacher || "",
    },
    validationSchema: GlobalValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (editingGlobal) {
          // Update existing
          await axios.patch(
            `${PocketBaseCollection}/global_plan/records/${editingGlobal.id}`,
            {
              ...values,
              user: userData.id,
            },
          );
        } else {
          // Create new
          await axios.post(`${PocketBaseCollection}/global_plan/records`, {
            ...values,
            user: userData.id,
          });
        }
        resetForm();
        setOpenGlobal(false);
        setEditingGlobal(null);
        await refetchOperative();
        await refetchGlobal();
      } catch (error) {
        console.error("Error submitting global plan:", error);
      }
    },
  });

  if (isLoggedIn && (opLoading || glLoading)) {
    return <Preloader page />;
  }

  if (isLoggedIn && (opError || glError)) {
    return <div>Greška u učitavanju {opError || glError}</div>;
  }

  // Fix delete handler to know what to delete and call correct endpoint
  const handleDelete = (id: string, type: "operative" | "global") => {
    setDeleteId(id);
    setDeleteType(type);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId || !deleteType) return;

    try {
      const collection =
        deleteType === "operative" ? "operative_plan" : "global_plan";
      await axios.delete(
        `${PocketBaseCollection}/${collection}/records/${deleteId}`,
      );
      if (deleteType === "operative") {
        await refetchOperative();
      } else {
        await refetchGlobal();
      }
    } catch (error) {
      console.error("Greška prilikom brisanja:", error);
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteId(null);
      setDeleteType(null);
    }
  };

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
                "orange",
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
                "orange",
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
                description={`${plan.subject} - ${plan.grade} - ${plan.month} - ${plan.school_year} - ${plan.teacher}`}
                type={"operative"}
                subject={plan.subject}
                onEdit={() => handleEditOperative(plan)}
                onDelete={() => handleDelete(plan.id, "operative")}
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
                description={`${plan.subject} - ${plan.grade} - ${plan.school_year} - ${plan.teacher}`}
                type={"global"}
                subject={plan.subject}
                onEdit={() => handleEditGlobal(plan)}
                onDelete={() => handleDelete(plan.id, "global")}
              />
            ))}
          </div>
          <aside className={styles.sidebarWrap}>
            <SidebarWrapper />
          </aside>
        </section>

        {/* Operative Modal */}
        <Modal
          title={
            editingOperative
              ? "Izmeni operativni plan"
              : "Dodaj novi operativni plan"
          }
          isOpen={openOperative}
          setIsOpen={(open) => {
            setOpenOperative(open);
            if (!open) setEditingOperative(null);
          }}
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
                error={
                  !!formikOperative.touched[
                    key as keyof typeof formikOperative.touched
                  ] &&
                  !!formikOperative.errors[
                    key as keyof typeof formikOperative.errors
                  ]
                }
                helperText={
                  formikOperative.touched[
                    key as keyof typeof formikOperative.touched
                  ] &&
                  formikOperative.errors[
                    key as keyof typeof formikOperative.errors
                  ]
                }
              />
            ))}

            <Button
              title={editingOperative ? "Sačuvaj izmene" : "Dodaj plan"}
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

        {/* Global Modal */}
        <Modal
          title={
            editingGlobal ? "Izmeni globalni plan" : "Dodaj novi globalni plan"
          }
          isOpen={openGlobal}
          setIsOpen={(open) => {
            setOpenGlobal(open);
            if (!open) setEditingGlobal(null);
          }}
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
                error={
                  !!formikGlobal.touched[
                    key as keyof typeof formikGlobal.touched
                  ] &&
                  !!formikGlobal.errors[key as keyof typeof formikGlobal.errors]
                }
                helperText={
                  formikGlobal.touched[
                    key as keyof typeof formikGlobal.touched
                  ] &&
                  formikGlobal.errors[key as keyof typeof formikGlobal.errors]
                }
              />
            ))}

            <Button
              title={editingGlobal ? "Sačuvaj izmene" : "Dodaj plan"}
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

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        onConfirm={confirmDelete}
        title="Potvrda brisanja plana"
        description="Da li ste sigurni da želite da obrišete ovaj plan?"
      />

      <Footer />
      {!isLoggedIn && <RequireAuth />}
    </div>
  );
};

export default OperativeAndGlobalPlans;
