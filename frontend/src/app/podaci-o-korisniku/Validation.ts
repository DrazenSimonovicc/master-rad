import * as Yup from "yup";

export const PersonValidationSchema = Yup.object({
  name: Yup.string().required("Ime i prezime je obavezno"),
  currentWork: Yup.string().required("Trenutno radno mesto je obavezno"),
  gender: Yup.string().required("Pol je obavezan"),
});
