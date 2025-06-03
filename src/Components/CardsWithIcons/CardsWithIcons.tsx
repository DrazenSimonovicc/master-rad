import React, { FC } from "react";

import styles from "./CardsWithIcons.module.scss";
import { IconCard } from "@/Components/Card/IconCard/IconCard";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import ForumIcon from "@mui/icons-material/Forum";
import GroupsIcon from "@mui/icons-material/Groups";

export const CardsWithIcons: FC = ({}) => (
  <div className={styles.iconWrapper}>
    <IconCard
      title={"Forum"}
      description="Povežite se sa kolegama kroz razmenu znanja, ideja i iskustava na forumu."
      linkUrl={"/forum"}
      icon={<TextSnippetIcon />}
      className={styles.iconLightBlue}
    />
    <IconCard
      title={"Važna obaveštenja"}
      description="Pratite najnovije vesti i saopštenja Ministarstva prosvete na jednom mestu."
      linkUrl={"/vazna-obavestenja"}
      icon={<ForumIcon />}
      className={styles.iconPurple}
    />
    <IconCard
      title={"Online obuke"}
      description="Usavršavajte se kroz online obuke i razvijajte profesionalne kompetencije iz udobnosti svog doma."
      linkUrl={"/online-obuke"}
      icon={<GroupsIcon />}
      className={styles.iconBlue}
    />
  </div>
);
