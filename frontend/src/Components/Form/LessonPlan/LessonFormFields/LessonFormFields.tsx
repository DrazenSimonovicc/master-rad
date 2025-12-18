import React from "react";
import { TextField } from "@mui/material";
import { Button } from "@/Components/Button";
import TextEditorWithLabel from "@/Components/Texts/TextEditorWithLabel/TextEditorWithLabel";
import { LessonConfig } from "@/app/resursi-za-nastavu/priprema-za-nastavu/config";
import { testConfig } from "@/app/resursi-za-nastavu/testovi/config";
import styles from "./LessonFormFields.module.scss";

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
        label={LessonConfig.classNumber.label}
        placeholder={LessonConfig.classNumber.placeholder}
        variant="outlined"
        fullWidth
        margin="normal"
        name="classNumber"
        value={formikLessonPlan.values.classNumber}
        onChange={formikLessonPlan.handleChange}
        error={
          formikLessonPlan.touched.classNumber &&
          Boolean(formikLessonPlan.errors.classNumber)
        }
        helperText={
          formikLessonPlan.touched.classNumber &&
          formikLessonPlan.errors.classNumber
        }
      />
      <TextField
        label={LessonConfig.gradeAndClass.label}
        placeholder={LessonConfig.gradeAndClass.placeholder}
        variant="outlined"
        fullWidth
        margin="normal"
        name="gradeAndClass"
        value={formikLessonPlan.values.gradeAndClass}
        onChange={formikLessonPlan.handleChange}
        error={
          formikLessonPlan.touched.gradeAndClass &&
          Boolean(formikLessonPlan.errors.gradeAndClass)
        }
        helperText={
          formikLessonPlan.touched.gradeAndClass &&
          formikLessonPlan.errors.gradeAndClass
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
        label={LessonConfig.teachingTopic.label}
        placeholder={LessonConfig.teachingTopic.placeholder}
        variant="outlined"
        fullWidth
        margin="normal"
        name="teachingTopic"
        value={formikLessonPlan.values.teachingTopic}
        onChange={formikLessonPlan.handleChange}
        error={
          formikLessonPlan.touched.teachingTopic &&
          Boolean(formikLessonPlan.errors.teachingTopic)
        }
        helperText={
          formikLessonPlan.touched.teachingTopic &&
          formikLessonPlan.errors.teachingTopic
        }
      />
      <TextField
        label={LessonConfig.lessonName.label}
        placeholder={LessonConfig.lessonName.placeholder}
        variant="outlined"
        fullWidth
        margin="normal"
        name="lessonName"
        value={formikLessonPlan.values.lessonName}
        onChange={formikLessonPlan.handleChange}
        error={
          formikLessonPlan.touched.lessonName &&
          Boolean(formikLessonPlan.errors.lessonName)
        }
        helperText={
          formikLessonPlan.touched.lessonName &&
          formikLessonPlan.errors.lessonName
        }
      />
      <TextField
        label={LessonConfig.previousLesson.label}
        placeholder={LessonConfig.previousLesson.placeholder}
        variant="outlined"
        fullWidth
        margin="normal"
        name="previousLesson"
        value={formikLessonPlan.values.previousLesson}
        onChange={formikLessonPlan.handleChange}
        error={
          formikLessonPlan.touched.previousLesson &&
          Boolean(formikLessonPlan.errors.previousLesson)
        }
        helperText={
          formikLessonPlan.touched.previousLesson &&
          formikLessonPlan.errors.previousLesson
        }
      />

      <TextField
        label={LessonConfig.nextLesson.label}
        placeholder={LessonConfig.nextLesson.placeholder}
        variant="outlined"
        fullWidth
        margin="normal"
        name="nextLesson"
        value={formikLessonPlan.values.nextLesson}
        onChange={formikLessonPlan.handleChange}
        error={
          formikLessonPlan.touched.nextLesson &&
          Boolean(formikLessonPlan.errors.nextLesson)
        }
        helperText={
          formikLessonPlan.touched.nextLesson &&
          formikLessonPlan.errors.nextLesson
        }
      />
      <TextField
        label={LessonConfig.typeOfLesson.label}
        placeholder={LessonConfig.typeOfLesson.placeholder}
        variant="outlined"
        fullWidth
        margin="normal"
        name="typeOfLesson"
        value={formikLessonPlan.values.typeOfLesson}
        onChange={formikLessonPlan.handleChange}
        error={
          formikLessonPlan.touched.typeOfLesson &&
          Boolean(formikLessonPlan.errors.typeOfLesson)
        }
        helperText={
          formikLessonPlan.touched.typeOfLesson &&
          formikLessonPlan.errors.typeOfLesson
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
        label={LessonConfig.educationalObjectives.label}
        placeholder={LessonConfig.educationalObjectives.placeholder}
        variant="outlined"
        fullWidth
        margin="normal"
        name="educationalObjectives"
        value={formikLessonPlan.values.educationalObjectives}
        onChange={formikLessonPlan.handleChange}
        error={
          formikLessonPlan.touched.educationalObjectives &&
          Boolean(formikLessonPlan.errors.educationalObjectives)
        }
        helperText={
          formikLessonPlan.touched.educationalObjectives &&
          formikLessonPlan.errors.educationalObjectives
        }
      />
      <TextField
        label={LessonConfig.socialObjectives.label}
        placeholder={LessonConfig.socialObjectives.placeholder}
        variant="outlined"
        fullWidth
        margin="normal"
        name="socialObjectives"
        value={formikLessonPlan.values.socialObjectives}
        onChange={formikLessonPlan.handleChange}
        error={
          formikLessonPlan.touched.socialObjectives &&
          Boolean(formikLessonPlan.errors.socialObjectives)
        }
        helperText={
          formikLessonPlan.touched.socialObjectives &&
          formikLessonPlan.errors.socialObjectives
        }
      />
      <TextField
        label={LessonConfig.functionalObjectives.label}
        placeholder={LessonConfig.functionalObjectives.placeholder}
        variant="outlined"
        fullWidth
        margin="normal"
        name="functionalObjectives"
        value={formikLessonPlan.values.functionalObjectives}
        onChange={formikLessonPlan.handleChange}
        error={
          formikLessonPlan.touched.functionalObjectives &&
          Boolean(formikLessonPlan.errors.functionalObjectives)
        }
        helperText={
          formikLessonPlan.touched.functionalObjectives &&
          formikLessonPlan.errors.functionalObjectives
        }
      />
      <TextField
        label={LessonConfig.teachingMethods.label}
        placeholder={LessonConfig.teachingMethods.placeholder}
        variant="outlined"
        fullWidth
        margin="normal"
        name="teachingMethods"
        value={formikLessonPlan.values.teachingMethods}
        onChange={formikLessonPlan.handleChange}
        error={
          formikLessonPlan.touched.teachingMethods &&
          Boolean(formikLessonPlan.errors.teachingMethods)
        }
        helperText={
          formikLessonPlan.touched.teachingMethods &&
          formikLessonPlan.errors.teachingMethods
        }
      />
      <TextField
        label={LessonConfig.formsOfWork.label}
        placeholder={LessonConfig.formsOfWork.placeholder}
        variant="outlined"
        fullWidth
        margin="normal"
        name="formsOfWork"
        value={formikLessonPlan.values.formsOfWork}
        onChange={formikLessonPlan.handleChange}
        error={
          formikLessonPlan.touched.formsOfWork &&
          Boolean(formikLessonPlan.errors.formsOfWork)
        }
        helperText={
          formikLessonPlan.touched.formsOfWork &&
          formikLessonPlan.errors.formsOfWork
        }
      />
      <TextField
        label={LessonConfig.instructionalMaterials.label}
        placeholder={LessonConfig.instructionalMaterials.placeholder}
        variant="outlined"
        fullWidth
        margin="normal"
        name="instructionalMaterials"
        value={formikLessonPlan.values.instructionalMaterials}
        onChange={formikLessonPlan.handleChange}
        error={
          formikLessonPlan.touched.instructionalMaterials &&
          Boolean(formikLessonPlan.errors.instructionalMaterials)
        }
        helperText={
          formikLessonPlan.touched.instructionalMaterials &&
          formikLessonPlan.errors.instructionalMaterials
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
        label={LessonConfig.introductionSmall.label}
        placeholder={LessonConfig.introductionSmall.placeholder}
        variant="outlined"
        fullWidth
        margin="normal"
        name="introductionSmall"
        value={formikLessonPlan.values.introductionSmall}
        onChange={formikLessonPlan.handleChange}
        error={
          formikLessonPlan.touched.introductionSmall &&
          Boolean(formikLessonPlan.errors.introductionSmall)
        }
        helperText={
          formikLessonPlan.touched.introductionSmall &&
          formikLessonPlan.errors.introductionSmall
        }
      />
      <TextField
        label={LessonConfig.mainActivitySmall.label}
        placeholder={LessonConfig.mainActivitySmall.placeholder}
        variant="outlined"
        fullWidth
        margin="normal"
        name="mainActivitySmall"
        value={formikLessonPlan.values.mainActivitySmall}
        onChange={formikLessonPlan.handleChange}
        error={
          formikLessonPlan.touched.mainActivitySmall &&
          Boolean(formikLessonPlan.errors.mainActivitySmall)
        }
        helperText={
          formikLessonPlan.touched.mainActivitySmall &&
          formikLessonPlan.errors.mainActivitySmall
        }
      />
      <TextField
        label={LessonConfig.conclusionSmall.label}
        placeholder={LessonConfig.conclusionSmall.placeholder}
        variant="outlined"
        fullWidth
        margin="normal"
        name="conclusionSmall"
        value={formikLessonPlan.values.conclusionSmall}
        onChange={formikLessonPlan.handleChange}
        error={
          formikLessonPlan.touched.conclusionSmall &&
          Boolean(formikLessonPlan.errors.conclusionSmall)
        }
        helperText={
          formikLessonPlan.touched.conclusionSmall &&
          formikLessonPlan.errors.conclusionSmall
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
