"use client";
import React, { FC, useEffect, useState } from "react";
import styles from "./Sidebar.module.scss";
import clsx from "clsx";

import { ImageType } from "@/Interfaces/BaseType";
import { Title } from "@/Components/Texts/Title";
import { useFetchFooter } from "@/Hooks/getFooterData";
import Link from "next/link";

interface PhotoSwipeItemType {
  linkTo: string;
  thumbnailUrl: string;
  alt: string;
  width?: number;
  height?: number;
}

interface SidebarProps {
  className?: string;
  text?: string;
  data?: SidebarType;
  expertsTitle: string;
  contactTitle: string;
  mainTitle?: string;
  searchSidebar?: boolean;
}

interface SidebarType {
  images?: PhotoSwipeItemType[];
  sliderImages?: ImageType[];
}

export const Sidebar: FC<SidebarProps> = ({
  className,
  data = {},
  text,
  expertsTitle,
  contactTitle,
  mainTitle,
  searchSidebar,
}) => {
  const [index, setIndex] = React.useState<number>(-1);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);

  const { footerData, error, loading } = useFetchFooter();

  if (loading) return <div>loading</div>;
  if (error) return <div>error: {error}</div>;

  return (
    <div className={clsx(styles.container, className)}>
      {mainTitle && (
        <div className={styles.titleWrap}>
          <Title
            text={mainTitle}
            themes={["underline", "bold"]}
            level={3}
            className={styles.title}
          />
        </div>
      )}

      {!searchSidebar && (
        <>
          <div className={styles.gallery}>
            {data.images?.map((item, imageIndex) => (
              <Link
                key={imageIndex}
                className={styles.imageWrap}
                href={item.linkTo}
              >
                <picture>
                  <img
                    src={item.thumbnailUrl}
                    alt={item.alt}
                    className={styles.image}
                  />
                </picture>
              </Link>
            ))}
          </div>
        </>
      )}

      <div className={styles.titleWrap}>
        <Title
          text={expertsTitle}
          themes={["underline", "bold"]}
          level={3}
          className={styles.title}
        />
      </div>

      <div className={styles.text}>{text}</div>

      <div className={styles.titleWrap}>
        <Title
          text={contactTitle}
          themes={["underline", "bold"]}
          level={3}
          className={styles.title}
        />
        {footerData.map((data, index) => (
          <div key={index} className={styles.contactInfoWrap}>
            <div>
              {data.expand.personal.first_name} {data.expand.personal.last_name}
            </div>
            <div> {data.expand.personal.title}</div>
            <div>{data.subject}</div>
            <div>{data.theme}</div>
          </div>
        ))}
      </div>
      {/*

      {searchSidebar && <Newsletter subscribeButton={handleSubscribe} />}

*/}
      {/*<ContactInfo data={companyData} theme={"sidebar"} />*/}
    </div>
  );
};
