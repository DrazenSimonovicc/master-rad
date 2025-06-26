import clsx from "clsx";
import { FC } from "react";
import styles from "./CategoryCard.module.scss";
import Image from "next/image";

interface CategoryCardProps {
  className?: string;
  imageUrl: string;
  imageDescription: string;
  onClick: (category: string) => void;
  description: string;
  isSelected?: boolean;
}

export const CategoryCard: FC<CategoryCardProps> = ({
  className,
  imageDescription,
  imageUrl,
  onClick,
  description,
  isSelected,
}) => (
  <div className={clsx(styles.imageWrap, className)}>
    <Image
      width={255}
      height={255}
      alt={imageDescription}
      src={imageUrl}
      className={styles.image}
    />
    <div className={styles.overlay}>
      <button
        onClick={() => onClick(description)}
        className={clsx(styles.descriptionWrapper, {
          [styles.selected]: isSelected,
        })}
      >
        {description}
      </button>
    </div>
  </div>
);
