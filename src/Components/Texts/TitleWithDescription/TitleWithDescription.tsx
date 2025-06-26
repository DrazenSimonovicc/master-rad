import { FC } from "react";
import { Description } from "@/Components/Texts/Description";
import { Title } from "@/Components/Texts/Title";
import clsx from "clsx";
import styles from "./TitleWithDescription.module.scss";

interface DescriptionProps {
  text: string;
  className?: string;
  title: string;
}
export const TitleWithDescription: FC<DescriptionProps> = ({
  text,
  className,
  title,
}: DescriptionProps) => (
  <div className={clsx(styles.container, className)}>
    <Title text={title} level={2} className={styles.title} />
    <Description text={text} className={styles.description} />
  </div>
);
