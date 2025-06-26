import React, { FC } from "react";
import Link from "next/link";
import styles from "./AnnouncementLink.module.scss";

interface AnnouncementLinkProps {
  link: string;
  title: string;
  date: string;
}

export const AnnouncementLink: FC<AnnouncementLinkProps> = ({
  link,
  title,
  date,
}) => {
  return (
    <div className={styles.announcementItem}>
      <Link href={link} className={styles.announcementLink}>
        {title}
      </Link>
      <p className={styles.announcementDate}>
        <strong>Objavljeno dana: </strong>
        {date}
      </p>
    </div>
  );
};
