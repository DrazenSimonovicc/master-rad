import * as Yup from "yup";

const MAX_SUBJECTS = 7;
export const classScheduleValidationSchema = Yup.object().shape({
  dayName: Yup.string().required("Naziv dana je obavezno polje"),
  subject: Yup.array()
    .of(Yup.string().trim().required("Predmet ne može biti prazan"))
    .min(1, "Unesite bar jedan predmet")
    .max(MAX_SUBJECTS, `Maksimalno ${MAX_SUBJECTS} predmeta po danu`),
});

export const activityValidationSchema = Yup.object().shape({
  type_of_activity: Yup.string()
    .trim()
    .required("Vrsta aktivnosti je obavezna"),
  title: Yup.string().trim().required("Naslov je obavezan"),
  description: Yup.string().required("Opis je obavezan"),
  date: Yup.string().required("Datum je obavezan"),
  place: Yup.string().trim(),
});
