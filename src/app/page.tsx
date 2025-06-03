"use client";

import { Footer } from "@/Components/Footer/Footer";
import { TitleWithDescription } from "@/Components/Texts/TitleWithDescription/TitleWithDescription";
import React from "react";

import styles from "./page.module.scss";
import { CardsWithIcons } from "@/Components/CardsWithIcons/CardsWithIcons";
import { TextWithImage } from "@/Components/TextWithImageHomepage/TextWithImage";
import { ImageCard } from "@/Components/Card/ImageCard/ImageCard";
import HeroSlider from "@/Components/Hero/Hero";
import { heroData } from "@/Components/Hero/mockedData";

export default function Home() {
  const breadCrumb = {
    level1: "Početak",
    level2: "Profil",
    level1url: "/",
    level2url: "/profil",
  };

  return (
    <div style={{ backgroundColor: "#F5F5FC" }}>
      <HeroSlider data={heroData} />

      <div>
        <TextWithImage
          text={
            "Moj master rad je softver koji će pomoći u tradicionalnim i online školama. Dizajniran je da podrži nastavnike u planiranju i realizaciji nastave, praćenju napretka učenika, kao i u komunikaciji sa roditeljima i učenicima. Bez obzira da li se nalazite u fizičkoj učionici ili radite na daljinu, ovaj alat omogućava jednostavno kreiranje zadataka, kvizova, izveštaja i prilagođenih aktivnosti za svaki uzrast. Cilj mi je bio da nastavnicima olakšam svakodnevni rad, a učenicima pružim interaktivan i podsticajan način učenja. Ovaj softver nije samo tehničko rešenje — on je nastavna podrška u skladu sa savremenim obrazovnim potrebama."
          }
          otherTitle
          titlePartOne={"Učionica nove generacije: "}
          titlePartTwo={"sve na jednom mestu"}
          imageUrl={"/homepageImage.jpg"}
          linkUrl={"/"}
        />
      </div>

      <div className={styles.backgroundWorkDescription}>
        <div className={styles.workDescription}>
          <div className={styles.frontPageTitleAndDescription}>
            <h2 className={styles.title}>Čemu služi ovaj rad?</h2>
            <p className={styles.description}>
              Ovaj rad će omogućiti nastavniima da kreiraju online svoje
              pripreme, koje će moći skladištiti u svojim materijalima. Takođe,
              ovde će moći da razmenjuju iskustva sa drugim nastavnicima.
            </p>
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
      </div>

      <div className={styles.thirdPart}>
        <TitleWithDescription
          title={"Sve-u-jednom softver za školu"}
          text={
            "Moj master rad je softver koji omogućava korišćenje različitih alata potrebnih za uspešan rad u nastavi — bilo u učionici ili online.\n" +
            "Pruža jednostavan pristup planiranju časova, upravljanju nastavnim materijalima, komunikaciji sa kolegama, kao i praćenju napretka učenika. Sve na jednom mestu, sa ciljem da olakša i unapredi obrazovni proces."
          }
        />
        <div className={styles.cardsWrapper}>
          <CardsWithIcons />
        </div>
      </div>

      <Footer />
    </div>
  );
}
