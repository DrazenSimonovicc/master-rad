import { FC } from "react";
import clsx from "clsx";
import styles from "./Description.module.scss";

interface DescriptionProps {
  text: string;
  className?: string;
  boldedText?: string;
  upperCaseText?: string;
}
export const Description: FC<DescriptionProps> = ({
  text,
  className,
  boldedText,
  upperCaseText,
}: DescriptionProps) => (
  <div className={clsx(styles.description, className)}>
    {boldedText && (
      <b>
        <span className={styles.upperCase}>{upperCaseText}</span>
        {boldedText}
      </b>
    )}
    <div>{text}</div>
  </div>
);
