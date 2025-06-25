import React from "react";
import styles from "./LessonDetails.module.scss";
import { LessonPlanType } from "@/Interfaces/BaseType";
import { LessonConfig } from "@/app/resursi-za-nastavu/priprema-za-nastavu/config";

interface LessonDetailsProps {
  lesson: LessonPlanType;
}

const LessonDetails: React.FC<LessonDetailsProps> = ({ lesson }) => {
  const lessonGroups = [
    {
      title: "Opšti podaci",
      fields: [
        "date",
        "class_number",
        "grade_and_class",
      ] as (keyof LessonPlanType)[],
    },
    {
      title: "Opšti metodički podaci",
      fields: [
        "subject",
        "teaching_topic",
        "lesson_name",
        "previous_lesson",
        "next_lesson",
        "type_of_lesson",
      ] as (keyof LessonPlanType)[],
    },
    {
      title: "Operativni zadaci",
      fields: [
        "educational_objectives",
        "social_objectives",
        "functional_objectives",
        "teaching_methods",
        "forms_of_work",
        "instructional_materials",
        "correlation",
        "literature",
      ] as (keyof LessonPlanType)[],
    },
    {
      title: "Struktura časa",
      fields: [
        "introduction_small",
        "main_activity_small",
        "conclusion_small",
      ] as (keyof LessonPlanType)[],
    },
    {
      title: "Razrada toka časa",
      fields: [
        "introduction",
        "main",
        "conclusion",
      ] as (keyof LessonPlanType)[],
    },
  ];

  type LessonField = keyof typeof LessonConfig;

  return (
    <div className={styles.lessonDetails}>
      {lessonGroups.map(({ title, fields }) => (
        <div key={title} className={styles.lessonPartGroup}>
          <table className={styles.lessonTable}>
            <thead>
              <tr>
                <th colSpan={2} className={styles.lessonTableHeading}>
                  <h3>{title}</h3>
                </th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field) => (
                <tr key={field}>
                  <th>{LessonConfig[field as LessonField]?.label || field}</th>
                  <td>
                    {lesson[field] ? (
                      <span
                        dangerouslySetInnerHTML={{
                          __html: lesson[field] as string,
                        }}
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default LessonDetails;
