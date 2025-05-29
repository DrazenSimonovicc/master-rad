import React, { FC } from "react";
import { Sidebar } from "@/Components/Layout/Sidebar/Sidebar";
import { sidebarData } from "@/Components/Layout/Sidebar/mockedData";

export const SidebarWrapper: FC = () => {
  return (
    <div>
      <Sidebar
        data={sidebarData}
        text={
          "Obrazovanje učitelja u Jagodini traje više od jednog veka. Svojim trudom i zalaganjem očuvali smo tradiciju obrazovanja kvalitetnih nastavnika, kao i bogatog kulturno-umetničkog, stvaralačkog i sportskog života. U isto vreme održavamo korak sa svim promenama u oblasti obrazovanja sa željom da uskoro u tome prednjačimo. Savremeno opremljene slušaonice i učionice, centar za učenje, moderno opremljene jezičke laboratorije, dobro opremljena biblioteka doprinose dobrim rezultatima koje ostvarujemo u obrazovanju učitelja i vaspitača. Na taj način naš fakultet stvara visokostručne, moderne, svestrane, kreativne, inventivne i komunikativne učitelje koji će svojim radom dati veliki doprinos obrazovanju budućih naraštaja."
        }
        mainTitle={"Najvažniji partneri"}
        contactTitle={"Podaci o studentu"}
        expertsTitle={"O Fakultetu pedagoških nauka"}
      />
    </div>
  );
};
