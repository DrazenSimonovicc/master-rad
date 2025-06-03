import React, { FC } from "react";
import styles from "./TextWithImage.module.scss";
import clsx from "clsx";
import { Description } from "@/Components/Texts/Description";

interface TextWithImageProps {
  title?: string;
  text: string;
  imageUrl: string;
  linkUrl: string;
  className?: string;
  otherTitle?: boolean;
  titlePartOne: string;
  titlePartTwo: string;
}

export const TextWithImage: FC<TextWithImageProps> = ({
  title,
  text,
  imageUrl,
  linkUrl,
  className,
  otherTitle,
  titlePartOne,
  titlePartTwo,
}) => {
  return (
    <div className={clsx(styles.container, className)}>
      <div className={styles.textContainer}>
        {otherTitle ? (
          <h2 className={styles.title}>
            <span className={styles.spanOne}>{titlePartOne}</span>
            <span className={styles.spanTwo}>{titlePartTwo}</span>
          </h2>
        ) : (
          <h2 className={styles.title}>{title}</h2>
        )}

        <Description text={text} className={styles.text} />
      </div>
      <div className={styles.imageContainer}>
        <div className={styles.blueSquere}></div>
        <div className={styles.greenSquere}></div>
        <picture>
          <img alt="homepage image" src={imageUrl} className={styles.image} />
        </picture>
      </div>
    </div>
  );
};
