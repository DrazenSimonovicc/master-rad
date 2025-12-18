import * as Yup from "yup";

export const TestSubjectValidationSchema = Yup.object({
  subject: Yup.string()
    .required("Naziv predmeta je obavezan")
    .min(2, "Predmet mora imati bar 2 slova"),
  grade: Yup.string().required("Razred je obavezan"),
});
