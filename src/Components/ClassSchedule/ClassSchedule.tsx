import React from "react";
import styles from "./ClassSchedule.module.scss";

interface ClassSchedule {
  id: string;
  dayName: string;
  subject: string | string[];
}

interface ClassScheduleTableProps {
  classSchedule: ClassSchedule[];
}

const times = [
  "08:00 - 08:45",
  "08:50 - 09:35",
  "09:40 - 10:25",
  "10:30 - 11:15",
  "11:20 - 12:05",
  "12:10 - 12:55",
];

export const ClassScheduleTable: React.FC<ClassScheduleTableProps> = ({
  classSchedule,
}) => {
  const subjectArrays = classSchedule.map(({ subject }) => {
    if (typeof subject === "string") {
      return subject.split(",").map((s) => s.trim());
    } else if (Array.isArray(subject)) {
      return subject.map((s) => s.trim());
    } else {
      return [];
    }
  });

  const maxRows = Math.max(...subjectArrays.map((arr) => arr.length));

  return (
    <div className={styles.tableWrapper}>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th className={styles.noOfClass}>Čas br.</th>
            {classSchedule.map(({ id, dayName }) => (
              <th key={id} className={styles.dayName}>
                {dayName}
              </th>
            ))}
            <th className={styles.noOfClass}>Vreme</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: maxRows }, (_, rowIndex) => (
            <tr key={rowIndex}>
              <td className={styles.row}>{rowIndex + 1}</td>

              {subjectArrays.map((subjects, colIndex) => (
                <td key={colIndex} className={styles.subject}>
                  {subjects[rowIndex] || ""}
                </td>
              ))}

              <td className={styles.row}>{times[rowIndex] || ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
