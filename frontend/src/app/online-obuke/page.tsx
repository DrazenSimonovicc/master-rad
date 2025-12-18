"use client";

import React from "react";
import { PageHeader } from "@/Components/Navigation/PageHeader";
import { SidebarWrapper } from "@/Components/Layout/Sidebar/SidebarWrapper";
import TeacherSitesGrid from "@/Components/TeacherSiteGrid/TeacherSiteGrid";
import { Title } from "@/Components/Texts/Title";
import styles from "./page.module.scss";

const Announcements = () => {

  return (
    <div>
      <PageHeader />

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
