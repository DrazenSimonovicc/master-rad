// components/LessonFormFields.tsx

import React from "react";
import { TextField } from "@mui/material";

import styles from "./LessonFormFields.module.scss";
import { LessonConfig } from "@/app/resursi-za-nastavu/priprema-za-nastavu/config";
import { testConfig } from "@/app/resursi-za-nastavu/testovi/config";
import TextEditorWithLabel from "@/Components/Texts/TextEditorWithLabel/TextEditorWithLabel";
import { Button } from "@/Components/Button";

type Props = {
  formikLessonPlan: any;
};

const LessonFormFields: React.FC<Props> = ({ formikLessonPlan }) => {
  return (
    <form onSubmit={formikLessonPlan.handleSubmit} className={styles.form}>
      <span
        style={{
          fontWeight: "bold",
          fontSize: "20px",
          marginTop: "20px",
        }}
      >
        Opšti podaci
      </span>
      <TextField
        label={LessonConfig.date.label}
        placeholder={testConfig.date.placeholder}
        variant="outlined"
        fullWidth
        margin="normal"
        name="date"
        value={formikLessonPlan.values.date}
        onChange={formikLessonPlan.handleChange}
        error={
          formikLessonPlan.touched.date && Boolean(formikLessonPlan.errors.date)
        }
        helperText={
          formikLessonPlan.touched.date && formikLessonPlan.errors.date
        }
      />

      <TextField
        label={LessonConfig.class_number.label}
        placeholder={LessonConfig.class_number.placeholder}
        variant="outlined"
        fullWidth
        margin="normal"
        name="class_number"
        value={formikLessonPlan.values.class_number}
        onChange={formikLessonPlan.handleChange}
        error={
          formikLessonPlan.touched.class_number &&
          Boolean(formikLessonPlan.errors.class_number)
        }
        helperText={
          formikLessonPlan.touched.class_number &&
          formikLessonPlan.errors.class_number
        }
      />
      <TextField
        label={LessonConfig.grade_and_class.label}
        placeholder={LessonConfig.grade_and_class.placeholder}
        variant="outlined"
        fullWidth
        margin="normal"
        name="grade_and_class"
        value={formikLessonPlan.values.grade_and_class}
        onChange={formikLessonPlan.handleChange}
        error={
          formikLessonPlan.touched.grade_and_class &&
          Boolean(formikLessonPlan.errors.grade_and_class)
        }
        helperText={
          formikLessonPlan.touched.grade_and_class &&
          formikLessonPlan.errors.grade_and_class
        }
      />
      <span
        style={{
          fontWeight: "bold",
          fontSize: "20px",
          marginTop: "20px",
        }}
      >
        Opšti metodički podaci
      </span>
      <TextField
        label={LessonConfig.subject.label}
        placeholder={LessonConfig.subject.placeholder}
        variant="outlined"
        fullWidth
        margin="normal"
        name="subject"
        value={formikLessonPlan.values.subject}
        onChange={formikLessonPlan.handleChange}
        error={
          formikLessonPlan.touched.subject &&
          Boolean(formikLessonPlan.errors.subject)
        }
        helperText={
          formikLessonPlan.touched.subject && formikLessonPlan.errors.subject
        }
      />
      <TextField
        label={LessonConfig.teaching_topic.label}
        placeholder={LessonConfig.teaching_topic.placeholder}
        variant="outlined"
        fullWidth
        margin="normal"
        name="teaching_topic"
        value={formikLessonPlan.values.teaching_topic}
        onChange={formikLessonPlan.handleChange}
        error={
          formikLessonPlan.touched.teaching_topic &&
          Boolean(formikLessonPlan.errors.teaching_topic)
        }
        helperText={
          formikLessonPlan.touched.teaching_topic &&
          formikLessonPlan.errors.teaching_topic
        }
      />
      <TextField
        label={LessonConfig.lesson_name.label}
        placeholder={LessonConfig.lesson_name.placeholder}
        variant="outlined"
        fullWidth
        margin="normal"
        name="lesson_name"
        value={formikLessonPlan.values.lesson_name}
        onChange={formikLessonPlan.handleChange}
        error={
          formikLessonPlan.touched.lesson_name &&
          Boolean(formikLessonPlan.errors.lesson_name)
        }
        helperText={
          formikLessonPlan.touched.lesson_name &&
          formikLessonPlan.errors.lesson_name
        }
      />
      <TextField
        label={LessonConfig.previous_lesson.label}
        placeholder={LessonConfig.previous_lesson.placeholder}
        variant="outlined"
        fullWidth
        margin="normal"
        name="previous_lesson"
        value={formikLessonPlan.values.previous_lesson}
        onChange={formikLessonPlan.handleChange}
        error={
          formikLessonPlan.touched.previous_lesson &&
          Boolean(formikLessonPlan.errors.previous_lesson)
        }
        helperText={
          formikLessonPlan.touched.previous_lesson &&
          formikLessonPlan.errors.previous_lesson
        }
      />

      <TextField
        label={LessonConfig.next_lesson.label}
        placeholder={LessonConfig.next_lesson.placeholder}
        variant="outlined"
        fullWidth
        margin="normal"
        name="next_lesson"
        value={formikLessonPlan.values.next_lesson}
        onChange={formikLessonPlan.handleChange}
        error={
          formikLessonPlan.touched.next_lesson &&
          Boolean(formikLessonPlan.errors.next_lesson)
        }
        helperText={
          formikLessonPlan.touched.next_lesson &&
          formikLessonPlan.errors.next_lesson
        }
      />
      <TextField
        label={LessonConfig.type_of_lesson.label}
        placeholder={LessonConfig.type_of_lesson.placeholder}
        variant="outlined"
        fullWidth
        margin="normal"
        name="type_of_lesson"
        value={formikLessonPlan.values.type_of_lesson}
        onChange={formikLessonPlan.handleChange}
        error={
          formikLessonPlan.touched.type_of_lesson &&
          Boolean(formikLessonPlan.errors.type_of_lesson)
        }
        helperText={
          formikLessonPlan.touched.type_of_lesson &&
          formikLessonPlan.errors.type_of_lesson
        }
      />
      <span
        style={{
          fontWeight: "bold",
          fontSize: "20px",
          marginTop: "20px",
        }}
      >
        Operativni zadaci
      </span>
      <TextField
        label={LessonConfig.educational_objectives.label}
        placeholder={LessonConfig.educational_objectives.placeholder}
        variant="outlined"
        fullWidth
        margin="normal"
        name="educational_objectives"
        value={formikLessonPlan.values.educational_objectives}
        onChange={formikLessonPlan.handleChange}
        error={
          formikLessonPlan.touched.educational_objectives &&
          Boolean(formikLessonPlan.errors.educational_objectives)
        }
        helperText={
          formikLessonPlan.touched.educational_objectives &&
          formikLessonPlan.errors.educational_objectives
        }
      />
      <TextField
        label={LessonConfig.social_objectives.label}
        placeholder={LessonConfig.social_objectives.placeholder}
        variant="outlined"
        fullWidth
        margin="normal"
        name="social_objectives"
        value={formikLessonPlan.values.social_objectives}
        onChange={formikLessonPlan.handleChange}
        error={
          formikLessonPlan.touched.social_objectives &&
          Boolean(formikLessonPlan.errors.social_objectives)
        }
        helperText={
          formikLessonPlan.touched.social_objectives &&
          formikLessonPlan.errors.social_objectives
        }
      />
      <TextField
        label={LessonConfig.functional_objectives.label}
        placeholder={LessonConfig.functional_objectives.placeholder}
        variant="outlined"
        fullWidth
        margin="normal"
        name="functional_objectives"
        value={formikLessonPlan.values.functional_objectives}
        onChange={formikLessonPlan.handleChange}
        error={
          formikLessonPlan.touched.functional_objectives &&
          Boolean(formikLessonPlan.errors.functional_objectives)
        }
        helperText={
          formikLessonPlan.touched.functional_objectives &&
          formikLessonPlan.errors.functional_objectives
        }
      />
      <TextField
        label={LessonConfig.teaching_methods.label}
        placeholder={LessonConfig.teaching_methods.placeholder}
        variant="outlined"
        fullWidth
        margin="normal"
        name="teaching_methods"
        value={formikLessonPlan.values.teaching_methods}
        onChange={formikLessonPlan.handleChange}
        error={
          formikLessonPlan.touched.teaching_methods &&
          Boolean(formikLessonPlan.errors.teaching_methods)
        }
        helperText={
          formikLessonPlan.touched.teaching_methods &&
          formikLessonPlan.errors.teaching_methods
        }
      />
      <TextField
        label={LessonConfig.forms_of_work.label}
        placeholder={LessonConfig.forms_of_work.placeholder}
        variant="outlined"
        fullWidth
        margin="normal"
        name="forms_of_work"
        value={formikLessonPlan.values.forms_of_work}
        onChange={formikLessonPlan.handleChange}
        error={
          formikLessonPlan.touched.forms_of_work &&
          Boolean(formikLessonPlan.errors.forms_of_work)
        }
        helperText={
          formikLessonPlan.touched.forms_of_work &&
          formikLessonPlan.errors.forms_of_work
        }
      />
      <TextField
        label={LessonConfig.instructional_materials.label}
        placeholder={LessonConfig.instructional_materials.placeholder}
        variant="outlined"
        fullWidth
        margin="normal"
        name="instructional_materials"
        value={formikLessonPlan.values.instructional_materials}
        onChange={formikLessonPlan.handleChange}
        error={
          formikLessonPlan.touched.instructional_materials &&
          Boolean(formikLessonPlan.errors.instructional_materials)
        }
        helperText={
          formikLessonPlan.touched.instructional_materials &&
          formikLessonPlan.errors.instructional_materials
        }
      />
      <TextField
        label={LessonConfig.correlation.label}
        placeholder={LessonConfig.correlation.placeholder}
        variant="outlined"
        fullWidth
        margin="normal"
        name="correlation"
        value={formikLessonPlan.values.correlation}
        onChange={formikLessonPlan.handleChange}
        error={
          formikLessonPlan.touched.correlation &&
          Boolean(formikLessonPlan.errors.correlation)
        }
        helperText={
          formikLessonPlan.touched.correlation &&
          formikLessonPlan.errors.correlation
        }
      />
      <TextField
        label={LessonConfig.literature.label}
        placeholder={LessonConfig.literature.placeholder}
        variant="outlined"
        fullWidth
        margin="normal"
        name="literature"
        value={formikLessonPlan.values.literature}
        onChange={formikLessonPlan.handleChange}
        error={
          formikLessonPlan.touched.literature &&
          Boolean(formikLessonPlan.errors.literature)
        }
        helperText={
          formikLessonPlan.touched.literature &&
          formikLessonPlan.errors.literature
        }
      />
      <span
        style={{
          fontWeight: "bold",
          fontSize: "20px",
          marginTop: "20px",
        }}
      >
        Struktura časa
      </span>
      <TextField
        label={LessonConfig.introduction_small.label}
        placeholder={LessonConfig.introduction_small.placeholder}
        variant="outlined"
        fullWidth
        margin="normal"
        name="introduction_small"
        value={formikLessonPlan.values.introduction_small}
        onChange={formikLessonPlan.handleChange}
        error={
          formikLessonPlan.touched.introduction_small &&
          Boolean(formikLessonPlan.errors.introduction_small)
        }
        helperText={
          formikLessonPlan.touched.introduction_small &&
          formikLessonPlan.errors.introduction_small
        }
      />
      <TextField
        label={LessonConfig.main_activity_small.label}
        placeholder={LessonConfig.main_activity_small.placeholder}
        variant="outlined"
        fullWidth
        margin="normal"
        name="main_activity_small"
        value={formikLessonPlan.values.main_activity_small}
        onChange={formikLessonPlan.handleChange}
        error={
          formikLessonPlan.touched.main_activity_small &&
          Boolean(formikLessonPlan.errors.main_activity_small)
        }
        helperText={
          formikLessonPlan.touched.main_activity_small &&
          formikLessonPlan.errors.main_activity_small
        }
      />
      <TextField
        label={LessonConfig.conclusion_small.label}
        placeholder={LessonConfig.conclusion_small.placeholder}
        variant="outlined"
        fullWidth
        margin="normal"
        name="conclusion_small"
        value={formikLessonPlan.values.conclusion_small}
        onChange={formikLessonPlan.handleChange}
        error={
          formikLessonPlan.touched.conclusion_small &&
          Boolean(formikLessonPlan.errors.conclusion_small)
        }
        helperText={
          formikLessonPlan.touched.conclusion_small &&
          formikLessonPlan.errors.conclusion_small
        }
      />
      <span
        style={{
          fontWeight: "bold",
          fontSize: "20px",
          margin: "20px 0",
        }}
      >
        Razrada toka časa
      </span>
      <TextEditorWithLabel
        index={0}
        task={formikLessonPlan.values.introduction}
        onChange={(value) =>
          formikLessonPlan.setFieldValue("introduction", value)
        }
        label={LessonConfig.introduction.label}
        error={
          formikLessonPlan.touched.introduction &&
          formikLessonPlan.errors.introduction
            ? formikLessonPlan.errors.introduction
            : undefined
        }
      />

      <TextEditorWithLabel
        index={1}
        task={formikLessonPlan.values.main}
        onChange={(value) => formikLessonPlan.setFieldValue("main", value)}
        label={LessonConfig.main.label}
        error={
          formikLessonPlan.touched.main && formikLessonPlan.errors.main
            ? formikLessonPlan.errors.main
            : undefined
        }
      />

      <TextEditorWithLabel
        index={2}
        task={formikLessonPlan.values.conclusion}
        onChange={(value) =>
          formikLessonPlan.setFieldValue("conclusion", value)
        }
        label={LessonConfig.conclusion.label}
        error={
          formikLessonPlan.touched.conclusion &&
          formikLessonPlan.errors.conclusion
            ? formikLessonPlan.errors.conclusion
            : undefined
        }
      />

      <div style={{ marginTop: "60px" }}>
        <Button
          title="Dodaj pripremu za čas"
          themes={[
            "blue",
            "standardWide",
            "standardHeight",
            "noBorderRadius",
            "maxWidth",
          ]}
          type={"submit"}
        />
      </div>
    </form>
  );
};

export default LessonFormFields;
