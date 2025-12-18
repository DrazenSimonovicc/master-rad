"use client";

import dayjs, { Dayjs } from "dayjs";
import React, { FC, useEffect, useState } from "react";
import { useFormik } from "formik";
import { Button } from "@/Components/Button";
import DatePickerField from "@/Components/DatePicker/DatePicker";
import { PageHeader } from "@/Components/Navigation/PageHeader";
import SelectField from "@/Components/Inputs/SelectField/SelectField";
import TextInput from "@/Components/Inputs/TextInput/TextInput";
import { ProfileInfoDescription } from "@/Components/ProfileInfoDescription/ProfileInfoDescription";
import { useFetchCurrentUser } from "@/Hooks/getCurrentUser";
import { userDataType } from "@/Interfaces/BaseType";
import { userService, getAvatarUrl } from "@/libs/api";
import {
  School,
  Work,
  CalendarToday,
  Person,
  LocationOn,
  WorkspacePremium,
  Edit,
} from "@mui/icons-material";
import styles from "./page.module.scss";

const ProfilePage: FC = () => {
  const { userData: currentUser, error, loading, refetch } = useFetchCurrentUser();
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState<string>(currentUser?.avatar || "");
  const [isDragging, setIsDragging] = useState(false);

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files ? event.target.files[0] : null;

    if (!file || !currentUser) return;

    if (file) {
      try {
        const avatarData = await userService.update(currentUser.id, {}, file);
        const avatarUrl = avatarData.avatar;
        setAvatar(avatarUrl);
        formik.setFieldValue("avatar", avatarUrl);
        // Refetch user data to get updated avatar
        await refetch();
      } catch (uploadError) {
        console.error("Error uploading avatar:", uploadError);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/") && currentUser) {
      try {
        const avatarData = await userService.update(currentUser.id, {}, file);
        const avatarUrl = avatarData.avatar;
        setAvatar(avatarUrl);
        formik.setFieldValue("avatar", avatarUrl);
        await refetch();
      } catch (uploadError) {
        console.error("Error uploading avatar:", uploadError);
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      name: currentUser?.name ?? "",
      primaryEducation: currentUser?.primaryEducation ?? "",
      secondaryEducation: currentUser?.secondaryEducation ?? "",
      faculty: currentUser?.faculty ?? "",
      university: currentUser?.university ?? "",
      currentWork: currentUser?.currentWork ?? "",
      dateOfBirth: currentUser?.dateOfBirth ?? "",
      gender: currentUser?.gender ?? "",
      topEducation: currentUser?.topEducation ?? "",
      educationDegree: currentUser?.educationDegree ?? "",
      avatar: currentUser?.avatar ?? "",
    },
    enableReinitialize: true,

    onSubmit: (values) => {
      if (!currentUser) {
        console.error("No user data available");
        return;
      }

      userService
        .update(currentUser.id, values)
        .then(async () => {
          setIsEditing(false);
          // Refetch user data to get updated information
          await refetch();
        })
        .catch((error) => {
          console.error("Error updating user data:", error);
        });
    },
  });

  if (loading) {
    return <div className={styles.loginPage}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.loginPage}>{error}</div>;
  }

  if (!currentUser) {
    return <div className={styles.loginPage}>User not found.</div>;
  }


  return (
    <div className={styles.profilePage}>
      <PageHeader />
      <div className={styles.container}>
        <div className={styles.leftSide}>
          {currentUser && isEditing ? (
            <form onSubmit={formik.handleSubmit} className={styles.formSection}>
              <div 
                className={`${styles.avatarSection} ${isDragging ? styles.dragging : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {currentUser.avatar ? (
                  <div className={styles.avatarUpload}>
                    <div className={styles.avatarWrapper}>
                      <img
                        src={getAvatarUrl(currentUser.id, currentUser.avatar)}
                        alt="Avatar"
                        className={styles.avatar}
                      />
                      <div className={styles.avatarOverlay}>
                        <Person className={styles.uploadIcon} />
                        <span>Promeni sliku</span>
                      </div>
                    </div>
                    <label htmlFor="avatarInput" className={styles.uploadButton}>
                      <Person className={styles.buttonIcon} />
                      Promeni profilnu sliku
                    </label>
                    <input
                      type="file"
                      id="avatarInput"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </div>
                ) : (
                  <div className={styles.avatarUpload}>
                    {avatar ? (
                      <div className={styles.avatarWrapper}>
                        <img
                          src={getAvatarUrl(currentUser.id, avatar)}
                          alt="Profilna slika"
                          className={styles.avatarPreview}
                        />
                        <div className={styles.avatarOverlay}>
                          <Person className={styles.uploadIcon} />
                          <span>Promeni sliku</span>
                        </div>
                      </div>
                    ) : (
                      <div className={styles.avatarPlaceholder}>
                        <Person className={styles.placeholderIcon} />
                        <span>Dodaj profilnu sliku</span>
                      </div>
                    )}
                    <label htmlFor="avatarInput" className={styles.uploadButton}>
                      <Person className={styles.buttonIcon} />
                      {avatar ? "Promeni sliku" : "Dodaj profilnu sliku"}
                    </label>
                    <input
                      type="file"
                      id="avatarInput"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </div>
                )}
              </div>

              <div className={styles.profileDetails}>
                <div className={styles.formSection}>
                  <div className={styles.sectionHeader}>
                    <Person className={styles.sectionIcon} />
                    <h3 className={styles.sectionTitle}>Lični podaci</h3>
                  </div>
                  <div className={styles.sectionContent}>
                    <TextInput
                      label="Ime i prezime"
                      type="text"
                      value={formik.values.name}
                      onChange={formik.handleChange("name")}
                      error={formik.errors.name}
                      placeholder={currentUser.name}
                    />
                    <div className={styles.dateAndGenderWrap}>
                      <div className={styles.select}>
                        <DatePickerField
                          value={formik.values.dateOfBirth}
                          onChange={(newValue: Dayjs | null) => {
                            formik.setFieldValue(
                              "dateOfBirth",
                              newValue ? newValue.format("YYYY-MM-DD") : "",
                            );
                          }}
                          label="Datum rodjenja"
                        />
                      </div>
                      <SelectField
                        label="Pol"
                        value={formik.values.gender}
                        onChange={(event) =>
                          formik.setFieldValue("gender", event.target.value)
                        }
                        options={["Muški", "Ženski"]}
                        error={Boolean(formik.errors.gender)}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.formSection}>
                  <div className={styles.sectionHeader}>
                    <School className={styles.sectionIcon} />
                    <h3 className={styles.sectionTitle}>Obrazovanje</h3>
                  </div>
                  <div className={styles.sectionContent}>
                    <TextInput
                      label="Osnovna škola"
                      type="text"
                      value={formik.values.primaryEducation}
                      onChange={formik.handleChange("primaryEducation")}
                      error={formik.errors.primaryEducation}
                      placeholder={currentUser.primaryEducation || "Osnovna škola"}
                    />
                    <TextInput
                      label="Srednja škola"
                      type="text"
                      value={formik.values.secondaryEducation}
                      onChange={formik.handleChange("secondaryEducation")}
                      error={formik.errors.secondaryEducation}
                      placeholder={
                        currentUser.secondaryEducation || "Srednja škola"
                      }
                    />
                    <SelectField
                      label="Visoko obrazovanje"
                      value={formik.values.topEducation}
                      onChange={(event) =>
                        formik.setFieldValue("topEducation", event.target.value)
                      }
                      options={["Fakultet", "Viša škola"]}
                      error={Boolean(formik.errors.topEducation)}
                    />
                    <TextInput
                      label={"Fakultet"}
                      type="text"
                      value={formik.values.faculty}
                      onChange={formik.handleChange("faculty")}
                      error={formik.errors.faculty}
                      placeholder={currentUser.faculty || "Fakultet"}
                    />
                    <TextInput
                      label={"Univerzitet"}
                      type="text"
                      value={formik.values.university}
                      onChange={formik.handleChange("university")}
                      error={formik.errors.university}
                      placeholder={currentUser.university || "Univerzitet"}
                    />
                    <SelectField
                      label="Stepen studija"
                      value={formik.values.educationDegree}
                      onChange={(event) =>
                        formik.setFieldValue("educationDegree", event.target.value)
                      }
                      options={[
                        "Akademske studije",
                        "Strukovne studije",
                        "Master akademske studije",
                        "Master strukovne studije",
                        "Specijalističke akademske studije",
                        "Doktorske studije",
                      ]}
                      error={Boolean(formik.errors.educationDegree)}
                    />
                  </div>
                </div>

                <div className={styles.formSection}>
                  <div className={styles.sectionHeader}>
                    <Work className={styles.sectionIcon} />
                    <h3 className={styles.sectionTitle}>Zaposlenje</h3>
                  </div>
                  <div className={styles.sectionContent}>
                    <TextInput
                      label="Trenutno zaposlenje"
                      type="text"
                      value={formik.values.currentWork}
                      onChange={formik.handleChange("currentWork")}
                      error={formik.errors.currentWork}
                      placeholder={
                        currentUser.currentWork || "Trenutno zaposlenje"
                      }
                    />
                  </div>
                </div>
              </div>
              <div className={styles.buttonWrapper}>
                <Button
                  title={"Otkaži"}
                  themes={["standardHeight", "standardWide", "white"]}
                  type={"button"}
                  onClick={() => {
                    setIsEditing(false);
                    formik.resetForm();
                  }}
                />
                <Button
                  title={"Sačuvaj"}
                  themes={["standardHeight", "standardWide", "blue"]}
                  type={"submit"}
                />
              </div>
            </form>
          ) : (
            <div className={styles.profileCard}>
              <div className={styles.avatarSection}>
                <div className={styles.editButtonWrapper}>
                  <button 
                    className={styles.editButton}
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className={styles.editIcon} />
                    <span>Uredi profil</span>
                  </button>
                </div>
                {currentUser.avatar ? (
                  <img
                    src={getAvatarUrl(currentUser.id, currentUser.avatar)}
                    alt="Avatar"
                    className={styles.image}
                  />
                ) : currentUser.gender === "Muški" ? (
                  <img
                    src="/muskarac.png"
                    alt="muskarac"
                    className={styles.image}
                  />
                ) : (
                  <img src="/zena.png" alt="zena" className={styles.image} />
                )}
              </div>

              <div className={styles.profileDetails}>
                <div className={styles.infoCard}>
                  <div className={styles.infoCardHeader}>
                    <Person className={styles.infoCardIcon} />
                    <h3 className={styles.infoCardTitle}>Lični podaci</h3>
                  </div>
                  <div className={styles.infoCardContent}>
                    <ProfileInfoDescription
                      title={"Ime i prezime:"}
                      description={currentUser.name}
                    />
                    <ProfileInfoDescription
                      title="Datum rođenja:"
                      description={
                        currentUser.dateOfBirth
                          ? dayjs(currentUser.dateOfBirth).format("DD.MM.YYYY")
                          : "Nije navedeno"
                      }
                    />
                    <ProfileInfoDescription
                      title={"Pol:"}
                      description={currentUser.gender || "Nije navedeno"}
                    />
                  </div>
                </div>

                <div className={styles.infoCard}>
                  <div className={styles.infoCardHeader}>
                    <School className={styles.infoCardIcon} />
                    <h3 className={styles.infoCardTitle}>Obrazovanje</h3>
                  </div>
                  <div className={styles.infoCardContent}>
                    {currentUser.primaryEducation && (
                      <ProfileInfoDescription
                        title={"Osnovna škola:"}
                        description={currentUser.primaryEducation}
                      />
                    )}
                    {currentUser.secondaryEducation && (
                      <ProfileInfoDescription
                        title={"Srednja škola:"}
                        description={currentUser.secondaryEducation}
                      />
                    )}
                    {currentUser.topEducation && (
                      <ProfileInfoDescription
                        title={"Visoko obrazovanje:"}
                        description={currentUser.topEducation}
                      />
                    )}
                    {currentUser.faculty && (
                      <ProfileInfoDescription
                        title={"Fakultet:"}
                        description={currentUser.faculty}
                      />
                    )}
                    {currentUser.university && (
                      <ProfileInfoDescription
                        title={"Univerzitet:"}
                        description={currentUser.university}
                      />
                    )}
                    {currentUser.educationDegree && (
                      <ProfileInfoDescription
                        title={"Stepen studija:"}
                        description={currentUser.educationDegree}
                      />
                    )}
                  </div>
                </div>

                <div className={styles.infoCard}>
                  <div className={styles.infoCardHeader}>
                    <Work className={styles.infoCardIcon} />
                    <h3 className={styles.infoCardTitle}>Zaposlenje</h3>
                  </div>
                  <div className={styles.infoCardContent}>
                    <ProfileInfoDescription
                      title={"Trenutno zaposlenje:"}
                      description={currentUser.currentWork || "Nije navedeno"}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
