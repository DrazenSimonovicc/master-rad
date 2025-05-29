import { FC } from "react";

import styles from "./page.module.scss";

import Link from "next/link";
import { Description } from "@/Components/Texts/Description";
import { Button } from "@/Components/Button";

//TODO: Urediti stranicu

const LogoutPage: FC = () => {
  return (
    <div className={styles.loginPage}>
      <div className={styles.leftSide}>
        <img src={"/loginPage/registration.jpg"} alt={"logout"} />
      </div>

      <div className={styles.rightSide}>
        <Description text={"Uspesno ste izlogovani..."} />

        <Button
          themes={["standardHeight", "maxWidth", "blue"]}
          title={"Nazad na početnu stranicu"}
          linkTo={"/"}
        />
      </div>
    </div>
  );
};

export default LogoutPage;
