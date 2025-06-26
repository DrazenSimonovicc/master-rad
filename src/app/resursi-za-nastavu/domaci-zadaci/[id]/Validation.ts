import * as Yup from "yup";

export const HomeworkValidationSchema = Yup.object().shape({
  teaching_unit: Yup.string().required("Naziv nastavne jedinice je obavezan"),
  tasks: Yup.array()
    .of(Yup.string().required("Zadatak ne sme biti prazan"))
    .min(1, "Potrebno je uneti bar jedan zadatak"),
});
