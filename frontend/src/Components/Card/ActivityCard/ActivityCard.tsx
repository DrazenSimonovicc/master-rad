import { UrlObject } from "url";
import Link from "next/link";
import styles from "./ActivityCard.module.scss";

interface ActivityCardProps {
  href: UrlObject;
  typeOfActivity: string;
  title: string;
  date: string;
}

export const ActivityCard = ({
  href,
  typeOfActivity,
  title,
  date,
}: ActivityCardProps) => {
  return (
    <Link href={href} className={styles.card}>
      <div className={styles.header}>
        <span className={styles.type}>{typeOfActivity}</span>
        <span className={styles.date}>{date}</span>
      </div>
      <h3 className={styles.title}>{title}</h3>
    </Link>
  );
};
