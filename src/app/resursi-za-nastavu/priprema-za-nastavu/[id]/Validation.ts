import * as Yup from "yup";

export const lessonPlanValidationSchema = Yup.object().shape({
  date: Yup.string().required("Datum je obavezan"),
  class_number: Yup.string().required("Broj časa je obavezan"),
  grade_and_class: Yup.string().required("Razred i odeljenje su obavezni"),
  teaching_topic: Yup.string().required("Tema časa je obavezna"),
  lesson_name: Yup.string().required("Naziv časa je obavezan"),
  previous_lesson: Yup.string().required("Prethodni čas je obavezan"),
  next_lesson: Yup.string().required("Sledeći čas je obavezan"),
  type_of_lesson: Yup.string().required("Tip časa je obavezan"),
  educational_objectives: Yup.string().required(
    "Obrazovni ciljevi su obavezni",
  ),
  social_objectives: Yup.string().required("Socijalni ciljevi su obavezni"),
  functional_objectives: Yup.string().required(
    "Funkcionalni ciljevi su obavezni",
  ),
  teaching_methods: Yup.string().required("Metode nastave su obavezne"),
  forms_of_work: Yup.string().required("Oblici rada su obavezni"),
  instructional_materials: Yup.string().required(
    "Nastavna sredstva su obavezna",
  ),
  correlation: Yup.string().required("Korelacija je obavezna"),
  literature: Yup.string().required("Literatura je obavezna"),
  introduction_small: Yup.string().required("Uvod (kratak) je obavezan"),
  main_activity_small: Yup.string().required(
    "Glavna aktivnost (kratko) je obavezna",
  ),
  conclusion_small: Yup.string().required("Zaključak (kratko) je obavezan"),
  introduction: Yup.string().required("Uvod je obavezan"),
  main: Yup.string().required("Glavni deo je obavezan"),
  conclusion: Yup.string().required("Zaključak je obavezan"),
  subject: Yup.string().required("Predmet je obavezan"),
  user: Yup.string().required("Korisnik nije validan"),
});
