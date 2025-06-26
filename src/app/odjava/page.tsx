import { FC } from "react";

import { Description } from "@/Components/Texts/Description";
import { Button } from "@/Components/Button";

import styles from "./page.module.scss";

const LogoutPage: FC = () => {
  return (
    <div className={styles.loginPage}>
      <div className={styles.leftSide}>
        <img src={"/loginPage/registration.jpg"} alt={"odjava"} />
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
