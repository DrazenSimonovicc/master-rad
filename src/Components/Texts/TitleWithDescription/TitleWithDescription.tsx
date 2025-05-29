import clsx from "clsx";
import { FC } from "react";

import styles from "./TitleWithDescription.module.scss";
import { Title } from "@/Components/Texts/Title";
import { Description } from "@/Components/Texts/Description";

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
