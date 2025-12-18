"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "@mui/icons-material";
import styles from "./Breadcrumb.module.scss";

interface BreadcrumbItem {
  title: string;
  url?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => {
  return (
    <nav className={`${styles.breadcrumb} ${className || ""}`} aria-label="Breadcrumb">
      <ol className={styles.breadcrumbList}>
        {items.map((item, index) => (
          <li key={index} className={styles.breadcrumbItem}>
            {index > 0 && (
              <ChevronRight className={styles.separator} />
            )}
            {item.url ? (
              <Link href={item.url} className={styles.breadcrumbLink}>
                {index === 0 && <Home className={styles.homeIcon} />}
                <span>{item.title}</span>
              </Link>
            ) : (
              <span className={styles.breadcrumbCurrent}>
                {index === 0 && <Home className={styles.homeIcon} />}
                <span>{item.title}</span>
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
