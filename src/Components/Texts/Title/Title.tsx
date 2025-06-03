import clsx from "clsx";
import { FC, JSX } from "react";
import styles from "./Title.module.scss";

type themeType = "bold" | "regular" | "light" | "white" | "underline";

export interface TitleProps {
  text: string;
  className?: string;
  level?: 1 | 2 | 3 | 4 | 5;
  themes?: themeType[];
  isRequired?: boolean;
}

export const Title: FC<TitleProps> = ({
  text,
  className,
  level = 1,
  themes = [],
  isRequired = false,
}) => {
  const Tag: keyof JSX.IntrinsicElements = `h${level}`;

  return (
    <Tag
      className={clsx(
        styles.title,
        className,
        styles[`level${level}`],
        ...themes.map((theme) => styles[theme]),
      )}
    >
      {isRequired && <span className={styles.dot}></span>} <span>{text}</span>
    </Tag>
  );
};
