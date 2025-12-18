"use client";

import React, { useState } from "react";
import Pagination from "@mui/material/Pagination";
import { AnnouncementLink } from "@/Components/AnnouncementLink/AnnouncementLink";
import { PageHeader } from "@/Components/Navigation/PageHeader";
import { SidebarWrapper } from "@/Components/Layout/Sidebar/SidebarWrapper";
import Preloader from "@/Components/Preloader/Preloader";
import { Title } from "@/Components/Texts/Title";
import { useFetchAnnouncements } from "@/Hooks/Announcements/getAnnouncements";
import styles from "./page.module.scss";

const Announcements = () => {

  const {
    announcements = [],
    error: onError,
    loading: onLoading,
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
      <PageHeader />
      <section className={styles.container}>
        <div className={styles.referencesWrap}>
          <Title text="Važna obaveštenja" level={2} className={styles.title} />

          <div className={styles.announcementList}>
            {currentAnnouncements
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
              )
              .map((announcement) => (
                <AnnouncementLink
                  key={announcement.id}
                  link={`/vazna-obavestenja/${announcement.id}`}
                  title={announcement.title}
                  date={announcement.date}
                  description={announcement.description}
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
    </div>
  );
};

export default Announcements;
