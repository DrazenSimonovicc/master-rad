import clsx from "clsx";

import { FC } from "react";

import styles from "./Error.module.scss";

interface ErrorProps {
  text: string;
  className?: string;
}
export const Error: FC<ErrorProps> = ({ text, className }) => (
  <div className={clsx(styles.errorText, className)}>
    <span>{text}</span>
  </div>
);
