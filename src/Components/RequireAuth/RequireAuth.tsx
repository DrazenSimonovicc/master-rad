"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/Components/Button";
import styles from "./RequireAuth.module.scss";

const RequireAuth = () => {
  const router = useRouter();

  return (
    <div className={styles.loginOverlay}>
      <div className={styles.loginPrompt}>
        <p>Morate biti prijavljeni da biste pristupili ovom sadržaju.</p>
        <div className={styles.buttonsWrap}>
          <Button
            title="Povratak na početnu stranicu"
            themes={["blue", "maxWidth", "standardHeight", "noBorderRadius"]}
            onClick={() => router.push("/")}
          />
          <Button
            title="Prijavi se"
            themes={["blue", "maxWidth", "standardHeight", "noBorderRadius"]}
            onClick={() => router.push("/prijava")}
          />
        </div>
      </div>
    </div>
  );
};

export default RequireAuth;
