import React, { FC } from "react";

import styles from "./ProfileInfoDescription.module.scss";

interface ProfileInfoDescriptionProps {
  title: string;
  description: string;
}

export const ProfileInfoDescription: FC<ProfileInfoDescriptionProps> = ({
  title,
  description,
}) => (
  <div className={styles.profileInfo}>
    <strong>{title} </strong>
    {description}
  </div>
);
