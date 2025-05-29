"use client";

import { Header } from "@/Components/Header/Header";
import React from "react";
import styles from "./page.module.scss";
import { SidebarWrapper } from "@/Components/Layout/Sidebar/SidebarWrapper";
import { useSearchParams } from "next/navigation";
import { useFetchActivity } from "@/Hooks/Activity/getActivity";
import { Title } from "@/Components/Texts/Title";
import { useAuth } from "@/Hooks/useAuth";

const SingleActivity = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  const title = searchParams.get("title") || "";
  const breadCrumb = {
    level1: "Početak",
    level2: "Kalendar aktivnosti",
    level3: `${title}`,
    level1url: "/",
    level2url: "/kalendar-aktivnosti",
  };

  const { userData, isLoggedIn } = useAuth();

  const {
    activity,
    error: operativeError,
    loading: operativeLoading,
  } = useFetchActivity(userData?.id);

  const filteredActivity = activity.filter((plan) => plan.id === id);

  return (
    <div>
      <div>
        <Header
          title={`${title}`}
          imageUrl={"/forum-1.jpg"}
          breadcrumbItems={breadCrumb}
        />

        <section className={styles.container}>
          <div className={styles.referencesWrap}>
            {filteredActivity.map((activity) => (
              <div key={activity.id} className={styles.activityWrap}>
                <div className={styles.typeOfActivity}>
                  {activity.type_of_activity}
                </div>
                <Title
                  level={3}
                  text={activity.title}
                  className={styles.title}
                />
                <div className={styles.afterTitle}>
                  <span>{activity.date}</span>
                  <span>{activity.place}</span>
                </div>
                <div
                  className={styles.description}
                  dangerouslySetInnerHTML={{ __html: activity.description }}
                />
              </div>
            ))}
          </div>
          <aside className={styles.sidebarWrap}>
            <SidebarWrapper />
          </aside>
        </section>
      </div>
    </div>
  );
};

export default SingleActivity;
