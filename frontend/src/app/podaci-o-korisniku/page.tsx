"use client";

import dayjs, { Dayjs } from "dayjs";
import { FC, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { Button } from "@/Components/Button";
import { PageHeader } from "@/Components/Navigation/PageHeader";
import TextInput from "@/Components/Inputs/TextInput/TextInput";
import DatePickerField from "@/Components/DatePicker/DatePicker";
import SelectField from "@/Components/Inputs/SelectField/SelectField";
import { useFetchCurrentUser } from "@/Hooks/getCurrentUser";
import { userDataType } from "@/Interfaces/BaseType";
import { userService } from "@/libs/api";
import { PersonValidationSchema } from "@/app/podaci-o-korisniku/Validation";
import {
  Person,
  Work,
  CalendarToday,
} from "@mui/icons-material";
import styles from "./page.module.scss";

//TODO:padding na label

const Page: FC = () => {
  const { userData: currentUser, error, loading } = useFetchCurrentUser();
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      name: currentUser?.name || "",
      currentWork: currentUser?.currentWork || "",
      dateOfBirth: currentUser?.dateOfBirth || "",
      gender: currentUser?.gender || "",
    },
    enableReinitialize: true,
    validationSchema: PersonValidationSchema,
    onSubmit: (values) => {
      if (!currentUser) {
        console.error("No user data available");
        return;
      }

      if (currentUser.id != null) {
        userService
          .update(currentUser.id, values)
          .then(() => {
            router.push("/");
          })
          .catch((error) => {
            console.error("Error updating user data:", error);
          });
      }
    },
  });

  if (loading) {
    return <div className={styles.loadingPage}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.errorPage}>{error}</div>;
  }

  return (
    <div className={styles.profilePage}>
      <PageHeader />
      <div className={styles.container}>
        <div className={styles.leftSide}>
          <h1 className={styles.pageTitle}>Podaci o korisniku</h1>

          <form onSubmit={formik.handleSubmit} className={styles.formSection}>
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
                    placeholder="Unesite ime i prezime"
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
                  <Work className={styles.sectionIcon} />
                  <h3 className={styles.sectionTitle}>Zaposlenje</h3>
                </div>
                <div className={styles.sectionContent}>
                  <TextInput
                    label="Trenutno radno mesto"
                    type="text"
                    value={formik.values.currentWork}
                    onChange={formik.handleChange("currentWork")}
                    error={formik.errors.currentWork}
                    placeholder="Unesite trenutno radno mesto"
                  />
                </div>
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
    </div>
  );
};

export default Page;
