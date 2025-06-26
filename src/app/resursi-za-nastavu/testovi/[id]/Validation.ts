import * as Yup from "yup";

export const testValidationSchema = Yup.object().shape({
  teaching_unit: Yup.string()
    .trim()
    .required("Naziv nastavne oblasti je obavezno polje"),
  date: Yup.string().trim().required("Datum održavanja testa je obavezan"),
  tasks: Yup.array()
    .of(Yup.string().trim().required("Zadatak ne može biti prazan"))
    .min(1, "Potrebno je uneti bar jedan zadatak"),
});
