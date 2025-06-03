"use client";
import { FC, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";
import { pb } from "@/libs/pocketbase";
import { useFetchUserData } from "@/Hooks/getUserData";
import { userDataType } from "@/Interfaces/BaseType";
import { Header } from "@/Components/Header/Header";
import TextInput from "@/Components/Inputs/TextInput/TextInput";
import {
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { Button } from "@/Components/Button";
import { Title } from "@/Components/Texts/Title";

//TODO:padding na label

const Page: FC = () => {
  const { userData, error, loading } = useFetchUserData();
  const [currentUser, setCurrentUser] = useState<userDataType | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loggedInUser = pb.authStore.record;
    if (loggedInUser && userData) {
      const specificUser = userData.find((user) => user.id === loggedInUser.id);

      setCurrentUser(specificUser || null);
    }
  }, [userData]);

  const validationSchema = Yup.object({
    name: Yup.string().required("Ime i prezime je obavezno"),
    current_work: Yup.string().required("Trenutno radno mesto je obavezno"),
    gender: Yup.string().required("Pol je obavezan"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      current_work: "",
      date_of_birth: "",
      gender: "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      if (!currentUser) {
        console.error("No user data available");
        return;
      }

      if (currentUser.id != null) {
        pb.collection("users")
          .update(currentUser.id, {
            ...values,
          })
          .then(() => {
            setCurrentUser({
              ...currentUser,
              name: values.name,
              current_work: values.current_work,
              date_of_birth: values.date_of_birth,
              gender: values.gender,
            });
            router.push("/");
          })
          .catch((error) => {
            console.error("Error updating user data:", error);
          });
      }
    },
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <Header
        title={"Podaci o korisniku"}
        imageUrl={"/forum-4.jpg"}
        breadcrumbItems={{
          level1: "Početak",
          level2: "Podaci o korisniku",
          level1url: "/",
          level2url: "/podaci-o-korisniku",
        }}
      />
      <div className={styles.profilePage}>
        <Title text={"Podaci o korisniku"} level={1} />

        <form onSubmit={formik.handleSubmit}>
          <TextInput
            label="Ime i prezime"
            type="text"
            value={formik.values.name}
            onChange={formik.handleChange("name")}
            error={formik.errors.name}
            placeholder="Unesite ime i prezime"
          />

          <TextInput
            label="Trenutno radno mesto"
            type="text"
            value={formik.values.current_work}
            onChange={formik.handleChange("current_work")}
            error={formik.errors.current_work}
            placeholder="Unesite trenutno radno mesto"
          />

          <div className={styles.dateWrapper}>
            <div className={styles.date}>
              <span className={styles.label}>Datum rodjenja</span>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    value={
                      formik.values.date_of_birth
                        ? dayjs(formik.values.date_of_birth)
                        : null
                    }
                    onChange={(newValue: Dayjs | null) => {
                      formik.setFieldValue(
                        "date_of_birth",
                        newValue ? newValue.format("YYYY-MM-DD") : "",
                      );
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
              <span className={styles.errorText}>
                {formik.errors.date_of_birth}
              </span>
            </div>
            <div className={styles.date}>
              <span className={styles.label}>Pol</span>
              <FormControl fullWidth>
                <Select
                  value={formik.values.gender}
                  onChange={(event: SelectChangeEvent) => {
                    formik.setFieldValue("gender", event.target.value);
                  }}
                  error={Boolean(formik.errors.gender)}
                >
                  <MenuItem value="muški">Muški</MenuItem>
                  <MenuItem value="ženski">Ženski</MenuItem>
                </Select>
              </FormControl>
              <span className={styles.errorText}>{formik.errors.gender}</span>
            </div>
          </div>
          <div className={styles.buttonWrapper}>
            <Button
              themes={["standardHeight", "standardWide", "blue"]}
              title={"Unesi podatke"}
              type={"submit"}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
