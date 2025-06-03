import { FC } from "react";
import styles from "./Button.module.scss";
import clsx from "clsx";
import Link from "next/link";

type themeType =
  | "blue"
  | "white"
  | "orange"
  | "standardWide"
  | "narrower"
  | "standardHeight"
  | "taller"
  | "withBorder"
  | "animation"
  | "height38"
  | "maxWidth"
  | "noBorderRadius"
  | "leftAndRightPadding";

interface ButtonProps {
  themes: themeType[];
  title: string;
  className?: string;
  onClick?: () => void;
  linkTo?: string;
  newPage?: boolean;
  type?: "button" | "submit" | "reset";
}

export const Button: FC<ButtonProps> = ({
  className,
  title,
  onClick,
  linkTo,
  themes,
  newPage,
  type,
}) => {
  return linkTo ? (
    <Link
      href={linkTo}
      target={newPage ? "_blank" : undefined}
      className={clsx(
        styles.btn,
        className,
        themes.map((theme) => styles[theme]),
      )}
    >
      {title}
    </Link>
  ) : (
    <button
      className={clsx(
        styles.btn,
        className,
        themes.map((theme) => styles[theme]),
      )}
      onClick={onClick}
      type={type || "button"}
    >
      {title}
    </button>
  );
};
