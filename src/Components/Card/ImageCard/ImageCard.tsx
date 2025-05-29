import clsx from "clsx";
import { FC } from "react";

import Image from "next/image";
import Link from "next/link";

import styles from "./ImageCard.module.scss";

//TODO NIJE URADJEN STAJLING

interface ImageCardProps {
  className?: string;
  imageUrl: string;
  imageDescription: string;
  linkUrl: string;
  title: string;
  buttonText: string;
}

export const ImageCard: FC<ImageCardProps> = ({
  className,
  imageDescription,
  imageUrl,
  linkUrl,
  title,
  buttonText,
}) => (
  <div className={clsx(styles.imageCard, className)}>
    <picture>
      <img alt={imageDescription} src={imageUrl} />
    </picture>
    <div className={styles.descriptionWrap}>
      <div className={styles.title}>{title}</div>
      <Link href={linkUrl} className={styles.link}>
        {buttonText}
      </Link>
    </div>
    <div className={styles.background}></div>
  </div>
);
