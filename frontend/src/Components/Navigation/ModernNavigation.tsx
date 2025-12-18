"use client";

import React, { FC, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Close, KeyboardArrowDown, AccountCircle, ExitToApp } from "@mui/icons-material";
import { authService } from "@/libs/api";
import { NavigationItemType } from "@/Interfaces/BaseType";
import styles from "./ModernNavigation.module.scss";

interface ModernNavigationProps {
  items: NavigationItemType[];
}

export const ModernNavigation: FC<ModernNavigationProps> = ({ items }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userMenuOpen, setAccountCircleMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  
  const pathname = usePathname();
  const router = useRouter();

  // Check scroll position for sticky effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };
    
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  // Handle mobile menu toggle
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.style.overflow = !isMobileMenuOpen ? "hidden" : "auto";
  };

  // Handle dropdown toggle
  const toggleDropdown = (itemId: number) => {
    setActiveDropdown(activeDropdown === itemId ? null : itemId);
  };

  // Handle logout
  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setAccountCircleMenuOpen(false);
    router.push("/odjava");
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileMenuOpen && !(event.target as Element).closest(`.${styles.mobileMenu}`)) {
        setIsMobileMenuOpen(false);
        document.body.style.overflow = "auto";
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <nav className={`${styles.navigation} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoText}>MRDS</span>
        </Link>

        {/* Desktop Navigation */}
        <div className={styles.desktopNav}>
          <ul className={styles.navList}>
            {items.map((item) => (
              <li key={item.id} className={styles.navItem}>
                {item.submenu ? (
                  <div className={styles.dropdownContainer}>
                    <button
                      className={`${styles.navLink} ${pathname === item.link ? styles.active : ""}`}
                      onClick={() => toggleDropdown(item.id)}
                    >
                      {item.title}
                      <KeyboardArrowDown className={`${styles.chevron} ${activeDropdown === item.id ? styles.rotated : ""}`} />
                    </button>
                    {activeDropdown === item.id && (
                      <ul className={styles.dropdown}>
                        {item.submenu.map((subItem) => (
                          <li key={subItem.id} className={styles.dropdownItem}>
                            <Link
                              href={item.link ? `${item.link}/${subItem.link}` : subItem.link}
                              className={styles.dropdownLink}
                              onClick={() => setActiveDropdown(null)}
                            >
                              {subItem.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.link || "#"}
                    className={`${styles.navLink} ${pathname === item.link ? styles.active : ""}`}
                  >
                    {item.title}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* AccountCircle Menu */}
          <div className={styles.userSection}>
            {isLoggedIn ? (
              <div className={styles.userMenu}>
                <button
                  className={styles.userButton}
                  onClick={() => setAccountCircleMenuOpen(!userMenuOpen)}
                >
                  <AccountCircle className={styles.userIcon} />
                </button>
                {userMenuOpen && (
                  <div className={styles.userDropdown}>
                    <Link href="/profil" className={styles.userLink}>
                      Profil
                    </Link>
                    <button onClick={handleLogout} className={styles.logoutButton}>
                      <ExitToApp className={styles.logoutIcon} />
                      Odjava
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/prijava" className={styles.loginButton}>
                Prijava
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={styles.mobileMenuButton}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <Close /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileMenuContent}>
            <ul className={styles.mobileNavList}>
              {items.map((item) => (
                <li key={item.id} className={styles.mobileNavItem}>
                  {item.submenu ? (
                    <div className={styles.mobileDropdownContainer}>
                      <button
                        className={`${styles.mobileNavLink} ${pathname === item.link ? styles.active : ""}`}
                        onClick={() => toggleDropdown(item.id)}
                      >
                        {item.title}
                        <KeyboardArrowDown className={`${styles.chevron} ${activeDropdown === item.id ? styles.rotated : ""}`} />
                      </button>
                      {activeDropdown === item.id && (
                        <ul className={styles.mobileDropdown}>
                          {item.submenu.map((subItem) => (
                            <li key={subItem.id} className={styles.mobileDropdownItem}>
                              <Link
                                href={item.link ? `${item.link}/${subItem.link}` : subItem.link}
                                className={styles.mobileDropdownLink}
                                onClick={() => {
                                  setActiveDropdown(null);
                                  setIsMobileMenuOpen(false);
                                  document.body.style.overflow = "auto";
                                }}
                              >
                                {subItem.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.link || "#"}
                      className={`${styles.mobileNavLink} ${pathname === item.link ? styles.active : ""}`}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        document.body.style.overflow = "auto";
                      }}
                    >
                      {item.title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            {/* Mobile AccountCircle Section */}
            <div className={styles.mobileAccountCircleSection}>
              {isLoggedIn ? (
                <div className={styles.mobileAccountCircleActions}>
                  <Link
                    href="/profil"
                    className={styles.mobileAccountCircleLink}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      document.body.style.overflow = "auto";
                    }}
                  >
                    <AccountCircle className={styles.mobileAccountCircleIcon} />
                    Profil
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                      document.body.style.overflow = "auto";
                    }}
                    className={styles.mobileLogoutButton}
                  >
                    <ExitToApp className={styles.mobileLogoutIcon} />
                    Odjava
                  </button>
                </div>
              ) : (
                <Link
                  href="/prijava"
                  className={styles.mobileLoginButton}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    document.body.style.overflow = "auto";
                  }}
                >
                  Prijava
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
