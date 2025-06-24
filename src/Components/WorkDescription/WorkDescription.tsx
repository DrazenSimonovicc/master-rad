import React, { FC } from "react";
import styles from "./WorkDescription.module.scss";
import { ImageCard } from "@/Components/Card/ImageCard/ImageCard";

interface WorkDescriptionProps {
  text: string;
  title: string;
}
export const WorkDescription: FC<WorkDescriptionProps> = ({
  text,
  title,
}: WorkDescriptionProps) => (
  <div className={styles.workDescription}>
    <div className={styles.frontPageTitleAndDescription}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{text}</p>
    </div>

    <div className={styles.imageCardsWrap}>
      <ImageCard
        imageUrl={"/priprema-za-cas.jpg"}
        linkUrl={"/resursi-za-nastavu/priprema-za-nastavu"}
        title={"Online pripreme za nastavu"}
        imageDescription={"Online pripreme za nastavu fotografija"}
        buttonText={"Pripremite svoj cas"}
      />
      <ImageCard
        imageUrl={"/kalendar.jpg"}
        linkUrl={"/kalendar-aktivnosti"}
        title={"Kalendar aktivnosti"}
        imageDescription={"opis"}
        buttonText={"Prikaži sve aktivnosti"}
      />
    </div>
  </div>
);
