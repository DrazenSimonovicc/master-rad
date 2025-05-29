"use client";
import { FC, useEffect } from "react";
import styles from "./Header.module.scss";
import clsx from "clsx";
import Image, { StaticImageData } from "next/image";
import { Breadcrumb } from "@/Components/Header/Breadcrumb/Breadcrumb";
import { Navigation } from "@/Components/Navigation/Navigation";
import { CustomNavigationData } from "@/Components/Navigation/mockedData";
import { Title } from "@/Components/Texts/Title";
import { BreadcrumbItemType } from "@/Interfaces/BaseType";

type themeType = "bigHeader" | "mediumHeader";

interface HeaderProps {
  className?: string;
  imageUrl: string | StaticImageData;
  title?: string;
  secondTitle?: string;
  breadcrumbItems: BreadcrumbItemType;
  search?: boolean;
  expertTeam?: boolean;
  positionTitle?: string[];
  themes?: themeType;
  objectPage?: boolean;
}

export const Header: FC<HeaderProps> = ({
  className,
  imageUrl,
  title,
  secondTitle,
  breadcrumbItems,
  expertTeam,
  positionTitle,
  themes,
  objectPage,
  search,
}) => {
  useEffect(() => {
    document.title = `${secondTitle ? `${title} | ${secondTitle} ` : title} — Master rad Dražen Simonović`;
  }, [secondTitle, title]);

  return (
    <div>
      <div className={styles.navigation}>
        <Navigation items={CustomNavigationData} />
      </div>
      <div
        className={clsx(
          styles.header,
          { [styles.headerExpertTeam]: expertTeam },
          { [styles.bigHeader]: themes === "bigHeader" },
          { [styles.mediumHeader]: themes === "mediumHeader" },
          objectPage && styles.objectPage,
          className,
        )}
      >
        <div className={styles.imageWrap}>
          <Image
            src={imageUrl}
            alt={"Header slika"}
            className={styles.image}
            fill
          />
        </div>

        <div className={styles.content}>
          {title && <Title text={title} level={1} className={styles.title} />}
          {secondTitle && (
            <Title className={styles.title} level={2} text={secondTitle} />
          )}
          {expertTeam && (
            <div className={styles.subTitle}>
              {positionTitle?.map((pt, index) => <span key={index}>{pt}</span>)}
            </div>
          )}
          <Breadcrumb
            items={breadcrumbItems}
            className={styles.breadcrumbItems}
            search={search}
          />
        </div>
      </div>
    </div>
  );
};
