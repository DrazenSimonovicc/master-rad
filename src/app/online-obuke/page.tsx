"use client";

import React from "react";

import { Header } from "@/Components/Header/Header";
import { SidebarWrapper } from "@/Components/Layout/Sidebar/SidebarWrapper";
import { Title } from "@/Components/Texts/Title";

import styles from "./page.module.scss";

import TeacherSitesGrid from "@/Components/TeacherSiteGrid/TeacherSiteGrid";
import { Footer } from "@/Components/Footer";

const Announcements = () => {
  const breadcrumbItems = {
    level1: "Početak",
    level2: "Online obuke",
    level1url: "/",
    level2url: "/online-obuke",
  };

  return (
    <div>
      <Header
        title="Online obuke"
        imageUrl="/try.jpg"
        breadcrumbItems={breadcrumbItems}
      />

      <section className={styles.container}>
        <div className={styles.referencesWrap}>
          <Title
            text="Online obuke za učitelje i nastavnike"
            level={2}
            className={styles.title}
          />

          <TeacherSitesGrid />
        </div>

        <aside className={styles.sidebarWrap}>
          <SidebarWrapper />
        </aside>
      </section>
      <Footer />
    </div>
  );
};

export default Announcements;
