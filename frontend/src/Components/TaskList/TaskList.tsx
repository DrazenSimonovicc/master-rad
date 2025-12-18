import React from "react";
import styles from "./TaskList.module.scss";

interface TaskListProps {
  plan: Record<string, any>;
  expandedUnitId: string | number;
}

const TaskList: React.FC<TaskListProps> = ({ plan, expandedUnitId }) => {
  if (expandedUnitId !== plan.id) return null;

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
    </div>
  );
};

export default TaskList;
