import React from "react";
import { Button } from "@/Components/Button";
import styles from "./DeleteConfirmationModal.module.scss";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  title?: string;
  description?: string;
  onConfirm: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  setIsOpen,
  title = "Potvrda brisanja",
  description = "Da li ste sigurni da želite da obrišete ovaj stavku?",
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={() => setIsOpen(false)}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <h2>{title}</h2>
        <p>{description}</p>

        <div className={styles.buttons}>
          <Button
            title="Otkaži"
            themes={["blue", "maxWidth", "standardHeight", "noBorderRadius"]}
            onClick={() => setIsOpen(false)}
          />
          <Button
            title="Obriši"
            themes={["blue", "maxWidth", "standardHeight", "noBorderRadius"]}
            onClick={onConfirm}
          />
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
