import React, { useState } from "react";
import Pagination from "@mui/material/Pagination";
import TeacherSiteCard from "../TeacherSiteGrid/TeacherSiteCard/TeacherSiteCard";
import styles from "./TeacherSiteGrid.module.scss";

const sites = [
  {
    name: "edX",
    url: "https://www.edx.org/",
    description:
      "Kursevi vodećih univerziteta kao što su Harvard i MIT, uključujući obrazovanje i pedagogiju.",
  },
  {
    name: "Coursera",
    url: "https://www.coursera.org/",
    description:
      "Online kursevi i sertifikati iz oblasti obrazovanja i nastave, od vodećih univerziteta.",
  },
  {
    name: "FutureLearn",
    url: "https://www.futurelearn.com/",
    description:
      "Britanska platforma sa kursevima za nastavnike iz oblasti metodike, inkluzije i više.",
  },
  {
    name: "Canvas Network",
    url: "https://www.canvas.net/",
    description:
      "Obuke za nastavnike sa fokusom na digitalno obrazovanje i interaktivno učenje.",
  },
  {
    name: "Teacher Academy",
    url: "https://www.schooleducationgateway.eu/en/pub/teacher_academy.htm",
    description:
      "Evropski portal za akreditovane kurseve i webinare za obrazovne radnike.",
  },
  {
    name: "European Schoolnet Academy",
    url: "https://www.europeanschoolnetacademy.eu/",
    description: "Obuke za digitalne veštine i STEM obrazovanje u školama.",
  },
  {
    name: "Alison",
    url: "https://alison.com/",
    description:
      "Besplatni online kursevi sa opcijama sertifikata za nastavnike i obrazovne stručnjake.",
  },
  {
    name: "Udemy",
    url: "https://www.udemy.com/",
    description:
      "Kursevi za nastavnike u oblasti upravljanja učionicom, tehnologije i više.",
  },
  {
    name: "Microsoft Learn for Educators",
    url: "https://learn.microsoft.com/en-us/training/educator-center/",
    description:
      "Obuke za nastavnike o korišćenju Microsoft alata kao što su Teams i OneNote.",
  },
  {
    name: "Teach2030",
    url: "https://teach2030.com/",
    description:
      "Obuke za nastavnike u zemljama u razvoju, sa fokusom na praktične veštine.",
  },
  {
    name: "Khan Academy",
    url: "https://www.khanacademy.org/",
    description:
      "Besplatni resursi za nastavnike sa alatima za praćenje učenika i planiranje nastave.",
  },
  {
    name: "OpenLearn (The Open University)",
    url: "https://www.open.edu/openlearn/",
    description:
      "Besplatni kursevi iz obrazovanja, pedagogije i upravljanja učionicom.",
  },
  {
    name: "Google for Education Training Center",
    url: "https://edu.google.com/intl/ALL_us/teacher-center/",
    description:
      "Obuke za nastavnike o korišćenju Google alata kao što su Classroom, Docs i Forms.",
  },
  {
    name: "National Geographic Education",
    url: "https://education.nationalgeographic.org/professional-development/",
    description:
      "Programi profesionalnog razvoja za nastavnike iz oblasti geografije i nauke.",
  },
  {
    name: "PBS TeacherLine",
    url: "https://www.pbs.org/teacherline/",
    description:
      "Online kursevi i obuke za učitelje iz različitih nastavnih oblasti i veština.",
  },
  {
    name: "Common Sense Education",
    url: "https://www.commonsense.org/education/",
    description:
      "Resursi i kursevi o digitalnoj pismenosti i bezbednosti na internetu za nastavnike.",
  },
  {
    name: "Apple Teacher Learning Center",
    url: "https://education.apple.com/",
    description:
      "Besplatna obuka za korišćenje Apple tehnologija u nastavi – iPad, Mac, aplikacije.",
  },
  {
    name: "LinkedIn Learning",
    url: "https://www.linkedin.com/learning/",
    description:
      "Kurirani kursevi iz oblasti obrazovanja, komunikacije i nastavničkih veština.",
  },
  {
    name: "Teachable",
    url: "https://teachable.com/",
    description:
      "Platforma za kreiranje i pohađanje online kurseva – uključujući i za nastavnike.",
  },
  {
    name: "International Society for Technology in Education (ISTE)",
    url: "https://www.iste.org/learn/professional-learning",
    description:
      "Obuke za razvoj digitalnih nastavnih veština i inovativne prakse u obrazovanju.",
  },
];

export default function TeacherSitesGrid() {
  const [page, setPage] = useState(1);
  const perPage = 12;
  const totalPages = Math.ceil(sites.length / perPage);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const currentSites = sites.slice((page - 1) * perPage, page * perPage);

  return (
    <>
      <div className={styles.grid}>
        {currentSites.map((site) => (
          <TeacherSiteCard
            key={site.name}
            name={site.name}
            url={site.url}
            description={site.description}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className={styles.paginationWrap}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
          />
        </div>
      )}
    </>
  );
}
