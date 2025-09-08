"use client";

import dayjs, { Dayjs } from "dayjs";
import React, { FC, useEffect, useState } from "react";
import { useFormik } from "formik";
import { Button } from "@/Components/Button";
import { EditButton } from "@/Components/Button/EditButton/EditButton";
import DatePickerField from "@/Components/DatePicker/DatePicker";
import { Footer } from "@/Components/Footer";
import { Header } from "@/Components/Header/Header";
import SelectField from "@/Components/Inputs/SelectField/SelectField";
import TextInput from "@/Components/Inputs/TextInput/TextInput";
import { ProfileInfoDescription } from "@/Components/ProfileInfoDescription/ProfileInfoDescription";
import { useFetchUserData } from "@/Hooks/getUserData";
import { userDataType } from "@/Interfaces/BaseType";
import { pb } from "@/libs/pocketbase";
import styles from "./page.module.scss";

const ProfilePage: FC = () => {
  const { userData, error, loading } = useFetchUserData();
  const [currentUser, setCurrentUser] = useState<userDataType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState<string>(currentUser?.avatar || "");

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files ? event.target.files[0] : null;

    if (!file || !currentUser) return;

    if (file) {
      try {
        const avatarData = await pb.collection("users").update(currentUser.id, {
          avatar: file,
        });

        const avatarUrl = avatarData.avatar;
        setAvatar(avatarUrl);

        formik.setFieldValue("avatar", avatarUrl);
      } catch (uploadError) {
        console.error("Error uploading avatar:", uploadError);
      }
    }
  };

  useEffect(() => {
    const loggedInUser = pb.authStore.record;
    if (loggedInUser && userData) {
      const specificUser = userData.find((user) => user.id === loggedInUser.id);
      setCurrentUser(specificUser || null);
    }
  }, [userData]);

  const formik = useFormik({
    initialValues: {
      name: currentUser?.name ?? "",
      primaryEducation: currentUser?.primaryEducation ?? "",
      secondaryEducation: currentUser?.secondaryEducation ?? "",
      faculty: currentUser?.faculty ?? "",
      university: currentUser?.university ?? "",
      current_work: currentUser?.current_work ?? "",
      date_of_birth: currentUser?.date_of_birth ?? "",
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

      pb.collection("users")
        .update(currentUser.id, {
          ...values,
        })
        .then(() => {
          setIsEditing(false);
          setCurrentUser({
            ...currentUser,
            name: values.name,
            primaryEducation: values.primaryEducation,
            secondaryEducation: values.secondaryEducation,
            faculty: values.faculty,
            current_work: values.current_work,
            date_of_birth: values.date_of_birth,
            gender: values.gender,
            topEducation: values.topEducation,
            educationDegree: values.educationDegree,
            university: values.university,
            avatar: values.avatar,
          });
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

  const breadCrumb = {
    level1: "Početak",
    level2: "Profil",
    level1url: "/",
    level2url: "/profil",
  };

  return (
    <div className={styles.profilePage}>
      <Header
        title={"Profil"}
        imageUrl={"/forum-4.jpg"}
        breadcrumbItems={breadCrumb}
      />
      <div className={styles.container}>
        <div className={styles.leftSide}>
          <div className={styles.a}>
            <EditButton
              onClick={() => setIsEditing(true)}
              title={"Uredi profil"}
            />
          </div>
          {currentUser && isEditing ? (
            <form onSubmit={formik.handleSubmit}>
              <div className={styles.profileDetails}>
                {currentUser.avatar ? (
                  <div className={styles.avatarUpload}>
                    <img
                      src={`http://127.0.0.1:8090/api/files/_pb_users_auth_/${currentUser.id}/${currentUser.avatar}`}
                      alt="Avatar"
                      className={styles.avatar}
                    />
                  </div>
                ) : (
                  <div className={styles.avatarUpload}>
                    <label>Dodaj profilnu sliku</label>
                    {avatar && (
                      <img
                        src={`http://127.0.0.1:8090/api/files/_pb_users_auth_/${currentUser.id}/${avatar}`}
                        alt="Profilna slika"
                        className={styles.avatar}
                      />
                    )}
                    <input
                      type="file"
                      id="avatarInput"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </div>
                )}

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
                      value={formik.values.date_of_birth}
                      onChange={(newValue: Dayjs | null) => {
                        formik.setFieldValue(
                          "date_of_birth",
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
                <TextInput
                  label="Trenutno zaposlenje"
                  type="text"
                  value={formik.values.current_work}
                  onChange={formik.handleChange("current_work")}
                  error={formik.errors.current_work}
                  placeholder={
                    currentUser.current_work || "Trenutno zaposlenje"
                  }
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
              <div className={styles.buttonWrapper}>
                <Button
                  title={"Sačuvaj"}
                  themes={["standardHeight", "standardWide", "blue"]}
                  type={"submit"}
                />
              </div>
            </form>
          ) : (
            <div className={styles.profileDetails}>
              <div className={styles.imageWrapper}>
                {currentUser.avatar ? (
                  <img
                    src={`http://127.0.0.1:8090/api/files/_pb_users_auth_/${currentUser.id}/${currentUser.avatar}`}
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

              <ProfileInfoDescription
                title={"Ime i prezime:"}
                description={currentUser.name}
              />
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

              <ProfileInfoDescription
                title={"Trenutno zaposlenje:"}
                description={currentUser.current_work}
              />

              <ProfileInfoDescription
                title="Datum rođenja:"
                description={
                  currentUser.date_of_birth
                    ? dayjs(currentUser.date_of_birth).format("DD.MM.YYYY")
                    : "Datum rođenja"
                }
              />

              <ProfileInfoDescription
                title={"Pol:"}
                description={currentUser.gender}
              />
            </div>
          )}
        </div>
        <aside className={styles.sidebarWrap}>
          <div></div>
        </aside>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
