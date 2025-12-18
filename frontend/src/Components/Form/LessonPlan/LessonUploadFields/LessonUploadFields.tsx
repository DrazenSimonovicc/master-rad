import React from "react";
import { TextField } from "@mui/material";
import { Button } from "@/Components/Button";
import { LessonConfig } from "@/app/resursi-za-nastavu/priprema-za-nastavu/config";
import { testConfig } from "@/app/resursi-za-nastavu/testovi/config";
import styles from "./LessonUploadFields.module.scss";

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
