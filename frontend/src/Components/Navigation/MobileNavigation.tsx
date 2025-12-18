"use client";

import React, { FC, useEffect, useState } from "react";
import Link from "next/link";
import { Close } from "@mui/icons-material";
import { MobileNavigationItems } from "@/Components/Navigation/MobiileNavigationItems/MobileNavigationItems";
import { NavigationItemType } from "@/Interfaces/BaseType";
import clsx from "clsx";
import styles from "./Navigation.module.scss";

interface MobileNavigationProps {
  items: NavigationItemType[];
  onCloseMobileNav: () => void;
}

export const MobileNavigation: FC<MobileNavigationProps> = ({
  items,
  onCloseMobileNav,
}) => {
  const [fadeOut, setFadeOut] = useState(false);

  const handleClose = () => {
    setFadeOut(true);
    setTimeout(() => {
      onCloseMobileNav();
      setFadeOut(false);
    }, 1200);
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div
      className={clsx(styles.background, {
        [styles.active]: true,
        [styles.fadeOut]: fadeOut,
      })}
    >
      <div
        className={clsx(styles.navContent, {
          [styles.active]: true,
          [styles.fadeOut]: fadeOut,
        })}
      >
        <button
          className={clsx(styles.closeButton, {
            [styles.active]: true,
          })}
          onClick={handleClose}
        >
          <Close className={styles.icon} fontSize={"large"} />
        </button>

        <Link href={`/`} title={"Logo"} className={styles.logo}>
          <p>MRDS</p>
        </Link>

        <MobileNavigationItems
          items={items}
          onCloseMobileNav={onCloseMobileNav}
        />
      </div>
    </div>
  );
};
