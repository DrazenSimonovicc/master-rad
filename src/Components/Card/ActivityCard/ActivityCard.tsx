import Link from "next/link";
import styles from "./ActivityCard.module.scss";
import { UrlObject } from "url";

interface ActivityCardProps {
  href: UrlObject;
  type_of_activity: string;
  title: string;
  date: string;
}

export const ActivityCard = ({
  href,
  type_of_activity,
  title,
  date,
}: ActivityCardProps) => {
  return (
    <Link href={href} className={styles.card}>
      <div className={styles.header}>
        <span className={styles.type}>{type_of_activity}</span>
        <span className={styles.date}>{date}</span>
      </div>
      <h3 className={styles.title}>{title}</h3>
    </Link>
  );
};
