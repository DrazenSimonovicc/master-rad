import * as Yup from "yup";

export const OperativeValidationSchema = Yup.object({
  subject: Yup.string()
    .required("Naziv predmeta je obavezan.")
    .min(2, "Predmet mora imati bar 2 slova."),
  grade: Yup.string().required("Razred je obavezan."),
  month: Yup.string().required("Mesec je obavezan."),
  school_year: Yup.string().required("Školska godina je obavezna."),
});

export const GlobalValidationSchema = Yup.object({
  subject: Yup.string()
    .required("Naziv predmeta je obavezan.")
    .min(2, "Predmet mora imati bar 2 slova."),
  grade: Yup.string().required("Razred je obavezan."),
  school_year: Yup.string().required("Školska godina je obavezna."),
});
