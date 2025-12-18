"use client";

import React from "react";
import { School, People, MenuBook, Public } from "@mui/icons-material";
import styles from "./ModernHero.module.scss";

interface ModernHeroProps {
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  features: {
    icon: React.ReactNode;
    text: string;
  }[];
}

export const ModernHero: React.FC<ModernHeroProps> = ({
  title,
  subtitle,
  description,
  imageUrl,
  imageAlt,
  features
}) => {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroContent}>
        <div className={styles.heroText}>
          <h1 className={styles.heroTitle}>
            {title}
          </h1>
          <p className={styles.heroSubtitle}>
            {subtitle}
          </p>
          <p className={styles.heroDescription}>
            {description}
          </p>
          <div className={styles.heroFeatures}>
            {features.map((feature, index) => (
              <div key={index} className={styles.featureItem}>
                {feature.icon}
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.heroImage}>
          <div className={styles.blueSquare}></div>
          <div className={styles.greenSquare}></div>
          <img src={imageUrl} alt={imageAlt} className={styles.heroImg} />
        </div>
      </div>
    </section>
  );
};






