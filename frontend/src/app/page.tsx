"use client";

import React from "react";
import { CardsWithIcons } from "@/Components/CardsWithIcons/CardsWithIcons";
import { TextWithImage } from "@/Components/TextWithImageHomepage/TextWithImage";
import { TitleWithDescription } from "@/Components/Texts/TitleWithDescription/TitleWithDescription";
import { WorkDescription } from "@/Components/WorkDescription/WorkDescription";
import { ModernHero } from "@/Components/Hero";
import { School, People, MenuBook, Public } from "@mui/icons-material";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <div style={{ backgroundColor: "#F5F5FC" }}>
      {/* Modern Hero Section */}
      <ModernHero
        title="Učionica nove generacije"
        subtitle="Sve na jednom mestu - moderni pristup obrazovanju"
        description="Softver koji omogućava nastavnicima da kreiraju online pripreme, skladište materijale i razmenjuju iskustva sa kolegama. Podržava i tradicionalnu i online nastavu."
        imageUrl="/homepageImage.jpg"
        imageAlt="Modern classroom"
        features={[
          {
            icon: <School className={styles.featureIcon} />,
            text: "Planiranje časova"
          },
          {
            icon: <People className={styles.featureIcon} />,
            text: "Komunikacija sa roditeljima"
          },
          {
            icon: <MenuBook className={styles.featureIcon} />,
            text: "Upravljanje materijalima"
          },
          {
            icon: <Public className={styles.featureIcon} />,
            text: "Online i tradicionalna nastava"
          }
        ]}
      />


      <div className={styles.thirdPart}>

      </div>

    </div>
  );
}
