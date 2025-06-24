import * as Yup from "yup";

export const ForumNewsValidationSchema = Yup.object({
  title: Yup.string().required("Naslov vesti je obavezan."),
  text: Yup.string().required("Tekst vesti je obavezan."),
});
