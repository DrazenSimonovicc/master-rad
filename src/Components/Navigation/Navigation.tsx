"use client";

import React, { FC, useState, useEffect } from "react";
import styles from "./Navigation.module.scss";
import { AccountCircle, Dehaze, ExitToApp } from "@mui/icons-material";
import Link from "next/link";
import clsx from "clsx";

import { MobileNavigation } from "./MobileNavigation";
import { NavigationItemType } from "@/Interfaces/BaseType";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { useRouter } from "next/navigation";
import { pb } from "@/libs/pocketbase";
import { usePathname } from "next/navigation";

//TODO:ako ima profil picture stavi to ako nema onda account circle
//TODO:ako je ulogovan onda pise profil, a ako nije ulogovan onda da pise prijava

interface NavigationProps {
  items: NavigationItemType[];
}

export const Navigation: FC<NavigationProps> = ({ items }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1023);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolling = window.scrollY > 0;
      setIsSticky(isScrolling);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [mobileOpen]);

  const handleClose = () => {
    setFadeOut(true);
    setTimeout(() => {
      setMobileOpen(false);
      setFadeOut(false);
    }, 1200);
  };

  useEffect(() => {
    if (mobileOpen) {
      setFadeOut(false);
    }
  }, [mobileOpen]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    pb.authStore.clear();

    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");

    router.push("/odjava");

    handleMenuClose();
  };

  const isLoggedIn = pb.authStore.isValid;

  return (
    <div className={clsx(styles.nav, { [styles.sticky]: isSticky })}>
      <div className={styles.wrap}>
        <div className={clsx(styles.searchWrap, { [styles.sticky]: isSticky })}>
          <div className={styles.icon}>
            <IconButton onClick={handleMenuOpen}>
              <AccountCircle />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {isLoggedIn ? (
                <MenuItem>
                  <Link href={"/profil"} className={styles.profileMenuItem}>
                    Profil
                  </Link>
                </MenuItem>
              ) : (
                <MenuItem>
                  <Link href={"/prijava"} className={styles.profileMenuItem}>
                    Prijavi se
                  </Link>
                </MenuItem>
              )}
              {isLoggedIn && (
                <MenuItem onClick={handleLogout}>
                  <ExitToApp /> Odjavi se
                </MenuItem>
              )}
            </Menu>
          </div>
        </div>

        <Link href={`/`} title={"Logo"} className={styles.logo}>
          <p>MRDS</p>
        </Link>

        <button
          className={styles.navButton}
          onClick={() => setMobileOpen((prevState) => !prevState)}
        >
          <Dehaze />
        </button>

        {mobileOpen && !isDesktop && (
          <MobileNavigation
            items={items}
            onCloseMobileNav={() => setMobileOpen(false)}
          />
        )}

        {isDesktop && (
          <ul className={clsx(styles.navItems, { [styles.sticky]: isSticky })}>
            {items.map((item) => (
              <li className={styles.navItem} key={item.id}>
                {item.link ? (
                  <Link
                    href={`${item.link}`}
                    className={clsx(styles.link, {
                      [styles.active]: pathname === item.link,
                    })}
                    title={item.title}
                  >
                    {item.title}
                  </Link>
                ) : (
                  <div className={clsx(styles.link)}>{item.title}</div>
                )}

                {item.submenu && (
                  <ul className={styles.submenuItems}>
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
                          {submenuItem.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
