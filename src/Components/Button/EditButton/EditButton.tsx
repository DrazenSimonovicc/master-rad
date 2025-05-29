import { FC } from "react";
import styles from "./EditButton.module.scss";
import clsx from "clsx";

import EditIcon from "@mui/icons-material/Edit";
import { Title } from "@/Components/Texts/Title";

interface ButtonProps {
  className?: string;
  onClick: () => void;
  title: string;
}

export const EditButton: FC<ButtonProps> = ({ className, title, onClick }) => {
  return (
    <div className={styles.buttonWrap}>
      <button className={clsx(styles.btn, className)} onClick={onClick}>
        <EditIcon />
      </button>

      <Title text={title} level={2} />
    </div>
  );
};
