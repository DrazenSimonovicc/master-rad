import Link from "next/link";
import styles from "./SubjectCard.module.scss";
import React, { FC } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface SubjectCardProps {
  id: string | number;
  subject?: string;
  grade?: string | number;
  link?: string;
  type?: string;
  description?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const SubjectCard: FC<SubjectCardProps> = ({
  id,
  subject,
  grade,
  link,
  type,
  description,
  onEdit,
  onDelete,
}) => {
  return (
    <div className={styles.card}>
      {grade ? (
        <Link
          href={{
            pathname: `${link}/${id}`,
            query: { subject: subject },
          }}
          passHref
        >
          <div className={styles.subject}>{subject}</div>
          <div className={styles.grade}>{grade}</div>
        </Link>
      ) : (
        <div className={styles.descriptionAndIcon}>
          <Link
            href={{
              pathname: `${link}/${id}`,
              query: { subject: subject, type: type },
            }}
            className={styles.subject}
          >
            <div className={styles.description}>{description}</div>
          </Link>
          <div className={styles.iconsWrapper}>
            <EditIcon
              className={styles.icon}
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
            />
            <DeleteIcon
              className={styles.icon}
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectCard;
