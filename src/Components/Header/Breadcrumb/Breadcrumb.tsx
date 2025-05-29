import { FC } from "react";
import styles from "./Breadcrumb.module.scss";
import clsx from "clsx";
import Link from "next/link";
import { BreadcrumbItemType } from "@/Interfaces/BaseType";

interface BreadcrumbProps {
  items: BreadcrumbItemType;
  className?: string;
  search?: boolean;
}

export const Breadcrumb: FC<BreadcrumbProps> = ({
  items,
  className,
  search,
}) => {
  return (
    <div className={clsx(styles.breadcrumbContainer, className)}>
      <Link href={items.level1url} className={styles.link}>
        {items.level1}
      </Link>

      {items.level2 && <div>/</div>}

      {items.level2 && items.level2url && (
        <Link href={items.level2url} className={styles.link}>
          {items.level2}
        </Link>
      )}

      {search && <div>/</div>}

      {search && <span className={styles.searchText}>{items.searchText}</span>}

      {items.level3 && <div>/</div>}

      {items.level3 && items.level3url ? (
        <Link href={items.level3url} className={styles.link}>
          {items.level3}
        </Link>
      ) : (
        <div className={styles.link}>{items.level3}</div>
      )}

      {items.level4 && <div>/</div>}

      {items.level4 && <p className={styles.link}>{items.level4}</p>}
    </div>
  );
};
