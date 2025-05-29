// app/components/TeacherSiteCard.tsx
import styles from "./TeacherSiteCard.module.scss";

type Site = {
  name: string;
  url: string;
  description: string;
};

export default function TeacherSiteCard({ name, url, description }: Site) {
  return (
    <div className={styles.card}>
      <h3>{name}</h3>
      <p>{description}</p>
      <a href={url} target="_blank" rel="noopener noreferrer">
        Poseti sajt
      </a>
    </div>
  );
}
