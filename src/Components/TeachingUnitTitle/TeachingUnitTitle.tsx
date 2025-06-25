import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import styles from "./TeachingUnitTitle.module.scss";

interface TeachingUnitTitleProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  canEdit: boolean;
}

const TeachingUnitTitle: React.FC<TeachingUnitTitleProps> = ({
  title,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
  canEdit,
}) => {
  return (
    <div className={styles.container}>
      <div
        onClick={onToggle}
        className={`${styles.title} ${isExpanded ? styles.expanded : ""}`}
      >
        <div className={styles.content}>
          {title}
          {canEdit && (
            <div className={styles.iconsWrapper}>
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeachingUnitTitle;
