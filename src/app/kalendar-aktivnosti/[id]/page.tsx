"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import { TextField } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { Button } from "@/Components/Button";
import { Header } from "@/Components/Header/Header";
import { SidebarWrapper } from "@/Components/Layout/Sidebar/SidebarWrapper";
import { Modal } from "@/Components/Modal";
import DeleteConfirmationModal from "@/Components/Modal/DeleteConfirmationModal/DeleteConfirmationModal";
import Preloader from "@/Components/Preloader/Preloader";
import TextEditorWithLabel from "@/Components/Texts/TextEditorWithLabel/TextEditorWithLabel";
import { Title } from "@/Components/Texts/Title";
import { useFetchActivity } from "@/Hooks/Activity/getActivity";
import { useDownloadActivity } from "@/Hooks/Download/useDownloadActivity";
import { useAuth } from "@/Hooks/useAuth";
import { ActivityType } from "@/Interfaces/BaseType";
import { PocketBaseCollection } from "@/libs/pocketbase";
import { ActivityConfig } from "@/app/kalendar-aktivnosti/config";
import styles from "./page.module.scss";

const SingleActivity = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  const title = searchParams.get("title") || "";
  const breadCrumb = {
    level1: "Početak",
    level2: "Kalendar aktivnosti",
    level3: `${title}`,
    level1url: "/",
    level2url: "/kalendar-aktivnosti",
  };

  const router = useRouter();
  const { userData } = useAuth();

  const {
    activity,
    error: ActivityError,
    loading: ActivityLoading,
    refetch: refetchActivity,
  } = useFetchActivity(userData?.id);

  const filteredActivity = activity.filter((plan) => plan.id === id);

  const { downloadActivity } = useDownloadActivity();

  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<ActivityType | null>(
    null,
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const activityValidationSchema = Yup.object().shape({
    type_of_activity: Yup.string()
      .trim()
      .required("Vrsta aktivnosti je obavezna"),
    title: Yup.string().trim().required("Naslov je obavezan"),
    description: Yup.string().required("Opis je obavezan"),
    date: Yup.string().required("Datum je obavezan"),
    place: Yup.string().trim(),
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
        if (editingActivity) {
          await axios.patch(
            `${PocketBaseCollection}/activity/records/${editingActivity.id}`,
            values,
          );
        } else {
          await axios.post(`${PocketBaseCollection}/activity/records`, {
            ...values,
            user: userData.id,
          });
        }

        resetForm();
        setOpenEditModal(false);
        setEditingActivity(null);
        await refetchActivity();
      } catch (error) {
        console.error("Error submitting activity:", error);
      }
    },
  });

  const handleEdit = (activity: ActivityType) => {
    setEditingActivity(activity);
    activityFormik.setValues({
      type_of_activity: activity.type_of_activity || "",
      title: activity.title || "",
      description: activity.description || "",
      date: activity.date || "",
      place: activity.place || "",
    });
    setOpenEditModal(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(
        `${PocketBaseCollection}/activity/records/${deleteId}`,
      );
      setDeleteId(null);
      router.push("/kalendar-aktivnosti");
      await refetchActivity();
    } catch (error) {
      console.error("Greška prilikom brisanja:", error);
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  if (ActivityLoading) {
    return <Preloader page />;
  }

  if (ActivityError) {
    return <div>Greška u učitavanju vesti: {ActivityError}</div>;
  }

  return (
    <div>
      <Header title={title} imageUrl="/cal1.jpg" breadcrumbItems={breadCrumb} />

      <section className={styles.container}>
        <div className={styles.referencesWrap}>
          {filteredActivity.map((activity) => (
            <div key={activity.id} className={styles.activityWrap}>
              <div className={styles.typeOfActivity}>
                {activity.type_of_activity}
              </div>
              <div className={styles.titleWrapper}>
                <Title
                  level={3}
                  text={activity.title}
                  className={styles.title}
                />
                <div className={styles.iconsWrapper}>
                  <DownloadIcon
                    onClick={() => downloadActivity(activity)}
                    className={styles.icon}
                  />

                  <EditIcon
                    className={styles.icon}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(activity);
                    }}
                  />
                  <DeleteIcon
                    className={styles.icon}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(activity.id);
                    }}
                  />
                </div>
              </div>

              <div className={styles.afterTitle}>
                <span>{activity.date}</span>
                <span>{activity.place}</span>
              </div>
              <div
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: activity.description }}
              />
            </div>
          ))}
        </div>
        <aside className={styles.sidebarWrap}>
          <SidebarWrapper />
        </aside>
      </section>

      <Modal
        title={"Izmeni aktivnost"}
        isOpen={openEditModal}
        setIsOpen={setOpenEditModal}
        description="Popunite polja i sačuvajte aktivnost"
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
            title={"Sačuvaj izmene"}
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
        title="Potvrda brisanja aktivnosti"
        description="Da li ste sigurni da želite da obrišete ovu aktivnost?"
      />
    </div>
  );
};

export default SingleActivity;
