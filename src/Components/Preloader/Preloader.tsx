import React, { FC } from "react";
import styles from "./Preloader.module.scss";
import clsx from "clsx";

interface PreloaderProps {
  page?: boolean;
}

const Preloader: FC<PreloaderProps> = ({ page }) => {
  return (
    <svg
      width="64px"
      height="64px"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
      className={clsx(page ? styles.preloaderPage : styles.preloader)}
      style={{ background: "none" }}
    >
      <circle
        cx="50"
        cy="50"
        r="40"
        strokeWidth="3"
        stroke="#49bbbd"
        strokeDasharray="62.83185307179586 62.83185307179586"
        fill="none"
        strokeLinecap="round"
        transform="rotate(21 50 50)"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          calcMode="linear"
          values="0 50 50;360 50 50"
          keyTimes="0;1"
          dur="2s"
          begin="0s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
};

export default Preloader;
