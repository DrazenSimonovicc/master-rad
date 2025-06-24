"use client";

import { Header } from "@/Components/Header/Header";
import { SidebarWrapper } from "@/Components/Layout/Sidebar/SidebarWrapper";
import { Footer } from "@/Components/Footer";

import styles from "./page.module.scss";

const Announcements = () => {
  const breadcrumbItems = {
    level1: "Početak",
    level2: "Dražen Simonović",
    level1url: "/",
    level2url: "/drazen-simonovic",
  };

  return (
    <div>
      <Header
        title="Važna obaveštenja"
        imageUrl="/news.jpg"
        breadcrumbItems={breadcrumbItems}
      />

      <section className={styles.container}>
        <div className={styles.referencesWrap}>
          <h1 className={styles.heading}>Biografija</h1>
          <div className={styles.section}>
            <p>
              Dražen Simonović rođen je 18. novembra 1993. godine u Kruševcu, od
              oca Radeta i majke Danijele. Oženjen je suprugom Marijom i ima
              mlađeg brata Dalibora.
            </p>
            <p>
              Osnovnu i srednju školu završio je u Varvarinu. Fakultet
              pedagoških nauka u Jagodini završio je 2021. godine. 2018. godine
              stekao je znanje Operativnog sportskog menadžera na Fakultetu za
              sport Univerziteta „Union – Nikola Tesla“ u Beogradu.
            </p>
          </div>

          <div className={styles.section}>
            <h2>Aktivnosti i dostignuća</h2>
            <ul>
              <li>Organizator je nekoliko humanitarnih događaja.</li>
              <li>
                Autor je filma „Neki novi klinci“ povodom 40. rođendana
                Košarkaškog kluba Temnić.
              </li>
              <li>
                Dobitnik plakete Opštine Varvarin za doprinos razvoju košarke
                (2018).
              </li>
              <li>
                Proglašen za najboljeg sportskog radnika od strane Sportskog
                saveza Varvarin (2019).
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>Profesionalno iskustvo</h2>
            <ul>
              <li>Predsednik i trener KK „Temnić“ (2016–2020).</li>
              <li>
                Generalni sekretar Sportskog saveza Opštine Varvarin
                (2020–2021).
              </li>
              <li>
                Pomoćnik direktora za sportsko-rekreativne aktivnosti u
                Sportskom centru „Temnić“ u Varvarinu (2021–2023).
              </li>
              <li>
                Trenutno radi kao frontend developer u firmi „Omnifiko creative
                lab DOO“.
              </li>
            </ul>
          </div>
        </div>
        <aside className={styles.sidebarWrap}>
          <SidebarWrapper />
        </aside>
      </section>
      <Footer />
    </div>
  );
};

export default Announcements;
