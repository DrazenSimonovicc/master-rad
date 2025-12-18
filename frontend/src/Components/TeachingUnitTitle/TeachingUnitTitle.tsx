import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import { useDownloadLessonPlan } from "@/Hooks/Download/useDownloadLessonPlan";
import { useDownloadTasks } from "@/Hooks/Download/useDownloadTasks";
import { LessonPlanType } from "@/Interfaces/BaseType";
import styles from "./TeachingUnitTitle.module.scss";

type TaskType =
  | "test"
  | "homework"
  | "lesson"
  | "operative"
  | "global"
  | string;

interface TeachingUnitTitleProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  canEdit: boolean;
  isFile?: boolean;
  download?: () => void;
  plan?: Record<string, any>;
  type?: TaskType;
  lesson?: Record<string, any>;
}

const TeachingUnitTitle: React.FC<TeachingUnitTitleProps> = ({
  title,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
  canEdit,
  isFile,
  download,
  plan,
  type,
  lesson,
}) => {
  const { downloadAllTasks } = useDownloadTasks({ plan: plan ?? {}, type });

  function isLessonPlanType(obj: any): obj is LessonPlanType {
    return (
      obj &&
      typeof obj.id === "string" &&
      typeof obj.date === "string" &&
      typeof obj.classNumber === "string" &&
      typeof obj.gradeAndClass === "string" &&
      typeof obj.subject === "string" &&
      typeof obj.teachingTopic === "string" &&
      typeof obj.lessonName === "string" &&
      typeof obj.previousLesson === "string" &&
      typeof obj.nextLesson === "string" &&
      typeof obj.typeOfLesson === "string" &&
      typeof obj.educationalObjectives === "string" &&
      typeof obj.socialObjectives === "string" &&
      typeof obj.functionalObjectives === "string" &&
      typeof obj.teachingMethods === "string" &&
      typeof obj.formsOfWork === "string" &&
      typeof obj.instructionalMaterials === "string" &&
      typeof obj.correlation === "string" &&
      typeof obj.literature === "string" &&
      typeof obj.introductionSmall === "string" &&
      typeof obj.mainActivitySmall === "string" &&
      typeof obj.conclusionSmall === "string" &&
      typeof obj.introduction === "string" &&
      typeof obj.main === "string" &&
      typeof obj.conclusion === "string" &&
      typeof obj.userId === "string"
    );
  }

  const { downloadLessonPlan } =
    lesson && isLessonPlanType(lesson)
      ? useDownloadLessonPlan({ lesson })
      : { downloadLessonPlan: () => {} };

  const handleDownload = () => {
    if (download) {
      download();
    } else if (lesson && isLessonPlanType(lesson)) {
      downloadLessonPlan();
    } else {
      downloadAllTasks();
    }
  };

  return (
    <div className={styles.container}>
      <div
        onClick={onToggle}
        className={`${styles.title} ${isExpanded ? styles.expanded : ""} ${isFile ? styles.file : ""}`}
      >
        <div className={styles.content}>
          {title}

          <div className={styles.iconsWrapper}>
            <DownloadIcon
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
              className={styles.icon}
            />

            {canEdit &&
              (!isFile ? (
                <>
                  <EditIcon
                    className={styles.icon}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit();
                    }}
                  />
                  <DeleteIcon
                    className={styles.icon}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                    }}
                  />
                </>
              ) : (
                <DeleteIcon
                  className={styles.icon}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeachingUnitTitle;
