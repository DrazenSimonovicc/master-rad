"use client";

import React from "react";
import Link from "next/link";
import { PageHeader } from "@/Components/Navigation/PageHeader";
import { SidebarWrapper } from "@/Components/Layout/Sidebar/SidebarWrapper";
import { Title } from "@/Components/Texts/Title";
import styles from "./page.module.scss";

const HomeworkSubjects = () => {

  return (
    <div>
      <PageHeader />

      <section className={styles.container}>
        <div className={styles.referencesWrap}>
          <Title
            text={"Operativni planovi"}
            level={2}
            className={styles.title}
          />
          <Link
            href={"/resursi-za-nastavu/priprema-za-nastavu"}
            className={styles.link}
          >
            <Title
              text={"Priprema za nastavu"}
              level={3}
              className={styles.smallTitle}
            />
          </Link>
          <Link
            href={"/resursi-za-nastavu/domaci-zadaci"}
            className={styles.link}
          >
            <Title
              text={"Domaći zadaci"}
              level={3}
              className={styles.smallTitle}
            />
          </Link>
          <Link href={"/resursi-za-nastavu/testovi"} className={styles.link}>
            <Title text={"Testovi"} level={3} className={styles.smallTitle} />
          </Link>
          <Link
            href={"/resursi-za-nastavu/operativni-i-globalni-planovi"}
            className={styles.link}
          >
            <Title
              text={"Operativni i globalni planovi"}
              level={3}
              className={styles.smallTitle}
            />
          </Link>
        </div>
        <aside className={styles.sidebarWrap}>
          <SidebarWrapper />
        </aside>
      </section>

    </div>
  );
};

export default HomeworkSubjects;
