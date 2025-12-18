"use client";

import React, { FC, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Close, KeyboardArrowDown, AccountCircle, ExitToApp } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { authService } from "@/libs/api";
import { NavigationItemType } from "@/Interfaces/BaseType";
import styles from "./SimpleNavigation.module.scss";

interface SimpleNavigationProps {
  items: NavigationItemType[];
}

export const SimpleNavigation: FC<SimpleNavigationProps> = ({ items }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  
  const pathname = usePathname();
  const router = useRouter();

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("auth_token");
      const isLoggedIn = !!token;
      console.log("Auth check:", { token: !!token, isLoggedIn });
      setIsLoggedIn(isLoggedIn);
    };
    
    checkAuth();
    
    // Listen for storage changes (login/logout from other tabs)
    window.addEventListener("storage", checkAuth);
    
    // Listen for focus events (when user returns to tab)
    window.addEventListener("focus", checkAuth);
    
    // Custom event for login/logout
    const handleAuthChange = () => {
      checkAuth();
    };
    
    window.addEventListener("auth-change", handleAuthChange);
    
    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("focus", checkAuth);
      window.removeEventListener("auth-change", handleAuthChange);
    };
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
    setUserMenuOpen(false);
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent("auth-change"));
    router.push("/odjava");
  };

  return (
    <nav className={styles.navigation}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          MRDS
        </Link>

        {/* Desktop Navigation */}
        <div className={styles.desktopNav}>
          <ul className={styles.navList}>
            {items.map((item) => (
              <li key={item.id} className={styles.navItem}>
                {item.submenu ? (
                  <div 
                    className={styles.dropdownContainer}
                    onMouseEnter={() => setActiveDropdown(item.id)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link
                      href={item.link || "#"}
                      className={`${styles.navLink} ${pathname === item.link ? styles.active : ""}`}
                    >
                      {item.title}
                      <KeyboardArrowDown className={`${styles.chevron} ${activeDropdown === item.id ? styles.rotated : ""}`} />
                    </Link>
                    {activeDropdown === item.id && (
                      <ul className={styles.dropdown}>
                        {item.submenu.map((subItem) => (
                          <li key={subItem.id} className={styles.dropdownItem}>
                            <Link
                              href={item.link ? `${item.link}/${subItem.link}` : subItem.link}
                              className={styles.dropdownLink}
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

          {/* User Menu */}
          <div className={styles.userSection}>
            {isLoggedIn ? (
              <div className={styles.userMenu}>
                <button
                  className={styles.userButton}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <AccountCircle />
                </button>
                {userMenuOpen && (
                  <div className={styles.userDropdown}>
                    <button 
                      onClick={() => router.push("/profil")} 
                      className={styles.userLink}
                    >
                      <AccountCircle />
                      Profil
                    </button>
                    <button onClick={handleLogout} className={styles.logoutButton}>
                      <ExitToApp />
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
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className={styles.mobileMenu}
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className={styles.mobileMenuContent}>
              {/* Close Button */}
              <button
                className={styles.mobileCloseButton}
                onClick={toggleMobileMenu}
                aria-label="Close mobile menu"
              >
                <Close />
              </button>
              
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

            {/* Mobile User Section */}
            <div className={styles.mobileUserSection}>
              {isLoggedIn ? (
                <div className={styles.mobileUserActions}>
                  <Link
                    href="/profil"
                    className={styles.mobileUserLink}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      document.body.style.overflow = "auto";
                    }}
                  >
                    <AccountCircle />
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
                    <ExitToApp />
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
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
