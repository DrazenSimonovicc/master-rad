"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PageHeader } from "@/Components/Navigation/PageHeader";
import { SidebarWrapper } from "@/Components/Layout/Sidebar/SidebarWrapper";
import Preloader from "@/Components/Preloader/Preloader";
import { Title } from "@/Components/Texts/Title";
import { AnnouncementsType } from "@/Interfaces/BaseType";
import { announcementService } from "@/libs/api";
import styles from "./page.module.scss";

const Announcement = () => {
  const { id } = useParams();
  const [announcement, setAnnouncement] = useState<AnnouncementsType | null>(
    null,
  );

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const data = await announcementService.getById(id as string);
        setAnnouncement(data);
      } catch (err) {
        console.error("Failed to fetch announcement", err);
      }
    };

    if (id) fetchAnnouncement();
  }, [id]);

  if (!announcement) {
    return <Preloader page />;
  }


  return (
    <div>
      <PageHeader />
      <section className={styles.container}>
        <div className={styles.referencesWrap}>
          <Title level={2} text={announcement.title} className={styles.title} />

          <span className={styles.date}>
            <strong>Datum:</strong> {announcement.date}
          </span>

          <div
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: announcement.description || "" }}
          />

          {announcement.link1 && (
            <Link
              href={announcement.link1}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              {announcement.link1description || announcement.link1}
            </Link>
          )}

          {announcement.link2 && (
            <Link
              href={announcement.link2}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              {announcement.link2description || announcement.link2}
            </Link>
          )}
        </div>

        <aside className={styles.sidebarWrap}>
          <SidebarWrapper />
        </aside>
      </section>
    </div>
  );
};

export default Announcement;
