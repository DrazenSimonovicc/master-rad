import React, { FC, ReactNode } from "react";
import styles from "./Text.module.scss";

import clsx from "clsx";

export interface TextProps {
  className?: string;
  themes: themeType[];
  text: ReactNode;
}

type themeType =
  | "black"
  | "white"
  | "gray"
  | "alignLeft"
  | "alignCenter"
  | "alignJustify";

const Text: FC<TextProps> = ({ className, themes, text }) => {
  return (
    <p
      className={clsx(
        styles.text,
        className,
        themes.map((theme) => styles[theme]),
      )}
    >
      {text}
    </p>
  );
};

export default Text;
