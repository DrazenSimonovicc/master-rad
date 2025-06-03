import clsx from "clsx";
import React, { FC } from "react";

import styles from "./IconCard.module.scss";
import Link from "next/link";

interface IconCardProps {
  className?: string;
  icon: React.ReactNode;
  linkUrl: string;
  description: string;
  title: string;
}

export const IconCard: FC<IconCardProps> = ({
  className,
  icon,
  linkUrl,
  description,
  title,
}) => (
  <div className={styles.cardWrap}>
    <div className={clsx(styles.icon, className)}>{icon}</div>
    <Link href={linkUrl} className={styles.title}>
      {title}
    </Link>
    <div className={styles.description}>{description}</div>
  </div>
);
