"use client";

import React, { useState } from "react";

import Pagination from "@mui/material/Pagination";

import { Header } from "@/Components/Header/Header";
import { SidebarWrapper } from "@/Components/Layout/Sidebar/SidebarWrapper";
import { Title } from "@/Components/Texts/Title";

import styles from "./page.module.scss";

import TeacherSitesGrid from "@/Components/TeacherSiteGrid/TeacherSiteGrid";

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
        imageUrl="/forum-1.jpg"
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
    </div>
  );
};

export default Announcements;
