import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import IconButton from "@mui/material/IconButton";
import styles from "./TeachingUnitTitle.module.scss";
import { useDownloadTasks } from "@/Hooks/Download/useDownloadTasks";
import { useDownloadLessonPlan } from "@/Hooks/Download/useDownloadLessonPlan";
import { LessonPlanType } from "@/Interfaces/BaseType";

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
      typeof obj.class_number === "string" &&
      typeof obj.grade_and_class === "string" &&
      typeof obj.subject === "string" &&
      typeof obj.teaching_topic === "string" &&
      typeof obj.lesson_name === "string" &&
      typeof obj.previous_lesson === "string" &&
      typeof obj.next_lesson === "string" &&
      typeof obj.type_of_lesson === "string" &&
      typeof obj.educational_objectives === "string" &&
      typeof obj.social_objectives === "string" &&
      typeof obj.functional_objectives === "string" &&
      typeof obj.teaching_methods === "string" &&
      typeof obj.forms_of_work === "string" &&
      typeof obj.instructional_materials === "string" &&
      typeof obj.correlation === "string" &&
      typeof obj.literature === "string" &&
      typeof obj.introduction_small === "string" &&
      typeof obj.main_activity_small === "string" &&
      typeof obj.conclusion_small === "string" &&
      typeof obj.introduction === "string" &&
      typeof obj.main === "string" &&
      typeof obj.conclusion === "string" &&
      typeof obj.user === "string"
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
