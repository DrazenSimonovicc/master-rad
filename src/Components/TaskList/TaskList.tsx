import React from "react";
import styles from "./TaskList.module.scss";

type TaskType =
  | "test"
  | "homework"
  | "lesson"
  | "operative"
  | "global"
  | string;

interface TaskListProps {
  plan: Record<string, any>;
  expandedUnitId: string | number;
  type?: TaskType;
}

const TaskList: React.FC<TaskListProps> = ({ plan, expandedUnitId, type }) => {
  if (expandedUnitId !== plan.id) return null;

  const downloadAllTasks = () => {
    let allTasksText = "";

    for (let i = 1; i <= 10; i++) {
      const task = plan[`task${i}`];
      if (task && task.trim() !== "") {
        const plainText = task.replace(/<[^>]+>/g, "");
        allTasksText += `Zadatak ${i}:\n${plainText}\n\n`;
      }
    }

    if (!allTasksText) {
      alert("Nema zadataka za preuzimanje.");
      return;
    }

    const blob = new Blob([allTasksText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    const sanitizeFilename = (name: string) =>
      name.replace(/[\/\\:\*\?"<>\|]/g, "").trim();

    const unitTitle = plan.teaching_unit?.trim();
    const safeTitle = sanitizeFilename(unitTitle || "zadaci");

    const typeToTitlePrefix: Record<string, string> = {
      test: "Test",
      homework: "Domaći zadatak",
      lesson: "Priprema za čas",
      operative: "Operativni plan",
      global: "Globalni plan",
    };

    const titlePrefix = typeToTitlePrefix[type || ""] || "Zadatak";

    link.download = `${titlePrefix} - ${safeTitle}.txt`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.taskListWrapper}>
      {Array.from({ length: 10 }, (_, index) => {
        const task = plan[`task${index + 1}` as keyof typeof plan];
        return task ? (
          <div key={index} className={styles.taskItem}>
            <div className={styles.taskNumber}>{index + 1}.</div>
            <div
              className={styles.taskContent}
              dangerouslySetInnerHTML={{ __html: task }}
            />
          </div>
        ) : null;
      })}

      <button onClick={downloadAllTasks} className={styles.downloadButton}>
        Preuzmi sve zadatke
      </button>
    </div>
  );
};

export default TaskList;
