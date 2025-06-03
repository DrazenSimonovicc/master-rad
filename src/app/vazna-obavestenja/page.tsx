"use client";

import React, { useState } from "react";
import Pagination from "@mui/material/Pagination";

import { Header } from "@/Components/Header/Header";
import { SidebarWrapper } from "@/Components/Layout/Sidebar/SidebarWrapper";
import { Title } from "@/Components/Texts/Title";

import styles from "./page.module.scss";
import { useFetchAnnouncements } from "@/Hooks/Announcements/getAnnouncements";
import Preloader from "@/Components/Preloader/Preloader";
import { AnnouncementLink } from "@/Components/AnnouncementLink/AnnouncementLink";
import { Footer } from "@/Components/Footer";

const Announcements = () => {
  const breadcrumbItems = {
    level1: "Početak",
    level2: "Važna obaveštenja",
    level1url: "/",
    level2url: "/vazna-obavestenja",
  };

  const {
    announcements = [],
    error: onError,
    loading: onLoading,
    refetch: refetchActivity,
  } = useFetchAnnouncements();

  const [page, setPage] = useState(1);

  if (onLoading) {
    return <Preloader page />;
  }

  if (onError) return <div>Greška u učitavanju {onError}</div>;

  const perPage = 12;
  const totalPages = Math.ceil(announcements.length / perPage);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const currentAnnouncements = announcements.slice(
    (page - 1) * perPage,
    page * perPage,
  );

  return (
    <div>
      <Header
        title="Važna obaveštenja"
        imageUrl="/news.jpg"
        breadcrumbItems={breadcrumbItems}
      />

      <section className={styles.container}>
        <div className={styles.referencesWrap}>
          <Title text="Važna obaveštenja" level={2} className={styles.title} />

          <div className={styles.announcementList}>
            {currentAnnouncements.map((announcement) => (
              <AnnouncementLink
                key={announcement.id}
                link={`/vazna-obavestenja/${announcement.id}`}
                title={announcement.title}
                date={announcement.date}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className={styles.paginationWrap}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
              />
            </div>
          )}
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
