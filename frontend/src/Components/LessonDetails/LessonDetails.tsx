import React from "react";
import { LessonPlanType } from "@/Interfaces/BaseType";
import { LessonConfig } from "@/app/resursi-za-nastavu/priprema-za-nastavu/config";
import styles from "./LessonDetails.module.scss";

interface LessonDetailsProps {
  lesson: LessonPlanType;
}

const LessonDetails: React.FC<LessonDetailsProps> = ({ lesson }) => {
  const lessonGroups = [
    {
      title: "Opšti podaci",
      fields: [
        "date",
        "classNumber",
        "gradeAndClass",
      ] as (keyof LessonPlanType)[],
    },
    {
      title: "Opšti metodički podaci",
      fields: [
        "subject",
        "teachingTopic",
        "lessonName",
        "previousLesson",
        "nextLesson",
        "typeOfLesson",
      ] as (keyof LessonPlanType)[],
    },
    {
      title: "Operativni zadaci",
      fields: [
        "educationalObjectives",
        "socialObjectives",
        "functionalObjectives",
        "teachingMethods",
        "formsOfWork",
        "instructionalMaterials",
        "correlation",
        "literature",
      ] as (keyof LessonPlanType)[],
    },
    {
      title: "Struktura časa",
      fields: [
        "introductionSmall",
        "mainActivitySmall",
        "conclusionSmall",
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
