"use client";

import ReactModal from "react-modal";
import { FC, JSX, useCallback, useEffect, useState } from "react";
import { CancelRounded } from "@mui/icons-material";
import { Description } from "@/Components/Texts/Description";
import { Title } from "@/Components/Texts/Title";
import clsx from "clsx";
import styles from "./Modal.module.scss";

//TODO:Treba da se sredi da kada je ovoren da sticky ne utice na njega, da bude veci za index ovde

export interface ModalProps extends ReactModal.Props {
  title: string | JSX.Element;
  description?: string;
  setIsOpen?: (isOpen: boolean) => void;
  setIsCancelModalOpen?: (v: boolean) => void;
  className?: string;
  closeIcon?: JSX.Element;
  theme?: "halfScreen" | "smallPadding";
  setContentRef?: (ref: HTMLDivElement) => void;
}

export const Modal: FC<ModalProps> = ({
  title,
  description,
  isOpen,
  setIsOpen,
  children,
  setIsCancelModalOpen,
  className,
  closeIcon = <CancelRounded />,
  theme,
  setContentRef,
}) => {
  const [isOpenLocal, setIsOpenLocal] = useState(isOpen);

  const onClose = useCallback(() => {
    if (setIsCancelModalOpen) {
      setIsCancelModalOpen(true);
    } else {
      setIsOpenLocal(false);
      if (setIsOpen) {
        setIsOpen(false);
      }
    }
  }, [setIsCancelModalOpen, setIsOpen]);

  useEffect(() => {
    setIsOpenLocal(isOpen);
  }, [isOpen]);

  return (
    <ReactModal
      isOpen={isOpen || isOpenLocal}
      closeTimeoutMS={300}
      onRequestClose={onClose}
      ariaHideApp={false}
      className={clsx(
        styles.modal,
        { [styles[theme || "defaultTheme"]]: theme },
        className,
      )}
      overlayClassName={styles.overlay}
      htmlOpenClassName="ReactModal__Html--open"
      contentRef={setContentRef}
    >
      <div className={styles.header}>
        <div className={clsx(styles.title, "title")}>
          <button onClick={onClose} className={styles.icon}>
            {closeIcon}
          </button>
          {typeof title === "string" ? <Title text={title} level={4} /> : title}
        </div>
        {description && <Description text={description} />}
        <div className={styles.content}>{children}</div>
      </div>
    </ReactModal>
  );
};
