"use client";

import React from "react";
import styles from "./RequireAuth.module.scss";
import { useRouter } from "next/navigation";
import { Button } from "@/Components/Button";

const RequireAuth = () => {
  const router = useRouter();

  return (
    <div className={styles.loginOverlay}>
      <div className={styles.loginPrompt}>
        <p>Morate biti prijavljeni da biste pristupili ovom sadržaju.</p>
        <div className={styles.buttonsWrap}>
          <Button
            title="Povratak na početnu stranicu"
            themes={[
              "blue",
              "standardWide",
              "standardHeight",
              "noBorderRadius",
            ]}
            onClick={() => router.push("/")}
          />
          <Button
            title="Prijavi se"
            themes={[
              "blue",
              "standardWide",
              "standardHeight",
              "noBorderRadius",
            ]}
            onClick={() => router.push("/prijava")}
          />
        </div>
      </div>
    </div>
  );
};

export default RequireAuth;
