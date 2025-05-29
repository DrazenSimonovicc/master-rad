"use client";
import { FC } from "react";
import styles from "@/Components/Card/CalendarActivityCard/CalendarActivityCard.module.scss";
import clsx from "clsx";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface CalendarActivityCardProps {
  id: string;
  title: string;
  description: string;
  time: string;
  date: string;
  activity_status: string;
  category: string;
  priority: boolean;
  hasAttachment: boolean;
  image: string;
  onEdit: (id: string) => void; // Pass edit handler
  onDelete: (id: string) => void; // Pass delete handler
}

export const CalendarActivityCard: FC<CalendarActivityCardProps> = ({
  id,
  title,
  description,
  time,
  date,
  activity_status,
  category,
  priority,
  hasAttachment,
  image,
  onEdit,
  onDelete,
}) => {
  return (
    <div
      key={id}
      className={clsx(styles.cardWrapper, {
        [styles.priority]: priority,
      })}
    >
      {image && (
        <div className={styles.imageContainer}>
          <img
            src={`http://127.0.0.1:8090/api/files/pbc_2097402128/g9jbqi6570i1682/${image}`}
            alt="Uploaded Image"
          />
        </div>
      )}

      <div className={styles.cardContent}>
        <h2 className={styles.cardTitle}>{title}</h2>
        <div className={styles.cardSubtitleWrapper}>
          <h3
            className={clsx(styles.cardSubtitle, {
              [styles.active]: activity_status === "aktivna",
              [styles.upcoming]: activity_status === "predstojeća",
              [styles.finished]: activity_status === "završena",
            })}
          >
            {activity_status}
          </h3>
          <h3 className={styles.cardSubtitle}>{category}</h3>
        </div>
        <p className={styles.cardDescription}>{description}</p>
        <div className={styles.cardDates}>
          {date && (
            <div className={styles.cardDate}>
              <strong>Datum:</strong>
              <p>
                {new Date(date).toLocaleDateString("sr-Latn-RS", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          )}
        </div>

        {hasAttachment && (
          <div className={styles.attachmentIcon}>
            <AttachFileIcon fontSize={"small"} />
            <span>Attachment</span>
          </div>
        )}

        {/* Edit and Delete icons */}
        <div className={styles.cardActions}>
          <EditIcon onClick={() => onEdit(id)} className={styles.editIcon} />
          <DeleteIcon
            onClick={() => onDelete(id)}
            className={styles.deleteIcon}
          />
        </div>
      </div>
    </div>
  );
};
