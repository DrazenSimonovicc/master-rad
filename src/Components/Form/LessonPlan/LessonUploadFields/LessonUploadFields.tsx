import React from "react";
import { TextField } from "@mui/material";

import styles from "./LessonUploadFields.module.scss";
import { testConfig } from "@/app/resursi-za-nastavu/testovi/config";
import { Button } from "@/Components/Button";
import { LessonConfig } from "@/app/resursi-za-nastavu/priprema-za-nastavu/config";

type Props = {
  formikLessonPlan: any;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmitFile: () => void;
};

const LessonUploadFields: React.FC<Props> = ({
  formikLessonPlan,
  handleFileUpload,
  handleSubmitFile,
}) => {
  return (
    <form>
      <label
        htmlFor="lessonFile"
        style={{
          fontWeight: "bold",
          display: "block",
          marginBottom: "10px",
        }}
      >
        Dodajte fajl (.pdf, .docx, .txt)
      </label>
      <input
        type="file"
        id="lessonFile"
        name="file"
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleFileUpload}
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
          type="button"
          onClick={handleSubmitFile}
        />
      </div>
    </form>
  );
};

export default LessonUploadFields;
