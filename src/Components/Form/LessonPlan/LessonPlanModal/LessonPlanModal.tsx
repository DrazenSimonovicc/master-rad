import { useEffect, useState } from "react";
import { Button } from "@/Components/Button";
import LessonFormFields from "@/Components/Form/LessonPlan/LessonFormFields/LessonFormFields";
import LessonUploadFields from "@/Components/Form/LessonPlan/LessonUploadFields/LessonUploadFields";
import { Modal } from "@/Components/Modal";
import styles from "./LessonPlanModal.module.scss";

const LessonPlanModal = ({
  open,
  setOpen,
  formikLessonPlan,
  handleFileUpload,
  handleSubmitFile,
  selectedLessonToEdit,
}: any) => {
  const [view, setView] = useState<"form" | "upload">("form");

  useEffect(() => {
    if (selectedLessonToEdit) {
      formikLessonPlan.setValues({
        ...selectedLessonToEdit,
      });
      setView(selectedLessonToEdit.file ? "upload" : "form");
    } else {
      formikLessonPlan.resetForm();
      setView("form");
    }
  }, [selectedLessonToEdit]);

  return (
    <Modal
      title={
        selectedLessonToEdit
          ? "Izmeni nastavnu jedinicu"
          : "Dodaj nastavnu jedinicu"
      }
      isOpen={open}
      setIsOpen={setOpen}
      description="Unesite naziv i detalje nastavne jedinice koju želite da dodate."
      theme="halfScreen"
    >
      <div className={styles.modalButtonWrapper}>
        <Button
          title="Unesi ručno"
          themes={[
            "blue",
            "standardWide",
            "standardHeight",
            "noBorderRadius",
            "maxWidth",
          ]}
          type="button"
          onClick={() => setView("form")}
        />
        <Button
          title="Dodaj fajl"
          themes={[
            "blue",
            "standardWide",
            "standardHeight",
            "noBorderRadius",
            "maxWidth",
          ]}
          type="button"
          onClick={() => setView("upload")}
        />
      </div>

      {view === "form" ? (
        <LessonFormFields formikLessonPlan={formikLessonPlan} />
      ) : (
        <LessonUploadFields
          formikLessonPlan={formikLessonPlan}
          handleFileUpload={handleFileUpload}
          handleSubmitFile={handleSubmitFile}
        />
      )}
    </Modal>
  );
};

export default LessonPlanModal;
