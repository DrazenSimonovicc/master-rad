"use client";

import React from "react";
import { CardsWithIcons } from "@/Components/CardsWithIcons/CardsWithIcons";
import { Footer } from "@/Components/Footer/Footer";
import HeroSlider from "@/Components/Hero/Hero";
import { heroData } from "@/Components/Hero/mockedData";
import { TextWithImage } from "@/Components/TextWithImageHomepage/TextWithImage";
import { TitleWithDescription } from "@/Components/Texts/TitleWithDescription/TitleWithDescription";
import { WorkDescription } from "@/Components/WorkDescription/WorkDescription";
import styles from "./page.module.scss";

export default function Home() {
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
        <WorkDescription
          title={"Čemu služi ovaj rad?"}
          text={
            "Ovaj rad će omogućiti nastavniima da kreiraju online svoje pripreme, koje će moći skladištiti u svojim materijalima. Takođe, ovde će moći da razmenjuju iskustva sa drugim nastavnicima."
          }
        />
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
