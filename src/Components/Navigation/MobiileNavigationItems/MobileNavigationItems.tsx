"use client";
import React, { FC, useState } from "react";
import Link from "next/link";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import clsx from "clsx";

import styles from "./MobileNavigationItems.module.scss";
import { NavigationItemType } from "@/Interfaces/BaseType";

interface MobileNavItemsProps {
  items: NavigationItemType[];
  onCloseMobileNav: () => void;
}

export const MobileNavigationItems: FC<MobileNavItemsProps> = ({
  items,
  onCloseMobileNav,
}) => {
  const [submenuOpen, setSubmenuOpen] = useState<Record<string, boolean>>({});

  const toggleSubmenu = (title: string) => {
    setSubmenuOpen((prevState) => ({
      ...prevState,
      [title]: !prevState[title],
    }));
  };

  return (
    <div>
      <ul className={styles.navLinks}>
        {items.map((item) => (
          <li className={styles.navItem} key={item.id}>
            <Link
              href={`${item.link}`}
              title={item.title}
              className={clsx(styles.link, item.submenu && styles.singleItem)}
            >
              <div onClick={onCloseMobileNav}>{item.title}</div>
            </Link>
            {item.submenu && (
              <>
                <button
                  className={styles.dropdownBtn}
                  onClick={() => toggleSubmenu(item.title)}
                  aria-expanded={submenuOpen[item.title]}
                  aria-controls={`submenu-${item.id}`}
                >
                  <KeyboardArrowDown />
                </button>
                <ul
                  id={`submenu-${item.id}`}
                  className={clsx(styles.submenu, {
                    [styles.active]: submenuOpen[item.title],
                  })}
                  aria-hidden={!submenuOpen[item.title]}
                >
                  {item.submenu.map((submenuItem) => (
                    <li className={styles.submenuItem} key={submenuItem.id}>
                      <Link
                        href={
                          item.link
                            ? `${item.link}/${submenuItem.link}`
                            : `${submenuItem.link}`
                        }
                        title={submenuItem.title}
                        className={styles.link}
                      >
                        <div onClick={onCloseMobileNav}>
                          {submenuItem.title}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
