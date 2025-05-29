import Link from "next/link";
import styles from "./SubjectCard.module.scss";
import React, { FC } from "react";

interface SubjectCardProps {
  id: string | number;
  subject?: string;
  grade?: string | number;
  link?: string;
  type?: string;
  description?: string;
}

const SubjectCard: FC<SubjectCardProps> = ({
  id,
  subject,
  grade,
  link,
  type,
  description,
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
        <Link
          href={{
            pathname: `${link}/${id}`,
            query: { subject: subject, type: type },
          }}
          className={styles.subject}
        >
          <div className={styles.description}>{description}</div>
        </Link>
      )}
    </div>
  );
};

export default SubjectCard;
